<?php

namespace App\Services;

use App\Contracts\Repositories\CertificateRepositoryInterface;
use App\Contracts\Services\CertificateServiceInterface;
use App\Models\Certificate;
use Illuminate\Database\Eloquent\Collection;

class CertificateService implements CertificateServiceInterface
{
    public function __construct(
        protected CertificateRepositoryInterface $repository
    ) {}

    public function getAllCertificates(): Collection
    {
        return $this->repository->getAll();
    }

    public function getById(int $id): ?Certificate
    {
        return $this->repository->findById($id);
    }

    public function create(array $data): Certificate
    {
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
