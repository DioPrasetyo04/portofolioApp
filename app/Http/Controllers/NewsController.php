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

        $recentNews = $this->newsService->getLatestNews(4);

        return Inertia::render('news/show', [
            'article' => $news,
            'recentNews' => $recentNews,
        ]);
    }
}
