<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Certificate extends Model
{
    use HasTranslations;

    protected $fillable = ['name', 'description', 'issuer', 'issued_at', 'image', 'url'];
    public $translatable = ['name', 'description'];

    protected $casts = [
        'issued_at' => 'date',
    ];
}
