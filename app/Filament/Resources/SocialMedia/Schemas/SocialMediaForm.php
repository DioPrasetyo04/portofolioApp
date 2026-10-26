<?php

namespace App\Filament\Resources\SocialMedia\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SocialMediaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Informasi Media Sosial')
                    ->description('Kelola platform, URL profil, dan upload logo/icon media sosial')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')
                                ->label('Platform Name')
                                ->placeholder('e.g. WhatsApp, LinkedIn, GitHub, Instagram')
                                ->required()
                                ->maxLength(255),
                            TextInput::make('url')
                                ->label('Profile URL / Link')
                                ->placeholder('https://wa.me/... or https://linkedin.com/in/...')
                                ->required()
                                ->url()
                                ->maxLength(255),
                        ]),
                        FileUpload::make('icon')
                            ->label('Icon Image (Logo)')
                            ->image()
                            ->disk('public')
                            ->visibility('public')
                            ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'])
                            ->maxSize(2048)
                            ->directory('social-media')
                            ->imageEditor()
                            ->helperText('Upload file logo/icon berupa gambar (PNG, JPG, JPEG, SVG, WebP) dengan ukuran maksimal 2 MB')
                            ->columnSpanFull(),
                        Toggle::make('is_active')
                            ->label('Active Status')
                            ->helperText('Aktifkan agar tampil di bagian Contact portfolio')
                            ->default(true)
                            ->required(),
                    ]),
            ]);
    }
}

