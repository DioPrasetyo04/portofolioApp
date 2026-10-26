<?php

namespace App\Filament\Resources\HeroSections\Widgets;

use App\Models\HeroSection;
use Filament\Widgets\ChartWidget;

class HeroSectionCompletenessChart extends ChartWidget
{
    protected ?string $heading = 'Hero Presentation Readiness Score';

    protected ?string $description = 'Completeness percentage across copywriting, localization, and visual presence';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $hero = HeroSection::first();

        $enTitle = $hero && isset($hero->title['en']) && filled($hero->title['en']) ? 100 : 0;
        $idTitle = $hero && isset($hero->title['id']) && filled($hero->title['id']) ? 100 : 0;
        $zhTitle = $hero && isset($hero->title['zh']) && filled($hero->title['zh']) ? 100 : 0;
        $subtitleScore = $hero && ! empty($hero->subtitle) ? 100 : 0;
        $imageScore = $hero && filled($hero->image) ? 100 : 0;

        return [
            'datasets' => [
                [
                    'label' => 'Readiness (%)',
                    'data' => [$enTitle, $idTitle, $zhTitle, $subtitleScore, $imageScore],
                    'backgroundColor' => [
                        'rgba(139, 92, 246, 0.85)', // Violet
                        'rgba(59, 130, 246, 0.85)',  // Blue
                        'rgba(16, 185, 129, 0.85)',  // Emerald
                        'rgba(245, 158, 11, 0.85)',  // Amber
                        'rgba(236, 72, 153, 0.85)',  // Pink
                    ],
                    'borderColor' => ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'],
                    'borderWidth' => 1.5,
                    'borderRadius' => 6,
                ],
            ],
            'labels' => [
                'English Headline',
                'Indonesian Headline',
                'Chinese Headline',
                'Subtitle Narrative',
                'Hero Artwork Asset',
            ],
        ];
    }
}
