import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/portfolio/Navbar';
import Footer from '@/components/portfolio/Footer';
import CertificateSeal from '@/components/portfolio/3d/CertificateSeal';
import SocialShare from '@/components/portfolio/ui/SocialShare';
import ImageCarousel from '@/components/portfolio/ui/ImageCarousel';
import InteractionSection from '@/components/portfolio/ui/InteractionSection';
import AsteroidBackground from '@/components/portfolio/3d/AsteroidBackground';
import { getTranslated } from '@/lib/i18n-helper';

interface CertificateProps {
    certificate: any;
}

export default function CertificateShow({ certificate }: CertificateProps) {
    const { t } = useTranslation();
    const title = getTranslated(certificate.name, 'Certificate Detail');
    const description = getTranslated(certificate.description, 'No description available.');
    const detail = getTranslated(certificate.detail, '');

    return (
        <>
            <AsteroidBackground />
            <Head title={title} />

            <div className="min-h-screen text-foreground flex flex-col bg-transparent">
                <Navbar />

                <main className="flex-1 pt-32 pb-24 relative overflow-hidden">
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-background to-background pointer-events-none" />

                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back to Home</span>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                            {/* Text Content */}
                            <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide">
                                            <Award className="w-3.5 h-3.5" />
                                            Professional Certification
                                        </span>
                                        {certificate.issued_at && (
                                            <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-mono">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{new Date(certificate.issued_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            </div>
                                        )}
                                    </div>

                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                                        {title}
                                    </h1>
                                    
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                                        {certificate.issuer_icon && (
                                            <img src={`/storage/${certificate.issuer_icon}`} alt={certificate.issuer} loading="lazy" decoding="async" className="w-10 h-10 rounded bg-white object-contain p-1" />
                                        )}
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Issued By</p>
                                            <p className="text-foreground font-bold">{certificate.issuer}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-border prose-code:text-amber-400 prose-code:bg-amber-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md">
                                    <p className="text-lg">{description}</p>
                                    {detail && (
                                        <div className="mt-6" dangerouslySetInnerHTML={{ __html: detail }} />
                                    )}
                                </div>

                                {certificate.credential_id && (
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground bg-card/50 p-4 rounded-xl border border-border">
                                        <ShieldCheck className="w-5 h-5 text-green-400" />
                                        <span>Credential ID: <strong className="text-foreground font-mono ml-1">{certificate.credential_id}</strong></span>
                                    </div>
                                )}

                                {certificate.url && (
                                    <div className="pt-4">
                                        <a
                                            href={certificate.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                                        >
                                            <span>Show Credential</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                )}
                                
                                <SocialShare url={typeof window !== 'undefined' ? window.location.href : ''} title={title} />
                            </div>

                            {/* 3D Visualization */}
                            <div className="lg:col-span-2 order-1 lg:order-2">
                                <div className="sticky top-32">
                                    <div className="relative rounded-3xl overflow-hidden border border-border/50 bg-card/20 backdrop-blur-sm p-2 h-[400px] flex items-center justify-center">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]" />
                                        <div className="relative z-10 w-full h-full">
                                            <CertificateSeal />
                                        </div>
                                    </div>
                                    {certificate.image && (
                                        <div className="mt-6 rounded-2xl overflow-hidden border border-border shadow-xl">
                                            <img src={`/storage/${certificate.image}`} alt={title} loading="lazy" decoding="async" className="w-full h-auto" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Image Carousel */}
                        {certificate.gallery && certificate.gallery.length > 0 && (
                            <div className="mt-16 border-t border-border pt-16">
                                <div className="flex items-center gap-3 mb-8">
                                    <h3 className="text-2xl font-bold text-foreground">Certificate Gallery</h3>
                                </div>
                                <ImageCarousel images={certificate.gallery} />
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
