"use client";

import React from 'react';
import HeroNavbar from './HeroNavbar';
import HeroPills from './HeroPills';
import HeroNames from './HeroNames';
import HeroTitle from './HeroTitle';
import HeroPortrait from './HeroPortrait'; // Character cutout portrait
import HeroMarquee from './HeroMarquee';
import HeroDescription from './HeroDescription';
import HeroCTA from './HeroCTA';
import './hero.css';

interface HeroSectionProps {
    heroData?: any;
}

export default function HeroSection({ heroData }: HeroSectionProps) {
    // 1-word bold condensed poster title (like "SPIDER-MAN" in reference)
    // If backend provides a short title (<= 12 chars), use it, otherwise default to "DIO"
    const rawTitle = heroData?.title?.en || heroData?.title?.id || '';
    const title = (rawTitle.length > 0 && rawTitle.length <= 12) ? rawTitle : 'DIO';
    
    // Explicitly use the attached transparent cut-out photo
    const image = '/images/dio-cutout.png';

    return (
        <section
            id="hero"
            className="relative w-full min-h-screen h-[100svh] overflow-hidden select-none bg-transparent hero-transition flex flex-col justify-between"
        >
            {/* ── Layer 0: Ambient Cosmic Background Glows & Celestial Overlay ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Subtle cosmic vignette gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'var(--hero-bg-gradient)' }}
                />

                {/* Upper Left Celestial Purple / Lavender Nebula */}
                <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

                {/* Upper Right Celestial Cyan Glow */}
                <div className="absolute -top-10 -right-20 w-[550px] h-[550px] bg-cyan-400/20 dark:bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* Solar Dawn Warmth Glow (Light Mode Solar Radiance) */}
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-amber-300/15 dark:bg-transparent rounded-full blur-3xl pointer-events-none" />

                {/* Mid-screen Deep Cosmic Violet Glow */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-300/15 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

                {/* Bottom-right Celestial Cyan Accent Glow */}
                <div className="absolute -bottom-20 right-10 w-[500px] h-[450px] bg-cyan-300/20 dark:bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
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
            <div className="relative z-[6] w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-32 flex flex-col gap-4 sm:gap-6 pointer-events-none">
                {/* 3 Outline Category Pills */}
                <div className="pointer-events-auto">
                    <HeroPills />
                </div>

                {/* Left & Right Actor / Role Names */}
                <HeroNames />
            </div>

            {/* Bottom Content Area: Description on Left, CTA + Counter + Badge on Right */}
            <div className="relative z-[10] w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pb-6 sm:pb-8 lg:pb-10 mt-auto pointer-events-none">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5 sm:gap-8">
                    {/* Left: Short uppercase condensed intro (safe spacing from tilted marquee) */}
                    <div className="pointer-events-auto bg-white/95 dark:bg-black/80 backdrop-blur-sm px-3.5 py-2.5 rounded-2xl border border-white dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-none">
                        <HeroDescription />
                    </div>

                    {/* Right: Pill CTA, slide 01 counter, and rotating circular badge */}
                    <div className="w-full md:w-auto flex justify-start md:justify-end pointer-events-auto">
                        <HeroCTA />
                    </div>
                </div>
            </div>

            {/* ── Layer 7: Seamless bottom cosmic blend towards About section ── */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-transparent pointer-events-none z-[7]" />
        </section>
    );
}
