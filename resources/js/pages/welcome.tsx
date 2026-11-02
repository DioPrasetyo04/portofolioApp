'use client';

import { Head } from '@inertiajs/react';
import React, { Suspense, lazy } from 'react';
import CosmicUniverseBackground from '@/components/portfolio/CosmicUniverseBackground';
import HeroSection from '@/components/portfolio/HeroSection';

// Lazy-loaded Below-the-Fold Components (Code-Splitting)
const AboutMeSection = lazy(
    () => import('@/components/portfolio/AboutMeSection'),
);
const ExperienceEducationSection = lazy(
    () => import('@/components/portfolio/ExperienceEducationSection'),
);
const ProjectsSection = lazy(
    () => import('@/components/portfolio/ProjectsSection'),
);
const TechStackSection = lazy(
    () => import('@/components/portfolio/TechStackSection'),
);
const LanguageSkillsSection = lazy(
    () => import('@/components/portfolio/LanguageSkillsSection'),
);
const CertificatesSection = lazy(
    () => import('@/components/portfolio/CertificatesSection'),
);
const NewsSection = lazy(() => import('@/components/portfolio/NewsSection'));
const ContactSection = lazy(
    () => import('@/components/portfolio/ContactSection'),
);
const AnnouncementModal = lazy(
    () => import('@/components/portfolio/AnnouncementModal'),
);
const Footer = lazy(() => import('@/components/portfolio/Footer'));

/* ─── Elegant Section Fallback Skeleton ─── */
function SectionSkeleton({
    minHeight = '500px',
    id,
}: {
    minHeight?: string;
    id?: string;
}) {
    return (
        <section
            id={id}
            role="status"
            aria-label="Loading section..."
            className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-transparent py-12 sm:py-16 md:py-24"
            style={{ minHeight }}
        >
            <div className="mx-auto w-full max-w-7xl animate-pulse space-y-6 px-4 sm:space-y-10 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="h-6 w-32 rounded-full border border-purple-500/20 bg-purple-500/10" />
                    <div className="h-10 w-72 max-w-full rounded-2xl bg-foreground/10" />
                    <div className="h-4 w-96 max-w-full rounded-lg bg-muted-foreground/15" />
                </div>

                {/* Content Cards Skeleton */}
                <div className="grid grid-cols-1 gap-6 pt-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="h-64 rounded-3xl border border-border/40 bg-card/40" />
                    <div className="hidden h-64 rounded-3xl border border-border/40 bg-card/40 md:block" />
                    <div className="hidden h-64 rounded-3xl border border-border/40 bg-card/40 lg:block" />
                </div>
            </div>
        </section>
    );
}

/* ─── Footer Skeleton ─── */
function FooterSkeleton() {
    return (
        <footer className="relative z-10 min-h-[220px] border-t border-purple-300/30 bg-white/90 pt-10 pb-10 sm:pt-12 sm:pb-12 md:pt-16 dark:border-white/10 dark:bg-black/90">
            <div className="mx-auto max-w-7xl animate-pulse px-4 sm:px-6 lg:px-8">
                <div className="mb-6 h-20 rounded-2xl bg-foreground/5" />
                <div className="mx-auto h-6 w-48 rounded-lg bg-foreground/5" />
            </div>
        </footer>
    );
}

interface PortfolioData {
    hero: any;
    about: any;
    categories: any[];
    projects: any[];
    skills: any[];
    certificates: any[];
    experiences?: any[];
    latestNews: any[];
    announcements: any[];
    socialMedia: any[];
}

interface WelcomeProps {
    portfolio: PortfolioData;
}

export default function Welcome({ portfolio }: WelcomeProps) {
    const {
        hero,
        about,
        categories = [],
        projects = [],
        skills = [],
        certificates = [],
        experiences = [],
        latestNews = [],
        announcements = [],
        socialMedia = [],
    } = portfolio || {};

    return (
        <>
            <Head title="DIOSTACK-PORTOFOLIO" />

            {/* Global Interactive Cosmic Universe Canvas Background */}
            <CosmicUniverseBackground />

            <div className="relative z-10 flex min-h-screen flex-col bg-transparent text-foreground antialiased selection:bg-purple-500/30 selection:text-cyan-400">
                <main className="relative flex-1">
                    {/* 1. Hero Section with Cinematic Editorial Poster Layout (Eagerly Loaded) */}
                    <HeroSection heroData={hero} />

                    {/* 2. About Me Section with Animated Counters */}
                    <Suspense
                        fallback={
                            <SectionSkeleton id="about" minHeight="700px" />
                        }
                    >
                        <AboutMeSection aboutData={about} />
                    </Suspense>

                    {/* 3. Professional Experience & Education Timeline */}
                    <Suspense
                        fallback={
                            <SectionSkeleton
                                id="experience"
                                minHeight="750px"
                            />
                        }
                    >
                        <ExperienceEducationSection experiences={experiences} />
                    </Suspense>

                    {/* 4. Featured Projects Showcase */}
                    <Suspense
                        fallback={
                            <SectionSkeleton id="projects" minHeight="800px" />
                        }
                    >
                        <ProjectsSection projects={projects} />
                    </Suspense>

                    {/* 4. Tech Stack / Skills with Category Tabs */}
                    <Suspense
                        fallback={
                            <SectionSkeleton id="skills" minHeight="650px" />
                        }
                    >
                        <TechStackSection categories={categories} />
                    </Suspense>

                    {/* 5. Language Skills Carousel */}
                    <Suspense
                        fallback={
                            <SectionSkeleton id="languages" minHeight="550px" />
                        }
                    >
                        <LanguageSkillsSection skills={skills} />
                    </Suspense>

                    {/* 6. Certifications & Accreditations Carousel */}
                    <Suspense
                        fallback={
                            <SectionSkeleton
                                id="certificates"
                                minHeight="650px"
                            />
                        }
                    >
                        <CertificatesSection certificates={certificates} />
                    </Suspense>

                    {/* 7. Latest Articles & News */}
                    {latestNews && latestNews.length > 0 && (
                        <Suspense
                            fallback={
                                <SectionSkeleton id="news" minHeight="450px" />
                            }
                        >
                            <NewsSection newsList={latestNews} />
                        </Suspense>
                    )}

                    {/* 8. Contact Us Section */}
                    <Suspense
                        fallback={
                            <SectionSkeleton id="contact" minHeight="600px" />
                        }
                    >
                        <ContactSection socialMedia={socialMedia} />
                    </Suspense>
                </main>

                {/* Footer */}
                <Suspense fallback={<FooterSkeleton />}>
                    <Footer socialMedia={socialMedia} />
                </Suspense>

                {/* Scheduled Announcement Popup (Only loads if announcements exist) */}
                {announcements && announcements.length > 0 && (
                    <Suspense fallback={null}>
                        <AnnouncementModal announcements={announcements} />
                    </Suspense>
                )}
            </div>
        </>
    );
}
