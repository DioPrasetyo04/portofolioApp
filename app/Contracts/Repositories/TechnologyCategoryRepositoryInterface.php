<?php

namespace App\Contracts\Repositories;

use App\Models\TechnologyCategory;
use Illuminate\Database\Eloquent\Collection;

interface TechnologyCategoryRepositoryInterface
{
    public function getAllWithTechnologies(): Collection;
    public function getAll(): Collection;
    public function findById(int $id): ?TechnologyCategory;
    public function create(array $data): TechnologyCategory;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
