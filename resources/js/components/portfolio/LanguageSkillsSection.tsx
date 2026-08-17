import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { Globe, Languages } from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';

interface LanguageSkillItem {
    id: number;
    name: string;
    description: any;
    logo: string | null;
    photo: string | null;
}

interface LanguageSkillsSectionProps {
    skills: LanguageSkillItem[];
}

export default function LanguageSkillsSection({ skills = [] }: LanguageSkillsSectionProps) {
    const { t } = useTranslation();

    if (!skills || skills.length === 0) return null;

    return (
        <section id="languages" className="py-24 relative overflow-hidden bg-secondary/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold">
                        <Languages className="w-3.5 h-3.5" />
                        <span>{t('languages.title')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        {t('languages.subtitle')}
                    </h2>
                </div>

                {/* Swiper Carousel */}
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    pagination={{ clickable: true, dynamicBullets: true }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                    }}
                    className="pb-14"
                >
                    {skills.map((skill) => {
                        const description = getTranslated(skill.description, '');

                        return (
                            <SwiperSlide key={skill.id} className="h-auto">
                                <div className="h-full p-6 rounded-2xl border border-border bg-card shadow-lg glow-card flex flex-col justify-between space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-xl flex-shrink-0">
                                            {skill.logo ? (
                                                <img
                                                    src={`/storage/${skill.logo}`}
                                                    alt={skill.name}
                                                    className="w-7 h-7 object-contain"
                                                />
                                            ) : (
                                                <Globe className="w-6 h-6 text-purple-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base text-foreground">
                                                {skill.name}
                                            </h3>
                                            <span className="text-xs text-muted-foreground">
                                                Spoken & Written
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-border/60">
                                        <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                                            {description}
                                        </span>
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
