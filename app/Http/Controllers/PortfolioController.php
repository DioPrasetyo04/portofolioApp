<?php

namespace App\Http\Controllers;

use App\Contracts\Services\PortfolioServiceInterface;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function __construct(
        protected PortfolioServiceInterface $portfolioService
    ) {}

    public function index(): Response
    {
        $portfolioData = $this->portfolioService->getLandingPageData();

        return Inertia::render('welcome', [
            'portfolio' => $portfolioData,
        ]);
    }
}
