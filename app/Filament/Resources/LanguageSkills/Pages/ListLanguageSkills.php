<?php

namespace App\Filament\Resources\LanguageSkills\Pages;

use App\Filament\Resources\LanguageSkills\LanguageSkillResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLanguageSkills extends ListRecords
{
    protected static string $resource = LanguageSkillResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            \App\Filament\Resources\LanguageSkills\Widgets\LanguageSkillStatsWidget::class,
            \App\Filament\Resources\LanguageSkills\Widgets\LanguageSkillChart::class,
        ];
    }
}
