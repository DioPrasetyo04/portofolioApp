<?php

namespace App\Contracts\Repositories;

use App\Models\Experience;
use Illuminate\Database\Eloquent\Collection;

interface ExperienceRepositoryInterface
{
    /**
     * Get all active experiences ordered by priority
     */
    public function getAllActive(): Collection;

    /**
     * Get active experiences grouped by category/type ('work', 'education', 'organization')
     */
    public function getActiveGrouped(): array;

    /**
     * Get all experiences (including inactive) for admin
     */
    public function getAll(): Collection;

    /**
     * Find by id
     */
    public function findById(int $id): ?Experience;

    /**
     * Create record
     */
    public function create(array $data): Experience;

    /**
     * Update record
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete record
     */
    public function delete(int $id): bool;
}

