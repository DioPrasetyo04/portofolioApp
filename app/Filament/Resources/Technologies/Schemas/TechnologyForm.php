<?php

namespace App\Filament\Resources\Technologies\Schemas;

use App\Models\TechnologyCategory;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class TechnologyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Technology Information')
                    ->schema([
                        Select::make('technology_category_id')
                            ->label('Category')
                            ->options(function () {
                                return TechnologyCategory::all()->mapWithKeys(function ($cat) {
                                    $name = is_array($cat->name) ? ($cat->name['en'] ?? reset($cat->name)) : $cat->name;
                                    return [$cat->id => $name];
                                });
                            })
                            ->required()
                            ->searchable()
                            ->preload(),
                        TextInput::make('name')
                            ->label('Technology Name')
                            ->placeholder('e.g. React, TypeScript, Laravel, Three.js')
                            ->required(),
                        FileUpload::make('logo')
                            ->label('Technology Logo / Icon')
                            ->image()
                            ->directory('technologies')
                            ->imageEditor(),
                    ]),
            ]);
    }
}
