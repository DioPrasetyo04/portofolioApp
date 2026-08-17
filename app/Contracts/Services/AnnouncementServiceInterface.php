<?php

namespace App\Contracts\Services;

use App\Models\Announcement;
use Illuminate\Database\Eloquent\Collection;

interface AnnouncementServiceInterface
{
    public function getActiveAnnouncements(): Collection;
    public function getAll(): Collection;
    public function getById(int $id): ?Announcement;
    public function create(array $data): Announcement;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
