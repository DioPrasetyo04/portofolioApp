<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class LanguageSkill extends Model
{
    use HasTranslations;

    protected $fillable = ['name', 'description', 'logo', 'photo'];
    public $translatable = ['description'];
}
