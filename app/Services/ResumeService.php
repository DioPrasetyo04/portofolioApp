<?php

namespace App\Services;

use App\Contracts\Repositories\ResumeRepositoryInterface;
use App\Contracts\Services\ResumeServiceInterface;
use App\Models\Resume;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ResumeService implements ResumeServiceInterface
{
    public function __construct(
        protected ResumeRepositoryInterface $resumeRepo
    ) {}

    public function getActiveResume(): ?Resume
    {
        return $this->resumeRepo->getActive();
    }

    public function getAllResumes(): Collection
    {
        return $this->resumeRepo->getAll();
    }

    public function downloadResume(Resume $resume): BinaryFileResponse
    {
        // Increment download metrics
        $this->resumeRepo->incrementDownloads($resume->id);

        $resolvedPath = $this->resolveFilePath($resume->file_path);

        if (! $resolvedPath) {
            abort(404, 'Resume file not found in storage.');
        }

        $downloadName = $resume->file_name ?: basename($resolvedPath);
        if (! str_ends_with(strtolower($downloadName), '.pdf')) {
            $downloadName .= '.pdf';
        }

        return response()->download($resolvedPath, $downloadName, [
            'Content-Type' => 'application/pdf',
            'Cache-Control' => 'no-cache, must-revalidate',
        ]);
    }

    public function previewResume(Resume $resume): BinaryFileResponse
    {
        $resolvedPath = $this->resolveFilePath($resume->file_path);

        if (! $resolvedPath) {
            abort(404, 'Resume file not found in storage.');
        }

        $fileName = $resume->file_name ?: basename($resolvedPath);

        return response()->file($resolvedPath, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="' . $fileName . '"',
        ]);
    }

    /**
     * Resolve the physical path for the given stored file path.
     */
    protected function resolveFilePath(?string $filePath): ?string
    {
        if (empty($filePath)) {
            return null;
        }

        $disk = Storage::disk('public');

        if ($disk->exists($filePath)) {
            return $disk->path($filePath);
        }

        // Check storage/app/public relative path directly
        $storageAppPublic = storage_path('app/public/' . ltrim($filePath, '/\\'));
        if (file_exists($storageAppPublic)) {
            return $storageAppPublic;
        }

        // Check public/storage/ relative path
        $publicStorage = public_path('storage/' . ltrim($filePath, '/\\'));
        if (file_exists($publicStorage)) {
            return $publicStorage;
        }

        // Check public_path directly
        $publicDirect = public_path(ltrim($filePath, '/\\'));
        if (file_exists($publicDirect)) {
            return $publicDirect;
        }

        // Check fallback public/resumes/<basename>
        $publicResumes = public_path('resumes/' . basename($filePath));
        if (file_exists($publicResumes)) {
            return $publicResumes;
        }

        return null;
    }
}
