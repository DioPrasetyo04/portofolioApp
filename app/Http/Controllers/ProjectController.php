<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\ProjectRepositoryInterface;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(
        protected ProjectRepositoryInterface $projectRepo
    ) {}

    public function show(int $id): Response
    {
        $project = $this->projectRepo->findById($id);

        if (!$project) {
            abort(404, 'Project not found');
        }
        
        $project->load(['comments' => function ($query) {
            $query->latest();
        }])->loadAvg('comments', 'rating');

        return Inertia::render('projects/show', [
            'project' => $project,
        ]);
    }
}
