<?php

namespace App\Contracts\Services;

use App\Models\TechnologyCategory;
use Illuminate\Database\Eloquent\Collection;

interface TechnologyCategoryServiceInterface
{
    public function getCategoriesWithTechnologies(): Collection;
    public function getAll(): Collection;
    public function getById(int $id): ?TechnologyCategory;
    public function create(array $data): TechnologyCategory;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
