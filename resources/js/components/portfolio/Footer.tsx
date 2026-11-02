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
    Globe,
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

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

    const isImage = Boolean(
        item.icon &&
        (item.icon.includes('/') ||
            /\.(png|jpe?g|svg|webp|gif)$/i.test(item.icon)),
    );

    if (isImage && !imageError) {
        const src =
            item.icon!.startsWith('http') || item.icon!.startsWith('/')
                ? item.icon!
                : `/storage/${item.icon}`;

        return (
            <img
                src={src}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="h-4 w-4 rounded object-contain"
                onError={() => setImageError(true)}
            />
        );
    }

    const name = item.name.toLowerCase();
    const iconStr = (item.icon || '').toLowerCase();

    if (name.includes('whatsapp') || iconStr.includes('whatsapp')) {
        return (
            <MessageCircle className="h-4 w-4 text-emerald-400 transition-transform group-hover:scale-110" />
        );
    }

    if (name.includes('instagram') || iconStr.includes('instagram')) {
        return (
            <Instagram className="h-4 w-4 text-pink-400 transition-transform group-hover:scale-110" />
        );
    }

    if (
        name.includes('twitter') ||
        name.includes('x') ||
        iconStr.includes('twitter')
    ) {
        return (
            <Twitter className="h-4 w-4 text-cyan-400 transition-transform group-hover:scale-110" />
        );
    }

    if (name.includes('linkedin') || iconStr.includes('linkedin')) {
        return (
            <Linkedin className="h-4 w-4 text-blue-400 transition-transform group-hover:scale-110" />
        );
    }

    if (name.includes('github') || iconStr.includes('github')) {
        return (
            <Github className="h-4 w-4 text-purple-400 transition-transform group-hover:scale-110" />
        );
    }

    if (
        name.includes('mail') ||
        name.includes('email') ||
        iconStr.includes('mail')
    ) {
        return (
            <Mail className="h-4 w-4 text-amber-400 transition-transform group-hover:scale-110" />
        );
    }

    return (
        <Globe className="h-4 w-4 text-muted-foreground transition-transform group-hover:scale-110" />
    );
}

