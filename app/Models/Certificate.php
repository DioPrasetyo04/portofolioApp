<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Certificate extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name',
        'description',
        'detail',
        'issuer',
        'issuer_icon',
        'issued_at',
        'image',
        'gallery',
        'credential_id',
        'url',
        'likes_count',
    ];

    public $translatable = ['name', 'description', 'detail'];

    public function comments(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    protected $casts = [
        'issued_at' => 'date',
        'gallery' => 'array',
    ];
}
