<?php

namespace App\Repositories;

use App\Contracts\Repositories\TechnologyRepositoryInterface;
use App\Models\Technology;
use Illuminate\Database\Eloquent\Collection;

class TechnologyRepository implements TechnologyRepositoryInterface
{
    public function getAll(): Collection
    {
        return Technology::with('category')->get();
    }

    public function getByCategoryId(int $categoryId): Collection
    {
        return Technology::where('technology_category_id', $categoryId)->get();
    }

    public function findById(int $id): ?Technology
    {
        return Technology::find($id);
    }

    public function create(array $data): Technology
    {
        return Technology::create($data);
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
