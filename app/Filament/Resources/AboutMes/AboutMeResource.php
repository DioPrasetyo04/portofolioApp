<?php

namespace App\Filament\Resources\AboutMes;

use App\Filament\Resources\AboutMes\Pages\CreateAboutMe;
use App\Filament\Resources\AboutMes\Pages\EditAboutMe;
use App\Filament\Resources\AboutMes\Pages\ListAboutMes;
use App\Filament\Resources\AboutMes\Schemas\AboutMeForm;
use App\Filament\Resources\AboutMes\Tables\AboutMesTable;
use App\Models\AboutMe;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class AboutMeResource extends Resource
{
    protected static ?string $model = AboutMe::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUser;

    protected static string|UnitEnum|null $navigationGroup = 'Profile & Bio';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return AboutMeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return AboutMesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListAboutMes::route('/'),
            'create' => CreateAboutMe::route('/create'),
            'edit' => EditAboutMe::route('/{record}/edit'),
        ];
    }
}
