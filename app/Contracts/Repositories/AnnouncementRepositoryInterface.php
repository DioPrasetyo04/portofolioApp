<?php

namespace App\Contracts\Repositories;

use App\Models\Announcement;
use Illuminate\Database\Eloquent\Collection;

interface AnnouncementRepositoryInterface
{
    public function getActive(): Collection;
    public function getAll(): Collection;
    public function findById(int $id): ?Announcement;
    public function create(array $data): Announcement;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
