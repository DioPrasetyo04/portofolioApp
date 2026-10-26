<?php

namespace App\Filament\Resources\LanguageSkills\Widgets;

use App\Models\LanguageSkill;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class LanguageSkillStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalLanguages = LanguageSkill::count();
        $avgFluency = round(LanguageSkill::avg('percentage') ?: 0);
        $nativeCount = LanguageSkill::where('percentage', '>=', 90)->count();
        $withMedia = LanguageSkill::where(function ($q) {
            $q->whereNotNull('media')->orWhereNotNull('gallery')->orWhereNotNull('photo');
        })->count();

        return [
            Stat::make('Languages Spoken', $totalLanguages)
                ->description('Communication & global reach')
                ->descriptionIcon('heroicon-m-language')
                ->chart([1, 2, 2, 3])
                ->color('primary'),

            Stat::make('Average Fluency', "{$avgFluency}%")
                ->description('Fluency across all languages')
                ->descriptionIcon('heroicon-m-check-circle')
                ->chart([70, 78, 85, $avgFluency])
                ->color('success'),

            Stat::make('Native / Fluent (≥90%)', $nativeCount)
                ->description('High-proficiency languages')
                ->descriptionIcon('heroicon-m-sparkles')
                ->chart([1, 1, 2, $nativeCount])
                ->color('warning'),

            Stat::make('Visual Documentation', $withMedia)
                ->description('Languages with audio/video/photo proof')
                ->descriptionIcon('heroicon-m-photo')
                ->chart([1, 2, $withMedia])
                ->color('info'),
        ];
    }
}
