<?php

namespace App\Filament\Resources\TechnologyCategories;

use App\Filament\Resources\TechnologyCategories\Pages\CreateTechnologyCategory;
use App\Filament\Resources\TechnologyCategories\Pages\EditTechnologyCategory;
use App\Filament\Resources\TechnologyCategories\Pages\ListTechnologyCategories;
use App\Filament\Resources\TechnologyCategories\Schemas\TechnologyCategoryForm;
use App\Filament\Resources\TechnologyCategories\Tables\TechnologyCategoriesTable;
use App\Models\TechnologyCategory;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class TechnologyCategoryResource extends Resource
{
    protected static ?string $model = TechnologyCategory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFolder;

    protected static string|UnitEnum|null $navigationGroup = 'Portfolio & Skills';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return TechnologyCategoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TechnologyCategoriesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListTechnologyCategories::route('/'),
            'create' => CreateTechnologyCategory::route('/create'),
            'edit' => EditTechnologyCategory::route('/{record}/edit'),
        ];
    }
}
