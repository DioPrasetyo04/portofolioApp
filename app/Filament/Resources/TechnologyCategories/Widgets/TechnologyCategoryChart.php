<?php

namespace App\Filament\Resources\TechnologyCategories\Widgets;

use App\Models\TechnologyCategory;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Str;

class TechnologyCategoryChart extends ChartWidget
{
    protected ?string $heading = 'Category Distribution of Technologies';

    protected ?string $description = 'Distribution of stack components across technical pillars';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'polarArea';
    }

    protected function getData(): array
    {
        $categories = TechnologyCategory::withCount('technologies')->get();

        $labels = [];
        $data = [];
        $palette = [
            'rgba(139, 92, 246, 0.8)', // Violet
            'rgba(59, 130, 246, 0.8)',  // Blue
            'rgba(16, 185, 129, 0.8)',  // Emerald
            'rgba(245, 158, 11, 0.8)',  // Amber
            'rgba(236, 72, 153, 0.8)',  // Pink
            'rgba(6, 182, 212, 0.8)',   // Cyan
        ];

        $borders = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

        foreach ($categories as $cat) {
            $name = is_array($cat->name)
                ? ($cat->name[app()->getLocale()] ?? reset($cat->name) ?? 'Category')
                : ($cat->name ?: 'Category');

            $labels[] = Str::limit((string) $name, 25);
            $data[] = (int) $cat->technologies_count;
        }

        if (empty($labels)) {
            $labels = ['No Categories'];
            $data = [0];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Technologies',
                    'data' => $data,
                    'backgroundColor' => array_slice($palette, 0, count($data)),
                    'borderColor' => array_slice($borders, 0, count($data)),
                    'borderWidth' => 1.5,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
