<?php

namespace App\Filament\Resources\TechnologyCategories\Pages;

use App\Filament\Resources\TechnologyCategories\TechnologyCategoryResource;
use App\Filament\Resources\TechnologyCategories\Widgets\TechnologyCategoryChart;
use App\Filament\Resources\TechnologyCategories\Widgets\TechnologyCategoryStatsWidget;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTechnologyCategories extends ListRecords
{
    protected static string $resource = TechnologyCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            TechnologyCategoryStatsWidget::class,
            TechnologyCategoryChart::class,
        ];
    }
}
