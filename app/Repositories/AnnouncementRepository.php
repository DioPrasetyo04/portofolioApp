<?php

namespace App\Repositories;

use App\Contracts\Repositories\AnnouncementRepositoryInterface;
use App\Models\Announcement;
use Illuminate\Database\Eloquent\Collection;

class AnnouncementRepository implements AnnouncementRepositoryInterface
{
    public function getActive(): Collection
    {
        $now = now();
        return Announcement::query()
            ->where(function ($q) use ($now) {
                $q->whereNull('start_time')->orWhere('start_time', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_time')->orWhere('end_time', '>=', $now);
            })
            ->latest()
            ->get();
    }

    public function getAll(): Collection
    {
        return Announcement::latest()->get();
    }

    public function findById(int $id): ?Announcement
    {
        return Announcement::find($id);
    }

    public function create(array $data): Announcement
    {
        return Announcement::create($data);
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
