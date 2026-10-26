<?php

namespace App\Filament\Widgets;

use App\Models\Certificate;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class DashboardCertificatesTimelineChart extends ChartWidget
{
    protected static ?int $sort = 5;

    protected ?string $heading = 'Certification Timeline';

    protected ?string $description = 'Annual distribution of professional certifications & credentials';

    protected ?string $maxHeight = '300px';

    protected function getType(): string
    {
        return 'line';
    }

    protected function getData(): array
    {
        $certs = Certificate::whereNotNull('issued_at')
            ->orderBy('issued_at')
            ->get();

        $byYear = [];
        foreach ($certs as $cert) {
            $year = Carbon::parse($cert->issued_at)->format('Y');
            $byYear[$year] = ($byYear[$year] ?? 0) + 1;
        }

        if (empty($byYear)) {
            $byYear = [date('Y') => Certificate::count() ?: 1];
        }

        // Cumulative calculation for progression feel
        $cumulative = 0;
        $cumulativeData = [];
        $annualData = [];
        foreach ($byYear as $year => $count) {
            $cumulative += $count;
            $cumulativeData[] = $cumulative;
            $annualData[] = $count;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Cumulative Credentials',
                    'data' => $cumulativeData,
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.15)',
                    'fill' => true,
                    'tension' => 0.35,
                    'pointBackgroundColor' => '#10b981',
                    'pointRadius' => 5,
                ],
                [
                    'label' => 'Earned In Year',
                    'data' => $annualData,
                    'borderColor' => '#8b5cf6',
                    'backgroundColor' => 'rgba(139, 92, 246, 0.15)',
                    'fill' => false,
                    'tension' => 0.25,
                    'pointBackgroundColor' => '#8b5cf6',
                    'pointRadius' => 4,
                ],
            ],
            'labels' => array_keys($byYear),
        ];
    }
}
