<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Spatie\Translatable\HasTranslations;

class Project extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name', 'description', 'image', 'demo_url', 'repo_url',
        'is_featured', 'priority_order', 'status', 'likes_count', 'highlights', 'gallery', 'category', 'year',
    ];

    public $translatable = ['name', 'description'];

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    protected $casts = [
        'is_featured' => 'boolean',
        'priority_order' => 'integer',
        'highlights' => 'array',
        'gallery' => 'array',
    ];

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class);
    }
}
