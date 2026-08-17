<?php

namespace App\Filament\Resources\Announcements\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AnnouncementsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->label('Banner')
                    ->square(),
                TextColumn::make('title')
                    ->label('Announcement Title')
                    ->getStateUsing(fn ($record) => is_array($record->title) ? ($record->title['en'] ?? reset($record->title)) : $record->title)
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('status')
                    ->label('Status')
                    ->getStateUsing(function ($record) {
                        $now = now();
                        if ($record->start_time && $record->start_time > $now) {
                            return 'Scheduled';
                        }
                        if ($record->end_time && $record->end_time < $now) {
                            return 'Expired';
                        }
                        return 'Active Now';
                    })
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Active Now' => 'success',
                        'Scheduled' => 'warning',
                        'Expired' => 'danger',
                        default => 'gray',
                    }),
                TextColumn::make('start_time')
                    ->label('Starts')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
                TextColumn::make('end_time')
                    ->label('Ends')
                    ->dateTime('d M Y, H:i')
                    ->placeholder('Never')
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
