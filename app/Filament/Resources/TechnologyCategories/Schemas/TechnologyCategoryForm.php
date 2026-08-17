<?php

namespace App\Filament\Resources\TechnologyCategories\Schemas;

use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class TechnologyCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Category Name (Multi-Language)')
                    ->description('e.g. Programming Languages, Frameworks, Database & Cloud, Tools')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('name.en')
                                ->label('Category Name (English)')
                                ->placeholder('e.g. Programming Languages')
                                ->required(),
                            TextInput::make('name.id')
                                ->label('Category Name (Indonesia)')
                                ->placeholder('e.g. Bahasa Pemrograman'),
                            TextInput::make('name.zh')
                                ->label('Category Name (Chinese)')
                                ->placeholder('e.g. 编程语言'),
                        ]),
                    ]),
            ]);
    }
}
