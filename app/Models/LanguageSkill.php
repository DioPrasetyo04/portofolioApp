<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class LanguageSkill extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name',
        'description',
        'detail',
        'logo',
        'photo',
        'percentage',
        'media',
        'gallery',
        'video',
    ];

    public $translatable = ['description', 'detail'];

    protected $casts = [
        'percentage' => 'integer',
        'media' => 'array',
        'gallery' => 'array',
    ];
}
