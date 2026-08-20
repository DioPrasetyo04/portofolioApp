<?php

namespace App\Services;

use App\Contracts\Repositories\SocialMediaRepositoryInterface;
use App\Contracts\Services\SocialMediaServiceInterface;
use App\Models\SocialMedia;
use Illuminate\Database\Eloquent\Collection;

class SocialMediaService implements SocialMediaServiceInterface
{
    public function __construct(
        private readonly SocialMediaRepositoryInterface $socialMediaRepository
    ) {}

    public function getActiveSocialMedia(): Collection
    {
        return $this->socialMediaRepository->getActive();
    }

    public function getAll(): Collection
    {
        return $this->socialMediaRepository->getAll();
    }

    public function getById(int $id): ?SocialMedia
    {
        return $this->socialMediaRepository->findById($id);
    }

    public function create(array $data): SocialMedia
    {
        return $this->socialMediaRepository->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->socialMediaRepository->update($id, $data);
    }

    public function delete(int $id): bool
    {
        return $this->socialMediaRepository->delete($id);
    }
}
