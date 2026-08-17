<?php

namespace App\Services;

use App\Contracts\Repositories\LanguageSkillRepositoryInterface;
use App\Contracts\Services\LanguageSkillServiceInterface;
use App\Models\LanguageSkill;
use Illuminate\Database\Eloquent\Collection;

class LanguageSkillService implements LanguageSkillServiceInterface
{
    public function __construct(
        protected LanguageSkillRepositoryInterface $repository
    ) {}

    public function getAllSkills(): Collection
    {
        return $this->repository->getAll();
    }

    public function getById(int $id): ?LanguageSkill
    {
        return $this->repository->findById($id);
    }

    public function create(array $data): LanguageSkill
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
