import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cpu, Check } from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';

interface TechnologyItem {
    id: number;
    name: string;
    logo: string | null;
    technology_category_id: number;
}

interface CategoryItem {
    id: number;
    name: any;
    technologies?: TechnologyItem[];
}

interface TechStackSectionProps {
    categories: CategoryItem[];
}

export default function TechStackSection({ categories = [] }: TechStackSectionProps) {
    const { t } = useTranslation();
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

    if (!categories || categories.length === 0) return null;

    // Filter technologies based on selected category tab
    const allTechnologies: Array<TechnologyItem & { categoryName?: string }> = [];
    categories.forEach((cat) => {
        const catName = getTranslated(cat.name, 'Category');
        if (cat.technologies) {
            cat.technologies.forEach((tech) => {
                allTechnologies.push({
                    ...tech,
                    categoryName: catName,
                });
            });
        }
    });

    const displayedTechs =
        selectedCategory === 'all'
            ? allTechnologies
            : allTechnologies.filter((tech) => tech.technology_category_id === selectedCategory);

    return (
        <section id="skills" className="py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>{t('techStack.title')}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        {t('techStack.subtitle')}
                    </h2>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                    <button
                        onClick={() => setSelectedCategory('all')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                            selectedCategory === 'all'
                                ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                                : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                        }`}
                    >
                        {t('techStack.all')}
                    </button>

                    {categories.map((category) => {
                        const name = getTranslated(category.name, 'Category');
                        const isSelected = selectedCategory === category.id;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                                    isSelected
                                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary'
                                }`}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>

                {/* Technologies Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {displayedTechs.map((tech) => (
                        <div
                            key={tech.id}
                            className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-md shadow-md glow-card flex flex-col items-center justify-center text-center group"
                        >
                            {/* Logo or Tech Avatar */}
                            <div className="w-12 h-12 rounded-xl bg-secondary/80 border border-border/80 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-300">
                                {tech.logo ? (
                                    <img
                                        src={`/storage/${tech.logo}`}
                                        alt={tech.name}
                                        className="w-7 h-7 object-contain"
                                    />
                                ) : (
                                    <span className="font-bold text-sm text-purple-400 font-mono">
                                        {tech.name.slice(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>

                            <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                                {tech.name}
                            </span>
                            {tech.categoryName && (
                                <span className="text-[10px] text-muted-foreground font-mono mt-0.5 line-clamp-1">
                                    {tech.categoryName}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
