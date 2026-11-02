'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface HeroDescriptionProps {
    descriptionOverride?: string;
}

export default function HeroDescription({
    descriptionOverride,
}: HeroDescriptionProps) {
    const { t } = useTranslation();
    const descriptionText =
        descriptionOverride || t('heroEditorial.description');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto z-[6] max-w-[420px] sm:max-w-[540px] lg:max-w-[650px]"
        >
            <p className="font-hero-condensed text-xs leading-relaxed tracking-wider text-[var(--hero-fg-muted)] uppercase sm:text-sm lg:text-[15px]">
                {descriptionText}
            </p>
        </motion.div>
    );
}
