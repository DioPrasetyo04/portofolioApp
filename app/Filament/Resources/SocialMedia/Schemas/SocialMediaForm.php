<?php

namespace App\Filament\Resources\SocialMedia\Schemas;

use Filament\Schemas\Schema;

class SocialMediaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                \Filament\Forms\Components\TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                \Filament\Forms\Components\TextInput::make('url')
                    ->required()
                    ->url()
                    ->maxLength(255),
                \Filament\Forms\Components\TextInput::make('icon')
                    ->label('Icon Class or SVG')
                    ->maxLength(255)
                    ->helperText('e.g., bi-whatsapp, bi-instagram, or raw SVG'),
                \Filament\Forms\Components\Toggle::make('is_active')
                    ->default(true)
                    ->required(),
            ]);
    }
}
