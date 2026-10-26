<?php

namespace App\Filament\Resources\Announcements\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AnnouncementForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Announcement Headline (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('title.en')
                                ->label('Title (English)')
                                ->placeholder('e.g. Open for Freelance Projects & Full-time Roles!')
                                ->required(),
                            TextInput::make('title.id')
                                ->label('Title (Indonesia)')
                                ->placeholder('e.g. Terbuka untuk Proyek Freelance & Posisi Full-time!'),
                            TextInput::make('title.zh')
                                ->label('Title (Chinese)')
                                ->placeholder('e.g. 欢迎自由职业项目合作与全职工作机会！'),
                        ]),
                    ]),

                Section::make('Announcement Content (Multi-Language)')
                    ->schema([
                        RichEditor::make('description.en')
                            ->label('Details / Message (English)')
                            ->columnSpanFull(),
                        RichEditor::make('description.id')
                            ->label('Details / Message (Indonesia)')
                            ->columnSpanFull(),
                        RichEditor::make('description.zh')
                            ->label('Details / Message (Chinese)')
                            ->columnSpanFull(),
                    ]),

                Section::make('Scheduling & Banner')
                    ->description('Set when this announcement popup should appear on the website')
                    ->schema([
                        Grid::make(2)->schema([
                            DateTimePicker::make('start_time')
                                ->label('Active From (Start Time)')
                                ->default(now()),
                            DateTimePicker::make('end_time')
                                ->label('Active Until (End Time)')
                                ->helperText('Leave blank if no expiration date'),
                        ]),
                        FileUpload::make('image')
                            ->label('Popup Banner Image (Optional)')
                            ->image()
                            ->disk('public')
                            ->directory('announcements')
                            ->imageEditor()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
