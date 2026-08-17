<?php

namespace App\Contracts\Repositories;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Collection;

interface CertificateRepositoryInterface
{
    public function getAll(): Collection;
    public function findById(int $id): ?Certificate;
    public function create(array $data): Certificate;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
