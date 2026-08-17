<?php

namespace App\Services;

use App\Contracts\Repositories\HeroSectionRepositoryInterface;
use App\Contracts\Services\HeroSectionServiceInterface;
use App\Models\HeroSection;
use Illuminate\Database\Eloquent\Collection;

class HeroSectionService implements HeroSectionServiceInterface
{
    public function __construct(
        protected HeroSectionRepositoryInterface $repository
    ) {}

    public function getHeroData(): ?HeroSection
    {
        return $this->repository->getActive();
    }

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function getById(int $id): ?HeroSection
    {
        return $this->repository->findById($id);
    }

    public function create(array $data): HeroSection
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
