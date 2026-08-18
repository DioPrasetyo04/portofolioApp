<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class AboutMe extends Model
{
    use HasTranslations;

    protected $fillable = [
        'projects_completed',
        'certifications',
        'years_experience',
        'description',
        'gallery_images',
        'skill_stats',
        'features',
        'expertise_tabs',
    ];

    public $translatable = ['description'];

    protected $casts = [
        'gallery_images'  => 'array',
        'skill_stats'     => 'array',
        'features'        => 'array',
        'expertise_tabs'  => 'array',
    ];
}
