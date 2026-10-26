import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Award, Clock, User, CheckCircle2,
    BarChart3, PieChart as PieIcon, TrendingUp, Activity,
    Code2, Zap, Layers, Monitor, GitBranch, Database,
    Globe, Server, Layout, Sparkles, MapPin, Wifi,
    Terminal, Star, ArrowUpRight, Cpu, Flame, ShieldCheck,
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
    CheckCircle2, Activity, Star, Cpu, Flame, Terminal, ShieldCheck,
};
function DynIcon({ name, className }: { name: string; className?: string }) {
    const Icon = ICON_MAP[name] || CheckCircle2;
    return <Icon className={className} />;
}

/* ─── Types ─────────────────────────────────────────────── */
interface Feature {
    name: string;
    icon: string;
    description?: string;
}
interface ExpertiseTab {
    id: string;
    label: string;
    icon: string;
    items: string[];
}
interface DomainWorkload {
    name: string;
    value: number;
    color: string;
    desc: string;
}
interface YearStat {
    year: string;
    count: number;
}
interface ProductionVelocity {
    period: string;
    features: number;
    repos: number;
}
interface AboutMeSectionProps {
    aboutData: any;
}

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

/* ─── Custom Chart Tooltip ───────────────────────────────── */
const ChartTip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="px-3.5 py-2.5 rounded-xl border border-border bg-card/95 backdrop-blur-sm shadow-xl text-xs space-y-1">
            {label && <div className="font-bold text-foreground pb-1 border-b border-border/50">{label}</div>}
            {payload.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
                        {p.name}:
                    </span>
                    <span className="font-mono font-bold text-foreground">{p.value}</span>
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
                autoplay={{ delay: 3000, disableOnInteraction: false }}
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
                            decoding="async"
                        />
                        {/* Bottom gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Photo count pill */}
            {srcs.length > 1 && (
                <div className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full bg-black/70 text-white/80 text-[10px] font-mono border border-white/10 flex items-center gap-1">
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
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/80 border border-border/60 backdrop-blur-sm overflow-x-auto scrollbar-hide">
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
                            transition={{ delay: i * 0.04 }}
                            className="px-3 py-1.5 rounded-lg border border-border/70 bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300 transition-all duration-200 cursor-default"
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
type TabId = 'overview' | 'deliveries' | 'domains' | 'velocity';

const STAT_TABS: { id: TabId; labelKey: string; defaultLabel: string; icon: React.ReactNode }[] = [
    { id: 'overview',   labelKey: 'about.tabOverview',   defaultLabel: 'Overview',   icon: <Activity className="w-3.5 h-3.5" /> },
    { id: 'deliveries', labelKey: 'about.tabDeliveries', defaultLabel: 'Deliveries', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'domains',    labelKey: 'about.tabDomains',    defaultLabel: 'Focus Split',icon: <PieIcon className="w-3.5 h-3.5" /> },
    { id: 'velocity',   labelKey: 'about.tabVelocity',   defaultLabel: 'Velocity',   icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

function StatsPanel({ aboutData }: { aboutData: any }) {
    const { t } = useTranslation();
    const [tab, setTab] = useState<TabId>('overview');

    const projectsCount = aboutData?.projects_completed ?? 24;
    const certsCount    = aboutData?.certifications    ?? 12;
    const expCount      = aboutData?.years_experience  ?? 4;

    /* Grounded engineering workload distribution across 4 disciplines (sum = 100%) */
    const domainWorkloads: DomainWorkload[] = [
        { name: 'Backend & APIs',  value: 40, color: '#22D3EE', desc: 'Laravel, MySQL, Redis, REST/JSON-API' },
        { name: 'Frontend SPA',    value: 30, color: '#8B5CF6', desc: 'React, TypeScript, Inertia, Tailwind' },
        { name: '3D & WebGL',      value: 20, color: '#F59E0B', desc: 'Three.js, GLSL, Framer Motion' },
        { name: 'DevOps & Tooling', value: 10, color: '#10B981', desc: 'Docker, CI/CD, Git, Linux' },
    ];

    const projectsPerYear: YearStat[] = aboutData?.skill_stats?.projects_per_year ?? [
        { year: '2021', count: 3 },
        { year: '2022', count: 6 },
        { year: '2023', count: 8 },
        { year: '2024', count: 7 },
        { year: '2025', count: 10 },
    ];

    const productionVelocity: ProductionVelocity[] = [
        { period: '2021', features: 14, repos: 3 },
        { period: '2022', features: 32, repos: 6 },
        { period: '2023', features: 58, repos: 10 },
        { period: '2024', features: 84, repos: 14 },
        { period: '2025', features: 120, repos: 19 },
    ];

    return (
        <div className="rounded-2xl border border-border/60 bg-card/90 backdrop-blur-sm shadow-2xl shadow-black/20 overflow-hidden">

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
                        <span className="hidden sm:inline">{t(t2.labelKey, t2.defaultLabel)}</span>
                    </button>
                ))}
            </div>

            <div className="p-5 min-h-[450px]">
                <AnimatePresence mode="wait">
                    {/* ─── OVERVIEW TAB ─── */}
                    {tab === 'overview' && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">

                            {/* Status badges row */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    {t('about.availableBadge', 'Available for Work')}
                                </span>
                                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[11px] font-semibold">
                                    <Wifi className="w-3 h-3" />
                                    {t('about.remoteBadge', 'Remote / Hybrid OK')}
                                </span>
                                <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-400 text-[11px] font-semibold">
                                    <MapPin className="w-3 h-3" />
                                    {t('about.locationBadge', 'Indonesia (UTC+7)')}
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
                                        <div className="text-[11px] font-semibold text-muted-foreground">{t('about.statsProjects', 'Shipped Projects')}</div>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />
                                </div>

                                {/* Certs */}
                                <div className="p-4 rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 flex items-center justify-between group hover:border-cyan-500/50 transition-all duration-300 overflow-hidden relative">
                                    <div>
                                        <div className="text-xl font-extrabold text-cyan-400 leading-none mb-0.5">
                                            <Counter end={certsCount} suffix="+" />
                                        </div>
                                        <div className="text-[10px] font-semibold text-muted-foreground">{t('about.statsCerts', 'Verified Credentials')}</div>
                                    </div>
                                    <Award className="w-5 h-5 text-cyan-400/70" />
                                    <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full bg-cyan-500/20 blur-xl pointer-events-none" />
                                </div>

                                {/* Years */}
                                <div className="p-4 rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-orange-500/5 flex items-center justify-between group hover:border-amber-500/50 transition-all duration-300 overflow-hidden relative">
                                    <div>
                                        <div className="text-xl font-extrabold text-amber-400 leading-none mb-0.5">
                                            <Counter end={expCount} suffix="+" />
                                        </div>
                                        <div className="text-[10px] font-semibold text-muted-foreground">{t('about.statsExp', 'Production Experience')}</div>
                                    </div>
                                    <Clock className="w-5 h-5 text-amber-400/70" />
                                    <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />
                                </div>
                            </div>

                            {/* Domain Focus Distribution (Sums to 100% of engineering workload) */}
                            <div className="p-4 rounded-2xl border border-border/50 bg-card/40 space-y-3">
                                <div className="flex items-center justify-between text-[11px] font-semibold">
                                    <span className="text-muted-foreground flex items-center gap-1.5">
                                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                                        {t('about.domainFocusTitle', 'Engineering Discipline Distribution')}
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground/80">100% Workload Scope</span>
                                </div>

                                {/* Segmented multi-color progress bar */}
                                <div className="h-2 w-full rounded-full bg-secondary/60 overflow-hidden flex">
                                    {domainWorkloads.map(d => (
                                        <div
                                            key={d.name}
                                            style={{ width: `${d.value}%`, backgroundColor: d.color }}
                                            className="h-full transition-all duration-500 hover:opacity-80"
                                            title={`${d.name}: ${d.value}%`}
                                        />
                                    ))}
                                </div>

                                {/* 4 compact domain chips */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {domainWorkloads.map(d => (
                                        <div key={d.name} className="flex items-start gap-2 p-2 rounded-xl bg-secondary/25 border border-border/30 text-[11px]">
                                            <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: d.color }} />
                                            <div className="min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="font-semibold text-foreground truncate">{d.name}</span>
                                                    <span className="font-mono text-[10px] text-muted-foreground font-bold">{d.value}%</span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground truncate block">{d.desc}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Developer Runtime Telemetry Specs Card */}
                            <div className="p-4 rounded-2xl border border-border/50 bg-card/40 font-mono text-xs space-y-2.5">
                                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[11px] font-bold text-foreground tracking-wider uppercase">{t('about.runtimeTitle', 'Developer Runtime Telemetry')}</span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-mono">ID / JKT (UTC+7)</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] tracking-wider">{t('about.coreRuntime', 'CORE RUNTIME')}</span>
                                        <span className="text-foreground font-semibold">PHP 8.2+ · Node 20+</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] tracking-wider">{t('about.architectureStyle', 'ARCHITECTURE')}</span>
                                        <span className="text-foreground font-semibold">Modular MVC · Typed SPA</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] tracking-wider">{t('about.currentFocus', 'CURRENT FOCUS')}</span>
                                        <span className="text-cyan-400 font-semibold">WebGL 3D & Clean APIs</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-[10px] tracking-wider">{t('about.codeContract', 'CODE CONTRACT')}</span>
                                        <span className="text-emerald-400 font-semibold">Strict Types & CI Verified</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── DELIVERIES TAB ─── */}
                    {tab === 'deliveries' && (
                        <motion.div key="deliveries" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                    <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                                    {t('about.deliveriesTitle', 'Projects Delivered Per Year')}
                                </p>
                                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                    {t('about.deliveriesTotal', 'Total Shipped')}: {projectsCount}+
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
                                    <Bar dataKey="count" name="Shipped Projects" fill="url(#barG)" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* ─── DOMAINS / FOCUS SPLIT TAB ─── */}
                    {tab === 'domains' && (
                        <motion.div key="domains" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                    <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
                                    {t('about.focusSplitTitle', 'Architecture & Discipline Workload')}
                                </p>
                                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                                    Primary: Backend & APIs (40%)
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <RPieChart>
                                    <Pie data={domainWorkloads} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="76%" paddingAngle={4} stroke="none">
                                        {domainWorkloads.map((s, i) => <Cell key={i} fill={s.color} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTip />} />
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#a1a1aa' }} />
                                </RPieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* ─── VELOCITY TAB ─── */}
                    {tab === 'velocity' && (
                        <motion.div key="velocity" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                                    {t('about.velocityTitle', 'Production Velocity & Module Deliveries')}
                                </p>
                                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                                    {t('about.velocityBadge', 'Trajectory: Steady Scale ↗')}
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={productionVelocity}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} />
                                    <Tooltip content={<ChartTip />} />
                                    <defs>
                                        <linearGradient id="vFeat" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="vRepo" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="features" name="Delivered Modules" stroke="#8B5CF6" fill="url(#vFeat)" strokeWidth={2.5} dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 0 }} />
                                    <Area type="monotone" dataKey="repos" name="Maintained Repos" stroke="#22D3EE" fill="url(#vRepo)" strokeWidth={2.5} dot={{ r: 4, fill: '#22D3EE', strokeWidth: 0 }} />
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
        '<p>I engineer web applications where backend stability and interface fluidity carry equal weight. Over 4+ years of development, my core stack has centered around Laravel, TypeScript, and React—building structured service layers, predictable client-side state, and clean relational database schemas.</p><p>Beyond standard business applications, I specialize in Three.js and WebGL rendering to create interactive 3D web environments that maintain steady 60 FPS performance without compromising Core Web Vitals. I treat clean architecture not as an abstract ideal, but as an operational guarantee that code remains readable, testable, and effortless to scale.</p>'
    );

    const galleryImages: string[]    = aboutData?.gallery_images   ?? [];
    const features: Feature[]        = aboutData?.features         ?? [];
    const expertiseTabs: ExpertiseTab[] = aboutData?.expertise_tabs ?? [];

    /* Fallback features with high-standard engineering credentials */
    const displayFeatures: Feature[] = features.length ? features : [
        { name: 'Modular Service & Repository Architecture', icon: 'Layers', description: 'Decoupled business logic from controllers for high testability' },
        { name: 'Strict Type Contracts (PHP 8.2 & TS)', icon: 'Code2', description: 'Eliminating runtime type exceptions across client and server' },
        { name: 'GPU-Accelerated 3D & GLSL Shaders', icon: 'Sparkles', description: 'Silky 60 FPS visual experiences without degrading Core Web Vitals' },
        { name: 'Sub-second Load & WCAG Accessible UI', icon: 'Monitor', description: 'Semantic markup, fast paint cycles, and keyboard-first accessibility' },
    ];

    /* Fallback expertise tabs */
    const displayTabs: ExpertiseTab[] = expertiseTabs.length ? expertiseTabs : [
        { id: 'backend', label: 'Backend & APIs', icon: 'Server', items: ['Laravel 11', 'PHP 8.2+', 'MySQL', 'Redis', 'REST/JSON-API', 'Queue Workers'] },
        { id: 'frontend', label: 'Frontend Systems', icon: 'Globe', items: ['React 18', 'TypeScript', 'Inertia.js', 'Vite', 'Tailwind CSS', 'State Management'] },
        { id: 'creative', label: '3D & Graphics', icon: 'Sparkles', items: ['Three.js', 'WebGL', 'GLSL Shaders', 'Framer Motion', 'Canvas 2D'] },
        { id: 'architecture', label: 'Architecture', icon: 'Layout', items: ['Service-Repository Pattern', 'SOLID Principles', 'Relational Schema Design', 'CI/CD Pipelines'] },
    ];

    return (
        <section id="about" className="py-12 sm:py-16 md:py-24 lg:py-28 relative overflow-hidden bg-transparent">
            {/* Ambient Cosmic Background Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-300/15 dark:bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/4 right-10 w-[450px] h-[450px] bg-amber-300/15 dark:bg-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Section Header ── */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 text-xs font-bold dark:font-semibold"
                    >
                        <User className="w-3.5 h-3.5" />
                        <span>{t('about.title', 'Engineering Profile')}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]"
                    >
                        {t('about.subtitle', 'Full-stack engineering focused on resilient architectures, type safety, and real-time 3D')}
                    </motion.h2>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    {/* ── Top Row: Gallery + Tech Expertise (Left) & StatsPanel (Right) ── */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
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
                            <div className="p-5 rounded-2xl border border-border/60 bg-card/90 backdrop-blur-sm shadow-xl space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                    <Cpu className="w-4 h-4 text-purple-400" />
                                    {t('about.techExpertise', 'Core Technical Expertise')}
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

                    {/* ── Bottom Row: Full-Width Biography & Engineering Standards ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.65, delay: 0.2 }}
                        className="w-full"
                    >
                        <div className="p-6 sm:p-8 rounded-3xl border border-border/60 bg-card/90 backdrop-blur-sm shadow-xl space-y-6">
                            <div
                                className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0 font-normal"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />

                            {/* Dynamic feature checklist / Core Engineering Standards */}
                            <div className="space-y-3 pt-6 border-t border-border/50">
                                <div className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                                    {t('about.featuresTitle', 'Core Engineering Standards')}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                    {displayFeatures.map((feat) => (
                                        <div key={feat.name} className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 group hover:bg-secondary/60 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
                                            <div className="flex items-center gap-2.5 mb-2">
                                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                                    <DynIcon name={feat.icon} className="w-3.5 h-3.5 text-emerald-400" />
                                                </div>
                                                <span className="text-xs font-semibold text-foreground/90 group-hover:text-foreground transition-colors leading-snug">{feat.name}</span>
                                            </div>
                                            {feat.description && (
                                                <p className="text-[11px] text-muted-foreground leading-relaxed pl-9">{feat.description}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
