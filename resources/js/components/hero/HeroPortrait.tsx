"use client";

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { heroConfig } from './hero.config';

interface HeroPortraitProps {
    imageSrc?: string;
}

export function HeroPortrait({ imageSrc }: HeroPortraitProps) {
    const photo = imageSrc || heroConfig.portraitImage;
    const [reducedMotion, setReducedMotion] = useState(false);

    // Motion values for direct GPU-composited parallax without React re-renders
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring physics for organic motion feel
    const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', listener);

        const handleMouseMove = (e: MouseEvent) => {
            if (mediaQuery.matches) return;
            const { innerWidth, innerHeight } = window;
            const x = (e.clientX / innerWidth - 0.5) * 22; // subtle -11px to +11px
            const y = (e.clientY / innerHeight - 0.5) * 14; // subtle -7px to +7px
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            mediaQuery.removeEventListener('change', listener);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            {/* ── Layer 1: Planetary / Celestial Orbital Rings ── */}
            <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <div className="w-[78vw] max-w-[1100px] aspect-square rounded-full border border-[var(--hero-arc)] translate-y-[28%] pointer-events-none shadow-[0_0_35px_rgba(99,102,241,0.18)] dark:shadow-[0_0_35px_rgba(167,139,250,0.12)]" />
                <div className="w-[92vw] max-w-[1300px] aspect-square rounded-full border border-[var(--hero-arc)] translate-y-[38%] opacity-60 pointer-events-none shadow-[0_0_45px_rgba(56,189,248,0.15)] dark:shadow-[0_0_45px_rgba(103,232,249,0.08)]" />
            </div>

            {/* ── Layer 1.5: Cosmic Eclipse Nebula Halo behind Red Circle ── */}
            <div className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <div
                    className="w-[66vw] max-w-[940px] aspect-square rounded-full bg-gradient-to-tr from-indigo-500/25 via-[#C93A32]/25 to-amber-400/30 dark:from-purple-600/30 dark:via-[#C93A32]/25 dark:to-cyan-400/20 blur-[85px] pointer-events-none"
                    style={{
                        transform: 'translateY(-2%)',
                    }}
                />
            </div>

            {/* ── Layer 2: Solid Accent Circle (Cinematic Red) ── */}
            <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[58vw] max-w-[820px] aspect-square rounded-full bg-[var(--hero-circle)] shadow-[0_0_90px_rgba(201,58,50,0.45)]"
                    style={{
                        transform: 'translateY(-2%)',
                    }}
                />
            </div>

            {/* ── Layer 5: Cut-Out Character Photo (In Front of Title & Marquee) ── */}
            <div className="absolute inset-0 z-[5] flex items-end justify-center pointer-events-none overflow-hidden">
                {/* Entrance reveal wrapper */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.9,
                        delay: 0.35,
                        ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative w-auto h-[78%] sm:h-[86%] lg:h-[91%] flex items-end justify-center"
                >
                    {/* Parallax Spring Physics Layer (Runs directly on GPU compositor without React re-renders) */}
                    <motion.div
                        style={{
                            x: reducedMotion ? 0 : smoothX,
                            y: reducedMotion ? 0 : smoothY,
                        }}
                        className="h-full w-auto flex items-end justify-center"
                    >
                        <img
                            src={photo}
                            alt={heroConfig.portraitAlt}
                            width={900}
                            height={1200}
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                            className="h-full w-auto max-w-none object-contain object-bottom pointer-events-auto select-none filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.65)] dark:drop-shadow-[0_20px_45px_rgba(0,0,0,0.9)]"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </>
    );
}

export default HeroPortrait;
