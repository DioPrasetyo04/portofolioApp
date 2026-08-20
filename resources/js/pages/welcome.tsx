import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/components/portfolio/Navbar';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutMeSection from '@/components/portfolio/AboutMeSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import TechStackSection from '@/components/portfolio/TechStackSection';
import LanguageSkillsSection from '@/components/portfolio/LanguageSkillsSection';
import CertificatesSection from '@/components/portfolio/CertificatesSection';
import NewsSection from '@/components/portfolio/NewsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import AnnouncementModal from '@/components/portfolio/AnnouncementModal';
import Footer from '@/components/portfolio/Footer';

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

            <div className="min-h-screen bg-background text-foreground flex flex-col antialiased selection:bg-purple-500/30 selection:text-cyan-400">
                {/* Navbar with Theme & Language Switchers */}
                <Navbar />

                <main className="flex-1">
                    {/* 1. Hero Section with Interactive 3D Canvas */}
                    <HeroSection heroData={hero} />

                    {/* 2. About Me Section with Animated Counters */}
                    <AboutMeSection aboutData={about} />

                    {/* 3. Featured Projects Carousel */}
                    <ProjectsSection projects={projects} />

                    {/* 4. Tech Stack / Skills with Category Tabs */}
                    <TechStackSection categories={categories} />

                    {/* 5. Language Skills Carousel */}
                    <LanguageSkillsSection skills={skills} />

                    {/* 6. Certifications & Accreditations Carousel */}
                    <CertificatesSection certificates={certificates} />

                    {/* 7. Latest Articles & News */}
                    <NewsSection newsList={latestNews} />

                    {/* 8. Contact Us Section */}
                    <ContactSection socialMedia={socialMedia} />
                </main>

                {/* Footer */}
                <Footer />

                {/* Scheduled Announcement Popup */}
                <AnnouncementModal announcements={announcements} />
            </div>
        </>
    );
}
