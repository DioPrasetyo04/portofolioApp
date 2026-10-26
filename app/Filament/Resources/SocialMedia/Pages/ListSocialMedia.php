<?php

namespace App\Filament\Resources\SocialMedia\Pages;

use App\Filament\Resources\SocialMedia\SocialMediaResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListSocialMedia extends ListRecords
{
    protected static string $resource = SocialMediaResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Resources\SocialMedia\Widgets\SocialMediaStatsWidget::class,
            \App\Filament\Resources\SocialMedia\Widgets\SocialMediaChart::class,
        ];
    }
}
