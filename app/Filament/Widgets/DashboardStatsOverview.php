<?php

namespace App\Filament\Widgets;

use App\Models\Certificate;
use App\Models\Comment;
use App\Models\LanguageSkill;
use App\Models\News;
use App\Models\PortfolioLike;
use App\Models\Project;
use App\Models\Technology;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $portfolioLikes = PortfolioLike::count();

        $projectsCount = Project::count();
        $featuredCount = Project::where('is_featured', true)->count();
        $totalProjectLikes = (int) Project::sum('likes_count');

        $newsCount = News::count();
        $totalNewsLikes = (int) News::sum('likes_count');
        $totalComments = Comment::count();

        $certificatesCount = Certificate::count();
        $uniqueIssuers = Certificate::distinct('issuer')->count('issuer');

        $techCount = Technology::count();
        $languageCount = LanguageSkill::count();
        $avgProficiency = round(Technology::avg('proficiency') ?: 0);

        return [
            Stat::make('Portfolio Likes', $portfolioLikes)
                ->description('Audience appreciation & likes')
                ->descriptionIcon('heroicon-m-heart')
                ->chart([1, 2, 4, 3, 5, 6, 8, 10])
                ->color('danger'),

            Stat::make('Total Projects', $projectsCount)
                ->description("{$featuredCount} Featured • {$totalProjectLikes} Likes")
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([2, 3, 5, 4, 7, 6, 8, 10])
                ->color('primary'),

            Stat::make('Articles & News', $newsCount)
                ->description("{$totalNewsLikes} Likes • {$totalComments} Comments")
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->chart([1, 2, 4, 3, 6, 5, 8])
                ->color('info'),

            Stat::make('Certifications', $certificatesCount)
                ->description("{$uniqueIssuers} Verified Issuers")
                ->descriptionIcon('heroicon-m-academic-cap')
                ->chart([1, 3, 3, 4, 5, 6])
                ->color('success'),

            Stat::make('Tech & Languages', "{$techCount} / {$languageCount}")
                ->description("Avg {$avgProficiency}% Proficiency")
                ->descriptionIcon('heroicon-m-bolt')
                ->chart([60, 70, 75, 80, 85, 90, 94])
                ->color('warning'),
        ];
    }
}
