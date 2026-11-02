'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface HeroTitleProps {
    titleOverride?: string;
}

export default function HeroTitle({ titleOverride }: HeroTitleProps) {
    const { t } = useTranslation();
    const titleText = titleOverride || t('heroEditorial.title') || 'DIO';

    return (
        <div className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center overflow-hidden select-none">
            <motion.h1
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                    duration: 1,
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                }}
                className="font-hero text-center leading-[0.82] font-extrabold tracking-tight whitespace-nowrap text-[var(--hero-title)] uppercase"
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
