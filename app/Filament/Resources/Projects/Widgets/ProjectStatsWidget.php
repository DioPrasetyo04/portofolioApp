<?php

namespace App\Filament\Resources\Projects\Widgets;

use App\Models\Project;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class ProjectStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalProjects = Project::count();
        $featuredProjects = Project::where('is_featured', true)->count();
        $totalLikes = (int) Project::sum('likes_count');
        $uniqueTechCount = DB::table('project_technology')->distinct('technology_id')->count('technology_id');

        return [
            Stat::make('Total Projects', $totalProjects)
                ->description('All cataloged projects')
                ->descriptionIcon('heroicon-m-folder')
                ->chart([3, 5, 4, 6, 8, 7, 9])
                ->color('primary'),

            Stat::make('Featured Works', $featuredProjects)
                ->description('Highlighted in portfolio')
                ->descriptionIcon('heroicon-m-star')
                ->chart([1, 2, 2, 3, 4])
                ->color('warning'),

            Stat::make('Project Likes', $totalLikes)
                ->description('Total community appreciation')
                ->descriptionIcon('heroicon-m-heart')
                ->chart([2, 5, 8, 12, 16])
                ->color('danger'),

            Stat::make('Technologies Used', $uniqueTechCount)
                ->description('Tech applied across projects')
                ->descriptionIcon('heroicon-m-cpu-chip')
                ->chart([5, 8, 10, 14, 18])
                ->color('success'),
        ];
    }
}
