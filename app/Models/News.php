<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class News extends Model
{
    use HasTranslations;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'detail_content',
        'image',
        'likes_count',
    ];

    public $translatable = ['title', 'short_description', 'detail_content'];

    public function comments(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}
