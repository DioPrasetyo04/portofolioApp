<?php

namespace App\Filament\Resources\Resumes\Tables;

use App\Models\Resume;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ResumesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                IconColumn::make('is_active')
                    ->label('Active (Live)')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('gray'),

                TextColumn::make('title')
                    ->label('Title (English / Default)')
                    ->getStateUsing(fn ($record) => is_array($record->title) ? ($record->title['en'] ?? reset($record->title)) : $record->title)
                    ->weight('bold')
                    ->searchable(),

                TextColumn::make('file_name')
                    ->label('Download Filename')
                    ->icon('heroicon-m-document-arrow-down')
                    ->limit(30),

                TextColumn::make('version')
                    ->label('Version')
                    ->badge()
                    ->color('info'),

                TextColumn::make('download_count')
                    ->label('Total Downloads')
                    ->badge()
                    ->color('success')
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
            ])
            ->recordActions([
                Action::make('preview')
                    ->label('Preview')
                    ->icon('heroicon-m-eye')
                    ->color('gray')
                    ->url(fn (Resume $record) => route('resume.preview', ['id' => $record->id]))
                    ->openUrlInNewTab(),

                Action::make('download')
                    ->label('Download')
                    ->icon('heroicon-m-arrow-down-tray')
                    ->color('primary')
                    ->url(fn (Resume $record) => route('resume.download', ['id' => $record->id]))
                    ->openUrlInNewTab(),

                Action::make('setActive')
                    ->label('Make Active')
                    ->icon('heroicon-m-check-badge')
                    ->color('success')
                    ->visible(fn (Resume $record) => ! $record->is_active)
                    ->requiresConfirmation()
                    ->action(function (Resume $record) {
                        Resume::query()->where('id', '!=', $record->id)->update(['is_active' => false]);
                        $record->update(['is_active' => true]);
                    }),

                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
