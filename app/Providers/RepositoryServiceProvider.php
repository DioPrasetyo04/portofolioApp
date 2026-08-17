<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// Contracts
use App\Contracts\Repositories\HeroSectionRepositoryInterface;
use App\Contracts\Repositories\AboutMeRepositoryInterface;
use App\Contracts\Repositories\TechnologyCategoryRepositoryInterface;
use App\Contracts\Repositories\TechnologyRepositoryInterface;
use App\Contracts\Repositories\ProjectRepositoryInterface;
use App\Contracts\Repositories\LanguageSkillRepositoryInterface;
use App\Contracts\Repositories\CertificateRepositoryInterface;
use App\Contracts\Repositories\NewsRepositoryInterface;
use App\Contracts\Repositories\AnnouncementRepositoryInterface;

use App\Contracts\Services\HeroSectionServiceInterface;
use App\Contracts\Services\AboutMeServiceInterface;
use App\Contracts\Services\TechnologyCategoryServiceInterface;
use App\Contracts\Services\TechnologyServiceInterface;
use App\Contracts\Services\ProjectServiceInterface;
use App\Contracts\Services\LanguageSkillServiceInterface;
use App\Contracts\Services\CertificateServiceInterface;
use App\Contracts\Services\NewsServiceInterface;
use App\Contracts\Services\AnnouncementServiceInterface;
use App\Contracts\Services\PortfolioServiceInterface;

// Implementations
use App\Repositories\HeroSectionRepository;
use App\Repositories\AboutMeRepository;
use App\Repositories\TechnologyCategoryRepository;
use App\Repositories\TechnologyRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\LanguageSkillRepository;
use App\Repositories\CertificateRepository;
use App\Repositories\NewsRepository;
use App\Repositories\AnnouncementRepository;

use App\Services\HeroSectionService;
use App\Services\AboutMeService;
use App\Services\TechnologyCategoryService;
use App\Services\TechnologyService;
use App\Services\ProjectService;
use App\Services\LanguageSkillService;
use App\Services\CertificateService;
use App\Services\NewsService;
use App\Services\AnnouncementService;
use App\Services\PortfolioService;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All of the container singletons / bindings.
     *
     * @var array<class-string, class-string>
     */
    public array $bindings = [
        // Repositories
        HeroSectionRepositoryInterface::class => HeroSectionRepository::class,
        AboutMeRepositoryInterface::class => AboutMeRepository::class,
        TechnologyCategoryRepositoryInterface::class => TechnologyCategoryRepository::class,
        TechnologyRepositoryInterface::class => TechnologyRepository::class,
        ProjectRepositoryInterface::class => ProjectRepository::class,
        LanguageSkillRepositoryInterface::class => LanguageSkillRepository::class,
        CertificateRepositoryInterface::class => CertificateRepository::class,
        NewsRepositoryInterface::class => NewsRepository::class,
        AnnouncementRepositoryInterface::class => AnnouncementRepository::class,

        // Services
        HeroSectionServiceInterface::class => HeroSectionService::class,
        AboutMeServiceInterface::class => AboutMeService::class,
        TechnologyCategoryServiceInterface::class => TechnologyCategoryService::class,
        TechnologyServiceInterface::class => TechnologyService::class,
        ProjectServiceInterface::class => ProjectService::class,
        LanguageSkillServiceInterface::class => LanguageSkillService::class,
        CertificateServiceInterface::class => CertificateService::class,
        NewsServiceInterface::class => NewsService::class,
        AnnouncementServiceInterface::class => AnnouncementService::class,
        PortfolioServiceInterface::class => PortfolioService::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
