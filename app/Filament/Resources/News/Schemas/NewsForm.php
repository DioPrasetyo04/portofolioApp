<?php

namespace App\Filament\Resources\News\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class NewsForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Article Headline & Slug')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('title.en')
                                ->label('Title (English)')
                                ->placeholder('e.g. Exploring 3D Web Experiences with Three.js')
                                ->required()
                                ->live(onBlur: true)
                                ->afterStateUpdated(function (string $operation, $state, callable $set) {
                                    if ($operation === 'create' && is_string($state)) {
                                        $set('slug', Str::slug($state));
                                    }
                                }),
                            TextInput::make('title.id')
                                ->label('Title (Indonesia)')
                                ->placeholder('e.g. Eksplorasi Pengalaman Web 3D dengan Three.js'),
                            TextInput::make('title.zh')
                                ->label('Title (Chinese)')
                                ->placeholder('e.g. 使用Three.js探索3D网页体验'),
                        ]),
                        TextInput::make('slug')
                            ->label('URL Slug')
                            ->helperText('Unique slug used in web address (/news/your-slug)')
                            ->required()
                            ->unique(ignoreRecord: true),
                        FileUpload::make('image')
                            ->label('Cover Image')
                            ->image()
                            ->disk('public')
                            ->directory('news')
                            ->imageEditor()
                            ->columnSpanFull(),
                    ]),

                Section::make('Short Summary / Excerpt (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            Textarea::make('short_description.en')
                                ->label('Excerpt (English)')
                                ->rows(3)
                                ->placeholder('Brief teaser for the news card'),
                            Textarea::make('short_description.id')
                                ->label('Excerpt (Indonesia)')
                                ->rows(3)
                                ->placeholder('Ringkasan singkat untuk tampilan kartu'),
                            Textarea::make('short_description.zh')
                                ->label('Excerpt (Chinese)')
                                ->rows(3)
                                ->placeholder('新闻卡片的简要介绍'),
                        ]),
                    ]),

                Section::make('Full Article Content (Multi-Language)')
                    ->schema([
                        RichEditor::make('detail_content.en')
                            ->label('Content (English)')
                            ->fileAttachmentsDirectory('news/attachments')
                            ->columnSpanFull(),
                        RichEditor::make('detail_content.id')
                            ->label('Content (Indonesia)')
                            ->fileAttachmentsDirectory('news/attachments')
                            ->columnSpanFull(),
                        RichEditor::make('detail_content.zh')
                            ->label('Content (Chinese)')
                            ->fileAttachmentsDirectory('news/attachments')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
