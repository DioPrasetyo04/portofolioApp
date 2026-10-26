<?php

namespace App\Filament\Resources\Certificates\Widgets;

use App\Models\Certificate;
use Filament\Widgets\ChartWidget;

class CertificateIssuerChart extends ChartWidget
{
    protected ?string $heading = 'Certificates by Issuing Organization';

    protected ?string $description = 'Distribution of credentials by tech authority & academy';

    protected ?string $maxHeight = '280px';

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getData(): array
    {
        $issuerCounts = Certificate::selectRaw('issuer, count(*) as total')
            ->whereNotNull('issuer')
            ->groupBy('issuer')
            ->pluck('total', 'issuer')
            ->toArray();

        $labels = [];
        $data = [];
        $palette = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#6366f1'];
        $bgColors = [];
        $i = 0;

        foreach ($issuerCounts as $issuer => $count) {
            $labels[] = (string) $issuer;
            $data[] = (int) $count;
            $bgColors[] = $palette[$i % count($palette)];
            $i++;
        }

        if (empty($data)) {
            $labels = ['General Certifications'];
            $data = [Certificate::count() ?: 1];
            $bgColors = ['#10b981'];
        }

        return [
            'datasets' => [
                [
                    'label' => 'Certificates',
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
