<?php

namespace App\Repositories;

use App\Contracts\Repositories\AboutMeRepositoryInterface;
use App\Models\AboutMe;
use Illuminate\Database\Eloquent\Collection;

class AboutMeRepository implements AboutMeRepositoryInterface
{
    public function getActive(): ?AboutMe
    {
        return AboutMe::query()->latest()->first();
    }

    public function getAll(): Collection
    {
        return AboutMe::all();
    }

    public function findById(int $id): ?AboutMe
    {
        return AboutMe::find($id);
    }

    public function create(array $data): AboutMe
    {
        return AboutMe::create($data);
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
