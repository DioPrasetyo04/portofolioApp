<?php

namespace App\Filament\Resources\Experiences\Widgets;

use App\Models\Experience;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ExperienceStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $total = Experience::count();
        $workCount = Experience::where('type', 'work')->count();
        $eduCount = Experience::where('type', 'education')->count();
        $orgCount = Experience::where('type', 'organization')->count();
        $activeCount = Experience::where('is_active', true)->count();

        return [
            Stat::make('Total Milestones', $total)
                ->description("{$activeCount} ditampilkan di portfolio")
                ->descriptionIcon('heroicon-m-calendar-days')
                ->chart([2, 4, 3, 5, 6, $total])
                ->color('primary'),

            Stat::make('Work Experience', $workCount)
                ->description('Karier & Magang industri')
                ->descriptionIcon('heroicon-m-briefcase')
                ->chart([1, 2, 2, 3, $workCount])
                ->color('danger'),

            Stat::make('Education History', $eduCount)
                ->description('Pendidikan formal & bootcamp')
                ->descriptionIcon('heroicon-m-academic-cap')
                ->chart([1, 2, 3, 3, $eduCount])
                ->color('info'),

            Stat::make('Organization & Community', $orgCount)
                ->description('Kepemimpinan & organisasi')
                ->descriptionIcon('heroicon-m-user-group')
                ->chart([1, 1, 2, 2, $orgCount])
                ->color('warning'),
        ];
    }
}

