<?php

namespace App\Repositories;

use App\Contracts\Repositories\HeroSectionRepositoryInterface;
use App\Models\HeroSection;
use Illuminate\Database\Eloquent\Collection;

class HeroSectionRepository implements HeroSectionRepositoryInterface
{
    public function getActive(): ?HeroSection
    {
        return HeroSection::query()->latest()->first();
    }

    public function getAll(): Collection
    {
        return HeroSection::all();
    }

    public function findById(int $id): ?HeroSection
    {
        return HeroSection::find($id);
    }

    public function create(array $data): HeroSection
    {
        return HeroSection::create($data);
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
