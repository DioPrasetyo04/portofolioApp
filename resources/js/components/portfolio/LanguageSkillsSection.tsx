import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe,
    Languages,
    Zap,
    CheckCircle2,
    TrendingUp,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
    ArrowUpRight,
    Film,
    Layers,
    BookOpen,
    Award,
    Filter,
    RotateCcw,
} from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getTranslated } from '@/lib/i18n-helper';

interface MediaItem {
    type: 'image' | 'video';
    file?: string | null;
    url?: string | null;
    caption?: string | null;
}

interface LanguageSkillItem {
    id: number;
    name: string;
    description: any;
    detail?: any;
    percentage?: number;
    logo: string | null;
    photo: string | null;
    gallery?: string[] | null;
    video?: string | null;
    media?: MediaItem[] | null;
}

interface LanguageSkillsSectionProps {
    skills: LanguageSkillItem[];
}

type AbilityFilterType =
    'all' | 'native' | 'fluent' | 'working' | 'conversational';

interface AbilityFilterOption {
    id: AbilityFilterType;
    label: string;
    shortLabel: string;
    range: string;
    min: number;
    max: number;
    badgeColor: string;
    dotColor: string;
}

const ABILITY_FILTER_OPTIONS: AbilityFilterOption[] = [
    {
        id: 'all',
        label: 'Semua Tingkat Kemampuan',
        shortLabel: 'Semua',
        range: '0% - 100%',
        min: 0,
        max: 100,
        badgeColor: 'text-foreground',
        dotColor: 'bg-purple-500',
    },
    {
        id: 'native',
        label: 'Native / Bilingual Mastery (95% - 100%)',
        shortLabel: 'Native (95-100%)',
        range: '95% - 100%',
        min: 95,
        max: 100,
        badgeColor: 'text-emerald-700 dark:text-emerald-400 font-semibold',
        dotColor: 'bg-emerald-500 dark:bg-emerald-400',
    },
    {
        id: 'fluent',
        label: 'Full Professional Proficiency (85% - 94%)',
        shortLabel: 'Professional (85-94%)',
        range: '85% - 94%',
        min: 85,
        max: 94,
        badgeColor: 'text-cyan-700 dark:text-cyan-400 font-semibold',
        dotColor: 'bg-cyan-500 dark:bg-cyan-400',
    },
    {
        id: 'working',
        label: 'Professional Working Ability (70% - 84%)',
        shortLabel: 'Working (70-84%)',
        range: '70% - 84%',
        min: 70,
        max: 84,
        badgeColor: 'text-purple-700 dark:text-purple-400 font-semibold',
        dotColor: 'bg-purple-500 dark:bg-purple-400',
    },
    {
        id: 'conversational',
        label: 'Conversational / Technical (< 70%)',
        shortLabel: 'Conversational (<70%)',
        range: '< 70%',
        min: 0,
        max: 69,
        badgeColor: 'text-amber-700 dark:text-amber-400 font-semibold',
        dotColor: 'bg-amber-500 dark:bg-amber-400',
    },
];

const PAGE_SIZE_OPTIONS = [3, 6, 9, 12, 50];

/* Helper to determine proficiency badge color and label */
function getProficiencyLevel(percentage: number = 80) {
    if (percentage >= 95) {
        return {
            label: 'Native / Bilingual Mastery',
            badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-bold dark:font-semibold',
            barColor: 'from-purple-600 via-cyan-500 to-emerald-400',
            glow: 'shadow-[0_0_15px_rgba(52,211,153,0.4)]',
            dot: 'bg-emerald-500 dark:bg-emerald-400',
        };
    }

    if (percentage >= 85) {
        return {
            label: 'Full Professional Proficiency',
            badge: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30 font-bold dark:font-semibold',
            barColor: 'from-purple-600 via-indigo-500 to-cyan-400',
            glow: 'shadow-[0_0_15px_rgba(34,211,238,0.4)]',
            dot: 'bg-cyan-500 dark:bg-cyan-400',
        };
    }

    if (percentage >= 70) {
        return {
            label: 'Professional Working Ability',
            badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30 font-bold dark:font-semibold',
            barColor: 'from-pink-600 via-purple-600 to-indigo-500',
            glow: 'shadow-[0_0_15px_rgba(168,85,247,0.4)]',
            dot: 'bg-purple-500 dark:bg-purple-400',
        };
    }

    return {
        label: 'Conversational / Technical',
        badge: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 font-bold dark:font-semibold',
        barColor: 'from-amber-600 via-orange-500 to-yellow-400',
        glow: 'shadow-[0_0_15px_rgba(251,191,36,0.4)]',
        dot: 'bg-amber-500 dark:bg-amber-400',
    };
}

