<?php

namespace App\Contracts\Repositories;

use App\Models\AboutMe;
use Illuminate\Database\Eloquent\Collection;

interface AboutMeRepositoryInterface
{
    public function getActive(): ?AboutMe;
    public function getAll(): Collection;
    public function findById(int $id): ?AboutMe;
    public function create(array $data): AboutMe;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
