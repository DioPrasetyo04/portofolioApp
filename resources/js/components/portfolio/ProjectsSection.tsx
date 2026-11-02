import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink,
    Github,
    Sparkles,
    Code2,
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    Star,
    Filter,
    Check,
    Calendar,
    Tag,
    Zap,
    Globe,
    ArrowUpRight,
    Eye,
    ChevronDown,
    Layers,
    RefreshCw,
    SlidersHorizontal,
    Compass,
    LayoutGrid,
    BarChart3,
    PieChart as PieIcon,
    Activity,
    CheckCircle2,
} from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    BarChart,
    Bar,
    XAxis,
    YAxis,
} from 'recharts';
import { getTranslated } from '@/lib/i18n-helper';

/* ─── Types ──────────────────────────────────────────────── */
interface Technology {
    id: number;
    name: string;
    icon_url?: string | null;
}
interface ProjectItem {
    id: number;
    name: any;
    description: any;
    image: string | null;
    demo_url: string | null;
    repo_url: string | null;
    is_featured: boolean;
    priority_order?: number;
    status?: string;
    highlights?: Array<{ item: string }>;
    gallery?: string[];
    category?: string;
    year?: string;
    technologies: Technology[];
}
interface ProjectsSectionProps {
    projects: ProjectItem[];
}

/* ─── Constants ──────────────────────────────────────────── */
const CATEGORY_LABELS: Record<string, string> = {
    web: '🌐 Web App / SaaS',
    mobile: '📱 Mobile Client',
    api: '⚡ Distributed API',
    fullstack: '🔧 Fullstack System',
    '3d': '✨ 3D / WebGL Graphics',
    tool: '🛠️ Developer Tool',
    other: '🔹 Other Build',
};

const STATUS_CONFIG: Record<
    string,
    { label: string; color: string; dot: string }
