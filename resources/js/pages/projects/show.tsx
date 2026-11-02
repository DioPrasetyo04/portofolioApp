import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Sparkles,
    Layers,
} from 'lucide-react';
import React from 'react';
import AsteroidBackground from '@/components/portfolio/3d/AsteroidBackground';
import ProjectHologram from '@/components/portfolio/3d/ProjectHologram';
import Footer from '@/components/portfolio/Footer';
import Navbar from '@/components/portfolio/Navbar';
import ImageCarousel from '@/components/portfolio/ui/ImageCarousel';
import InteractionSection from '@/components/portfolio/ui/InteractionSection';
import SocialShare from '@/components/portfolio/ui/SocialShare';
import { getTranslated } from '@/lib/i18n-helper';

interface ProjectProps {
    project: any;
}

export default function ProjectShow({ project }: ProjectProps) {
    const title = getTranslated(project.name, 'Project Detail');
    const description = getTranslated(
        project.description,
        '<p>No description available.</p>',
    );

    return (
        <>
            <AsteroidBackground />
            <Head title={title} />

            <div className="flex min-h-screen flex-col bg-transparent text-foreground">
                <Navbar />

                <main className="relative flex-1 overflow-hidden pt-32 pb-24">
                    {/* Background effects */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />

                    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Home</span>
                            </Link>
                        </div>

                        <div className="mb-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                            {/* Text Content */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-400 uppercase">
                                            {project.category ||
                                                'Featured Project'}
                                        </span>
                                        {project.year && (
                                            <span className="font-mono text-sm text-muted-foreground">
                                                {project.year}
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                        {title}
                                    </h1>

                                    <div
                                        className="prose text-lg leading-relaxed text-muted-foreground prose-invert prose-code:rounded-md prose-code:bg-purple-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-purple-400 prose-pre:border prose-pre:border-border prose-pre:bg-neutral-950"
                                        dangerouslySetInnerHTML={{
                                            __html: description,
                                        }}
                                    />
                                </div>

                                <div className="flex flex-wrap items-center gap-4">
                                    {project.demo_url && (
                                        <a
                                            href={project.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 font-semibold text-background shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all hover:bg-muted hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            <span>Live Demo</span>
                                        </a>
                                    )}
                                    {project.repo_url && (
                                        <a
                                            href={project.repo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-6 py-3 font-semibold text-foreground transition-all hover:border-cyan-500/50 hover:bg-card"
                                        >
                                            <Github className="h-4 w-4" />
                                            <span>Source Code</span>
                                        </a>
                                    )}
                                </div>

                                <SocialShare
                                    url={
                                        typeof window !== 'undefined'
                                            ? window.location.href
                                            : ''
                                    }
                                    title={title}
                                />
                            </div>

                            {/* 3D Visualization */}
                            <div className="glow-card relative flex h-[400px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-card/30 p-4 backdrop-blur-sm sm:h-[500px] lg:h-[600px]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]" />
                                {project.image ? (
                                    <img
                                        src={`/storage/${project.image}`}
                                        alt={title}
                                        loading="lazy"
                                        decoding="async"
                                        className="absolute inset-0 z-0 h-full w-full rounded-2xl object-cover opacity-20"
                                    />
                                ) : null}
                                <div className="relative z-10 h-full w-full">
                                    <ProjectHologram />
                                </div>
                            </div>
                        </div>

                        {/* Technologies & Highlights */}
                        <div className="grid grid-cols-1 gap-8 border-t border-border pt-16 md:grid-cols-2">
                            {/* Tech Stack */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Layers className="h-6 w-6 text-cyan-400" />
                                    <h3 className="text-2xl font-bold text-foreground">
                                        Technologies Used
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies &&
                                        project.technologies.map(
                                            (tech: any) => (
                                                <div
                                                    key={tech.id}
                                                    className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2"
                                                >
                                                    {tech.icon_svg && (
                                                        <div
                                                            className="h-4 w-4"
                                                            dangerouslySetInnerHTML={{
                                                                __html: tech.icon_svg,
                                                            }}
                                                        />
                                                    )}
                                                    <span className="text-sm font-medium">
                                                        {tech.name}
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    {(!project.technologies ||
                                        project.technologies.length === 0) && (
                                        <p className="text-sm text-muted-foreground">
                                            No technologies listed.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Key Features */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="h-6 w-6 text-purple-400" />
                                    <h3 className="text-2xl font-bold text-foreground">
                                        Key Highlights
                                    </h3>
                                </div>
                                {project.highlights &&
                                project.highlights.length > 0 ? (
                                    <ul className="space-y-3">
                                        {project.highlights.map(
                                            (
                                                highlight: string,
                                                index: number,
                                            ) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-3 rounded-xl border border-border bg-card/50 p-4"
                                                >
                                                    <span className="mt-0.5 font-bold text-purple-400">
                                                        •
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {highlight}
                                                    </span>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        No highlights available.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Image Carousel */}
                        {project.gallery && project.gallery.length > 0 && (
                            <div className="mt-16 border-t border-border pt-16">
                                <div className="mb-8 flex items-center gap-3">
                                    <h3 className="text-2xl font-bold text-foreground">
                                        Project Gallery
                                    </h3>
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
