<?php

namespace App\Filament\Resources\News\Widgets;

use App\Models\Comment;
use App\Models\News;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class NewsStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalNews = News::count();
        $totalLikes = (int) News::sum('likes_count');
        $totalComments = Comment::where('commentable_type', News::class)->count();
        $avgLikes = $totalNews > 0 ? round($totalLikes / $totalNews, 1) : 0;

        return [
            Stat::make('Published Articles', $totalNews)
                ->description('Active blog & technical insights')
                ->descriptionIcon('heroicon-m-newspaper')
                ->chart([1, 2, 2, 3, 4, 3, 5])
                ->color('primary'),

            Stat::make('Article Likes', $totalLikes)
                ->description('Reader appreciation count')
                ->descriptionIcon('heroicon-m-heart')
                ->chart([2, 4, 7, 6, 9, 12])
                ->color('danger'),

            Stat::make('Reader Comments', $totalComments)
                ->description('Community discussions')
                ->descriptionIcon('heroicon-m-chat-bubble-left-ellipsis')
                ->chart([1, 2, 4, 3, 6, 8])
                ->color('info'),

            Stat::make('Avg Likes / Post', $avgLikes)
                ->description('Engagement ratio per publication')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([2, 3, 4, 5, 6])
                ->color('warning'),
        ];
    }
}
