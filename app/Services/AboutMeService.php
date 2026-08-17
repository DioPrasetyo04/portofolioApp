<?php

namespace App\Services;

use App\Contracts\Repositories\AboutMeRepositoryInterface;
use App\Contracts\Services\AboutMeServiceInterface;
use App\Models\AboutMe;
use Illuminate\Database\Eloquent\Collection;

class AboutMeService implements AboutMeServiceInterface
{
    public function __construct(
        protected AboutMeRepositoryInterface $repository
    ) {}

    public function getAboutData(): ?AboutMe
    {
        return $this->repository->getActive();
    }

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function getById(int $id): ?AboutMe
    {
        return $this->repository->findById($id);
    }

    public function create(array $data): AboutMe
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
