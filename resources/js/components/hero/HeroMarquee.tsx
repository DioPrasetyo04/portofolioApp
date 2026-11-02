'use client';

import React from 'react';
import { heroConfig } from './hero.config';

export default function HeroMarquee() {
    // Duplicate tech logos array for a seamless 100% infinite loop
    const logos = [
        ...heroConfig.techLogos,
        ...heroConfig.techLogos,
        ...heroConfig.techLogos,
    ];

    return (
        <div className="pointer-events-none absolute right-[-10%] bottom-[20%] left-[-10%] z-[4] w-[120%] origin-center -rotate-3 transform overflow-hidden select-none sm:bottom-[19%] lg:bottom-[18%]">
            {/* The diagonal ribbon band */}
            <div className="pointer-events-auto flex w-full items-center overflow-hidden border-y border-[var(--hero-strip-border)] bg-[var(--hero-strip-bg)] py-3.5 shadow-2xl backdrop-blur-md sm:py-4.5">
                <div className="animate-marquee flex items-center gap-6 sm:gap-9">
                    {logos.map((tech, idx) => (
                        <div
                            key={idx}
                            className="group flex flex-shrink-0 items-center gap-2.5"
                            title={tech.name}
                        >
                            {/* Circular badge with red accent ring matching reference poster */}
                            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#C93A32] bg-black/80 p-2.5 shadow-[0_0_12px_rgba(201,58,50,0.35)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(201,58,50,0.7)] sm:h-14 sm:w-14 lg:h-16 lg:w-16">
                                <img
                                    src={tech.src}
                                    alt={tech.name}
                                    width={40}
                                    height={40}
                                    className="h-full w-full object-contain drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)] filter"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <span className="font-hero-condensed hidden text-xs tracking-widest text-[var(--hero-fg-muted)] uppercase sm:text-sm xl:inline-block">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
