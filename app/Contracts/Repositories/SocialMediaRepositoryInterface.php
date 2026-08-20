<?php

namespace App\Contracts\Repositories;

use App\Models\SocialMedia;
use Illuminate\Database\Eloquent\Collection;

interface SocialMediaRepositoryInterface
{
    public function getActive(): Collection;
    public function getAll(): Collection;
    public function findById(int $id): ?SocialMedia;
    public function create(array $data): SocialMedia;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
