import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    BarChart3,
    LayoutGrid,
    TrendingUp,
    Award,
    Layers,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    Search,
    X,
    RefreshCw,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getTranslated } from '@/lib/i18n-helper';

interface TechnologyItem {
    id: number;
    name: string;
    logo: string | null;
    proficiency?: number;
    technology_category_id: number;
}

interface CategoryItem {
    id: number;
    name: any;
    technologies?: TechnologyItem[];
}

interface TechStackSectionProps {
    categories: CategoryItem[];
}

const PAGE_SIZE_OPTIONS = [6, 10, 15, 20, 50];

/* Helper to determine badge color and gradient based on proficiency score */
function getProficiencyTheme(score: number = 85) {
    if (score >= 92) {
        return {
            tier: 'Expert / Master',
            badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-bold dark:font-semibold',
            gradient: 'from-purple-600 via-cyan-500 to-emerald-400',
            glow: 'shadow-[0_0_12px_rgba(52,211,153,0.35)]',
            dot: 'bg-emerald-500 dark:bg-emerald-400',
        };
    }

    if (score >= 85) {
        return {
            tier: 'Advanced Specialist',
            badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30 font-bold dark:font-semibold',
            gradient: 'from-purple-600 via-indigo-500 to-cyan-400',
            glow: 'shadow-[0_0_12px_rgba(34,211,238,0.35)]',
            dot: 'bg-cyan-500 dark:bg-cyan-400',
        };
    }

    if (score >= 75) {
        return {
            tier: 'Proficient / Working',
            badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 font-bold dark:font-semibold',
            gradient: 'from-pink-600 via-purple-600 to-indigo-500',
            glow: 'shadow-[0_0_12px_rgba(168,85,247,0.35)]',
            dot: 'bg-purple-500 dark:bg-purple-400',
        };
    }

    return {
        tier: 'Intermediate',
        badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 font-bold dark:font-semibold',
        gradient: 'from-amber-600 via-orange-500 to-yellow-400',
        glow: 'shadow-[0_0_12px_rgba(251,191,36,0.35)]',
        dot: 'bg-amber-500 dark:bg-amber-400',
    };
}

/* Helper for Smart Pagination Range with ellipsis */
function getPaginationRange(
    current: number,
    total: number,
): (number | string)[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const delta = 1;
    const range: (number | string)[] = [];

    for (
        let i = Math.max(2, current - delta);
        i <= Math.min(total - 1, current + delta);
        i++
    ) {
        range.push(i);
    }

    if (current - delta > 2) {
        range.unshift('...');
    }

    if (current + delta < total - 1) {
        range.push('...');
    }

    range.unshift(1);

    if (total > 1) {
        range.push(total);
    }

    return range;
}

