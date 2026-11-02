'use client';

import React from 'react';
import HeroCTA from './HeroCTA';
import HeroDescription from './HeroDescription';
import HeroMarquee from './HeroMarquee';
import HeroNames from './HeroNames';
import HeroNavbar from './HeroNavbar';
import HeroPills from './HeroPills';
import HeroPortrait from './HeroPortrait'; // Character cutout portrait
import HeroTitle from './HeroTitle';
import './hero.css';

interface HeroSectionProps {
    heroData?: any;
}

export default function HeroSection({ heroData }: HeroSectionProps) {
    // 1-word bold condensed poster title (like "SPIDER-MAN" in reference)
    // If backend provides a short title (<= 12 chars), use it, otherwise default to "DIO"
    const rawTitle = heroData?.title?.en || heroData?.title?.id || '';
    const title =
        rawTitle.length > 0 && rawTitle.length <= 12 ? rawTitle : 'DIO';

    // Explicitly use the attached transparent cut-out photo
    const image = '/images/dio-cutout.png';

    return (
        <section
            id="hero"
            className="hero-transition relative flex h-[100svh] min-h-screen w-full flex-col justify-between overflow-hidden bg-transparent select-none"
        >
            {/* ── Layer 0: Ambient Cosmic Background Glows & Celestial Overlay ── */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                {/* Subtle cosmic vignette gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'var(--hero-bg-gradient)' }}
                />

                {/* Upper Left Celestial Purple / Lavender Nebula */}
                <div className="pointer-events-none absolute -top-24 -left-24 h-[600px] w-[600px] rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/15" />

                {/* Upper Right Celestial Cyan Glow */}
                <div className="pointer-events-none absolute -top-10 -right-20 h-[550px] w-[550px] rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/10" />

                {/* Solar Dawn Warmth Glow (Light Mode Solar Radiance) */}
                <div className="pointer-events-none absolute top-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-amber-300/15 blur-3xl dark:bg-transparent" />

                {/* Mid-screen Deep Cosmic Violet Glow */}
                <div className="pointer-events-none absolute top-1/2 left-1/4 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-indigo-300/15 blur-3xl dark:bg-purple-900/10" />

                {/* Bottom-right Celestial Cyan Accent Glow */}
                <div className="pointer-events-none absolute right-10 -bottom-20 h-[450px] w-[500px] rounded-full bg-cyan-300/20 blur-3xl dark:bg-cyan-400/10" />
            </div>

            {/* ── Layer 1 & 2 & 5: Arc, Red Accent Circle, and Cut-Out Portrait ── */}
            <HeroPortrait imageSrc={image} />

            {/* ── Layer 3: Giant Condensed Poster Title Behind Character ── */}
            <HeroTitle titleOverride={title} />

            {/* ── Layer 4: Diagonal Marquee Ribbon Behind Character ── */}
            <HeroMarquee />

            {/* ── Layer 6: Interactive UI Overlays (Navbar, Pills, Names, Description, CTA) ── */}
            {/* Fixed / Top Navbar */}
            <HeroNavbar />

            {/* Upper Content Area (Below Navbar) */}
            <div className="pointer-events-none relative z-[6] mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-4 pt-24 sm:gap-6 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32">
                {/* 3 Outline Category Pills */}
                <div className="pointer-events-auto">
                    <HeroPills />
                </div>

                {/* Left & Right Actor / Role Names */}
                <HeroNames />
            </div>

            {/* Bottom Content Area: Description on Left, CTA + Counter + Badge on Right */}
            <div className="pointer-events-none relative z-[10] mx-auto mt-auto w-full max-w-[1440px] px-4 pb-6 sm:px-8 sm:pb-8 lg:px-12 lg:pb-10">
                <div className="flex flex-col items-start justify-between gap-5 sm:gap-8 md:flex-row md:items-end">
                    {/* Left: Short uppercase condensed intro (safe spacing from tilted marquee) */}
                    <div className="pointer-events-auto rounded-2xl border border-white bg-white/95 px-3.5 py-2.5 shadow-lg shadow-black/5 backdrop-blur-sm dark:border-white/10 dark:bg-black/80 dark:shadow-none">
                        <HeroDescription />
                    </div>

                    {/* Right: Pill CTA, slide 01 counter, and rotating circular badge */}
                    <div className="pointer-events-auto flex w-full justify-start md:w-auto md:justify-end">
                        <HeroCTA />
                    </div>
                </div>
            </div>

            {/* ── Layer 7: Seamless bottom cosmic blend towards About section ── */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-[7] h-24 bg-gradient-to-b from-transparent to-transparent" />
        </section>
    );
}
