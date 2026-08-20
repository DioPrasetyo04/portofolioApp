<?php

namespace App\Filament\Resources\LanguageSkills\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class LanguageSkillForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                /* ── 1. Basic Language Info ── */
                Section::make('Language Information')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name')
                                ->label('Language Name')
                                ->placeholder('e.g. English, Bahasa Indonesia, Mandarin (Chinese)')
                                ->required(),
                            TextInput::make('percentage')
                                ->label('Ability & Skill Level (%)')
                                ->numeric()
                                ->minValue(0)
                                ->maxValue(100)
                                ->default(85)
                                ->suffix('%')
                                ->helperText('Persentase tingkat kebisaan / kemampuan profesional untuk bar chart (0 - 100%)')
                                ->required(),
                        ]),
                        Grid::make(2)->schema([
                            FileUpload::make('logo')
                                ->label('Flag / Icon (Logo)')
                                ->image()
                                ->directory('languages/logos')
                                ->imageEditor(),
                            FileUpload::make('photo')
                                ->label('Primary Cover Photo (Optional)')
                                ->image()
                                ->directory('languages/covers')
                                ->imageEditor(),
                        ]),
                    ]),

                /* ── 2. Short Description for Card Preview ── */
                Section::make('Short Summary / Level Description (Card Preview)')
                    ->description('Deskripsi singkat yang tampil di dalam kartu (dibatasi line-clamp di frontend)')
                    ->schema([
                        Grid::make(3)->schema([
                            Textarea::make('description.en')
                                ->label('Summary (English)')
                                ->rows(3)
                                ->placeholder('e.g. Professional Working Proficiency (C1/C2) with technical documentation fluency.'),
                            Textarea::make('description.id')
                                ->label('Summary (Indonesia)')
                                ->rows(3)
                                ->placeholder('e.g. Tingkat Kerja Profesional (C1/C2) dengan kefasihan dokumentasi teknis.'),
                            Textarea::make('description.zh')
                                ->label('Summary (Chinese)')
                                ->rows(3)
                                ->placeholder('e.g. 专业工作水平 (C1/C2)，具备流畅的技术文档编写能力。'),
                        ]),
                    ]),

                /* ── 3. Rich Editor for Full Details Popup Modal ── */
                Section::make('Detailed Mastery & Professional Experience (Rich Editor for Popup Modal)')
                    ->description('Isi konten lengkap yang akan tampil ketika tombol "Lihat Detail" diklik')
                    ->schema([
                        RichEditor::make('detail.en')
                            ->label('Full Details (English)')
                            ->placeholder('Describe language background, certifications (IELTS/TOEFL/HSK), communication experiences, and specialized domain vocabularies...'),
                        RichEditor::make('detail.id')
                            ->label('Full Details (Indonesia)')
                            ->placeholder('Jelaskan latar belakang bahasa, sertifikasi resmi, pengalaman komunikasi profesional, dan kosakata bidang teknis...'),
                        RichEditor::make('detail.zh')
                            ->label('Full Details (Chinese)')
                            ->placeholder('详细说明语言背景、官方认证考试、跨国团队沟通经验以及专业技术词汇掌握程度...'),
                    ]),

                /* ── 4. Media Resources (Swiper / Carousel: Images & Videos) ── */
                Section::make('Media Gallery & Resources (Carousel & Swiper)')
                    ->description('Dapat menambahkan beberapa gambar dan video yang bisa di-swipe di dalam kartu dan popup modal')
                    ->schema([
                        FileUpload::make('gallery')
                            ->label('Photo Gallery (Multiple Images for Swiper)')
                            ->image()
                            ->multiple()
                            ->maxFiles(8)
                            ->directory('languages/gallery')
                            ->reorderable()
                            ->columnSpanFull(),

                        TextInput::make('video')
                            ->label('Featured Video URL / Stream (Optional)')
                            ->placeholder('https://www.youtube.com/watch?v=... atau URL video MP4')
                            ->columnSpanFull(),

                        Repeater::make('media')
                            ->label('Interactive Media Items (Images & Videos)')
                            ->schema([
                                Grid::make(3)->schema([
                                    Select::make('type')
                                        ->label('Media Type')
                                        ->options([
                                            'image' => '🖼️ Image',
                                            'video' => '🎥 Video',
                                        ])
                                        ->default('image')
                                        ->required(),

                                    FileUpload::make('file')
                                        ->label('Upload Media File')
                                        ->directory('languages/media')
                                        ->maxSize(20480),

                                    TextInput::make('url')
                                        ->label('External Media / Video URL')
                                        ->placeholder('https://...'),
                                ]),
                                TextInput::make('caption')
                                    ->label('Caption / Title')
                                    ->placeholder('e.g. International Conference Presentation / Certification Exam Result'),
                            ])
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['caption'] ?? ($state['type'] ?? 'Media Item'))
                            ->addActionLabel('Add Media Item')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