/* Helper to collect normalized media items */
function getSkillMediaList(skill: LanguageSkillItem): MediaItem[] {
    const list: MediaItem[] = [];

    if (skill.media && Array.isArray(skill.media) && skill.media.length > 0) {
        skill.media.forEach((m) => {
            if (m && (m.file || m.url)) {
                list.push(m);
            }
        });
    }

    if (skill.gallery && Array.isArray(skill.gallery)) {
        skill.gallery.forEach((g) => {
            if (g) {
                list.push({ type: 'image', file: g });
            }
        });
    }

    if (skill.photo && list.length === 0) {
        list.push({ type: 'image', file: skill.photo, caption: skill.name });
    }

    if (skill.video && !list.some((m) => m.type === 'video')) {
        list.push({
            type: 'video',
            url: skill.video,
            caption: `${skill.name} Media Video`,
        });
    }

    return list;
}

/* Helper to convert YouTube URL to embed URL */
function getEmbedUrl(url: string): string | null {
    if (!url) {
        return null;
    }

    const ytMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/,
    );

    if (ytMatch) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=0&rel=0`;
    }

    return url;
}

/* Helper for Smart Pagination Range */
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

export default function LanguageSkillsSection({
    skills = [],
}: LanguageSkillsSectionProps) {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedAbility, setSelectedAbility] =
        useState<AbilityFilterType>('all');
    const [pageSize, setPageSize] = useState<number>(3);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [activeModalSkill, setActiveModalSkill] =
        useState<LanguageSkillItem | null>(null);

    // ESC key listener for modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveModalSkill(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter skills by search query and selected ability level
    const filteredSkills = useMemo(() => {
        if (!skills) {
            return [];
        }

        const q = searchQuery.trim().toLowerCase();

        return skills.filter((skill) => {
            const percent = Number(skill.percentage ?? 85);

            // Ability Level Filter
            if (selectedAbility !== 'all') {
                const opt = ABILITY_FILTER_OPTIONS.find(
                    (o) => o.id === selectedAbility,
                );

                if (opt && (percent < opt.min || percent > opt.max)) {
                    return false;
                }
            }

            // Search query filter
            if (!q) {
                return true;
            }

            const nameMatch = skill.name.toLowerCase().includes(q);
            const desc = getTranslated(skill.description, '').toLowerCase();
            const detail = getTranslated(skill.detail, '').toLowerCase();

            return nameMatch || desc.includes(q) || detail.includes(q);
        });
    }, [skills, searchQuery, selectedAbility]);

    // Count skills per ability option for filter pills
    const abilityCounts = useMemo(() => {
        const counts: Record<AbilityFilterType, number> = {
            all: skills.length,
            native: 0,
            fluent: 0,
            working: 0,
            conversational: 0,
        };

        skills.forEach((skill) => {
            const p = Number(skill.percentage ?? 85);

            if (p >= 95) {
                counts.native++;
            } else if (p >= 85) {
                counts.fluent++;
            } else if (p >= 70) {
                counts.working++;
            } else {
                counts.conversational++;
            }
        });

        return counts;
    }, [skills]);

    // Reset handlers
    const handleResetAll = () => {
        setSearchQuery('');
        setSelectedAbility('all');
        setCurrentPage(1);
    };

    const handleAbilityChange = (ability: AbilityFilterType) => {
        setSelectedAbility(ability);
        setCurrentPage(1);
    };

    // Pagination calculations
    const totalPages = Math.max(1, Math.ceil(filteredSkills.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedSkills = useMemo(() => {
        const start = (safeCurrentPage - 1) * pageSize;

        return filteredSkills.slice(start, start + pageSize);
    }, [filteredSkills, safeCurrentPage, pageSize]);

    const startIndex =
        filteredSkills.length > 0 ? (safeCurrentPage - 1) * pageSize + 1 : 0;
    const endIndex = Math.min(
        safeCurrentPage * pageSize,
        filteredSkills.length,
    );

    if (!skills || skills.length === 0) {
        return null;
    }

    const isFilterActive = searchQuery !== '' || selectedAbility !== 'all';

    return (
        <section
            id="languages"
            className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-24 lg:py-28"
        >
            {/* Ambient Cosmic Background Glows */}
            <div className="pointer-events-none absolute top-1/2 left-1/4 -z-10 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/15" />
            <div className="pointer-events-none absolute right-1/4 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/10" />
            <div className="pointer-events-none absolute top-1/4 right-10 -z-10 h-[450px] w-[450px] rounded-full bg-indigo-200/20 blur-3xl dark:bg-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 px-3.5 py-1.5 text-xs font-bold text-purple-700 shadow-sm dark:font-semibold dark:text-purple-300"
                    >
                        <Languages className="h-3.5 w-3.5" />
                        <span>{t('languages.title')}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        {t('languages.subtitle')}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="mx-auto max-w-xl text-sm text-muted-foreground"
                    >
                        Tingkat kemahiran dan keahlian bahasa dalam komunikasi
                        profesional, dokumentasi teknis, dan kolaborasi tim
                        internasional.
                    </motion.p>
                </div>

                {/* ── Search & Ability Selection Control Bar ── */}
                <div className="mb-10 space-y-4 rounded-3xl border border-border/80 bg-card/90 p-4 shadow-xl shadow-purple-950/10 backdrop-blur-sm sm:p-6">
                    {/* Row 1: Search Bar & Ability Select Dropdown */}
                    <div className="flex flex-col items-stretch justify-between gap-3 md:flex-row md:items-center">
                        {/* Expanded Search Input */}
                        <div className="relative w-full flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-purple-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari bahasa, tingkat kefasihan, sertifikasi..."
                                className="w-full rounded-2xl border border-border bg-background/90 py-3 pr-10 pl-11 text-xs text-foreground shadow-inner transition-all placeholder:text-muted-foreground focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/40 focus:outline-none sm:text-sm"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setCurrentPage(1);
                                    }}
                                    className="absolute top-1/2 right-3.5 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                    title="Hapus pencarian"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Ability Level Select Dropdown Button */}
                        <div className="flex flex-shrink-0 items-center gap-2">
                            <div className="relative flex-1 sm:flex-initial">
                                <div className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-purple-400">
                                    <Award className="h-4 w-4" />
                                </div>
                                <select
                                    value={selectedAbility}
                                    onChange={(e) =>
                                        handleAbilityChange(
                                            e.target.value as AbilityFilterType,
                                        )
                                    }
                                    className="w-full cursor-pointer appearance-none rounded-2xl border border-border bg-background/90 py-3 pr-9 pl-10 text-xs font-semibold text-foreground shadow-inner transition-all focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/40 focus:outline-none sm:w-auto sm:text-sm"
                                >
                                    {ABILITY_FILTER_OPTIONS.map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.label} ({abilityCounts[opt.id]}
                                            )
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground">
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                </div>
                            </div>

                            {/* Reset Filter Button if active */}
                            {isFilterActive && (
                                <button
                                    type="button"
                                    onClick={handleResetAll}
                                    className="flex items-center gap-1 rounded-2xl border border-border/80 bg-secondary/80 p-3 text-xs font-semibold text-purple-400 shadow-sm transition-all hover:bg-secondary hover:text-white"
                                    title="Reset Semua Filter"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    <span className="hidden sm:inline">
                                        Reset
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Interactive Ability Level Quick Select Pills */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
                        <span className="mr-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                            <Filter className="h-3 w-3 text-cyan-400" />
                            Ability Level:
                        </span>

                        {ABILITY_FILTER_OPTIONS.map((opt) => {
                            const isSelected = selectedAbility === opt.id;
                            const count = abilityCounts[opt.id];

                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => handleAbilityChange(opt.id)}
                                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 ${
                                        isSelected
                                            ? 'scale-[1.02] bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md ring-1 shadow-purple-500/25 ring-cyan-400/40'
                                            : 'border border-border bg-background/80 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                                >
                                    <span
                                        className={`h-2 w-2 rounded-full ${isSelected ? 'bg-white' : opt.dotColor}`}
                                    />
                                    <span>{opt.shortLabel}</span>
                                    <span
                                        className={`py-0.2 rounded-full px-1.5 text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'}`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}

                        {/* Results Count Badge */}
                        <div className="ml-auto hidden items-center gap-1.5 rounded-xl border border-border/60 bg-secondary/50 px-3 py-1 font-mono text-xs text-muted-foreground lg:flex">
                            <Layers className="h-3.5 w-3.5 text-cyan-400" />
                            <span>
                                {filteredSkills.length} Bahasa Ditemukan
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Language Cards Grid or Empty State ── */}
                <AnimatePresence mode="wait">
                    {filteredSkills.length === 0 ? (
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
                                Bahasa tidak ditemukan
                            </h3>
                            <p className="max-w-sm text-xs text-muted-foreground">
                                Tidak ada data bahasa yang sesuai dengan
                                kombinasi pencarian dan filter ability saat ini.
                            </p>
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="mt-2 flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-secondary/80"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset Pencarian & Filter
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                            {paginatedSkills.map((skill, idx) => {
                                const description = getTranslated(
                                    skill.description,
                                    '',
                                );
                                const percent = Math.min(
                                    100,
                                    Math.max(0, Number(skill.percentage ?? 85)),
                                );
                                const levelConfig =
                                    getProficiencyLevel(percent);
                                const mediaList = getSkillMediaList(skill);

                                return (
                                    <motion.div
                                        key={skill.id}
                                        initial={{ opacity: 0, y: 25 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.4,
                                            delay: idx * 0.08,
                                        }}
                                        className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/20"
                                    >
                                        {/* Futuristic Top Border Accent Glow */}
                                        <div className="absolute top-0 right-0 left-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-cyan-400 opacity-60 transition-opacity group-hover:opacity-100" />

                                        {/* ── Card Media Swiper / Cover ── */}
                                        {mediaList.length > 0 && (
                                            <div className="relative h-44 w-full overflow-hidden border-b border-border/60 bg-secondary/60">
                                                {mediaList.length > 1 ? (
                                                    <Swiper
                                                        modules={[
                                                            Pagination,
                                                            Autoplay,
                                                        ]}
                                                        pagination={{
                                                            clickable: true,
                                                        }}
                                                        autoplay={{
                                                            delay: 4500,
                                                            disableOnInteraction: false,
                                                        }}
                                                        className="h-full w-full"
                                                    >
                                                        {mediaList.map(
                                                            (item, mIdx) => (
                                                                <SwiperSlide
                                                                    key={mIdx}
                                                                    className="relative h-full w-full"
                                                                >
                                                                    {item.type ===
                                                                    'video' ? (
                                                                        <div className="relative flex h-full w-full items-center justify-center bg-black/80">
                                                                            {item.url &&
                                                                            item.url.includes(
                                                                                'youtube',
                                                                            ) ? (
                                                                                <iframe
                                                                                    src={
                                                                                        getEmbedUrl(
                                                                                            item.url,
                                                                                        ) ??
                                                                                        ''
                                                                                    }
                                                                                    title={
                                                                                        item.caption ??
                                                                                        skill.name
                                                                                    }
                                                                                    className="pointer-events-none h-full w-full object-cover opacity-80"
                                                                                />
                                                                            ) : (
                                                                                <video
                                                                                    src={
                                                                                        item.file
                                                                                            ? `/storage/${item.file}`
                                                                                            : (item.url ??
                                                                                              '')
                                                                                    }
                                                                                    className="h-full w-full object-cover"
                                                                                    muted
                                                                                    loop
                                                                                    playsInline
                                                                                />
                                                                            )}
                                                                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3">
                                                                                <span className="flex items-center gap-1 font-mono text-[10px] text-cyan-300">
                                                                                    <Film className="h-3 w-3" />
                                                                                    {item.caption ||
                                                                                        'Video Resource'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="relative h-full w-full">
                                                                            <img
                                                                                src={
                                                                                    item.url ||
                                                                                    (item.file
                                                                                        ? `/storage/${item.file}`
                                                                                        : '')
                                                                                }
                                                                                alt={
                                                                                    item.caption ||
                                                                                    skill.name
                                                                                }
                                                                                loading="lazy"
                                                                                decoding="async"
                                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                            />
                                                                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3">
                                                                                <span className="truncate font-mono text-[10px] text-white/90">
                                                                                    {item.caption ||
                                                                                        skill.name}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </SwiperSlide>
                                                            ),
                                                        )}
                                                    </Swiper>
                                                ) : (
                                                    /* Single Media View */
                                                    <div className="relative h-full w-full">
                                                        {mediaList[0].type ===
                                                        'video' ? (
                                                            <div className="relative flex h-full w-full items-center justify-center bg-black">
                                                                {mediaList[0]
                                                                    .url &&
                                                                mediaList[0].url.includes(
                                                                    'youtube',
                                                                ) ? (
                                                                    <iframe
                                                                        src={
                                                                            getEmbedUrl(
                                                                                mediaList[0]
                                                                                    .url,
                                                                            ) ??
                                                                            ''
                                                                        }
                                                                        title={
                                                                            mediaList[0]
                                                                                .caption ??
                                                                            skill.name
                                                                        }
                                                                        className="pointer-events-none h-full w-full object-cover opacity-80"
                                                                    />
                                                                ) : (
                                                                    <video
                                                                        src={
                                                                            mediaList[0]
                                                                                .file
                                                                                ? `/storage/${mediaList[0].file}`
                                                                                : (mediaList[0]
                                                                                      .url ??
                                                                                  '')
                                                                        }
                                                                        className="h-full w-full object-cover"
                                                                        muted
                                                                        loop
                                                                        playsInline
                                                                    />
                                                                )}
                                                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3">
                                                                    <span className="flex items-center gap-1 font-mono text-[10px] text-cyan-300">
                                                                        <Film className="h-3 w-3" />
                                                                        {mediaList[0]
                                                                            .caption ||
                                                                            'Video Showcase'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="relative h-full w-full">
                                                                <img
                                                                    src={
                                                                        mediaList[0]
                                                                            .url ||
                                                                        (mediaList[0]
                                                                            .file
                                                                            ? `/storage/${mediaList[0].file}`
                                                                            : '')
                                                                    }
                                                                    alt={
                                                                        mediaList[0]
                                                                            .caption ||
                                                                        skill.name
                                                                    }
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                />
                                                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3">
                                                                    <span className="truncate font-mono text-[10px] text-white/90">
                                                                        {mediaList[0]
                                                                            .caption ||
                                                                            skill.name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Card Body */}
                                        <div className="flex flex-1 flex-col justify-between space-y-5 p-6">
                                            <div className="space-y-5">
                                                {/* Header: Flag / Icon & Title */}
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-secondary/80 text-xl shadow-inner transition-all group-hover:scale-105 group-hover:border-purple-500/50">
                                                            {skill.logo ? (
                                                                <img
                                                                    src={`/storage/${skill.logo}`}
                                                                    alt={
                                                                        skill.name
                                                                    }
                                                                    loading="lazy"
                                                                    decoding="async"
                                                                    className="h-7 w-7 object-contain drop-shadow"
                                                                />
                                                            ) : (
                                                                <Globe className="h-6 w-6 text-purple-400" />
                                                            )}
                                                            <span
                                                                className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full border-2 border-card ${levelConfig.dot} animate-pulse`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-purple-300">
                                                                {skill.name}
                                                            </h3>
                                                            <span className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                                                                <Zap className="h-3 w-3 text-cyan-400" />
                                                                Spoken, Written
                                                                & Technical
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Percentage Badge */}
                                                    <div className="flex flex-shrink-0 items-baseline gap-0.5 rounded-xl border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 font-mono text-sm font-extrabold text-foreground shadow-sm">
                                                        <span className="text-purple-400">
                                                            {percent}
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground">
                                                            %
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Futuristic Ability Bar Chart */}
                                                <div className="space-y-2 rounded-2xl border border-border/60 bg-secondary/40 p-3">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                                                            <TrendingUp className="h-3 w-3 text-purple-400" />
                                                            Ability &
                                                            Professional Skill
                                                        </span>
                                                        <span className="font-mono text-[10px] font-bold text-cyan-400">
                                                            {percent}/100
                                                        </span>
                                                    </div>

                                                    {/* Progress Track & Animated Fill */}
                                                    <div className="relative h-2.5 w-full overflow-hidden rounded-full border border-border/80 bg-background/80 p-[1.5px]">
                                                        <motion.div
                                                            initial={{
                                                                width: 0,
                                                            }}
                                                            whileInView={{
                                                                width: `${percent}%`,
                                                            }}
                                                            viewport={{
                                                                once: true,
                                                            }}
                                                            transition={{
                                                                duration: 1,
                                                                ease: 'easeOut',
                                                                delay:
                                                                    idx * 0.1 +
                                                                    0.1,
                                                            }}
                                                            className={`h-full rounded-full bg-gradient-to-r ${levelConfig.barColor} ${levelConfig.glow} relative`}
                                                        >
                                                            <div className="absolute inset-0 rounded-full bg-white/20 opacity-30" />
                                                        </motion.div>
                                                    </div>

                                                    {/* Scale Marks */}
                                                    <div className="flex items-center justify-between px-0.5 pt-0.5 font-mono text-[9px] text-muted-foreground/60 select-none">
                                                        <span>0%</span>
                                                        <span>25%</span>
                                                        <span>50%</span>
                                                        <span>75%</span>
                                                        <span>100%</span>
                                                    </div>
                                                </div>

                                                {/* Tier Level Badge */}
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-semibold ${levelConfig.badge}`}
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        {levelConfig.label}
                                                    </span>
                                                </div>

                                                {/* Short Description with Line Clamp */}
                                                {description && (
                                                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                        {description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Bottom Action: Lihat Detail Popup Button */}
                                            <div className="flex items-center justify-between border-t border-border/60 pt-3">
                                                <span className="font-mono text-[11px] text-muted-foreground">
                                                    {mediaList.length > 0
                                                        ? `${mediaList.length} Media Resources`
                                                        : 'Detailed Overview'}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveModalSkill(
                                                            skill,
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-1.5 text-xs font-semibold text-purple-300 shadow-sm transition-all duration-200 group-hover:border-purple-400 hover:bg-purple-500/20 hover:text-white active:scale-95"
                                                >
                                                    <span>Lihat Detail</span>
                                                    <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </AnimatePresence>

                {/* ── Futuristic Pagination Controls Bar ── */}
                {filteredSkills.length > 0 && (
                    <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg shadow-purple-950/10 backdrop-blur-sm sm:flex-row">
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
                                {filteredSkills.length} total)
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

            {/* ════════ DETAIL POPUP MODAL HANDLER (ON CLICK) ════════ */}
            <AnimatePresence>
                {activeModalSkill && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModalSkill(null)}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 300,
                            }}
                            className="relative z-10 my-8 flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl shadow-purple-950/40"
                        >
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setActiveModalSkill(null)}
                                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-md transition-all hover:bg-black/80 active:scale-90"
                                title="Tutup Modal"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Modal Header Media Carousel */}
                            {(() => {
                                const modalMedia =
                                    getSkillMediaList(activeModalSkill);

                                if (modalMedia.length === 0) {
                                    return null;
                                }

                                return (
                                    <div className="relative h-56 w-full flex-shrink-0 border-b border-border bg-secondary/80 sm:h-64">
                                        <Swiper
                                            modules={[
                                                Pagination,
                                                Navigation,
                                                Autoplay,
                                            ]}
                                            pagination={{ clickable: true }}
                                            navigation
                                            autoplay={{
                                                delay: 5000,
                                                disableOnInteraction: true,
                                            }}
                                            className="h-full w-full"
                                        >
                                            {modalMedia.map((item, mIdx) => (
                                                <SwiperSlide
                                                    key={mIdx}
                                                    className="relative h-full w-full"
                                                >
                                                    {item.type === 'video' ? (
                                                        <div className="relative flex h-full w-full items-center justify-center bg-black">
                                                            {item.url &&
                                                            item.url.includes(
                                                                'youtube',
                                                            ) ? (
                                                                <iframe
                                                                    src={
                                                                        getEmbedUrl(
                                                                            item.url,
                                                                        ) ?? ''
                                                                    }
                                                                    title={
                                                                        item.caption ??
                                                                        activeModalSkill.name
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                />
                                                            ) : (
                                                                <video
                                                                    src={
                                                                        item.file
                                                                            ? `/storage/${item.file}`
                                                                            : (item.url ??
                                                                              '')
                                                                    }
                                                                    className="h-full w-full object-cover"
                                                                    controls
                                                                    playsInline
                                                                />
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="relative h-full w-full">
                                                            <img
                                                                src={
                                                                    item.url ||
                                                                    (item.file
                                                                        ? `/storage/${item.file}`
                                                                        : '')
                                                                }
                                                                alt={
                                                                    item.caption ||
                                                                    activeModalSkill.name
                                                                }
                                                                loading="lazy"
                                                                decoding="async"
                                                                className="h-full w-full object-cover"
                                                            />
                                                            {item.caption && (
                                                                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4">
                                                                    <p className="font-mono text-xs text-white/90">
                                                                        {
                                                                            item.caption
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                );
                            })()}

                            {/* Modal Scrollable Content */}
                            <div className="flex-1 space-y-6 overflow-y-auto p-6 sm:p-8">
                                {/* Header Info */}
                                <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-5">
                                    <div className="flex items-center gap-3.5">
                                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-border bg-secondary text-xl shadow-inner">
                                            {activeModalSkill.logo ? (
                                                <img
                                                    src={`/storage/${activeModalSkill.logo}`}
                                                    alt={activeModalSkill.name}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-8 w-8 object-contain"
                                                />
                                            ) : (
                                                <Globe className="h-7 w-7 text-purple-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">
                                                {activeModalSkill.name}
                                            </h2>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold ${getProficiencyLevel(activeModalSkill.percentage ?? 85).badge}`}
                                                >
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    {
                                                        getProficiencyLevel(
                                                            activeModalSkill.percentage ??
                                                                85,
                                                        ).label
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Percentage Score */}
                                    <div className="flex flex-shrink-0 flex-col items-end">
                                        <div className="flex items-baseline gap-0.5 rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 font-mono text-lg font-extrabold text-foreground shadow-sm">
                                            <span className="text-purple-400">
                                                {activeModalSkill.percentage ??
                                                    85}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                % Ability
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rich Editor Content Rendering */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                                        Informasi Detail & Pengalaman
                                    </h4>

                                    {activeModalSkill.detail ? (
                                        <div
                                            className="prose prose-sm max-w-none rounded-2xl border border-border/60 bg-secondary/30 p-4 text-xs leading-relaxed text-foreground sm:p-5 sm:text-sm dark:prose-invert"
                                            dangerouslySetInnerHTML={{
                                                __html: getTranslated(
                                                    activeModalSkill.detail,
                                                    getTranslated(
                                                        activeModalSkill.description,
                                                        '',
                                                    ),
                                                ),
                                            }}
                                        />
                                    ) : (
                                        <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                                            <p className="text-xs leading-relaxed text-foreground sm:text-sm">
                                                {getTranslated(
                                                    activeModalSkill.description,
                                                    'Tidak ada deskripsi detail tambahan.',
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Ability Scale in Modal */}
                                <div className="space-y-2 rounded-2xl border border-border/60 bg-secondary/40 p-4">
                                    <div className="flex justify-between text-xs font-semibold">
                                        <span className="text-muted-foreground">
                                            Calibration Scale
                                        </span>
                                        <span className="font-mono text-cyan-400">
                                            {activeModalSkill.percentage ?? 85}%
                                            Mastery
                                        </span>
                                    </div>
                                    <div className="h-3 w-full overflow-hidden rounded-full border border-border bg-background p-[2px]">
                                        <div
                                            style={{
                                                width: `${activeModalSkill.percentage ?? 85}%`,
                                            }}
                                            className={`h-full rounded-full bg-gradient-to-r ${getProficiencyLevel(activeModalSkill.percentage ?? 85).barColor}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex justify-end border-t border-border/60 bg-secondary/20 p-4 sm:px-8">
                                <button
                                    type="button"
                                    onClick={() => setActiveModalSkill(null)}
                                    className="rounded-xl border border-border bg-secondary px-5 py-2 text-xs font-semibold text-foreground transition-all hover:bg-secondary/80"
                                >
                                    Tutup
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
