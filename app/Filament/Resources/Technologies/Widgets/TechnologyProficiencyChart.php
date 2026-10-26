<?php

namespace App\Filament\Resources\Technologies\Widgets;

use App\Models\Technology;
use Filament\Widgets\ChartWidget;

class TechnologyProficiencyChart extends ChartWidget
{
    protected ?string $heading = 'Stack Proficiency Rankings';

    protected ?string $description = 'Comparative proficiency percentage across top technologies';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $technologies = Technology::orderByDesc('proficiency')
            ->take(10)
            ->get();

        $labels = $technologies->pluck('name')->toArray();
        $data = $technologies->pluck('proficiency')->map(fn ($p) => (int) $p)->toArray();

        $palette = [
            'rgba(139, 92, 246, 0.85)',
            'rgba(59, 130, 246, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(236, 72, 153, 0.85)',
            'rgba(6, 182, 212, 0.85)',
            'rgba(99, 102, 241, 0.85)',
            'rgba(168, 85, 247, 0.85)',
            'rgba(14, 165, 233, 0.85)',
            'rgba(34, 197, 94, 0.85)',
        ];

        $borders = [
            '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899',
            '#06b6d4', '#6366f1', '#a855f7', '#0ea5e9', '#22c55e',
        ];

        return [
            'datasets' => [
                [
                    'label' => 'Proficiency (%)',
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
