<?php

namespace App\Filament\Resources\AboutMes\Widgets;

use App\Models\AboutMe;
use Filament\Widgets\ChartWidget;

class AboutMeSkillChart extends ChartWidget
{
    protected ?string $heading = 'Core Competency Profile';

    protected ?string $description = 'Pillar skill ratings configured in the About Me section';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'polarArea';
    }

    protected function getData(): array
    {
        $about = AboutMe::first();
        $skills = $about && isset($about->skill_stats['skills']) && is_array($about->skill_stats['skills'])
            ? $about->skill_stats['skills']
            : [];

        $labels = [];
        $data = [];
        $bgColors = [];

        $defaultColors = [
            'rgba(139, 92, 246, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(16, 185, 129, 0.8)',
        ];

        foreach ($skills as $index => $item) {
            $labels[] = (string) ($item['name'] ?? 'Skill');
            $data[] = (int) ($item['value'] ?? 80);
            $bgColors[] = $item['color'] ?? $defaultColors[$index % count($defaultColors)];
        }

        if (empty($labels)) {
            $labels = ['Frontend & 3D', 'Backend & Cloud', 'DevOps', 'Mobile'];
            $data = [90, 88, 75, 80];
            $bgColors = $defaultColors;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Score (%)',
                    'data' => $data,
                    'backgroundColor' => $bgColors,
                    'borderWidth' => 1.5,
                ],
            ],
            'labels' => $labels,
        ];
    }
}
