<?php

namespace App\Filament\Resources\TechnologyCategories\Widgets;

use App\Models\Technology;
use App\Models\TechnologyCategory;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class TechnologyCategoryStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalCategories = TechnologyCategory::count();
        $totalTech = Technology::count();
        $avgPerCategory = $totalCategories > 0 ? round($totalTech / $totalCategories, 1) : 0;
        
        $topCategory = TechnologyCategory::withCount('technologies')
            ->orderByDesc('technologies_count')
            ->first();

        $topName = 'N/A';
        if ($topCategory) {
            $topName = is_array($topCategory->name)
                ? ($topCategory->name[app()->getLocale()] ?? reset($topCategory->name) ?? 'Category')
                : ($topCategory->name ?: 'Category');
            $topName .= " ({$topCategory->technologies_count})";
        }

        return [
            Stat::make('Technology Categories', $totalCategories)
                ->description('Architectural domains')
                ->descriptionIcon('heroicon-m-rectangle-group')
                ->chart([1, 2, 3, 4])
                ->color('primary'),

            Stat::make('Total Technologies', $totalTech)
                ->description('Assigned across categories')
                ->descriptionIcon('heroicon-m-cpu-chip')
                ->chart([5, 11, 17, 22])
                ->color('success'),

            Stat::make('Avg Tech / Category', $avgPerCategory)
                ->description('Balanced domain coverage')
                ->descriptionIcon('heroicon-m-scale')
                ->chart([3, 4, 5, 5, 6])
                ->color('info'),

            Stat::make('Largest Category', $topName)
                ->description('Most populated discipline')
                ->descriptionIcon('heroicon-m-chart-pie')
                ->chart([2, 4, 5, 6])
                ->color('warning'),
        ];
    }
}
