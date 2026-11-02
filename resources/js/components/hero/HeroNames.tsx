'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { heroConfig } from './hero.config';

export default function HeroNames() {
    const { t } = useTranslation();

    return (
        <div className="pointer-events-none flex w-full flex-col items-start justify-between gap-2 select-none md:flex-row md:items-center md:gap-8">
            {/* Left Name Labels */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-5 sm:gap-8 lg:gap-12"
            >
                {heroConfig.labelsLeft.map((key, idx) => (
                    <span
                        key={idx}
                        className="font-hero text-lg tracking-wider whitespace-nowrap text-[var(--hero-fg-muted)] uppercase sm:text-2xl lg:text-3xl"
                    >
                        {t(key)}
                    </span>
                ))}
            </motion.div>

            {/* Right Name Labels */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    duration: 0.8,
                    delay: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-center gap-5 sm:gap-8 md:text-right lg:gap-12"
            >
                {heroConfig.labelsRight.map((key, idx) => (
                    <span
                        key={idx}
                        className="font-hero text-lg tracking-wider whitespace-nowrap text-[var(--hero-fg-muted)] uppercase sm:text-2xl lg:text-3xl"
                    >
                        {t(key)}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
