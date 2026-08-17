import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@inertiajs/react';
import { 
    Sun, 
    Moon, 
    Globe, 
    Menu, 
    X, 
    Sparkles, 
    Shield, 
    Check,
    ChevronDown
} from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';

interface NavbarProps {
    currentSection?: string;
}

export default function Navbar({ currentSection }: NavbarProps) {
    const { t, i18n } = useTranslation();
    const { appearance, updateAppearance } = useAppearance();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const languages = [
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
        { code: 'zh', label: '中文 (Chinese)', flag: '🇨🇳' },
    ];

    const currentLang = languages.find(l => l.code === (i18n.language?.split('-')[0] || 'en')) || languages[0];

    const navLinks = [
        { href: '#about', label: t('nav.about') },
        { href: '#projects', label: t('nav.projects') },
        { href: '#skills', label: t('nav.skills') },
        { href: '#languages', label: t('nav.languages') },
        { href: '#certificates', label: t('nav.certificates') },
        { href: '#news', label: t('nav.news') },
    ];

    const toggleTheme = () => {
        updateAppearance(appearance === 'dark' ? 'light' : 'dark');
    };

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setLangDropdownOpen(false);
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-3 shadow-lg shadow-black/5' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Brand Logo */}
                    <a href="#" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-purple-500 group-hover:rotate-12 transition-transform duration-300" />
                            </div>
                        </div>
                        <span className="font-bold text-lg tracking-tight gradient-text hidden sm:inline-block">
                            Portfolio<span className="text-cyan-400">.3D</span>
                        </span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 bg-secondary/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-border/80 shadow-inner">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Action Controls (Theme, Language, Admin) */}
                    <div className="hidden sm:flex items-center gap-2">
                        {/* Language Switcher Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 hover:bg-secondary text-xs font-medium transition-colors"
                            >
                                <span>{currentLang.flag}</span>
                                <span>{currentLang.code.toUpperCase()}</span>
                                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                            </button>

                            {langDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-border bg-card p-1.5 shadow-xl z-50 backdrop-blur-xl">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${lang.code === currentLang.code ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{lang.flag}</span>
                                                <span>{lang.label}</span>
                                            </span>
                                            {lang.code === currentLang.code && <Check className="w-3.5 h-3.5 text-primary" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 rounded-lg border border-border bg-card/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {appearance === 'dark' ? (
                                <Sun className="w-4 h-4 text-amber-400" />
                            ) : (
                                <Moon className="w-4 h-4 text-purple-600" />
                            )}
                        </button>

                        {/* Admin CMS Access */}
                        <a
                            href="/admin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium text-xs shadow-md shadow-purple-500/20 hover:opacity-90 transition-opacity"
                        >
                            <Shield className="w-3.5 h-3.5" />
                            <span>{t('nav.admin')}</span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 sm:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg border border-border bg-card/60"
                        >
                            {appearance === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
                        </button>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg border border-border bg-card/60 text-foreground"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                {mobileMenuOpen && (
                    <div className="sm:hidden mt-3 p-4 rounded-2xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl space-y-3">
                        <nav className="flex flex-col space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                            <div className="flex gap-1.5">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`px-2.5 py-1 text-xs rounded-md border ${lang.code === currentLang.code ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground'}`}
                                    >
                                        {lang.flag} {lang.code.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <a
                                href="/admin"
                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-primary text-white text-xs font-medium"
                            >
                                <Shield className="w-3 h-3" />
                                <span>CMS</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
