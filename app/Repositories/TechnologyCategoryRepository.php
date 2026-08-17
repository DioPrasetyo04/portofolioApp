<?php

namespace App\Repositories;

use App\Contracts\Repositories\TechnologyCategoryRepositoryInterface;
use App\Models\TechnologyCategory;
use Illuminate\Database\Eloquent\Collection;

class TechnologyCategoryRepository implements TechnologyCategoryRepositoryInterface
{
    public function getAllWithTechnologies(): Collection
    {
        return TechnologyCategory::with('technologies')->get();
    }

    public function getAll(): Collection
    {
        return TechnologyCategory::all();
    }

    public function findById(int $id): ?TechnologyCategory
    {
        return TechnologyCategory::find($id);
    }

    public function create(array $data): TechnologyCategory
    {
        return TechnologyCategory::create($data);
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
