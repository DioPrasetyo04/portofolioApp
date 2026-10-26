import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import {
    Sparkles,
    ArrowUp,
    Github,
    Linkedin,
    Twitter,
    Instagram,
    MessageCircle,
    Mail,
    Globe
} from 'lucide-react';

export interface SocialMediaItem {
    id: number | string;
    name: string;
    url: string;
    icon?: string | null;
    is_active?: boolean;
}

interface FooterProps {
    socialMedia?: SocialMediaItem[];
}

function FooterSocialIcon({ item }: { item: SocialMediaItem }) {
    const [imageError, setImageError] = useState(false);

    const isImage = Boolean(item.icon && (item.icon.includes('/') || /\.(png|jpe?g|svg|webp|gif)$/i.test(item.icon)));

    if (isImage && !imageError) {
        const src = item.icon!.startsWith('http') || item.icon!.startsWith('/') ? item.icon! : `/storage/${item.icon}`;
        return (
            <img
                src={src}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="w-4 h-4 object-contain rounded"
                onError={() => setImageError(true)}
            />
        );
    }

    const name = item.name.toLowerCase();
    const iconStr = (item.icon || '').toLowerCase();

    if (name.includes('whatsapp') || iconStr.includes('whatsapp')) {
        return <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />;
    }
    if (name.includes('instagram') || iconStr.includes('instagram')) {
        return <Instagram className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />;
    }
    if (name.includes('twitter') || name.includes('x') || iconStr.includes('twitter')) {
        return <Twitter className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />;
    }
    if (name.includes('linkedin') || iconStr.includes('linkedin')) {
        return <Linkedin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />;
    }
    if (name.includes('github') || iconStr.includes('github')) {
        return <Github className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />;
    }
    if (name.includes('mail') || name.includes('email') || iconStr.includes('mail')) {
        return <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />;
    }
    return <Globe className="w-4 h-4 text-muted-foreground group-hover:scale-110 transition-transform" />;
}

export default function Footer({ socialMedia: propSocialMedia }: FooterProps) {
    const { t } = useTranslation();
    const pageProps = usePage().props as any;

    const rawSocialMedia: SocialMediaItem[] =
        propSocialMedia && propSocialMedia.length > 0
            ? propSocialMedia
            : pageProps.socialMedia || pageProps.portfolio?.socialMedia || [];

    const fallbackSocialMedia: SocialMediaItem[] = [
        { id: 'gh', name: 'GitHub', url: 'https://github.com/DioPrasetyo04', is_active: true },
        { id: 'li', name: 'LinkedIn', url: 'https://linkedin.com/in/www.linkedin.com/in/dio-prasetyo-72268b340', is_active: true },
        { id: 'tw', name: 'Twitter', url: 'https://twitter.com/yourusername', is_active: true },
        { id: 'ig', name: 'Instagram', url: 'https://instagram.com/dioolinger04', is_active: true },
        { id: 'wa', name: 'WhatsApp', url: 'https://wa.me/+6281381876265', is_active: true },
    ];

    const effectiveSocialList = rawSocialMedia.length > 0 ? rawSocialMedia : fallbackSocialMedia;
    const activeSocialMedia = effectiveSocialList.filter((item) => item.is_active !== false);

    const hasEmail = activeSocialMedia.some((item) => {
        const n = item.name.toLowerCase();
        return n.includes('mail') || n.includes('email');
    });

    const getValidUrl = (url: string, name: string) => {
        let cleanUrl = (url || '').trim();
        if (name.toLowerCase().includes('whatsapp') && !cleanUrl.startsWith('http')) {
            return `https://wa.me/${cleanUrl.replace(/[^0-9]/g, '')}`;
        }
        if (!cleanUrl.startsWith('http') && !cleanUrl.startsWith('mailto:')) {
            return `https://${cleanUrl}`;
        }
        return cleanUrl;
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="border-t border-purple-300/30 dark:border-white/10 bg-white/90 dark:bg-black/90 backdrop-blur-sm pt-16 pb-12 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-border/60">
                    {/* Brand & Bio */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 p-[2px]">
                                <div className="w-full h-full bg-background rounded-[6px] flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                </div>
                            </div>
                            <span className="font-bold text-lg tracking-wider uppercase gradient-text">DIOSTACK</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                            {t('footer.tagline')}
                        </p>
                        <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            {activeSocialMedia.map((item) => (
                                <a
                                    key={item.id}
                                    href={getValidUrl(item.url, item.name)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={item.name}
                                    aria-label={item.name}
                                    className="group p-2.5 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/70 hover:border-purple-500/50 text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10 hover:-translate-y-0.5 flex items-center justify-center"
                                >
                                    <FooterSocialIcon item={item} />
                                </a>
                            ))}
                            {!hasEmail && (
                                <a
                                    href="mailto:prasetyodio04@gmail.com"
                                    title="Email (prasetyodio04@gmail.com)"
                                    aria-label="Email"
                                    className="group p-2.5 rounded-xl bg-secondary/80 hover:bg-secondary border border-border/70 hover:border-purple-500/50 text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-md hover:shadow-purple-500/10 hover:-translate-y-0.5 flex items-center justify-center"
                                >
                                    <Mail className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-foreground">Navigation</h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li><a href="#about" className="hover:text-primary transition-colors">{t('nav.about')}</a></li>
                            <li><a href="#projects" className="hover:text-primary transition-colors">{t('nav.projects')}</a></li>
                            <li><a href="#skills" className="hover:text-primary transition-colors">{t('nav.skills')}</a></li>
                            <li><a href="#languages" className="hover:text-primary transition-colors">{t('nav.languages')}</a></li>
                            <li><a href="#certificates" className="hover:text-primary transition-colors">{t('nav.certificates')}</a></li>
                            <li><a href="#news" className="hover:text-primary transition-colors">{t('nav.news')}</a></li>
                            <li><a href="#contact" className="hover:text-primary transition-colors">{t('nav.contact')}</a></li>
                        </ul>
                    </div>

                    {/* Explore & Back to Top */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-foreground">Explore</h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li>
                                <a href="/news" className="hover:text-primary transition-colors">All Articles</a>
                            </li>
                            <li>
                                <a href="#contact" className="hover:text-primary transition-colors">{t('nav.contact')}</a>
                            </li>
                            <li className="pt-4">
                                <button
                                    onClick={scrollToTop}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-secondary/80 hover:bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                    <span>Back to Top</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} DIOSTACK. {t('footer.rights')}</p>
                    <p className="flex items-center gap-1">
                        Built with <span className="text-purple-500 font-semibold">Inertia.js</span> & <span className="text-cyan-400 font-semibold">React Three Fiber</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
