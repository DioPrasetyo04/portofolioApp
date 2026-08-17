<?php

namespace App\Filament\Resources\AboutMes\Schemas;

use Filament\Forms\Components\Grid;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class AboutMeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Statistics / Counters')
                    ->description('These numbers will animate with a count-up effect in the frontend')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('projects_completed')
                                ->label('Projects Completed')
                                ->numeric()
                                ->default(12)
                                ->required()
                                ->suffix('Projects'),
                            TextInput::make('certifications')
                                ->label('Certifications Count')
                                ->numeric()
                                ->default(8)
                                ->required()
                                ->suffix('Certs'),
                            TextInput::make('years_experience')
                                ->label('Years of Experience')
                                ->numeric()
                                ->default(3)
                                ->required()
                                ->suffix('Years'),
                        ]),
                    ]),

                Section::make('About Me Biography (Multi-Language)')
                    ->schema([
                        RichEditor::make('description.en')
                            ->label('Biography (English)')
                            ->required(),
                        RichEditor::make('description.id')
                            ->label('Biography (Indonesia)'),
                        RichEditor::make('description.zh')
                            ->label('Biography (Chinese)'),
                    ]),
            ]);
    }
}
