"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useAppearance } from '@/hooks/use-appearance';
import PortfolioLikeButton from '@/components/portfolio/ui/PortfolioLikeButton';
import FlagIcon from '@/components/ui/FlagIcon';

interface NavbarProps {
    currentSection?: string;
}

const SECTION_IDS = ['hero', 'about', 'projects', 'skills', 'languages', 'certificates', 'news', 'contact'];

export default function Navbar({ currentSection }: NavbarProps) {
    const { t, i18n } = useTranslation();
    const { appearance, resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>(currentSection || 'hero');

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    setIsScrolled(scrollY > 20);

                    const windowHeight = window.innerHeight;
                    const documentHeight = document.documentElement.scrollHeight;

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
        languages.find((l) => l.code === (i18n.language?.split('-')[0] || 'en')) ||
        languages[0];

    const navLinks = [
        { href: '#hero', sectionId: 'hero', label: t('nav.home') },
        { href: '#about', sectionId: 'about', label: t('nav.about') },
        { href: '#projects', sectionId: 'projects', label: t('nav.projects') },
        { href: '#skills', sectionId: 'skills', label: t('nav.skills') },
        { href: '#languages', sectionId: 'languages', label: t('nav.languages') },
        { href: '#certificates', sectionId: 'certificates', label: t('nav.certificates') },
        { href: '#news', sectionId: 'news', label: t('nav.news') },
        { href: '#contact', sectionId: 'contact', label: t('nav.contact') },
    ];

    const toggleTheme = () =>
        updateAppearance(isDark ? 'light' : 'dark');

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
        setLangDropdownOpen(false);
    };

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        e.preventDefault();
        setActiveSection(sectionId);
        setMobileMenuOpen(false);

        if (sectionId === 'hero') {
            if (document.getElementById('hero')) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                window.location.href = '/#hero';
            }
            return;
        }

        const el = document.getElementById(sectionId);
        if (el) {
            const navbarOffset = 76;
            const elementPosition = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: Math.max(0, elementPosition - navbarOffset),
                behavior: 'smooth',
            });
        } else {
            window.location.href = `/#${sectionId}`;
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? isDark
                        ? 'py-3 bg-black/85 backdrop-blur-md border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                        : 'py-3 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
                    : isDark
                        ? 'py-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent'
                        : 'py-5 bg-gradient-to-b from-white/90 via-white/40 to-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-4">

                    {/* ── Brand Logo ── */}
                    <a href="#" className="flex items-center gap-2.5 group select-none flex-shrink-0">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 p-[1.5px] shadow-[0_0_20px_rgba(168,85,247,0.35)] group-hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-300">
                            <div className={`w-full h-full rounded-[14px] flex items-center justify-center ${isDark ? 'bg-black/90' : 'bg-white/95'}`}>
                                <Sparkles className="w-5 h-5 text-purple-500 dark:text-cyan-400 group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                            </div>
                        </div>
                        <span className={`font-extrabold text-lg tracking-tight hidden sm:inline-block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            DIO<span className="bg-gradient-to-r from-purple-600 to-cyan-500 dark:from-cyan-400 dark:to-purple-400 bg-clip-text text-transparent">STACK</span>
                        </span>
                    </a>

                    {/* ── Desktop Navigation Capsule ── */}
                    <nav className={`hidden lg:flex items-center gap-1 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm ${
                        isDark 
                            ? 'bg-black/80 border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.5)]' 
                            : 'bg-white/90 border-slate-200/90 shadow-[0_4px_16px_rgba(0,0,0,0.04)]'
                    }`}>
                        {navLinks.map((link) => {
                            const isActive = activeSection === link.sectionId;
                            return (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.sectionId)}
                                    className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 select-none ${
                                        isActive
                                            ? isDark
                                                 ? 'bg-gradient-to-r from-purple-600/50 to-cyan-600/40 text-white font-semibold border border-white/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                                                : 'bg-gradient-to-r from-purple-100 to-cyan-50 text-purple-900 font-bold border border-purple-200 shadow-sm'
                                            : isDark
                                                ? 'text-white/70 hover:text-white hover:bg-white/10'
                                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {isActive && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
                                    )}
                                    <span>{link.label}</span>
                                </a>
                            );
                        })}
                    </nav>

                    {/* ── Action Controls Capsule ── */}
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        
                        {/* Language & Theme Combined Container */}
                        <div className={`flex items-center gap-1 backdrop-blur-md p-1 rounded-2xl border ${
                            isDark 
                                ? 'bg-black/80 border-white/15 shadow-[0_4px_20px_rgba(0,0,0,0.4)]' 
                                : 'bg-white/90 border-slate-200/90 shadow-sm'
                        }`}>
                            {/* Language Switcher */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                    aria-label={`Select language (current: ${currentLang.label})`}
                                    title={`Language: ${currentLang.label}`}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all select-none ${
                                        isDark 
                                            ? 'hover:bg-white/10 text-white/90' 
                                            : 'hover:bg-slate-100 text-slate-800'
                                    }`}
                                >
                                    <span className="w-5 h-3.5 rounded-[2px] overflow-hidden border border-black/15 dark:border-white/20 shadow-xs flex-shrink-0 inline-flex items-center justify-center">
                                        <FlagIcon code={currentLang.code} className="w-full h-full object-cover" />
                                    </span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 opacity-100' : isDark ? 'text-white/60' : 'text-slate-500'}`} />
                                </button>

                                {langDropdownOpen && (
                                    <div className={`absolute right-0 mt-2 w-44 rounded-2xl border p-1.5 shadow-2xl z-50 backdrop-blur-md ${
                                        isDark 
                                            ? 'border-white/15 bg-black/95 text-white' 
                                            : 'border-slate-200 bg-white/95 text-slate-900'
                                    }`}>
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                type="button"
                                                onClick={() => changeLanguage(lang.code)}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors ${
                                                    lang.code === currentLang.code
                                                        ? isDark
                                                            ? 'bg-purple-600/30 text-purple-200 font-bold border border-purple-500/30'
                                                            : 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                                                        : isDark
                                                            ? 'hover:bg-white/10 text-white/70 hover:text-white'
                                                            : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                                                }`}
                                            >
                                                <span className="flex items-center gap-2.5">
                                                    <span className="w-5 h-3.5 rounded-[2px] overflow-hidden border border-black/15 dark:border-white/20 shadow-xs flex-shrink-0 inline-flex items-center justify-center">
                                                        <FlagIcon code={lang.code} className="w-full h-full object-cover" />
                                                    </span>
                                                    <span>{lang.label}</span>
                                                </span>
                                                {lang.code === currentLang.code && (
                                                    <Check className="w-3.5 h-3.5 text-cyan-500" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className={`w-[1px] h-4 ${isDark ? 'bg-white/15' : 'bg-slate-200'}`} />

                            {/* Theme Toggle */}
                            <button
                                type="button"
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className={`p-1.5 rounded-xl transition-all ${
                                    isDark ? 'hover:bg-white/10 text-white/80 hover:text-white' : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                                }`}
                            >
                                {isDark ? (
                                    <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                                ) : (
                                    <Moon className="w-4 h-4 text-purple-600 drop-shadow-[0_0_8px_rgba(147,51,234,0.4)]" />
                                )}
                            </button>
                        </div>

                        {/* Interactive Like Button */}
                        <PortfolioLikeButton variant="cosmic" idPrefix="global" />

                        {/* Resume Download Pill Button */}
                        <a
                            id="global-resume-download-btn"
                            href="/resume/download"
                            download
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold text-xs shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-200 active:scale-95 group cursor-pointer"
                            title={t('nav.downloadCv')}
                        >
                            <Download className="w-3.5 h-3.5 text-cyan-200 transition-transform duration-200 group-hover:translate-y-0.5" />
                            <span>{t('nav.resume')}</span>
                        </a>
                    </div>

                    {/* ── Mobile & Tablet Hamburger Controls (< 1024px) ── */}
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className={`p-2 rounded-xl border sm:hidden ${
                                isDark 
                                    ? 'bg-black/60 border-white/15 text-white/90' 
                                    : 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
                            }`}
                        >
                            {isDark ? (
                                <Sun className="w-4 h-4 text-amber-400" />
                            ) : (
                                <Moon className="w-4 h-4 text-purple-600" />
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle navigation menu"
                            className={`p-2 rounded-xl border ${
                                isDark 
                                    ? 'bg-black/60 border-white/15 text-white' 
                                    : 'bg-white/80 border-slate-200 text-slate-800 shadow-sm'
                            }`}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* ── Mobile Menu Dropdown ── */}
                {mobileMenuOpen && (
                    <div className={`lg:hidden mt-3 p-4 rounded-3xl border backdrop-blur-md shadow-2xl space-y-3 max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain ${
                        isDark 
                            ? 'border-white/15 bg-black/95 text-white' 
                            : 'border-slate-200 bg-white/95 text-slate-900'
                    }`}>
                        <nav className="flex flex-col space-y-1">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.sectionId;
                                return (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.sectionId)}
                                        className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm transition-all duration-200 ${
                                            isActive
                                                ? isDark
                                                    ? 'bg-purple-600/30 border border-purple-500/40 text-white font-bold shadow-md shadow-purple-500/20'
                                                    : 'bg-purple-100 border border-purple-200 text-purple-900 font-bold'
                                                : isDark
                                                    ? 'text-white/70 hover:text-white hover:bg-white/10 font-medium'
                                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                                        }`}
                                    >
                                        <span
                                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-cyan-400 shadow-sm shadow-cyan-400/80 animate-pulse'
                                                    : isDark ? 'bg-white/20' : 'bg-slate-300'
                                            }`}
                                        />
                                        <span>{link.label}</span>
                                    </a>
                                );
                            })}
                        </nav>

                        <div className={`pt-3 border-t flex flex-col gap-2.5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    id="mobile-global-resume-download-btn"
                                    href="/resume/download"
                                    download
                                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-xs font-bold shadow-md shadow-purple-500/30 active:scale-95 transition-all cursor-pointer"
                                >
                                    <Download className="w-3.5 h-3.5 text-cyan-200" />
                                    <span>{t('nav.resume')}</span>
                                </a>
                                <PortfolioLikeButton variant="cosmic" isMobile idPrefix="mobile-global" />
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-2">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-xl font-semibold border transition-all ${
                                                lang.code === currentLang.code
                                                    ? isDark
                                                        ? 'bg-purple-600/40 text-white border-purple-400 shadow-sm'
                                                        : 'bg-purple-600 text-white border-purple-600'
                                                    : isDark
                                                        ? 'border-white/10 text-white/60 hover:text-white'
                                                        : 'border-slate-200 text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <span className="w-4 h-3 rounded-[2px] overflow-hidden border border-black/15 dark:border-white/20 shadow-xs flex-shrink-0 inline-flex items-center justify-center">
                                                <FlagIcon code={lang.code} className="w-full h-full object-cover" />
                                            </span>
                                            <span>{lang.code.toUpperCase()}</span>
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
