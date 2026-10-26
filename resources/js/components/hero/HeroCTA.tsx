"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { heroConfig } from './hero.config';

export default function HeroCTA() {
    const { t } = useTranslation();

    const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.hash = '#contact';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 sm:gap-4 z-[6] pointer-events-auto"
        >
            {/* Outline Pill CTA Button */}
            <a
                href={heroConfig.ctaAnchor}
                onClick={handleCtaClick}
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border-2 border-[#C93A32] bg-transparent text-[#C93A32] hover:bg-[#C93A32] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(201,58,50,0.25)] hover:shadow-[0_0_30px_rgba(201,58,50,0.6)] cursor-pointer"
            >
                <span className="font-hero tracking-widest text-sm sm:text-base uppercase">
                    {t('heroEditorial.cta')}
                </span>
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>

            {/* Slide / Section Counter "01" */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white dark:border-[var(--hero-pill-border)] bg-white/90 dark:bg-transparent backdrop-blur-md flex items-center justify-center select-none flex-shrink-0 shadow-sm shadow-black/5 dark:shadow-none">
                <span className="font-hero text-xs sm:text-sm tracking-wider text-[var(--hero-fg-muted)]">
                    {heroConfig.counterValue}
                </span>
            </div>

            {/* Rotating Circular Badge */}
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#C93A32] bg-black/80 flex items-center justify-center p-1 shadow-[0_0_15px_rgba(201,58,50,0.3)] flex-shrink-0">
                {/* Rotating SVG circular text around perimeter */}
                <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full animate-spin-slow pointer-events-none select-none"
                >
                    <path
                        id="heroBadgePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                    />
                    <text className="font-hero text-[10.5px] uppercase fill-[var(--hero-fg-muted)] tracking-[0.16em]">
                        <textPath href="#heroBadgePath" startOffset="0%">
                            {t('heroEditorial.badgeText')}
                        </textPath>
                    </text>
                </svg>

                {/* Inner Center Thumbnail (User Photo or Tech Icon) */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-[#C93A32]/60 bg-black/90 flex items-center justify-center z-10">
                    <img
                        src={heroConfig.portraitImage}
                        alt="Mini badge"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                    />
                </div>
            </div>
        </motion.div>
    );
}
