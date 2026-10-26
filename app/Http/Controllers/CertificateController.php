<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\CertificateRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    public function __construct(
        protected CertificateRepositoryInterface $certificateRepo
    ) {}

    public function show(int $id): Response
    {
        $certificate = $this->certificateRepo->findById($id);

        if (!$certificate) {
            abort(404, 'Certificate not found');
        }
        
        $certificate->load(['comments' => function ($query) {
            $query->latest();
        }])->loadAvg('comments', 'rating');

        return Inertia::render('certificates/show', [
            'certificate' => $certificate,
        ]);
    }
}
