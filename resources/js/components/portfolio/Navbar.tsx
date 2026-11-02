'use client';

import {
    Sun,
    Moon,
    Sparkles,
    Check,
    ChevronDown,
    Menu,
    X,
    Download,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PortfolioLikeButton from '@/components/portfolio/ui/PortfolioLikeButton';
import FlagIcon from '@/components/ui/FlagIcon';
import { useAppearance } from '@/hooks/use-appearance';

interface NavbarProps {
    currentSection?: string;
}

const SECTION_IDS = [
    'hero',
    'about',
    'experience',
    'projects',
    'skills',
    'languages',
    'certificates',
    'news',
    'contact',
];

export default function Navbar({ currentSection }: NavbarProps) {
    const { t, i18n } = useTranslation();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>(
        currentSection || 'hero',
    );

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    setIsScrolled(scrollY > 20);

                    const windowHeight = window.innerHeight;
                    const documentHeight =
                        document.documentElement.scrollHeight;

                    if (scrollY < 120) {
                        setActiveSection('hero');
                        ticking = false;

                        return;
                    }

                    if (scrollY + windowHeight >= documentHeight - 70) {
                        setActiveSection('contact');
                        ticking = false;

                        return;
                    }

                    const triggerOffset = 180;
                    let current = 'hero';

                    for (const id of SECTION_IDS) {
                        const el = document.getElementById(id);

                        if (el) {
                            const rect = el.getBoundingClientRect();

                            if (rect.top <= triggerOffset) {
                                current = id;
                            }
                        }
                    }

                    setActiveSection(current);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'id', label: 'Indonesia' },
        { code: 'zh', label: '中文 (Chinese)' },
    ];

    const currentLang =
        languages.find(
            (l) => l.code === (i18n.language?.split('-')[0] || 'en'),
        ) || languages[0];

    const navLinks = [
        { href: '#hero', sectionId: 'hero', label: t('nav.home') },
        { href: '#about', sectionId: 'about', label: t('nav.about') },
        {
            href: '#experience',
            sectionId: 'experience',
            label: t('nav.experience'),
        },
        { href: '#projects', sectionId: 'projects', label: t('nav.projects') },
        { href: '#skills', sectionId: 'skills', label: t('nav.skills') },
        {
            href: '#languages',
            sectionId: 'languages',
            label: t('nav.languages'),
        },
        {
            href: '#certificates',
            sectionId: 'certificates',
            label: t('nav.certificates'),
        },
        { href: '#news', sectionId: 'news', label: t('nav.news') },
        { href: '#contact', sectionId: 'contact', label: t('nav.contact') },
    ];

    const toggleTheme = () => updateAppearance(isDark ? 'light' : 'dark');

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setLangDropdownOpen(false);
    };

    const handleNavClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        sectionId: string,
    ) => {
        e.preventDefault();
        setActiveSection(sectionId);
        setMobileMenuOpen(false);

        if (sectionId === 'hero') {
            if (document.getElementById('hero')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.location.assign('/#hero');
            }

            return;
        }

        const el = document.getElementById(sectionId);

        if (el) {
            const navbarOffset = 76;
            const elementPosition =
                el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: Math.max(0, elementPosition - navbarOffset),
                behavior: 'smooth',
            });
        } else {
            window.location.assign(`/#${sectionId}`);
        }
    };

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? isDark
                        ? 'border-b border-white/10 bg-black/85 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md'
                        : 'border-b border-slate-200/80 bg-white/90 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.06)] backdrop-blur-md'
                    : isDark
                      ? 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
                      : 'bg-gradient-to-b from-white/90 via-white/40 to-transparent py-5'
            }`}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">
                    {/* ── Brand Logo ── */}
                    <a
                        href="#"
                        className="group flex flex-shrink-0 items-center gap-2.5 select-none"
                    >
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]">
                            <div
                                className={`flex h-full w-full items-center justify-center rounded-[14px] ${isDark ? 'bg-black/90' : 'bg-white/95'}`}
                            >
                                <Sparkles className="h-5 w-5 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)] transition-transform duration-300 group-hover:rotate-12 dark:text-cyan-400" />
                            </div>
                        </div>
                        <span
                            className={`hidden text-lg font-extrabold tracking-tight sm:inline-block ${isDark ? 'text-white' : 'text-slate-900'}`}
                        >
                            DIO
                            <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent dark:from-cyan-400 dark:to-purple-400">
                                STACK
                            </span>
                        </span>
                    </a>

                    {/* ── Desktop Navigation Capsule ── */}
                    <nav
                        className={`hidden items-center gap-1 rounded-full border px-3 py-1.5 shadow-sm backdrop-blur-md lg:flex ${
                            isDark
                                ? 'border-white/15 bg-black/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
                                : 'border-slate-200/90 bg-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
                        }`}
                    >
                        {navLinks.map((link) => {
                            const isActive = activeSection === link.sectionId;

                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) =>
                                        handleNavClick(e, link.sectionId)
                                    }
                                    className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 select-none ${
                                        isActive
                                            ? isDark
                                                ? 'border border-white/20 bg-gradient-to-r from-purple-600/50 to-cyan-600/40 font-semibold text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                                : 'border border-purple-200 bg-gradient-to-r from-purple-100 to-cyan-50 font-bold text-purple-900 shadow-sm'
                                            : isDark
                                              ? 'text-white/70 hover:bg-white/10 hover:text-white'
                                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {isActive && (
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,1)]" />
                                    )}
                                    <span>{link.label}</span>
                                </a>
                            );
                        })}
                    </nav>

                    {/* ── Action Controls Capsule ── */}
                    <div className="hidden flex-shrink-0 items-center gap-2 sm:flex">
                        {/* Language & Theme Combined Container */}
                        <div
                            className={`flex items-center gap-1 rounded-2xl border p-1 backdrop-blur-md ${
                                isDark
                                    ? 'border-white/15 bg-black/80 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                                    : 'border-slate-200/90 bg-white/90 shadow-sm'
                            }`}
                        >
                            {/* Language Switcher */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setLangDropdownOpen(!langDropdownOpen)
                                    }
                                    aria-label={`Select language (current: ${currentLang.label})`}
                                    title={`Language: ${currentLang.label}`}
                                    className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all select-none ${
                                        isDark
                                            ? 'text-white/90 hover:bg-white/10'
                                            : 'text-slate-800 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="inline-flex h-3.5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-black/15 shadow-xs dark:border-white/20">
                                        <FlagIcon
                                            code={currentLang.code}
                                            className="h-full w-full object-cover"
                                        />
                                    </span>
                                    <ChevronDown
                                        className={`h-3.5 w-3.5 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 opacity-100' : isDark ? 'text-white/60' : 'text-slate-500'}`}
                                    />
                                </button>

                                {langDropdownOpen && (
                                    <div
                                        className={`absolute right-0 z-50 mt-2 w-44 rounded-2xl border p-1.5 shadow-2xl backdrop-blur-md ${
                                            isDark
                                                ? 'border-white/15 bg-black/95 text-white'
                                                : 'border-slate-200 bg-white/95 text-slate-900'
                                        }`}
                                    >
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                onClick={() =>
                                                    changeLanguage(lang.code)
                                                }
                                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors ${
                                                    lang.code ===
                                                    currentLang.code
                                                        ? isDark
                                                            ? 'border border-purple-500/30 bg-purple-600/30 font-bold text-purple-200'
                                                            : 'border border-purple-200 bg-purple-50 font-bold text-purple-700'
                                                        : isDark
                                                          ? 'text-white/70 hover:bg-white/10 hover:text-white'
                                                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <span className="inline-flex h-3.5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-black/15 shadow-xs dark:border-white/20">
                                                        <FlagIcon
                                                            code={lang.code}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </span>
                                                    <span>{lang.label}</span>
                                                </span>
                                                {lang.code ===
                                                    currentLang.code && (
                                                    <Check className="h-3.5 w-3.5 text-cyan-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div
                                className={`h-4 w-[1px] ${isDark ? 'bg-white/15' : 'bg-slate-200'}`}
                            />

                            {/* Theme Toggle */}
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className={`rounded-xl p-1.5 transition-all ${
                                    isDark
                                        ? 'text-white/80 hover:bg-white/10 hover:text-white'
                                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                {isDark ? (
                                    <Sun className="h-4 w-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                                ) : (
                                    <Moon className="h-4 w-4 text-purple-600 drop-shadow-[0_0_8px_rgba(147,51,234,0.4)]" />
                                )}
                            </button>
                        </div>

                        {/* Interactive Like Button */}
                        <PortfolioLikeButton
                            variant="cosmic"
                            idPrefix="global"
                        />

                        {/* Resume Download Pill Button */}
                        <a
                            id="global-resume-download-btn"
                            href="/resume/download"
                            download
                            className="group flex cursor-pointer items-center gap-1.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all duration-200 hover:from-purple-500 hover:to-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95"
                            title={t('nav.downloadCv')}
                        >
                            <Download className="h-3.5 w-3.5 text-cyan-200 transition-transform duration-200 group-hover:translate-y-0.5" />
                            <span>{t('nav.resume')}</span>
                        </a>
                    </div>

                    {/* ── Mobile & Tablet Hamburger Controls (< 1024px) ── */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className={`rounded-xl border p-2 sm:hidden ${
                                isDark
                                    ? 'border-white/15 bg-black/60 text-white/90'
                                    : 'border-slate-200 bg-white/80 text-slate-800 shadow-sm'
                            }`}
                        >
                            {isDark ? (
                                <Sun className="h-4 w-4 text-amber-400" />
                            ) : (
                                <Moon className="h-4 w-4 text-purple-600" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                            className={`rounded-xl border p-2 ${
                                isDark
                                    ? 'border-white/15 bg-black/60 text-white'
                                    : 'border-slate-200 bg-white/80 text-slate-800 shadow-sm'
                            }`}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-5 w-5" />
                            ) : (
                                <Menu className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Mobile Menu Dropdown ── */}
                {mobileMenuOpen && (
                    <div
                        className={`mt-3 max-h-[calc(100dvh-5rem)] space-y-3 overflow-y-auto overscroll-contain rounded-3xl border p-4 shadow-2xl backdrop-blur-md lg:hidden ${
                            isDark
                                ? 'border-white/15 bg-black/95 text-white'
                                : 'border-slate-200 bg-white/95 text-slate-900'
                        }`}
                    >
                        <nav className="flex flex-col space-y-1">
                            {navLinks.map((link) => {
                                const isActive =
                                    activeSection === link.sectionId;

                                return (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) =>
                                            handleNavClick(e, link.sectionId)
                                        }
                                        className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm transition-all duration-200 ${
                                            isActive
                                                ? isDark
                                                    ? 'border border-purple-500/40 bg-purple-600/30 font-bold text-white shadow-md shadow-purple-500/20'
                                                    : 'border border-purple-200 bg-purple-100 font-bold text-purple-900'
                                                : isDark
                                                  ? 'font-medium text-white/70 hover:bg-white/10 hover:text-white'
                                                  : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                        }`}
                                    >
                                        <span
                                            className={`h-2 w-2 rounded-full transition-all duration-200 ${
                                                isActive
                                                    ? 'animate-pulse bg-cyan-400 shadow-sm shadow-cyan-400/80'
                                                    : isDark
                                                      ? 'bg-white/20'
                                                      : 'bg-slate-300'
                                            }`}
                                        />
                                        <span>{link.label}</span>
                                    </a>
                                );
                            })}
                        </nav>

                        <div
                            className={`flex flex-col gap-2.5 border-t pt-3 ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                        >
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    id="mobile-global-resume-download-btn"
                                    href="/resume/download"
                                    download
                                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-3 py-2 text-xs font-bold text-white shadow-md shadow-purple-500/30 transition-all active:scale-95"
                                >
                                    <Download className="h-3.5 w-3.5 text-cyan-200" />
                                    <span>{t('nav.resume')}</span>
                                </a>
                                <PortfolioLikeButton
                                    variant="cosmic"
                                    isMobile
                                    idPrefix="mobile-global"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-2">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() =>
                                                changeLanguage(lang.code)
                                            }
                                            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                                                lang.code === currentLang.code
                                                    ? isDark
                                                        ? 'border-purple-400 bg-purple-600/40 text-white shadow-sm'
                                                        : 'border-purple-600 bg-purple-600 text-white'
                                                    : isDark
                                                      ? 'border-white/10 text-white/60 hover:text-white'
                                                      : 'border-slate-200 text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <span className="inline-flex h-3 w-4 flex-shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-black/15 shadow-xs dark:border-white/20">
                                                <FlagIcon
                                                    code={lang.code}
                                                    className="h-full w-full object-cover"
                                                />
                                            </span>
                                            <span>
                                                {lang.code.toUpperCase()}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
