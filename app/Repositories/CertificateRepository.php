<?php

namespace App\Repositories;

use App\Contracts\Repositories\CertificateRepositoryInterface;
use App\Models\Certificate;
use Illuminate\Database\Eloquent\Collection;

class CertificateRepository implements CertificateRepositoryInterface
{
    public function getAll(): Collection
    {
        return Certificate::latest('issued_at')->get();
    }

    public function findById(int $id): ?Certificate
    {
        return Certificate::find($id);
    }

    public function create(array $data): Certificate
    {
        return Certificate::create($data);
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
