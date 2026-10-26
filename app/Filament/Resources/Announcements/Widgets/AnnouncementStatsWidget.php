<?php

namespace App\Filament\Resources\Announcements\Widgets;

use App\Models\Announcement;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class AnnouncementStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $now = Carbon::now();
        $total = Announcement::count();

        $active = Announcement::where(function ($q) use ($now) {
            $q->whereNull('start_time')->orWhere('start_time', '<=', $now);
        })->where(function ($q) use ($now) {
            $q->whereNull('end_time')->orWhere('end_time', '>=', $now);
        })->count();

        $upcoming = Announcement::where('start_time', '>', $now)->count();
        $past = Announcement::where('end_time', '<', $now)->count();

        return [
            Stat::make('Total Announcements', $total)
                ->description('All system banners & notices')
                ->descriptionIcon('heroicon-m-megaphone')
                ->chart([1, 1, 2, 2, $total])
                ->color('primary'),

            Stat::make('Currently Active', $active)
                ->description('Displaying to portfolio visitors')
                ->descriptionIcon('heroicon-m-signal')
                ->chart([1, 1, 1, $active])
                ->color('success'),

            Stat::make('Upcoming Scheduled', $upcoming)
                ->description('Ready for future broadcast')
                ->descriptionIcon('heroicon-m-clock')
                ->chart([0, 0, $upcoming])
                ->color('info'),

            Stat::make('Past / Archived', $past)
                ->description('Broadcast period expired')
                ->descriptionIcon('heroicon-m-archive-box')
                ->chart([0, 1, $past])
                ->color('warning'),
        ];
    }
}
