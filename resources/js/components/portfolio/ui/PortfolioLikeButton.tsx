"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Particle {
    id: number;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    char: string;
}

interface PortfolioLikeButtonProps {
    variant?: 'hero' | 'cosmic';
    isMobile?: boolean;
    className?: string;
    idPrefix?: string;
}

export default function PortfolioLikeButton({
    variant = 'hero',
    isMobile = false,
    className = '',
    idPrefix = 'global',
}: PortfolioLikeButtonProps) {
    const { t } = useTranslation();
    const [likesCount, setLikesCount] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isExploding, setIsExploding] = useState<boolean>(false);

    // Sync with localStorage on initial mount
    useEffect(() => {
        const storedLiked = localStorage.getItem('portfolio_has_liked') === 'true';
        if (storedLiked) {
            setIsLiked(true);
        }

        // Fetch current total likes & IP status from backend
        let isMounted = true;
        fetch('/interactions/portfolio-like', {
            headers: {
                Accept: 'application/json',
            },
        })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (!isMounted || !data) return;
                setLikesCount(data.total_likes ?? 0);
                if (data.already_liked !== undefined) {
                    setIsLiked(!!data.already_liked);
                    if (data.already_liked) {
                        localStorage.setItem('portfolio_has_liked', 'true');
                    } else {
                        localStorage.removeItem('portfolio_has_liked');
                    }
                }
            })
            .catch(() => {
                // Silently fallback if offline
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Interactive burst particle effect generator
    const triggerParticles = useCallback(() => {
        const particlePool = ['❤️', '💖', '✨', '🔥', '🤍'];
        const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
            id: Date.now() + i,
            x: (Math.random() - 0.5) * 80,
            y: -30 - Math.random() * 55,
            scale: 0.7 + Math.random() * 0.7,
            rotation: (Math.random() - 0.5) * 45,
            char: particlePool[Math.floor(Math.random() * particlePool.length)],
        }));

        setParticles(newParticles);
        setIsExploding(true);

        setTimeout(() => {
            setParticles([]);
            setIsExploding(false);
        }, 1200);
    }, []);

    // Handle like click with dual anti-spam (frontend disable + backend IP check)
    const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (isLiked || isSubmitting) {
            toast.info(t('nav.liked') || 'You have already liked this portfolio!');
            return;
        }

        // 1. Optimistic UI update: immediate disabled state & animation
        setIsSubmitting(true);
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
        localStorage.setItem('portfolio_has_liked', 'true');
        triggerParticles();

        // 2. Transmit to backend
        try {
            const csrfToken =
                document.head.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content || '';

            const response = await fetch('/interactions/portfolio-like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const data = await response.json();

            if (response.status === 409) {
                // Backend anti-spam triggered: IP already liked
                setLikesCount(data.total_likes ?? likesCount);
                toast.info(data.message || 'You have already liked this portfolio.');
            } else if (response.ok) {
                setLikesCount(data.total_likes ?? likesCount);
                toast.success('Thank you for liking my portfolio! ❤️', {
                    duration: 3500,
                });
            } else {
                toast.error(data.message || 'Failed to submit like.');
            }
        } catch {
            toast.error('Network connection error. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Number formatter for neat display
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toLocaleString();
    };

    // Styling variants
    const isHero = variant === 'hero';

    const baseClasses = isHero
        ? isMobile
            ? 'w-full py-2.5 px-4 rounded-full flex items-center justify-center gap-2 text-sm font-hero-condensed uppercase tracking-wider font-bold transition-all duration-300'
            : 'h-9 sm:h-10 px-3 sm:px-3.5 rounded-full flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-hero-condensed uppercase tracking-wider transition-all duration-300 select-none'
        : isMobile
          ? 'w-full py-2 px-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold transition-all duration-200'
          : 'h-8 sm:h-9 px-3 rounded-2xl flex items-center gap-1.5 text-xs font-semibold transition-all duration-200 select-none';

    const stateClasses = isLiked
        ? isHero
            ? 'bg-gradient-to-r from-red-600/25 via-red-500/20 to-amber-500/20 border border-red-500/50 text-red-200 shadow-[0_0_16px_rgba(239,68,68,0.35)] cursor-default'
            : 'bg-pink-600/20 border border-pink-500/40 text-pink-300 shadow-[0_0_14px_rgba(236,72,153,0.3)] cursor-default'
        : isHero
          ? 'border border-[var(--hero-pill-border)] bg-black/40 hover:bg-[#C93A32]/25 hover:border-[#C93A32] text-white/90 hover:text-white shadow-sm hover:shadow-[0_0_18px_rgba(201,58,50,0.4)] active:scale-95 cursor-pointer'
          : 'bg-white/10 dark:bg-white/5 border border-white/15 hover:border-purple-400/50 hover:bg-purple-500/15 text-foreground hover:text-purple-300 shadow-sm active:scale-95 cursor-pointer';

    return (
        <div className={`relative inline-block ${isMobile ? 'w-full' : ''}`}>
            {/* Click Burst Particles */}
            <AnimatePresence>
                {particles.map((p) => (
                    <motion.span
                        key={p.id}
                        initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
                        animate={{
                            opacity: [1, 1, 0],
                            x: p.x,
                            y: p.y,
                            scale: [0, p.scale, 0],
                            rotate: p.rotation,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-base select-none z-50 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    >
                        {p.char}
                    </motion.span>
                ))}
            </AnimatePresence>

            {/* Shockwave Glow Pulse Ring */}
            {isExploding && (
                <motion.span
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className={`absolute inset-0 rounded-full pointer-events-none z-10 border-2 ${
                        isHero ? 'border-red-500' : 'border-purple-400'
                    }`}
                />
            )}

            {/* Interactive Button */}
            <motion.button
                id={`${idPrefix}-like-btn`}
                type="button"
                onClick={handleLikeClick}
                disabled={isLiked || isSubmitting}
                aria-label={isLiked ? t('nav.liked') : t('nav.like')}
                title={isLiked ? t('nav.liked') : t('nav.like')}
                whileTap={!isLiked ? { scale: 0.94 } : undefined}
                className={`${baseClasses} ${stateClasses} ${className}`}
            >
                {/* Heart Icon with Spring Scale Bounce */}
                <motion.div
                    animate={
                        isExploding
                            ? { scale: [1, 1.45, 0.9, 1.15, 1], rotate: [0, -10, 10, -5, 0] }
                            : { scale: 1, rotate: 0 }
                    }
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="flex-shrink-0 relative"
                >
                    <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-300 ${
                            isLiked
                                ? 'fill-red-500 text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                                : 'text-neutral-300 group-hover:text-red-400 group-hover:scale-110'
                        }`}
                    />
                </motion.div>

                {/* State Text & Animated Counter */}
                <span className="font-bold flex items-center gap-1">
                    <span>{isLiked ? t('nav.liked') : t('nav.like')}</span>
                    <span
                        className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold ${
                            isLiked
                                ? 'bg-red-500/25 text-red-100 border border-red-500/30'
                                : 'bg-white/10 text-white/80'
                        }`}
                    >
                        {formatNumber(likesCount)}
                    </span>
                </span>
            </motion.button>
        </div>
    );
}
