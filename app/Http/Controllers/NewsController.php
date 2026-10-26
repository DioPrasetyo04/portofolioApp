<?php

namespace App\Http\Controllers;

use App\Contracts\Services\NewsServiceInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function __construct(
        protected NewsServiceInterface $newsService
    ) {}

    public function index(): Response
    {
        $newsList = $this->newsService->getPaginatedNews(9);

        return Inertia::render('news/index', [
            'newsList' => $newsList,
        ]);
    }

    public function show(string $slug): Response
    {
        $news = $this->newsService->getNewsBySlug($slug);

        if (!$news) {
            abort(404, 'Article not found');
        }
        
        $news->load(['comments' => function ($query) {
            $query->latest();
        }])->loadAvg('comments', 'rating');

        // Note: For recentNews, we ideally want to fetch withAvg as well, 
        // but $this->newsService->getLatestNews returns a collection. 
        // We can lazy load it or modify the service. For now, lazy load it here.
        $recentNews = $this->newsService->getLatestNews(6);
        $recentNews->loadAvg('comments', 'rating');

        return Inertia::render('news/show', [
            'article' => $news,
            'recentNews' => $recentNews,
        ]);
    }
}
