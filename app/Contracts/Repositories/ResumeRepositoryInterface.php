<?php

namespace App\Contracts\Repositories;

use App\Models\Resume;
use Illuminate\Database\Eloquent\Collection;

interface ResumeRepositoryInterface
{
    public function getActive(): ?Resume;

    public function getAll(): Collection;

    public function findById(int $id): ?Resume;

    public function create(array $data): Resume;

    public function update(int $id, array $data): bool;

    public function delete(int $id): bool;

    public function incrementDownloads(int $id): void;

    public function setActive(int $id): void;
}
