<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Technology extends Model
{
    protected $fillable = ['technology_category_id', 'name', 'logo', 'proficiency'];

    protected $casts = [
        'proficiency' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(TechnologyCategory::class, 'technology_category_id');
    }

    public function projects(): BelongsToMany
    {
        return $this->belongsToMany(Project::class);
    }
}
