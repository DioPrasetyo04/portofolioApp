<?php

namespace App\Filament\Resources\LanguageSkills\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class LanguageSkillsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('logo')
                    ->label('Flag / Icon')
                    ->circular(),
                TextColumn::make('name')
                    ->label('Language')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('percentage')
                    ->label('Ability Level')
                    ->formatStateUsing(fn ($state) => ($state ?? 0) . '%')
                    ->badge()
                    ->color(fn ($state) => match (true) {
                        $state >= 90 => 'success',
                        $state >= 75 => 'info',
                        $state >= 50 => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('description')
                    ->label('Proficiency Summary')
                    ->getStateUsing(fn ($record) => is_array($record->description) ? ($record->description['en'] ?? reset($record->description)) : $record->description)
                    ->badge()
                    ->color('primary')
                    ->limit(35),
                TextColumn::make('media_count')
                    ->label('Media Items')
                    ->getStateUsing(function ($record) {
                        $count = count($record->media ?? []) + count($record->gallery ?? []) + ($record->video ? 1 : 0);
                        return $count > 0 ? "{$count} Media" : 'None';
                    })
                    ->badge()
                    ->color(fn ($state) => $state === 'None' ? 'gray' : 'success'),
                TextColumn::make('updated_at')
                    ->dateTime('d M Y')
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
