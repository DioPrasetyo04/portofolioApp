import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Share2, Sparkles, Newspaper, Search, Star } from 'lucide-react';
import Navbar from '@/components/portfolio/Navbar';
import Footer from '@/components/portfolio/Footer';
import AsteroidBackground from '@/components/portfolio/3d/AsteroidBackground';
import SocialShare from '@/components/portfolio/ui/SocialShare';
import InteractionSection from '@/components/portfolio/ui/InteractionSection';
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
    const content = getTranslated(article.detail_content, '<p>No content available.</p>');
    const excerpt = getTranslated(article.short_description, '');

    const filteredRecentNews = recentNews
        .filter((item) => item.id !== article.id)
        .filter(item => {
            const titleMatch = String(getTranslated(item.title, '')).toLowerCase().includes(searchTerm.toLowerCase());
            const ratingMatch = (item.comments_avg_rating || 0) >= minRating;
            return titleMatch && ratingMatch;
        });

    return (
        <>
            <AsteroidBackground />
            <Head title={title} />

            <div className="min-h-screen text-foreground flex flex-col bg-transparent">
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
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Article Content */}
                        <div
                            className="prose prose-base sm:prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed border-b border-border pb-12 mb-8
                                [&>h2]:text-foreground [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:mt-8 [&>h2]:mb-4
                                [&>h3]:text-foreground [&>h3]:font-semibold [&>h3]:text-xl [&>h3]:mt-6 [&>h3]:mb-3
                                [&>p]:mb-5
                                [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:mb-6
                                [&>blockquote]:border-l-4 [&>blockquote]:border-purple-500 [&>blockquote]:pl-4 [&>blockquote]:italic
                                prose-pre:bg-neutral-950 prose-pre:border prose-pre:border-border prose-code:text-cyan-400 prose-code:bg-cyan-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />

                        {/* Share Controls */}
                        <SocialShare url={typeof window !== 'undefined' ? window.location.href : ''} title={title} />
                        
                        {/* Interactions (Likes & Comments) */}
                        <InteractionSection 
                            type="news" 
                            id={article.id} 
                            initialLikes={article.likes_count || 0} 
                            initialComments={article.comments || []} 
                        />

                        {/* Recent Articles Recommendation */}
                        {recentNews.length > 0 && (
                            <div className="space-y-6 mt-16 pt-8 border-t border-border">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <Newspaper className="w-5 h-5 text-cyan-400" />
                                        <h3 className="text-xl font-bold text-foreground">More Articles</h3>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <input 
                                                type="text" 
                                                placeholder="Search articles..." 
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="pl-9 pr-4 py-2 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:border-purple-500 w-full sm:w-64 backdrop-blur-md"
                                            />
                                        </div>
                                        <select 
                                            value={minRating} 
                                            onChange={e => setMinRating(Number(e.target.value))}
                                            className="px-3 py-2 bg-background/50 border border-border rounded-xl text-sm focus:outline-none focus:border-purple-500 backdrop-blur-md"
                                        >
                                            <option value={0}>All Ratings</option>
                                            <option value={4}>4+ Stars</option>
                                            <option value={5}>5 Stars</option>
                                        </select>
                                    </div>
                                </div>

                                {filteredRecentNews.length === 0 ? (
                                    <div className="text-center py-12 text-muted-foreground bg-card/30 rounded-2xl border border-dashed border-border backdrop-blur-sm">
                                        No articles found matching your criteria.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {filteredRecentNews.slice(0, 4).map((item) => {
                                            const recTitle = getTranslated(item.title, 'Article');
                                            const avgRating = Math.round(item.comments_avg_rating || 0);
                                            return (
                                                <Link
                                                    key={item.id}
                                                    href={`/news/${item.slug}`}
                                                    className="p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm hover:border-purple-500/40 glow-card transition-all flex flex-col justify-between"
                                                >
                                                    <div>
                                                        <div className="flex items-center gap-1 mb-2">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-3.5 h-3.5 ${i < avgRating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                                                            ))}
                                                            <span className="text-xs text-muted-foreground ml-1">
                                                                ({item.comments_avg_rating ? Number(item.comments_avg_rating).toFixed(1) : 'New'})
                                                            </span>
                                                        </div>
                                                        <h4 className="font-bold text-sm text-foreground line-clamp-2 mb-4">
                                                            {recTitle}
                                                        </h4>
                                                    </div>
                                                    <span className="text-xs text-purple-400 font-medium">Read article →</span>
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
