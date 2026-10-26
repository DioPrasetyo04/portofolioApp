import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cpu,
    BarChart3,
    LayoutGrid,
    Sparkles,
    Zap,
    TrendingUp,
    CheckCircle2,
    Award,
    Layers,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    Search,
    X,
    RefreshCw,
} from 'lucide-react';
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
function getPaginationRange(current: number, total: number): (number | string)[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    const delta = 1;
    const range: (number | string)[] = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
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

export default function TechStackSection({ categories = [] }: TechStackSectionProps) {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [viewMode, setViewMode] = useState<'barchart' | 'grid'>('barchart');
    const [pageSize, setPageSize] = useState<number>(6);
    const [currentPage, setCurrentPage] = useState<number>(1);

    if (!categories || categories.length === 0) return null;

    // Collect all technologies with their localized category name
    const allTechnologies: Array<TechnologyItem & { categoryName?: string }> = useMemo(() => {
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
                    selectedCategory === 'all' || tech.technology_category_id === selectedCategory;
                if (!matchCategory) return false;

                if (!q) return true;

                const nameMatch = tech.name.toLowerCase().includes(q);
                const catMatch = (tech.categoryName ?? '').toLowerCase().includes(q);
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
        if (total === 0) return { total: 0, average: 0, topSkill: '-' };
        const avg = Math.round(
            filteredTechs.reduce((acc, curr) => acc + (curr.proficiency ?? 85), 0) / total
        );
        const top = filteredTechs[0]?.name ?? '-';
        return { total, average: avg, topSkill: top };
    }, [filteredTechs]);

    const startIndex = filteredTechs.length > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0;
    const endIndex = Math.min(safeCurrentPage * pageSize, filteredTechs.length);

    return (
        <section id="skills" className="py-12 sm:py-16 md:py-24 lg:py-28 relative overflow-hidden bg-transparent">
            {/* Ambient Cosmic Background Glows */}
            <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-10 left-1/4 w-[550px] h-[550px] bg-cyan-300/15 dark:bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-rose-200/15 dark:bg-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 space-y-3">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 text-xs font-bold dark:font-semibold shadow-sm"
                    >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{t('techStack.title')}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
                    >
                        {t('techStack.subtitle')}
                    </motion.h2>
                    <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                        Visualisasi tingkat kemahiran, keahlian arsitektur, dan ekosistem teknologi yang digunakan dalam pengembangan produk berskala enterprise.
                    </p>
                </div>

                {/* ── Top Control & Search Bar ── */}
                <div className="p-4 sm:p-5 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-xl shadow-purple-950/10 mb-8 space-y-4">
                    
                    {/* Row 1: Search Input & View Mode Switcher */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        
                        {/* Futuristic Search Form (Expanded Full Width) */}
                        <div className="relative flex-1 w-full">
                            <Search className="w-4 h-4 text-purple-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Cari teknologi, framework, tools..."
                                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-border bg-background/90 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all shadow-inner"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary transition-colors"
                                    title="Hapus pencarian"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* View Switcher: Bar Chart vs Grid */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/80 border border-border flex-shrink-0 self-end sm:self-auto">
                            <button
                                type="button"
                                onClick={() => {
                                    setViewMode('barchart');
                                    setCurrentPage(1);
                                }}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    viewMode === 'barchart'
                                        ? 'bg-background text-foreground shadow-sm border border-border/80 text-purple-400'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span>Statistik Bar Chart</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setViewMode('grid');
                                    setCurrentPage(1);
                                }}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-background text-foreground shadow-sm border border-border/80 text-cyan-400'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>Grid Cards</span>
                            </button>
                        </div>
                    </div>

                    {/* Row 2: Category Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/50">
                        <button
                            type="button"
                            onClick={() => handleCategoryChange('all')}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                selectedCategory === 'all'
                                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/25 scale-[1.02]'
                                    : 'bg-background/80 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`}
                        >
                            {t('techStack.all')} ({allTechnologies.length})
                        </button>

                        {categories.map((category) => {
                            const name = getTranslated(category.name, 'Category');
                            const isSelected = selectedCategory === category.id;
                            const count = category.technologies?.length ?? 0;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => handleCategoryChange(category.id)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                                        isSelected
                                            ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-500/25 scale-[1.02]'
                                            : 'bg-background/80 border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    <span>{name}</span>
                                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'}`}>
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
                                className="ml-auto text-xs font-semibold text-purple-400 hover:text-cyan-400 flex items-center gap-1 transition-colors px-2 py-1"
                            >
                                <RefreshCw className="w-3 h-3" /> Reset Filter
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Summary Stats Overview Pills ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <Layers className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-medium text-muted-foreground block">Filtered Stack</span>
                                <span className="font-mono font-bold text-base text-foreground">{stats.total} Technologies</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-medium text-muted-foreground block">Average Mastery</span>
                                <span className="font-mono font-bold text-base text-foreground">{stats.average}% Ability</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <span className="text-[11px] font-medium text-muted-foreground block">Top Proficiency</span>
                                <span className="font-mono font-bold text-base text-foreground truncate max-w-[150px]">{stats.topSkill}</span>
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
                            className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-sm text-center gap-3"
                        >
                            <div className="w-14 h-14 rounded-2xl border border-border bg-secondary flex items-center justify-center text-purple-400 shadow-inner">
                                <Search className="w-7 h-7 opacity-70" />
                            </div>
                            <h3 className="text-base font-bold text-foreground">Tidak ada teknologi yang cocok</h3>
                            <p className="text-xs text-muted-foreground max-w-sm">
                                Tidak ditemukan teknologi dengan kata kunci "{searchQuery}". Coba kata kunci lain atau reset filter.
                            </p>
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="mt-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground transition-all"
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
                            className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-xl shadow-purple-950/10 space-y-6"
                        >
                            {/* Bar Chart Header Scale */}
                            <div className="hidden sm:flex items-center justify-between text-[11px] font-mono text-muted-foreground pb-3 border-b border-border/60">
                                <span className="w-48 font-bold uppercase tracking-wider text-foreground">Technology / Skill</span>
                                <div className="flex-1 flex justify-between px-4">
                                    <span>0%</span>
                                    <span>25% Basic</span>
                                    <span>50% Intermediate</span>
                                    <span>75% Advanced</span>
                                    <span>100% Expert</span>
                                </div>
                                <span className="w-28 text-right font-bold uppercase tracking-wider text-foreground">Mastery</span>
                            </div>

                            {/* Bar Chart Items List */}
                            <div className="space-y-4">
                                {paginatedTechs.map((tech, idx) => {
                                    const score = Math.min(100, Math.max(0, tech.proficiency ?? 85));
                                    const theme = getProficiencyTheme(score);

                                    return (
                                        <motion.div
                                            key={tech.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.04 }}
                                            className="group flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-2xl bg-secondary/30 hover:bg-secondary/60 border border-border/60 hover:border-purple-500/30 transition-all"
                                        >
                                            {/* Tech Info (Left) */}
                                            <div className="w-full sm:w-48 flex items-center gap-3 flex-shrink-0">
                                                <div className="w-9 h-9 rounded-xl bg-background border border-border/80 flex items-center justify-center text-xs flex-shrink-0 shadow-inner group-hover:scale-110 group-hover:border-purple-500/40 transition-all">
                                                    {tech.logo ? (
                                                        <img
                                                            src={`/storage/${tech.logo}`}
                                                            alt={tech.name}
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="w-5 h-5 object-contain"
                                                        />
                                                    ) : (
                                                        <span className="font-bold font-mono text-[11px] text-purple-400">
                                                            {tech.name.slice(0, 2).toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="truncate">
                                                    <span className="font-bold text-xs text-foreground group-hover:text-purple-300 transition-colors block truncate">
                                                        {tech.name}
                                                    </span>
                                                    {tech.categoryName && (
                                                        <span className="text-[10px] text-muted-foreground font-mono truncate block">
                                                            {tech.categoryName}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bar Progress Track (Center) */}
                                            <div className="flex-1 space-y-1">
                                                <div className="relative h-3.5 w-full rounded-full bg-background/80 border border-border/80 overflow-hidden p-[2px]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${score}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.04 + 0.1 }}
                                                        className={`h-full rounded-full bg-gradient-to-r ${theme.gradient} ${theme.glow} relative`}
                                                    >
                                                        {/* High-tech sheen highlight */}
                                                        <div className="absolute inset-0 bg-white/20 opacity-30 rounded-full" />
                                                    </motion.div>
                                                </div>
                                            </div>

                                            {/* Tier Badge & Percentage Pill (Right) */}
                                            <div className="w-full sm:w-32 flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${theme.badge} hidden sm:inline`}>
                                                    {theme.tier.split('/')[0]}
                                                </span>
                                                <div className="flex items-baseline gap-0.5 px-2.5 py-1 rounded-lg bg-background border border-border font-mono font-bold text-xs text-foreground shadow-sm">
                                                    <span className="text-cyan-400">{score}</span>
                                                    <span className="text-[10px] text-muted-foreground">%</span>
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
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                        >
                            {paginatedTechs.map((tech, idx) => {
                                const score = Math.min(100, Math.max(0, tech.proficiency ?? 85));
                                const theme = getProficiencyTheme(score);

                                return (
                                    <motion.div
                                        key={tech.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="group relative p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-md hover:shadow-xl hover:shadow-purple-950/20 hover:border-purple-500/40 flex flex-col justify-between transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                                            {/* Tech Icon */}
                                            <div className="relative w-12 h-12 rounded-xl bg-secondary/80 border border-border/80 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-300 shadow-inner">
                                                {tech.logo ? (
                                                    <img
                                                        src={`/storage/${tech.logo}`}
                                                        alt={tech.name}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="w-7 h-7 object-contain drop-shadow"
                                                    />
                                                ) : (
                                                    <span className="font-bold text-sm text-purple-400 font-mono">
                                                        {tech.name.slice(0, 2).toUpperCase()}
                                                    </span>
                                                )}
                                                <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-card ${theme.dot}`} />
                                            </div>

                                            {/* Name & Category */}
                                            <div>
                                                <span className="font-bold text-xs text-foreground group-hover:text-purple-300 transition-colors block truncate">
                                                    {tech.name}
                                                </span>
                                                {tech.categoryName && (
                                                    <span className="text-[10px] text-muted-foreground font-mono line-clamp-1">
                                                        {tech.categoryName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Mini Ability Progress Bar at Bottom of Card */}
                                        <div className="mt-3 pt-2.5 border-t border-border/50 space-y-1">
                                            <div className="flex items-center justify-between text-[10px] font-mono">
                                                <span className="text-muted-foreground">Ability</span>
                                                <span className="font-bold text-cyan-400">{score}%</span>
                                            </div>
                                            <div className="h-1.5 w-full rounded-full bg-background/80 overflow-hidden p-[1px]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${score}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.6, ease: 'easeOut' }}
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
                    <div className="mt-8 p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-purple-950/10">
                        
                        {/* Items Per Page Selector */}
                        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-medium">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                                Tampilkan:
                            </span>
                            <div className="relative">
                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-1.5 rounded-xl border border-border bg-background/90 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer shadow-inner"
                                >
                                    {PAGE_SIZE_OPTIONS.map((opt) => (
                                        <option key={opt} value={opt}>
                                            {opt} data
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <span className="hidden md:inline font-mono text-[11px]">
                                (Menampilkan {startIndex} - {endIndex} dari {filteredTechs.length} total)
                            </span>
                        </div>

                        {/* Numbered Pagination Buttons */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                {/* Prev Button */}
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                    disabled={safeCurrentPage === 1}
                                    className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-500/40 active:scale-95 transition-all shadow-sm"
                                    aria-label="Previous Page"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                {/* Page Numbers */}
                                {getPaginationRange(safeCurrentPage, totalPages).map((item, i) => {
                                    if (item === '...') {
                                        return (
                                            <span
                                                key={`dots-${i}`}
                                                className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground font-bold select-none"
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
                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                                                isActive
                                                    ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-purple-600/30 ring-1 ring-cyan-400/40'
                                                    : 'border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-purple-500/40'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    );
                                })}

                                {/* Next Button */}
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={safeCurrentPage === totalPages}
                                    className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-500/40 active:scale-95 transition-all shadow-sm"
                                    aria-label="Next Page"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Page Position Indicator */}
                        <div className="text-xs text-muted-foreground font-mono">
                            Halaman <span className="text-foreground font-bold">{safeCurrentPage}</span> dari <span className="text-foreground font-bold">{totalPages}</span>
                        </div>
                    </div>
                )}

            </div>
        </section>
    );
}
