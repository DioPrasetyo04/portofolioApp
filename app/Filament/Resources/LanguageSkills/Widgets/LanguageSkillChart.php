<?php

namespace App\Filament\Resources\LanguageSkills\Widgets;

use App\Models\LanguageSkill;
use Filament\Widgets\ChartWidget;

class LanguageSkillChart extends ChartWidget
{
    protected ?string $heading = 'Multilingual Competency Scale';

    protected ?string $description = 'Fluency and mastery score (%) per spoken and written language';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $skills = LanguageSkill::orderByDesc('percentage')->get();

        $labels = $skills->pluck('name')->toArray();
        $data = $skills->pluck('percentage')->map(fn ($p) => (int) $p)->toArray();

        $palette = [
            'rgba(16, 185, 129, 0.85)', // Emerald
            'rgba(139, 92, 246, 0.85)', // Violet
            'rgba(59, 130, 246, 0.85)',  // Blue
            'rgba(245, 158, 11, 0.85)',  // Amber
            'rgba(236, 72, 153, 0.85)',  // Pink
        ];

        $borders = ['#10b981', '#8b5cf6', '#3b82f6', '#f59e0b', '#ec4899'];

        if (empty($labels)) {
            $labels = ['No Languages Added'];
            $data = [0];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Fluency Percentage (%)',
                    'data' => $data,
                    'backgroundColor' => array_slice($palette, 0, count($data)),
                    'borderColor' => array_slice($borders, 0, count($data)),
                    'borderWidth' => 1.5,
                    'borderRadius' => 6,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
