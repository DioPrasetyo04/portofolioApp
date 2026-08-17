<?php

namespace App\Contracts\Services;

use App\Models\Technology;
use Illuminate\Database\Eloquent\Collection;

interface TechnologyServiceInterface
{
    public function getAllTechnologies(): Collection;
    public function getTechnologiesByCategory(int $categoryId): Collection;
    public function getById(int $id): ?Technology;
    public function create(array $data): Technology;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
