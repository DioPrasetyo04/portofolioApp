<?php

namespace App\Filament\Resources\Experiences\Widgets;

use App\Models\Experience;
use Filament\Widgets\ChartWidget;

class ExperienceCategoryChart extends ChartWidget
{
    protected ?string $heading = 'Distribusi Kategori Pengalaman & Pendidikan';

    protected ?string $description = 'Perbandingan antara Pengalaman Kerja, Pendidikan, dan Organisasi';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getData(): array
    {
        $workCount = Experience::where('type', 'work')->count();
        $eduCount = Experience::where('type', 'education')->count();
        $orgCount = Experience::where('type', 'organization')->count();

        $labels = ['Work Experience (Karier/Magang)', 'Education (Pendidikan)', 'Organization (Organisasi)'];
        $data = [$workCount, $eduCount, $orgCount];

        return [
            'datasets' => [
                [
                    'label' => 'Total Record',
                    'data' => $data,
                    'backgroundColor' => [
                        'rgba(239, 68, 68, 0.85)',   // Red for Work
                        'rgba(59, 130, 246, 0.85)',   // Blue for Education
                        'rgba(139, 92, 246, 0.85)',  // Violet for Organization
                    ],
                    'borderColor' => ['#ef4444', '#3b82f6', '#8b5cf6'],
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $labels,
        ];
    }
}

