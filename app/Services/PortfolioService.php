<?php

namespace App\Services;

use App\Contracts\Repositories\AboutMeRepositoryInterface;
use App\Contracts\Repositories\AnnouncementRepositoryInterface;
use App\Contracts\Repositories\CertificateRepositoryInterface;
use App\Contracts\Repositories\HeroSectionRepositoryInterface;
use App\Contracts\Repositories\LanguageSkillRepositoryInterface;
use App\Contracts\Repositories\NewsRepositoryInterface;
use App\Contracts\Repositories\ProjectRepositoryInterface;
use App\Contracts\Repositories\TechnologyCategoryRepositoryInterface;
use App\Contracts\Repositories\SocialMediaRepositoryInterface;
use App\Contracts\Repositories\ResumeRepositoryInterface;
use App\Contracts\Services\PortfolioServiceInterface;

class PortfolioService implements PortfolioServiceInterface
{
    public function __construct(
        protected HeroSectionRepositoryInterface $heroRepo,
        protected AboutMeRepositoryInterface $aboutRepo,
        protected TechnologyCategoryRepositoryInterface $techCategoryRepo,
        protected ProjectRepositoryInterface $projectRepo,
        protected LanguageSkillRepositoryInterface $skillRepo,
        protected CertificateRepositoryInterface $certRepo,
        protected NewsRepositoryInterface $newsRepo,
        protected AnnouncementRepositoryInterface $announcementRepo,
        protected SocialMediaRepositoryInterface $socialMediaRepo,
        protected ResumeRepositoryInterface $resumeRepo
    ) {}

    public function getLandingPageData(): array
    {
        return [
            'hero' => $this->heroRepo->getActive(),
            'about' => $this->aboutRepo->getActive(),
            'categories' => $this->techCategoryRepo->getAllWithTechnologies(),
            'projects' => $this->projectRepo->getAllWithTechnologies(),
            'skills' => $this->skillRepo->getAll(),
            'certificates' => $this->certRepo->getAll(),
            'latestNews' => $this->newsRepo->getLatest(4),
            'announcements' => $this->announcementRepo->getActive(),
            'socialMedia' => $this->socialMediaRepo->getActive(),
            'resume' => $this->resumeRepo->getActive(),
        ];
    }
}
