'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase,
    GraduationCap,
    Calendar,
    MapPin,
    Sparkles,
    Building2,
    Award,
    Layers,
    BookOpen,
    Users,
    Play,
    Image as ImageIcon,
    Video as VideoIcon,
    X,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    HardDrive,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTranslated } from '@/lib/i18n-helper';

type TimelineTab = 'all' | 'experience' | 'education';

export interface MediaItem {
    path: string;
    url: string;
    type: 'image' | 'video';
    extension?: string;
    size_kb?: number | null;
    width?: number | null;
    height?: number | null;
    thumbnail?: string | null;
    caption?: string | null;
}

export interface ExperienceItem {
    id: string | number;
    type: 'work' | 'education' | 'organization';
    role: any;
    company: any;
    location?: any;
    period: any;
    badge_type?: any;
    points?: string[] | any;
    skills?: string[] | any;
    icon?: 'briefcase' | 'graduation' | 'organization' | 'award' | 'book';
    accent_color?: string;
    media?: MediaItem[];
    optimized_media?: MediaItem[];
    priority_order?: number;
}

interface ExperienceEducationSectionProps {
    experiences?: ExperienceItem[];
}

// Fallback seed items if database is yet to be populated
const DEFAULT_EXPERIENCES: ExperienceItem[] = [
    {
        id: 'exp-indotech',
        type: 'work',
        role: {
            en: 'Internship Full-Stack Developer',
            id: 'Internship Full-Stack Developer',
            zh: '全栈开发实习生 (Internship Full-Stack)',
        },
        company: {
            en: 'PT. Indotech Energi Persada',
            id: 'PT. Indotech Energi Persada',
            zh: 'PT. Indotech Energi Persada',
        },
        location: {
            en: 'Jakarta, ID',
            id: 'Jakarta, ID',
            zh: '雅加达，印尼',
        },
        period: {
            en: 'Mar 2025 - Jun 2025',
            id: 'Mar 2025 - Jun 2025',
            zh: '2025年3月 - 2025年6月',
        },
        badge_type: {
            en: 'Industry Internship',
            id: 'Magang Industri',
            zh: '企业实习',
        },
        points: [
            'Developed and maintained web and mobile application features using Next.js, CSS, JavaScript, Flutter, and backend integration.',
            'Built CRUD functionalities and optimized database operations for internal enterprise applications.',
            'Collaborated with the engineering team to improve system functionality, code maintainability, and user experience.',
            'Participated in application testing, systematic debugging, and frontend/backend performance optimization.',
            'Contributed to software architecture documentation and deployment workflows.',
        ],
        skills: [
            'Next.js',
            'Flutter',
            'JavaScript',
            'CSS3',
            'Backend Integration',
            'CRUD',
            'REST API',
        ],
        icon: 'briefcase',
        accent_color: '#EF4444',
        optimized_media: [],
    },
    {
        id: 'exp-kemenkeu',
        type: 'work',
        role: {
            en: 'Internship (Information Systems)',
            id: 'Internship (Sistem Informasi & Data)',
            zh: '信息化系统实习生 (Information Systems)',
        },
        company: {
            en: 'Kementerian Keuangan Republik Indonesia',
            id: 'Kementerian Keuangan Republik Indonesia',
            zh: '印度尼西亚共和国财政部 (Kementerian Keuangan RI)',
        },
        location: {
            en: 'Jakarta, ID',
            id: 'Jakarta, ID',
            zh: '雅加达，印尼',
        },
        period: {
            en: 'Oct 2021 - Jan 2022',
            id: 'Okt 2021 - Jan 2022',
            zh: '2021年10月 - 2022年1月',
        },
        badge_type: {
            en: 'Government Internship',
            id: 'Magang Pemerintahan',
            zh: '政府机构实习',
        },
        points: [
            'Assisted in information systems operations and administrative digital workflow processes.',
            'Supported enterprise data management, technical documentation, and digital record archives.',
            'Participated in internal system operational workflows and digital archiving modernization initiatives.',
            'Collaborated with ministry staff members to support daily operational and technical governance activities.',
            'Gained practical experience in institutional organizational workflows, security standards, and cross-team collaboration.',
        ],
        skills: [
            'Information Systems',
            'Data Management',
            'Digital Archiving',
            'Governance',
            'Technical Support',
        ],
        icon: 'briefcase',
        accent_color: '#3B82F6',
        optimized_media: [],
    },
    {
        id: 'exp-hmtif',
        type: 'organization',
        role: {
            en: 'Head of Student Welfare Division III',
            id: 'Kepala Divisi Kesejahteraan Mahasiswa III',
            zh: '第三学生福利部负责人 (Head of Student Welfare)',
        },
        company: {
            en: 'Informatics Engineering Association Faculty of Engineering Pancasila University',
            id: 'Himpunan Mahasiswa Teknik Informatika Fakultas Teknik Universitas Pancasila',
            zh: '潘查希拉大学工程学院计算机工程学生会 (HMTIF FT-UP)',
        },
        location: {
            en: 'Jakarta, ID',
            id: 'Jakarta, ID',
            zh: '雅加达，印尼',
        },
        period: {
            en: 'Nov 2023 - Apr 2024',
            id: 'Nov 2023 - Apr 2024',
            zh: '2023年11月 - 2024年4月',
        },
        badge_type: {
            en: 'Organizational Leadership',
            id: 'Kepemimpinan Organisasi',
            zh: '学生会核心领导',
        },
        points: [
            'Led and coordinated student welfare advocacy programs and academic support for Informatics Engineering students.',
            'Facilitated transparent communication channels and mediation between student representatives and faculty leadership.',
            'Organized peer coding tutorials, technology seminars, and developer community study groups.',
            'Supervised divisional team members, task allocation, and budgeting for student support initiatives.',
        ],
        skills: [
            'Leadership',
            'Community Management',
            'Event Organization',
            'Problem Solving',
            'Public Speaking',
        ],
        icon: 'organization',
        accent_color: '#8B5CF6',
        optimized_media: [],
    },
    {
        id: 'edu-up',
        type: 'education',
        role: {
            en: 'Bachelor of Computer Science / Informatics Engineering (S.Kom)',
            id: 'S1 Teknik Informatika (Sarjana Komputer - S.Kom)',
            zh: '计算机工程学士 (S.Kom / B.S. in Computer Science)',
        },
        company: {
            en: 'Universitas Pancasila',
            id: 'Universitas Pancasila',
            zh: '潘查希拉大学 (Universitas Pancasila)',
        },
        location: {
            en: 'Jakarta, ID',
            id: 'Jakarta, ID',
            zh: '雅加达，印尼',
        },
        period: {
            en: '2021 - 2025',
            id: '2021 - 2025',
            zh: '2021 - 2025',
        },
        badge_type: {
            en: 'Undergraduate Degree',
            id: 'Gelar Sarjana',
            zh: '全日制本科学士',
        },
        points: [
            'Specialized in Software Engineering, Modern Web & Mobile Systems, and Relational Database Architectures.',
            'Academic focus: High-performance Laravel backends, reactive React/TypeScript SPAs, and real-time 3D WebGL graphics.',
            'Active contributor to campus developer chapters, peer tutoring, and academic research activities.',
        ],
        skills: [
            'Informatics Engineering',
            'Software Architecture',
            'Database Systems',
            'Laravel & React',
            'Computer Graphics',
        ],
        icon: 'graduation',
        accent_color: '#EC4899',
        optimized_media: [],
    },
    {
        id: 'edu-bootcamp',
        type: 'education',
        role: {
            en: 'Professional Tech Academies & Certifications',
            id: 'Akademi Teknologi & Sertifikasi Industri',
            zh: '前沿技术学院与行业专业认证',
        },
        company: {
            en: 'Dicoding Indonesia, FreeCodeCamp & Coursera',
            id: 'Dicoding Indonesia, FreeCodeCamp & Coursera',
            zh: 'Dicoding Indonesia, FreeCodeCamp & Coursera',
        },
        location: {
            en: 'Online / Industry Credential',
            id: 'Daring / Kredensial Global',
            zh: '在线认证 / 全球认可',
        },
        period: {
            en: '2021 - 2024',
            id: '2021 - 2024',
            zh: '2021 - 2024',
        },
        badge_type: {
            en: 'Professional Certification',
            id: 'Sertifikasi Profesional',
            zh: '专业技术认证',
        },
        points: [
            'Graduated from verified learning paths in Full-Stack Web Development, Modern JavaScript, Flutter Mobile Apps, and SQL Database Systems.',
            'Passed rigorous code reviews and built production-grade capstone applications adhering to industry coding standards.',
        ],
        skills: [
            'Full-Stack Web',
            'Modern JavaScript',
            'Flutter & Dart',
            'SQL Query Optimization',
            'FreeCodeCamp',
            'Dicoding',
        ],
        icon: 'award',
        accent_color: '#F59E0B',
        optimized_media: [],
    },
    {
        id: 'edu-highschool',
        type: 'education',
        role: {
            en: 'Senior High School (Mathematics & Natural Sciences / MIPA)',
            id: 'Sekolah Menengah Atas (MIPA / IPA)',
            zh: '高级中学 (数理自然科学方向 / MIPA)',
        },
        company: {
            en: 'SMA / Secondary High School',
            id: 'SMA / Sekolah Menengah Atas',
            zh: '高级中学 (SMA)',
        },
        location: {
            en: 'Jakarta, ID',
            id: 'Jakarta, ID',
            zh: '雅加达，印尼',
        },
        period: {
            en: '2018 - 2021',
            id: '2018 - 2021',
            zh: '2018 - 2021',
        },
        badge_type: {
            en: 'High School Diploma',
            id: 'Ijazah SMA',
            zh: '高中毕业证书',
        },
        points: [
            'Focused on Mathematics and Natural Sciences, cultivating rigorous algorithmic logic, quantitative problem-solving, and analytical reasoning.',
        ],
        skills: [
            'Mathematics & Science',
            'Logical Reasoning',
            'Algorithmic Thinking',
            'Computing Basics',
        ],
        icon: 'book',
        accent_color: '#10B981',
        optimized_media: [],
    },
];

