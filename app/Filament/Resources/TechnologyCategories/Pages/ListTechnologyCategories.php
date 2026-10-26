<?php

namespace App\Filament\Resources\TechnologyCategories\Pages;

use App\Filament\Resources\TechnologyCategories\TechnologyCategoryResource;
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
            \App\Filament\Resources\TechnologyCategories\Widgets\TechnologyCategoryStatsWidget::class,
            \App\Filament\Resources\TechnologyCategories\Widgets\TechnologyCategoryChart::class,
        ];
    }
}
