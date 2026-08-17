import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Award, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';

interface CertificateItem {
    id: number;
    name: any;
    description: any;
    issuer: string | null;
    issued_at: string | null;
    image: string | null;
    url: string | null;
}

interface CertificatesSectionProps {
    certificates: CertificateItem[];
}

export default function CertificatesSection({ certificates = [] }: CertificatesSectionProps) {
    const { t } = useTranslation();

    if (!certificates || certificates.length === 0) return null;

    return (
        <section id="certificates" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold">
                        <Award className="w-3.5 h-3.5" />
                        <span>{t('certificates.title')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        {t('certificates.subtitle')}
                    </h2>
                </div>

                {/* Swiper Carousel */}
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 4500, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                    }}
                    className="pb-16"
                >
                    {certificates.map((cert) => {
                        const name = getTranslated(cert.name, 'Certificate');
                        const description = getTranslated(cert.description, '');

                        return (
                            <SwiperSlide key={cert.id} className="h-auto">
                                <div className="h-full p-6 rounded-2xl border border-border bg-card shadow-lg glow-card flex flex-col justify-between space-y-5">
                                    <div className="space-y-4">
                                        {/* Certificate Header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                                                <Award className="w-6 h-6" />
                                            </div>
                                            {cert.issuer && (
                                                <span className="px-2.5 py-1 rounded-full bg-secondary border border-border text-[11px] font-semibold text-muted-foreground">
                                                    {cert.issuer}
                                                </span>
                                            )}
                                        </div>

                                        {/* Title & Description */}
                                        <div className="space-y-1.5">
                                            <h3 className="font-bold text-base text-foreground leading-snug">
                                                {name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                                {description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                                        {cert.issued_at && (
                                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                                                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                                <span>{new Date(cert.issued_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}</span>
                                            </div>
                                        )}

                                        {cert.url && (
                                            <a
                                                href={cert.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1 text-xs font-medium text-cyan-400 hover:text-purple-400 transition-colors ml-auto"
                                            >
                                                <span>{t('certificates.verify')}</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
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
