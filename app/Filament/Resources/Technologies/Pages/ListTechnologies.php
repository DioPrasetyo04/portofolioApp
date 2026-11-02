<?php

namespace App\Filament\Resources\Technologies\Pages;

use App\Filament\Resources\Technologies\TechnologyResource;
use App\Filament\Resources\Technologies\Widgets\TechnologyProficiencyChart;
use App\Filament\Resources\Technologies\Widgets\TechnologyStatsWidget;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTechnologies extends ListRecords
{
    protected static string $resource = TechnologyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            TechnologyStatsWidget::class,
            TechnologyProficiencyChart::class,
        ];
    }
}