export default function ExperienceEducationSection({
    experiences,
}: ExperienceEducationSectionProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TimelineTab>('all');

    // Lightbox modal state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxItem, setLightboxItem] = useState<ExperienceItem | null>(
        null,
    );
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Merge backend database items with fallback defaults
    const items: ExperienceItem[] =
        experiences && experiences.length > 0
            ? experiences
            : DEFAULT_EXPERIENCES;

    const workAndOrgItems = items.filter(
        (item) => item.type === 'work' || item.type === 'organization',
    );
    const educationItems = items.filter((item) => item.type === 'education');

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen || !lightboxItem) {
                return;
            }

            const mediaList =
                lightboxItem.optimized_media || lightboxItem.media || [];

            if (e.key === 'Escape') {
                setLightboxOpen(false);
            } else if (e.key === 'ArrowRight') {
                setLightboxIndex((prev) => (prev + 1) % mediaList.length);
            } else if (e.key === 'ArrowLeft') {
                setLightboxIndex(
                    (prev) => (prev - 1 + mediaList.length) % mediaList.length,
                );
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen, lightboxItem]);

    const openLightbox = (item: ExperienceItem, initialIndex: number = 0) => {
        setLightboxItem(item);
        setLightboxIndex(initialIndex);
        setLightboxOpen(true);
    };

    const renderCard = (item: ExperienceItem, index: number) => {
        const role = getTranslated(item.role, 'Role');
        const company = getTranslated(item.company, 'Company');
        const location = getTranslated(item.location, 'Location');
        const period = getTranslated(item.period, 'Period');
        const badgeType = getTranslated(
            item.badge_type,
            item.type === 'education' ? 'Education' : 'Experience',
        );

        // Extract points array safely
        let points: string[] = [];

        if (Array.isArray(item.points)) {
            points = item.points.map((p) =>
                typeof p === 'object' && p !== null && 'item' in p
                    ? p.item
                    : String(p),
            );
        }

        // Extract media items
        const mediaList: MediaItem[] = item.optimized_media || item.media || [];
        const hasMedia = mediaList.length > 0;

        return (
            <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className="group relative pb-10 pl-8 last:pb-2 sm:pb-12 sm:pl-10"
            >
                {/* ── Vertical Timeline Connector Line ── */}
                <div
                    className="absolute top-6 bottom-0 left-[11px] w-[2px] bg-gradient-to-b from-red-500/60 via-purple-500/40 to-transparent group-last:hidden sm:left-[15px]"
                    aria-hidden="true"
                />

                {/* ── Glowing Timeline Node ── */}
                <div className="absolute top-1.5 left-0 flex items-center justify-center sm:left-1">
                    <span className="relative flex h-6 w-6 items-center justify-center sm:h-7 sm:w-7">
                        <span
                            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-35"
                            style={{
                                backgroundColor: item.accent_color || '#EF4444',
                            }}
                        />
                        <span
                            className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background shadow-md transition-transform duration-300 group-hover:scale-125 sm:h-4 sm:w-4"
                            style={{
                                backgroundColor: item.accent_color || '#EF4444',
                                boxShadow: `0 0 12px ${item.accent_color || '#EF4444'}`,
                            }}
                        />
                    </span>
                </div>

                {/* ── Timeline Card ── */}
                <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 hover:border-red-500/40 hover:shadow-2xl sm:rounded-3xl sm:p-7">
                    {/* Top ambient highlight gradient on hover */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    {/* Header Row: Badge & Period */}
                    <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                            <span
                                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase shadow-xs"
                                style={{
                                    backgroundColor: `${item.accent_color || '#EF4444'}15`,
                                    borderColor: `${item.accent_color || '#EF4444'}35`,
                                    color: item.accent_color || '#EF4444',
                                }}
                            >
                                {item.icon === 'briefcase' && (
                                    <Briefcase className="h-3 w-3" />
                                )}
                                {item.icon === 'graduation' && (
                                    <GraduationCap className="h-3 w-3" />
                                )}
                                {item.icon === 'organization' && (
                                    <Users className="h-3 w-3" />
                                )}
                                {item.icon === 'award' && (
                                    <Award className="h-3 w-3" />
                                )}
                                {item.icon === 'book' && (
                                    <BookOpen className="h-3 w-3" />
                                )}
                                <span>{badgeType}</span>
                            </span>
                        </div>

                        {/* Period Pill */}
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500 shadow-xs dark:text-red-400">
                            <Calendar className="h-3 w-3" />
                            <span>{period}</span>
                        </div>
                    </div>

                    {/* Role / Degree Title */}
                    <h3 className="mb-1.5 text-lg font-extrabold tracking-tight text-foreground transition-colors group-hover:text-red-500 sm:text-xl dark:group-hover:text-red-400">
                        {role}
                    </h3>

                    {/* Company / Institution with Location */}
                    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                        <span className="flex items-center gap-1.5 font-semibold text-foreground/90">
                            {item.type === 'education' ? (
                                <GraduationCap className="h-3.5 w-3.5 text-purple-500/80" />
                            ) : (
                                <Building2 className="h-3.5 w-3.5 text-red-500/80" />
                            )}
                            {company}
                        </span>
                        {location && (
                            <>
                                <span className="text-border">•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-cyan-400" />
                                    {location}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Bullet Points */}
                    {points.length > 0 && (
                        <div className="mb-5 space-y-2">
                            {points.map((pt, pIdx) => (
                                <div
                                    key={pIdx}
                                    className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground sm:text-sm"
                                >
                                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500/80" />
                                    <span>{pt}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ── Media Gallery Preview Strip (Optimized & Indexed) ── */}
                    {hasMedia && (
                        <div className="mb-5 border-t border-border/40 pt-3">
                            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                                <span className="flex items-center gap-1.5 font-semibold text-foreground/80">
                                    <ImageIcon className="h-3.5 w-3.5 text-amber-500" />
                                    Dokumentasi Visual ({mediaList.length} file)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => openLightbox(item, 0)}
                                    className="flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-red-500 hover:underline dark:text-red-400"
                                >
                                    <Maximize2 className="h-3 w-3" />
                                    Buka Galeri
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {mediaList.slice(0, 3).map((media, mIdx) => {
                                    const isVideo = media.type === 'video';
                                    const isLastAndMore =
                                        mIdx === 2 && mediaList.length > 3;
                                    const moreCount = mediaList.length - 2;

                                    return (
                                        <div
                                            key={media.path || mIdx}
                                            onClick={() =>
                                                openLightbox(item, mIdx)
                                            }
                                            className="group/media relative aspect-video cursor-pointer overflow-hidden rounded-xl border border-border/60 bg-secondary/50 transition-all duration-200 hover:border-red-500/60"
                                        >
                                            {isVideo ? (
                                                <div className="relative flex h-full w-full items-center justify-center bg-black/40">
                                                    <video
                                                        src={media.url}
                                                        preload="none"
                                                        className="h-full w-full object-cover opacity-75"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover/media:bg-black/10">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/90 text-white shadow-lg transition-transform group-hover/media:scale-110">
                                                            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                                                        </div>
                                                    </div>
                                                    <span className="absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                                                        Video
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="relative h-full w-full">
                                                    <img
                                                        src={media.url}
                                                        alt={`${role} preview`}
                                                        loading="lazy"
                                                        decoding="async"
                                                        fetchPriority="low"
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover/media:scale-105"
                                                    />
                                                </div>
                                            )}

                                            {/* +N More Overlay */}
                                            {isLastAndMore && (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 text-xs font-bold text-white backdrop-blur-[2px] transition-opacity group-hover/media:bg-black/65">
                                                    <span>+{moreCount}</span>
                                                    <span className="text-[10px] font-normal text-white/80">
                                                        Lainnya
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Skill / Tech Tags */}
                    {item.skills && item.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 border-t border-border/50 pt-3 sm:gap-2">
                            {item.skills.map((skill: string) => (
                                <span
                                    key={skill}
                                    className="rounded-lg border border-border/60 bg-secondary/80 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:text-xs"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    // Current media in Lightbox
    const activeMediaList = lightboxItem
        ? lightboxItem.optimized_media || lightboxItem.media || []
        : [];
    const currentMedia = activeMediaList[lightboxIndex] || null;

    return (
        <section
            id="experience"
            className="relative overflow-hidden bg-transparent py-14 select-none sm:py-20 md:py-28"
        >
            {/* ── Ambient Cosmic Background Glows ── */}
            <div className="pointer-events-none absolute top-1/4 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-red-500/10 blur-3xl dark:bg-red-600/10" />
            <div className="pointer-events-none absolute right-1/4 bottom-1/4 -z-10 h-[550px] w-[550px] rounded-full bg-purple-500/15 blur-3xl dark:bg-purple-900/15" />
            <div className="pointer-events-none absolute top-1/2 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <div className="mb-10 flex flex-col items-center space-y-4 text-center sm:mb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/15 px-3.5 py-1.5 text-xs font-bold tracking-wider text-red-600 uppercase shadow-xs dark:text-red-400"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{t('experience.badge')}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl leading-tight font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        {t('experience.title')}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                        className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base"
                    >
                        {t('experience.subtitle')}
                    </motion.p>

                    {/* ── Interactive View Tabs ── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 inline-flex gap-1 rounded-full border border-border/80 bg-card/90 p-1.5 shadow-md backdrop-blur-md"
                    >
                        <button
                            type="button"
                            onClick={() => setActiveTab('all')}
                            className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 sm:px-5 sm:text-sm ${
                                activeTab === 'all'
                                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/30'
                                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                            }`}
                        >
                            <Layers className="h-3.5 w-3.5" />
                            <span>{t('experience.tabAll')}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('experience')}
                            className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 sm:px-5 sm:text-sm ${
                                activeTab === 'experience'
                                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/30'
                                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                            }`}
                        >
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>{t('experience.tabExperience')}</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('education')}
                            className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 sm:px-5 sm:text-sm ${
                                activeTab === 'education'
                                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md shadow-red-500/30'
                                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                            }`}
                        >
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span>{t('experience.tabEducation')}</span>
                        </button>
                    </motion.div>
                </div>

                {/* ── Content Timelines ── */}
                <AnimatePresence mode="wait">
                    {/* Mode 1: ALL (Dual Column on Desktop) */}
                    {activeTab === 'all' && (
                        <motion.div
                            key="all-tab"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12"
                        >
                            {/* Column 1: Education Timeline */}
                            <div>
                                <div className="mb-6 flex items-center gap-2.5 border-b border-border/70 pb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-500 dark:text-purple-400">
                                        <GraduationCap className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                                        {t('experience.educationHeading')}
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    {educationItems.map((item, idx) =>
                                        renderCard(item, idx),
                                    )}
                                </div>
                            </div>

                            {/* Column 2: Professional Experience Timeline */}
                            <div>
                                <div className="mb-6 flex items-center gap-2.5 border-b border-border/70 pb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 text-red-500 dark:text-red-400">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                                        {t('experience.experienceHeading')}
                                    </h3>
                                </div>
                                <div className="space-y-1">
                                    {workAndOrgItems.map((item, idx) =>
                                        renderCard(item, idx),
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Mode 2: Professional Experience Only (Full Width) */}
                    {activeTab === 'experience' && (
                        <motion.div
                            key="exp-tab"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="mx-auto max-w-4xl"
                        >
                            <div className="mb-6 flex items-center gap-2.5 border-b border-border/70 pb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 text-red-500 dark:text-red-400">
                                    <Briefcase className="h-4 w-4" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                                    {t('experience.experienceHeading')}
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {workAndOrgItems.map((item, idx) =>
                                    renderCard(item, idx),
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Mode 3: Education Only (Full Width) */}
                    {activeTab === 'education' && (
                        <motion.div
                            key="edu-tab"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                            className="mx-auto max-w-4xl"
                        >
                            <div className="mb-6 flex items-center gap-2.5 border-b border-border/70 pb-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/15 text-purple-500 dark:text-purple-400">
                                    <GraduationCap className="h-4 w-4" />
                                </div>
                                <h3 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                                    {t('experience.educationHeading')}
                                </h3>
                            </div>
                            <div className="space-y-2">
                                {educationItems.map((item, idx) =>
                                    renderCard(item, idx),
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Media Lightbox Modal (Hardware Accelerated & Zero Lag) ── */}
            <AnimatePresence>
                {lightboxOpen && lightboxItem && currentMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md sm:p-6"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <div
                            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/95 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-border/60 bg-secondary/30 p-4 sm:p-5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/15 text-red-500">
                                        {currentMedia.type === 'video' ? (
                                            <VideoIcon className="h-4 w-4" />
                                        ) : (
                                            <ImageIcon className="h-4 w-4" />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground sm:text-base">
                                            {getTranslated(
                                                lightboxItem.role,
                                                'Role',
                                            )}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">
                                            {getTranslated(
                                                lightboxItem.company,
                                                'Company',
                                            )}{' '}
                                            • File {lightboxIndex + 1} dari{' '}
                                            {activeMediaList.length}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {currentMedia.size_kb && (
                                        <span className="hidden items-center gap-1 rounded-md border border-border/60 bg-secondary px-2.5 py-1 font-mono text-[11px] text-muted-foreground sm:inline-flex">
                                            <HardDrive className="h-3 w-3" />
                                            {currentMedia.size_kb} KB
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setLightboxOpen(false)}
                                        className="cursor-pointer rounded-xl p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                        aria-label="Close modal"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body / Media Canvas */}
                            <div className="relative flex min-h-[300px] flex-1 items-center justify-center overflow-hidden bg-black/60 p-2 sm:min-h-[450px] sm:p-4">
                                {currentMedia.type === 'video' ? (
                                    <video
                                        key={currentMedia.url}
                                        src={currentMedia.url}
                                        controls
                                        autoPlay
                                        playsInline
                                        preload="metadata"
                                        className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-2xl"
                                    />
                                ) : (
                                    <img
                                        key={currentMedia.url}
                                        src={currentMedia.url}
                                        alt="Documentation screenshot"
                                        className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-2xl select-none"
                                    />
                                )}

                                {/* Prev / Next Arrows */}
                                {activeMediaList.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLightboxIndex(
                                                    (prev) =>
                                                        (prev -
                                                            1 +
                                                            activeMediaList.length) %
                                                        activeMediaList.length,
                                                )
                                            }
                                            className="absolute top-1/2 left-3 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-black/60 p-2.5 text-white shadow-lg transition-all hover:scale-110 hover:bg-black/80 active:scale-95"
                                            aria-label="Previous media"
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setLightboxIndex(
                                                    (prev) =>
                                                        (prev + 1) %
                                                        activeMediaList.length,
                                                )
                                            }
                                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-black/60 p-2.5 text-white shadow-lg transition-all hover:scale-110 hover:bg-black/80 active:scale-95"
                                            aria-label="Next media"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Modal Footer Thumbnails Strip */}
                            {activeMediaList.length > 1 && (
                                <div className="flex items-center justify-center gap-2 overflow-x-auto border-t border-border/60 bg-secondary/20 p-3">
                                    {activeMediaList.map((media, tIdx) => (
                                        <button
                                            key={media.path || tIdx}
                                            type="button"
                                            onClick={() =>
                                                setLightboxIndex(tIdx)
                                            }
                                            className={`relative h-10 w-14 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 transition-all sm:h-11 sm:w-16 ${
                                                tIdx === lightboxIndex
                                                    ? 'scale-105 border-red-500 shadow-md shadow-red-500/30'
                                                    : 'border-border/60 opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            {media.type === 'video' ? (
                                                <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-white">
                                                    <Play className="h-3 w-3 fill-current" />
                                                </div>
                                            ) : (
                                                <img
                                                    src={media.url}
                                                    alt="thumb"
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
