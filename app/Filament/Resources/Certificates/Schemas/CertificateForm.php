<?php

namespace App\Filament\Resources\Certificates\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CertificateForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Certificate Title (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('name.en')
                                ->label('Certificate Name (English)')
                                ->placeholder('e.g. AWS Certified Solutions Architect')
                                ->required(),
                            TextInput::make('name.id')
                                ->label('Certificate Name (Indonesia)')
                                ->placeholder('e.g. Sertifikasi Solusi Arsitek AWS'),
                            TextInput::make('name.zh')
                                ->label('Certificate Name (Chinese)')
                                ->placeholder('e.g. AWS认证解决方案架构师'),
                        ]),
                    ]),

                Section::make('Issuer & Verification')
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('issuer')
                                ->label('Issuing Organization')
                                ->placeholder('e.g. Amazon Web Services, Google, Coursera')
                                ->required(),
                            DatePicker::make('issued_at')
                                ->label('Issue Date'),
                            TextInput::make('url')
                                ->label('Credential Verification URL')
                                ->placeholder('https://...')
                                ->url(),
                        ]),
                    ]),

                Section::make('Certificate Description (Multi-Language)')
                    ->schema([
                        Grid::make(3)->schema([
                            Textarea::make('description.en')
                                ->label('Description (English)')
                                ->rows(3)
                                ->placeholder('Skills demonstrated and topics covered'),
                            Textarea::make('description.id')
                                ->label('Description (Indonesia)')
                                ->rows(3)
                                ->placeholder('Keahlian yang dibuktikan'),
                            Textarea::make('description.zh')
                                ->label('Description (Chinese)')
                                ->rows(3)
                                ->placeholder('相关专业技能说明'),
                        ]),
                    ]),

                Section::make('Certificate Image')
                    ->schema([
                        FileUpload::make('image')
                            ->label('Certificate Badge / Document Image')
                            ->image()
                            ->directory('certificates')
                            ->imageEditor()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
