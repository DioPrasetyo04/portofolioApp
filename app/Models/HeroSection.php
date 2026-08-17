<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class HeroSection extends Model
{
    use HasTranslations;

    protected $fillable = ['title', 'subtitle', 'image'];
    public $translatable = ['title', 'subtitle'];
}
