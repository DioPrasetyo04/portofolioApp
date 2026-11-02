<?php

namespace App\Filament\Resources\Experiences\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ColorColumn;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ExperiencesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('priority_order')
                    ->label('#')
                    ->sortable()
                    ->width('50px'),

                TextColumn::make('type')
                    ->label('Category')
                    ->badge()
                    ->colors([
                        'danger'  => 'work',
                        'primary' => 'education',
                        'warning' => 'organization',
                    ])
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'work'         => '💼 Work',
                        'education'    => '🎓 Education',
                        'organization' => '👥 Organization',
                        default        => ucfirst($state),
                    })
                    ->sortable(),

                TextColumn::make('role')
                    ->label('Role / Degree')
                    ->getStateUsing(fn ($record) => is_array($record->role) ? ($record->role['id'] ?? $record->role['en'] ?? reset($record->role)) : $record->role)
                    ->searchable()
                    ->weight('bold')
                    ->limit(35),

                TextColumn::make('company')
                    ->label('Company / University')
                    ->getStateUsing(fn ($record) => is_array($record->company) ? ($record->company['id'] ?? $record->company['en'] ?? reset($record->company)) : $record->company)
                    ->searchable()
                    ->limit(30),

                TextColumn::make('period')
                    ->label('Period')
                    ->getStateUsing(fn ($record) => is_array($record->period) ? ($record->period['id'] ?? $record->period['en'] ?? reset($record->period)) : $record->period)
                    ->badge()
                    ->color('gray'),

                TextColumn::make('media_count')
                    ->label('Media')
                    ->getStateUsing(fn ($record) => count($record->optimized_media ?? []))
                    ->badge()
                    ->color('info')
                    ->suffix(' files'),

                ColorColumn::make('accent_color')
                    ->label('Accent')
                    ->toggleable(),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),
            ])
            ->defaultSort('priority_order', 'asc')
            ->filters([
                SelectFilter::make('type')
                    ->label('Kategori Timeline')
                    ->options([
                        'work'         => '💼 Work Experience (Magang / Karier)',
                        'education'    => '🎓 Education History (Pendidikan)',
                        'organization' => '👥 Organization (Organisasi)',
                    ]),

                TernaryFilter::make('is_active')
                    ->label('Status Aktif')
                    ->boolean()
                    ->trueLabel('Aktif di Portfolio Saja')
                    ->falseLabel('Non-aktif Saja'),
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

