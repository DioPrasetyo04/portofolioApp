<?php

namespace App\Filament\Resources\Projects\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProjectsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('priority_order')
                    ->label('Priority')
                    ->sortable()
                    ->badge()
                    ->color('warning'),
                ImageColumn::make('image')
                    ->label('Cover')
                    ->rounded(),
                TextColumn::make('name')
                    ->label('Project Name')
                    ->getStateUsing(fn ($record) => is_array($record->name) ? ($record->name['en'] ?? reset($record->name)) : $record->name)
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('category')
                    ->label('Category')
                    ->badge()
                    ->color('primary')
                    ->sortable(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'in_progress' => 'warning',
                        'archived' => 'gray',
                        default => 'info',
                    })
                    ->sortable(),
                TextColumn::make('technologies.name')
                    ->label('Tech Stack')
                    ->badge()
                    ->color('info')
                    ->separator(','),
                ToggleColumn::make('is_featured')
                    ->label('Featured')
                    ->sortable(),
                TextColumn::make('year')
                    ->label('Year')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('demo_url')
                    ->label('Live Demo')
                    ->url(fn ($record) => $record->demo_url)
                    ->openUrlInNewTab()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('priority_order', 'asc')
            ->filters([
                TernaryFilter::make('is_featured')
                    ->label('Featured Only'),
                SelectFilter::make('category')
                    ->options([
                        'web' => 'Web App',
                        'mobile' => 'Mobile App',
                        'api' => 'API / Backend',
                        'fullstack' => 'Fullstack',
                        '3d' => '3D / Creative',
                        'tool' => 'Dev Tool',
                        'other' => 'Other',
                    ]),
                SelectFilter::make('status')
                    ->options([
                        'completed' => 'Completed',
                        'in_progress' => 'In Progress',
                        'archived' => 'Archived',
                    ]),
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
