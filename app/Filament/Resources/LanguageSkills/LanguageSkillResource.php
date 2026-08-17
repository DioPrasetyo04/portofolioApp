<?php

namespace App\Filament\Resources\LanguageSkills;

use App\Filament\Resources\LanguageSkills\Pages\CreateLanguageSkill;
use App\Filament\Resources\LanguageSkills\Pages\EditLanguageSkill;
use App\Filament\Resources\LanguageSkills\Pages\ListLanguageSkills;
use App\Filament\Resources\LanguageSkills\Schemas\LanguageSkillForm;
use App\Filament\Resources\LanguageSkills\Tables\LanguageSkillsTable;
use App\Models\LanguageSkill;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class LanguageSkillResource extends Resource
{
    protected static ?string $model = LanguageSkill::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedLanguage;

    protected static string|UnitEnum|null $navigationGroup = 'Portfolio & Skills';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return LanguageSkillForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LanguageSkillsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLanguageSkills::route('/'),
            'create' => CreateLanguageSkill::route('/create'),
            'edit' => EditLanguageSkill::route('/{record}/edit'),
        ];
    }
}
