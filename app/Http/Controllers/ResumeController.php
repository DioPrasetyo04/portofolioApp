<?php

namespace App\Http\Controllers;

use App\Contracts\Services\ResumeServiceInterface;
use App\Models\Resume;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response;

class ResumeController extends Controller
{
    public function __construct(
        protected ResumeServiceInterface $resumeService
    ) {}

    /**
     * Download the currently active resume (or specific resume if ID provided).
     */
    public function download(Request $request): BinaryFileResponse|Response
    {
        $resume = null;
        if ($request->filled('id')) {
            $resume = Resume::find($request->query('id'));
        }

        if (! $resume) {
            $resume = $this->resumeService->getActiveResume();
        }

        if (! $resume) {
            abort(404, 'No active resume found. Please configure a resume in the CMS admin panel.');
        }

        return $this->resumeService->downloadResume($resume);
    }

    /**
     * Preview the currently active resume inline in the browser.
     */
    public function preview(Request $request): BinaryFileResponse|Response
    {
        $resume = null;
        if ($request->filled('id')) {
            $resume = Resume::find($request->query('id'));
        }

        if (! $resume) {
            $resume = $this->resumeService->getActiveResume();
        }

        if (! $resume) {
            abort(404, 'No active resume found.');
        }

        return $this->resumeService->previewResume($resume);
    }
}
