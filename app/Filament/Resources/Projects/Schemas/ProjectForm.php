<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Models\Technology;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Project Name (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('name.en')
                                ->label('Project Name (English)')
                                ->placeholder('e.g. AI-Powered 3D Portfolio Platform')
                                ->required(),
                            TextInput::make('name.id')
                                ->label('Project Name (Indonesia)')
                                ->placeholder('e.g. Platform Portofolio 3D Berbasis AI'),
                            TextInput::make('name.zh')
                                ->label('Project Name (Chinese)')
                                ->placeholder('e.g. AI驱动的3D作品集平台'),
                        ]),
                    ]),

                Section::make('Project Description (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            Textarea::make('description.en')
                                ->label('Description (English)')
                                ->rows(4)
                                ->placeholder('Highlight key features and impact of the project'),
                            Textarea::make('description.id')
                                ->label('Description (Indonesia)')
                                ->rows(4)
                                ->placeholder('Jelaskan fitur utama dan dampak proyek'),
                            Textarea::make('description.zh')
                                ->label('Description (Chinese)')
                                ->rows(4)
                                ->placeholder('详细描述项目特点和成效'),
                        ]),
                    ]),

                Section::make('Visuals & Links')
                    ->schema([
                        FileUpload::make('image')
                            ->label('Project Thumbnail / Cover')
                            ->image()
                            ->directory('projects')
                            ->imageEditor()
                            ->columnSpanFull(),
                        Grid::make(2)->schema([
                            TextInput::make('demo_url')
                                ->label('Live Demo / Website URL')
                                ->placeholder('https://example.com')
                                ->url(),
                            TextInput::make('repo_url')
                                ->label('Repository / GitHub URL')
                                ->placeholder('https://github.com/...')
                                ->url(),
                        ]),
                        Toggle::make('is_featured')
                            ->label('Featured Project')
                            ->helperText('Display this project prominently on the homepage')
                            ->default(true),
                    ]),

                Section::make('Tech Stack Used')
                    ->description('Select the technologies used in this project')
                    ->schema([
                        CheckboxList::make('technologies')
                            ->relationship('technologies', 'name')
                            ->columns(4)
                            ->searchable()
                            ->bulkToggleable(),
                    ]),
            ]);
    }
}
