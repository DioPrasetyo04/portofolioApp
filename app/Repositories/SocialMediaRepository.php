<?php

namespace App\Repositories;

use App\Contracts\Repositories\SocialMediaRepositoryInterface;
use App\Models\SocialMedia;
use Illuminate\Database\Eloquent\Collection;

class SocialMediaRepository implements SocialMediaRepositoryInterface
{
    public function getActive(): Collection
    {
        return SocialMedia::where('is_active', true)->get();
    }

    public function getAll(): Collection
    {
        return SocialMedia::all();
    }

    public function findById(int $id): ?SocialMedia
    {
        return SocialMedia::find($id);
    }

    public function create(array $data): SocialMedia
    {
        return SocialMedia::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $record = $this->findById($id);
        return $record ? $record->update($data) : false;
    }

    public function delete(int $id): bool
    {
        $record = $this->findById($id);
        return $record ? (bool) $record->delete() : false;
    }
}
