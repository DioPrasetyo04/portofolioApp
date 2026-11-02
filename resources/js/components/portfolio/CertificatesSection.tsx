import { motion, AnimatePresence } from 'framer-motion';
import {
    Award,
    ExternalLink,
    Calendar,
    CheckCircle2,
    ArrowUpRight,
    X,
    ShieldCheck,
    BookOpen,
    Hash,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getTranslated } from '@/lib/i18n-helper';

interface CertificateItem {
    id: number;
    name: any;
    description: any;
    detail?: any;
    issuer: string | null;
    issuer_icon?: string | null;
    issued_at: string | null;
    credential_id?: string | null;
    image: string | null;
    gallery?: string[] | null;
    url: string | null;
}

interface CertificatesSectionProps {
    certificates: CertificateItem[];
}

export default function CertificatesSection({
    certificates = [],
}: CertificatesSectionProps) {
    const { t } = useTranslation();
    const [activeModalCert, setActiveModalCert] =
        useState<CertificateItem | null>(null);

    // ESC key listener for modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveModalCert(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!certificates || certificates.length === 0) {
        return null;
    }

    // Helper to get image URL
    const getImageUrl = (path: string | null | undefined): string | null => {
        if (!path) {
            return null;
        }

        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }

        return `/storage/${path}`;
    };

    return (
        <section
            id="certificates"
            className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-24 lg:py-28"
        >
            {/* Ambient Cosmic Background Glows */}
            <div className="pointer-events-none absolute top-1/3 left-1/3 -z-10 h-[600px] w-[600px] rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/15" />
            <div className="pointer-events-none absolute right-1/4 bottom-10 -z-10 h-[550px] w-[550px] rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/15" />
            <div className="pointer-events-none absolute top-10 right-10 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-500/10" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <div className="mb-8 flex flex-col items-center justify-between gap-6 sm:mb-12 md:flex-row">
                    <div className="max-w-2xl space-y-3 text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3.5 py-1.5 text-xs font-bold text-amber-700 shadow-sm dark:font-semibold dark:text-amber-400"
                        >
                            <Award className="h-3.5 w-3.5" />
                            <span>{t('certificates.title')}</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                        >
                            {t('certificates.subtitle')}
                        </motion.h2>
                        <p className="max-w-xl text-sm text-muted-foreground">
                            Sertifikasi dan akreditasi resmi berstandar industri
                            yang memvalidasi keahlian teknis, arsitektur sistem,
                            dan standar rekayasa tingkat lanjut.
                        </p>
                    </div>

                    {/* Navigation Buttons for Carousel */}
                    <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
                        <button
                            type="button"
                            className="cert-swiper-prev cursor-pointer rounded-2xl border border-border/80 bg-card/80 p-3 text-foreground shadow-sm transition-all hover:bg-secondary hover:text-amber-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Previous Certificate"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            className="cert-swiper-next cursor-pointer rounded-2xl border border-border/80 bg-card/80 p-3 text-foreground shadow-sm transition-all hover:bg-secondary hover:text-amber-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label="Next Certificate"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* ── Swiper Carousel of Certificate Cards ── */}
                <Swiper
                    modules={[Pagination, Autoplay, Navigation]}
                    spaceBetween={24}
                    slidesPerView={1}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    navigation={{
                        prevEl: '.cert-swiper-prev',
                        nextEl: '.cert-swiper-next',
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                    }}
                    className="cert-swiper !px-1.5 !py-2 !pb-14"
                >
                    {certificates.map((cert, idx) => {
                        const name = getTranslated(cert.name, 'Certificate');
                        const description = getTranslated(cert.description, '');
                        const certImage = getImageUrl(cert.image);
                        const issuerIcon = getImageUrl(cert.issuer_icon);

                        return (
                            <SwiperSlide
                                key={cert.id}
                                className="flex h-auto px-1 pt-1 pb-4"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.4,
                                        delay: idx * 0.05,
                                    }}
                                    onClick={() => setActiveModalCert(cert)}
                                    className="group relative flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10"
                                >
                                    {/* Top Border Glow Highlight */}
                                    <div className="absolute top-0 right-0 left-0 z-10 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-purple-500 opacity-60 transition-opacity group-hover:opacity-100" />

                                    {/* Certificate Cover Image */}
                                    {certImage ? (
                                        <div className="relative h-44 w-full flex-shrink-0 overflow-hidden border-b border-border/60 bg-secondary/80">
                                            <img
                                                src={certImage}
                                                alt={name}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3.5">
                                                {cert.credential_id && (
                                                    <span className="flex items-center gap-1 rounded-md border border-amber-500/20 bg-black/70 px-2 py-0.5 font-mono text-[10px] text-amber-300/90">
                                                        <ShieldCheck className="h-3 w-3 text-amber-400" />
                                                        {cert.credential_id}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative flex h-24 w-full flex-shrink-0 items-center justify-center border-b border-border/60 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-cyan-500/10">
                                            <Award className="h-10 w-10 text-amber-400/60" />
                                        </div>
                                    )}

                                    {/* Card Body */}
                                    <div className="flex flex-1 flex-col justify-between gap-4 p-6">
                                        <div className="space-y-3">
                                            {/* Header: Issuer Logo / Icon & Badge */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    {issuerIcon ? (
                                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-border/80 bg-secondary p-1.5 shadow-inner transition-colors group-hover:border-amber-500/40">
                                                            <img
                                                                src={issuerIcon}
                                                                alt={
                                                                    cert.issuer ||
                                                                    'Issuer'
                                                                }
                                                                loading="lazy"
                                                                decoding="async"
                                                                className="h-full w-full object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-400">
                                                            <Award className="h-4 w-4" />
                                                        </div>
                                                    )}
                                                    {cert.issuer && (
                                                        <span className="max-w-[170px] truncate text-xs font-semibold text-foreground transition-colors group-hover:text-amber-300">
                                                            {cert.issuer}
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="flex flex-shrink-0 items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Verified
                                                </span>
                                            </div>

                                            {/* Title & Short Description with Line Clamp */}
                                            <div className="space-y-1.5">
                                                <h3 className="line-clamp-2 text-base leading-snug font-bold text-foreground transition-colors group-hover:text-amber-300">
                                                    {name}
                                                </h3>
                                                {description && (
                                                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                                        {description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Footer: Issue Date & Detail Certificate Button */}
                                        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3.5">
                                            {cert.issued_at && (
                                                <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5 text-purple-400" />
                                                    <span>
                                                        {new Date(
                                                            cert.issued_at,
                                                        ).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                year: 'numeric',
                                                                month: 'short',
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveModalCert(cert);
                                                }}
                                                className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm transition-all duration-200 group-hover:border-amber-400 hover:bg-amber-500/25 hover:text-amber-900 active:scale-95 dark:text-amber-300 dark:hover:text-white"
                                            >
                                                <span>Detail Certificate</span>
                                                <ArrowUpRight className="h-3.5 w-3.5 text-amber-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-amber-400" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>

            {/* ════════ CERTIFICATE DETAIL POPUP MODAL HANDLER (ON CLICK) ════════ */}
            <AnimatePresence>
                {activeModalCert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModalCert(null)}
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
                            className="relative z-10 my-8 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl shadow-amber-950/30"
                        >
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setActiveModalCert(null)}
                                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-md transition-all hover:bg-black/80 active:scale-90"
                                title="Tutup Modal"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Modal Header: Certificate Image & Gallery Carousel */}
                            {(() => {
                                const images: string[] = [];

                                if (activeModalCert.image) {
                                    images.push(
                                        getImageUrl(activeModalCert.image)!,
                                    );
                                }

                                if (
                                    activeModalCert.gallery &&
                                    Array.isArray(activeModalCert.gallery)
                                ) {
                                    activeModalCert.gallery.forEach((g) => {
                                        const url = getImageUrl(g);

                                        if (url && !images.includes(url)) {
                                            images.push(url);
                                        }
                                    });
                                }

                                if (images.length === 0) {
                                    return null;
                                }

                                return (
                                    <div className="relative h-56 w-full flex-shrink-0 border-b border-border bg-secondary/80 sm:h-64">
                                        {images.length > 1 ? (
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
                                                {images.map((imgUrl, iIdx) => (
                                                    <SwiperSlide
                                                        key={iIdx}
                                                        className="relative h-full w-full"
                                                    >
                                                        <img
                                                            src={imgUrl}
                                                            alt={getTranslated(
                                                                activeModalCert.name,
                                                                'Certificate',
                                                            )}
                                                            loading="lazy"
                                                            decoding="async"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        ) : (
                                            <img
                                                src={images[0]}
                                                alt={getTranslated(
                                                    activeModalCert.name,
                                                    'Certificate',
                                                )}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Modal Scrollable Content */}
                            <div className="flex-1 space-y-6 overflow-y-auto p-6 sm:p-8">
                                {/* Header Info */}
                                <div className="space-y-3 border-b border-border/60 pb-5">
                                    <div className="flex items-center gap-3">
                                        {activeModalCert.issuer_icon ? (
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-border bg-secondary p-2 shadow-inner">
                                                <img
                                                    src={getImageUrl(
                                                        activeModalCert.issuer_icon,
                                                    )!}
                                                    alt={
                                                        activeModalCert.issuer ||
                                                        'Issuer'
                                                    }
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-purple-500/20 text-amber-400">
                                                <Award className="h-5 w-5" />
                                            </div>
                                        )}
                                        <div>
                                            <span className="block text-xs font-semibold text-muted-foreground">
                                                {activeModalCert.issuer ||
                                                    'Official Accreditation'}
                                            </span>
                                            <h2 className="text-xl leading-tight font-extrabold text-foreground sm:text-2xl">
                                                {getTranslated(
                                                    activeModalCert.name,
                                                    'Certificate',
                                                )}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Badges Metadata */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {activeModalCert.issued_at && (
                                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground">
                                                <Calendar className="h-3.5 w-3.5 text-purple-400" />
                                                Diterbitkan:{' '}
                                                {new Date(
                                                    activeModalCert.issued_at,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        year: 'numeric',
                                                        month: 'long',
                                                    },
                                                )}
                                            </span>
                                        )}
                                        {activeModalCert.credential_id && (
                                            <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs text-amber-300">
                                                <Hash className="h-3.5 w-3.5" />
                                                ID:{' '}
                                                {activeModalCert.credential_id}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            Status Terverifikasi
                                        </span>
                                    </div>
                                </div>

                                {/* Rich Editor About / Detail Content Rendering */}
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                                        Tentang Sertifikat & Silabus Kompetensi
                                    </h4>

                                    {activeModalCert.detail ? (
                                        <div
                                            className="prose prose-sm max-w-none rounded-2xl border border-border/60 bg-secondary/30 p-4 text-xs leading-relaxed text-foreground sm:p-5 sm:text-sm dark:prose-invert"
                                            dangerouslySetInnerHTML={{
                                                __html: getTranslated(
                                                    activeModalCert.detail,
                                                    getTranslated(
                                                        activeModalCert.description,
                                                        '',
                                                    ),
                                                ),
                                            }}
                                        />
                                    ) : (
                                        <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
                                            <p className="text-xs leading-relaxed text-foreground sm:text-sm">
                                                {getTranslated(
                                                    activeModalCert.description,
                                                    'Tidak ada informasi detail tambahan.',
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer: External Verification Link & Close Button */}
                            <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-secondary/20 p-4 sm:px-8">
                                {activeModalCert.url ? (
                                    <a
                                        href={activeModalCert.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/20 transition-all hover:from-amber-600 hover:to-purple-700 active:scale-95"
                                    >
                                        <span>Buka Verifikasi Resmi</span>
                                        <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                ) : (
                                    <div />
                                )}

                                <button
                                    type="button"
                                    onClick={() => setActiveModalCert(null)}
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
