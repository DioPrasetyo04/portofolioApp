<?php

namespace App\Contracts\Repositories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

interface ProjectRepositoryInterface
{
    public function getAllWithTechnologies(): Collection;
    public function getFeatured(): Collection;
    public function getAll(): Collection;
    public function findById(int $id): ?Project;
    public function create(array $data): Project;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function syncTechnologies(Project $project, array $technologyIds): void;
}
