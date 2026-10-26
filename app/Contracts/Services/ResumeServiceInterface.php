<?php

namespace App\Contracts\Services;

use App\Models\Resume;
use Illuminate\Database\Eloquent\Collection;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

interface ResumeServiceInterface
{
    public function getActiveResume(): ?Resume;

    public function getAllResumes(): Collection;

    public function downloadResume(Resume $resume): BinaryFileResponse;

    public function previewResume(Resume $resume): BinaryFileResponse;
}
