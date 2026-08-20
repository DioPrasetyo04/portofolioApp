import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Award, Clock, User, CheckCircle2,
    BarChart3, PieChart as PieIcon, TrendingUp, Activity,
    Code2, Zap, Layers, Monitor, GitBranch, Database,
    Globe, Server, Layout, Sparkles, MapPin, Wifi,
    Terminal, Star, ArrowUpRight, Cpu, Flame,
} from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart as RPieChart, Pie, Cell, Legend,
    AreaChart, Area, CartesianGrid,
} from 'recharts';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Code2, Zap, Layers, Monitor, GitBranch, Database,
    Globe, Server, Layout, Sparkles, Briefcase, Award, Clock,
    CheckCircle2, Activity, Star, Cpu, Flame, Terminal,
};
function DynIcon({ name, className }: { name: string; className?: string }) {
    const Icon = ICON_MAP[name] || CheckCircle2;
    return <Icon className={className} />;
}

/* ─── Types ─────────────────────────────────────────────── */
interface Feature      { name: string; icon: string }
interface ExpertiseTab { id: string; label: string; icon: string; items: string[] }
interface SkillStat    { name: string; value: number; color: string }
interface YearStat     { year: string; count: number }
interface GrowthStat   { period: string; score: number; projects: number }
interface AboutMeSectionProps { aboutData: any }

/* ─── Animated Counter ───────────────────────────────────── */
function Counter({ end, duration = 1.8, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    useEffect(() => {
        if (!isInView) return;
        let ts0: number | null = null;
        const step = (ts: number) => {
            if (!ts0) ts0 = ts;
            const p = Math.min((ts - ts0) / (duration * 1000), 1);
            setCount(Math.floor(p * end));
            if (p < 1) requestAnimationFrame(step); else setCount(end);
        };
        requestAnimationFrame(step);
    }, [isInView, end, duration]);
    return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Circular Progress Ring ─────────────────────────────── */
function ProgressRing({ value, color, label, size = 56 }: { value: number; color: string; label: string; size?: number }) {
    const r = (size - 10) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (value / 100) * circ;
    return (
        <div className="flex flex-col items-center gap-1.5">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.07)" strokeWidth="5" fill="none" />
                <circle
                    cx={size/2} cy={size/2} r={r}
                    stroke={color} strokeWidth="5" fill="none"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 5px ${color}99)` }}
                />
            </svg>
            <div className="text-center -mt-[52px]" style={{ height: `${size}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <span className="text-[11px] font-bold" style={{ color }}>{value}%</span>
            </div>
            <span className="text-[10px] text-muted-foreground text-center leading-tight max-w-[60px]">{label}</span>
        </div>
    );
}

/* ─── Custom Chart Tooltip ───────────────────────────────── */
const ChartTip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="px-3 py-2 rounded-xl border border-border bg-card/95 backdrop-blur-xl shadow-xl text-xs">
            {label && <div className="font-bold text-foreground mb-1">{label}</div>}
            {payload.map((p: any, i: number) => (
                <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
                    <span className="text-muted-foreground">{p.name}:</span>
                    <span className="font-semibold text-foreground">{p.value}</span>
                </div>
            ))}
        </div>
    );
};

