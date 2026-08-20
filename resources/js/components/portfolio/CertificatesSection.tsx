import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import {
    Award,
    ExternalLink,
    Calendar,
    CheckCircle2,
    Sparkles,
    ArrowUpRight,
    X,
    ShieldCheck,
    BookOpen,
    Image as ImageIcon,
    Hash,
    Building2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
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

export default function CertificatesSection({ certificates = [] }: CertificatesSectionProps) {
    const { t } = useTranslation();
    const [activeModalCert, setActiveModalCert] = useState<CertificateItem | null>(null);

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

    if (!certificates || certificates.length === 0) return null;

    // Helper to get image URL
    const getImageUrl = (path: string | null | undefined): string | null => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://')) return path;
        return `/storage/${path}`;
    };

    return (
        <section id="certificates" className="py-28 relative overflow-hidden bg-background">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* ── Section Header ── */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="text-center md:text-left space-y-3 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold shadow-sm"
                        >
                            <Award className="w-3.5 h-3.5" />
                            <span>{t('certificates.title')}</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
                        >
                            {t('certificates.subtitle')}
                        </motion.h2>
                        <p className="text-sm text-muted-foreground max-w-xl">
                            Sertifikasi dan akreditasi resmi berstandar industri yang memvalidasi keahlian teknis, arsitektur sistem, dan standar rekayasa tingkat lanjut.
                        </p>
                    </div>

                    {/* Navigation Buttons for Carousel */}
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        <button
                            type="button"
                            className="cert-swiper-prev p-3 rounded-2xl border border-border/80 bg-card/80 hover:bg-secondary text-foreground hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 cursor-pointer"
                            aria-label="Previous Certificate"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            className="cert-swiper-next p-3 rounded-2xl border border-border/80 bg-card/80 hover:bg-secondary text-foreground hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 cursor-pointer"
                            aria-label="Next Certificate"
                        >
                            <ChevronRight className="w-5 h-5" />
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
                    className="cert-swiper !py-2 !pb-14 !px-1.5"
                >
                    {certificates.map((cert, idx) => {
                        const name = getTranslated(cert.name, 'Certificate');
                        const description = getTranslated(cert.description, '');
                        const certImage = getImageUrl(cert.image);
                        const issuerIcon = getImageUrl(cert.issuer_icon);

                        return (
                            <SwiperSlide key={cert.id} className="h-auto pb-4 pt-1 px-1 flex">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                                    onClick={() => setActiveModalCert(cert)}
                                    className="group w-full h-full rounded-3xl border border-border/80 bg-card/60 backdrop-blur-2xl shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/40 flex flex-col justify-between overflow-hidden cursor-pointer transition-all duration-300 relative"
                                >
                                    {/* Top Border Glow Highlight */}
                                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity z-10" />

                                    {/* Certificate Cover Image */}
                                    {certImage ? (
                                        <div className="relative w-full h-44 bg-secondary/80 border-b border-border/60 overflow-hidden flex-shrink-0">
                                            <img
                                                src={certImage}
                                                alt={name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3.5">
                                                {cert.credential_id && (
                                                    <span className="text-[10px] font-mono text-amber-300/90 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm border border-amber-500/20">
                                                        <ShieldCheck className="w-3 h-3 text-amber-400" />
                                                        {cert.credential_id}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative w-full h-24 bg-gradient-to-br from-amber-500/10 via-purple-500/10 to-cyan-500/10 border-b border-border/60 flex items-center justify-center flex-shrink-0">
                                            <Award className="w-10 h-10 text-amber-400/60" />
                                        </div>
                                    )}

                                    {/* Card Body */}
                                    <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                                        <div className="space-y-3">
                                            {/* Header: Issuer Logo / Icon & Badge */}
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    {issuerIcon ? (
                                                        <div className="w-8 h-8 rounded-xl bg-secondary border border-border/80 flex items-center justify-center p-1.5 flex-shrink-0 shadow-inner group-hover:border-amber-500/40 transition-colors">
                                                            <img
                                                                src={issuerIcon}
                                                                alt={cert.issuer || 'Issuer'}
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                                                            <Award className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                    {cert.issuer && (
                                                        <span className="text-xs font-semibold text-foreground group-hover:text-amber-300 transition-colors truncate max-w-[170px]">
                                                            {cert.issuer}
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-400 flex items-center gap-1 flex-shrink-0">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Verified
                                                </span>
                                            </div>

                                            {/* Title & Short Description with Line Clamp */}
                                            <div className="space-y-1.5">
                                                <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-amber-300 transition-colors line-clamp-2">
                                                    {name}
                                                </h3>
                                                {description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                        {description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Footer: Issue Date & Detail Certificate Button */}
                                        <div className="pt-3.5 border-t border-border/60 flex items-center justify-between gap-2 mt-auto">
                                            {cert.issued_at && (
                                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                                                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                                    <span>
                                                        {new Date(cert.issued_at).toLocaleDateString(undefined, {
                                                             year: 'numeric',
                                                             month: 'short',
                                                        })}
                                                    </span>
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveModalCert(cert);
                                                }}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-semibold transition-all duration-200 group-hover:border-amber-400 active:scale-95 shadow-sm ml-auto"
                                            >
                                                <span>Detail Certificate</span>
                                                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveModalCert(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl shadow-amber-950/30 overflow-hidden z-10 my-8 max-h-[90vh] flex flex-col"
                        >
                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={() => setActiveModalCert(null)}
                                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all active:scale-90 shadow-md"
                                title="Tutup Modal"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Modal Header: Certificate Image & Gallery Carousel */}
                            {(() => {
                                const images: string[] = [];
                                if (activeModalCert.image) images.push(getImageUrl(activeModalCert.image)!);
                                if (activeModalCert.gallery && Array.isArray(activeModalCert.gallery)) {
                                    activeModalCert.gallery.forEach((g) => {
                                        const url = getImageUrl(g);
                                        if (url && !images.includes(url)) images.push(url);
                                    });
                                }

                                if (images.length === 0) return null;

                                return (
                                    <div className="relative w-full h-56 sm:h-64 bg-secondary/80 border-b border-border flex-shrink-0">
                                        {images.length > 1 ? (
                                            <Swiper
                                                modules={[Pagination, Navigation, Autoplay]}
                                                pagination={{ clickable: true }}
                                                navigation
                                                autoplay={{ delay: 5000, disableOnInteraction: true }}
                                                className="w-full h-full"
                                            >
                                                {images.map((imgUrl, iIdx) => (
                                                    <SwiperSlide key={iIdx} className="w-full h-full relative">
                                                        <img
                                                            src={imgUrl}
                                                            alt={getTranslated(activeModalCert.name, 'Certificate')}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        ) : (
                                            <img
                                                src={images[0]}
                                                alt={getTranslated(activeModalCert.name, 'Certificate')}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Modal Scrollable Content */}
                            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                                {/* Header Info */}
                                <div className="space-y-3 border-b border-border/60 pb-5">
                                    <div className="flex items-center gap-3">
                                        {activeModalCert.issuer_icon ? (
                                            <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center p-2 flex-shrink-0 shadow-inner">
                                                <img
                                                    src={getImageUrl(activeModalCert.issuer_icon)!}
                                                    alt={activeModalCert.issuer || 'Issuer'}
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                                                <Award className="w-5 h-5" />
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-xs font-semibold text-muted-foreground block">
                                                {activeModalCert.issuer || 'Official Accreditation'}
                                            </span>
                                            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight">
                                                {getTranslated(activeModalCert.name, 'Certificate')}
                                            </h2>
                                        </div>
                                    </div>

                                    {/* Badges Metadata */}
                                    <div className="flex flex-wrap items-center gap-2 pt-1">
                                        {activeModalCert.issued_at && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-secondary border border-border text-xs font-mono text-muted-foreground">
                                                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                                Diterbitkan: {new Date(activeModalCert.issued_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                                            </span>
                                        )}
                                        {activeModalCert.credential_id && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300">
                                                <Hash className="w-3.5 h-3.5" />
                                                ID: {activeModalCert.credential_id}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Status Terverifikasi
                                        </span>
                                    </div>
                                </div>

                                {/* Rich Editor About / Detail Content Rendering */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                                        Tentang Sertifikat & Silabus Kompetensi
                                    </h4>

                                    {activeModalCert.detail ? (
                                        <div
                                            className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed text-xs sm:text-sm bg-secondary/30 p-4 sm:p-5 rounded-2xl border border-border/60"
                                            dangerouslySetInnerHTML={{
                                                __html: getTranslated(activeModalCert.detail, getTranslated(activeModalCert.description, '')),
                                            }}
                                        />
                                    ) : (
                                        <div className="bg-secondary/30 p-4 rounded-2xl border border-border/60">
                                            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                                                {getTranslated(activeModalCert.description, 'Tidak ada informasi detail tambahan.')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer: External Verification Link & Close Button */}
                            <div className="p-4 sm:px-8 border-t border-border/60 bg-secondary/20 flex items-center justify-between gap-3">
                                {activeModalCert.url ? (
                                    <a
                                        href={activeModalCert.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95"
                                    >
                                        <span>Buka Verifikasi Resmi</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                ) : (
                                    <div />
                                )}

                                <button
                                    type="button"
                                    onClick={() => setActiveModalCert(null)}
                                    className="px-5 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground transition-all"
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
