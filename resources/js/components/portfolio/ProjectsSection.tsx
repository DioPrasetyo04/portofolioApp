import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink, Github, Sparkles, Code2, Search, X,
    ChevronLeft, ChevronRight, Star, Filter, Check,
    Calendar, Tag, Zap, Globe, ArrowUpRight, Eye,
    ChevronDown, CheckSquare, Square, Layers, RefreshCw,
    SlidersHorizontal, Compass, HelpCircle, LayoutGrid,
    BarChart3, PieChart as PieIcon, Activity, CheckCircle2,
} from 'lucide-react';
import {
    ResponsiveContainer, PieChart, Pie, Cell,
    Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis,
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
interface ProjectsSectionProps { projects: ProjectItem[] }

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

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
    completed:   { label: 'Production Ready', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-500/50 font-medium', dot: 'bg-emerald-400' },
    in_progress: { label: 'Active Dev',       color: 'text-amber-300 bg-amber-950/80 border-amber-500/50 font-medium',     dot: 'bg-amber-400' },
    archived:    { label: 'Legacy Archive',   color: 'text-zinc-300 bg-zinc-950/80 border-zinc-500/50 font-medium',         dot: 'bg-zinc-400' },
};

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

/* ─── Helper for Truncating Text at 150 chars with ellipsis ─ */
function truncateText(text: string, maxLength = 150): string {
    if (!text) return '';
    // Strip basic HTML if present
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    if (cleanText.length <= maxLength) return cleanText;
    return cleanText.slice(0, maxLength).trim() + '...';
}

/* ─── Helper for Pagination Range ────────────────────────── */
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

/* ─── Tech badge chip ────────────────────────────────────── */
function TechBadge({ tech, size = 'sm' }: { tech: Technology; size?: 'sm' | 'md' }) {
    return (
        <span
            key={tech.id}
            className={`inline-flex items-center gap-1.5 rounded-md bg-secondary/80 border border-border/80 font-mono text-muted-foreground hover:border-purple-500/50 hover:text-purple-300 transition-colors cursor-default ${
                size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
            }`}
        >
            {tech.icon_url ? (
                <img src={tech.icon_url} alt={tech.name} className="w-3 h-3 object-contain" loading="lazy" decoding="async" />
            ) : (
                <Code2 className="w-2.5 h-2.5 opacity-60 text-purple-400" />
            )}
            {tech.name}
        </span>
    );
}

/* ─── Project Detail Modal ────────────────────────────────── */
function ProjectModal({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
    const { t } = useTranslation();
    const name        = getTranslated(project.name, 'Project');
    const description = getTranslated(project.description, '');
    const status      = STATUS_CONFIG[project.status ?? 'completed'] ?? STATUS_CONFIG.completed;
    const [activeImg, setActiveImg] = useState<string | null>(
        project.image ? `/storage/${project.image}` : null
    );

    /* Gallery images */
    const galleryUrls = [
        ...(project.image ? [`/storage/${project.image}`] : []),
        ...(project.gallery ?? []).map(p => p.startsWith('http') ? p : `/storage/${p}`),
    ];

    /* Close on Escape */
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
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
                    className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border/80 bg-card/95 shadow-2xl shadow-purple-950/50 backdrop-blur-sm"
                    initial={{ opacity: 0, scale: 0.93, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    {/* Header cover image */}
                    <div className="relative h-60 sm:h-72 bg-gradient-to-br from-purple-900/40 via-slate-900/50 to-cyan-900/30 overflow-hidden flex-shrink-0">
                        {activeImg ? (
                            <img src={activeImg} alt={name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Code2 className="w-16 h-16 text-purple-400/40" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/30" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/90 transition-all shadow-lg"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Badges over image */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                            {project.is_featured && (
                                <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/30">
                                    <Star className="w-3 h-3 fill-black" /> Featured Project
                                </span>
                            )}
                            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold flex items-center gap-1.5 bg-black/70 ${status.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot} animate-pulse`} />
                                {status.label}
                            </span>
                        </div>
                    </div>

                    {/* Gallery thumbnails */}
                    {galleryUrls.length > 1 && (
                        <div className="flex gap-2 px-6 pt-4 overflow-x-auto pb-1">
                            {galleryUrls.map((url, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImg(url)}
                                    className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                                        activeImg === url ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-border hover:border-border/80 opacity-70 hover:opacity-100'
                                    }`}
                                >
                                    <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content Body */}
                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Title & Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">{name}</h2>
                                <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                                    {project.category && (
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center gap-1.5">
                                            <Tag className="w-3 h-3" />
                                            {CATEGORY_LABELS[project.category] ?? project.category}
                                        </span>
                                    )}
                                    {project.year && (
                                        <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary border border-border">
                                            <Calendar className="w-3 h-3" />
                                            {project.year}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 flex-shrink-0 pt-2 sm:pt-0">
                                {project.demo_url && (
                                    <a href={project.demo_url} target="_blank" rel="noreferrer"
                                       className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 hover:opacity-90 hover:scale-[1.02] transition-all">
                                        <Globe className="w-3.5 h-3.5" /> {t('projects.liveDemo', 'Live Deployment')}
                                    </a>
                                )}
                                {project.repo_url && (
                                    <a href={project.repo_url} target="_blank" rel="noreferrer"
                                       className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-semibold hover:scale-[1.02] transition-all">
                                        <Github className="w-3.5 h-3.5" /> {t('projects.sourceCode', 'Source Code')}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {description && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                                    <Compass className="w-3.5 h-3.5 text-purple-400" /> {t('projects.modalOverview', 'System Architecture & Problem Solved')}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        )}

                        {/* Highlights */}
                        {(project.highlights ?? []).length > 0 && (
                            <div className="space-y-2.5 p-4 rounded-2xl bg-purple-500/5 border border-purple-500/15">
                                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                                    <Zap className="w-3.5 h-3.5 text-amber-400" /> {t('projects.modalHighlights', 'Engineering Decisions & Key Highlights')}
                                </h3>
                                <ul className="space-y-2 pt-1">
                                    {project.highlights!.map((h, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                            <span>{h.item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tech Stack */}
                        {project.technologies?.length > 0 && (
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                                    <Layers className="w-3.5 h-3.5 text-cyan-400" /> {t('projects.modalStack', 'Stack & Infrastructure')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map(tech => (
                                        <TechBadge key={tech.id} tech={tech} size="md" />
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
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div className="space-y-1.5" ref={containerRef}>
            {label && (
                <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                    {icon}
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(prev => !prev)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
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
                    <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180 text-purple-400' : ''}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-1.5 z-40 max-h-56 overflow-y-auto rounded-xl border border-border/80 bg-card/95 p-1.5 shadow-2xl backdrop-blur-sm space-y-0.5"
                        >
                            {options.map(opt => {
                                const isSelected = opt.value === value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                                            isSelected
                                                ? 'bg-purple-500/20 text-purple-300 font-semibold'
                                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                        }`}
                                    >
                                        <span className="truncate">{opt.label}</span>
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            {typeof opt.count === 'number' && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                                    {opt.count}
                                                </span>
                                            )}
                                            {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
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
export default function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
    const { t } = useTranslation();

    /* ── View Mode & Filter States ── */
    const [viewMode, setViewMode]                 = useState<'grid' | 'chart'>('grid');
    const [searchQuery, setSearchQuery]           = useState('');
    const [activeSearch, setActiveSearch]         = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedStatus, setSelectedStatus]     = useState<string>('');
    const [featuredOnly, setFeaturedOnly]         = useState(false);
    const [pageSize, setPageSize]                 = useState(5);
    const [currentPage, setCurrentPage]           = useState(1);
    const [selectedProject, setSelectedProject]   = useState<ProjectItem | null>(null);

    if (!projects || projects.length === 0) return null;

    /* ── Sorted by priority & featured status ── */
    const sortedProjects = useMemo(() => {
        return [...projects].sort((a, b) => {
            if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
            return (a.priority_order ?? 99) - (b.priority_order ?? 99);
        });
    }, [projects]);

    /* ── Category Data for Telemetry Chart ── */
    const categoryChartData = useMemo(() => {
        const counts: Record<string, number> = {};
        sortedProjects.forEach(p => {
            const cat = p.category || 'other';
            counts[cat] = (counts[cat] || 0) + 1;
        });
        const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];
        return Object.entries(counts).map(([cat, total], idx) => ({
            key: cat,
            name: CATEGORY_LABELS[cat] ? CATEGORY_LABELS[cat].replace(/^[^\s]+\s*/, '') : cat,
            value: total,
            color: colors[idx % colors.length],
        }));
    }, [sortedProjects]);

    /* ── Tech Frequency Data for Telemetry Chart ── */
    const techFrequencyData = useMemo(() => {
        const counts: Record<string, number> = {};
        sortedProjects.forEach(p => {
            p.technologies?.forEach(tech => {
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
        sortedProjects.forEach(p => {
            if (p.category) {
                counts[p.category] = (counts[p.category] || 0) + 1;
            }
        });

        const list = Object.keys(counts).map(cat => ({
            value: cat,
            label: CATEGORY_LABELS[cat] ?? cat,
            count: counts[cat],
        }));

        return [
            { value: '', label: '🌟 All Categories', count: sortedProjects.length },
            ...list,
        ];
    }, [sortedProjects]);

    /* ── Status options with counts ── */
    const statusOptions = useMemo(() => {
        const counts: Record<string, number> = { completed: 0, in_progress: 0, archived: 0 };
        sortedProjects.forEach(p => {
            const st = p.status || 'completed';
            if (counts[st] !== undefined) counts[st]++;
        });

        return [
            { value: '', label: '⚡ All Statuses', count: sortedProjects.length },
            { value: 'completed', label: '✅ Completed', count: counts.completed },
            { value: 'in_progress', label: '🔄 In Progress', count: counts.in_progress },
            { value: 'archived', label: '📦 Archived', count: counts.archived },
        ];
    }, [sortedProjects]);

    /* ── Filter Logic ── */
    const filteredProjects = useMemo(() => {
        const q = activeSearch.trim().toLowerCase();
        return sortedProjects.filter(p => {
            const name = getTranslated(p.name, '').toLowerCase();
            const desc = getTranslated(p.description, '').toLowerCase();
            const techs = p.technologies?.map(t => t.name.toLowerCase()).join(' ') ?? '';

            if (q && !name.includes(q) && !desc.includes(q) && !techs.includes(q)) return false;
            if (featuredOnly && !p.is_featured) return false;
            if (selectedCategory && p.category !== selectedCategory) return false;
            if (selectedStatus && (p.status || 'completed') !== selectedStatus) return false;

            return true;
        });
    }, [sortedProjects, activeSearch, featuredOnly, selectedCategory, selectedStatus]);

    /* ── Pagination calculations ── */
    const totalPages = Math.max(1, Math.ceil(filteredProjects.length / pageSize));
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

    const hasActiveFilters = activeSearch || selectedCategory || selectedStatus || featuredOnly;

    return (
        <section id="projects" className="py-12 sm:py-16 md:py-24 lg:py-28 relative overflow-hidden bg-transparent">
            {/* Ambient Cosmic Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-0 w-[550px] h-[550px] bg-cyan-300/15 dark:bg-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute top-10 right-1/4 w-[450px] h-[450px] bg-amber-200/15 dark:bg-transparent rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Section Header ── */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 space-y-3">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-bold dark:font-semibold shadow-sm"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('projects.badge', 'PROYEK & IMPLEMENTASI TEKNIS')}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
                    >
                        {t('projects.subtitle', 'Sistem Produksi, Eksperimen 3D, dan Perangkat Lunak Terbuka')}
                    </motion.h2>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {t('projects.description', 'Dokumentasi sistem web yang saya bangun dengan fokus pada skalabilitas backend Laravel, responsivitas antarmuka React, dan optimalisasi grafis real-time 60 FPS pada Three.js.')}
                    </p>
                </div>

                {/* ── 2-Section Grid Layout (Left: Search Card, Right: Projects Grid) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">

                    {/* ════════ LEFT SECTION: Search & Filters Card ════════ */}
                    <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 z-20 self-start">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-5"
                        >
                            <div className="p-6 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-xl shadow-purple-950/20 space-y-5 max-h-[calc(100vh-7.5rem)] overflow-y-auto">
                            
                            {/* Card Title */}
                            <div className="flex items-center justify-between pb-3 border-b border-border/60">
                                <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                                    <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                                    <span>{t('projects.filterTitle', 'Filter & Spesifikasi')}</span>
                                </div>
                                {hasActiveFilters && (
                                    <button
                                        type="button"
                                        onClick={handleResetAllFilters}
                                        className="text-[11px] font-semibold text-purple-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                                    >
                                        <RefreshCw className="w-3 h-3" /> {t('projects.resetFilters', 'Setel Ulang')}
                                    </button>
                                )}
                            </div>

                            {/* 1. Search Form & Button */}
                            <form onSubmit={handleSearchSubmit} className="space-y-2">
                                <label className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                                    <Search className="w-3 h-3 text-purple-400" />
                                    {t('projects.searchLabel', 'Pencarian Repositori')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder={t('projects.searchPlaceholder', 'Cari teknologi, keyword, modul...')}
                                        className="w-full pl-3.5 pr-8 py-2.5 rounded-xl border border-border bg-background/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60 transition-all"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-semibold shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-[1.01] active:scale-[0.98] transition-all"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    <span>{t('projects.searchButton', 'Cari Proyek')}</span>
                                </button>
                            </form>

                            {/* 2. Category Dropdown Menu */}
                            <CustomDropdownSelect
                                label={t('projects.categoryLabel', 'Kategori Proyek')}
                                icon={<Tag className="w-3 h-3 text-cyan-400" />}
                                options={categoryOptions}
                                value={selectedCategory}
                                onChange={(val) => {
                                    setSelectedCategory(val);
                                    setCurrentPage(1);
                                }}
                                placeholder={t('projects.categoryAll', 'Semua Kategori')}
                            />

                            {/* 3. Status Dropdown Menu */}
                            <CustomDropdownSelect
                                label={t('projects.statusLabel', 'Status Produksi')}
                                icon={<Filter className="w-3 h-3 text-emerald-400" />}
                                options={statusOptions}
                                value={selectedStatus}
                                onChange={(val) => {
                                    setSelectedStatus(val);
                                    setCurrentPage(1);
                                }}
                                placeholder={t('projects.statusAll', 'Semua Status')}
                            />

                            {/* 4. Featured Only Button Toggle */}
                            <div className="pt-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFeaturedOnly(prev => !prev);
                                        setCurrentPage(1);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                                        featuredOnly
                                            ? 'border-amber-500/80 bg-amber-500/15 text-amber-300 ring-2 ring-amber-500/20 shadow-md shadow-amber-500/10'
                                            : 'border-border bg-background/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Star className={`w-3.5 h-3.5 ${featuredOnly ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                                        <span>{t('projects.featuredToggle', 'Arsitektur Unggulan')}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${featuredOnly ? 'bg-amber-400 text-black' : 'bg-secondary text-muted-foreground'}`}>
                                        {featuredOnly ? t('projects.activeBadge', 'Aktif') : t('projects.offBadge', 'Semua')}
                                    </span>
                                </button>
                            </div>

                            {/* Results Count & Active Filter Indicator */}
                            <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                                <span>{t('projects.resultsFound', 'Hasil ditemukan:')}</span>
                                <span className="font-mono font-bold text-foreground px-2 py-0.5 rounded-md bg-secondary border border-border">
                                    {filteredProjects.length}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ════════ RIGHT SECTION: Projects Cards Grid & Telemetry Chart ════════ */}
                <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                    
                    {/* View Mode Toggle Bar (Grid Showcase vs Stack Analytics Chart) */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/80 shadow-md">
                        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background/80 border border-border w-full sm:w-auto">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    viewMode === 'grid'
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>{t('projects.viewGrid', 'Grid Showcase')}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('chart')}
                                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                                    viewMode === 'chart'
                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                                }`}
                            >
                                <BarChart3 className="w-3.5 h-3.5" />
                                <span>{t('projects.viewChart', 'Stack Analytics / Distribution Chart')}</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono self-end sm:self-auto">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{filteredProjects.length} {t('projects.pageCountSuffix', 'data')} {hasActiveFilters && `(${t('projects.activeBadge', 'Filtered')})`}</span>
                        </div>
                    </div>

                    {/* Filter Status Summary Bar (Mobile / Responsive Indicator) */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-card/40 border border-border text-xs">
                            <span className="text-muted-foreground font-medium">Active filters:</span>
                            {activeSearch && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px]">
                                    "{activeSearch}"
                                    <button onClick={handleClearSearch}><X className="w-3 h-3 hover:text-white" /></button>
                                </span>
                            )}
                            {selectedCategory && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px]">
                                    {CATEGORY_LABELS[selectedCategory] ?? selectedCategory}
                                    <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3 hover:text-white" /></button>
                                </span>
                            )}
                            {selectedStatus && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
                                    {selectedStatus}
                                    <button onClick={() => setSelectedStatus('')}><X className="w-3 h-3 hover:text-white" /></button>
                                </span>
                            )}
                            {featuredOnly && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px]">
                                    ⭐ Featured
                                    <button onClick={() => setFeaturedOnly(false)}><X className="w-3 h-3 hover:text-white" /></button>
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
                            <div className="p-6 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-xl space-y-6">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                                        <BarChart3 className="w-4 h-4" />
                                        <span>{t('projects.chartHeading', 'Distribusi Domain Rekayasa Perangkat Lunak')}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {t('projects.chartDescription', 'Rasio alokasi proyek berdasarkan kompleksitas backend, antarmuka interaktif, dan rendering WebGL.')}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    {/* Donut Chart: Category Distribution */}
                                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex flex-col items-center">
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 self-start flex items-center gap-1.5">
                                            <PieIcon className="w-3.5 h-3.5 text-cyan-400" /> Domain Breakdown
                                        </span>
                                        <div className="w-full h-52">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={categoryChartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={48}
                                                        outerRadius={75}
                                                        paddingAngle={4}
                                                        dataKey="value"
                                                    >
                                                        {categoryChartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <RechartsTooltip
                                                        contentStyle={{ backgroundColor: 'rgba(15, 12, 29, 0.95)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', fontSize: '11px' }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-2 mt-2">
                                            {categoryChartData.map(c => (
                                                <button
                                                    key={c.key}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory(c.key);
                                                        setViewMode('grid');
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-secondary text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                                >
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                                                    {c.name} ({c.value})
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bar Chart: Top Stack Adoption */}
                                    <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 flex flex-col">
                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                            <Layers className="w-3.5 h-3.5 text-purple-400" /> Technology Adoption (Top 6)
                                        </span>
                                        <div className="w-full h-52">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={techFrequencyData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                                    <XAxis type="number" hide />
                                                    <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 10 }} width={80} axisLine={false} tickLine={false} />
                                                    <RechartsTooltip
                                                        contentStyle={{ backgroundColor: 'rgba(15, 12, 29, 0.95)', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '12px', fontSize: '11px' }}
                                                    />
                                                    <Bar dataKey="count" fill="#8B5CF6" radius={[0, 6, 6, 0]} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground text-center mt-2 font-mono">
                                            Frekuensi adopsi teknologi pada repositori aktif
                                        </p>
                                    </div>
                                </div>

                                {/* Status Summary Metrics Bento */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Production Ready</div>
                                            <div className="text-xl font-extrabold text-foreground mt-0.5">{statusOptions.find(s => s.value === 'completed')?.count ?? 0} Proyek</div>
                                        </div>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Active Dev</div>
                                            <div className="text-xl font-extrabold text-foreground mt-0.5">{statusOptions.find(s => s.value === 'in_progress')?.count ?? 0} Proyek</div>
                                        </div>
                                        <Activity className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
                                        <div>
                                            <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Arsitektur Unggulan</div>
                                            <div className="text-xl font-extrabold text-foreground mt-0.5">{sortedProjects.filter(p => p.is_featured).length} Flagship</div>
                                        </div>
                                        <Star className="w-5 h-5 text-cyan-400" />
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
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-sm text-center gap-4"
                                    >
                                        <div className="w-16 h-16 rounded-2xl border border-border bg-secondary flex items-center justify-center text-muted-foreground shadow-inner">
                                            <Search className="w-8 h-8 opacity-60 text-purple-400" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-base font-bold text-foreground">{t('projects.emptyTitle', 'Tidak ada repositori proyek yang sesuai kriteria')}</h3>
                                            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                                {t('projects.emptyDesc', 'Coba sesuaikan kata kunci pencarian, ganti filter kategori, atau reset parameter filter.')}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleResetAllFilters}
                                            className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground transition-all"
                                        >
                                            {t('projects.resetAll', 'Setel Ulang Filter')}
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={`grid-page-${safeCurrentPage}-${pageSize}-${activeSearch}-${selectedCategory}-${selectedStatus}-${featuredOnly}`}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                    >
                                        {paginatedProjects.map((project, idx) => {
                                            const name        = getTranslated(project.name, 'Project');
                                            const rawDesc     = getTranslated(project.description, '');
                                            const status      = STATUS_CONFIG[project.status ?? 'completed'] ?? STATUS_CONFIG.completed;

                                            // Apply 150 character limit with ellipsis rule
                                            const truncatedDesc = truncateText(rawDesc, 150);

                                            return (
                                                <motion.div
                                                    key={project.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className="group relative flex flex-col rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-950/30 hover:border-purple-500/40 transition-all duration-300"
                                                >
                                                    {/* Card Cover Image */}
                                                    <div className="relative h-48 sm:h-52 bg-gradient-to-br from-purple-900/30 via-slate-900/40 to-cyan-900/30 overflow-hidden flex-shrink-0">
                                                        {project.image ? (
                                                            <img
                                                                src={`/storage/${project.image}`}
                                                                alt={name}
                                                                loading="lazy"
                                                                decoding="async"
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="flex flex-col items-center justify-center gap-2 h-full text-muted-foreground">
                                                                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                                                    <Code2 className="w-6 h-6" />
                                                                </div>
                                                                <span className="text-xs font-mono">Architecture Build</span>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Gradient Shadow Overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-black/20" />

                                                        {/* Top Badges */}
                                                        <div className="absolute top-3.5 left-3.5 flex gap-2 flex-wrap items-center">
                                                            {project.is_featured && (
                                                                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px] uppercase tracking-wider shadow-md">
                                                                    <Star className="w-2.5 h-2.5 fill-black" /> {t('projects.featured', 'Unggulan')}
                                                                </span>
                                                            )}
                                                            <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold backdrop-blur-md ${status.color}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                                {status.label}
                                                            </span>
                                                        </div>

                                                        {/* Year Tag */}
                                                        {project.year && (
                                                            <span className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded-lg bg-black/70 text-white/80 text-[10px] font-mono border border-white/10">
                                                                {project.year}
                                                            </span>
                                                        )}

                                                        {/* Hover Overlay "View Details" Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedProject(project)}
                                                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]"
                                                        >
                                                            <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/90 border border-purple-500/40 text-xs font-bold text-foreground shadow-2xl hover:scale-105 transition-transform">
                                                                <Eye className="w-4 h-4 text-purple-400" /> {t('projects.viewDetails', 'Bedah Arsitektur')}
                                                            </span>
                                                        </button>
                                                    </div>

                                                    {/* Card Content */}
                                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                                        <div className="space-y-2">
                                                            {project.category && (
                                                                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                                                                    {CATEGORY_LABELS[project.category] ?? project.category}
                                                                </div>
                                                            )}
                                                            <h3 className="text-lg font-bold text-foreground group-hover:text-purple-300 transition-colors leading-tight">
                                                                {name}
                                                            </h3>
                                                            
                                                            {/* Description with Line Clamp and 150 char ellipsis rule */}
                                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                                                                {truncatedDesc}
                                                            </p>
                                                        </div>

                                                        {/* Tech Stack Chips */}
                                                        {project.technologies?.length > 0 && (
                                                            <div className="flex flex-wrap gap-1.5 pt-1">
                                                                {project.technologies.slice(0, 4).map(tech => (
                                                                    <TechBadge key={tech.id} tech={tech} />
                                                                ))}
                                                                {project.technologies.length > 4 && (
                                                                    <span className="px-2 py-0.5 rounded-md bg-secondary border border-border text-[10px] text-muted-foreground font-mono">
                                                                        +{project.technologies.length - 4}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* Card Bottom Links & Action */}
                                                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/60">
                                                            <div className="flex items-center gap-3">
                                                                {project.demo_url && (
                                                                    <a
                                                                        href={project.demo_url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-cyan-400 transition-colors"
                                                                        onClick={e => e.stopPropagation()}
                                                                    >
                                                                        <ExternalLink className="w-3.5 h-3.5" /> {t('projects.liveDemo', 'Buka Aplikasi')}
                                                                    </a>
                                                                )}
                                                                {project.repo_url && (
                                                                    <a
                                                                        href={project.repo_url}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                                                        onClick={e => e.stopPropagation()}
                                                                    >
                                                                        <Github className="w-3.5 h-3.5" /> {t('projects.sourceCode', 'Source Code')}
                                                                    </a>
                                                                )}
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => setSelectedProject(project)}
                                                                className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-cyan-400 transition-colors"
                                                            >
                                                                {t('projects.details', 'Spesifikasi')} <ArrowUpRight className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ════════ PAGINATION BAR (with Items-Per-Page Dropdown) ════════ */}
                            <div className="p-4 rounded-2xl border border-border/80 bg-card/90 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
                                
                                {/* Items Per Page Select Dropdown */}
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{t('projects.displayLabel', 'Tampilkan:')}</span>
                                    <div className="relative">
                                        <select
                                            value={pageSize}
                                            onChange={(e) => {
                                                setPageSize(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="px-3 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer"
                                        >
                                            {PAGE_SIZE_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>
                                                    {opt} {t('projects.pageCountSuffix', 'data')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <span className="hidden md:inline">
                                        ({filteredProjects.length} {t('projects.totalLabel', 'total proyek')})
                                    </span>
                                </div>

                                {/* Numbered Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={safeCurrentPage === 1}
                                            className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                            aria-label="Previous Page"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

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
                                            return (
                                                <button
                                                    key={num}
                                                    type="button"
                                                    onClick={() => setCurrentPage(num)}
                                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                                                        num === safeCurrentPage
                                                            ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-md shadow-purple-600/30'
                                                            : 'border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-secondary'
                                                    }`}
                                                >
                                                    {num}
                                                </button>
                                            );
                                        })}

                                        <button
                                            type="button"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={safeCurrentPage === totalPages}
                                            className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                            aria-label="Next Page"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}

                                {/* Page Indicator */}
                                <div className="text-xs text-muted-foreground font-mono">
                                    Halaman <span className="text-foreground font-bold">{safeCurrentPage}</span> dari <span className="text-foreground font-bold">{totalPages}</span>
                                </div>
                            </div>
                        </>
                    )}

                </div>
                </div>
            </div>

            {/* ── Detail Modal Popup ── */}
            {selectedProject && (
                <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
        </section>
    );
}
