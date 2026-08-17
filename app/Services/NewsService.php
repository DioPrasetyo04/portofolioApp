<?php

namespace App\Services;

use App\Contracts\Repositories\NewsRepositoryInterface;
use App\Contracts\Services\NewsServiceInterface;
use App\Models\News;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;

class NewsService implements NewsServiceInterface
{
    public function __construct(
        protected NewsRepositoryInterface $repository
    ) {}

    public function getLatestNews(int $limit = 6): Collection
    {
        return $this->repository->getLatest($limit);
    }

    public function getPaginatedNews(int $perPage = 9): LengthAwarePaginator
    {
        return $this->repository->getPaginated($perPage);
    }

    public function getNewsBySlug(string $slug): ?News
    {
        return $this->repository->findBySlug($slug);
    }

    public function getById(int $id): ?News
    {
        return $this->repository->findById($id);
    }

    public function create(array $data): News
    {
        if (empty($data['slug']) && !empty($data['title'])) {
            $title = is_array($data['title']) ? ($data['title']['en'] ?? reset($data['title'])) : $data['title'];
            $data['slug'] = Str::slug($title) . '-' . Str::random(5);
        }
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
