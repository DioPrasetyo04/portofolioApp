import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Code2, Layers, Cpu, Github, Linkedin } from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';

const ThreeCanvas = lazy(() => import('./ThreeCanvas'));

interface HeroSectionProps {
    heroData: any;
}

// Profile Photo with animated glow rings - replaces the 3D canvas object
function ProfilePhoto({ src }: { src?: string | null }) {
    const photoSrc = src ? `/storage/${src}` : '/images/profile-hero.jpg';

    return (
        <div className="relative flex items-center justify-center w-full select-none">
            {/* Ambient background glow layers */}
            <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-[80px] scale-110" />
            <div className="absolute inset-0 rounded-full bg-cyan-400/15 blur-[60px] scale-90 animate-pulse" style={{ animationDuration: '4s' }} />

            {/* Outermost rotating orbit ring */}
            <div className="absolute w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] rounded-full border border-purple-500/20"
                style={{ animation: 'spin 20s linear infinite' }}>
                {/* Small diamond accent on the ring */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-sm bg-amber-400 rotate-45 shadow-md shadow-amber-400/50" />
            </div>

            {/* Middle orbit ring */}
            <div className="absolute w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] rounded-full border border-cyan-400/25"
                style={{ animation: 'spin 14s linear infinite reverse' }}>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/60" />
            </div>

            {/* Inner glow ring */}
            <div className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border border-purple-400/30"
                style={{ animation: 'spin 9s linear infinite' }} />

            {/* The profile photo frame */}
            <div className="relative z-10 w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-full p-[3px]"
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #22D3EE, #F59E0B, #8B5CF6)', backgroundSize: '300% 300%', animation: 'gradientShift 6s ease infinite' }}>
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-background/50 shadow-2xl">
                    <img
                        src={photoSrc}
                        alt="Profile"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                            // fallback if image fails
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>
                {/* Inner glow overlay on photo */}
                <div className="absolute inset-0 rounded-full"
                    style={{ background: 'radial-gradient(circle at 30% 30%, rgba(139,92,246,0.15), transparent 60%)' }} />
            </div>

            {/* Floating badge: Stack */}
            <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -right-4 sm:-right-8 top-8 px-3 py-2 rounded-xl border border-border bg-card/90 backdrop-blur-xl shadow-xl text-[11px] font-semibold text-foreground flex items-center gap-2"
            >
                <Code2 className="w-4 h-4 text-purple-400" />
                <div>
                    <div className="text-[10px] text-muted-foreground font-normal">Tech</div>
                    <span>Fullstack</span>
                </div>
            </motion.div>

            {/* Floating badge: 3D */}
            <motion.div
                animate={{ y: [8, -8, 8] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -left-4 sm:-left-8 top-16 px-3 py-2 rounded-xl border border-border bg-card/90 backdrop-blur-xl shadow-xl text-[11px] font-semibold text-foreground flex items-center gap-2"
            >
                <Layers className="w-4 h-4 text-cyan-400" />
                <div>
                    <div className="text-[10px] text-muted-foreground font-normal">Spesialis</div>
                    <span>3D / WebGL</span>
                </div>
            </motion.div>

            {/* Floating badge: Open to work */}
            <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl border border-emerald-500/30 bg-card/90 backdrop-blur-xl shadow-xl text-[11px] font-semibold text-emerald-400 flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open to Work</span>
            </motion.div>
        </div>
    );
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

    // Use photo from heroData if available, else fallback to public asset
    const heroImage: string | null = heroData?.image ?? null;

    return (
        <section className="relative min-h-screen pt-28 pb-20 flex items-center justify-center overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            {/* Keyframes for ring animations */}
            <style>{`
                @keyframes gradientShift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>

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

                    {/* Right Column: Profile Photo with 3D Glow Rings */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                        className="lg:col-span-5 flex items-center justify-center relative py-12 lg:py-0"
                    >
                        <ProfilePhoto src={heroImage} />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
