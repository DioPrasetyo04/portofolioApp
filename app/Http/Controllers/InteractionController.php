<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class InteractionController extends Controller
{
    public function storeComment(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'required|string|max:1000',
            'rating' => 'required|integer|min:1|max:5',
            'type' => 'required|string|in:project,certificate,news',
            'id' => 'required|integer',
        ]);

        $modelClass = match ($validated['type']) {
            'project' => \App\Models\Project::class,
            'certificate' => \App\Models\Certificate::class,
            'news' => \App\Models\News::class,
        };

        $model = $modelClass::findOrFail($validated['id']);

        $comment = $model->comments()->create([
            'name' => $validated['name'],
            'content' => $validated['content'],
            'rating' => $validated['rating'],
        ]);

        return response()->json([
            'message' => 'Comment successfully posted',
            'comment' => $comment
        ]);
    }

    public function incrementLike(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:project,certificate,news',
            'id' => 'required|integer',
        ]);

        $modelClass = match ($validated['type']) {
            'project' => \App\Models\Project::class,
            'certificate' => \App\Models\Certificate::class,
            'news' => \App\Models\News::class,
        };

        $model = $modelClass::findOrFail($validated['id']);
        
        $model->increment('likes_count');

        return response()->json([
            'message' => 'Like added',
            'likes_count' => $model->likes_count
        ]);
    }

    /**
     * Get portfolio like stats and whether current IP already liked
     */
    public function getPortfolioLikes(Request $request)
    {
        $ip = $request->ip();
        $alreadyLiked = \App\Models\PortfolioLike::where('ip_address', $ip)->exists();
        $totalLikes = \App\Models\PortfolioLike::count();

        return response()->json([
            'total_likes' => $totalLikes,
            'already_liked' => $alreadyLiked,
        ]);
    }

    /**
     * Increment portfolio like with dual anti-spam verification and email notification
     */
    public function incrementPortfolioLike(Request $request)
    {
        $ip = $request->ip();
        $userAgent = $request->userAgent();

        // 1. Anti-spam check: prevent duplicate like from same IP
        $exists = \App\Models\PortfolioLike::where('ip_address', $ip)->exists();
        if ($exists) {
            return response()->json([
                'message' => 'You have already liked this portfolio.',
                'already_liked' => true,
                'total_likes' => \App\Models\PortfolioLike::count(),
            ], 409);
        }

        // 2. Persist new unique like record
        try {
            \App\Models\PortfolioLike::create([
                'ip_address' => $ip,
                'user_agent' => $userAgent,
            ]);
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            return response()->json([
                'message' => 'You have already liked this portfolio.',
                'already_liked' => true,
                'total_likes' => \App\Models\PortfolioLike::count(),
            ], 409);
        }

        $totalLikes = \App\Models\PortfolioLike::count();

        // 3. Dispatch Email Notification gracefully
        try {
            $recipient = env('ADMIN_NOTIFICATION_EMAIL')
                ?: env('MAIL_USERNAME')
                ?: (config('mail.from.address') ?: 'admin@portfolio.test');

            \Illuminate\Support\Facades\Mail::to($recipient)->send(
                new \App\Mail\PortfolioLikedMail(
                    ipAddress: $ip,
                    userAgent: $userAgent,
                    totalLikes: $totalLikes,
                    likedAt: now()->format('D, d M Y H:i:s T')
                )
            );
        } catch (\Throwable $e) {
            Log::warning('Failed to dispatch portfolio liked email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Thank you for liking my portfolio!',
            'total_likes' => $totalLikes,
            'already_liked' => true,
        ]);
    }
}

