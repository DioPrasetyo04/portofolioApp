<?php

namespace App\Repositories;

use App\Contracts\Repositories\LanguageSkillRepositoryInterface;
use App\Models\LanguageSkill;
use Illuminate\Database\Eloquent\Collection;

class LanguageSkillRepository implements LanguageSkillRepositoryInterface
{
    public function getAll(): Collection
    {
        return LanguageSkill::all();
    }

    public function findById(int $id): ?LanguageSkill
    {
        return LanguageSkill::find($id);
    }

    public function create(array $data): LanguageSkill
    {
        return LanguageSkill::create($data);
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
}
