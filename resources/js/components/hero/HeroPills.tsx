"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { heroConfig } from './hero.config';

export default function HeroPills() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1"
        >
            {heroConfig.categoryPills.map((pillKey, idx) => (
                <div
                    key={idx}
                    className="flex-shrink-0 px-3.5 sm:px-4 py-1.5 rounded-full border border-white dark:border-[var(--hero-pill-border)] bg-white/95 dark:bg-black/75 backdrop-blur-sm hover:border-[#C93A32] hover:bg-[#C93A32]/10 transition-all duration-300 cursor-default select-none group shadow-sm shadow-black/5 dark:shadow-none"
                >
                    <span className="font-hero-condensed text-xs sm:text-sm tracking-[0.15em] text-[var(--hero-fg-muted)] group-hover:text-[var(--hero-fg)] uppercase font-semibold">
                        {t(pillKey)}
                    </span>
                </div>
            ))}
        </motion.div>
    );
}
