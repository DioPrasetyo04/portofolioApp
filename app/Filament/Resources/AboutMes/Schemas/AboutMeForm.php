<?php

namespace App\Filament\Resources\AboutMes\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class AboutMeForm
{
    /** Lucide icon options available in the frontend */
    private static function iconOptions(): array
    {
        return [
            'Code2'       => '💻 Code2',
            'Zap'         => '⚡ Zap',
            'Layers'      => '🗂️ Layers',
            'Monitor'     => '🖥️ Monitor',
            'GitBranch'   => '🔀 GitBranch',
            'Database'    => '🗄️ Database',
            'Globe'       => '🌐 Globe',
            'Server'      => '🖧 Server',
            'Layout'      => '🏗️ Layout',
            'Sparkles'    => '✨ Sparkles',
            'Briefcase'   => '💼 Briefcase',
            'Award'       => '🏆 Award',
            'Clock'       => '🕐 Clock',
            'Cpu'         => '⚙️ Cpu',
            'Flame'       => '🔥 Flame',
            'Terminal'    => '💻 Terminal',
            'Star'        => '⭐ Star',
            'CheckCircle2'=> '✅ CheckCircle2',
            'Activity'    => '📈 Activity',
        ];
    }

    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                /* ── Statistics / Counters ── */
                Section::make('Statistics / Counters')
                    ->description('Animated count-up numbers shown in the Overview tab')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('projects_completed')
                                ->label('Projects Completed')
                                ->numeric()->default(12)->required()->suffix('Projects'),
                            TextInput::make('certifications')
                                ->label('Certifications Count')
                                ->numeric()->default(8)->required()->suffix('Certs'),
                            TextInput::make('years_experience')
                                ->label('Years of Experience')
                                ->numeric()->default(3)->required()->suffix('Years'),
                        ]),
                    ]),

                /* ── Dynamic Feature Checklist ── */
                Section::make('Feature Checklist (Biography)')
                    ->description('Items shown below biography — each has an icon and label')
                    ->schema([
                        Repeater::make('features')
                            ->label('Features / Capabilities')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('name')
                                        ->label('Feature Name')
                                        ->placeholder('e.g. Modern Architecture & Clean Code')
                                        ->required(),
                                    Select::make('icon')
                                        ->label('Lucide Icon')
                                        ->options(self::iconOptions())
                                        ->default('CheckCircle2')
                                        ->required(),
                                ]),
                            ])
                            ->default([
                                ['name' => 'Modern Architecture & Clean Code', 'icon' => 'Code2'],
                                ['name' => 'RESTful & Real-time Integrations', 'icon' => 'Zap'],
                                ['name' => '3D Graphics & Shader Effects',     'icon' => 'Layers'],
                                ['name' => 'Responsive & Accessible UI/UX',    'icon' => 'Monitor'],
                                ['name' => 'Service & Repository Pattern',      'icon' => 'GitBranch'],
                                ['name' => 'Database Design & Optimization',    'icon' => 'Database'],
                            ])
                            ->addActionLabel('Add Feature')
                            ->maxItems(8)
                            ->columnSpanFull(),
                    ]),

                /* ── Expertise Tabs ── */
                Section::make('Expertise Tab Areas')
                    ->description('Tab navigation in the "Tech Expertise" card — e.g. Web Dev, Backend, Architecture')
                    ->schema([
                        Repeater::make('expertise_tabs')
                            ->label('Expertise Tabs')
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('id')
                                        ->label('Tab ID (slug)')
                                        ->placeholder('e.g. web, backend, architecture')
                                        ->required(),
                                    TextInput::make('label')
                                        ->label('Tab Label')
                                        ->placeholder('e.g. Web Dev')
                                        ->required(),
                                    Select::make('icon')
                                        ->label('Lucide Icon')
                                        ->options(self::iconOptions())
                                        ->default('Globe'),
                                ]),
                                TextInput::make('items')
                                    ->label('Tech Items (comma-separated)')
                                    ->placeholder('React.js, TypeScript, Vite, Tailwind CSS')
                                    ->helperText('Enter technologies separated by commas — they will be parsed into chips')
                                    ->afterStateHydrated(function ($state, $set) {
                                        if (is_array($state)) {
                                            $set('items', implode(', ', $state));
                                        }
                                    })
                                    ->dehydrateStateUsing(fn ($state) =>
                                        array_map('trim', explode(',', $state ?? ''))
                                    )
                                    ->columnSpanFull(),
                            ])
                            ->default([
                                ['id' => 'web',          'label' => 'Web Dev',      'icon' => 'Globe',     'items' => ['React.js', 'Next.js', 'Inertia.js', 'TypeScript', 'Vite', 'Tailwind CSS']],
                                ['id' => 'backend',      'label' => 'Backend',      'icon' => 'Server',    'items' => ['Laravel', 'Node.js', 'REST API', 'MySQL', 'Redis', 'Filament CMS']],
                                ['id' => 'architecture', 'label' => 'Architecture', 'icon' => 'Layout',    'items' => ['Repository Pattern', 'Service Layer', 'MVC / MVVM', 'SOLID Principles', 'DDD', 'Clean Code']],
                                ['id' => 'creative',     'label' => '3D / Creative','icon' => 'Sparkles',  'items' => ['Three.js', 'WebGL', 'GLSL Shaders', 'GSAP', 'Framer Motion', 'Blender']],
                            ])
                            ->addActionLabel('Add Expertise Tab')
                            ->maxItems(6)
                            ->columnSpanFull(),
                    ]),

                /* ── Skill Stats / Charts Data ── */
                Section::make('Skill Statistics (Charts Data)')
                    ->description('Data powering the Bar, Donut, and Line charts in the stats panel')
                    ->collapsed()
                    ->schema([
                        Section::make('Donut Chart — Skill Distribution %')
                            ->schema([
                                Repeater::make('skill_stats.skills')
                                    ->label('Skills')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('name')->label('Skill Name')->required(),
                                            TextInput::make('value')->label('% (0–100)')->numeric()->default(80)->required(),
                                            TextInput::make('color')->label('Hex Color')->placeholder('#8B5CF6')->default('#8B5CF6'),
                                        ]),
                                    ])
                                    ->default([
                                        ['name' => 'React.js / Three.js', 'value' => 90, 'color' => '#8B5CF6'],
                                        ['name' => 'Laravel / PHP',       'value' => 88, 'color' => '#22D3EE'],
                                        ['name' => 'TypeScript',          'value' => 85, 'color' => '#F59E0B'],
                                        ['name' => 'Database / DevOps',   'value' => 75, 'color' => '#10B981'],
                                    ])
                                    ->addActionLabel('Add Skill')
                                    ->columnSpanFull(),
                            ]),

                        Section::make('Bar Chart — Projects Per Year')
                            ->schema([
                                Repeater::make('skill_stats.projects_per_year')
                                    ->label('Annual Project Data')
                                    ->schema([
                                        Grid::make(2)->schema([
                                            TextInput::make('year')->label('Year')->required(),
                                            TextInput::make('count')->label('Projects Count')->numeric()->default(5)->required(),
                                        ]),
                                    ])
                                    ->default([
                                        ['year' => '2021', 'count' => 3], ['year' => '2022', 'count' => 6],
                                        ['year' => '2023', 'count' => 8], ['year' => '2024', 'count' => 7],
                                        ['year' => '2025', 'count' => 10],
                                    ])
                                    ->addActionLabel('Add Year')
                                    ->columnSpanFull(),
                            ]),

                        Section::make('Line Chart — Experience Growth')
                            ->schema([
                                Repeater::make('skill_stats.growth')
                                    ->label('Growth Data Points')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            TextInput::make('period')->label('Period'),
                                            TextInput::make('score')->label('Skill Score (0–100)')->numeric()->default(70),
                                            TextInput::make('projects')->label('Active Projects')->numeric()->default(2),
                                        ]),
                                    ])
                                    ->default([
                                        ['period' => '2021', 'score' => 60, 'projects' => 3],
                                        ['period' => '2022', 'score' => 70, 'projects' => 6],
                                        ['period' => '2023', 'score' => 80, 'projects' => 8],
                                        ['period' => '2024', 'score' => 88, 'projects' => 9],
                                        ['period' => '2025', 'score' => 95, 'projects' => 12],
                                    ])
                                    ->addActionLabel('Add Period')
                                    ->columnSpanFull(),
                            ]),
                    ]),

                /* ── Photo Gallery ── */
                Section::make('Photo Gallery (Carousel)')
                    ->description('Upload multiple photos — auto-slide every 2.5 seconds with fade effect')
                    ->schema([
                        FileUpload::make('gallery_images')
                            ->label('Gallery Photos')
                            ->image()->multiple()->maxFiles(10)
                            ->disk('public')
                            ->directory('about-gallery')
                            ->imageEditor()->reorderable()
                            ->columnSpanFull(),
                    ]),

                /* ── Biography (Multi-lang) ── */
                Section::make('Biography (Multi-Language)')
                    ->schema([
                        RichEditor::make('description.en')->label('Biography (English)')->required(),
                        RichEditor::make('description.id')->label('Biography (Indonesia)'),
                        RichEditor::make('description.zh')->label('Biography (Chinese)'),
                    ]),
            ]);
    }
}
