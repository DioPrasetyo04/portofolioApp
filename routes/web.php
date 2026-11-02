<?php

use App\Http\Controllers\CertificateController;
use App\Http\Controllers\InteractionController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ResumeController;
use Illuminate\Support\Facades\Route;

// Public Portfolio Landing Page
Route::get('/', [PortfolioController::class, 'index'])->name('home');

// Public News & Articles
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::get('/news/{slug}', [NewsController::class, 'show'])->name('news.show');

// Public Projects & Certificates
Route::get('/projects/{id}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('/certificates/{id}', [CertificateController::class, 'show'])->name('certificates.show');

// Public Resume Download & Preview
Route::get('/resume/download', [ResumeController::class, 'download'])->name('resume.download');
Route::get('/resume/preview', [ResumeController::class, 'preview'])->name('resume.preview');

// Interactions (Likes & Comments)
Route::post('/interactions/comment', [InteractionController::class, 'storeComment'])->name('interactions.comment');
Route::post('/interactions/like', [InteractionController::class, 'incrementLike'])->name('interactions.like');
Route::get('/interactions/portfolio-like', [InteractionController::class, 'getPortfolioLikes'])->name('interactions.portfolio-like.get');
Route::post('/interactions/portfolio-like', [InteractionController::class, 'incrementPortfolioLike'])->middleware('throttle:10,1')->name('interactions.portfolio-like.post');

// Auth dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
