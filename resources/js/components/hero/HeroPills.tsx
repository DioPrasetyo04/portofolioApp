'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { heroConfig } from './hero.config';

export default function HeroPills() {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 sm:gap-3"
        >
            {heroConfig.categoryPills.map((pillKey, idx) => (
                <div
                    key={idx}
                    className="group flex-shrink-0 cursor-default rounded-full border border-white bg-white/95 px-3.5 py-1.5 shadow-sm shadow-black/5 backdrop-blur-sm transition-all duration-300 select-none hover:border-[#C93A32] hover:bg-[#C93A32]/10 sm:px-4 dark:border-[var(--hero-pill-border)] dark:bg-black/75 dark:shadow-none"
                >
                    <span className="font-hero-condensed text-xs font-semibold tracking-[0.15em] text-[var(--hero-fg-muted)] uppercase group-hover:text-[var(--hero-fg)] sm:text-sm">
                        {t(pillKey)}
                    </span>
                </div>
            ))}
        </motion.div>
    );
}
