<?php

namespace App\Repositories;

use App\Contracts\Repositories\ProjectRepositoryInterface;
use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function getAllWithTechnologies(): Collection
    {
        return Project::with('technologies')->latest()->get();
    }

    public function getFeatured(): Collection
    {
        return Project::with('technologies')->where('is_featured', true)->latest()->get();
    }

    public function getAll(): Collection
    {
        return Project::all();
    }

    public function findById(int $id): ?Project
    {
        return Project::with('technologies')->find($id);
    }

    public function create(array $data): Project
    {
        return Project::create($data);
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

    public function syncTechnologies(Project $project, array $technologyIds): void
    {
        $project->technologies()->sync($technologyIds);
    }
}
