<?php

namespace App\Contracts\Services;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Collection;

interface CertificateServiceInterface
{
    public function getAllCertificates(): Collection;
    public function getById(int $id): ?Certificate;
    public function create(array $data): Certificate;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}
