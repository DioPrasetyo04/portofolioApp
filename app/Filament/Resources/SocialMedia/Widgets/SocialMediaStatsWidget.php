<?php

namespace App\Filament\Resources\SocialMedia\Widgets;

use App\Models\SocialMedia;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class SocialMediaStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $total = SocialMedia::count();
        $active = SocialMedia::where('is_active', true)->count();
        $inactive = SocialMedia::where('is_active', false)->count();
        $rate = $total > 0 ? round(($active / $total) * 100) : 0;

        return [
            Stat::make('Social Channels', $total)
                ->description('Configured outreach profiles')
                ->descriptionIcon('heroicon-m-share')
                ->chart([2, 3, 4, 4, $total])
                ->color('primary'),

            Stat::make('Active & Visible', $active)
                ->description('Published in portfolio footer & hero')
                ->descriptionIcon('heroicon-m-check-badge')
                ->chart([1, 2, 3, 4, $active])
                ->color('success'),

            Stat::make('Inactive / Draft', $inactive)
                ->description('Hidden from public visitor view')
                ->descriptionIcon('heroicon-m-eye-slash')
                ->chart([0, 1, $inactive])
                ->color('gray'),

            Stat::make('Active Ratio', "{$rate}%")
                ->description('Outreach health percentage')
                ->descriptionIcon('heroicon-m-sparkles')
                ->chart([60, 75, 80, 90, $rate])
                ->color('info'),
        ];
    }
}
