"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { heroConfig } from './hero.config';

export default function HeroNames() {
    const { t } = useTranslation();

    return (
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-8 select-none pointer-events-none">
            {/* Left Name Labels */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-5 sm:gap-8 lg:gap-12"
            >
                {heroConfig.labelsLeft.map((key, idx) => (
                    <span
                        key={idx}
                        className="font-hero text-lg sm:text-2xl lg:text-3xl tracking-wider text-[var(--hero-fg-muted)] uppercase whitespace-nowrap"
                    >
                        {t(key)}
                    </span>
                ))}
            </motion.div>

            {/* Right Name Labels */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-5 sm:gap-8 lg:gap-12 md:text-right"
            >
                {heroConfig.labelsRight.map((key, idx) => (
                    <span
                        key={idx}
                        className="font-hero text-lg sm:text-2xl lg:text-3xl tracking-wider text-[var(--hero-fg-muted)] uppercase whitespace-nowrap"
                    >
                        {t(key)}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
