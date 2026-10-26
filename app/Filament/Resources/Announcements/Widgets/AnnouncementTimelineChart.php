<?php

namespace App\Filament\Resources\Announcements\Widgets;

use App\Models\Announcement;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;

class AnnouncementTimelineChart extends ChartWidget
{
    protected ?string $heading = 'Announcement Lifecycle Status';

    protected ?string $description = 'Proportion of live, upcoming scheduled, and expired announcements';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getData(): array
    {
        $now = Carbon::now();

        $active = Announcement::where(function ($q) use ($now) {
            $q->whereNull('start_time')->orWhere('start_time', '<=', $now);
        })->where(function ($q) use ($now) {
            $q->whereNull('end_time')->orWhere('end_time', '>=', $now);
        })->count();

        $upcoming = Announcement::where('start_time', '>', $now)->count();
        $past = Announcement::where('end_time', '<', $now)->count();

        if ($active === 0 && $upcoming === 0 && $past === 0) {
            $active = 1;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Announcements',
                    'data' => [$active, $upcoming, $past],
                    'backgroundColor' => [
                        'rgba(16, 185, 129, 0.85)', // Green for Active
                        'rgba(59, 130, 246, 0.85)',  // Blue for Upcoming
                        'rgba(156, 163, 175, 0.85)', // Gray for Past
                    ],
                    'borderColor' => ['#10b981', '#3b82f6', '#9ca3af'],
                    'borderWidth' => 2,
                ],
            ],
            'labels' => ['Active Now', 'Scheduled Upcoming', 'Expired / Past'],
        ];
    }
}
