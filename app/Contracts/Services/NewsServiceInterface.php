<?php

namespace App\Contracts\Services;

use App\Models\News;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

interface NewsServiceInterface
{
    public function getLatestNews(int $limit = 6): Collection;
    public function getPaginatedNews(int $perPage = 9): LengthAwarePaginator;
    public function getNewsBySlug(string $slug): ?News;
    public function getById(int $id): ?News;
    public function create(array $data): News;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
