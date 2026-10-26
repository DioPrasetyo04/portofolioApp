<?php

namespace App\Filament\Resources\SocialMedia\Widgets;

use App\Models\SocialMedia;
use Filament\Widgets\ChartWidget;

class SocialMediaChart extends ChartWidget
{
    protected ?string $heading = 'Channel Visibility Breakdown';

    protected ?string $description = 'Proportion of publicly active versus disabled social media links';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getData(): array
    {
        $active = SocialMedia::where('is_active', true)->count();
        $inactive = SocialMedia::where('is_active', false)->count();

        if ($active === 0 && $inactive === 0) {
            $active = 1;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Channels',
                    'data' => [$active, $inactive],
                    'backgroundColor' => [
                        'rgba(16, 185, 129, 0.85)', // Active - Green
                        'rgba(107, 114, 128, 0.85)', // Inactive - Gray
                    ],
                    'borderColor' => ['#10b981', '#6b7280'],
                    'borderWidth' => 2,
                ],
            ],
            'labels' => ['Active & Public', 'Inactive / Hidden'],
        ];
    }
}
