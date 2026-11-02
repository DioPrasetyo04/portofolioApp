<?php

namespace App\Filament\Resources\Experiences\Schemas;

use App\Models\Experience;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ExperienceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                /* ── Category & Classification ── */
                Section::make('Category & Appearance')
                    ->description('Tipe perjalanan, ikon penanda, aksen warna timeline, serta urutan prioritas.')
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('type')
                                ->label('Timeline Category')
                                ->options([
                                    'work' => '💼 Work Experience (Magang / Karier)',
                                    'education' => '🎓 Education (Pendidikan / Bootcamp)',
                                    'organization' => '👥 Organization (Organisasi & Kepemimpinan)',
                                ])
                                ->required()
                                ->default('work')
                                ->native(false)
                                ->live()
                                ->afterStateUpdated(function (?string $state, callable $set) {
                                    if ($state === 'education') {
                                        $set('icon', 'graduation');
                                        $set('accent_color', '#3B82F6');
                                        $set('badge_type.en', 'Academic Degree');
                                        $set('badge_type.id', 'Pendidikan Formal');
                                        $set('badge_type.zh', '本科学历');
                                    } elseif ($state === 'organization') {
                                        $set('icon', 'organization');
                                        $set('accent_color', '#8B5CF6');
                                        $set('badge_type.en', 'Organizational Leadership');
                                        $set('badge_type.id', 'Kepemimpinan Organisasi');
                                        $set('badge_type.zh', '学生会核心领导');
                                    } else {
                                        $set('icon', 'briefcase');
                                        $set('accent_color', '#EF4444');
                                        $set('badge_type.en', 'Industry Internship');
                                        $set('badge_type.id', 'Magang Industri');
                                        $set('badge_type.zh', '企业实习');
                                    }
                                }),

                            Select::make('icon')
                                ->label('Timeline Icon')
                                ->options([
                                    'briefcase' => 'Briefcase (Kerja)',
                                    'graduation' => 'Graduation Cap (Kuliah)',
                                    'organization' => 'Users / Community (Organisasi)',
                                    'award' => 'Award (Sertifikasi / Bootcamp)',
                                    'book' => 'Book (Sekolah Menengah)',
                                ])
                                ->default('briefcase')
                                ->native(false),

                            ColorPicker::make('accent_color')
                                ->label('Accent Node Color')
                                ->default('#EF4444'),

                            TextInput::make('priority_order')
                                ->label('Priority Order')
                                ->numeric()
                                ->default(1)
                                ->helperText('Urutan tampil (1 = paling atas)'),
                        ]),

                        Toggle::make('is_active')
                            ->label('Tampilkan di Website Portfolio')
                            ->default(true),
                    ]),

                /* ── Multi-Language Role & Degree Title ── */
                Section::make('Role / Degree Title (Multi-Language)')
                    ->description('Posisi magang, pekerjaan, atau gelar akademik.')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('role.en')
                                ->label('Role / Degree (English)')
                                ->placeholder('e.g. Internship Full-Stack Developer')
                                ->required(),
                            TextInput::make('role.id')
                                ->label('Posisi / Gelar (Indonesia)')
                                ->placeholder('Contoh: Internship Full-Stack Developer'),
                            TextInput::make('role.zh')
                                ->label('职位 / 学位 (Chinese)')
                                ->placeholder('例: 全栈开发实习生'),
                        ]),
                    ]),

                /* ── Multi-Language Company / Institution ── */
                Section::make('Company / Institution & Location (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('company.en')
                                ->label('Company / University (English)')
                                ->placeholder('e.g. PT. Indotech Energi Persada')
                                ->required(),
                            TextInput::make('company.id')
                                ->label('Perusahaan / Kampus (Indonesia)')
                                ->placeholder('Contoh: PT. Indotech Energi Persada'),
                            TextInput::make('company.zh')
                                ->label('公司 / 机构 (Chinese)')
                                ->placeholder('例: PT. Indotech Energi Persada'),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('location.en')
                                ->label('Location (English)')
                                ->placeholder('e.g. Jakarta, ID')
                                ->default('Jakarta, ID'),
                            TextInput::make('location.id')
                                ->label('Lokasi (Indonesia)')
                                ->placeholder('Contoh: Jakarta, ID')
                                ->default('Jakarta, ID'),
                            TextInput::make('location.zh')
                                ->label('地区 (Chinese)')
                                ->placeholder('例: 雅加达，印尼')
                                ->default('雅加达，印尼'),
                        ]),
                    ]),

                /* ── Period & Badge Type ── */
                Section::make('Period & Badge Type (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('period.en')
                                ->label('Period (English)')
                                ->placeholder('e.g. Mar 2025 - Jun 2025')
                                ->required(),
                            TextInput::make('period.id')
                                ->label('Periode (Indonesia)')
                                ->placeholder('Contoh: Mar 2025 - Jun 2025'),
                            TextInput::make('period.zh')
                                ->label('时间段 (Chinese)')
                                ->placeholder('例: 2025年3月 - 2025年6月'),
                        ]),
                        Grid::make(3)->schema([
                            TextInput::make('badge_type.en')
                                ->label('Badge Type (English)')
                                ->placeholder('e.g. Industry Internship / Degree')
                                ->default('Industry Internship'),
                            TextInput::make('badge_type.id')
                                ->label('Badge Tipe (Indonesia)')
                                ->placeholder('Contoh: Magang Industri / Gelar Sarjana')
                                ->default('Magang Industri'),
                            TextInput::make('badge_type.zh')
                                ->label('标签类型 (Chinese)')
                                ->placeholder('例: 企业实习 / 本科学历')
                                ->default('企业实习'),
                        ]),
                    ]),

                /* ── Key Highlights / Bullet Points ── */
                Section::make('Key Responsibilities & Highlights')
                    ->description('Daftar pencapaian atau tanggung jawab utama.')
                    ->schema([
                        Repeater::make('points')
                            ->label('Tanggung Jawab / Poin Pencapaian')
                            ->simple(
                                TextInput::make('item')
                                    ->placeholder('Contoh: Mengembangkan fitur aplikasi web menggunakan Next.js dan Flutter')
                                    ->required()
                            )
                            ->addActionLabel('+ Tambah Poin Tanggung Jawab')
                            ->default([
                                'Mengembangkan fitur web dan mobile menggunakan Next.js & Flutter',
                                'Membangun fungsionalitas CRUD database terintegrasi',
                                'Melakukan testing, debugging dan optimasi performa sistem',
                            ])
                            ->columnSpanFull(),
                    ]),

                /* ── Applied Technologies & Skills ── */
                Section::make('Applied Skills & Tech Stack')
                    ->schema([
                        TagsInput::make('skills')
                            ->label('Skills & Technologies Tags')
                            ->placeholder('Ketik tag lalu tekan Enter (contoh: Next.js, Flutter, CRUD, MySQL)')
                            ->default(['Next.js', 'Flutter', 'JavaScript', 'CSS3', 'CRUD'])
                            ->columnSpanFull(),
                    ]),

                /* ── Media Upload with Storage Limit & Auto Indexing ── */
                Section::make('Media Gallery: Images & Videos')
                    ->description('Upload dokumentasi visual proyek, tangkapan layar sistem, sertifikat atau video demo singkat.')
                    ->schema([
                        FileUpload::make('media')
                            ->label('Foto & Video Dokumentasi')
                            ->multiple()
                            ->reorderable()
                            ->disk('public')
                            ->directory('experiences')
                            ->maxFiles(6)
                            ->maxSize(Experience::MAX_SINGLE_FILE_KB)
                            ->acceptedFileTypes([
                                'image/jpeg',
                                'image/png',
                                'image/webp',
                                'image/gif',
                                'image/svg+xml',
                                'video/mp4',
                                'video/webm',
                                'video/quicktime',
                            ])
                            ->helperText('💡 Maksimal 6 file. Batas ukuran: Gambar hingga 5MB, Video MP4/WebM hingga 25MB (Total storage maksimal per entri 50MB). File otomatis diindeks dimensi & metadatanya, serta dimuat secara lazy loading di antarmuka website agar tidak menyebabkan lagging.')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
