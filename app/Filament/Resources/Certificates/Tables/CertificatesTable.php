<?php

namespace App\Filament\Resources\Certificates\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class CertificatesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Preview')
                    ->square(),
                TextColumn::make('name')
                    ->label('Certificate')
                    ->getStateUsing(fn ($record) => is_array($record->name) ? ($record->name['en'] ?? reset($record->name)) : $record->name)
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('issuer')
                    ->label('Issuer')
                    ->badge()
                    ->color('primary')
                    ->searchable(),
                TextColumn::make('issued_at')
                    ->label('Issued')
                    ->date('M Y')
                    ->sortable(),
                TextColumn::make('url')
                    ->label('Verify')
                    ->url(fn ($record) => $record->url)
                    ->openUrlInNewTab()
                    ->toggleable(),
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
