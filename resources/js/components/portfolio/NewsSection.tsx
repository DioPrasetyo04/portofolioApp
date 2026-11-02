import { Link } from '@inertiajs/react';
import { Newspaper, ArrowRight, Calendar } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
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

    if (!newsList || newsList.length === 0) {
        return null;
    }

    return (
        <section
            id="news"
            className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-24"
        >
            {/* Ambient Cosmic Background Glows */}
            <div className="pointer-events-none absolute top-1/2 right-10 -z-10 h-[500px] w-[500px] rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/15" />
            <div className="pointer-events-none absolute bottom-0 left-10 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/10" />
            <div className="pointer-events-none absolute top-10 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-200/15 blur-3xl dark:bg-transparent" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto mb-8 max-w-2xl space-y-3 text-center sm:mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 px-3.5 py-1.5 text-xs font-bold text-purple-700 shadow-sm dark:font-semibold dark:text-purple-300">
                        <Newspaper className="h-3.5 w-3.5" />
                        <span>{t('news.title')}</span>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                        {t('news.subtitle')}
                    </h2>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {newsList.map((article) => {
                        const title = getTranslated(
                            article.title,
                            'Article Title',
                        );
                        const excerpt = getTranslated(
                            article.short_description,
                            '',
                        );

                        return (
                            <Link
                                key={article.id}
                                href={`/news/${article.slug}`}
                                className="group glow-card flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
                            >
                                <div className="space-y-4">
                                    {/* Cover Image */}
                                    <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-gradient-to-br from-purple-900/20 via-slate-900/30 to-cyan-900/20">
                                        {article.image ? (
                                            <img
                                                src={`/storage/${article.image}`}
                                                alt={title}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
                                                <Newspaper className="h-6 w-6" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full border border-border bg-background/90 px-2.5 py-1 font-mono text-[10px] text-muted-foreground">
                                            <Calendar className="h-3 w-3 text-purple-400" />
                                            <span>
                                                {new Date(
                                                    article.created_at,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    },
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="space-y-2 p-6">
                                        <h3 className="line-clamp-2 text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
                                            {title}
                                        </h3>
                                        <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                            {excerpt}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 p-6 pt-0 text-xs font-semibold text-purple-700 transition-colors group-hover:text-cyan-600 dark:text-purple-400 dark:group-hover:text-cyan-400">
                                    <span>{t('news.readMore')}</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