export default function TechStackSection({
    categories = [],
}: TechStackSectionProps) {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>(
        'all',
    );
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'barchart' | 'grid'>('barchart');
    const [pageSize, setPageSize] = useState<number>(6);
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Collect all technologies with their localized category name
    const allTechnologies: Array<TechnologyItem & { categoryName?: string }> =
        useMemo(() => {
            const list: Array<TechnologyItem & { categoryName?: string }> = [];
            categories.forEach((cat) => {
                const catName = getTranslated(cat.name, 'Category');

                if (cat.technologies) {
                    cat.technologies.forEach((tech) => {
                        list.push({
                            ...tech,
                            categoryName: catName,
                        });
                    });
                }
            });

            return list;
        }, [categories]);

    // Filter displayed technologies by category and search query
    const filteredTechs = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        return allTechnologies
            .filter((tech) => {
                const matchCategory =
                    selectedCategory === 'all' ||
                    tech.technology_category_id === selectedCategory;

                if (!matchCategory) {
                    return false;
                }

                if (!q) {
                    return true;
                }

                const nameMatch = tech.name.toLowerCase().includes(q);
                const catMatch = (tech.categoryName ?? '')
                    .toLowerCase()
                    .includes(q);

                return nameMatch || catMatch;
            })
            .sort((a, b) => (b.proficiency ?? 85) - (a.proficiency ?? 85));
    }, [allTechnologies, selectedCategory, searchQuery]);

    // Handlers
    const handleCategoryChange = (catId: number | 'all') => {
        setSelectedCategory(catId);
        setCurrentPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    const handleResetAll = () => {
        setSelectedCategory('all');
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Calculate pagination slices
    const totalPages = Math.max(1, Math.ceil(filteredTechs.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedTechs = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;

        return filteredTechs.slice(start, start + pageSize);
    }, [filteredTechs, safeCurrentPage, pageSize]);

    // Calculate quick stats
    const stats = useMemo(() => {
        const total = filteredTechs.length;

        if (total === 0) {
            return { total: 0, average: 0, topSkill: '-' };
        }

        const avg = Math.round(
            filteredTechs.reduce(
                (acc, curr) => acc + (curr.proficiency ?? 85),
                0,
            ) / total,
        );
        const top = filteredTechs[0]?.name ?? '-';

        return { total, average: avg, topSkill: top };
    }, [filteredTechs]);

    const startIndex =
        filteredTechs.length > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0;
    const endIndex = Math.min(safeCurrentPage * pageSize, filteredTechs.length);

    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section
            id="skills"
            className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-24 lg:py-28"
        >
            {/* Ambient Cosmic Background Glows */}
            <div className="pointer-events-none absolute top-1/3 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/15" />
            <div className="pointer-events-none absolute bottom-10 left-1/4 -z-10 h-[550px] w-[550px] rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/10" />
            <div className="pointer-events-none absolute top-10 left-10 -z-10 h-[450px] w-[450px] rounded-full bg-rose-200/15 blur-3xl dark:bg-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/15 px-3.5 py-1.5 text-xs font-bold text-cyan-700 shadow-sm dark:font-semibold dark:text-cyan-400"
                    >
                        <Cpu className="h-3.5 w-3.5" />
                        <span>{t('techStack.title')}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        {t('techStack.subtitle')}
                    </motion.h2>
                    <p className="mx-auto max-w-xl text-sm text-muted-foreground">
                        Visualisasi tingkat kemahiran, keahlian arsitektur, dan
                        ekosistem teknologi yang digunakan dalam pengembangan
                        produk berskala enterprise.
                    </p>
                </div>

                {/* ── Top Control & Search Bar ── */}
                <div className="mb-8 space-y-4 rounded-3xl border border-border/80 bg-card/90 p-4 shadow-xl shadow-purple-950/10 backdrop-blur-sm sm:p-5">
                    {/* Row 1: Search Input & View Mode Switcher */}
                    <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                        {/* Futuristic Search Form (Expanded Full Width) */}
                        <div className="relative w-full flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-purple-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Cari teknologi, framework, tools..."
                                className="w-full rounded-2xl border border-border bg-background/90 py-3 pr-10 pl-11 text-xs text-foreground shadow-inner transition-all placeholder:text-muted-foreground focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/40 focus:outline-none sm:text-sm"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                    title="Hapus pencarian"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* View Switcher: Bar Chart vs Grid */}
                        <div className="flex flex-shrink-0 items-center gap-1 self-end rounded-xl border border-border bg-secondary/80 p-1 sm:self-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    setViewMode('barchart');
                                    setCurrentPage(1);
                                }}
                                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    viewMode === 'barchart'
                                        ? 'border border-border/80 bg-background text-foreground text-purple-400 shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <BarChart3 className="h-3.5 w-3.5" />
                                <span>Statistik Bar Chart</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setViewMode('grid');
                                    setCurrentPage(1);
                                }}
                                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                                    viewMode === 'grid'
                                        ? 'border border-border/80 bg-background text-cyan-400 text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <LayoutGrid className="h-3.5 w-3.5" />
                                <span>Grid Cards</span>
                            </button>
                        </div>
                    </div>

                    {/* Row 2: Category Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-2">
                        <button
                            type="button"
                            onClick={() => handleCategoryChange('all')}
                            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                selectedCategory === 'all'
                                    ? 'scale-[1.02] bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/25'
                                    : 'border border-border bg-background/80 text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                        >
                            {t('techStack.all')} ({allTechnologies.length})
                        </button>

                        {categories.map((category) => {
                            const name = getTranslated(
                                category.name,
                                'Category',
                            );
                            const isSelected = selectedCategory === category.id;
                            const count = category.technologies?.length ?? 0;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() =>
                                        handleCategoryChange(category.id)
                                    }
                                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                        isSelected
                                            ? 'scale-[1.02] bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/25'
                                            : 'border border-border bg-background/80 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                                >
                                    <span>{name}</span>
                                    <span
                                        className={`py-0.2 rounded-full px-1.5 text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'}`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}

                        {/* Reset Filter Button if active */}
                        {(searchQuery || selectedCategory !== 'all') && (
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="ml-auto flex items-center gap-1 px-2 py-1 text-xs font-semibold text-purple-400 transition-colors hover:text-cyan-400"
                            >
                                <RefreshCw className="h-3 w-3" /> Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Summary Stats Overview Pills ── */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                                <Layers className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-[11px] font-medium text-muted-foreground">
                                    Filtered Stack
                                </span>
                                <span className="font-mono text-base font-bold text-foreground">
                                    {stats.total} Technologies
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-[11px] font-medium text-muted-foreground">
                                    Average Mastery
                                </span>
                                <span className="font-mono text-base font-bold text-foreground">
                                    {stats.average}% Ability
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                <Award className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-[11px] font-medium text-muted-foreground">
                                    Top Proficiency
                                </span>
                                <span className="max-w-[150px] truncate font-mono text-base font-bold text-foreground">
                                    {stats.topSkill}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Content View Switch: Bar Chart vs Grid or Empty State ── */}
                <AnimatePresence mode="wait">
                    {filteredTechs.length === 0 ? (
                        /* Empty State */
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-border/80 bg-card/90 px-4 py-16 text-center backdrop-blur-sm"
                        >
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-secondary text-purple-400 shadow-inner">
                                <Search className="h-7 w-7 opacity-70" />
                            </div>
                            <h3 className="text-base font-bold text-foreground">
                                Tidak ada teknologi yang cocok
                            </h3>
                            <p className="max-w-sm text-xs text-muted-foreground">
                                Tidak ditemukan teknologi dengan kata kunci "
                                {searchQuery}". Coba kata kunci lain atau reset
                                filter.
                            </p>
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="mt-2 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-secondary/80"
                            >
                                Reset Pencarian & Filter
                            </button>
                        </motion.div>
                    ) : viewMode === 'barchart' ? (
                        /* ════════ MODE 1: STATISTIK BAR CHART VIEW ════════ */
                        <motion.div
                            key={`barchart-page-${safeCurrentPage}-${pageSize}-${selectedCategory}-${searchQuery}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6 rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl shadow-purple-950/10 backdrop-blur-sm sm:p-8"
                        >
                            {/* Bar Chart Header Scale */}
                            <div className="hidden items-center justify-between border-b border-border/60 pb-3 font-mono text-[11px] text-muted-foreground sm:flex">
                                <span className="w-48 font-bold tracking-wider text-foreground uppercase">
                                    Technology / Skill
                                </span>
                                <div className="flex flex-1 justify-between px-4">
                                    <span>0%</span>
                                    <span>25% Basic</span>
                                    <span>50% Intermediate</span>
                                    <span>75% Advanced</span>
                                    <span>100% Expert</span>
                                </div>
                                <span className="w-28 text-right font-bold tracking-wider text-foreground uppercase">
                                    Mastery
                                </span>
                            </div>

                            {/* Bar Chart Items List */}
                            <div className="space-y-4">
                                {paginatedTechs.map((tech, idx) => {
                                    const score = Math.min(
                                        100,
                                        Math.max(0, tech.proficiency ?? 85),
                                    );
                                    const theme = getProficiencyTheme(score);

                                    return (
                                        <motion.div
                                            key={tech.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                            className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-secondary/30 p-3.5 transition-all hover:border-purple-500/30 hover:bg-secondary/60 sm:flex-row sm:items-center"
                                        >
                                            {/* Tech Info (Left) */}
                                            <div className="flex w-full flex-shrink-0 items-center gap-3 sm:w-48">
                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-border/80 bg-background text-xs shadow-inner transition-all group-hover:scale-110 group-hover:border-purple-500/40">
                                                    {tech.logo ? (
                                                        <img
                                                            src={`/storage/${tech.logo}`}
                                                            alt={tech.name}
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="h-5 w-5 object-contain"
                                                        />
                                                    ) : (
                                                        <span className="font-mono text-[11px] font-bold text-purple-400">
                                                            {tech.name
                                                                .slice(0, 2)
                                                                .toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="truncate">
                                                    <span className="block truncate text-xs font-bold text-foreground transition-colors group-hover:text-purple-300">
                                                        {tech.name}
                                                    </span>
                                                    {tech.categoryName && (
                                                        <span className="block truncate font-mono text-[10px] text-muted-foreground">
                                                            {tech.categoryName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bar Progress Track (Center) */}
                                            <div className="flex-1 space-y-1">
                                                <div className="relative h-3.5 w-full overflow-hidden rounded-full border border-border/80 bg-background/80 p-[2px]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{
                                                            width: `${score}%`,
                                                        }}
                                                        viewport={{
                                                            once: true,
                                                        }}
                                                        transition={{
                                                            duration: 0.8,
                                                            ease: 'easeOut',
                                                            delay:
                                                                idx * 0.04 +
                                                                0.1,
                                                        }}
                                                        className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} ${theme.glow} relative`}
                                                    >
                                                        {/* High-tech sheen highlight */}
                                                        <div className="absolute inset-0 rounded-full bg-white/20 opacity-30" />
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Tier Badge & Percentage Pill (Right) */}
                                            <div className="flex w-full flex-shrink-0 items-center justify-between gap-2 sm:w-32 sm:justify-end">
                                                <span
                                                    className={`rounded-md border px-2 py-0.5 text-[10px] font-semibold ${theme.badge} hidden sm:inline`}
                                                >
                                                    {theme.tier.split('/')[0]}
                                                </span>
                                                <div className="flex items-baseline gap-0.5 rounded-lg border border-border bg-background px-2.5 py-1 font-mono text-xs font-bold text-foreground shadow-sm">
                                                    <span className="text-cyan-400">
                                                        {score}
                                                    </span>
                                                    <span className="text-[10px] text-muted-foreground">
                                                        %
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        /* ════════ MODE 2: MODERN GRID CARDS VIEW ════════ */
                        <motion.div
                            key={`grid-page-${safeCurrentPage}-${pageSize}-${selectedCategory}-${searchQuery}`}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
                        >
                            {paginatedTechs.map((tech, idx) => {
                                const score = Math.min(
                                    100,
                                    Math.max(0, tech.proficiency ?? 85),
                                );
                                const theme = getProficiencyTheme(score);

                                return (
                                    <motion.div
                                        key={tech.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-4 shadow-md backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-950/20"
                                    >
                                        <div className="flex flex-col items-center justify-center space-y-2 text-center">
                                            {/* Tech Icon */}
                                            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 bg-secondary/80 shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:border-purple-500/40">
                                                {tech.logo ? (
                                                    <img
                                                        src={`/storage/${tech.logo}`}
                                                        alt={tech.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-7 w-7 object-contain drop-shadow"
                                                    />
                                                ) : (
                                                    <span className="font-mono text-sm font-bold text-purple-400">
                                                        {tech.name
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </span>
                                                )}
                                                <span
                                                    className={`absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-card ${theme.dot}`}
                                                />
                                            </div>

                                            {/* Name & Category */}
                                            <div>
                                                <span className="block truncate text-xs font-bold text-foreground transition-colors group-hover:text-purple-300">
                                                    {tech.name}
                                                </span>
                                                {tech.categoryName && (
                                                    <span className="line-clamp-1 font-mono text-[10px] text-muted-foreground">
                                                        {tech.categoryName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mini Ability Progress Bar at Bottom of Card */}
                                        <div className="mt-3 space-y-1 border-t border-border/50 pt-2.5">
                                            <div className="flex items-center justify-between font-mono text-[10px]">
                                                <span className="text-muted-foreground">
                                                    Ability
                                                </span>
                                                <span className="font-bold text-cyan-400">
                                                    {score}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-background/80 p-[1px]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{
                                                        width: `${score}%`,
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{
                                                        duration: 0.6,
                                                        ease: 'easeOut',
                                                    }}
                                                    className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ════════ FUTURISTIC PAGINATION CONTROLS BAR ════════ */}
                {filteredTechs.length > 0 && (
                    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg shadow-purple-950/10 backdrop-blur-sm sm:flex-row">
                        {/* Items Per Page Selector */}
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-medium">
                                <SlidersHorizontal className="h-3.5 w-3.5 text-purple-400" />
                                Tampilkan:
                            </span>
                            <div className="relative">
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="cursor-pointer rounded-xl border border-border bg-background/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-inner focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
                                >
                                    {PAGE_SIZE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt} data
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <span className="hidden font-mono text-[11px] md:inline">
                                (Menampilkan {startIndex} - {endIndex} dari{' '}
                                {filteredTechs.length} total)
                            </span>
                        </div>

                        {/* Numbered Pagination Buttons */}
                        {totalPages > 1 && (
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                                {/* Prev Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.max(1, p - 1),
                                        )
                                    }
                                    disabled={safeCurrentPage === 1}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm transition-all hover:border-purple-500/40 hover:bg-secondary hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Previous Page"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>

                                {/* Page Numbers */}
                                {getPaginationRange(
                                    safeCurrentPage,
                                    totalPages,
                                ).map((item, i) => {
                                    if (item === '...') {
                                        return (
                                            <span
                                                key={`dots-${i}`}
                                                className="flex h-8 w-8 items-center justify-center text-xs font-bold text-muted-foreground select-none"
                                            >
                                                ...
                                            </span>
                                        );
                                    }

                                    const num = item as number;
                                    const isActive = num === safeCurrentPage;

                                    return (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setCurrentPage(num)}
                                            className={`h-8 w-8 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-md ring-1 shadow-purple-600/30 ring-cyan-400/40'
                                                    : 'border border-border bg-background text-muted-foreground hover:border-purple-500/40 hover:bg-secondary hover:text-foreground'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    );
                                })}

                                {/* Next Button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentPage((p) =>
                                            Math.min(totalPages, p + 1),
                                        )
                                    }
                                    disabled={safeCurrentPage === totalPages}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm transition-all hover:border-purple-500/40 hover:bg-secondary hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Next Page"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        )}

                        {/* Page Position Indicator */}
                        <div className="font-mono text-xs text-muted-foreground">
                            Halaman{' '}
                            <span className="font-bold text-foreground">
                                {safeCurrentPage}
                            </span>{' '}
                            dari{' '}
                            <span className="font-bold text-foreground">
                                {totalPages}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
