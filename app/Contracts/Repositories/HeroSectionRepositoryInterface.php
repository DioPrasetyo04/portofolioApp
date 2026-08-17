<?php

namespace App\Contracts\Repositories;

use App\Models\HeroSection;
use Illuminate\Database\Eloquent\Collection;

interface HeroSectionRepositoryInterface
{
    public function getActive(): ?HeroSection;
    public function getAll(): Collection;
    public function findById(int $id): ?HeroSection;
    public function create(array $data): HeroSection;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
