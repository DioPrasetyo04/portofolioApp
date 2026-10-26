<?php

namespace App\Filament\Resources\Resumes\Widgets;

use App\Models\Resume;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Str;

class ResumeDownloadsChart extends ChartWidget
{
    protected ?string $heading = 'CV Version Distribution & Downloads';

    protected ?string $description = 'Recruiter and visitor download volume across curriculum vitae versions';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getData(): array
    {
        $resumes = Resume::orderByDesc('download_count')->take(6)->get();

        $labels = [];
        $data = [];
        $palette = [
            'rgba(139, 92, 246, 0.85)', // Violet
            'rgba(16, 185, 129, 0.85)', // Emerald
            'rgba(59, 130, 246, 0.85)',  // Blue
            'rgba(245, 158, 11, 0.85)',  // Amber
            'rgba(236, 72, 153, 0.85)',  // Pink
            'rgba(6, 182, 212, 0.85)',   // Cyan
        ];

        $borders = ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#06b6d4'];

        foreach ($resumes as $resume) {
            $version = $resume->version ? "v{$resume->version}" : 'Live';
            $title = is_array($resume->title)
                ? ($resume->title[app()->getLocale()] ?? reset($resume->title) ?? 'Resume')
                : ($resume->title ?: 'Resume');

            $labels[] = "{$version} - " . Str::limit((string) $title, 18);
            $data[] = (int) $resume->download_count;
        }

        if (empty($labels)) {
            $labels = ['No CV Uploaded'];
            $data = [0];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Downloads',
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
