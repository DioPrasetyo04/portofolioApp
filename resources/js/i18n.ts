import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const resources = {
    en: {
        translation: {
            nav: {
                home: 'Home',
                about: 'About',
                projects: 'Projects',
                skills: 'Skills',
                languages: 'Languages',
                certificates: 'Certificates',
                news: 'News',
                contact: 'Contact',
                admin: 'Admin CMS',
            },
            hero: {
                badge: '✨ Available for Opportunities',
                viewProjects: 'Explore Projects',
                contactMe: 'Get In Touch',
                scrollDown: 'Scroll Down',
            },
            about: {
                title: 'About Me',
                subtitle: 'Transforming ideas into resilient code and immersive visuals',
                statsProjects: 'Projects Completed',
                statsCerts: 'Certifications',
                statsExp: 'Years Experience',
            },
            projects: {
                title: 'Featured Projects',
                subtitle: 'Hand-crafted digital experiences with clean architecture and modern tooling',
                liveDemo: 'Live Demo',
                sourceCode: 'Source Code',
                featured: 'Featured',
                viewAll: 'View All Projects',
            },
            techStack: {
                title: 'Tech Stack & Skills',
                subtitle: 'Technologies, languages, and frameworks I use to build scalable products',
                all: 'All Stack',
            },
            languages: {
                title: 'Language Proficiency',
                subtitle: 'Languages spoken and communication capabilities',
            },
            certificates: {
                title: 'Certifications & Accreditations',
                subtitle: 'Industry-recognized credentials validating specialized engineering expertise',
                verify: 'Verify Credential',
            },
            news: {
                title: 'Articles & Insights',
                subtitle: 'Thoughts on 3D creative development, clean architecture, and modern tech',
                readMore: 'Read Article',
                allArticles: 'View All Articles',
                backToHome: 'Back to Home',
                publishedOn: 'Published on',
                share: 'Share Article',
            },
            announcement: {
                modalTitle: 'Special Announcement',
                dontShowAgain: "Don't show this again",
                close: 'Got it!',
            },
            footer: {
                tagline: 'Crafted with Laravel, Inertia.js, React, Three.js & Tailwind CSS.',
                rights: 'All rights reserved.',
            },
        },
    },
    id: {
        translation: {
            nav: {
                home: 'Beranda',
                about: 'Tentang',
                projects: 'Proyek',
                skills: 'Keahlian',
                languages: 'Bahasa',
                certificates: 'Sertifikat',
                news: 'Berita',
                contact: 'Kontak',
                admin: 'Admin CMS',
            },
            hero: {
                badge: '✨ Terbuka untuk Peluang Baru',
                viewProjects: 'Jelajahi Proyek',
                contactMe: 'Hubungi Saya',
                scrollDown: 'Gulir ke Bawah',
            },
            about: {
                title: 'Tentang Saya',
                subtitle: 'Mengubah ide menjadi kode yang tangguh dan visual yang memukau',
                statsProjects: 'Proyek Selesai',
                statsCerts: 'Sertifikasi',
                statsExp: 'Tahun Pengalaman',
            },
            projects: {
                title: 'Proyek Unggulan',
                subtitle: 'Pengalaman digital dengan arsitektur bersih dan teknologi modern',
                liveDemo: 'Demo Langsung',
                sourceCode: 'Kode Sumber',
                featured: 'Unggulan',
                viewAll: 'Lihat Semua Proyek',
            },
            techStack: {
                title: 'Tech Stack & Keahlian',
                subtitle: 'Teknologi, bahasa, dan framework yang saya gunakan untuk membangun produk berskala besar',
                all: 'Semua Stack',
            },
            languages: {
                title: 'Kemampuan Bahasa',
                subtitle: 'Bahasa yang dikuasai dan kemampuan komunikasi',
            },
            certificates: {
                title: 'Sertifikasi & Lisensi',
                subtitle: 'Kredensial yang diakui industri memvalidasi keahlian rekayasa perangkat lunak',
                verify: 'Verifikasi Sertifikat',
            },
            news: {
                title: 'Artikel & Wawasan',
                subtitle: 'Pemikiran seputar pengembangan kreatif 3D, clean architecture, dan teknologi modern',
                readMore: 'Baca Selengkapnya',
                allArticles: 'Lihat Semua Artikel',
                backToHome: 'Kembali ke Beranda',
                publishedOn: 'Diterbitkan pada',
                share: 'Bagikan Artikel',
            },
            announcement: {
                modalTitle: 'Pengumuman Penting',
                dontShowAgain: 'Jangan tampilkan lagi',
                close: 'Mengerti!',
            },
            footer: {
                tagline: 'Dibuat dengan Laravel, Inertia.js, React, Three.js & Tailwind CSS.',
                rights: 'Hak cipta dilindungi.',
            },
        },
    },
    zh: {
        translation: {
            nav: {
                home: '首页',
                about: '关于我',
                projects: '精选项目',
                skills: '技术栈',
                languages: '语言能力',
                certificates: '专业证书',
                news: '技术博客',
                contact: '联系我',
                admin: '管理后台',
            },
            hero: {
                badge: '✨ 开放合作与工作机会',
                viewProjects: '浏览作品',
                contactMe: '与我联系',
                scrollDown: '向下滚动',
            },
            about: {
                title: '关于我',
                subtitle: '将创意转化为稳健的代码与身临其境的交互视觉',
                statsProjects: '已完成项目',
                statsCerts: '专业认证',
                statsExp: '年工作经验',
            },
            projects: {
                title: '精选项目',
                subtitle: '以整洁架构和前沿技术精心打造的数字化体验',
                liveDemo: '在线演示',
                sourceCode: '查看源码',
                featured: '精选',
                viewAll: '查看所有项目',
            },
            techStack: {
                title: '技术栈与技能',
                subtitle: '用于构建高性能、可扩展产品的核心技术与工具',
                all: '全栈展示',
            },
            languages: {
                title: '语言沟通能力',
                subtitle: '掌握的语言与专业沟通水平',
            },
            certificates: {
                title: '资质认证与证书',
                subtitle: '行业权威机构颁发的技术认证与专业资质',
                verify: '在线核验',
            },
            news: {
                title: '文章与见解',
                subtitle: '关于3D创意网页开发、整洁架构与前沿技术的深度思考',
                readMore: '阅读全文',
                allArticles: '所有文章',
                backToHome: '返回首页',
                publishedOn: '发布于',
                share: '分享文章',
            },
            announcement: {
                modalTitle: '特别公告',
                dontShowAgain: '不再提醒',
                close: '我知道了',
            },
            footer: {
                tagline: '基于 Laravel、Inertia.js、React、Three.js 与 Tailwind CSS 构建。',
                rights: '保留所有权利。',
            },
        },
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'id',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
