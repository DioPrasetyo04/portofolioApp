<?php

namespace App\Contracts\Repositories;

use App\Models\Technology;
use Illuminate\Database\Eloquent\Collection;

interface TechnologyRepositoryInterface
{
    public function getAll(): Collection;
    public function getByCategoryId(int $categoryId): Collection;
    public function findById(int $id): ?Technology;
    public function create(array $data): Technology;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
