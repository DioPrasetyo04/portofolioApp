<?php

namespace App\Filament\Resources\Certificates\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CertificateForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                /* ── 1. Certificate Title (Multi-Language) ── */
                Section::make('Certificate Title (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('name.en')
                                ->label('Certificate Name (English)')
                                ->placeholder('e.g. AWS Certified Solutions Architect – Associate')
                                ->required(),
                            TextInput::make('name.id')
                                ->label('Certificate Name (Indonesia)')
                                ->placeholder('e.g. Sertifikasi Solusi Arsitek AWS – Rekanan')
                                ->required(),
                            TextInput::make('name.zh')
                                ->label('Certificate Name (Chinese)')
                                ->placeholder('e.g. AWS认证解决方案架构师 – 助理级')
                                ->required(),
                        ]),
                    ]),

                /* ── 2. Issuer, Category Icon & Credential Meta ── */
                Section::make('Issuer Organization & Verification')
                    ->description('Organisasi penerbit, logo/icon kategori, tanggal dan nomor kredensial')
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('issuer')
                                ->label('Issuing Organization / Authority')
                                ->placeholder('e.g. Amazon Web Services, Meta & Coursera, Bruno Simon')
                                ->required(),
                            FileUpload::make('issuer_icon')
                                ->label('Issuer / Category Icon (Logo)')
                                ->image()
                                ->disk('public')
                                ->directory('certificates/issuers')
                                ->imageEditor()
                                ->helperText('Logo atau icon kategori organisasi (misal icon AWS, Coursera, Meta, dll)'),
                        ]),
                        Grid::make(3)->schema([
                            DatePicker::make('issued_at')
                                ->label('Issue Date'),
                            TextInput::make('credential_id')
                                ->label('Credential / Certificate ID')
                                ->placeholder('e.g. AWS-PSA-2024-8891'),
                            TextInput::make('url')
                                ->label('Official Verification URL')
                                ->placeholder('https://www.credly.com/badges/...')
                                ->url(),
                        ]),
                    ]),

                /* ── 3. Short Summary for Card Preview ── */
                Section::make('Short Summary (Card Preview)')
                    ->description('Deskripsi ringkas yang tampil di dalam card (dibatasi line-clamp di frontend)')
                    ->schema([
                        Grid::make(3)->schema([
                            Textarea::make('description.en')
                                ->label('Short Summary (English)')
                                ->rows(3)
                                ->placeholder('Validated expertise in architecting secure, resilient, and high-performance cloud applications.'),
                            Textarea::make('description.id')
                                ->label('Short Summary (Indonesia)')
                                ->rows(3)
                                ->placeholder('Keahlian terbukti dalam merancang arsitektur aplikasi cloud yang aman dan berkinerja tinggi.'),
                            Textarea::make('description.zh')
                                ->label('Short Summary (Chinese)')
                                ->rows(3)
                                ->placeholder('在构建安全、高可用及高性能云端架构方面经过权威认证的专业能力。'),
                        ]),
                    ]),

                /* ── 4. Comprehensive About & Syllabus (Rich Editor for Popup Modal) ── */
                Section::make('Comprehensive About & Detail Information (Rich Editor for Popup Modal)')
                    ->description('Informasi mendalam dan silabus lengkap tentang sertifikat yang akan tampil saat card / tombol "Detail Certificate" diklik')
                    ->schema([
                        RichEditor::make('detail.en')
                            ->label('Full About & Details (English)')
                            ->placeholder('Describe the complete curriculum, exam domains, technical competencies verified, practical projects built, and accreditation details...'),
                        RichEditor::make('detail.id')
                            ->label('Full About & Details (Indonesia)')
                            ->placeholder('Jelaskan silabus lengkap, domain ujian yang diuji, kompetensi teknis yang divalidasi, proyek praktis, dan detail akreditasi...'),
                        RichEditor::make('detail.zh')
                            ->label('Full About & Details (Chinese)')
                            ->placeholder('详细说明完整的课程大纲、考核知识领域、经过验证的技术能力、实战项目及认证背景...'),
                    ]),

                /* ── 5. Certificate Images & Visual Resources ── */
                Section::make('Certificate Visual Resources')
                    ->description('Gambar sertifikat resmi, badge digital, atau tangkapan layar verifikasi')
                    ->schema([
                        Grid::make(2)->schema([
                            FileUpload::make('image')
                                ->label('Primary Certificate Image / Badge')
                                ->image()
                                ->disk('public')
                                ->directory('certificates/images')
                                ->imageEditor()
                                ->helperText('Gambar utama sertifikat yang tampil di dalam card dan header popup'),
                            FileUpload::make('gallery')
                                ->label('Supporting Badges / Gallery Images')
                                ->image()
                                ->multiple()
                                ->disk('public')
                                ->maxFiles(6)
                                ->directory('certificates/gallery')
                                ->reorderable(),
                        ]),
                    ]),
            ]);
    }
}
