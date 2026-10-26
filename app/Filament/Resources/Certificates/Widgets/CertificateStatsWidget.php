<?php

namespace App\Filament\Resources\Certificates\Widgets;

use App\Models\Certificate;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CertificateStatsWidget extends BaseWidget
{
    protected function getStats(): array
    {
        $totalCerts = Certificate::count();
        $uniqueIssuers = Certificate::distinct('issuer')->count('issuer');
        $withCredentials = Certificate::whereNotNull('credential_id')->where('credential_id', '!=', '')->count();
        $totalLikes = (int) Certificate::sum('likes_count');

        return [
            Stat::make('Total Certificates', $totalCerts)
                ->description('Professional verified badges')
                ->descriptionIcon('heroicon-m-academic-cap')
                ->chart([1, 2, 3, 4, 5, 6])
                ->color('primary'),

            Stat::make('Issuing Bodies', $uniqueIssuers)
                ->description('Global accreditation institutions')
                ->descriptionIcon('heroicon-m-building-office')
                ->chart([1, 2, 2, 3, 4, 5])
                ->color('success'),

            Stat::make('Verified Credentials', $withCredentials)
                ->description('With active Credential ID & URL')
                ->descriptionIcon('heroicon-m-check-badge')
                ->chart([1, 2, 3, 4, 5, 6])
                ->color('info'),

            Stat::make('Certificate Likes', $totalLikes)
                ->description('Visitor recommendations')
                ->descriptionIcon('heroicon-m-heart')
                ->chart([0, 1, 3, 4, 6])
                ->color('danger'),
        ];
    }
}