> = {
    completed: {
        label: 'Production Ready',
        color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50 font-medium',
        dot: 'bg-emerald-400',
    },
    in_progress: {
        label: 'Active Dev',
        color: 'text-amber-300 bg-amber-950/80 border-amber-500/50 font-medium',
        dot: 'bg-amber-400',
    },
    archived: {
        label: 'Legacy Archive',
        color: 'text-zinc-300 bg-zinc-950/80 border-zinc-500/50 font-medium',
        dot: 'bg-zinc-400',
    },
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

/* ─── Helper for Truncating Text at 150 chars with ellipsis ─ */
function truncateText(text: string, maxLength = 150): string {
    if (!text) {
        return '';
    }

    // Strip basic HTML if present
    const cleanText = text.replace(/<[^>]*>?/gm, '');

    if (cleanText.length <= maxLength) {
        return cleanText;
    }

    return cleanText.slice(0, maxLength).trim() + '...';
}

/* ─── Helper for Pagination Range ────────────────────────── */
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

/* ─── Tech badge chip ────────────────────────────────────── */
function TechBadge({
    tech,
    size = 'sm',
}: {
    tech: Technology;
    size?: 'sm' | 'md';
}) {
    return (
        <span
            key={tech.id}
            className={`inline-flex cursor-default items-center gap-1.5 rounded-md border border-border/80 bg-secondary/80 font-mono text-muted-foreground transition-colors hover:border-purple-500/50 hover:text-purple-300 ${
                size === 'md'
                    ? 'px-2.5 py-1 text-xs'
                    : 'px-2 py-0.5 text-[11px]'
            }`}
        >
            {tech.icon_url ? (
                <img
                    src={tech.icon_url}
                    alt={tech.name}
                    className="h-3 w-3 object-contain"
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <Code2 className="h-2.5 w-2.5 text-purple-400 opacity-60" />
            )}
            {tech.name}
        </span>
    );
}

/* ─── Project Detail Modal ────────────────────────────────── */
function ProjectModal({
    project,
    onClose,
}: {
    project: ProjectItem;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const name = getTranslated(project.name, 'Project');
    const description = getTranslated(project.description, '');
    const status =
        STATUS_CONFIG[project.status ?? 'completed'] ?? STATUS_CONFIG.completed;
    const [activeImg, setActiveImg] = useState<string | null>(
        project.image ? `/storage/${project.image}` : null,
    );

    /* Gallery images */
    const galleryUrls = [
        ...(project.image ? [`/storage/${project.image}`] : []),
        ...(project.gallery ?? []).map((p) =>
            p.startsWith('http') ? p : `/storage/${p}`,
        ),
    ];

    /* Close on Escape */
    useEffect(() => {
        const fn = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', fn);

        return () => document.removeEventListener('keydown', fn);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />

                {/* Modal Panel */}
                <motion.div
                    className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-border/80 bg-card/95 shadow-2xl shadow-purple-950/50 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.93, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    {/* Header cover image */}
                    <div className="relative h-60 flex-shrink-0 overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900/50 to-cyan-900/30 sm:h-72">
                        {activeImg ? (
                            <img
                                src={activeImg}
                                alt={name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <Code2 className="h-16 w-16 text-purple-400/40" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/30" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white/80 shadow-lg transition-all hover:bg-black/90 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Badges over image */}
                        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                            {project.is_featured && (
                                <span className="flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold tracking-wider text-black uppercase shadow-md shadow-amber-500/30">
                                    <Star className="h-3 w-3 fill-black" />{' '}
                                    Featured Project
                                </span>
                            )}
                            <span
                                className={`flex items-center gap-1.5 rounded-full border bg-black/70 px-2.5 py-1 text-[10px] font-semibold ${status.color}`}
                            >
                                <span
                                    className={`h-1.5 w-1.5 rounded-full ${status.dot} animate-pulse`}
                                />
                                {status.label}
                            </span>
                        </div>
                    </div>

                    {/* Gallery thumbnails */}
                    {galleryUrls.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto px-6 pt-4 pb-1">
                            {galleryUrls.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(url)}
                                    className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                                        activeImg === url
                                            ? 'border-purple-500 ring-2 ring-purple-500/30'
                                            : 'border-border opacity-70 hover:border-border/80 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={url}
                                        alt=""
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="space-y-6 p-6 sm:p-8">
                        {/* Title & Actions */}
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div>
                                <h2 className="text-2xl leading-tight font-extrabold text-foreground sm:text-3xl">
                                    {name}
                                </h2>
                                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                                    {project.category && (
                                        <span className="flex items-center gap-1.5 rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300">
                                            <Tag className="h-3 w-3" />
                                            {CATEGORY_LABELS[
                                                project.category
                                            ] ?? project.category}
                                        </span>
                                    )}
                                    {project.year && (
                                        <span className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1 font-mono text-xs text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {project.year}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-shrink-0 items-center gap-2.5 pt-2 sm:pt-0">
                                {project.demo_url && (
                                    <a
                                        href={project.demo_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] hover:opacity-90"
                                    >
                                        <Globe className="h-3.5 w-3.5" />{' '}
                                        {t(
                                            'projects.liveDemo',
                                            'Live Deployment',
                                        )}
                                    </a>
                                )}
                                {project.repo_url && (
                                    <a
                                        href={project.repo_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:scale-[1.02] hover:bg-secondary"
                                    >
                                        <Github className="h-3.5 w-3.5" />{' '}
                                        {t(
                                            'projects.sourceCode',
                                            'Source Code',
                                        )}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {description && (
                            <div className="space-y-2">
                                <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
                                    <Compass className="h-3.5 w-3.5 text-purple-400" />{' '}
                                    {t(
                                        'projects.modalOverview',
                                        'System Architecture & Problem Solved',
                                    )}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        )}

                        {/* Highlights */}
                        {(project.highlights ?? []).length > 0 && (
                            <div className="space-y-2.5 rounded-2xl border border-purple-500/15 bg-purple-500/5 p-4">
                                <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
                                    <Zap className="h-3.5 w-3.5 text-amber-400" />{' '}
                                    {t(
                                        'projects.modalHighlights',
                                        'Engineering Decisions & Key Highlights',
                                    )}
                                </h3>
                                <ul className="space-y-2 pt-1">
                                    {project.highlights!.map((h, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2.5 text-xs text-muted-foreground"
                                        >
                                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-cyan-400" />
                                            <span>{h.item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tech Stack */}
                        {project.technologies?.length > 0 && (
                            <div className="space-y-2.5">
                                <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
                                    <Layers className="h-3.5 w-3.5 text-cyan-400" />{' '}
                                    {t(
                                        'projects.modalStack',
                                        'Stack & Infrastructure',
                                    )}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                        <TechBadge
                                            key={tech.id}
                                            tech={tech}
                                            size="md"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

/* ─── Futuristic Dropdown Select Component ────────────────── */
function CustomDropdownSelect({
    label,
    icon,
    options,
    value,
    onChange,
    placeholder = 'Select option...',
}: {
    label?: string;
    icon?: React.ReactNode;
    options: { value: string; label: string; count?: number }[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((o) => o.value === value);

    return (
        <div className="space-y-1.5" ref={containerRef}>
            {label && (
                <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                    {icon}
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                        isOpen
                            ? 'border-purple-500 bg-purple-500/10 text-foreground ring-2 ring-purple-500/20'
                            : value !== ''
                              ? 'border-purple-500/40 bg-card/80 text-foreground'
                              : 'border-border bg-card/50 text-muted-foreground hover:border-border/80 hover:bg-card/70'
                    }`}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-400' : ''}`}
                    />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full right-0 left-0 z-40 mt-1.5 max-h-56 space-y-0.5 overflow-y-auto rounded-xl border border-border/80 bg-card/95 p-1.5 shadow-2xl backdrop-blur-sm"
                        >
                            {options.map((opt) => {
                                const isSelected = opt.value === value;

                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                                            isSelected
                                                ? 'bg-purple-500/20 font-semibold text-purple-300'
                                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        }`}
                                    >
                                        <span className="truncate">
                                            {opt.label}
                                        </span>
                                        <div className="flex flex-shrink-0 items-center gap-1.5">
                                            {typeof opt.count === 'number' && (
                                                <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                                    {opt.count}
                                                </span>
                                            )}
                                            {isSelected && (
                                                <Check className="h-3.5 w-3.5 text-purple-400" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ─── Main Section ────────────────────────────────────────── */
export default function ProjectsSection({
    projects = [],
}: ProjectsSectionProps) {
    const { t } = useTranslation();

    /* ── View Mode & Filter States ── */
    const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [featuredOnly, setFeaturedOnly] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
        null,
    );

    /* ── Sorted by priority & featured status ── */
    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => {
            if (a.is_featured !== b.is_featured) {
                return a.is_featured ? -1 : 1;
            }

            return (a.priority_order ?? 99) - (b.priority_order ?? 99);
        });
    }, [projects]);

    /* ── Category Data for Telemetry Chart ── */
    const categoryChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        sortedProjects.forEach((p) => {
            const cat = p.category || 'other';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        const colors = [
            '#8B5CF6',
            '#06B6D4',
            '#10B981',
            '#F59E0B',
            '#EC4899',
            '#6366F1',
        ];

        return Object.entries(counts).map(([cat, total], idx) => ({
            key: cat,
            name: CATEGORY_LABELS[cat]
                ? CATEGORY_LABELS[cat].replace(/^[^\s]+\s*/, '')
                : cat,
            value: total,
            color: colors[idx % colors.length],
        }));
    }, [sortedProjects]);

    /* ── Tech Frequency Data for Telemetry Chart ── */
    const techFrequencyData = useMemo(() => {
        const counts: Record<string, number> = {};
        sortedProjects.forEach((p) => {
            p.technologies?.forEach((tech) => {
                counts[tech.name] = (counts[tech.name] || 0) + 1;
            });
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([name, count]) => ({ name, count }));
    }, [sortedProjects]);

    /* ── Dynamic Category options with counts ── */
    const categoryOptions = useMemo(() => {
        const counts: Record<string, number> = {};
        sortedProjects.forEach((p) => {
            if (p.category) {
                counts[p.category] = (counts[p.category] || 0) + 1;
            }
        });

        const list = Object.keys(counts).map((cat) => ({
            value: cat,
            label: CATEGORY_LABELS[cat] ?? cat,
            count: counts[cat],
        }));

        return [
            {
                value: '',
                label: '🌟 All Categories',
                count: sortedProjects.length,
            },
            ...list,
        ];
    }, [sortedProjects]);

    /* ── Status options with counts ── */
    const statusOptions = useMemo(() => {
        const counts: Record<string, number> = {
            completed: 0,
            in_progress: 0,
            archived: 0,
        };
        sortedProjects.forEach((p) => {
            const st = p.status || 'completed';

            if (counts[st] !== undefined) {
                counts[st]++;
            }
        });

        return [
            {
                value: '',
                label: '⚡ All Statuses',
                count: sortedProjects.length,
            },
            {
                value: 'completed',
                label: '✅ Completed',
                count: counts.completed,
            },
            {
                value: 'in_progress',
                label: '🔄 In Progress',
                count: counts.in_progress,
            },
            { value: 'archived', label: '📦 Archived', count: counts.archived },
        ];
    }, [sortedProjects]);

    /* ── Filter Logic ── */
    const filteredProjects = useMemo(() => {
        const q = activeSearch.trim().toLowerCase();

        return sortedProjects.filter((p) => {
            const name = getTranslated(p.name, '').toLowerCase();
            const desc = getTranslated(p.description, '').toLowerCase();
            const techs =
                p.technologies?.map((t) => t.name.toLowerCase()).join(' ') ??
                '';

            if (
                q &&
                !name.includes(q) &&
                !desc.includes(q) &&
                !techs.includes(q)
            ) {
                return false;
            }

            if (featuredOnly && !p.is_featured) {
                return false;
            }

            if (selectedCategory && p.category !== selectedCategory) {
                return false;
            }

            if (
                selectedStatus &&
                (p.status || 'completed') !== selectedStatus
            ) {
                return false;
            }

            return true;
        });
    }, [
        sortedProjects,
        activeSearch,
        featuredOnly,
        selectedCategory,
        selectedStatus,
    ]);

    /* ── Pagination calculations ── */
    const totalPages = Math.max(
        1,
        Math.ceil(filteredProjects.length / pageSize),
    );
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const paginatedProjects = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * pageSize;

        return filteredProjects.slice(startIndex, startIndex + pageSize);
    }, [filteredProjects, safeCurrentPage, pageSize]);

    /* ── Handlers ── */
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveSearch(searchQuery);
        setCurrentPage(1);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setActiveSearch('');
        setCurrentPage(1);
    };

    const handleResetAllFilters = () => {
        setSearchQuery('');
        setActiveSearch('');
        setSelectedCategory('');
        setSelectedStatus('');
        setFeaturedOnly(false);
        setCurrentPage(1);
    };

    const hasActiveFilters =
        activeSearch || selectedCategory || selectedStatus || featuredOnly;

    if (!projects || projects.length === 0) {
        return null;
    }

    return (
        <section
            id="projects"
            className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-24 lg:py-28"
        >
            {/* Ambient Cosmic Background Glows */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/3 left-0 h-[600px] w-[600px] rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/15" />
                <div className="absolute right-0 bottom-10 h-[550px] w-[550px] rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/10" />
                <div className="absolute top-10 right-1/4 h-[450px] w-[450px] rounded-full bg-amber-200/15 blur-3xl dark:bg-transparent" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 px-3.5 py-1.5 text-xs font-bold text-purple-700 shadow-sm dark:font-semibold dark:text-purple-300"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>
                            {t(
                                'projects.badge',
                                'PROYEK & IMPLEMENTASI TEKNIS',
                            )}
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        {t(
                            'projects.subtitle',
                            'Sistem Produksi, Eksperimen 3D, dan Perangkat Lunak Terbuka',
                        )}
                    </motion.h2>
                    <p className="mx-auto max-w-2xl text-sm leading-relaxed text-muted-foreground">
                        {t(
                            'projects.description',
                            'Dokumentasi sistem web yang saya bangun dengan fokus pada skalabilitas backend Laravel, responsivitas antarmuka React, dan optimalisasi grafis real-time 60 FPS pada Three.js.',
                        )}
                    </p>
                </div>

                {/* ── 2-Section Grid Layout (Left: Search Card, Right: Projects Grid) ── */}
                <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12">
                    {/* ════════ LEFT SECTION: Search & Filters Card ════════ */}
                    <div className="z-20 self-start lg:sticky lg:top-24 lg:col-span-4 xl:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-5"
                        >
                            <div className="max-h-[calc(100vh-7.5rem)] space-y-5 overflow-y-auto rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl shadow-purple-950/20 backdrop-blur-sm">
                                {/* Card Title */}
                                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                                    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                        <SlidersHorizontal className="h-4 w-4 text-purple-400" />
                                        <span>
                                            {t(
                                                'projects.filterTitle',
                                                'Filter & Spesifikasi',
                                            )}
                                        </span>
                                    </div>
                                    {hasActiveFilters && (
                                        <button
                                            type="button"
                                            onClick={handleResetAllFilters}
                                            className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 transition-colors hover:text-cyan-400"
                                        >
                                            <RefreshCw className="h-3 w-3" />{' '}
                                            {t(
                                                'projects.resetFilters',
                                                'Setel Ulang',
                                            )}
                                        </button>
                                    )}
                                </div>

                                {/* 1. Search Form & Button */}
                                <form
                                    onSubmit={handleSearchSubmit}
                                    className="space-y-2"
                                >
                                    <label className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                                        <Search className="h-3 w-3 text-purple-400" />
                                        {t(
                                            'projects.searchLabel',
                                            'Pencarian Repositori',
                                        )}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            placeholder={t(
                                                'projects.searchPlaceholder',
                                                'Cari teknologi, keyword, modul...',
                                            )}
                                            className="w-full rounded-xl border border-border bg-background/80 py-2.5 pr-8 pl-3.5 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={handleClearSearch}
                                                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-600/25 transition-all hover:scale-[1.01] hover:shadow-purple-600/40 active:scale-[0.98]"
                                    >
                                        <Search className="h-3.5 w-3.5" />
                                        <span>
                                            {t(
                                                'projects.searchButton',
                                                'Cari Proyek',
                                            )}
                                        </span>
                                    </button>
                                </form>

                                {/* 2. Category Dropdown Menu */}
                                <CustomDropdownSelect
                                    label={t(
                                        'projects.categoryLabel',
                                        'Kategori Proyek',
                                    )}
                                    icon={
                                        <Tag className="h-3 w-3 text-cyan-400" />
                                    }
                                    options={categoryOptions}
                                    value={selectedCategory}
                                    onChange={(val) => {
                                        setSelectedCategory(val);
                                        setCurrentPage(1);
                                    }}
                                    placeholder={t(
                                        'projects.categoryAll',
                                        'Semua Kategori',
                                    )}
                                />

                                {/* 3. Status Dropdown Menu */}
                                <CustomDropdownSelect
                                    label={t(
                                        'projects.statusLabel',
                                        'Status Produksi',
                                    )}
                                    icon={
                                        <Filter className="h-3 w-3 text-emerald-400" />
                                    }
                                    options={statusOptions}
                                    value={selectedStatus}
                                    onChange={(val) => {
                                        setSelectedStatus(val);
                                        setCurrentPage(1);
                                    }}
                                    placeholder={t(
                                        'projects.statusAll',
                                        'Semua Status',
                                    )}
                                />

                                {/* 4. Featured Only Button Toggle */}
                                <div className="pt-1">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFeaturedOnly((prev) => !prev);
                                            setCurrentPage(1);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                                            featuredOnly
                                                ? 'border-amber-500/80 bg-amber-500/15 text-amber-300 shadow-md ring-2 shadow-amber-500/10 ring-amber-500/20'
                                                : 'border-border bg-background/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Star
                                                className={`h-3.5 w-3.5 ${featuredOnly ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'}`}
                                            />
                                            <span>
                                                {t(
                                                    'projects.featuredToggle',
                                                    'Arsitektur Unggulan',
                                                )}
                                            </span>
                                        </div>
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${featuredOnly ? 'bg-amber-400 text-black' : 'bg-secondary text-muted-foreground'}`}
                                        >
                                            {featuredOnly
                                                ? t(
                                                      'projects.activeBadge',
                                                      'Aktif',
                                                  )
                                                : t(
                                                      'projects.offBadge',
                                                      'Semua',
                                                  )}
                                        </span>
                                    </button>
                                </div>

                                {/* Results Count & Active Filter Indicator */}
                                <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                                    <span>
                                        {t(
                                            'projects.resultsFound',
                                            'Hasil ditemukan:',
                                        )}
                                    </span>
                                    <span className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono font-bold text-foreground">
                                        {filteredProjects.length}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* ════════ RIGHT SECTION: Projects Cards Grid & Telemetry Chart ════════ */}
                    <div className="space-y-6 lg:col-span-8 xl:col-span-9">
                        {/* View Mode Toggle Bar (Grid Showcase vs Stack Analytics Chart) */}
                        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/60 p-3 shadow-md backdrop-blur-xl sm:flex-row">
                            <div className="flex w-full items-center gap-1.5 rounded-xl border border-border bg-background/80 p-1 sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:flex-none ${
                                        viewMode === 'grid'
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                                            : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                                    }`}
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                    <span>
                                        {t(
                                            'projects.viewGrid',
                                            'Grid Showcase',
                                        )}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('chart')}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 sm:flex-none ${
                                        viewMode === 'chart'
                                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                                            : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                                    }`}
                                >
                                    <BarChart3 className="h-3.5 w-3.5" />
                                    <span>
                                        {t(
                                            'projects.viewChart',
                                            'Stack Analytics / Distribution Chart',
                                        )}
                                    </span>
                                </button>
                            </div>

                            <div className="flex items-center gap-2 self-end font-mono text-xs text-muted-foreground sm:self-auto">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                                <span>
                                    {filteredProjects.length}{' '}
                                    {t('projects.pageCountSuffix', 'data')}{' '}
                                    {hasActiveFilters &&
                                        `(${t('projects.activeBadge', 'Filtered')})`}
                                </span>
                            </div>
                        </div>

                        {/* Filter Status Summary Bar (Mobile / Responsive Indicator) */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/40 p-3 text-xs">
                                <span className="font-medium text-muted-foreground">
                                    Active filters:
                                </span>
                                {activeSearch && (
                                    <span className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 text-[11px] text-purple-300">
                                        "{activeSearch}"
                                        <button onClick={handleClearSearch}>
                                            <X className="h-3 w-3 hover:text-white" />
                                        </button>
                                    </span>
                                )}
                                {selectedCategory && (
                                    <span className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] text-cyan-300">
                                        {CATEGORY_LABELS[selectedCategory] ??
                                            selectedCategory}
                                        <button
                                            onClick={() =>
                                                setSelectedCategory('')
                                            }
                                        >
                                            <X className="h-3 w-3 hover:text-white" />
                                        </button>
                                    </span>
                                )}
                                {selectedStatus && (
                                    <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-300">
                                        {selectedStatus}
                                        <button
                                            onClick={() =>
                                                setSelectedStatus('')
                                            }
                                        >
                                            <X className="h-3 w-3 hover:text-white" />
                                        </button>
                                    </span>
                                )}
                                {featuredOnly && (
                                    <span className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-300">
                                        ⭐ Featured
                                        <button
                                            onClick={() =>
                                                setFeaturedOnly(false)
                                            }
                                        >
                                            <X className="h-3 w-3 hover:text-white" />
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Conditional: Chart View vs Grid View */}
                        {viewMode === 'chart' ? (
                            <motion.div
                                key="telemetry-chart-view"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                <div className="space-y-6 rounded-3xl border border-border/80 bg-card/60 p-6 shadow-xl backdrop-blur-xl">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-purple-400 uppercase">
                                            <BarChart3 className="h-4 w-4" />
                                            <span>
                                                {t(
                                                    'projects.chartHeading',
                                                    'Distribusi Domain Rekayasa Perangkat Lunak',
                                                )}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {t(
                                                'projects.chartDescription',
                                                'Rasio alokasi proyek berdasarkan kompleksitas backend, antarmuka interaktif, dan rendering WebGL.',
                                            )}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
                                        {/* Donut Chart: Category Distribution */}
                                        <div className="flex flex-col items-center rounded-2xl border border-border/60 bg-secondary/30 p-4">
                                            <span className="mb-2 flex items-center gap-1.5 self-start text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                <PieIcon className="h-3.5 w-3.5 text-cyan-400" />{' '}
                                                Domain Breakdown
                                            </span>
                                            <div className="h-52 w-full">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <PieChart>
                                                        <Pie
                                                            data={
                                                                categoryChartData
                                                            }
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={48}
                                                            outerRadius={75}
                                                            paddingAngle={4}
                                                            dataKey="value"
                                                        >
                                                            {categoryChartData.map(
                                                                (
                                                                    entry,
                                                                    index,
                                                                ) => (
                                                                    <Cell
                                                                        key={`cell-${index}`}
                                                                        fill={
                                                                            entry.color
                                                                        }
                                                                    />
                                                                ),
                                                            )}
                                                        </Pie>
                                                        <RechartsTooltip
                                                            contentStyle={{
                                                                backgroundColor:
                                                                    'rgba(15, 12, 29, 0.95)',
                                                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                                                borderRadius:
                                                                    '12px',
                                                                fontSize:
                                                                    '11px',
                                                            }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="mt-2 flex flex-wrap justify-center gap-2">
                                                {categoryChartData.map((c) => (
                                                    <button
                                                        key={c.key}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCategory(
                                                                c.key,
                                                            );
                                                            setViewMode('grid');
                                                        }}
                                                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                                    >
                                                        <span
                                                            className="h-2 w-2 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    c.color,
                                                            }}
                                                        />
                                                        {c.name} ({c.value})
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bar Chart: Top Stack Adoption */}
                                        <div className="flex flex-col rounded-2xl border border-border/60 bg-secondary/30 p-4">
                                            <span className="mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                                <Layers className="h-3.5 w-3.5 text-purple-400" />{' '}
                                                Technology Adoption (Top 6)
                                            </span>
                                            <div className="h-52 w-full">
                                                <ResponsiveContainer
                                                    width="100%"
                                                    height="100%"
                                                >
                                                    <BarChart
                                                        data={techFrequencyData}
                                                        layout="vertical"
                                                        margin={{
                                                            top: 5,
                                                            right: 20,
                                                            left: 20,
                                                            bottom: 5,
                                                        }}
                                                    >
                                                        <XAxis
                                                            type="number"
                                                            hide
                                                        />
                                                        <YAxis
                                                            dataKey="name"
                                                            type="category"
                                                            tick={{
                                                                fill: '#94a3b8',
                                                                fontSize: 10,
                                                            }}
                                                            width={80}
                                                            axisLine={false}
                                                            tickLine={false}
                                                        />
                                                        <RechartsTooltip
                                                            contentStyle={{
                                                                backgroundColor:
                                                                    'rgba(15, 12, 29, 0.95)',
                                                                border: '1px solid rgba(139, 92, 246, 0.3)',
                                                                borderRadius:
                                                                    '12px',
                                                                fontSize:
                                                                    '11px',
                                                            }}
                                                        />
                                                        <Bar
                                                            dataKey="count"
                                                            fill="#8B5CF6"
                                                            radius={[
                                                                0, 6, 6, 0,
                                                            ]}
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <p className="mt-2 text-center font-mono text-[10px] text-muted-foreground">
                                                Frekuensi adopsi teknologi pada
                                                repositori aktif
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Summary Metrics Bento */}
                                    <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                                        <div className="flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5">
                                            <div>
                                                <div className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                                                    Production Ready
                                                </div>
                                                <div className="mt-0.5 text-xl font-extrabold text-foreground">
                                                    {statusOptions.find(
                                                        (s) =>
                                                            s.value ===
                                                            'completed',
                                                    )?.count ?? 0}{' '}
                                                    Proyek
                                                </div>
                                            </div>
                                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3.5">
                                            <div>
                                                <div className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                                                    Active Dev
                                                </div>
                                                <div className="mt-0.5 text-xl font-extrabold text-foreground">
                                                    {statusOptions.find(
                                                        (s) =>
                                                            s.value ===
                                                            'in_progress',
                                                    )?.count ?? 0}{' '}
                                                    Proyek
                                                </div>
                                            </div>
                                            <Activity className="h-5 w-5 text-amber-400" />
                                        </div>
                                        <div className="flex items-center justify-between rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3.5">
                                            <div>
                                                <div className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
                                                    Arsitektur Unggulan
                                                </div>
                                                <div className="mt-0.5 text-xl font-extrabold text-foreground">
                                                    {
                                                        sortedProjects.filter(
                                                            (p) =>
                                                                p.is_featured,
                                                        ).length
                                                    }{' '}
                                                    Flagship
                                                </div>
                                            </div>
                                            <Star className="h-5 w-5 text-cyan-400" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                {/* Projects Grid */}
                                <AnimatePresence mode="wait">
                                    {paginatedProjects.length === 0 ? (
                                        <motion.div
                                            key="empty-state"
                                            initial={{
                                                opacity: 0,
                                                scale: 0.95,
                                            }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border/80 bg-card/90 px-4 py-20 text-center backdrop-blur-sm"
                                        >
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-secondary text-muted-foreground shadow-inner">
                                                <Search className="h-8 w-8 text-purple-400 opacity-60" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-base font-bold text-foreground">
                                                    {t(
                                                        'projects.emptyTitle',
                                                        'Tidak ada repositori proyek yang sesuai kriteria',
                                                    )}
                                                </h3>
                                                <p className="mx-auto max-w-sm text-xs text-muted-foreground">
                                                    {t(
                                                        'projects.emptyDesc',
                                                        'Coba sesuaikan kata kunci pencarian, ganti filter kategori, atau reset parameter filter.',
                                                    )}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleResetAllFilters}
                                                className="rounded-xl border border-border bg-secondary px-4 py-2 text-xs font-semibold text-foreground transition-all hover:bg-secondary/80"
                                            >
                                                {t(
                                                    'projects.resetAll',
                                                    'Setel Ulang Filter',
                                                )}
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={`grid-page-${safeCurrentPage}-${pageSize}-${activeSearch}-${selectedCategory}-${selectedStatus}-${featuredOnly}`}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="grid grid-cols-1 gap-6 md:grid-cols-2"
                                        >
                                            {paginatedProjects.map(
                                                (project, idx) => {
                                                    const name = getTranslated(
                                                        project.name,
                                                        'Project',
                                                    );
                                                    const rawDesc =
                                                        getTranslated(
                                                            project.description,
                                                            '',
                                                        );
                                                    const status =
                                                        STATUS_CONFIG[
                                                            project.status ??
                                                                'completed'
                                                        ] ??
                                                        STATUS_CONFIG.completed;

                                                    // Apply 150 character limit with ellipsis rule
                                                    const truncatedDesc =
                                                        truncateText(
                                                            rawDesc,
                                                            150,
                                                        );

                                                    return (
                                                        <motion.div
                                                            key={project.id}
                                                            initial={{
                                                                opacity: 0,
                                                                y: 20,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                            }}
                                                            transition={{
                                                                delay:
                                                                    idx * 0.05,
                                                            }}
                                                            className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/60 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-950/30"
                                                        >
                                                            {/* Card Cover Image */}
                                                            <div className="relative h-48 flex-shrink-0 overflow-hidden bg-gradient-to-br from-purple-900/30 via-slate-900/40 to-cyan-900/30 sm:h-52">
                                                                {project.image ? (
                                                                    <img
                                                                        src={`/storage/${project.image}`}
                                                                        alt={
                                                                            name
                                                                        }
                                                                        loading="lazy"
                                                                        decoding="async"
                                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                                                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-500/20 text-purple-400">
                                                                            <Code2 className="h-6 w-6" />
                                                                        </div>
                                                                        <span className="font-mono text-xs">
                                                                            Architecture
                                                                            Build
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {/* Gradient Shadow Overlay */}
                                                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/20" />

                                                                {/* Top Badges */}
                                                                <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2">
                                                                    {project.is_featured && (
                                                                        <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase shadow-md">
                                                                            <Star className="h-2.5 w-2.5 fill-black" />{' '}
                                                                            {t(
                                                                                'projects.featured',
                                                                                'Unggulan',
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                    <span
                                                                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold backdrop-blur-md ${status.color}`}
                                                                    >
                                                                        <span
                                                                            className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                                                                        />
                                                                        {
                                                                            status.label
                                                                        }
                                                                    </span>
                                                                </div>

                                                                {/* Year Tag */}
                                                                {project.year && (
                                                                    <span className="absolute top-3.5 right-3.5 rounded-lg border border-white/10 bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white/80">
                                                                        {
                                                                            project.year
                                                                        }
                                                                    </span>
                                                                )}

                                                                {/* Hover Overlay "View Details" Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setSelectedProject(
                                                                            project,
                                                                        )
                                                                    }
                                                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
                                                                >
                                                                    <span className="flex items-center gap-2 rounded-xl border border-purple-500/40 bg-background/90 px-4 py-2.5 text-xs font-bold text-foreground shadow-2xl transition-transform hover:scale-105">
                                                                        <Eye className="h-4 w-4 text-purple-400" />{' '}
                                                                        {t(
                                                                            'projects.viewDetails',
                                                                            'Bedah Arsitektur',
                                                                        )}
                                                                    </span>
                                                                </button>
                                                            </div>

                                                            {/* Card Content */}
                                                            <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                                                                <div className="space-y-2">
                                                                    {project.category && (
                                                                        <div className="text-[10px] font-bold tracking-wider text-purple-400 uppercase">
                                                                            {CATEGORY_LABELS[
                                                                                project
                                                                                    .category
                                                                            ] ??
                                                                                project.category}
                                                                        </div>
                                                                    )}
                                                                    <h3 className="text-lg leading-tight font-bold text-foreground transition-colors group-hover:text-purple-300">
                                                                        {name}
                                                                    </h3>

                                                                    {/* Description with Line Clamp and 150 char ellipsis rule */}
                                                                    <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                                                        {
                                                                            truncatedDesc
                                                                        }
                                                                    </p>
                                                                </div>

                                                                {/* Tech Stack Chips */}
                                                                {project
                                                                    .technologies
                                                                    ?.length >
                                                                    0 && (
                                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                                        {project.technologies
                                                                            .slice(
                                                                                0,
                                                                                4,
                                                                            )
                                                                            .map(
                                                                                (
                                                                                    tech,
                                                                                ) => (
                                                                                    <TechBadge
                                                                                        key={
                                                                                            tech.id
                                                                                        }
                                                                                        tech={
                                                                                            tech
                                                                                        }
                                                                                    />
                                                                                ),
                                                                            )}
                                                                        {project
                                                                            .technologies
                                                                            .length >
                                                                            4 && (
                                                                            <span className="rounded-md border border-border bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                                                                                +
                                                                                {project
                                                                                    .technologies
                                                                                    .length -
                                                                                    4}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* Card Bottom Links & Action */}
                                                                <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
                                                                    <div className="flex items-center gap-3">
                                                                        {project.demo_url && (
                                                                            <a
                                                                                href={
                                                                                    project.demo_url
                                                                                }
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="flex items-center gap-1 text-xs font-medium text-purple-400 transition-colors hover:text-cyan-400"
                                                                                onClick={(
                                                                                    e,
                                                                                ) =>
                                                                                    e.stopPropagation()
                                                                                }
                                                                            >
                                                                                <ExternalLink className="h-3.5 w-3.5" />{' '}
                                                                                {t(
                                                                                    'projects.liveDemo',
                                                                                    'Buka Aplikasi',
                                                                                )}
                                                                            </a>
                                                                        )}
                                                                        {project.repo_url && (
                                                                            <a
                                                                                href={
                                                                                    project.repo_url
                                                                                }
                                                                                target="_blank"
                                                                                rel="noreferrer"
                                                                                className="flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                                                                onClick={(
                                                                                    e,
                                                                                ) =>
                                                                                    e.stopPropagation()
                                                                                }
                                                                            >
                                                                                <Github className="h-3.5 w-3.5" />{' '}
                                                                                {t(
                                                                                    'projects.sourceCode',
                                                                                    'Source Code',
                                                                                )}
                                                                            </a>
                                                                        )}
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setSelectedProject(
                                                                                project,
                                                                            )
                                                                        }
                                                                        className="flex items-center gap-1 text-xs font-semibold text-purple-400 transition-colors hover:text-cyan-400"
                                                                    >
                                                                        {t(
                                                                            'projects.details',
                                                                            'Spesifikasi',
                                                                        )}{' '}
                                                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                },
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* ════════ PAGINATION BAR (with Items-Per-Page Dropdown) ════════ */}
                                <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border/80 bg-card/90 p-4 shadow-lg backdrop-blur-sm sm:flex-row">
                                    {/* Items Per Page Select Dropdown */}
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span>
                                            {t(
                                                'projects.displayLabel',
                                                'Tampilkan:',
                                            )}
                                        </span>
                                        <div className="relative">
                                            <select
                                                value={pageSize}
                                                onChange={(e) => {
                                                    setPageSize(
                                                        Number(e.target.value),
                                                    );
                                                    setCurrentPage(1);
                                                }}
                                                className="cursor-pointer rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground focus:ring-2 focus:ring-purple-500/40 focus:outline-none"
                                            >
                                                {PAGE_SIZE_OPTIONS.map(
                                                    (opt) => (
                                                        <option
                                                            key={opt}
                                                            value={opt}
                                                        >
                                                            {opt}{' '}
                                                            {t(
                                                                'projects.pageCountSuffix',
                                                                'data',
                                                            )}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                        <span className="hidden md:inline">
                                            ({filteredProjects.length}{' '}
                                            {t(
                                                'projects.totalLabel',
                                                'total proyek',
                                            )}
                                            )
                                        </span>
                                    </div>

                                    {/* Numbered Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentPage((p) =>
                                                        Math.max(1, p - 1),
                                                    )
                                                }
                                                disabled={safeCurrentPage === 1}
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                                aria-label="Previous Page"
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>

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

                                                return (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() =>
                                                            setCurrentPage(num)
                                                        }
                                                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                                                            num ===
                                                            safeCurrentPage
                                                                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-600/30'
                                                                : 'border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground'
                                                        }`}
                                                    >
                                                        {num}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentPage((p) =>
                                                        Math.min(
                                                            totalPages,
                                                            p + 1,
                                                        ),
                                                    )
                                                }
                                                disabled={
                                                    safeCurrentPage ===
                                                    totalPages
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                                aria-label="Next Page"
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Page Indicator */}
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
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Detail Modal Popup ── */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
}
