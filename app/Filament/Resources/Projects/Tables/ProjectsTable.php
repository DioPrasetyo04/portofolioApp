<?php

namespace App\Filament\Resources\Projects\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Cover')
                    ->rounded(),
                TextColumn::make('name')
                    ->label('Project Name')
                    ->getStateUsing(fn ($record) => is_array($record->name) ? ($record->name['en'] ?? reset($record->name)) : $record->name)
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('technologies.name')
                    ->label('Tech Stack')
                    ->badge()
                    ->color('info')
                    ->separator(','),
                IconColumn::make('is_featured')
                    ->label('Featured')
                    ->boolean(),
                TextColumn::make('demo_url')
                    ->label('Live Demo')
                    ->url(fn ($record) => $record->demo_url)
                    ->openUrlInNewTab()
                    ->toggleable(),
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
