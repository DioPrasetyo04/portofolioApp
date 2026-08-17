import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowUp, Github, Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
    const { t } = useTranslation();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="border-t border-border bg-card/40 backdrop-blur-md pt-16 pb-12">
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
                            <span className="font-bold text-lg gradient-text">Portfolio.3D</span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                            {t('footer.tagline')}
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="mailto:hello@example.com"
                                className="p-2 rounded-lg bg-secondary hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                            </a>
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
                        </ul>
                    </div>

                    {/* Admin CMS */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-foreground">Management</h4>
                        <ul className="space-y-2 text-xs text-muted-foreground">
                            <li>
                                <a href="/admin" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors flex items-center gap-1">
                                    <span>Filament CMS Panel</span>
                                </a>
                            </li>
                            <li>
                                <a href="/news" className="hover:text-primary transition-colors">All Articles</a>
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
                    <p>© {new Date().getFullYear()} Portfolio 3D. {t('footer.rights')}</p>
                    <p className="flex items-center gap-1">
                        Built with <span className="text-purple-500 font-semibold">Inertia.js</span> & <span className="text-cyan-400 font-semibold">React Three Fiber</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
