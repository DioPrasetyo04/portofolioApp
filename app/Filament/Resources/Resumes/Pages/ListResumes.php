<?php

namespace App\Filament\Resources\Resumes\Pages;

use App\Filament\Resources\Resumes\ResumeResource;
use App\Filament\Resources\Resumes\Widgets\ResumeDownloadsChart;
use App\Filament\Resources\Resumes\Widgets\ResumeStatsWidget;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListResumes extends ListRecords
{
    protected static string $resource = ResumeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ResumeStatsWidget::class,
            ResumeDownloadsChart::class,
        ];
    }
}
