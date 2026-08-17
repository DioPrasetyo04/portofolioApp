<?php

namespace App\Filament\Resources\LanguageSkills\Pages;

use App\Filament\Resources\LanguageSkills\LanguageSkillResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditLanguageSkill extends EditRecord
{
    protected static string $resource = LanguageSkillResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
