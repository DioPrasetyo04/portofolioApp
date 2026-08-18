import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink, Github, Sparkles, Code2, Search, X,
    ChevronLeft, ChevronRight, Star, Filter, Check,
    Calendar, Tag, Zap, Globe, ArrowUpRight, Eye,
    ChevronDown, CheckSquare, Square, Layers,
} from 'lucide-react';
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
    web: '🌐 Web App', mobile: '📱 Mobile', api: '⚡ API / Backend',
    fullstack: '🔧 Fullstack', '3d': '✨ 3D / Creative',
    tool: '🛠️ Dev Tool', other: '🔹 Other',
};
const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    completed:   { label: 'Completed',   color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    in_progress: { label: 'In Progress', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    archived:    { label: 'Archived',    color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30' },
};
const PAGE_SIZE_OPTIONS = [6, 9, 12];

/* ─── Tech badge chip ────────────────────────────────────── */
function TechBadge({ tech, size = 'sm' }: { tech: Technology; size?: 'sm' | 'md' }) {
    return (
        <span
            key={tech.id}
            className={`inline-flex items-center gap-1 rounded-md bg-secondary border border-border/80 font-mono text-muted-foreground hover:border-purple-500/50 hover:text-purple-300 transition-colors cursor-default ${
                size === 'md' ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
            }`}
        >
            {tech.icon_url ? (
                <img src={tech.icon_url} alt={tech.name} className="w-3 h-3 object-contain" />
            ) : (
                <Code2 className="w-2.5 h-2.5 opacity-60" />
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
                    className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    onClick={onClose}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                />

                {/* Modal Panel */}
                <motion.div
                    className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl shadow-black/40"
                    initial={{ opacity: 0, scale: 0.93, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                    {/* Header image */}
                    <div className="relative h-56 sm:h-64 bg-gradient-to-br from-purple-900/40 via-slate-900/50 to-cyan-900/30 overflow-hidden flex-shrink-0">
                        {activeImg ? (
                            <img src={activeImg} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Code2 className="w-16 h-16 text-purple-400/40" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Badges over image */}
                        <div className="absolute top-4 left-4 flex items-center gap-2 flex-wrap">
                            {project.is_featured && (
                                <span className="px-2.5 py-1 rounded-full bg-amber-500 text-black font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Featured
                                </span>
                            )}
                            <span className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold ${status.color}`}>
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
                                    className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                                        activeImg === url ? 'border-purple-500' : 'border-border hover:border-border/80'
                                    }`}
                                >
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-extrabold text-foreground leading-tight">{name}</h2>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    {project.category && (
                                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                                            <Tag className="w-3 h-3" />
                                            {CATEGORY_LABELS[project.category] ?? project.category}
                                        </span>
                                    )}
                                    {project.year && (
                                        <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {project.year}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {project.demo_url && (
                                    <a href={project.demo_url} target="_blank" rel="noreferrer"
                                       className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-opacity">
                                        <Globe className="w-3.5 h-3.5" /> Live Demo
                                    </a>
                                )}
                                {project.repo_url && (
                                    <a href={project.repo_url} target="_blank" rel="noreferrer"
                                       className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card/80 text-foreground text-xs font-semibold hover:bg-secondary transition-colors">
                                        <Github className="w-3.5 h-3.5" /> Source
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                        )}

                        {/* Highlights */}
                        {(project.highlights ?? []).length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                                    <Zap className="w-3.5 h-3.5 text-amber-400" /> Key Highlights
                                </h3>
                                <ul className="space-y-2">
                                    {project.highlights!.map((h, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                                            {h.item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Technologies */}
                        {project.technologies?.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                                    <Layers className="w-3.5 h-3.5 text-cyan-400" /> Tech Stack
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

/* ─── Filter Dropdown ────────────────────────────────────── */
function FilterDropdown({
    label, icon, options, selected, onToggle,
}: {
    label: string; icon: React.ReactNode;
    options: { value: string; label: string }[];
    selected: string[]; onToggle: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fn = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                    selected.length > 0
                        ? 'border-purple-500/60 bg-purple-500/10 text-purple-400'
                        : 'border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
            >
                {icon}
                {label}
                {selected.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {selected.length}
                    </span>
                )}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-2 left-0 z-50 w-52 rounded-xl border border-border bg-card shadow-xl backdrop-blur-xl p-1.5 space-y-0.5"
                    >
                        {options.map(opt => {
                            const isChecked = selected.includes(opt.value);
                            return (
                                <button
                                    key={opt.value}
                                    onClick={() => onToggle(opt.value)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                                        isChecked
                                            ? 'bg-purple-500/10 text-purple-300 font-semibold'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                    }`}
                                >
                                    {isChecked
                                        ? <CheckSquare className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                                        : <Square className="w-3.5 h-3.5 opacity-40 flex-shrink-0" />
                                    }
                                    {opt.label}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ─── Main Section ────────────────────────────────────────── */
export default function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
    const { t } = useTranslation();

    /* ── State ── */
    const [search, setSearch]           = useState('');
    const [selCategories, setSelCategories] = useState<string[]>([]);
    const [selStatuses, setSelStatuses] = useState<string[]>([]);
    const [featuredOnly, setFeaturedOnly] = useState(false);
    const [pageSize, setPageSize]       = useState(6);
    const [page, setPage]               = useState(1);
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

    if (!projects || projects.length === 0) return null;

    /* ── Sorted by priority ── */
    const sorted = useMemo(() =>
        [...projects].sort((a, b) => {
            if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
            return (a.priority_order ?? 99) - (b.priority_order ?? 99);
        }),
    [projects]);

    /* ── Build filter option lists ── */
    const categoryOptions = useMemo(() => {
        const cats = [...new Set(sorted.map(p => p.category).filter(Boolean))] as string[];
        return cats.map(c => ({ value: c, label: CATEGORY_LABELS[c] ?? c }));
    }, [sorted]);

    const statusOptions = [
        { value: 'completed',   label: '✅ Completed'   },
        { value: 'in_progress', label: '🔄 In Progress' },
        { value: 'archived',    label: '📦 Archived'    },
    ];

    /* ── Filter + search ── */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return sorted.filter(p => {
            const name = getTranslated(p.name, '').toLowerCase();
            const desc = getTranslated(p.description, '').toLowerCase();
            const techs = p.technologies?.map(t => t.name.toLowerCase()).join(' ') ?? '';
            if (q && !name.includes(q) && !desc.includes(q) && !techs.includes(q)) return false;
            if (featuredOnly && !p.is_featured) return false;
            if (selCategories.length > 0 && !selCategories.includes(p.category ?? '')) return false;
            if (selStatuses.length > 0 && !selStatuses.includes(p.status ?? 'completed')) return false;
            return true;
        });
    }, [sorted, search, featuredOnly, selCategories, selStatuses]);

    /* ── Pagination ── */
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    /* Reset page on filter change */
    const resetPage = () => setPage(1);

    const toggleCategory = (v: string) => {
        setSelCategories(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
        resetPage();
    };
    const toggleStatus = (v: string) => {
        setSelStatuses(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
        resetPage();
    };

    const hasActiveFilters = search || featuredOnly || selCategories.length > 0 || selStatuses.length > 0;

    return (
        <section id="projects" className="py-24 relative overflow-hidden bg-secondary/20">
            {/* Ambient glows */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ── Header ── */}
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('projects.title')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
                        {t('projects.subtitle')}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {filtered.length} project{filtered.length !== 1 ? 's' : ''} found
                        {hasActiveFilters ? ' (filtered)' : ''}
                    </p>
                </div>

                {/* ── Search + Filters bar ── */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    {/* Search input */}
                    <div className="relative flex-1 min-w-[200px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => { setSearch(e.target.value); resetPage(); }}
                            placeholder="Search projects, tech…"
                            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-card/60 backdrop-blur-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/50 transition-all"
                        />
                        {search && (
                            <button onClick={() => { setSearch(''); resetPage(); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    {/* Filter dropdowns */}
                    {categoryOptions.length > 0 && (
                        <FilterDropdown
                            label="Category" icon={<Tag className="w-3.5 h-3.5" />}
                            options={categoryOptions} selected={selCategories} onToggle={toggleCategory}
                        />
                    )}
                    <FilterDropdown
                        label="Status" icon={<Filter className="w-3.5 h-3.5" />}
                        options={statusOptions} selected={selStatuses} onToggle={toggleStatus}
                    />

                    {/* Featured toggle */}
                    <button
                        onClick={() => { setFeaturedOnly(f => !f); resetPage(); }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 ${
                            featuredOnly
                                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                                : 'border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                    >
                        <Star className="w-3.5 h-3.5" />
                        Featured Only
                    </button>

                    {/* Clear filters */}
                    {hasActiveFilters && (
                        <button
                            onClick={() => { setSearch(''); setSelCategories([]); setSelStatuses([]); setFeaturedOnly(false); resetPage(); }}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X className="w-3 h-3" /> Clear all
                        </button>
                    )}

                    {/* Spacer + page size selector */}
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-muted-foreground hidden sm:inline">Show:</span>
                        <div className="flex items-center gap-1">
                            {PAGE_SIZE_OPTIONS.map(n => (
                                <button key={n} onClick={() => { setPageSize(n); resetPage(); }}
                                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                                        pageSize === n
                                            ? 'bg-purple-500/20 border border-purple-500/50 text-purple-400'
                                            : 'border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                                >{n}</button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Project Grid ── */}
                <AnimatePresence mode="wait">
                    {paginated.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 text-center gap-4"
                        >
                            <div className="w-16 h-16 rounded-2xl border border-border bg-card/50 flex items-center justify-center">
                                <Search className="w-7 h-7 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">No projects found</p>
                                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`page-${currentPage}-${pageSize}-${search}-${featuredOnly}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {paginated.map((project, idx) => {
                                const name        = getTranslated(project.name, 'Project');
                                const description = getTranslated(project.description, '');
                                const status      = STATUS_CONFIG[project.status ?? 'completed'] ?? STATUS_CONFIG.completed;

                                return (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.07 }}
                                        className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-lg hover:shadow-xl hover:shadow-purple-900/20 hover:border-purple-500/30 transition-all duration-300"
                                    >
                                        {/* Cover image */}
                                        <div className="relative h-44 bg-gradient-to-br from-purple-900/30 via-slate-900/40 to-cyan-900/30 overflow-hidden flex-shrink-0">
                                            {project.image ? (
                                                <img
                                                    src={`/storage/${project.image}`}
                                                    alt={name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 h-full justify-center text-muted-foreground">
                                                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                                        <Code2 className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-xs font-mono">Interactive Build</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                                                {project.is_featured && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold text-[10px] uppercase">
                                                        <Star className="w-2.5 h-2.5" /> Featured
                                                    </span>
                                                )}
                                                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </div>

                                            {/* Year */}
                                            {project.year && (
                                                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur text-white/70 text-[10px] font-mono">
                                                    {project.year}
                                                </span>
                                            )}

                                            {/* View detail button (hover) */}
                                            <button
                                                onClick={() => setSelectedProject(project)}
                                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]"
                                            >
                                                <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/90 border border-border text-sm font-semibold text-foreground shadow-xl">
                                                    <Eye className="w-4 h-4 text-purple-400" /> View Details
                                                </span>
                                            </button>
                                        </div>

                                        {/* Card body */}
                                        <div className="p-5 flex-1 flex flex-col gap-3">
                                            <div className="space-y-1.5">
                                                {project.category && (
                                                    <span className="text-[10px] font-semibold text-purple-400/80 uppercase tracking-wider">
                                                        {CATEGORY_LABELS[project.category] ?? project.category}
                                                    </span>
                                                )}
                                                <h3 className="text-base font-bold text-foreground group-hover:text-purple-300 transition-colors leading-tight">
                                                    {name}
                                                </h3>
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {description}
                                                </p>
                                            </div>

                                            {/* Tech badges */}
                                            {project.technologies?.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {project.technologies.slice(0, 4).map(tech => (
                                                        <TechBadge key={tech.id} tech={tech} />
                                                    ))}
                                                    {project.technologies.length > 4 && (
                                                        <span className="px-2 py-0.5 rounded-md bg-secondary border border-border/80 text-[11px] text-muted-foreground font-mono">
                                                            +{project.technologies.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Footer */}
                                            <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
                                                <div className="flex items-center gap-3">
                                                    {project.demo_url && (
                                                        <a href={project.demo_url} target="_blank" rel="noreferrer"
                                                           className="flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-cyan-400 transition-colors"
                                                           onClick={e => e.stopPropagation()}>
                                                            <ExternalLink className="w-3.5 h-3.5" /> Demo
                                                        </a>
                                                    )}
                                                    {project.repo_url && (
                                                        <a href={project.repo_url} target="_blank" rel="noreferrer"
                                                           className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                                           onClick={e => e.stopPropagation()}>
                                                            <Github className="w-3.5 h-3.5" /> Source
                                                        </a>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => setSelectedProject(project)}
                                                    className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-purple-400 transition-colors"
                                                >
                                                    Details <ArrowUpRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-9 h-9 rounded-xl border border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`w-9 h-9 rounded-xl border text-xs font-semibold transition-all ${
                                    n === currentPage
                                        ? 'border-purple-500 bg-purple-500/20 text-purple-400 shadow-sm shadow-purple-500/20'
                                        : 'border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                                }`}
                            >
                                {n}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-9 h-9 rounded-xl border border-border bg-card/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>

                        <span className="text-xs text-muted-foreground ml-2">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Project Detail Modal ── */}
            {selectedProject && (
                <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            )}
        </section>
    );
}
