"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface HeroTitleProps {
    titleOverride?: string;
}

export default function HeroTitle({ titleOverride }: HeroTitleProps) {
    const { t } = useTranslation();
    const titleText = titleOverride || t('heroEditorial.title') || 'DIO';

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[3] overflow-hidden">
            <motion.h1
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-hero font-extrabold uppercase text-center text-[var(--hero-title)] tracking-tight leading-[0.82] whitespace-nowrap"
                style={{
                    fontSize: 'clamp(7rem, 23vw, 22rem)',
                    transform: 'translateY(-4%)',
                }}
            >
                {titleText}
            </motion.h1>
        </div>
    );
}
