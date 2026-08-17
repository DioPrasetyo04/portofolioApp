<?php

namespace App\Filament\Resources\AboutMes\Pages;

use App\Filament\Resources\AboutMes\AboutMeResource;
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
}
