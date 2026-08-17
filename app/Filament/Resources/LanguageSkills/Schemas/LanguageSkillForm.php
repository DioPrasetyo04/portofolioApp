<?php

namespace App\Filament\Resources\LanguageSkills\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class LanguageSkillForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Language Information')
                    ->schema([
                        TextInput::make('name')
                            ->label('Language Name')
                            ->placeholder('e.g. English, Bahasa Indonesia, Mandarin (Chinese)')
                            ->required(),
                        Grid::make(2)->schema([
                            FileUpload::make('logo')
                                ->label('Flag / Icon')
                                ->image()
                                ->directory('languages'),
                            FileUpload::make('photo')
                                ->label('Supporting Photo (Optional)')
                                ->image()
                                ->directory('languages'),
                        ]),
                    ]),

                Section::make('Proficiency Description (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('description.en')
                                ->label('Proficiency (English)')
                                ->placeholder('e.g. Professional Working Proficiency / Fluent'),
                            TextInput::make('description.id')
                                ->label('Proficiency (Indonesia)')
                                ->placeholder('e.g. Fasih / Bahasa Ibu'),
                            TextInput::make('description.zh')
                                ->label('Proficiency (Chinese)')
                                ->placeholder('e.g. 流利 / 专业工作水平'),
                        ]),
                    ]),
            ]);
    }
}
