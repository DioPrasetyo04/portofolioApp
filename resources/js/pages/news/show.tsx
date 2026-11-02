import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Newspaper, Search, Star } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AsteroidBackground from '@/components/portfolio/3d/AsteroidBackground';
import Footer from '@/components/portfolio/Footer';
import Navbar from '@/components/portfolio/Navbar';
import InteractionSection from '@/components/portfolio/ui/InteractionSection';
import SocialShare from '@/components/portfolio/ui/SocialShare';
import { getTranslated } from '@/lib/i18n-helper';

interface ArticleItem {
    id: number;
    title: any;
    slug: string;
    short_description: any;
    detail_content: any;
    image: string | null;
    created_at: string;
    comments_avg_rating?: number;
    likes_count?: number;
    comments?: any[];
}

interface NewsShowProps {
    article: ArticleItem;
    recentNews: ArticleItem[];
}

export default function NewsShow({ article, recentNews = [] }: NewsShowProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [minRating, setMinRating] = React.useState(0);

    const title = getTranslated(article.title, 'Article Detail');
    const content = getTranslated(
        article.detail_content,
        '<p>No content available.</p>',
    );
    const excerpt = getTranslated(article.short_description, '');

    const filteredRecentNews = recentNews
        .filter((item) => item.id !== article.id)
        .filter((item) => {
            const titleMatch = String(getTranslated(item.title, ''))
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const ratingMatch = (item.comments_avg_rating || 0) >= minRating;

            return titleMatch && ratingMatch;
        });

    return (
        <>
            <AsteroidBackground />
            <Head title={title} />

            <div className="flex min-h-screen flex-col bg-transparent text-foreground">
                <Navbar />

                <main className="flex-1 pt-32 pb-24">
                    <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        {/* Back Link */}
                        <div className="mb-8">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>{t('news.backToHome')}</span>
                            </Link>
                        </div>

                        {/* Article Header */}
                        <div className="mb-10 space-y-4">
                            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                                <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 font-semibold text-purple-400">
                                    Engineering & 3D Web
                                </span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5 text-purple-400" />
                                    <span>
                                        {t('news.publishedOn')}{' '}
                                        {new Date(
                                            article.created_at,
                                        ).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-3xl leading-[1.2] font-extrabold tracking-tight text-foreground sm:text-5xl">
                                {title}
                            </h1>

                            {excerpt && (
                                <p className="border-l-2 border-purple-500 pl-4 text-base leading-relaxed text-muted-foreground italic sm:text-lg">
                                    {excerpt}
                                </p>
                            )}
                        </div>

                        {/* Article Cover Banner */}
                        {article.image && (
                            <div className="mb-12 h-80 w-full overflow-hidden rounded-3xl border border-border shadow-2xl sm:h-[450px]">
                                <img
                                    src={`/storage/${article.image}`}
                                    alt={title}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div
                            className="prose prose-base mb-8 max-w-none border-b border-border pb-12 leading-relaxed text-muted-foreground sm:prose-lg dark:prose-invert prose-code:rounded-md prose-code:bg-cyan-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-cyan-400 prose-pre:border prose-pre:border-border prose-pre:bg-neutral-950 [&>blockquote]:border-l-4 [&>blockquote]:border-purple-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>h2]:mt-8 [&>h2]:mb-4 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-foreground [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-foreground [&>p]:mb-5 [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:pl-6"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />

                        {/* Share Controls */}
                        <SocialShare
                            url={
                                typeof window !== 'undefined'
                                    ? window.location.href
                                    : ''
                            }
                            title={title}
                        />

                        {/* Interactions (Likes & Comments) */}
                        <InteractionSection
                            type="news"
                            id={article.id}
                            initialLikes={article.likes_count || 0}
                            initialComments={article.comments || []}
                        />

                        {/* Recent Articles Recommendation */}
                        {recentNews.length > 0 && (
                            <div className="mt-16 space-y-6 border-t border-border pt-8">
                                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                                    <div className="flex items-center gap-2">
                                        <Newspaper className="h-5 w-5 text-cyan-400" />
                                        <h3 className="text-xl font-bold text-foreground">
                                            More Articles
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="Search articles..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border border-border bg-background/50 py-2 pr-4 pl-9 text-sm backdrop-blur-md focus:border-purple-500 focus:outline-none sm:w-64"
                                            />
                                        </div>
                                        <select
                                            value={minRating}
                                            onChange={(e) =>
                                                setMinRating(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="rounded-xl border border-border bg-background/50 px-3 py-2 text-sm backdrop-blur-md focus:border-purple-500 focus:outline-none"
                                        >
                                            <option value={0}>
                                                All Ratings
                                            </option>
                                            <option value={4}>4+ Stars</option>
                                            <option value={5}>5 Stars</option>
                                        </select>
                                    </div>
                                </div>

                                {filteredRecentNews.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-border bg-card/30 py-12 text-center text-muted-foreground backdrop-blur-sm">
                                        No articles found matching your
                                        criteria.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {filteredRecentNews
                                            .slice(0, 4)
                                            .map((item) => {
                                                const recTitle = getTranslated(
                                                    item.title,
                                                    'Article',
                                                );
                                                const avgRating = Math.round(
                                                    item.comments_avg_rating ||
                                                        0,
                                                );

                                                return (
                                                    <Link
                                                        key={item.id}
                                                        href={`/news/${item.slug}`}
                                                        className="glow-card flex flex-col justify-between rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-sm transition-all hover:border-purple-500/40"
                                                    >
                                                        <div>
                                                            <div className="mb-2 flex items-center gap-1">
                                                                {[
                                                                    ...Array(5),
                                                                ].map(
                                                                    (_, i) => (
                                                                        <Star
                                                                            key={
                                                                                i
                                                                            }
                                                                            className={`h-3.5 w-3.5 ${i < avgRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                                                                        />
                                                                    ),
                                                                )}
                                                                <span className="ml-1 text-xs text-muted-foreground">
                                                                    (
                                                                    {item.comments_avg_rating
                                                                        ? Number(
                                                                              item.comments_avg_rating,
                                                                          ).toFixed(
                                                                              1,
                                                                          )
                                                                        : 'New'}
                                                                    )
                                                                </span>
                                                            </div>
                                                            <h4 className="mb-4 line-clamp-2 text-sm font-bold text-foreground">
                                                                {recTitle}
                                                            </h4>
                                                        </div>
                                                        <span className="text-xs font-medium text-purple-400">
                                                            Read article →
                                                        </span>
                                                    </Link>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        )}
                    </article>
                </main>

                <Footer />
            </div>
        </>
    );
}
