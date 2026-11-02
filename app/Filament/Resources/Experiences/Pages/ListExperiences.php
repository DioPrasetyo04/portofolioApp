<?php

namespace App\Filament\Resources\Experiences\Pages;

use App\Filament\Resources\Experiences\ExperienceResource;
use App\Filament\Resources\Experiences\Widgets\ExperienceCategoryChart;
use App\Filament\Resources\Experiences\Widgets\ExperienceStatsWidget;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListExperiences extends ListRecords
{
    protected static string $resource = ExperienceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ExperienceStatsWidget::class,
            ExperienceCategoryChart::class,
        ];
    }
}
