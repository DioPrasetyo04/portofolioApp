<?php

namespace App\Contracts\Services;

use App\Models\HeroSection;
use Illuminate\Database\Eloquent\Collection;

interface HeroSectionServiceInterface
{
    public function getHeroData(): ?HeroSection;
    public function getAll(): Collection;
    public function getById(int $id): ?HeroSection;
    public function create(array $data): HeroSection;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
