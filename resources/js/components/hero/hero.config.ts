export interface TechLogo {
    name: string;
    src: string;
}

export interface NavLink {
    href: string;
    sectionId: string;
    labelKey: string;
}

export interface HeroConfig {
    portraitImage: string;
    portraitAlt: string;
    giantTitle: string;
    navLinks: NavLink[];
    categoryPills: string[];
    labelsLeft: string[];
    labelsRight: string[];
    techLogos: TechLogo[];
    ctaAnchor: string;
    counterValue: string;
}

export const heroConfig: HeroConfig = {
    portraitImage: '/images/dio-cutout.png',
    portraitAlt: 'Dio Prasetyo - Full-Stack Software Engineer & Creative Technologist',
    giantTitle: 'DIO',
    navLinks: [
        { href: '#hero', sectionId: 'hero', labelKey: 'nav.home' },
        { href: '#about', sectionId: 'about', labelKey: 'nav.about' },
        { href: '#projects', sectionId: 'projects', labelKey: 'nav.projects' },
        { href: '#skills', sectionId: 'skills', labelKey: 'nav.skills' },
        { href: '#languages', sectionId: 'languages', labelKey: 'nav.languages' },
        { href: '#certificates', sectionId: 'certificates', labelKey: 'nav.certificates' },
        { href: '#news', sectionId: 'news', labelKey: 'nav.news' },
        { href: '#contact', sectionId: 'contact', labelKey: 'nav.contact' },
    ],
    categoryPills: [
        'heroEditorial.pill1',
        'heroEditorial.pill2',
        'heroEditorial.pill3',
    ],
    labelsLeft: [
        'heroEditorial.nameLeft1',
        'heroEditorial.nameLeft2',
    ],
    labelsRight: [
        'heroEditorial.nameRight1',
        'heroEditorial.nameRight2',
    ],
    techLogos: [
        { name: 'TypeScript', src: '/images/tech/typescript.svg' },
        { name: 'React', src: '/images/tech/react.svg' },
        { name: 'PHP', src: '/images/tech/php.svg' },
        { name: 'Laravel', src: '/images/tech/laravel.svg' },
        { name: 'Next.js', src: '/images/tech/nextjs.svg' },
        { name: 'Python', src: '/images/tech/python.svg' },
        { name: 'Tailwind CSS', src: '/images/tech/tailwind.svg' },
        { name: 'JavaScript', src: '/images/tech/javascript.svg' },
        { name: 'Three.js', src: '/images/tech/threejs.svg' },
        { name: 'Docker', src: '/images/tech/docker.svg' },
        { name: 'MySQL', src: '/images/tech/mysql.svg' },
    ],
    ctaAnchor: '#contact',
    counterValue: '01',
};
