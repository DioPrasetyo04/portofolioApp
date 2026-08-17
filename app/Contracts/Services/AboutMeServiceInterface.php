<?php

namespace App\Contracts\Services;

use App\Models\AboutMe;
use Illuminate\Database\Eloquent\Collection;

interface AboutMeServiceInterface
{
    public function getAboutData(): ?AboutMe;
    public function getAll(): Collection;
    public function getById(int $id): ?AboutMe;
    public function create(array $data): AboutMe;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
