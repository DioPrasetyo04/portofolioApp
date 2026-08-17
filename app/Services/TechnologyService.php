<?php

namespace App\Services;

use App\Contracts\Repositories\TechnologyRepositoryInterface;
use App\Contracts\Services\TechnologyServiceInterface;
use App\Models\Technology;
use Illuminate\Database\Eloquent\Collection;

class TechnologyService implements TechnologyServiceInterface
{
    public function __construct(
        protected TechnologyRepositoryInterface $repository
    ) {}

    public function getAllTechnologies(): Collection
    {
        return $this->repository->getAll();
    }

    public function getTechnologiesByCategory(int $categoryId): Collection
    {
        return $this->repository->getByCategoryId($categoryId);
    }

    public function getById(int $id): ?Technology
    {
        return $this->repository->findById($id);
    }

    public function create(array $data): Technology
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
