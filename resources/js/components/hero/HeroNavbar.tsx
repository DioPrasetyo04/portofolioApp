"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Sparkles, ChevronDown, Check, Menu, X, Download } from 'lucide-react';
import { useAppearance } from '@/hooks/use-appearance';
import { heroConfig } from './hero.config';
import PortfolioLikeButton from '@/components/portfolio/ui/PortfolioLikeButton';
import FlagIcon from '@/components/ui/FlagIcon';

export default function HeroNavbar() {
    const { t, i18n } = useTranslation();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('hero');

    const langDropdownRef = useRef<HTMLDivElement>(null);

    // Scrollspy to automatically detect and highlight active section
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    setIsScrolled(scrollY > 25);

                    const windowHeight = window.innerHeight;
                    const documentHeight = document.documentElement.scrollHeight;

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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const languages = [
        { code: 'en', label: 'EN', fullName: 'English' },
        { code: 'id', label: 'ID', fullName: 'Indonesia' },
        { code: 'zh', label: 'ZH', fullName: '中文' },
    ];

    const currentLang =
        languages.find((l) => l.code === (i18n.language?.split('-')[0] || 'en')) ||
        languages[0];

    const toggleTheme = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setLangDropdownOpen(false);
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
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
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: Math.max(0, elementPosition - navbarOffset),
                behavior: 'smooth',
            });
        } else {
            // On subpages without matching section ID, navigate to homepage section
            window.location.href = `/#${sectionId}`;
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? isDark
                        ? 'py-3 bg-black/90 backdrop-blur-sm border-b border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.85)]'
                        : 'py-3 bg-white/90 backdrop-blur-sm border-b border-indigo-100/60 shadow-[0_6px_25px_rgba(99,102,241,0.08)]'
                    : 'py-5 sm:py-6 bg-transparent'
            }`}
        >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between gap-3 lg:gap-4">
                    {/* ── Brand Logo (Click to scroll to top) ── */}
                    <a
                        href="#hero"
                        onClick={(e) => handleNavClick(e, 'hero')}
                        className="flex items-center gap-2.5 group select-none flex-shrink-0"
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#C93A32] via-[#E50914] to-amber-500 p-[1.5px] shadow-[0_0_15px_rgba(201,58,50,0.4)] group-hover:shadow-[0_0_24px_rgba(229,9,20,0.7)] transition-all duration-300">
                            <div className="w-full h-full rounded-[10px] flex items-center justify-center bg-black/90">
                                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#E50914] group-hover:rotate-12 transition-transform duration-300" />
                            </div>
                        </div>
                        <span className="font-hero text-lg sm:text-xl tracking-wider text-[var(--hero-fg)] uppercase">
                            DIO<span className="text-[#C93A32]">STACK</span>
                        </span>
                    </a>

                    {/* ── Center Editorial Links: All 8 Sections (Desktop >= 1024px) ── */}
                    <nav
                        className={`hidden lg:flex items-center gap-1 xl:gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-sm ${
                            isDark
                                ? 'bg-black/80 border-white/12 shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
                                : 'bg-white/90 border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.05)]'
                        }`}
                    >
                        {heroConfig.navLinks.map((link) => {
                            const isActive = activeSection === link.sectionId;
                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.sectionId)}
                                    className={`font-hero-condensed text-xs xl:text-sm tracking-wider uppercase px-2.5 xl:px-3 py-1 rounded-full transition-all duration-200 relative group flex items-center gap-1.5 select-none ${
                                        isActive
                                            ? isDark
                                                ? 'bg-gradient-to-r from-[#C93A32]/45 to-[#E50914]/30 text-white font-bold border border-[#E50914]/60 shadow-[0_0_16px_rgba(201,58,50,0.5)]'
                                                : 'bg-[#C93A32]/15 text-[#C93A32] font-bold border border-[#C93A32]/40 shadow-sm'
                                            : isDark
                                                ? 'text-white/70 hover:text-white hover:bg-white/10'
                                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-black/5'
                                    }`}
                                >
                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] shadow-[0_0_8px_rgba(229,9,20,1)] animate-pulse" />
                                    )}
                                    <span>{t(link.labelKey)}</span>
                                </a>
                            );
                        })}
                    </nav>

                    {/* ── Right Actions: Like Button + Resume Button + Theme Toggle + Language Switch + Mobile Menu ── */}
                    <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">

                        {/* Interactive Like Button */}
                        <PortfolioLikeButton variant="hero" idPrefix="hero" />

                        {/* Resume Download Pill Button */}
                        <a
                            id="hero-resume-download-btn"
                            href="/resume/download"
                            download
                            className="h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-gradient-to-r from-[#C93A32] via-[#E50914] to-amber-500 hover:from-[#E50914] hover:to-amber-400 text-white font-hero-condensed text-xs sm:text-sm tracking-wider uppercase flex items-center gap-1.5 sm:gap-2 shadow-[0_0_16px_rgba(201,58,50,0.4)] hover:shadow-[0_0_24px_rgba(229,9,20,0.7)] hover:scale-[1.03] active:scale-95 transition-all duration-300 select-none group cursor-pointer"
                            title={t('nav.downloadCv')}
                        >
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-100 transition-transform duration-300 group-hover:translate-y-0.5" />
                            <span className="font-bold">{t('nav.resume')}</span>
                        </a>

                        {/* Theme Toggle Button */}
                        <button
                            id="hero-theme-toggle-btn"
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle dark and light theme"
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--hero-pill-border)] flex items-center justify-center text-[var(--hero-fg)] hover:bg-[var(--hero-pill-hover)] hover:border-[#C93A32] transition-colors cursor-pointer pointer-events-auto"
                        >
                            {isDark ? (
                                <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                            ) : (
                                <Moon className="w-4 h-4 text-slate-800" />
                            )}
                        </button>

                        {/* Language Dropdown */}
                        <div className="relative" ref={langDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                aria-label={`Select language (current: ${currentLang.fullName})`}
                                title={`Language: ${currentLang.fullName}`}
                                className="h-9 sm:h-10 px-2.5 sm:px-3 rounded-full border border-[var(--hero-pill-border)] flex items-center gap-1.5 text-[var(--hero-fg)] hover:bg-[var(--hero-pill-hover)] hover:border-[#C93A32] transition-colors cursor-pointer select-none"
                            >
                                <span className="w-5 h-3.5 rounded-[2.5px] overflow-hidden border border-black/15 dark:border-white/20 shadow-xs flex-shrink-0 inline-flex items-center justify-center">
                                    <FlagIcon code={currentLang.code} className="w-full h-full object-cover" />
                                </span>
                                <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                        langDropdownOpen ? 'rotate-180 opacity-100' : 'opacity-70'
                                    }`}
                                />
                            </button>

                            {langDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-[var(--hero-strip-border)] p-1.5 shadow-2xl z-50 backdrop-blur-sm bg-[var(--hero-badge-bg)] text-[var(--hero-fg)] animate-in fade-in zoom-in-95 duration-150">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                                                lang.code === currentLang.code
                                                    ? 'bg-[#C93A32]/20 text-[#C93A32] font-bold'
                                                    : 'hover:bg-[var(--hero-pill-hover)]'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2.5">
                                                <span className="w-5 h-3.5 rounded-[2px] overflow-hidden border border-black/15 dark:border-white/20 shadow-xs flex-shrink-0 inline-flex items-center justify-center">
                                                    <FlagIcon code={lang.code} className="w-full h-full object-cover" />
                                                </span>
                                                <span>{lang.fullName}</span>
                                            </span>
                                            {lang.code === currentLang.code && (
                                                <Check className="w-3.5 h-3.5 text-[#C93A32]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Hamburger Button (< 1024px) */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                            className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[var(--hero-pill-border)] flex items-center justify-center text-[var(--hero-fg)] hover:bg-[var(--hero-pill-hover)] hover:border-[#C93A32] transition-colors cursor-pointer"
                        >
                            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile & Tablet Drawer Menu (< 1024px) ── */}
                {mobileMenuOpen && (
                    <div className="lg:hidden mt-3 p-4 sm:p-5 rounded-3xl border border-[var(--hero-strip-border)] bg-[var(--hero-badge-bg)] shadow-2xl backdrop-blur-sm space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <nav className="flex flex-col gap-1.5">
                            {heroConfig.navLinks.map((link, index) => {
                                const isActive = activeSection === link.sectionId;
                                const indexStr = String(index + 1).padStart(2, '0');
                                return (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.sectionId)}
                                        className={`font-hero text-base tracking-wider py-2.5 px-3.5 rounded-xl uppercase transition-all duration-200 flex items-center justify-between ${
                                            isActive
                                                ? isDark
                                                    ? 'bg-[#C93A32]/25 text-[#E50914] border border-[#C93A32]/40 shadow-sm'
                                                    : 'bg-[#C93A32]/15 text-[#C93A32] border border-[#C93A32]/30 font-bold'
                                                : 'text-[var(--hero-fg)] hover:bg-[var(--hero-pill-hover)]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            {isActive ? (
                                                <span className="w-2 h-2 rounded-full bg-[#E50914] shadow-[0_0_8px_rgba(229,9,20,1)] animate-pulse" />
                                            ) : (
                                                <span className="w-2 h-2 rounded-full bg-white/20" />
                                            )}
                                            <span>{t(link.labelKey)}</span>
                                        </div>
                                        <span className="font-hero-condensed text-xs opacity-50 tracking-widest">
                                            {indexStr}
                                        </span>
                                    </a>
                                );
                            })}
                        </nav>

                        {/* Mobile Actions: Resume Download + Interactive Like Button */}
                        <div className="pt-2.5 border-t border-[var(--hero-strip-border)] flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    id="mobile-hero-resume-download-btn"
                                    href="/resume/download"
                                    download
                                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#C93A32] via-[#E50914] to-amber-500 text-white font-hero text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-lg shadow-[#C93A32]/30 active:scale-95 transition-all cursor-pointer"
                                >
                                    <Download className="w-4 h-4 text-amber-100" />
                                    <span className="font-bold">{t('nav.resume')}</span>
                                </a>
                                <PortfolioLikeButton variant="hero" isMobile idPrefix="mobile-hero" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
