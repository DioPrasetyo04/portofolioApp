<?php

namespace App\Filament\Resources\HeroSections\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class HeroSectionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Avatar / Photo')
                    ->circular(),
                TextColumn::make('title')
                    ->label('Title (EN / Default)')
                    ->getStateUsing(fn ($record) => is_array($record->title) ? ($record->title['en'] ?? reset($record->title)) : $record->title)
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('subtitle')
                    ->label('Subtitle')
                    ->getStateUsing(fn ($record) => is_array($record->subtitle) ? ($record->subtitle['en'] ?? reset($record->subtitle)) : $record->subtitle)
                    ->limit(50),
                TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
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
