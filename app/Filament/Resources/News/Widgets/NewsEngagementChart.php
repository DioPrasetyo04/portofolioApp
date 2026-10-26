<?php

namespace App\Filament\Resources\News\Widgets;

use App\Models\Comment;
use App\Models\News;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Str;

class NewsEngagementChart extends ChartWidget
{
    protected ?string $heading = 'Articles Engagement & Reader Interest';

    protected ?string $description = 'Likes and comment feedback across published articles';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $articles = News::latest()->take(6)->get();

        $labels = [];
        $likes = [];
        $comments = [];

        foreach ($articles as $article) {
            $title = is_array($article->title)
                ? ($article->title[app()->getLocale()] ?? reset($article->title) ?? 'Article')
                : ($article->title ?: 'Article');

            $labels[] = Str::limit((string) $title, 20);
            $likes[] = (int) $article->likes_count;
            $comments[] = Comment::where('commentable_type', News::class)
                ->where('commentable_id', $article->id)
                ->count();
        }

        if (empty($labels)) {
            $labels = ['No Articles Yet'];
            $likes = [0];
            $comments = [0];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Likes',
                    'data' => $likes,
                    'backgroundColor' => 'rgba(236, 72, 153, 0.85)',
                    'borderColor' => '#ec4899',
                    'borderWidth' => 1.5,
                    'borderRadius' => 6,
                ],
                [
                    'label' => 'Comments',
                    'data' => $comments,
                    'backgroundColor' => 'rgba(59, 130, 246, 0.85)',
                    'borderColor' => '#3b82f6',
                    'borderWidth' => 1.5,
                    'borderRadius' => 6,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
