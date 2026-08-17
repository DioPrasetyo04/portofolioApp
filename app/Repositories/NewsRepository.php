<?php

namespace App\Repositories;

use App\Contracts\Repositories\NewsRepositoryInterface;
use App\Models\News;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class NewsRepository implements NewsRepositoryInterface
{
    public function getLatest(int $limit = 6): Collection
    {
        return News::latest()->limit($limit)->get();
    }

    public function getPaginated(int $perPage = 9): LengthAwarePaginator
    {
        return News::latest()->paginate($perPage);
    }

    public function findBySlug(string $slug): ?News
    {
        return News::where('slug', $slug)->first();
    }

    public function getAll(): Collection
    {
        return News::latest()->get();
    }

    public function findById(int $id): ?News
    {
        return News::find($id);
    }

    public function create(array $data): News
    {
        return News::create($data);
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
