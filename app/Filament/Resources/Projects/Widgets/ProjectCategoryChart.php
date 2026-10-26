<?php

namespace App\Filament\Resources\Projects\Widgets;

use App\Models\Project;
use Filament\Widgets\ChartWidget;

class ProjectCategoryChart extends ChartWidget
{
    protected ?string $heading = 'Project Domain Distribution';

    protected ?string $description = 'Projects grouped by engineering discipline and category';

    protected ?string $maxHeight = '280px';

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
        $categoryMap = [
            '3d' => '3D Experience',
            'fullstack' => 'Fullstack Web',
            'web' => 'Frontend Web',
            'api' => 'API & Services',
            'mobile' => 'Mobile Applications',
        ];

        $palette = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
        $bgColors = [];
        $i = 0;

        foreach ($categoryCounts as $cat => $count) {
            $labels[] = $categoryMap[strtolower((string) $cat)] ?? ucfirst((string) $cat);
            $data[] = (int) $count;
            $bgColors[] = $palette[$i % count($palette)];
            $i++;
        }

        if (empty($data)) {
            $labels = ['General Projects'];
            $data = [Project::count() ?: 1];
            $bgColors = ['#8b5cf6'];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Projects',
                    'data' => $data,
                    'backgroundColor' => $bgColors,
                    'borderWidth' => 2,
                    'borderColor' => '#1e1e2d',
                ],
            ],
            'labels' => $labels,
        ];
    }
}
