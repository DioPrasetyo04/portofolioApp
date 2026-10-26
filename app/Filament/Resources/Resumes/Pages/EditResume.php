<?php

namespace App\Filament\Resources\Resumes\Pages;

use App\Filament\Resources\Resumes\ResumeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditResume extends EditRecord
{
    protected static string $resource = ResumeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\Action::make('preview')
                ->label('Preview Current PDF')
                ->icon('heroicon-m-eye')
                ->color('gray')
                ->url(fn () => route('resume.preview', ['id' => $this->record->id]))
                ->openUrlInNewTab(),

            \Filament\Actions\Action::make('download')
                ->label('Download PDF')
                ->icon('heroicon-m-arrow-down-tray')
                ->color('primary')
                ->url(fn () => route('resume.download', ['id' => $this->record->id]))
                ->openUrlInNewTab(),

            DeleteAction::make(),
        ];
    }
}
