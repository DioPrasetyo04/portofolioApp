<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Spatie\Translatable\HasTranslations;

class Resume extends Model
{
    use HasTranslations;

    protected $fillable = [
        'title',
        'file_path',
        'file_name',
        'version',
        'is_active',
        'download_count',
        'notes',
    ];

    public $translatable = ['title'];

    protected $casts = [
        'is_active' => 'boolean',
        'download_count' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function (Resume $resume) {
            // When setting this resume as active, deactivate other resumes
            if ($resume->is_active) {
                static::where('id', '!=', $resume->id)->update(['is_active' => false]);
            }

            // Automatically set file_name if empty
            if (empty($resume->file_name) && ! empty($resume->file_path)) {
                $resume->file_name = basename($resume->file_path);
            }
        });
    }

    protected $appends = [
        'file_url',
        'download_url',
    ];

    public function getFileUrlAttribute(): ?string
    {
        if (! $this->file_path) {
            return null;
        }

        return Storage::disk('public')->url($this->file_path);
    }

    public function getDownloadUrlAttribute(): string
    {
        return route('resume.download');
    }
}
