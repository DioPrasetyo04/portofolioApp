import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { ExternalLink, Github, Sparkles, Code2 } from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';

interface ProjectItem {
    id: number;
    name: any;
    description: any;
    image: string | null;
    demo_url: string | null;
    repo_url: string | null;
    is_featured: boolean;
    technologies: Array<{ id: number; name: string }>;
}

interface ProjectsSectionProps {
    projects: ProjectItem[];
}

export default function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
    const { t } = useTranslation();

    if (!projects || projects.length === 0) return null;

    return (
        <section id="projects" className="py-24 relative overflow-hidden bg-secondary/30">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('projects.title')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        {t('projects.subtitle')}
                    </h2>
                </div>

                {/* Swiper Carousel */}
                <Swiper
                    modules={[Pagination, Navigation, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                    }}
                    className="pb-16"
                >
                    {projects.map((project) => {
                        const name = getTranslated(project.name, 'Project');
                        const description = getTranslated(project.description, '');

                        return (
                            <SwiperSlide key={project.id} className="h-auto">
                                <div className="h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-lg glow-card group">
                                    {/* Cover Image or Fallback Header */}
                                    <div className="relative h-48 w-full bg-gradient-to-br from-purple-900/30 via-slate-900/40 to-cyan-900/30 overflow-hidden flex items-center justify-center">
                                        {project.image ? (
                                            <img
                                                src={`/storage/${project.image}`}
                                                alt={name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:scale-110 transition-transform duration-300">
                                                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                                                    <Code2 className="w-6 h-6" />
                                                </div>
                                                <span className="text-xs font-mono">Interactive Build</span>
                                            </div>
                                        )}

                                        {project.is_featured && (
                                            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500 text-black font-bold text-[10px] uppercase tracking-wider shadow-md">
                                                {t('projects.featured')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                                {name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                                {description}
                                            </p>
                                        </div>

                                        {/* Tech Stack Badges */}
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 pt-2">
                                                {project.technologies.map((tech) => (
                                                    <span
                                                        key={tech.id}
                                                        className="px-2 py-0.5 rounded-md bg-secondary text-[11px] font-mono text-muted-foreground border border-border/80"
                                                    >
                                                        {tech.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Links */}
                                        <div className="flex items-center gap-3 pt-3 border-t border-border/60">
                                            {project.demo_url && (
                                                <a
                                                    href={project.demo_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1.5 text-xs font-medium text-purple-400 hover:text-cyan-400 transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    <span>{t('projects.liveDemo')}</span>
                                                </a>
                                            )}

                                            {project.repo_url && (
                                                <a
                                                    href={project.repo_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                                                >
                                                    <Github className="w-3.5 h-3.5" />
                                                    <span>{t('projects.sourceCode')}</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}