/* ─── Gallery Carousel ───────────────────────────────────── */
function GalleryCarousel({ images }: { images: string[] }) {
    const srcs = images.length
        ? images.map(img => img.startsWith('http') ? img : `/storage/${img}`)
        : ['/images/profile-hero.jpg'];

    return (
        <div className="relative w-full aspect-[4/3] max-h-[340px] rounded-2xl overflow-hidden border border-border/50 shadow-2xl shadow-purple-900/20">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                slidesPerView={1}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={srcs.length > 1}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="w-full h-full"
            >
                {srcs.map((src, i) => (
                    <SwiperSlide key={i} className="w-full h-full">
                        <img
                            src={src}
                            alt={`Gallery ${i + 1}`}
                            className="w-full h-full object-cover object-center"
                            loading="lazy"
                        />
                        {/* Bottom gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Photo count pill */}
            {srcs.length > 1 && (
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white/80 text-[10px] font-mono border border-white/10 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                    {srcs.length} Photos
                </div>
            )}

            {/* Glow border accent */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-purple-500/20 pointer-events-none" />
        </div>
    );
}

/* ─── Expertise Tabs (Left Column) ──────────────────────── */
function ExpertiseTabs({ tabs }: { tabs: ExpertiseTab[] }) {
    const [active, setActive] = useState(tabs[0]?.id ?? '');
    const current = tabs.find(t => t.id === active) ?? tabs[0];

    return (
        <div className="space-y-3">
            {/* Tab bar */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/60 border border-border/60 backdrop-blur-md overflow-x-auto scrollbar-hide">
                {tabs.map(tab => {
                    const isActive = tab.id === active;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 whitespace-nowrap ${
                                isActive
                                    ? 'bg-background text-foreground shadow-sm border border-border/80'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <DynIcon name={tab.icon} className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : ''}`} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Items grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-wrap gap-2"
                >
                    {(current?.items ?? []).map((item, i) => (
                        <motion.span
                            key={item}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="px-3 py-1.5 rounded-lg border border-border/70 bg-card/60 backdrop-blur-md text-xs font-medium text-foreground hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 transition-all duration-200 cursor-default"
                        >
                            {item}
                        </motion.span>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

/* ─── Stats Panel (Right Column) ────────────────────────── */
type TabId = 'overview' | 'bar' | 'donut' | 'line';
const STAT_TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'bar',      label: 'Projects', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'donut',    label: 'Skills',   icon: <PieIcon   className="w-3.5 h-3.5" /> },
    { id: 'line',     label: 'Growth',   icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

function StatsPanel({ aboutData }: { aboutData: any }) {
    const { t } = useTranslation();
    const [tab, setTab] = useState<TabId>('overview');

    const projectsCount = aboutData?.projects_completed ?? 24;
    const certsCount    = aboutData?.certifications    ?? 12;
    const expCount      = aboutData?.years_experience  ?? 4;

    const skills: SkillStat[] = aboutData?.skill_stats?.skills ?? [
        { name: 'React / Three.js', value: 90, color: '#8B5CF6' },
        { name: 'Laravel / PHP',    value: 88, color: '#22D3EE' },
        { name: 'TypeScript',       value: 85, color: '#F59E0B' },
        { name: 'DevOps / DB',      value: 75, color: '#10B981' },
    ];
    const projectsPerYear: YearStat[] = aboutData?.skill_stats?.projects_per_year ?? [
        { year: '2021', count: 3 }, { year: '2022', count: 6 },
        { year: '2023', count: 8 }, { year: '2024', count: 7 }, { year: '2025', count: 10 },
    ];
    const growth: GrowthStat[] = aboutData?.skill_stats?.growth ?? [
        { period: '2021', score: 60, projects: 3 }, { period: '2022', score: 70, projects: 6 },
        { period: '2023', score: 80, projects: 8 }, { period: '2024', score: 88, projects: 9 },
        { period: '2025', score: 95, projects: 12 },
    ];

    return (
        <div className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden">

            {/* Tab navigation */}
            <div className="flex border-b border-border/50 bg-secondary/40">
                {STAT_TABS.map(t2 => (
                    <button
                        key={t2.id}
                        onClick={() => setTab(t2.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11px] font-semibold transition-all duration-200 border-b-2 ${
                            tab === t2.id
                                ? 'border-purple-500 text-purple-400 bg-purple-500/5'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5'
                        }`}
                    >
                        {t2.icon}
                        <span className="hidden sm:inline">{t2.label}</span>
                    </button>
                ))}
            </div>

            <div className="p-5 min-h-[450px]">
                <AnimatePresence mode="wait">
                    {/* ─── OVERVIEW TAB ─── */}
                    {tab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">

                            {/* Status badges row */}
                            <div className="flex flex-wrap gap-2">
                                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Available for Work
                                </span>
                                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[11px] font-semibold">
                                    <Wifi className="w-3 h-3" />
                                    Remote OK
                                </span>
                                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-400 text-[11px] font-semibold">
                                    <MapPin className="w-3 h-3" />
                                    Indonesia
                                </span>
                            </div>

                            {/* Big stat bento grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Projects — spans 2 rows */}
                                <div className="row-span-2 relative p-4 rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 flex flex-col justify-between group hover:border-purple-500/50 transition-all duration-300 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                                    <Briefcase className="w-5 h-5 text-purple-400 mb-auto" />
                                    <div>
                                        <div className="text-3xl font-extrabold gradient-text leading-none mb-1">
                                            <Counter end={projectsCount} suffix="+" />
                                        </div>
                                        <div className="text-[11px] font-semibold text-muted-foreground">{t('about.statsProjects')}</div>
                                    </div>
                                    {/* glow dot */}
                                    <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-purple-500/20 blur-2xl" />
                                </div>

                                {/* Certs */}
                                <div className="p-4 rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 flex items-center justify-between group hover:border-cyan-500/50 transition-all duration-300 overflow-hidden relative">
                                    <div>
                                        <div className="text-xl font-extrabold text-cyan-400 leading-none mb-0.5">
                                            <Counter end={certsCount} suffix="+" />
                                        </div>
                                        <div className="text-[10px] font-semibold text-muted-foreground">{t('about.statsCerts')}</div>
                                    </div>
                                    <Award className="w-5 h-5 text-cyan-400/70" />
                                    <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full bg-cyan-500/20 blur-xl" />
                                </div>

                                {/* Years */}
                                <div className="p-4 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-orange-500/5 flex items-center justify-between group hover:border-amber-500/50 transition-all duration-300 overflow-hidden relative">
                                    <div>
                                        <div className="text-xl font-extrabold text-amber-400 leading-none mb-0.5">
                                            <Counter end={expCount} suffix="+" />
                                        </div>
                                        <div className="text-[10px] font-semibold text-muted-foreground">{t('about.statsExp')}</div>
                                    </div>
                                    <Clock className="w-5 h-5 text-amber-400/70" />
                                    <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full bg-amber-500/20 blur-xl" />
                                </div>
                            </div>

                            {/* Skill progress rings row */}
                            <div className="p-4 rounded-2xl border border-border/50 bg-card/40">
                                <div className="text-[11px] font-semibold text-muted-foreground mb-4 flex items-center gap-1.5">
                                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                                    Core Skill Proficiency
                                </div>
                                <div className="flex items-end justify-around">
                                    {skills.slice(0, 4).map((s) => (
                                        <ProgressRing key={s.name} value={s.value} color={s.color} label={s.name.split('/')[0].trim()} size={56} />
                                    ))}
                                </div>
                            </div>

                            {/* Terminal "Currently building" card */}
                            <div className="p-4 rounded-2xl border border-border/50 bg-card/40 font-mono text-xs space-y-1.5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                                    <span className="text-muted-foreground/60 text-[10px] ml-1">terminal</span>
                                </div>
                                <div className="text-muted-foreground"><span className="text-emerald-400">~</span> <span className="text-purple-400">whoami</span></div>
                                <div className="text-foreground/80">Dio Prasetyo — Fullstack Engineer</div>
                                <div className="text-muted-foreground"><span className="text-emerald-400">~</span> <span className="text-cyan-400">status</span></div>
                                <div className="flex items-center gap-1.5 text-foreground/80">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Building: Portfolio 3D v2.0
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── BAR CHART TAB ─── */}
                    {tab === 'bar' && (
                        <motion.div key="bar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                    <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                                    Projects Completed Per Year
                                </p>
                                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                    Total: {projectsCount}+ Projects
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart data={projectsPerYear} barCategoryGap="35%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<ChartTip />} />
                                    <defs>
                                        <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#8B5CF6" />
                                            <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.8} />
                                        </linearGradient>
                                    </defs>
                                    <Bar dataKey="count" name="Projects" fill="url(#barG)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* ─── DONUT TAB ─── */}
                    {tab === 'donut' && (
                        <motion.div key="donut" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                    <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
                                    Skill Proficiency Distribution
                                </p>
                                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                    Top: {skills[0]?.name}
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <RPieChart>
                                    <Pie data={skills} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="76%" paddingAngle={4} stroke="none">
                                        {skills.map((s, i) => <Cell key={i} fill={s.color} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTip />} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }} />
                                </RPieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* ─── AREA/LINE TAB ─── */}
                    {tab === 'line' && (
                        <motion.div key="line" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                    Skill Growth & Project Trajectory
                                </p>
                                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                    Trajectory: Upward ↗
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={growth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<ChartTip />} />
                                    <defs>
                                        <linearGradient id="aS" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="aP" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="#22D3EE" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="score"    name="Skill Score"    stroke="#8B5CF6" fill="url(#aS)" strokeWidth={2.5} dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="projects" name="Active Projects" stroke="#22D3EE" fill="url(#aP)" strokeWidth={2.5} dot={{ r: 4, fill: '#22D3EE', strokeWidth: 0 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ─── Main Section ──────────────────────────────────────── */
export default function AboutMeSection({ aboutData }: AboutMeSectionProps) {
    const { t } = useTranslation();

    const description = getTranslated(
        aboutData?.description,
        '<p>Hello! I am a full-stack engineer and creative technologist who loves crafting immersive interactive experiences. With a strong background in Laravel, React, and 3D graphics, I bridge the gap between aesthetic design and robust engineering.</p>'
    );

    const galleryImages: string[]    = aboutData?.gallery_images   ?? [];
    const features: Feature[]        = aboutData?.features         ?? [];
    const expertiseTabs: ExpertiseTab[] = aboutData?.expertise_tabs ?? [];

    /* Fallback features */
    const displayFeatures: Feature[] = features.length ? features : [
        { name: 'Modern Architecture & Clean Code', icon: 'Code2'     },
        { name: 'RESTful & Real-time Integrations', icon: 'Zap'       },
        { name: '3D Graphics & Shader Effects',     icon: 'Layers'    },
        { name: 'Responsive & Accessible UI/UX',    icon: 'Monitor'   },
    ];

    /* Fallback expertise tabs */
    const displayTabs: ExpertiseTab[] = expertiseTabs.length ? expertiseTabs : [
        { id: 'web', label: 'Web Dev', icon: 'Globe', items: ['React.js', 'TypeScript', 'Next.js', 'Vite', 'Tailwind CSS'] },
        { id: 'backend', label: 'Backend', icon: 'Server', items: ['Laravel', 'Node.js', 'MySQL', 'Redis', 'REST API'] },
        { id: 'architecture', label: 'Architecture', icon: 'Layout', items: ['Repository Pattern', 'Service Layer', 'SOLID', 'MVC', 'DDD'] },
        { id: 'creative', label: '3D / Creative', icon: 'Sparkles', items: ['Three.js', 'WebGL', 'GSAP', 'Framer Motion'] },
    ];

    return (
        <section id="about" className="py-28 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-400/6 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Section Header (enlarged) ── */}
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold"
                    >
                        <User className="w-3.5 h-3.5" />
                        <span>{t('about.title')}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]"
                    >
                        {t('about.subtitle')}
                    </motion.h2>
                </div>

                <div className="space-y-8">
                    {/* ── Top Row: Gallery + Tech Expertise (Left) & StatsPanel (Right) ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* ── LEFT: Photo Gallery Carousel + Tech Expertise ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65 }}
                            className="lg:col-span-5 space-y-5 flex flex-col"
                        >
                            {/* Photo Gallery */}
                            <GalleryCarousel images={galleryImages} />

                            {/* Tech Expertise — positioned below photo */}
                            <div className="p-5 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-xl space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                    <Cpu className="w-4 h-4 text-purple-400" />
                                    Tech Expertise
                                </div>
                                <ExpertiseTabs tabs={displayTabs} />
                            </div>
                        </motion.div>

                        {/* ── RIGHT: Interactive Stats Panel ── */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65, delay: 0.15 }}
                            className="lg:col-span-7"
                        >
                            <StatsPanel aboutData={aboutData} />
                        </motion.div>
                    </div>

                    {/* ── Bottom Row: Full-Width Biography & Feature Checklist ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: 0.2 }}
                        className="w-full"
                    >
                        <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-xl space-y-6">
                            <div
                                className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />

                            {/* Dynamic feature checklist from backend */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-border/50">
                                {displayFeatures.map((feat) => (
                                    <div key={feat.name} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/30 border border-border/40 group hover:bg-secondary/60 hover:border-emerald-500/30 transition-all">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                            <DynIcon name={feat.icon} className="w-3.5 h-3.5 text-emerald-400" />
                                        </div>
                                        <span className="text-xs font-medium text-foreground/90 group-hover:text-foreground transition-colors leading-snug">{feat.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
