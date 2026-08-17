import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Share2, Sparkles, Newspaper } from 'lucide-react';
import Navbar from '@/components/portfolio/Navbar';
import Footer from '@/components/portfolio/Footer';
import { getTranslated } from '@/lib/i18n-helper';

interface ArticleItem {
    id: number;
    title: any;
    slug: string;
    short_description: any;
    detail_content: any;
    image: string | null;
    created_at: string;
}

interface NewsShowProps {
    article: ArticleItem;
    recentNews: ArticleItem[];
}

export default function NewsShow({ article, recentNews = [] }: NewsShowProps) {
    const { t } = useTranslation();

    const title = getTranslated(article.title, 'Article Detail');
    const content = getTranslated(article.detail_content, '<p>No content available.</p>');
    const excerpt = getTranslated(article.short_description, '');

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <>
            <Head title={`${title} - Portfolio 3D`} />

            <div className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar />

                <main className="flex-1 pt-32 pb-24">
                    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Back Link */}
                        <div className="mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>{t('news.backToHome')}</span>
                            </Link>
                        </div>

                        {/* Article Header */}
                        <div className="space-y-4 mb-10">
                            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                                <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold">
                                    Engineering & 3D Web
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                    <span>
                                        {t('news.publishedOn')}{' '}
                                        {new Date(article.created_at).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                                {title}
                            </h1>

                            {excerpt && (
                                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed italic border-l-2 border-purple-500 pl-4">
                                    {excerpt}
                                </p>
                            )}
                        </div>

                        {/* Article Cover Banner */}
                        {article.image && (
                            <div className="w-full h-80 sm:h-[450px] rounded-3xl overflow-hidden mb-12 border border-border shadow-2xl">
                                <img
                                    src={`/storage/${article.image}`}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div
                            className="prose prose-base sm:prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed border-b border-border pb-12 mb-12
                                [&>h2]:text-foreground [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:mt-8 [&>h2]:mb-4
                                [&>h3]:text-foreground [&>h3]:font-semibold [&>h3]:text-xl [&>h3]:mt-6 [&>h3]:mb-3
                                [&>p]:mb-5
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-6
                                [&>blockquote]:border-l-4 [&>blockquote]:border-purple-500 [&>blockquote]:pl-4 [&>blockquote]:italic"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />

                        {/* Share Controls */}
                        <div className="flex items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-card/60 mb-16">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                                <span className="font-semibold text-sm text-foreground">Enjoyed this read?</span>
                            </div>

                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-border text-foreground text-xs font-medium transition-colors"
                            >
                                <Share2 className="w-4 h-4 text-cyan-400" />
                                <span>{t('news.share')}</span>
                            </button>
                        </div>

                        {/* Recent Articles Recommendation */}
                        {recentNews.length > 0 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <Newspaper className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-xl font-bold text-foreground">More Articles</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {recentNews
                                        .filter((item) => item.id !== article.id)
                                        .slice(0, 2)
                                        .map((item) => {
                                            const recTitle = getTranslated(item.title, 'Article');
                                            return (
                                                <Link
                                                    key={item.id}
                                                    href={`/news/${item.slug}`}
                                                    className="p-5 rounded-2xl border border-border bg-card hover:border-purple-500/40 glow-card transition-all"
                                                >
                                                    <h4 className="font-bold text-sm text-foreground line-clamp-2 mb-2">
                                                        {recTitle}
                                                    </h4>
                                                    <span className="text-xs text-purple-400 font-medium">Read article →</span>
                                                </Link>
                                            );
                                        })}
                                </div>
                            </div>
                        )}
                    </article>
                </main>

                <Footer />
            </div>
        </>
    );
}
