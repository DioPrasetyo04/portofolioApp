'use client';

import {
    Sun,
    Moon,
    Sparkles,
    ChevronDown,
    Check,
    Menu,
    X,
    Download,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PortfolioLikeButton from '@/components/portfolio/ui/PortfolioLikeButton';
import FlagIcon from '@/components/ui/FlagIcon';
import { useAppearance } from '@/hooks/use-appearance';
import { heroConfig } from './hero.config';

export default function HeroNavbar() {
    const { t, i18n } = useTranslation();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('hero');

    const langDropdownRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuBtnRef = useRef<HTMLButtonElement>(null);

    // Scrollspy to automatically detect and highlight active section
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    setIsScrolled(scrollY > 25);

                    const windowHeight = window.innerHeight;
                    const documentHeight =
                        document.documentElement.scrollHeight;

                    // If user is at or near top of page, hero is active
                    if (scrollY < 120) {
                        setActiveSection('hero');
                        ticking = false;

                        return;
                    }

                    // If user is scrolled to bottom of page, contact is active
                    if (scrollY + windowHeight >= documentHeight - 70) {
                        setActiveSection('contact');
                        ticking = false;

                        return;
                    }

                    // Find which section top is past the trigger offset
                    const triggerOffset = 180;
                    let current = 'hero';

                    for (const link of heroConfig.navLinks) {
                        const el = document.getElementById(link.sectionId);

                        if (el) {
                            const rect = el.getBoundingClientRect();

                            if (rect.top <= triggerOffset) {
                                current = link.sectionId;
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

    // Close language dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                langDropdownRef.current &&
                !langDropdownRef.current.contains(event.target as Node)
            ) {
                setLangDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on outside click or Escape key
    useEffect(() => {
        if (!mobileMenuOpen) {
            return;
        }

        const handleOutsideClick = (event: MouseEvent) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                mobileMenuBtnRef.current &&
                !mobileMenuBtnRef.current.contains(event.target as Node)
            ) {
                setMobileMenuOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mobileMenuOpen]);

    const languages = [
        { code: 'en', label: 'EN', fullName: 'English' },
        { code: 'id', label: 'ID', fullName: 'Indonesia' },
        { code: 'zh', label: 'ZH', fullName: '中文' },
    ];

    const currentLang =
        languages.find(
            (l) => l.code === (i18n.language?.split('-')[0] || 'en'),
        ) || languages[0];

    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

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
            window.scrollTo({ top: 0, behavior: 'smooth' });

            return;
        }

        const element = document.getElementById(sectionId);

        if (element) {
            const navbarOffset = 76;
            const elementPosition =
                element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: Math.max(0, elementPosition - navbarOffset),
                behavior: 'smooth',
            });
        } else {
            // On subpages without matching section ID, navigate to homepage section
            window.location.assign(`/#${sectionId}`);
        }
    };

    const isSolid = isScrolled || mobileMenuOpen;

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
                isSolid
                    ? isDark
                        ? 'border-b border-white/10 bg-black/95 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-md sm:py-3'
                        : 'border-b border-indigo-100/60 bg-white/95 py-2.5 shadow-[0_6px_25px_rgba(99,102,241,0.08)] backdrop-blur-md sm:py-3'
                    : 'bg-transparent py-3 sm:py-5 lg:py-6'
            }`}
        >
            <div className="mx-auto max-w-[1440px] px-3.5 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                    {/* ── Brand Logo (Click to scroll to top) ── */}
                    <a
                        href="#hero"
                        onClick={(e) => handleNavClick(e, 'hero')}
                        className="group flex flex-shrink-0 items-center gap-2 select-none sm:gap-2.5"
                    >
                        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#C93A32] via-[#E50914] to-amber-500 p-[1.5px] shadow-[0_0_15px_rgba(201,58,50,0.4)] transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(229,9,20,0.7)] sm:h-10 sm:w-10">
                            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black/90">
                                <Sparkles className="h-4 w-4 text-[#E50914] transition-transform duration-300 group-hover:rotate-12 sm:h-5 sm:w-5" />
                            </div>
                        </div>
                        <span className="font-hero text-base tracking-wider text-[var(--hero-fg)] uppercase sm:text-xl">
                            DIO<span className="text-[#C93A32]">STACK</span>
                        </span>
                    </a>

                    {/* ── Center Editorial Links: All 8 Sections (Desktop >= 1024px) ── */}
                    <nav
                        className={`hidden items-center gap-1 rounded-full border px-3 py-1.5 backdrop-blur-sm transition-all duration-300 lg:flex xl:gap-1.5 ${
                            isDark
                                ? 'border-white/12 bg-black/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
                                : 'border-black/10 bg-white/90 shadow-[0_4px_16px_rgba(0,0,0,0.05)]'
                        }`}
                    >
                        {heroConfig.navLinks.map((link) => {
                            const isActive = activeSection === link.sectionId;

                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) =>
                                        handleNavClick(e, link.sectionId)
                                    }
                                    className={`font-hero-condensed group relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs tracking-wider uppercase transition-all duration-200 select-none xl:px-3 xl:text-sm ${
                                        isActive
                                            ? isDark
                                                ? 'border border-[#E50914]/60 bg-gradient-to-r from-[#C93A32]/45 to-[#E50914]/30 font-bold text-white shadow-[0_0_16px_rgba(201,58,50,0.5)]'
                                                : 'border border-[#C93A32]/40 bg-[#C93A32]/15 font-bold text-[#C93A32] shadow-sm'
                                            : isDark
                                              ? 'text-white/70 hover:bg-white/10 hover:text-white'
                                              : 'text-neutral-600 hover:bg-black/5 hover:text-neutral-900'
                                    }`}
                                >
                                    {isActive && (
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#E50914] shadow-[0_0_8px_rgba(229,9,20,1)]" />
                                    )}
                                    <span>{t(link.labelKey)}</span>
                                </a>
                            );
                        })}
                    </nav>

                    {/* ── Right Actions: Like Button + Resume Button + Theme Toggle + Language Switch + Mobile Menu ── */}
                    <div className="flex flex-shrink-0 items-center gap-1.5 sm:gap-2.5">
                        {/* Interactive Like Button (Desktop & Tablet >= 768px; also inside mobile drawer) */}
                        <div className="hidden md:inline-flex">
                            <PortfolioLikeButton
                                variant="hero"
                                idPrefix="hero"
                            />
                        </div>

                        {/* Resume Download Pill Button (Desktop & Small Tablet >= 640px; also inside mobile drawer) */}
                        <a
                            id="hero-resume-download-btn"
                            href="/resume/download"
                            download
                            className="font-hero-condensed group hidden h-9 cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-[#C93A32] via-[#E50914] to-amber-500 px-3 text-xs tracking-wider text-white uppercase shadow-[0_0_16px_rgba(201,58,50,0.4)] transition-all duration-300 select-none hover:scale-[1.03] hover:from-[#E50914] hover:to-amber-400 hover:shadow-[0_0_24px_rgba(229,9,20,0.7)] active:scale-95 sm:inline-flex sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
                            title={t('nav.downloadCv')}
                        >
                            <Download className="h-3.5 w-3.5 text-amber-100 transition-transform duration-300 group-hover:translate-y-0.5 sm:h-4 sm:w-4" />
                            <span className="font-bold">{t('nav.resume')}</span>
                        </a>

                        {/* Theme Toggle Button */}
                        <button
                            id="hero-theme-toggle-btn"
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle dark and light theme"
                            className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--hero-pill-border)] text-[var(--hero-fg)] transition-colors hover:border-[#C93A32] hover:bg-[var(--hero-pill-hover)] sm:h-10 sm:w-10"
                        >
                            {isDark ? (
                                <Sun className="h-3.5 w-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)] sm:h-4 sm:w-4" />
                            ) : (
                                <Moon className="h-3.5 w-3.5 text-slate-800 sm:h-4 sm:w-4" />
                            )}
                        </button>

                        {/* Language Dropdown */}
                        <div
                            className="relative flex-shrink-0"
                            ref={langDropdownRef}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setLangDropdownOpen(!langDropdownOpen)
                                }
                                aria-label={`Select language (current: ${currentLang.fullName})`}
                                title={`Language: ${currentLang.fullName}`}
                                className="flex h-8 cursor-pointer items-center gap-1 rounded-full border border-[var(--hero-pill-border)] px-2 text-[var(--hero-fg)] transition-colors select-none hover:border-[#C93A32] hover:bg-[var(--hero-pill-hover)] sm:h-10 sm:gap-1.5 sm:px-3"
                            >
                                <span className="inline-flex h-3 w-4 flex-shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-black/15 shadow-xs sm:h-3.5 sm:w-5 sm:rounded-[2.5px] dark:border-white/20">
                                    <FlagIcon
                                        code={currentLang.code}
                                        className="h-full w-full object-cover"
                                    />
                                </span>
                                <ChevronDown
                                    className={`h-3 w-3 transition-transform duration-200 sm:h-3.5 sm:w-3.5 ${
                                        langDropdownOpen
                                            ? 'rotate-180 opacity-100'
                                            : 'opacity-70'
                                    }`}
                                />
                            </button>

                            {langDropdownOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-40 animate-in rounded-2xl border border-[var(--hero-strip-border)] bg-[var(--hero-badge-bg)] p-1.5 text-[var(--hero-fg)] shadow-2xl backdrop-blur-sm duration-150 zoom-in-95 fade-in">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() =>
                                                changeLanguage(lang.code)
                                            }
                                            className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                                                lang.code === currentLang.code
                                                    ? 'bg-[#C93A32]/20 font-bold text-[#C93A32]'
                                                    : 'hover:bg-[var(--hero-pill-hover)]'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <span className="inline-flex h-3.5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-black/15 shadow-xs dark:border-white/20">
                                                    <FlagIcon
                                                        code={lang.code}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </span>
                                                <span>{lang.fullName}</span>
                                            </span>
                                            {lang.code === currentLang.code && (
                                                <Check className="h-3.5 w-3.5 text-[#C93A32]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile & Tablet Hamburger Button (< 1024px) */}
                        <button
                            ref={mobileMenuBtnRef}
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                            aria-expanded={mobileMenuOpen}
                            className={`flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border transition-all sm:h-10 sm:w-10 lg:hidden ${
                                mobileMenuOpen
                                    ? 'border-[#E50914] bg-[#E50914]/15 text-[#E50914] shadow-[0_0_12px_rgba(229,9,20,0.4)]'
                                    : 'border-[var(--hero-pill-border)] text-[var(--hero-fg)] hover:border-[#C93A32] hover:bg-[var(--hero-pill-hover)]'
                            }`}
                        >
                            {mobileMenuOpen ? (
                                <X className="h-4 w-4" />
                            ) : (
                                <Menu className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                </div>

                {/* ── Mobile & Tablet Drawer Menu (< 1024px) ── */}
                {mobileMenuOpen && (
                    <div
                        ref={mobileMenuRef}
                        className="mt-2.5 max-h-[calc(100dvh-5.5rem)] animate-in space-y-3.5 overflow-y-auto overscroll-contain rounded-2xl border border-[var(--hero-strip-border)] bg-[var(--hero-badge-bg)] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl duration-200 fade-in slide-in-from-top-2 sm:mt-3 sm:rounded-3xl sm:p-5 lg:hidden"
                    >
                        <nav className="flex flex-col gap-1">
                            {heroConfig.navLinks.map((link, index) => {
                                const isActive =
                                    activeSection === link.sectionId;
                                const indexStr = String(index + 1).padStart(
                                    2,
                                    '0',
                                );

                                return (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) =>
                                            handleNavClick(e, link.sectionId)
                                        }
                                        className={`font-hero flex items-center justify-between rounded-xl px-3 py-2 text-sm tracking-wider uppercase transition-all duration-200 sm:px-3.5 sm:py-2.5 sm:text-base ${
                                            isActive
                                                ? isDark
                                                    ? 'border border-[#C93A32]/40 bg-[#C93A32]/25 text-[#E50914] shadow-sm'
                                                    : 'border border-[#C93A32]/30 bg-[#C93A32]/15 font-bold text-[#C93A32]'
                                                : 'text-[var(--hero-fg)] hover:bg-[var(--hero-pill-hover)]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {isActive ? (
                                                <span className="h-2 w-2 animate-pulse rounded-full bg-[#E50914] shadow-[0_0_8px_rgba(229,9,20,1)]" />
                                            ) : (
                                                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-25" />
                                            )}
                                            <span>{t(link.labelKey)}</span>
                                        </div>
                                        <span className="font-hero-condensed text-[11px] tracking-widest opacity-50 sm:text-xs">
                                            {indexStr}
                                        </span>
                                    </a>
                                );
                            })}
                        </nav>

                        {/* Mobile Actions: Resume Download + Interactive Like Button */}
                        <div className="flex flex-col gap-2.5 border-t border-[var(--hero-strip-border)] pt-3">
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    id="mobile-hero-resume-download-btn"
                                    href="/resume/download"
                                    download
                                    className="font-hero flex h-10 w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#C93A32] via-[#E50914] to-amber-500 px-3 text-xs tracking-wider text-white uppercase shadow-md shadow-[#C93A32]/30 transition-all select-none hover:from-[#E50914] hover:to-amber-400 active:scale-95 sm:text-sm"
                                >
                                    <Download className="h-3.5 w-3.5 text-amber-100" />
                                    <span className="font-bold">
                                        {t('nav.resume')}
                                    </span>
                                </a>
                                <PortfolioLikeButton
                                    variant="hero"
                                    isMobile
                                    idPrefix="mobile-hero"
                                    className="!h-10 !rounded-xl"
                                />
                            </div>

                            {/* Mobile Language Switcher Row in Drawer */}
                            <div className="flex items-center justify-between pt-1 text-xs">
                                <span className="font-hero-condensed text-xs tracking-wider text-[var(--hero-fg-muted)] uppercase">
                                    {t('nav.language') || 'Language'}
                                </span>
                                <div className="flex items-center gap-1.5">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() =>
                                                changeLanguage(lang.code)
                                            }
                                            className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
                                                lang.code === currentLang.code
                                                    ? 'border-[#E50914]/50 bg-[#C93A32]/20 font-bold text-[#E50914] shadow-xs'
                                                    : 'border-[var(--hero-strip-border)] text-[var(--hero-fg)] hover:bg-[var(--hero-pill-hover)]'
                                            }`}
                                        >
                                            <span className="inline-flex h-3 w-4 flex-shrink-0 items-center justify-center overflow-hidden rounded-[2px] border border-black/15 dark:border-white/20">
                                                <FlagIcon
                                                    code={lang.code}
                                                    className="h-full w-full object-cover"
                                                />
                                            </span>
                                            <span>{lang.label}</span>
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
