<?php

namespace App\Filament\Resources\Resumes\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ResumeForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                /* ── 1. Resume Document Title (Multi-Language) ── */
                Section::make('Resume / CV Title (Multi-Language)')
                    ->description('Nama atau judul dokumen resume yang dapat disesuaikan per bahasa')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('title.en')
                                ->label('Title (English)')
                                ->placeholder('e.g. Dio Prasetyo - Software Engineer Resume')
                                ->required(),
                            TextInput::make('title.id')
                                ->label('Title (Indonesia)')
                                ->placeholder('e.g. Dio Prasetyo - Resume & CV Software Engineer')
                                ->required(),
                            TextInput::make('title.zh')
                                ->label('Title (Chinese)')
                                ->placeholder('e.g. Dio Prasetyo - 软件工程师 / 全栈开发者 简历')
                                ->required(),
                        ]),
                    ]),

                /* ── 2. Primary File Upload ── */
                Section::make('Resume File Document (PDF)')
                    ->description('Upload file dokumen CV / Resume resmi (format PDF) yang akan diunduh langsung oleh pengunjung website')
                    ->schema([
                        FileUpload::make('file_path')
                            ->label('Resume PDF File')
                            ->disk('public')
                            ->directory('resumes')
                            ->preserveFilenames()
                            ->acceptedFileTypes([
                                'application/pdf',
                            ])
                            ->downloadable()
                            ->openable()
                            ->maxSize(20480) // 20 MB
                            ->required()
                            ->helperText('Upload file PDF CV resmi Anda (misal: Dio_Prasetyo_CV.pdf). File ini langsung aktif dan dapat diunduh oleh pengunjung lewat tombol "Resume" di website.'),
                    ]),

                /* ── 3. File Metadata & Activation Status ── */
                Section::make('File Configuration & Deployment Status')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('file_name')
                                ->label('Custom Download Filename')
                                ->placeholder('e.g. Dio_Prasetyo_CV.pdf')
                                ->helperText('Nama file saat didownload oleh user melalui browser.'),
                            TextInput::make('version')
                                ->label('Version / Edition')
                                ->placeholder('e.g. 2026.1 / Q4 2026')
                                ->default('2026.1'),
                            Toggle::make('is_active')
                                ->label('Active Resume (Live on Navbar)')
                                ->helperText('Jika diaktifkan, resume ini akan menjadi resume utama yang langsung didownload dari navbar.')
                                ->default(true),
                        ]),
                        Grid::make(2)->schema([
                            TextInput::make('download_count')
                                ->label('Total Downloads Counter')
                                ->numeric()
                                ->default(0)
                                ->disabled()
                                ->helperText('Jumlah total download dari tombol Resume navbar'),
                            Textarea::make('notes')
                                ->label('Internal Changelog / Admin Notes')
                                ->placeholder('e.g. Updated latest internship at M-Knows Consulting & Dicoding Camp 2026')
                                ->rows(2),
                        ]),
                    ]),
            ]);
    }
}
