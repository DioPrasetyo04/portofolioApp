<?php

namespace App\Filament\Resources\Projects\Schemas;

use App\Models\Technology;
use Filament\Forms\Components\CheckboxList;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ProjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                /* ── Basic Info ── */
                Section::make('Project Name (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('name.en')
                                ->label('Project Name (English)')
                                ->placeholder('e.g. AI-Powered 3D Portfolio Platform')
                                ->required(),
                            TextInput::make('name.id')
                                ->label('Project Name (Indonesia)')
                                ->placeholder('e.g. Plat
                                is AI'),
                            TextInput::make('name.zh')
                                ->label('Project Name (Chinese)')
                                ->placeholder('e.g. AI驱动的3D作品集平台'),
                        ]),
                    ]),

                Section::make('Project Description (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            Textarea::make('description.en')
                                ->label('Description (English)')->rows(4)
                                ->placeholder('Highlight key features and impact of the project'),
                            Textarea::make('description.id')
                                ->label('Description (Indonesia)')->rows(4)
                                ->placeholder('Jelaskan fitur utama dan dampak proyek'),
                            Textarea::make('description.zh')
                                ->label('Description (Chinese)')->rows(4)
                                ->placeholder('详细描述项目特点和成效'),
                        ]),
                    ]),

                /* ── Project Meta ── */
                Section::make('Project Metadata')
                    ->description('Category, year, and status information used for filtering')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('category')
                                ->label('Category / Type')
                                ->options([
                                    'web'       => '🌐 Web Application',
                                    'mobile'    => '📱 Mobile App',
                                    'api'       => '⚡ API / Backend',
                                    'fullstack' => '🔧 Fullstack',
                                    '3d'        => '✨ 3D / Creative',
                                    'tool'      => '🛠️ Dev Tool',
                                    'other'     => '🔹 Other',
                                ])
                                ->searchable()
                                ->placeholder('Select category'),

                            TextInput::make('year')
                                ->label('Year Built')
                                ->placeholder('e.g. 2024')
                                ->maxLength(4),

                            Select::make('status')
                                ->label('Project Status')
                                ->options([
                                    'completed'   => '✅ Completed',
                                    'in_progress' => '🔄 In Progress',
                                    'archived'    => '📦 Archived',
                                ])
                                ->default('completed'),

                            TextInput::make('priority_order')
                                ->label('Priority Order')
                                ->numeric()
                                ->default(99)
                                ->helperText('Lower = shown first (1 = top priority)'),
                        ]),
                    ]),

                /* ── Featured & Highlights ── */
                Section::make('Featured Status & Highlights')
                    ->schema([
                        Toggle::make('is_featured')
                            ->label('Featured Project')
                            ->helperText('Show ⭐ Featured badge and prioritize on homepage')
                            ->default(true),

                        Repeater::make('highlights')
                            ->label('Project Highlights / Key Points')
                            ->schema([
                                TextInput::make('item')
                                    ->label('Highlight')
                                    ->placeholder('e.g. Built with React + Three.js for real-time 3D rendering')
                                    ->required(),
                            ])
                            ->default([
                                ['item' => 'Full-stack architecture with clean service/repository pattern'],
                                ['item' => 'Integrated real-time features with Laravel WebSockets'],
                                ['item' => 'Responsive design with dark/light mode support'],
                            ])
                            ->addActionLabel('Add Highlight')
                            ->maxItems(6)
                            ->columnSpanFull(),
                    ]),

                /* ── Visuals & Links ── */
                Section::make('Visuals & Links')
                    ->schema([
                        FileUpload::make('image')
                            ->label('Project Thumbnail / Cover')
                            ->image()
                            ->disk('public')
                            ->directory('projects')
                            ->imageEditor()
                            ->columnSpanFull(),

                        FileUpload::make('gallery')
                            ->label('Project Gallery (additional screenshots)')
                            ->image()
                            ->multiple()
                            ->disk('public')
                            ->maxFiles(8)
                            ->directory('projects/gallery')
                            ->reorderable()
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
                    ]),

                /* ── Tech Stack ── */
                Section::make('Tech Stack Used')
                    ->description('Select technologies used — icons are pulled from the Technology records')
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
