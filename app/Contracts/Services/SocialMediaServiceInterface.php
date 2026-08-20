<?php

namespace App\Contracts\Services;

use App\Models\SocialMedia;
use Illuminate\Database\Eloquent\Collection;

interface SocialMediaServiceInterface
{
    public function getActiveSocialMedia(): Collection;
    public function getAll(): Collection;
    public function getById(int $id): ?SocialMedia;
    public function create(array $data): SocialMedia;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
