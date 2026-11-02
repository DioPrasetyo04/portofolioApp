<?php

namespace App\Repositories;

use App\Contracts\Repositories\ExperienceRepositoryInterface;
use App\Models\Experience;
use Illuminate\Database\Eloquent\Collection;

class ExperienceRepository implements ExperienceRepositoryInterface
{
    public function getAllActive(): Collection
    {
        return Experience::where('is_active', true)
            ->orderBy('priority_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getActiveGrouped(): array
    {
        $all = $this->getAllActive();

        return [
            'work'         => $all->where('type', 'work')->values(),
            'education'    => $all->where('type', 'education')->values(),
            'organization' => $all->where('type', 'organization')->values(),
        ];
    }

    public function getAll(): Collection
    {
        return Experience::orderBy('priority_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function findById(int $id): ?Experience
    {
        return Experience::find($id);
    }

    public function create(array $data): Experience
    {
        if (isset($data['media']) && is_array($data['media'])) {
            $data['media'] = Experience::indexUploadedMedia($data['media']);
        }

        return Experience::create($data);
    }

    public function update(int $id, array $data): bool
    {
        $record = $this->findById($id);
        if (!$record) return false;

        if (isset($data['media']) && is_array($data['media'])) {
            $data['media'] = Experience::indexUploadedMedia($data['media']);
        }

        return $record->update($data);
    }

    public function delete(int $id): bool
    {
        $record = $this->findById($id);
        return $record ? (bool) $record->delete() : false;
    }
}

