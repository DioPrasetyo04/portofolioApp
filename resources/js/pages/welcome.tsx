"use client";

import React, { Suspense, lazy } from 'react';
import { Head } from '@inertiajs/react';
import HeroSection from '@/components/portfolio/HeroSection';
import CosmicUniverseBackground from '@/components/portfolio/CosmicUniverseBackground';

// Lazy-loaded Below-the-Fold Components (Code-Splitting)
const AboutMeSection = lazy(() => import('@/components/portfolio/AboutMeSection'));
const ProjectsSection = lazy(() => import('@/components/portfolio/ProjectsSection'));
const TechStackSection = lazy(() => import('@/components/portfolio/TechStackSection'));
const LanguageSkillsSection = lazy(() => import('@/components/portfolio/LanguageSkillsSection'));
const CertificatesSection = lazy(() => import('@/components/portfolio/CertificatesSection'));
const NewsSection = lazy(() => import('@/components/portfolio/NewsSection'));
const ContactSection = lazy(() => import('@/components/portfolio/ContactSection'));
const AnnouncementModal = lazy(() => import('@/components/portfolio/AnnouncementModal'));
const Footer = lazy(() => import('@/components/portfolio/Footer'));

/* ─── Elegant Section Fallback Skeleton ─── */
function SectionSkeleton({ minHeight = '500px', id }: { minHeight?: string; id?: string }) {
    return (
        <section
            id={id}
            role="status"
            aria-label="Loading section..."
            className="w-full py-24 relative overflow-hidden bg-transparent flex flex-col items-center justify-center"
            style={{ minHeight }}
        >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-32 h-6 rounded-full bg-purple-500/10 border border-purple-500/20" />
                    <div className="w-72 max-w-full h-10 rounded-2xl bg-foreground/10" />
                    <div className="w-96 max-w-full h-4 rounded-lg bg-muted-foreground/15" />
                </div>

                {/* Content Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    <div className="h-64 rounded-3xl bg-card/40 border border-border/40" />
                    <div className="h-64 rounded-3xl bg-card/40 border border-border/40 hidden md:block" />
                    <div className="h-64 rounded-3xl bg-card/40 border border-border/40 hidden lg:block" />
                </div>
            </div>
        </section>
    );
}

/* ─── Footer Skeleton ─── */
function FooterSkeleton() {
    return (
        <footer className="border-t border-purple-300/30 dark:border-white/10 bg-white/90 dark:bg-black/90 pt-16 pb-12 relative z-10 min-h-[220px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
                <div className="h-20 rounded-2xl bg-foreground/5 mb-6" />
                <div className="h-6 w-48 rounded-lg bg-foreground/5 mx-auto" />
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
        latestNews = [],
        announcements = [],
        socialMedia = [],
    } = portfolio || {};

    return (
        <>
            <Head title="Portfolio 3D — Fullstack Engineer & Creative Technologist" />

            {/* Global Interactive Cosmic Universe Canvas Background */}
            <CosmicUniverseBackground />

            <div className="min-h-screen bg-transparent text-foreground flex flex-col antialiased selection:bg-purple-500/30 selection:text-cyan-400 relative z-10">
                <main className="flex-1 relative">
                    {/* 1. Hero Section with Cinematic Editorial Poster Layout (Eagerly Loaded) */}
                    <HeroSection heroData={hero} />

                    {/* 2. About Me Section with Animated Counters */}
                    <Suspense fallback={<SectionSkeleton id="about" minHeight="700px" />}>
                        <AboutMeSection aboutData={about} />
                    </Suspense>

                    {/* 3. Featured Projects Showcase */}
                    <Suspense fallback={<SectionSkeleton id="projects" minHeight="800px" />}>
                        <ProjectsSection projects={projects} />
                    </Suspense>

                    {/* 4. Tech Stack / Skills with Category Tabs */}
                    <Suspense fallback={<SectionSkeleton id="skills" minHeight="650px" />}>
                        <TechStackSection categories={categories} />
                    </Suspense>

                    {/* 5. Language Skills Carousel */}
                    <Suspense fallback={<SectionSkeleton id="languages" minHeight="550px" />}>
                        <LanguageSkillsSection skills={skills} />
                    </Suspense>

                    {/* 6. Certifications & Accreditations Carousel */}
                    <Suspense fallback={<SectionSkeleton id="certificates" minHeight="650px" />}>
                        <CertificatesSection certificates={certificates} />
                    </Suspense>

                    {/* 7. Latest Articles & News */}
                    {latestNews && latestNews.length > 0 && (
                        <Suspense fallback={<SectionSkeleton id="news" minHeight="450px" />}>
                            <NewsSection newsList={latestNews} />
                        </Suspense>
                    )}

                    {/* 8. Contact Us Section */}
                    <Suspense fallback={<SectionSkeleton id="contact" minHeight="600px" />}>
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
