<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class AboutMe extends Model
{
    use HasTranslations;

    protected $fillable = ['description', 'projects_completed', 'certifications', 'years_experience'];
    public $translatable = ['description'];
}
