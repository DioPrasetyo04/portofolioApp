import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Award,
    Calendar,
    ExternalLink,
    ShieldCheck,
} from 'lucide-react';
import React from 'react';
import AsteroidBackground from '@/components/portfolio/3d/AsteroidBackground';
import CertificateSeal from '@/components/portfolio/3d/CertificateSeal';
import Footer from '@/components/portfolio/Footer';
import Navbar from '@/components/portfolio/Navbar';
import ImageCarousel from '@/components/portfolio/ui/ImageCarousel';
import InteractionSection from '@/components/portfolio/ui/InteractionSection';
import SocialShare from '@/components/portfolio/ui/SocialShare';
import { getTranslated } from '@/lib/i18n-helper';

interface CertificateProps {
    certificate: any;
}

export default function CertificateShow({ certificate }: CertificateProps) {
    const title = getTranslated(certificate.name, 'Certificate Detail');
    const description = getTranslated(
        certificate.description,
        'No description available.',
    );
    const detail = getTranslated(certificate.detail, '');

    return (
        <>
            <AsteroidBackground />
            <Head title={title} />

            <div className="flex min-h-screen flex-col bg-transparent text-foreground">
                <Navbar />

                <main className="relative flex-1 overflow-hidden pt-32 pb-24">
                    {/* Background effects */}
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-background to-background" />

                    <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to Home</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5">
                            {/* Text Content */}
                            <div className="order-2 space-y-8 lg:order-1 lg:col-span-3">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-amber-400">
                                            <Award className="h-3.5 w-3.5" />
                                            Professional Certification
                                        </span>
                                        {certificate.issued_at && (
                                            <div className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5" />
                                                <span>
                                                    {new Date(
                                                        certificate.issued_at,
                                                    ).toLocaleDateString(
                                                        undefined,
                                                        {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <h1 className="text-3xl leading-[1.2] font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                                        {title}
                                    </h1>

                                    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                                        {certificate.issuer_icon && (
                                            <img
                                                src={`/storage/${certificate.issuer_icon}`}
                                                alt={certificate.issuer}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-10 w-10 rounded bg-white object-contain p-1"
                                            />
                                        )}
                                        <div>
                                            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                Issued By
                                            </p>
                                            <p className="font-bold text-foreground">
                                                {certificate.issuer}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose max-w-none leading-relaxed text-muted-foreground prose-invert prose-code:rounded-md prose-code:bg-amber-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-amber-400 prose-pre:border prose-pre:border-border prose-pre:bg-neutral-950">
                                    <p className="text-lg">{description}</p>
                                    {detail && (
                                        <div
                                            className="mt-6"
                                            dangerouslySetInnerHTML={{
                                                __html: detail,
                                            }}
                                        />
                                    )}
                                </div>

                                {certificate.credential_id && (
                                    <div className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-4 text-sm text-muted-foreground">
                                        <ShieldCheck className="h-5 w-5 text-green-400" />
                                        <span>
                                            Credential ID:{' '}
                                            <strong className="ml-1 font-mono text-foreground">
                                                {certificate.credential_id}
                                            </strong>
                                        </span>
                                    </div>
                                )}

                                {certificate.url && (
                                    <div className="pt-4">
                                        <a
                                            href={certificate.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-6 py-3 font-bold text-black shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                                        >
                                            <span>Show Credential</span>
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                )}

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
                            <div className="order-1 lg:order-2 lg:col-span-2">
                                <div className="sticky top-32">
                                    <div className="relative flex h-[400px] items-center justify-center overflow-hidden rounded-3xl border border-border/50 bg-card/20 p-2 backdrop-blur-sm">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]" />
                                        <div className="relative z-10 h-full w-full">
                                            <CertificateSeal />
                                        </div>
                                    </div>
                                    {certificate.image && (
                                        <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-xl">
                                            <img
                                                src={`/storage/${certificate.image}`}
                                                alt={title}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-auto w-full"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Image Carousel */}
                        {certificate.gallery &&
                            certificate.gallery.length > 0 && (
                                <div className="mt-16 border-t border-border pt-16">
                                    <div className="mb-8 flex items-center gap-3">
                                        <h3 className="text-2xl font-bold text-foreground">
                                            Certificate Gallery
                                        </h3>
                                    </div>
                                    <ImageCarousel
                                        images={certificate.gallery}
                                    />
                                </div>
                            )}

                        {/* Interactions (Likes & Comments) */}
                        <InteractionSection
                            type="certificate"
                            id={certificate.id}
                            initialLikes={certificate.likes_count || 0}
                            initialComments={certificate.comments || []}
                        />
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
