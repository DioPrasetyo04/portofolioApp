import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';

interface NewsItem {
    id: number;
    title: any;
    slug: string;
    short_description: any;
    image: string | null;
    created_at: string;
}

interface NewsSectionProps {
    newsList: NewsItem[];
}

export default function NewsSection({ newsList = [] }: NewsSectionProps) {
    const { t } = useTranslation();

    if (!newsList || newsList.length === 0) return null;

    return (
        <section id="news" className="py-12 sm:py-16 md:py-24 relative overflow-hidden bg-transparent">
            {/* Ambient Cosmic Background Glows */}
            <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-10 w-[450px] h-[450px] bg-cyan-300/15 dark:bg-cyan-400/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-indigo-200/15 dark:bg-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 md:mb-16 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-bold dark:font-semibold shadow-sm">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>{t('news.title')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        {t('news.subtitle')}
                    </h2>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsList.map((article) => {
                        const title = getTranslated(article.title, 'Article Title');
                        const excerpt = getTranslated(article.short_description, '');

                        return (
                            <Link
                                key={article.id}
                                href={`/news/${article.slug}`}
                                className="group flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden shadow-lg glow-card"
                            >
                                <div className="space-y-4">
                                    {/* Cover Image */}
                                    <div className="h-48 w-full bg-gradient-to-br from-purple-900/20 via-slate-900/30 to-cyan-900/20 overflow-hidden flex items-center justify-center relative">
                                        {article.image ? (
                                            <img
                                                src={`/storage/${article.image}`}
                                                alt={title}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                                <Newspaper className="w-6 h-6" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/90 border border-border text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-purple-400" />
                                            <span>{new Date(article.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="p-6 space-y-2">
                                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                            {title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                            {excerpt}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 pt-0 flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    <span>{t('news.readMore')}</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
