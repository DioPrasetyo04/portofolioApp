<?php

namespace App\Contracts\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

interface ProjectServiceInterface
{
    public function getAllProjects(): Collection;
    public function getFeaturedProjects(): Collection;
    public function getById(int $id): ?Project;
    public function create(array $data, array $technologyIds = []): Project;
    public function update(int $id, array $data, ?array $technologyIds = null): bool;
    public function delete(int $id): bool;
}
