import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    Award,
    Clock,
    User,
    CheckCircle2,
    BarChart3,
    PieChart as PieIcon,
    TrendingUp,
    Activity,
    Code2,
    Zap,
    Layers,
    Monitor,
    GitBranch,
    Database,
    Globe,
    Server,
    Layout,
    Sparkles,
    MapPin,
    Wifi,
    Terminal,
    Star,
    Cpu,
    Flame,
    ShieldCheck,
} from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart as RPieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
    CartesianGrid,
} from 'recharts';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getTranslated } from '@/lib/i18n-helper';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Code2,
    Zap,
    Layers,
    Monitor,
    GitBranch,
    Database,
    Globe,
    Server,
    Layout,
    Sparkles,
    Briefcase,
    Award,
    Clock,
    CheckCircle2,
    Activity,
    Star,
    Cpu,
    Flame,
    Terminal,
    ShieldCheck,
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
function Counter({
    end,
    duration = 1.8,
    suffix = '',
}: {
    end: number;
    duration?: number;
    suffix?: string;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    useEffect(() => {
        if (!isInView) {
            return;
        }

        let ts0: number | null = null;
        const step = (ts: number) => {
            if (!ts0) {
                ts0 = ts;
            }

            const p = Math.min((ts - ts0) / (duration * 1000), 1);
            setCount(Math.floor(p * end));

            if (p < 1) {
                requestAnimationFrame(step);
            } else {
                setCount(end);
            }
        };
        requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

/* ─── Custom Chart Tooltip ───────────────────────────────── */
const ChartTip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="space-y-1 rounded-xl border border-border bg-card/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur-sm">
            {label && (
                <div className="border-b border-border/50 pb-1 font-bold text-foreground">
                    {label}
                </div>
            )}
            {payload.map((p: any, i: number) => (
                <div
                    key={i}
                    className="flex items-center justify-between gap-3"
                >
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                        <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: p.color || p.fill }}
                        />
                        {p.name}:
                    </span>
                    <span className="font-mono font-bold text-foreground">
                        {p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

/* ─── Gallery Carousel ───────────────────────────────────── */
function GalleryCarousel({ images }: { images: string[] }) {
    const srcs = images.length
        ? images.map((img) =>
              img.startsWith('http') ? img : `/storage/${img}`,
          )
        : ['/images/profile-hero.jpg'];

    return (
        <div className="relative aspect-[4/3] max-h-[340px] w-full overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-purple-900/20">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={srcs.length > 1}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="h-full w-full"
            >
                {srcs.map((src, i) => (
                    <SwiperSlide key={i} className="h-full w-full">
                        <img
                            src={src}
                            alt={`Gallery ${i + 1}`}
                            className="h-full w-full object-cover object-center"
                            loading="lazy"
                            decoding="async"
                        />
                        {/* Bottom gradient overlay */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Photo count pill */}
            {srcs.length > 1 && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 font-mono text-[10px] text-white/80">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
                    {srcs.length} Photos
                </div>
            )}

            {/* Glow border accent */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-purple-500/20" />
        </div>
    );
}

/* ─── Expertise Tabs (Left Column) ──────────────────────── */
function ExpertiseTabs({ tabs }: { tabs: ExpertiseTab[] }) {
    const [active, setActive] = useState(tabs[0]?.id ?? '');
    const current = tabs.find((t) => t.id === active) ?? tabs[0];

    return (
        <div className="space-y-3">
            {/* Tab bar */}
            <div className="scrollbar-hide flex items-center gap-1.5 overflow-x-auto rounded-xl border border-border/60 bg-secondary/80 p-1 backdrop-blur-sm">
                {tabs.map((tab) => {
                    const isActive = tab.id === active;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActive(tab.id)}
                            className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
                                isActive
                                    ? 'border border-border/80 bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <DynIcon
                                name={tab.icon}
                                className={`h-3.5 w-3.5 ${isActive ? 'text-purple-400' : ''}`}
                            />
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
                            className="cursor-default rounded-lg border border-border/70 bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-purple-300"
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

const STAT_TABS: {
    id: TabId;
    labelKey: string;
    defaultLabel: string;
    icon: React.ReactNode;
}[] = [
    {
        id: 'overview',
        labelKey: 'about.tabOverview',
        defaultLabel: 'Overview',
        icon: <Activity className="h-3.5 w-3.5" />,
    },
    {
        id: 'deliveries',
        labelKey: 'about.tabDeliveries',
        defaultLabel: 'Deliveries',
        icon: <BarChart3 className="h-3.5 w-3.5" />,
    },
    {
        id: 'domains',
        labelKey: 'about.tabDomains',
        defaultLabel: 'Focus Split',
        icon: <PieIcon className="h-3.5 w-3.5" />,
    },
    {
        id: 'velocity',
        labelKey: 'about.tabVelocity',
        defaultLabel: 'Velocity',
        icon: <TrendingUp className="h-3.5 w-3.5" />,
    },
];

function StatsPanel({ aboutData }: { aboutData: any }) {
    const { t } = useTranslation();
    const [tab, setTab] = useState<TabId>('overview');

    const projectsCount = aboutData?.projects_completed ?? 24;
    const certsCount = aboutData?.certifications ?? 12;
    const expCount = aboutData?.years_experience ?? 4;

    /* Grounded engineering workload distribution across 4 disciplines (sum = 100%) */
    const domainWorkloads: DomainWorkload[] = [
        {
            name: 'Backend & APIs',
            value: 40,
            color: '#22D3EE',
            desc: 'Laravel, MySQL, Redis, REST/JSON-API',
        },
        {
            name: 'Frontend SPA',
            value: 30,
            color: '#8B5CF6',
            desc: 'React, TypeScript, Inertia, Tailwind',
        },
        {
            name: '3D & WebGL',
            value: 20,
            color: '#F59E0B',
            desc: 'Three.js, GLSL, Framer Motion',
        },
        {
            name: 'DevOps & Tooling',
            value: 10,
            color: '#10B981',
            desc: 'Docker, CI/CD, Git, Linux',
        },
    ];

    const projectsPerYear: YearStat[] = aboutData?.skill_stats
        ?.projects_per_year ?? [
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
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-2xl shadow-black/20 backdrop-blur-sm">
            {/* Tab navigation */}
            <div className="flex border-b border-border/50 bg-secondary/40">
                {STAT_TABS.map((t2) => (
                    <button
                        key={t2.id}
                        onClick={() => setTab(t2.id)}
                        className={`flex flex-1 items-center justify-center gap-1.5 border-b-2 py-3 text-[11px] font-semibold transition-all duration-200 ${
                            tab === t2.id
                                ? 'border-purple-500 bg-purple-500/5 text-purple-400'
                                : 'border-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground'
                        }`}
                    >
                        {t2.icon}
                        <span className="hidden sm:inline">
                            {t(t2.labelKey, t2.defaultLabel)}
                        </span>
                    </button>
                ))}
            </div>

            <div className="min-h-[450px] p-5">
                <AnimatePresence mode="wait">
                    {/* ─── OVERVIEW TAB ─── */}
                    {tab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-4"
                        >
                            {/* Status badges row */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-400">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                    {t(
                                        'about.availableBadge',
                                        'Available for Work',
                                    )}
                                </span>
                                <span className="flex items-center gap-1.5 rounded-lg border border-blue-500/25 bg-blue-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-blue-400">
                                    <Wifi className="h-3 w-3" />
                                    {t(
                                        'about.remoteBadge',
                                        'Remote / Hybrid OK',
                                    )}
                                </span>
                                <span className="flex items-center gap-1.5 rounded-lg border border-purple-500/25 bg-purple-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-purple-400">
                                    <MapPin className="h-3 w-3" />
                                    {t(
                                        'about.locationBadge',
                                        'Indonesia (UTC+7)',
                                    )}
                                </span>
                            </div>

                            {/* Big stat bento grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {/* Projects — spans 2 rows */}
                                <div className="group relative row-span-2 flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-500/25 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 p-4 transition-all duration-300 hover:border-purple-500/50">
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    <Briefcase className="mb-auto h-5 w-5 text-purple-400" />
                                    <div>
                                        <div className="gradient-text mb-1 text-3xl leading-none font-extrabold">
                                            <Counter
                                                end={projectsCount}
                                                suffix="+"
                                            />
                                        </div>
                                        <div className="text-[11px] font-semibold text-muted-foreground">
                                            {t(
                                                'about.statsProjects',
                                                'Shipped Projects',
                                            )}
                                        </div>
                                    </div>
                                    <div className="pointer-events-none absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-purple-500/20 blur-2xl" />
                                </div>

                                {/* Certs */}
                                <div className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 p-4 transition-all duration-300 hover:border-cyan-500/50">
                                    <div>
                                        <div className="mb-0.5 text-xl leading-none font-extrabold text-cyan-400">
                                            <Counter
                                                end={certsCount}
                                                suffix="+"
                                            />
                                        </div>
                                        <div className="text-[10px] font-semibold text-muted-foreground">
                                            {t(
                                                'about.statsCerts',
                                                'Verified Credentials',
                                            )}
                                        </div>
                                    </div>
                                    <Award className="h-5 w-5 text-cyan-400/70" />
                                    <div className="pointer-events-none absolute -right-4 -bottom-4 h-14 w-14 rounded-full bg-cyan-500/20 blur-xl" />
                                </div>

                                {/* Years */}
                                <div className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-orange-500/5 p-4 transition-all duration-300 hover:border-amber-500/50">
                                    <div>
                                        <div className="mb-0.5 text-xl leading-none font-extrabold text-amber-400">
                                            <Counter
                                                end={expCount}
                                                suffix="+"
                                            />
                                        </div>
                                        <div className="text-[10px] font-semibold text-muted-foreground">
                                            {t(
                                                'about.statsExp',
                                                'Production Experience',
                                            )}
                                        </div>
                                    </div>
                                    <Clock className="h-5 w-5 text-amber-400/70" />
                                    <div className="pointer-events-none absolute -right-4 -bottom-4 h-14 w-14 rounded-full bg-amber-500/20 blur-xl" />
                                </div>
                            </div>

                            {/* Domain Focus Distribution (Sums to 100% of engineering workload) */}
                            <div className="space-y-3 rounded-2xl border border-border/50 bg-card/40 p-4">
                                <div className="flex items-center justify-between text-[11px] font-semibold">
                                    <span className="flex items-center gap-1.5 text-muted-foreground">
                                        <Cpu className="h-3.5 w-3.5 text-cyan-400" />
                                        {t(
                                            'about.domainFocusTitle',
                                            'Engineering Discipline Distribution',
                                        )}
                                    </span>
                                    <span className="font-mono text-[10px] text-muted-foreground/80">
                                        100% Workload Scope
                                    </span>
                                </div>

                                {/* Segmented multi-color progress bar */}
                                <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary/60">
                                    {domainWorkloads.map((d) => (
                                        <div
                                            key={d.name}
                                            style={{
                                                width: `${d.value}%`,
                                                backgroundColor: d.color,
                                            }}
                                            className="h-full transition-all duration-500 hover:opacity-80"
                                            title={`${d.name}: ${d.value}%`}
                                        />
                                    ))}
                                </div>

                                {/* 4 compact domain chips */}
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {domainWorkloads.map((d) => (
                                        <div
                                            key={d.name}
                                            className="flex items-start gap-2 rounded-xl border border-border/30 bg-secondary/25 p-2 text-[11px]"
                                        >
                                            <span
                                                className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                                                style={{
                                                    backgroundColor: d.color,
                                                }}
                                            />
                                            <div className="min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="truncate font-semibold text-foreground">
                                                        {d.name}
                                                    </span>
                                                    <span className="font-mono text-[10px] font-bold text-muted-foreground">
                                                        {d.value}%
                                                    </span>
                                                </div>
                                                <span className="block truncate text-[10px] text-muted-foreground">
                                                    {d.desc}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Developer Runtime Telemetry Specs Card */}
                            <div className="space-y-2.5 rounded-2xl border border-border/50 bg-card/40 p-4 font-mono text-xs">
                                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                        <span className="text-[11px] font-bold tracking-wider text-foreground uppercase">
                                            {t(
                                                'about.runtimeTitle',
                                                'Developer Runtime Telemetry',
                                            )}
                                        </span>
                                    </div>
                                    <span className="font-mono text-[10px] text-muted-foreground">
                                        ID / JKT (UTC+7)
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                                    <div>
                                        <span className="block text-[10px] tracking-wider text-muted-foreground">
                                            {t(
                                                'about.coreRuntime',
                                                'CORE RUNTIME',
                                            )}
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            PHP 8.2+ · Node 20+
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] tracking-wider text-muted-foreground">
                                            {t(
                                                'about.architectureStyle',
                                                'ARCHITECTURE',
                                            )}
                                        </span>
                                        <span className="font-semibold text-foreground">
                                            Modular MVC · Typed SPA
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] tracking-wider text-muted-foreground">
                                            {t(
                                                'about.currentFocus',
                                                'CURRENT FOCUS',
                                            )}
                                        </span>
                                        <span className="font-semibold text-cyan-400">
                                            WebGL 3D & Clean APIs
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] tracking-wider text-muted-foreground">
                                            {t(
                                                'about.codeContract',
                                                'CODE CONTRACT',
                                            )}
                                        </span>
                                        <span className="font-semibold text-emerald-400">
                                            Strict Types & CI Verified
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ─── DELIVERIES TAB ─── */}
                    {tab === 'deliveries' && (
                        <motion.div
                            key="deliveries"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                    <BarChart3 className="h-3.5 w-3.5 text-purple-400" />
                                    {t(
                                        'about.deliveriesTitle',
                                        'Projects Delivered Per Year',
                                    )}
                                </p>
                                <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-0.5 font-mono text-[11px] text-purple-300">
                                    {t(
                                        'about.deliveriesTotal',
                                        'Total Shipped',
                                    )}
                                    : {projectsCount}+
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <BarChart
                                    data={projectsPerYear}
                                    barCategoryGap="35%"
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.05)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="year"
                                        tick={{ fontSize: 11, fill: '#71717a' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#71717a' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<ChartTip />} />
                                    <defs>
                                        <linearGradient
                                            id="barG"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#8B5CF6"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#22D3EE"
                                                stopOpacity={0.8}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <Bar
                                        dataKey="count"
                                        name="Shipped Projects"
                                        fill="url(#barG)"
                                        radius={[8, 8, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* ─── DOMAINS / FOCUS SPLIT TAB ─── */}
                    {tab === 'domains' && (
                        <motion.div
                            key="domains"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                    <PieIcon className="h-3.5 w-3.5 text-cyan-400" />
                                    {t(
                                        'about.focusSplitTitle',
                                        'Architecture & Discipline Workload',
                                    )}
                                </p>
                                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-[11px] text-cyan-300">
                                    Primary: Backend & APIs (40%)
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <RPieChart>
                                    <Pie
                                        data={domainWorkloads}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius="52%"
                                        outerRadius="76%"
                                        paddingAngle={4}
                                        stroke="none"
                                    >
                                        {domainWorkloads.map((s, i) => (
                                            <Cell key={i} fill={s.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<ChartTip />} />
                                    <Legend
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{
                                            fontSize: 11,
                                            color: '#a1a1aa',
                                        }}
                                    />
                                </RPieChart>
                            </ResponsiveContainer>
                        </motion.div>
                    )}

                    {/* ─── VELOCITY TAB ─── */}
                    {tab === 'velocity' && (
                        <motion.div
                            key="velocity"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                                    {t(
                                        'about.velocityTitle',
                                        'Production Velocity & Module Deliveries',
                                    )}
                                </p>
                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-300">
                                    {t(
                                        'about.velocityBadge',
                                        'Trajectory: Steady Scale ↗',
                                    )}
                                </span>
                            </div>
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={productionVelocity}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.05)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="period"
                                        tick={{ fontSize: 11, fill: '#71717a' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 11, fill: '#71717a' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip content={<ChartTip />} />
                                    <defs>
                                        <linearGradient
                                            id="vFeat"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#8B5CF6"
                                                stopOpacity={0.35}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#8B5CF6"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="vRepo"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#22D3EE"
                                                stopOpacity={0.35}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#22D3EE"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        type="monotone"
                                        dataKey="features"
                                        name="Delivered Modules"
                                        stroke="#8B5CF6"
                                        fill="url(#vFeat)"
                                        strokeWidth={2.5}
                                        dot={{
                                            r: 4,
                                            fill: '#8B5CF6',
                                            strokeWidth: 0,
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="repos"
                                        name="Maintained Repos"
                                        stroke="#22D3EE"
                                        fill="url(#vRepo)"
                                        strokeWidth={2.5}
                                        dot={{
                                            r: 4,
                                            fill: '#22D3EE',
                                            strokeWidth: 0,
                                        }}
                                    />
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
        '<p>I engineer web applications where backend stability and interface fluidity carry equal weight. Over 4+ years of development, my core stack has centered around Laravel, TypeScript, and React—building structured service layers, predictable client-side state, and clean relational database schemas.</p><p>Beyond standard business applications, I specialize in Three.js and WebGL rendering to create interactive 3D web environments that maintain steady 60 FPS performance without compromising Core Web Vitals. I treat clean architecture not as an abstract ideal, but as an operational guarantee that code remains readable, testable, and effortless to scale.</p>',
    );

    const galleryImages: string[] = aboutData?.gallery_images ?? [];
    const features: Feature[] = aboutData?.features ?? [];
    const expertiseTabs: ExpertiseTab[] = aboutData?.expertise_tabs ?? [];

    /* Fallback features with high-standard engineering credentials */
    const displayFeatures: Feature[] = features.length
        ? features
        : [
              {
                  name: 'Modular Service & Repository Architecture',
                  icon: 'Layers',
                  description:
                      'Decoupled business logic from controllers for high testability',
              },
              {
                  name: 'Strict Type Contracts (PHP 8.2 & TS)',
                  icon: 'Code2',
                  description:
                      'Eliminating runtime type exceptions across client and server',
              },
              {
                  name: 'GPU-Accelerated 3D & GLSL Shaders',
                  icon: 'Sparkles',
                  description:
                      'Silky 60 FPS visual experiences without degrading Core Web Vitals',
              },
              {
                  name: 'Sub-second Load & WCAG Accessible UI',
                  icon: 'Monitor',
                  description:
                      'Semantic markup, fast paint cycles, and keyboard-first accessibility',
              },
          ];

    /* Fallback expertise tabs */
    const displayTabs: ExpertiseTab[] = expertiseTabs.length
        ? expertiseTabs
        : [
              {
                  id: 'backend',
                  label: 'Backend & APIs',
                  icon: 'Server',
                  items: [
                      'Laravel 11',
                      'PHP 8.2+',
                      'MySQL',
                      'Redis',
                      'REST/JSON-API',
                      'Queue Workers',
                  ],
              },
              {
                  id: 'frontend',
                  label: 'Frontend Systems',
                  icon: 'Globe',
                  items: [
                      'React 18',
                      'TypeScript',
                      'Inertia.js',
                      'Vite',
                      'Tailwind CSS',
                      'State Management',
                  ],
              },
              {
                  id: 'creative',
                  label: '3D & Graphics',
                  icon: 'Sparkles',
                  items: [
                      'Three.js',
                      'WebGL',
                      'GLSL Shaders',
                      'Framer Motion',
                      'Canvas 2D',
                  ],
              },
              {
                  id: 'architecture',
                  label: 'Architecture',
                  icon: 'Layout',
                  items: [
                      'Service-Repository Pattern',
                      'SOLID Principles',
                      'Relational Schema Design',
                      'CI/CD Pipelines',
                  ],
              },
          ];

    return (
        <section
            id="about"
            className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-24 lg:py-28"
        >
            {/* Ambient Cosmic Background Glows */}
            <div className="pointer-events-none absolute top-1/2 left-1/4 -z-10 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/15" />
            <div className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/10" />
            <div className="pointer-events-none absolute top-1/4 right-10 -z-10 h-[450px] w-[450px] rounded-full bg-amber-300/15 blur-3xl dark:bg-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-12 sm:space-y-4 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3.5 py-1.5 text-xs font-bold text-cyan-700 dark:font-semibold dark:text-cyan-400"
                    >
                        <User className="h-3.5 w-3.5" />
                        <span>{t('about.title', 'Engineering Profile')}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl leading-[1.1] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
                    >
                        {t(
                            'about.subtitle',
                            'Full-stack engineering focused on resilient architectures, type safety, and real-time 3D',
                        )}
                    </motion.h2>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    {/* ── Top Row: Gallery + Tech Expertise (Left) & StatsPanel (Right) ── */}
                    <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12">
                        {/* ── LEFT: Photo Gallery Carousel + Tech Expertise ── */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.65 }}
                            className="flex flex-col space-y-5 lg:col-span-5"
                        >
                            {/* Photo Gallery */}
                            <GalleryCarousel images={galleryImages} />

                            {/* Tech Expertise — positioned below photo */}
                            <div className="space-y-3 rounded-2xl border border-border/60 bg-card/90 p-5 shadow-xl backdrop-blur-sm">
                                <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                                    <Cpu className="h-4 w-4 text-purple-400" />
                                    {t(
                                        'about.techExpertise',
                                        'Core Technical Expertise',
                                    )}
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
                        <div className="space-y-6 rounded-3xl border border-border/60 bg-card/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
                            <div
                                className="prose prose-sm max-w-none leading-relaxed font-normal text-muted-foreground sm:prose-base dark:prose-invert [&>p]:mb-3 [&>p:last-child]:mb-0"
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}
                            />

                            {/* Dynamic feature checklist / Core Engineering Standards */}
                            <div className="space-y-3 border-t border-border/50 pt-6">
                                <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
                                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                                    {t(
                                        'about.featuresTitle',
                                        'Core Engineering Standards',
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                    {displayFeatures.map((feat) => (
                                        <div
                                            key={feat.name}
                                            className="group flex flex-col justify-between rounded-xl border border-border/40 bg-secondary/30 p-3.5 transition-all hover:border-emerald-500/30 hover:bg-secondary/60"
                                        >
                                            <div className="mb-2 flex items-center gap-2.5">
                                                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 transition-colors group-hover:bg-emerald-500/20">
                                                    <DynIcon
                                                        name={feat.icon}
                                                        className="h-3.5 w-3.5 text-emerald-400"
                                                    />
                                                </div>
                                                <span className="text-xs leading-snug font-semibold text-foreground/90 transition-colors group-hover:text-foreground">
                                                    {feat.name}
                                                </span>
                                            </div>
                                            {feat.description && (
                                                <p className="pl-9 text-[11px] leading-relaxed text-muted-foreground">
                                                    {feat.description}
                                                </p>
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
