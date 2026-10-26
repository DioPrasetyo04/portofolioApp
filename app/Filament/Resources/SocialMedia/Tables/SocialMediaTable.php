<?php

namespace App\Filament\Resources\SocialMedia\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SocialMediaTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('icon')
                    ->label('Icon')
                    ->disk('public')
                    ->square()
                    ->getStateUsing(function ($record) {
                        if (!$record->icon) {
                            return null;
                        }
                        if (str_contains($record->icon, '/') || preg_match('/\.(png|jpe?g|svg|webp)$/i', $record->icon)) {
                            return $record->icon;
                        }
                        return null;
                    }),
                TextColumn::make('name')
                    ->label('Platform')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('url')
                    ->label('URL')
                    ->searchable()
                    ->limit(50),
                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}

