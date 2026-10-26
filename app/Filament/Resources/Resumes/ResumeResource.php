<?php

namespace App\Filament\Resources\Resumes;

use App\Filament\Resources\Resumes\Pages\CreateResume;
use App\Filament\Resources\Resumes\Pages\EditResume;
use App\Filament\Resources\Resumes\Pages\ListResumes;
use App\Filament\Resources\Resumes\Schemas\ResumeForm;
use App\Filament\Resources\Resumes\Tables\ResumesTable;
use App\Models\Resume;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class ResumeResource extends Resource
{
    protected static ?string $model = Resume::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentArrowDown;

    protected static string|UnitEnum|null $navigationGroup = 'Profile & Bio';

    protected static ?int $navigationSort = 3;

    protected static ?string $modelLabel = 'Resume / CV';

    protected static ?string $pluralModelLabel = 'Resume & CV Documents';

    public static function form(Schema $schema): Schema
    {
        return ResumeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ResumesTable::configure($table);
    }

    public static function getWidgets(): array
    {
        return [
            \App\Filament\Resources\Resumes\Widgets\ResumeStatsWidget::class,
            \App\Filament\Resources\Resumes\Widgets\ResumeDownloadsChart::class,
        ];
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListResumes::route('/'),
            'create' => CreateResume::route('/create'),
            'edit' => EditResume::route('/{record}/edit'),
        ];
    }
}
