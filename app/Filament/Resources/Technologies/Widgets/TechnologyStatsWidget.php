<?php

namespace App\Filament\Resources\Technologies\Widgets;

use App\Models\Technology;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TechnologyStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalTech = Technology::count();
        $avgProficiency = round(Technology::avg('proficiency') ?: 0);
        $expertCount = Technology::where('proficiency', '>=', 90)->count();
        $inProjectsCount = Technology::has('projects')->count();

        return [
            Stat::make('Total Technologies', $totalTech)
                ->description('Frameworks, tools, and languages')
                ->descriptionIcon('heroicon-m-code-bracket')
                ->chart([10, 14, 16, 18, 22])
                ->color('primary'),

            Stat::make('Average Mastery', "{$avgProficiency}%")
                ->description('Overall capability baseline')
                ->descriptionIcon('heroicon-m-bolt')
                ->chart([70, 75, 82, 86, 91])
                ->color('success'),

            Stat::make('Expert Tier (≥90%)', $expertCount)
                ->description('Primary technical proficiencies')
                ->descriptionIcon('heroicon-m-sparkles')
                ->chart([2, 4, 6, 8, $expertCount])
                ->color('warning'),

            Stat::make('Used in Projects', $inProjectsCount)
                ->description('Actively implemented in portfolio')
                ->descriptionIcon('heroicon-m-briefcase')
                ->chart([3, 5, 8, 10, $inProjectsCount])
                ->color('info'),
        ];
    }
}
