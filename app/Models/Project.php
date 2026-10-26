<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Project extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name', 'description', 'image', 'demo_url', 'repo_url',
        'is_featured', 'priority_order', 'status', 'likes_count', 'highlights', 'gallery', 'category', 'year',
    ];
    public $translatable = ['name', 'description'];

    public function comments(): \Illuminate\Database\Eloquent\Relations\MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    protected $casts = [
        'is_featured'   => 'boolean',
        'priority_order'=> 'integer',
        'highlights'    => 'array',
        'gallery'       => 'array',
    ];

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class);
    }
}
