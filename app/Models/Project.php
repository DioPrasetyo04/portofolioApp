<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Project extends Model
{
    use HasTranslations;

    protected $fillable = ['name', 'description', 'image', 'demo_url', 'repo_url', 'is_featured'];
    public $translatable = ['name', 'description'];

    protected $casts = [
        'is_featured' => 'boolean',
    ];

    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class);
    }
}
