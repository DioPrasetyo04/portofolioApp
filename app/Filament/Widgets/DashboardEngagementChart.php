<?php

namespace App\Filament\Widgets;

use App\Models\Certificate;
use App\Models\Comment;
use App\Models\News;
use App\Models\PortfolioLike;
use App\Models\Project;
use App\Models\Resume;
use Filament\Widgets\ChartWidget;

class DashboardEngagementChart extends ChartWidget
{
    protected static ?int $sort = 4;

    protected ?string $heading = 'Portfolio Engagement & Traction';

    protected ?string $description = 'Audience interactions, likes, downloads, and comment feedback across content types';

    protected ?string $maxHeight = '300px';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $portfolioLikes = (int) PortfolioLike::count();
        $projectLikes = (int) Project::sum('likes_count');
        $newsLikes = (int) News::sum('likes_count');
        $certLikes = (int) Certificate::sum('likes_count');
        $cvDownloads = (int) Resume::sum('download_count');

        $projectComments = Comment::where('commentable_type', Project::class)->count();
        $newsComments = Comment::where('commentable_type', News::class)->count();
        $certComments = Comment::where('commentable_type', Certificate::class)->count();

        return [
            'datasets' => [
                [
                    'label' => 'Likes / Direct Downloads',
                    'data' => [$portfolioLikes, $projectLikes, $newsLikes, $certLikes, $cvDownloads],
                    'backgroundColor' => 'rgba(236, 72, 153, 0.8)', // Pink/Rose
                    'borderColor' => '#ec4899',
                    'borderWidth' => 1.5,
                    'borderRadius' => 6,
                ],
                [
                    'label' => 'Comments & Feedback',
                    'data' => [0, $projectComments, $newsComments, $certComments, 0],
                    'backgroundColor' => 'rgba(59, 130, 246, 0.8)', // Blue
                    'borderColor' => '#3b82f6',
                    'borderWidth' => 1.5,
                    'borderRadius' => 6,
                ],
            ],
            'labels' => ['Portfolio Site', 'Projects', 'Articles & News', 'Certifications', 'Resume / CV'],
        ];
    }
}
