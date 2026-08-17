<?php

namespace App\Filament\Resources\HeroSections\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class HeroSectionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Headline / Main Title (Multi-Language)')
                    ->description('Set your catchy hero title in multiple languages')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('title.en')
                                ->label('Title (English)')
                                ->placeholder('e.g. Creative Fullstack Developer & 3D Enthusiast')
                                ->required(),
                            TextInput::make('title.id')
                                ->label('Title (Indonesia)')
                                ->placeholder('e.g. Pengembang Fullstack Kreatif & Peminat 3D'),
                            TextInput::make('title.zh')
                                ->label('Title (Chinese)')
                                ->placeholder('e.g. 创意全栈开发者与3D爱好者'),
                        ]),
                    ]),

                Section::make('Subtitle / Brief Bio (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            Textarea::make('subtitle.en')
                                ->label('Subtitle (English)')
                                ->rows(3)
                                ->placeholder('Short punchy bio introduction'),
                            Textarea::make('subtitle.id')
                                ->label('Subtitle (Indonesia)')
                                ->rows(3)
                                ->placeholder('Deskripsi perkenalan singkat'),
                            Textarea::make('subtitle.zh')
                                ->label('Subtitle (Chinese)')
                                ->rows(3)
                                ->placeholder('简短的个人介绍'),
                        ]),
                    ]),

                Section::make('Hero Visual Asset')
                    ->schema([
                        FileUpload::make('image')
                            ->label('Hero Avatar / Profile Photo')
                            ->image()
                            ->directory('hero')
                            ->imageEditor()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
