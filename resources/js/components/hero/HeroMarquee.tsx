"use client";

import React from 'react';
import { heroConfig } from './hero.config';

export default function HeroMarquee() {
    // Duplicate tech logos array for a seamless 100% infinite loop
    const logos = [...heroConfig.techLogos, ...heroConfig.techLogos, ...heroConfig.techLogos];

    return (
        <div className="absolute left-[-10%] right-[-10%] w-[120%] bottom-[20%] sm:bottom-[19%] lg:bottom-[18%] z-[4] pointer-events-none select-none overflow-hidden transform -rotate-3 origin-center">
            {/* The diagonal ribbon band */}
            <div className="w-full py-3.5 sm:py-4.5 bg-[var(--hero-strip-bg)] border-y border-[var(--hero-strip-border)] backdrop-blur-md shadow-2xl overflow-hidden flex items-center pointer-events-auto">
                <div className="animate-marquee flex items-center gap-6 sm:gap-9">
                    {logos.map((tech, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2.5 flex-shrink-0 group"
                            title={tech.name}
                        >
                            {/* Circular badge with red accent ring matching reference poster */}
                            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-black/80 border-2 border-[#C93A32] p-2.5 flex items-center justify-center shadow-[0_0_12px_rgba(201,58,50,0.35)] group-hover:shadow-[0_0_20px_rgba(201,58,50,0.7)] group-hover:scale-110 transition-all duration-300">
                                <img
                                    src={tech.src}
                                    alt={tech.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <span className="font-hero-condensed text-xs sm:text-sm tracking-widest text-[var(--hero-fg-muted)] uppercase hidden xl:inline-block">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
