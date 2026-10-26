<?php

namespace App\Filament\Widgets;

use App\Models\Project;
use Filament\Widgets\ChartWidget;

class DashboardProjectsCategoryChart extends ChartWidget
{
    protected static ?int $sort = 2;

    protected ?string $heading = 'Projects by Category';

    protected ?string $description = 'Distribution of portfolio projects across engineering domains';

    protected ?string $maxHeight = '300px';

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getData(): array
    {
        $categoryCounts = Project::selectRaw('category, count(*) as total')
            ->whereNotNull('category')
            ->groupBy('category')
            ->pluck('total', 'category')
            ->toArray();

        $labels = [];
        $data = [];
        $colors = [
            '#8b5cf6', // Violet
            '#3b82f6', // Blue
            '#10b981', // Emerald
            '#f59e0b', // Amber
            '#ec4899', // Pink
            '#06b6d4', // Cyan
        ];

        $categoryMap = [
            '3d' => '3D Experience',
            'fullstack' => 'Fullstack Web',
            'web' => 'Frontend Web',
            'api' => 'API & Microservices',
            'mobile' => 'Mobile Applications',
            'ai' => 'AI & Machine Learning',
        ];

        $colorIndex = 0;
        $backgroundColors = [];

        foreach ($categoryCounts as $category => $count) {
            $labels[] = $categoryMap[strtolower((string) $category)] ?? ucfirst((string) $category);
            $data[] = (int) $count;
            $backgroundColors[] = $colors[$colorIndex % count($colors)];
            $colorIndex++;
        }

        if (empty($data)) {
            $labels = ['General Projects'];
            $data = [Project::count() ?: 1];
            $backgroundColors = ['#8b5cf6'];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Projects',
                    'data' => $data,
                    'backgroundColor' => $backgroundColors,
                    'borderWidth' => 2,
                    'borderColor' => '#1e1e2d',
                    'hoverOffset' => 6,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