export default function Footer({ socialMedia: propSocialMedia }: FooterProps) {
    const { t } = useTranslation();
    const pageProps = usePage().props as any;

    const rawSocialMedia: SocialMediaItem[] =
        propSocialMedia && propSocialMedia.length > 0
            ? propSocialMedia
            : pageProps.socialMedia || pageProps.portfolio?.socialMedia || [];

    const fallbackSocialMedia: SocialMediaItem[] = [
        {
            id: 'gh',
            name: 'GitHub',
            url: 'https://github.com/DioPrasetyo04',
            is_active: true,
        },
        {
            id: 'li',
            name: 'LinkedIn',
            url: 'https://linkedin.com/in/www.linkedin.com/in/dio-prasetyo-72268b340',
            is_active: true,
        },
        {
            id: 'tw',
            name: 'Twitter',
            url: 'https://twitter.com/yourusername',
            is_active: true,
        },
        {
            id: 'ig',
            name: 'Instagram',
            url: 'https://instagram.com/dioolinger04',
            is_active: true,
        },
        {
            id: 'wa',
            name: 'WhatsApp',
            url: 'https://wa.me/+6281381876265',
            is_active: true,
        },
    ];

    const effectiveSocialList =
        rawSocialMedia.length > 0 ? rawSocialMedia : fallbackSocialMedia;
    const activeSocialMedia = effectiveSocialList.filter(
        (item) => item.is_active !== false,
    );

    const hasEmail = activeSocialMedia.some((item) => {
        const n = item.name.toLowerCase();

        return n.includes('mail') || n.includes('email');
    });

    const getValidUrl = (url: string, name: string) => {
        const cleanUrl = (url || '').trim();

        if (
            name.toLowerCase().includes('whatsapp') &&
            !cleanUrl.startsWith('http')
        ) {
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
        <footer className="relative z-10 border-t border-purple-300/30 bg-white/90 pt-10 pb-10 backdrop-blur-sm sm:pt-12 sm:pb-12 md:pt-16 dark:border-white/10 dark:bg-black/90">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 border-b border-border/60 pb-8 sm:pb-12 md:grid-cols-4 md:gap-10">
                    {/* Brand & Bio */}
                    <div className="space-y-4 md:col-span-2">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-400 p-[2px]">
                                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-background">
                                    <Sparkles className="h-4 w-4 text-purple-500" />
                                </div>
                            </div>
                            <span className="gradient-text text-lg font-bold tracking-wider uppercase">
                                DIOSTACK
                            </span>
                        </div>
                        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
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
                                    className="group flex items-center justify-center rounded-xl border border-border/70 bg-secondary/80 p-2.5 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/50 hover:bg-secondary hover:text-foreground hover:shadow-md hover:shadow-purple-500/10"
                                >
                                    <FooterSocialIcon item={item} />
                                </a>
                            ))}
                            {!hasEmail && (
                                <a
                                    href="mailto:prasetyodio04@gmail.com"
                                    title="Email (prasetyodio04@gmail.com)"
                                    aria-label="Email"
                                    className="group flex items-center justify-center rounded-xl border border-border/70 bg-secondary/80 p-2.5 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-purple-500/50 hover:bg-secondary hover:text-foreground hover:shadow-md hover:shadow-purple-500/10"
                                >
                                    <Mail className="h-4 w-4 text-amber-400 transition-transform group-hover:scale-110" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links & Explore (Grid 2 on mobile) */}
                    <div className="grid grid-cols-2 gap-6 sm:gap-8 md:col-span-2 md:gap-10">
                        {/* Quick Links */}
                        <div>
                            <h4 className="mb-4 text-sm font-semibold text-foreground">
                                Navigation
                            </h4>
                            <ul className="space-y-2 text-xs text-muted-foreground">
                                <li>
                                    <a
                                        href="#about"
                                        className="transition-colors hover:text-primary"
                                    >
                                        {t('nav.about')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#projects"
                                        className="transition-colors hover:text-primary"
                                    >
                                        {t('nav.projects')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#skills"
                                        className="transition-colors hover:text-primary"
                                    >
                                        {t('nav.skills')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#languages"
                                        className="transition-colors hover:text-primary"
                                    >
                                        {t('nav.languages')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#certificates"
                                        className="transition-colors hover:text-primary"
                                    >
                                        {t('nav.certificates')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#news"
                                        className="transition-colors hover:text-primary"
                                    >
                                        {t('nav.news')}
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#contact"
                                        className="transition-colors hover:text-primary"
                                    >
                                        {t('nav.contact')}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Explore & Back to Top */}
                        <div>
                            <h4 className="mb-4 text-sm font-semibold text-foreground">
                                Explore
                            </h4>
                            <ul className="space-y-2 text-xs text-muted-foreground">
                                <li>
                                    <a
                                        href="/news"
                                        className="transition-colors hover:text-primary"
                                    >
                                        All Articles
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#contact"
                                        className="transition-colors hover:text-primary"
                                    >
                                        {t('nav.contact')}
                                    </a>
                                </li>
                                <li className="pt-4">
                                    <button
                                        onClick={scrollToTop}
                                        className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-3 py-1.5 text-xs whitespace-nowrap text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                                    >
                                        <ArrowUp className="h-3.5 w-3.5" />
                                        <span>Back to Top</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-muted-foreground sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} DIOSTACK.{' '}
                        {t('footer.rights')}
                    </p>
                    <p className="flex items-center gap-1">
                        Built with{' '}
                        <span className="font-semibold text-purple-500">
                            Inertia.js
                        </span>{' '}
                        &{' '}
                        <span className="font-semibold text-cyan-400">
                            React Three Fiber
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
