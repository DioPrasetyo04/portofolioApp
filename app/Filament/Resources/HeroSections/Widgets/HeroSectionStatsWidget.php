<?php

namespace App\Filament\Resources\HeroSections\Widgets;

use App\Models\HeroSection;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class HeroSectionStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $hero = HeroSection::first();

        $titleCount = $hero && is_array($hero->title) ? count(array_filter($hero->title)) : ($hero && $hero->title ? 1 : 0);
        $subtitleCount = $hero && is_array($hero->subtitle) ? count(array_filter($hero->subtitle)) : ($hero && $hero->subtitle ? 1 : 0);
        $hasImage = $hero && filled($hero->image);

        return [
            Stat::make('Hero Profile', $hero ? 'Configured' : 'Empty')
                ->description('Main portfolio landing stage')
                ->descriptionIcon('heroicon-m-sparkles')
                ->chart([1, 1, 1, 1])
                ->color('primary'),

            Stat::make('Title Locales', "{$titleCount} Languages")
                ->description('Multilingual headline coverage')
                ->descriptionIcon('heroicon-m-language')
                ->chart([1, 2, $titleCount])
                ->color('success'),

            Stat::make('Subtitle Locales', "{$subtitleCount} Languages")
                ->description('Value proposition translations')
                ->descriptionIcon('heroicon-m-document-text')
                ->chart([1, 2, $subtitleCount])
                ->color('info'),

            Stat::make('Hero Visual Asset', $hasImage ? 'Custom Asset' : 'Default')
                ->description('Optimized 3D/portrait artwork')
                ->descriptionIcon('heroicon-m-photo')
                ->chart([0, 1, 1])
                ->color($hasImage ? 'warning' : 'gray'),
        ];
    }
}
