'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
            className="pointer-events-auto z-[6] flex items-center gap-3 sm:gap-4"
        >
            {/* Outline Pill CTA Button */}
            <a
                href={heroConfig.ctaAnchor}
                onClick={handleCtaClick}
                className="group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-[#C93A32] bg-transparent px-6 py-3 text-[#C93A32] shadow-[0_0_20px_rgba(201,58,50,0.25)] transition-all duration-300 hover:bg-[#C93A32] hover:text-white hover:shadow-[0_0_30px_rgba(201,58,50,0.6)] sm:px-8 sm:py-3.5"
            >
                <span className="font-hero text-sm tracking-widest uppercase sm:text-base">
                    {t('heroEditorial.cta')}
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 sm:h-5 sm:w-5" />
            </a>

            {/* Slide / Section Counter "01" */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white bg-white/90 shadow-sm shadow-black/5 backdrop-blur-md select-none sm:h-11 sm:w-11 dark:border-[var(--hero-pill-border)] dark:bg-transparent dark:shadow-none">
                <span className="font-hero text-xs tracking-wider text-[var(--hero-fg-muted)] sm:text-sm">
                    {heroConfig.counterValue}
                </span>
            </div>

            {/* Rotating Circular Badge */}
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#C93A32] bg-black/80 p-1 shadow-[0_0_15px_rgba(201,58,50,0.3)] sm:h-14 sm:w-14">
                {/* Rotating SVG circular text around perimeter */}
                <svg
                    viewBox="0 0 100 100"
                    className="animate-spin-slow pointer-events-none absolute inset-0 h-full w-full select-none"
                >
                    <path
                        id="heroBadgePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                    />
                    <text className="font-hero fill-[var(--hero-fg-muted)] text-[10.5px] tracking-[0.16em] uppercase">
                        <textPath href="#heroBadgePath" startOffset="0%">
                            {t('heroEditorial.badgeText')}
                        </textPath>
                    </text>
                </svg>

                {/* Inner Center Thumbnail (User Photo or Tech Icon) */}
                <div className="z-10 flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border border-[#C93A32]/60 bg-black/90 sm:h-7 sm:w-7">
                    <img
                        src={heroConfig.portraitImage}
                        alt="Mini badge"
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                    />
                </div>
            </div>
        </motion.div>
    );
}
