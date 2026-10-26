import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ExternalLink, Github, Sparkles, Layers } from 'lucide-react';
import Navbar from '@/components/portfolio/Navbar';
import Footer from '@/components/portfolio/Footer';
import ProjectHologram from '@/components/portfolio/3d/ProjectHologram';
import SocialShare from '@/components/portfolio/ui/SocialShare';
import ImageCarousel from '@/components/portfolio/ui/ImageCarousel';
import InteractionSection from '@/components/portfolio/ui/InteractionSection';
import AsteroidBackground from '@/components/portfolio/3d/AsteroidBackground';
import { getTranslated } from '@/lib/i18n-helper';

interface ProjectProps {
    project: any;
}

export default function ProjectShow({ project }: ProjectProps) {
    const { t } = useTranslation();
    const title = getTranslated(project.name, 'Project Detail');
    const description = getTranslated(project.description, '<p>No description available.</p>');

    return (
        <>
            <AsteroidBackground />
            <Head title={`${title} - Portfolio 3D`} />

            <div className="min-h-screen text-foreground flex flex-col bg-transparent">
                <Navbar />

                <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Home</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                            {/* Text Content */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
                                            {project.category || 'Featured Project'}
                                        </span>
                                        {project.year && (
                                            <span className="text-muted-foreground text-sm font-mono">
                                                {project.year}
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                                        {title}
                                    </h1>

                                    <div 
                                        className="text-lg text-muted-foreground leading-relaxed prose prose-invert prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-border prose-code:text-purple-400 prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    {project.demo_url && (
                                        <a
                                            href={project.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background hover:bg-muted font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            <span>Live Demo</span>
                                        </a>
                                    )}
                                    {project.repo_url && (
                                        <a
                                            href={project.repo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card/50 hover:bg-card text-foreground font-semibold transition-all hover:border-cyan-500/50"
                                        >
                                            <Github className="w-4 h-4" />
                                            <span>Source Code</span>
                                        </a>
                                    )}
                                </div>
                                
                                <SocialShare url={typeof window !== 'undefined' ? window.location.href : ''} title={title} />
                            </div>

                            {/* 3D Visualization */}
                            <div className="relative rounded-3xl overflow-hidden border border-border bg-card/30 backdrop-blur-sm p-4 h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center glow-card">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]" />
                                {project.image ? (
                                    <img src={`/storage/${project.image}`} alt={title} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-2xl opacity-20 absolute inset-0 z-0" />
                                ) : null}
                                <div className="relative z-10 w-full h-full">
                                    <ProjectHologram />
                                </div>
                            </div>
                        </div>

                        {/* Technologies & Highlights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-16">
                            {/* Tech Stack */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Layers className="w-6 h-6 text-cyan-400" />
                                    <h3 className="text-2xl font-bold text-foreground">Technologies Used</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies && project.technologies.map((tech: any) => (
                                        <div key={tech.id} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
                                            {tech.icon_svg && (
                                                <div className="w-4 h-4" dangerouslySetInnerHTML={{ __html: tech.icon_svg }} />
                                            )}
                                            <span className="text-sm font-medium">{tech.name}</span>
                                        </div>
                                    ))}
                                    {(!project.technologies || project.technologies.length === 0) && (
                                        <p className="text-muted-foreground text-sm">No technologies listed.</p>
                                    )}
                                </div>
                            </div>

                            {/* Key Features */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-purple-400" />
                                    <h3 className="text-2xl font-bold text-foreground">Key Highlights</h3>
                                </div>
                                {project.highlights && project.highlights.length > 0 ? (
                                    <ul className="space-y-3">
                                        {project.highlights.map((highlight: string, index: number) => (
                                            <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-card/50 border border-border">
                                                <span className="mt-0.5 text-purple-400 font-bold">•</span>
                                                <span className="text-muted-foreground">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-muted-foreground text-sm">No highlights available.</p>
                                )}
                            </div>
                        </div>
                        
                        {/* Image Carousel */}
                        {project.gallery && project.gallery.length > 0 && (
                            <div className="mt-16 border-t border-border pt-16">
                                <div className="flex items-center gap-3 mb-8">
                                    <h3 className="text-2xl font-bold text-foreground">Project Gallery</h3>
                                </div>
                                <ImageCarousel images={project.gallery} />
                            </div>
                        )}

                        {/* Interactions (Likes & Comments) */}
                        <InteractionSection 
                            type="project" 
                            id={project.id} 
                            initialLikes={project.likes_count || 0} 
                            initialComments={project.comments || []} 
                        />
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
