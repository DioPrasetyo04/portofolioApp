<?php

namespace App\Filament\Resources\TechnologyCategories\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class TechnologyCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Category (EN / Default)')
                    ->getStateUsing(fn ($record) => is_array($record->name) ? ($record->name['en'] ?? reset($record->name)) : $record->name)
                    ->searchable()
                    ->weight('bold'),
                TextColumn::make('technologies_count')
                    ->label('Technologies')
                    ->counts('technologies')
                    ->badge()
                    ->color('info'),
                TextColumn::make('created_at')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
