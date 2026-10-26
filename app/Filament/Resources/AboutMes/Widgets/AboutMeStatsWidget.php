<?php

namespace App\Filament\Resources\AboutMes\Widgets;

use App\Models\AboutMe;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AboutMeStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $about = AboutMe::first();

        $years = $about ? (int) $about->years_experience : 4;
        $completed = $about ? (int) $about->projects_completed : 24;
        $certs = $about ? (int) $about->certifications : 12;
        $galleryCount = $about && is_array($about->gallery_images) ? count($about->gallery_images) : 0;

        return [
            Stat::make('Years Experience', "{$years}+ Years")
                ->description('Professional software engineering')
                ->descriptionIcon('heroicon-m-calendar-days')
                ->chart([1, 2, 3, 3, $years])
                ->color('primary'),

            Stat::make('Projects Completed', "{$completed}+ Works")
                ->description('Shipped systems & client products')
                ->descriptionIcon('heroicon-m-check-badge')
                ->chart([5, 10, 15, 20, $completed])
                ->color('success'),

            Stat::make('Certifications Metric', "{$certs}+ Badges")
                ->description('Accreditations & verified mastery')
                ->descriptionIcon('heroicon-m-academic-cap')
                ->chart([2, 5, 8, 10, $certs])
                ->color('warning'),

            Stat::make('Portfolio Gallery', "{$galleryCount} Photos")
                ->description('Personal & workspace photography')
                ->descriptionIcon('heroicon-m-camera')
                ->chart([1, 2, 3, $galleryCount])
                ->color('info'),
        ];
    }
}
