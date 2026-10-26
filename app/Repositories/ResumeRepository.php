<?php

namespace App\Repositories;

use App\Contracts\Repositories\ResumeRepositoryInterface;
use App\Models\Resume;
use Illuminate\Database\Eloquent\Collection;

class ResumeRepository implements ResumeRepositoryInterface
{
    public function getActive(): ?Resume
    {
        return Resume::query()
            ->where('is_active', true)
            ->latest('updated_at')
            ->first();
    }

    public function getAll(): Collection
    {
        return Resume::query()->latest('updated_at')->get();
    }

    public function findById(int $id): ?Resume
    {
        return Resume::find($id);
    }

    public function create(array $data): Resume
    {
        // If this new resume is active, optionally deactivate other resumes
        if (! empty($data['is_active'])) {
            Resume::query()->where('is_active', true)->update(['is_active' => false]);
        }

        return Resume::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $resume = $this->findById($id);
        if (! $resume) {
            return false;
        }

        if (! empty($data['is_active'])) {
            Resume::query()->where('id', '!=', $id)->where('is_active', true)->update(['is_active' => false]);
        }

        return $resume->update($data);
    }

    public function delete(int $id): bool
    {
        $resume = $this->findById($id);
        return $resume ? (bool) $resume->delete() : false;
    }

    public function incrementDownloads(int $id): void
    {
        Resume::query()->where('id', $id)->increment('download_count');
    }

    public function setActive(int $id): void
    {
        Resume::query()->where('id', '!=', $id)->update(['is_active' => false]);
        Resume::query()->where('id', $id)->update(['is_active' => true]);
    }
}
