<?php

namespace App\Contracts\Services;

use App\Models\LanguageSkill;
use Illuminate\Database\Eloquent\Collection;

interface LanguageSkillServiceInterface
{
    public function getAllSkills(): Collection;
    public function getById(int $id): ?LanguageSkill;
    public function create(array $data): LanguageSkill;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
