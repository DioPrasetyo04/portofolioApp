<?php

namespace App\Filament\Resources\Resumes\Widgets;

use App\Models\Resume;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class ResumeStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalResumes = Resume::count();
        $activeResume = Resume::where('is_active', true)->latest('updated_at')->first();
        $totalDownloads = (int) Resume::sum('download_count');

        $activeVersion = $activeResume ? ($activeResume->version ?: 'Live') : 'None';
        $activeTitle = $activeResume ? (is_array($activeResume->title) ? ($activeResume->title['en'] ?? reset($activeResume->title)) : $activeResume->title) : 'No active resume';

        return [
            Stat::make('Active CV / Resume', $activeVersion)
                ->description($activeTitle)
                ->descriptionIcon('heroicon-m-check-badge')
                ->color('success'),

            Stat::make('Total Downloads', number_format($totalDownloads))
                ->description('Direct downloads from Navigation Bar')
                ->descriptionIcon('heroicon-m-arrow-down-tray')
                ->chart([2, 5, 8, 12, max($totalDownloads, 15)])
                ->color('primary'),

            Stat::make('Document Archive', "{$totalResumes} Versions")
                ->description('Historical uploaded CV versions')
                ->descriptionIcon('heroicon-m-document-duplicate')
                ->color('info'),
        ];
    }
}
