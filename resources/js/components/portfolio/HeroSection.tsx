import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Layers, Cpu } from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';

const ThreeCanvas = lazy(() => import('./ThreeCanvas'));

interface HeroSectionProps {
    heroData: any;
}

export default function HeroSection({ heroData }: HeroSectionProps) {
    const { t } = useTranslation();

    const title = getTranslated(
        heroData?.title,
        'Building Next-Gen 3D Web & Fullstack Experiences'
    );
    const subtitle = getTranslated(
        heroData?.subtitle,
        'Passionate Software Engineer specializing in modern reactive architectures, Three.js 3D visuals, and high-performance web systems.'
    );

    return (
        <section className="relative min-h-screen pt-28 pb-20 flex items-center justify-center overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    {/* Left Column: Text & CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="lg:col-span-7 space-y-6 text-center lg:text-left z-10"
                    >
                        {/* Status Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-medium backdrop-blur-md shadow-sm"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{t('hero.badge')}</span>
                        </motion.div>

                        {/* Main Headline */}
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-foreground">
                            {title.includes('&') ? (
                                <>
                                    {title.split('&')[0]} &{' '}
                                    <span className="gradient-text">{title.split('&')[1]}</span>
                                </>
                            ) : (
                                <span className="gradient-text">{title}</span>
                            )}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            {subtitle}
                        </p>

                        {/* CTA Action Buttons */}
                        <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                            <a
                                href="#projects"
                                className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 text-white font-medium text-sm shadow-xl shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            >
                                <span>{t('hero.viewProjects')}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>

                            <a
                                href="#about"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card/80 hover:bg-secondary text-foreground font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            >
                                <Sparkles className="w-4 h-4 text-amber-400" />
                                <span>{t('hero.contactMe')}</span>
                            </a>
                        </div>

                        {/* Feature Badges */}
                        <div className="pt-6 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-left">
                            <div className="p-3 rounded-xl border border-border/70 bg-card/40 backdrop-blur-md">
                                <Code2 className="w-4 h-4 text-purple-400 mb-1" />
                                <div className="text-[11px] font-semibold text-foreground">Clean Code</div>
                                <div className="text-[10px] text-muted-foreground">Clean Architecture</div>
                            </div>
                            <div className="p-3 rounded-xl border border-border/70 bg-card/40 backdrop-blur-md">
                                <Layers className="w-4 h-4 text-cyan-400 mb-1" />
                                <div className="text-[11px] font-semibold text-foreground">3D Visuals</div>
                                <div className="text-[10px] text-muted-foreground">Three.js & WebGL</div>
                            </div>
                            <div className="p-3 rounded-xl border border-border/70 bg-card/40 backdrop-blur-md">
                                <Cpu className="w-4 h-4 text-amber-400 mb-1" />
                                <div className="text-[11px] font-semibold text-foreground">Reactive</div>
                                <div className="text-[10px] text-muted-foreground">Inertia & React 19</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Interactive 3D Canvas */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className="lg:col-span-5 flex items-center justify-center relative"
                    >
                        <Suspense
                            fallback={
                                <div className="w-full h-80 flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                                    <span className="text-xs text-muted-foreground">Loading 3D Canvas...</span>
                                </div>
                            }
                        >
                            <ThreeCanvas />
                        </Suspense>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
