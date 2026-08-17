<?php

namespace App\Services;

use App\Contracts\Repositories\TechnologyCategoryRepositoryInterface;
use App\Contracts\Services\TechnologyCategoryServiceInterface;
use App\Models\TechnologyCategory;
use Illuminate\Database\Eloquent\Collection;

class TechnologyCategoryService implements TechnologyCategoryServiceInterface
{
    public function __construct(
        protected TechnologyCategoryRepositoryInterface $repository
    ) {}

    public function getCategoriesWithTechnologies(): Collection
    {
        return $this->repository->getAllWithTechnologies();
    }

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function getById(int $id): ?TechnologyCategory
    {
        return $this->repository->findById($id);
    }

    public function create(array $data): TechnologyCategory
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
