<?php

namespace App\Services;

use App\Contracts\Repositories\AnnouncementRepositoryInterface;
use App\Contracts\Services\AnnouncementServiceInterface;
use App\Models\Announcement;
use Illuminate\Database\Eloquent\Collection;

class AnnouncementService implements AnnouncementServiceInterface
{
    public function __construct(
        protected AnnouncementRepositoryInterface $repository
    ) {}

    public function getActiveAnnouncements(): Collection
    {
        return $this->repository->getActive();
    }

    public function getAll(): Collection
    {
        return $this->repository->getAll();
    }

    public function getById(int $id): ?Announcement
    {
        return $this->repository->findById($id);
    }

    public function create(array $data): Announcement
    {
        return $this->repository->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->repository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->repository->delete($id);
    }
}
