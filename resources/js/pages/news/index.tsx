import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Newspaper, ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import Navbar from '@/components/portfolio/Navbar';
import Footer from '@/components/portfolio/Footer';
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
            <Head title="Articles & Insights - Portfolio 3D" />

            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar />

                <main className="flex-1 pt-32 pb-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Top Back Link */}
                        <div className="mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>{t('news.backToHome')}</span>
                            </Link>
                        </div>

                        {/* Page Header */}
                        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold">
                                <Newspaper className="w-3.5 h-3.5" />
                                <span>{t('news.title')}</span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
                                {t('news.allArticles')}
                            </h1>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                {t('news.subtitle')}
                            </p>
                        </div>

                        {/* Articles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => {
                                const title = getTranslated(article.title, 'Article Title');
                                const excerpt = getTranslated(article.short_description, '');

                                return (
                                    <Link
                                        key={article.id}
                                        href={`/news/${article.slug}`}
                                        className="group flex flex-col justify-between rounded-2xl border border-border bg-card overflow-hidden shadow-lg glow-card"
                                    >
                                        <div className="space-y-4">
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
                                                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-purple-400" />
                                                    <span>
                                                        {new Date(article.created_at).toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 space-y-2">
                                                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                                    {title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                                                    {excerpt}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-6 pt-0 flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:text-cyan-400 transition-colors">
                                            <span>{t('news.readMore')}</span>
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
