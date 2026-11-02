<?php

namespace App\Filament\Resources\AboutMes\Pages;

use App\Filament\Resources\AboutMes\AboutMeResource;
use App\Filament\Resources\AboutMes\Widgets\AboutMeSkillChart;
use App\Filament\Resources\AboutMes\Widgets\AboutMeStatsWidget;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListAboutMes extends ListRecords
{
    protected static string $resource = AboutMeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            AboutMeStatsWidget::class,
            AboutMeSkillChart::class,
        ];
    }
}
