<?php

namespace App\Services;

use App\Contracts\Repositories\ProjectRepositoryInterface;
use App\Contracts\Services\ProjectServiceInterface;
use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;

class ProjectService implements ProjectServiceInterface
{
    public function __construct(
        protected ProjectRepositoryInterface $repository
    ) {}

    public function getAllProjects(): Collection
    {
        return $this->repository->getAllWithTechnologies();
    }

    public function getFeaturedProjects(): Collection
    {
        return $this->repository->getFeatured();
    }

    public function getById(int $id): ?Project
    {
        return $this->repository->findById($id);
    }

    public function create(array $data, array $technologyIds = []): Project
    {
        $project = $this->repository->create($data);
        if (!empty($technologyIds)) {
            $this->repository->syncTechnologies($project, $technologyIds);
        }
        return $project;
    }

    public function update(int $id, array $data, ?array $technologyIds = null): bool
    {
        $updated = $this->repository->update($id, $data);
        if ($updated && $technologyIds !== null) {
            $project = $this->repository->findById($id);
            if ($project) {
                $this->repository->syncTechnologies($project, $technologyIds);
            }
        }
        return $updated;
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
