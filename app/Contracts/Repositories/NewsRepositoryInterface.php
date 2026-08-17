<?php

namespace App\Contracts\Repositories;

use App\Models\News;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface NewsRepositoryInterface
{
    public function getLatest(int $limit = 6): Collection;
    public function getPaginated(int $perPage = 9): LengthAwarePaginator;
    public function findBySlug(string $slug): ?News;
    public function getAll(): Collection;
    public function findById(int $id): ?News;
    public function create(array $data): News;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
