import { Head, Link } from '@inertiajs/react';
import { Newspaper, ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '@/components/portfolio/Footer';
import Navbar from '@/components/portfolio/Navbar';
import { getTranslated } from '@/lib/i18n-helper';

interface NewsItem {
    id: number;
    title: any;
    slug: string;
    short_description: any;
    image: string | null;
    created_at: string;
}

interface NewsIndexProps {
    newsList: {
        data: NewsItem[];
        links: any[];
    };
}

export default function NewsIndex({ newsList }: NewsIndexProps) {
    const { t } = useTranslation();

    const articles = newsList?.data || [];

    return (
        <>
            <Head title="Articles & Insights" />

            <div className="flex min-h-screen flex-col bg-background text-foreground">
                <Navbar />

                <main className="flex-1 pt-32 pb-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Top Back Link */}
                        <div className="mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>{t('news.backToHome')}</span>
                            </Link>
                        </div>

                        {/* Page Header */}
                        <div className="mx-auto mb-16 max-w-2xl space-y-3 text-center">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                                <Newspaper className="h-3.5 w-3.5" />
                                <span>{t('news.title')}</span>
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                                {t('news.allArticles')}
                            </h1>
                            <p className="text-sm text-muted-foreground sm:text-base">
                                {t('news.subtitle')}
                            </p>
                        </div>

                        {/* Articles Grid */}
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {articles.map((article) => {
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
                                                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full border border-border bg-background/80 px-2.5 py-1 font-mono text-[10px] text-muted-foreground backdrop-blur-md">
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

                                            <div className="space-y-2 p-6">
                                                <h3 className="line-clamp-2 text-base leading-snug font-bold text-foreground transition-colors group-hover:text-primary">
                                                    {title}
                                                </h3>
                                                <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                                                    {excerpt}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1.5 p-6 pt-0 text-xs font-semibold text-purple-400 transition-colors group-hover:text-cyan-400">
                                            <span>{t('news.readMore')}</span>
                                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    );
}
