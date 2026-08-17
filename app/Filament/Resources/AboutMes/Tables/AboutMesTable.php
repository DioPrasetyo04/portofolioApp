<?php

namespace App\Filament\Resources\AboutMes\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AboutMesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('projects_completed')
                    ->label('Projects')
                    ->badge()
                    ->color('success')
                    ->sortable(),
                TextColumn::make('certifications')
                    ->label('Certifications')
                    ->badge()
                    ->color('warning')
                    ->sortable(),
                TextColumn::make('years_experience')
                    ->label('Experience (Yrs)')
                    ->badge()
                    ->color('info')
                    ->sortable(),
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
