import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Award, Clock, User, CheckCircle2 } from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';

interface AboutMeSectionProps {
    aboutData: any;
}

function Counter({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };
        window.requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return (
        <span ref={ref} className="font-extrabold text-3xl sm:text-4xl gradient-text">
            {count}{suffix}
        </span>
    );
}

export default function AboutMeSection({ aboutData }: AboutMeSectionProps) {
    const { t } = useTranslation();

    const description = getTranslated(
        aboutData?.description,
        '<p>Hello! I am a full-stack engineer and creative technologist who loves crafting immersive interactive experiences.</p>'
    );

    const projectsCount = aboutData?.projects_completed || 24;
    const certsCount = aboutData?.certifications || 12;
    const expCount = aboutData?.years_experience || 4;

    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
                        <User className="w-3.5 h-3.5" />
                        <span>{t('about.title')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        {t('about.subtitle')}
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Left: Biography Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-xl space-y-6"
                    >
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed [&>p]:mb-4 [&>p:last-child]:mb-0 [&>h2]:text-foreground [&>h3]:text-foreground"
                            dangerouslySetInnerHTML={{ __html: description }}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border/60 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>Modern Architecture & Clean Code</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>3D Graphics & Shader Effects</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>RESTful & Real-time Integrations</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>Responsive & Accessible UI/UX</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Counter Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-5 grid grid-cols-1 gap-4"
                    >
                        {/* Stat 1: Projects */}
                        <div className="p-6 rounded-2xl border border-border/80 bg-card/50 backdrop-blur-xl shadow-lg glow-card flex items-center justify-between">
                            <div className="space-y-1">
                                <Counter end={projectsCount} suffix="+" />
                                <div className="text-xs font-semibold text-muted-foreground">{t('about.statsProjects')}</div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <Briefcase className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Stat 2: Certifications */}
                        <div className="p-6 rounded-2xl border border-border/80 bg-card/50 backdrop-blur-xl shadow-lg glow-card flex items-center justify-between">
                            <div className="space-y-1">
                                <Counter end={certsCount} suffix="+" />
                                <div className="text-xs font-semibold text-muted-foreground">{t('about.statsCerts')}</div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
                                <Award className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Stat 3: Years Experience */}
                        <div className="p-6 rounded-2xl border border-border/80 bg-card/50 backdrop-blur-xl shadow-lg glow-card flex items-center justify-between">
                            <div className="space-y-1">
                                <Counter end={expCount} suffix="+ Years" />
                                <div className="text-xs font-semibold text-muted-foreground">{t('about.statsExp')}</div>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
