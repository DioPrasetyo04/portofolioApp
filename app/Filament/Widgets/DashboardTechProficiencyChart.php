<?php

namespace App\Filament\Widgets;

use App\Models\Technology;
use Filament\Widgets\ChartWidget;

class DashboardTechProficiencyChart extends ChartWidget
{
    protected static ?int $sort = 3;

    protected ?string $heading = 'Technology Stack Proficiency';

    protected ?string $description = 'Top mastered technologies and framework skill ratings (%)';

    protected ?string $maxHeight = '300px';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $technologies = Technology::orderByDesc('proficiency')
            ->take(8)
            ->get();

        $labels = $technologies->pluck('name')->toArray();
        $data = $technologies->pluck('proficiency')->map(fn ($p) => (int) $p)->toArray();

        $palette = [
            'rgba(139, 92, 246, 0.85)', // Violet
            'rgba(59, 130, 246, 0.85)',  // Blue
            'rgba(16, 185, 129, 0.85)',  // Emerald
            'rgba(245, 158, 11, 0.85)',  // Amber
            'rgba(236, 72, 153, 0.85)',  // Pink
            'rgba(6, 182, 212, 0.85)',   // Cyan
            'rgba(99, 102, 241, 0.85)',  // Indigo
            'rgba(168, 85, 247, 0.85)',  // Purple
        ];

        $borders = [
            '#8b5cf6',
            '#3b82f6',
            '#10b981',
            '#f59e0b',
            '#ec4899',
            '#06b6d4',
            '#6366f1',
            '#a855f7',
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
