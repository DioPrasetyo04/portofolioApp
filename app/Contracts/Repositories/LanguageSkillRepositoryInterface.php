<?php

namespace App\Contracts\Repositories;

use App\Models\LanguageSkill;
use Illuminate\Database\Eloquent\Collection;

interface LanguageSkillRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): ?LanguageSkill;
    public function create(array $data): LanguageSkill;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
