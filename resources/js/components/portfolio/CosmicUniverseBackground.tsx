"use client";

import React, { useEffect, useRef } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
    baseAlpha: number;
    alpha: number;
    twinkleSpeed: number;
    color: string;
}

interface Meteor {
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    alpha: number;
    active: boolean;
}

interface ConstellationLine {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    alpha: number;
}

interface CelestialPlanetConfig {
    name: string;
    xPct: number;             // 0 to 1 horizontal position
    yOffsetVh: number;        // position in total document heights (0 = hero, 1.2 = about, etc.)
    radius: number;           // base radius in px
    parallaxFactor: number;   // parallax response to scroll (e.g. 0.75 - 0.9)
    // 3D Sphere Gradients in Light Mode
    lightSphere: {
        highlight: string;
        mid: string;
        dark: string;
        shadow: string;
        rim: string;
        corona: string;
    };
    // 3D Sphere Gradients in Dark Mode
    darkSphere: {
        highlight: string;
        mid: string;
        dark: string;
        shadow: string;
        rim: string;
        corona: string;
    };
    // Atmospheric Cloud Bands
    hasBands?: boolean;
    bandColorsLight?: string[];
    bandColorsDark?: string[];
    // Planetary Saturn-like Rings
    hasRings?: boolean;
    ringRadiusInner?: number;
    ringRadiusOuter?: number;
    ringTilt?: number;
    ringColorLight?: string;
    ringColorDark?: string;
    // Orbiting Satellite Moon
    hasMoon?: boolean;
    moonDistance?: number;
    moonRadius?: number;
    moonSpeed?: number;
    moonColorLight?: string;
    moonColorDark?: string;
    // Solar Corona Rays (Sun)
    isSun?: boolean;
    // Dashed Celestial Orbit Ellipse
    hasOrbitPath?: boolean;
    orbitRadiusX?: number;
    orbitRadiusY?: number;
    orbitTilt?: number;
}

const PLANETS: CelestialPlanetConfig[] = [
    // 1. CHRONOS - The Great Ringed Gas Giant (Hero & Upper About)
    {
        name: 'Chronos',
        xPct: 0.83,
        yOffsetVh: 0.28,
        radius: 68,
        parallaxFactor: 0.85,
        lightSphere: {
            highlight: '#FFFFFF',
            mid: '#DDD6FE',      // Soft pastel lavender
            dark: '#A78BFA',     // Celestial violet
            shadow: '#6366F1',   // Deep royal indigo
            rim: 'rgba(56, 189, 248, 0.55)', // Cyan atmosphere limb
            corona: 'rgba(167, 139, 250, 0.28)',
        },
        darkSphere: {
            highlight: '#F3E8FF',
            mid: '#9333EA',
            dark: '#581C87',
            shadow: '#1E1B4B',
            rim: 'rgba(34, 211, 238, 0.65)',
            corona: 'rgba(147, 51, 234, 0.35)',
        },
        hasBands: true,
        bandColorsLight: ['rgba(255, 255, 255, 0.25)', 'rgba(99, 102, 241, 0.15)', 'rgba(216, 180, 254, 0.2)'],
        bandColorsDark: ['rgba(255, 255, 255, 0.15)', 'rgba(147, 51, 234, 0.25)', 'rgba(34, 211, 238, 0.18)'],
        hasRings: true,
        ringRadiusInner: 85,
        ringRadiusOuter: 135,
        ringTilt: -0.42,
        ringColorLight: 'rgba(165, 180, 252, 0.65)',
        ringColorDark: 'rgba(192, 132, 252, 0.55)',
        hasOrbitPath: true,
        orbitRadiusX: 190,
        orbitRadiusY: 85,
        orbitTilt: -0.25,
    },

    // 2. GAIA OPAL - Oceanic Terran Celestial Planet with Moon (About Me & Projects)
    {
        name: 'Gaia Opal',
        xPct: 0.14,
        yOffsetVh: 1.25,
        radius: 54,
        parallaxFactor: 0.82,
        lightSphere: {
            highlight: '#F0FDFA',
            mid: '#5EEAD4',      // Radiant teal
            dark: '#0D9488',     // Deep ocean
            shadow: '#115E59',   // Midnight oceanic teal
            rim: 'rgba(56, 189, 248, 0.6)',
            corona: 'rgba(45, 212, 191, 0.25)',
        },
        darkSphere: {
            highlight: '#E0F2FE',
            mid: '#0284C7',
            dark: '#0369A1',
            shadow: '#082F49',
            rim: 'rgba(52, 211, 153, 0.6)',
            corona: 'rgba(6, 182, 212, 0.35)',
        },
        hasMoon: true,
        moonDistance: 82,
        moonRadius: 8,
        moonSpeed: 0.6,
        moonColorLight: '#E0E7FF',
        moonColorDark: '#C7D2FE',
        hasOrbitPath: true,
        orbitRadiusX: 160,
        orbitRadiusY: 70,
        orbitTilt: 0.35,
    },

    // 3. SOL DAWN - Radiant Golden Celestial Sun (Projects Section)
    {
        name: 'Sol Dawn',
        xPct: 0.88,
        yOffsetVh: 2.35,
        radius: 48,
        parallaxFactor: 0.88,
        isSun: true,
        lightSphere: {
            highlight: '#FEF08A',
            mid: '#FBBF24',      // Warm solar gold
            dark: '#F59E0B',     // Amber
            shadow: '#D97706',   // Rich topaz
            rim: 'rgba(253, 224, 71, 0.8)',
            corona: 'rgba(245, 158, 11, 0.35)',
        },
        darkSphere: {
            highlight: '#FEF08A',
            mid: '#F59E0B',
            dark: '#B45309',
            shadow: '#78350F',
            rim: 'rgba(251, 191, 36, 0.85)',
            corona: 'rgba(217, 119, 6, 0.45)',
        },
        hasOrbitPath: true,
        orbitRadiusX: 150,
        orbitRadiusY: 65,
        orbitTilt: -0.15,
    },

    // 4. ARES CORAL - Terracotta Terrestrial Planet with Moon (Tech Stack Section)
    {
        name: 'Ares Coral',
        xPct: 0.16,
        yOffsetVh: 3.50,
        radius: 50,
        parallaxFactor: 0.80,
        lightSphere: {
            highlight: '#FFF1F2',
            mid: '#FDA4AF',      // Rose quartz
            dark: '#F43F5E',     // Coral
            shadow: '#9F1239',   // Terracotta crimson
            rim: 'rgba(244, 114, 182, 0.55)',
            corona: 'rgba(251, 113, 133, 0.25)',
        },
        darkSphere: {
            highlight: '#FFE4E6',
            mid: '#E11D48',
            dark: '#881337',
            shadow: '#4C0519',
            rim: 'rgba(251, 113, 133, 0.65)',
            corona: 'rgba(225, 29, 72, 0.35)',
        },
        hasBands: true,
        bandColorsLight: ['rgba(255, 255, 255, 0.2)', 'rgba(225, 29, 72, 0.12)'],
        bandColorsDark: ['rgba(255, 255, 255, 0.15)', 'rgba(244, 63, 94, 0.2)'],
        hasMoon: true,
        moonDistance: 74,
        moonRadius: 7,
        moonSpeed: -0.75,
        moonColorLight: '#FEF3C7',
        moonColorDark: '#FDE68A',
        hasOrbitPath: true,
        orbitRadiusX: 170,
        orbitRadiusY: 75,
        orbitTilt: 0.22,
    },

    // 5. ZEPHYR - Majestic Lilac Gas Giant with Ring (Language Skills & Certificates)
    {
        name: 'Zephyr',
        xPct: 0.85,
        yOffsetVh: 5.00,
        radius: 62,
        parallaxFactor: 0.84,
        lightSphere: {
            highlight: '#FAF5FF',
            mid: '#D8B4FE',      // Lilac mist
            dark: '#A855F7',     // Amethyst
            shadow: '#6B21A8',   // Deep royal violet
            rim: 'rgba(192, 132, 252, 0.55)',
            corona: 'rgba(168, 85, 247, 0.25)',
        },
        darkSphere: {
            highlight: '#F3E8FF',
            mid: '#7E22CE',
            dark: '#581C87',
            shadow: '#3B0764',
            rim: 'rgba(216, 180, 254, 0.65)',
            corona: 'rgba(147, 51, 234, 0.35)',
        },
        hasBands: true,
        bandColorsLight: ['rgba(255, 255, 255, 0.22)', 'rgba(126, 34, 206, 0.12)'],
        bandColorsDark: ['rgba(255, 255, 255, 0.15)', 'rgba(192, 132, 252, 0.2)'],
        hasRings: true,
        ringRadiusInner: 76,
        ringRadiusOuter: 115,
        ringTilt: 0.35,
        ringColorLight: 'rgba(216, 180, 254, 0.6)',
        ringColorDark: 'rgba(168, 85, 247, 0.5)',
        hasOrbitPath: true,
        orbitRadiusX: 180,
        orbitRadiusY: 80,
        orbitTilt: -0.3,
    },

    // 6. FROST OPAL - Crystalline Ice Planet (News & Contact Section)
    {
        name: 'Frost Opal',
        xPct: 0.16,
        yOffsetVh: 6.80,
        radius: 42,
        parallaxFactor: 0.82,
        lightSphere: {
            highlight: '#FFFFFF',
            mid: '#BAE6FD',      // Sky frost
            dark: '#38BDF8',     // Ice blue
            shadow: '#0284C7',   // Deep glacial
            rim: 'rgba(125, 211, 252, 0.65)',
            corona: 'rgba(56, 189, 248, 0.25)',
        },
        darkSphere: {
            highlight: '#E0F2FE',
            mid: '#0284C7',
            dark: '#0369A1',
            shadow: '#0C4A6E',
            rim: 'rgba(56, 189, 248, 0.7)',
            corona: 'rgba(14, 165, 233, 0.35)',
        },
        hasOrbitPath: true,
        orbitRadiusX: 140,
        orbitRadiusY: 60,
        orbitTilt: 0.4,
    },
];

export default function CosmicUniverseBackground() {
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
    const scrollPosRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rawCtx = canvas.getContext('2d', { alpha: false });
        if (!rawCtx) return;
        const ctx: CanvasRenderingContext2D = rawCtx;

        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            if (!canvas) return;
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initStars();
            initConstellations();
        };

        window.addEventListener('resize', handleResize);

        const handleMouseMove = (e: MouseEvent) => {
            const nx = (e.clientX / width) * 2 - 1;
            const ny = (e.clientY / height) * 2 - 1;
            mousePosRef.current.targetX = nx * 30;
            mousePosRef.current.targetY = ny * 30;
        };

        const handleScroll = () => {
            scrollPosRef.current = window.scrollY;
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Star colors
        const darkStarColors = ['#FFFFFF', '#C4B5FD', '#67E8F9', '#FDE68A', '#A78BFA'];
        const lightStarColors = ['#6366F1', '#8B5CF6', '#4F46E5', '#7C3AED', '#0284C7', '#06B6D4', '#D97706', '#DB2777'];

        let stars: Star[] = [];
        // Capped star count for optimal CPU/GPU raster performance
        const numStars = Math.min(130, Math.floor((width * height) / 9500));

        function initStars() {
            stars = [];
            for (let i = 0; i < numStars; i++) {
                const z = Math.random() * 0.8 + 0.2;
                const colors = isDark ? darkStarColors : lightStarColors;
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z,
                    size: isDark
                        ? (Math.random() * 1.8 + 0.6) * z
                        : (Math.random() * 2.2 + 0.8) * z,
                    baseAlpha: isDark
                        ? Math.random() * 0.6 + 0.3
                        : Math.random() * 0.55 + 0.25,
                    alpha: 0,
                    twinkleSpeed: Math.random() * 0.02 + 0.005,
                    color: colors[Math.floor(Math.random() * colors.length)],
                });
            }
        }

        initStars();

        // Constellation lines (light mode)
        let constellations: ConstellationLine[] = [];

        function initConstellations() {
            constellations = [];
            if (isDark) return;
            const groupCount = 7;
            for (let g = 0; g < groupCount; g++) {
                const cx = Math.random() * width;
                const cy = (g / groupCount) * height * 3 + Math.random() * 250;
                const pointCount = 3 + Math.floor(Math.random() * 3);
                const points: { x: number; y: number }[] = [];
                for (let p = 0; p < pointCount; p++) {
                    points.push({
                        x: cx + (Math.random() - 0.5) * 180,
                        y: cy + (Math.random() - 0.5) * 140,
                    });
                }
                for (let p = 0; p < points.length - 1; p++) {
                    constellations.push({
                        x1: points[p].x, y1: points[p].y,
                        x2: points[p + 1].x, y2: points[p + 1].y,
                        alpha: 0.08 + Math.random() * 0.06,
                    });
                }
            }
        }

        initConstellations();

        // Meteors / Day Comets
        const meteors: Meteor[] = [];
        const maxMeteors = 2;
        let lastMeteorTime = 0;

        function spawnMeteor() {
            if (meteors.length >= maxMeteors) return;
            meteors.push({
                x: Math.random() * width * 1.2 - width * 0.1,
                y: Math.random() * height * 0.4,
                length: isDark ? Math.random() * 90 + 60 : Math.random() * 70 + 40,
                speed: Math.random() * 14 + 10,
                angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
                alpha: 1,
                active: true,
            });
        }

        // Draw 3D Shaded Celestial Planet Function
        function drawPlanet(
            p: CelestialPlanetConfig,
            screenX: number,
            screenY: number,
            scale: number,
            clock: number
        ) {
            const r = p.radius * scale;
            const sphere = isDark ? p.darkSphere : p.lightSphere;

            // 1. Orbital Trajectory Dashed Path
            if (p.hasOrbitPath) {
                ctx.save();
                ctx.strokeStyle = isDark ? 'rgba(167, 139, 250, 0.18)' : 'rgba(99, 102, 241, 0.24)';
                ctx.lineWidth = 1.0;
                ctx.setLineDash([4, 7]);
                ctx.beginPath();
                ctx.ellipse(
                    screenX,
                    screenY,
                    (p.orbitRadiusX || r * 2.5) * scale,
                    (p.orbitRadiusY || r * 1.1) * scale,
                    p.orbitTilt || 0,
                    0,
                    Math.PI * 2
                );
                ctx.stroke();

                // Decorative trajectory node tick
                const nodeAngle = clock * 0.2;
                const nodeX = screenX + Math.cos(nodeAngle) * (p.orbitRadiusX || r * 2.5) * scale;
                const nodeY = screenY + Math.sin(nodeAngle) * (p.orbitRadiusY || r * 1.1) * scale;
                ctx.fillStyle = isDark ? '#A78BFA' : '#6366F1';
                ctx.beginPath();
                ctx.arc(nodeX, nodeY, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // 2. Solar Corona Flares (Sun Only)
            if (p.isSun) {
                ctx.save();
                const pulse = Math.sin(clock * 2) * 6;
                const sunGlow = ctx.createRadialGradient(screenX, screenY, r * 0.8, screenX, screenY, (r + 40 + pulse) * scale);
                sunGlow.addColorStop(0, sphere.corona);
                sunGlow.addColorStop(0.6, isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(251, 191, 36, 0.20)');
                sunGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
                ctx.fillStyle = sunGlow;
                ctx.beginPath();
                ctx.arc(screenX, screenY, (r + 40 + pulse) * scale, 0, Math.PI * 2);
                ctx.fill();

                // 4-point solar cross-flare
                const flareLen = (r + 35 + pulse * 1.5) * scale;
                ctx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.4)' : 'rgba(245, 158, 11, 0.45)';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(screenX - flareLen, screenY);
                ctx.lineTo(screenX + flareLen, screenY);
                ctx.moveTo(screenX, screenY - flareLen);
                ctx.lineTo(screenX, screenY + flareLen);
                ctx.stroke();
                ctx.restore();
            }

            // 3. Back half of Planetary Rings (passes behind sphere)
            if (p.hasRings) {
                ctx.save();
                ctx.translate(screenX, screenY);
                ctx.rotate(p.ringTilt || -0.4);

                const ringIn = (p.ringRadiusInner || r * 1.25) * scale;
                const ringOut = (p.ringRadiusOuter || r * 1.95) * scale;
                const ringMid = (ringIn + ringOut) / 2;
                const ringW = ringOut - ringIn;

                // Back half: angles Math.PI to 2*Math.PI
                ctx.strokeStyle = isDark ? (p.ringColorDark || 'rgba(192, 132, 252, 0.45)') : (p.ringColorLight || 'rgba(165, 180, 252, 0.55)');
                ctx.lineWidth = ringW;
                ctx.beginPath();
                ctx.ellipse(0, 0, ringMid, ringMid * 0.32, 0, Math.PI, Math.PI * 2);
                ctx.stroke();

                // Cassini division gap
                ctx.strokeStyle = isDark ? 'rgba(3, 1, 10, 0.7)' : 'rgba(240, 244, 255, 0.7)';
                ctx.lineWidth = 2 * scale;
                ctx.beginPath();
                ctx.ellipse(0, 0, ringMid, ringMid * 0.32, 0, Math.PI, Math.PI * 2);
                ctx.stroke();

                ctx.restore();
            }

            // 4. Moon (If Behind Planet)
            let moonX = 0, moonY = 0;
            let moonInFront = false;
            if (p.hasMoon) {
                const moonAngle = clock * (p.moonSpeed || 0.6);
                const moonDistX = (p.moonDistance || 75) * scale;
                const moonDistY = moonDistX * 0.35;
                moonX = screenX + Math.cos(moonAngle) * moonDistX;
                moonY = screenY + Math.sin(moonAngle) * moonDistY;
                moonInFront = Math.sin(moonAngle) >= 0;

                if (!moonInFront) {
                    drawMoon(moonX, moonY, (p.moonRadius || 7) * scale, isDark ? p.moonColorDark : p.moonColorLight);
                }
            }

            // 5. Outer Atmospheric Corona Glow
            ctx.save();
            const coronaR = r * 1.45;
            const coronaGrad = ctx.createRadialGradient(screenX, screenY, r * 0.85, screenX, screenY, coronaR);
            coronaGrad.addColorStop(0, sphere.corona);
            coronaGrad.addColorStop(0.5, sphere.rim);
            coronaGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = coronaGrad;
            ctx.beginPath();
            ctx.arc(screenX, screenY, coronaR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // 6. The 3D Spherical Planet Body
            ctx.save();
            ctx.beginPath();
            ctx.arc(screenX, screenY, r, 0, Math.PI * 2);
            ctx.clip(); // Clip all interior layers inside the sphere

            // 3D Volumetric Lighting Gradient (light source offset towards top-left)
            const lightOffX = screenX - r * 0.35;
            const lightOffY = screenY - r * 0.35;
            const sphereGrad = ctx.createRadialGradient(lightOffX, lightOffY, r * 0.05, screenX, screenY, r * 1.05);
            sphereGrad.addColorStop(0, sphere.highlight);
            sphereGrad.addColorStop(0.25, sphere.mid);
            sphereGrad.addColorStop(0.70, sphere.dark);
            sphereGrad.addColorStop(1, sphere.shadow);
            ctx.fillStyle = sphereGrad;
            ctx.fillRect(screenX - r, screenY - r, r * 2, r * 2);

            // Planetary Atmospheric Cloud Belts / Bands
            if (p.hasBands) {
                const bands = isDark ? (p.bandColorsDark || []) : (p.bandColorsLight || []);
                const bandOffsets = [-0.45, -0.15, 0.2, 0.5];
                bands.forEach((bColor, idx) => {
                    const by = screenY + (bandOffsets[idx % bandOffsets.length] || 0) * r;
                    const bGrad = ctx.createLinearGradient(screenX - r, by, screenX + r, by);
                    bGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
                    bGrad.addColorStop(0.3, bColor);
                    bGrad.addColorStop(0.7, bColor);
                    bGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
                    ctx.fillStyle = bGrad;
                    ctx.fillRect(screenX - r, by - 4 * scale, r * 2, 8 * scale);
                });
            }

            // Ring shadow cast across planet surface
            if (p.hasRings) {
                ctx.save();
                ctx.translate(screenX, screenY);
                ctx.rotate(p.ringTilt || -0.4);
                ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(30, 27, 75, 0.22)';
                ctx.fillRect(-r, -3 * scale, r * 2, 7 * scale);
                ctx.restore();
            }

            // Atmospheric Limb Glow (Fresnel rim around edge)
            const limbGrad = ctx.createRadialGradient(screenX, screenY, r * 0.82, screenX, screenY, r);
            limbGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            limbGrad.addColorStop(0.75, sphere.rim);
            limbGrad.addColorStop(1, sphere.highlight);
            ctx.fillStyle = limbGrad;
            ctx.fillRect(screenX - r, screenY - r, r * 2, r * 2);

            ctx.restore(); // Exit sphere clipping

            // 7. Front half of Planetary Rings (passes in front of sphere)
            if (p.hasRings) {
                ctx.save();
                ctx.translate(screenX, screenY);
                ctx.rotate(p.ringTilt || -0.4);

                const ringIn = (p.ringRadiusInner || r * 1.25) * scale;
                const ringOut = (p.ringRadiusOuter || r * 1.95) * scale;
                const ringMid = (ringIn + ringOut) / 2;
                const ringW = ringOut - ringIn;

                // Front half: angles 0 to Math.PI
                ctx.strokeStyle = isDark ? (p.ringColorDark || 'rgba(192, 132, 252, 0.55)') : (p.ringColorLight || 'rgba(165, 180, 252, 0.65)');
                ctx.lineWidth = ringW;
                ctx.beginPath();
                ctx.ellipse(0, 0, ringMid, ringMid * 0.32, 0, 0, Math.PI);
                ctx.stroke();

                // Cassini division gap
                ctx.strokeStyle = isDark ? 'rgba(3, 1, 10, 0.7)' : 'rgba(240, 244, 255, 0.7)';
                ctx.lineWidth = 2 * scale;
                ctx.beginPath();
                ctx.ellipse(0, 0, ringMid, ringMid * 0.32, 0, 0, Math.PI);
                ctx.stroke();

                ctx.restore();
            }

            // 8. Moon (If In Front of Planet)
            if (p.hasMoon && moonInFront) {
                drawMoon(moonX, moonY, (p.moonRadius || 7) * scale, isDark ? p.moonColorDark : p.moonColorLight);
            }
        }

        // Draw Moon Helper
        function drawMoon(mx: number, my: number, mr: number, mColor?: string) {
            ctx.save();
            const moonGrad = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
            moonGrad.addColorStop(0, '#FFFFFF');
            moonGrad.addColorStop(0.5, mColor || '#CBD5E1');
            moonGrad.addColorStop(1, '#64748B');
            ctx.fillStyle = moonGrad;
            ctx.beginPath();
            ctx.arc(mx, my, mr, 0, Math.PI * 2);
            ctx.fill();

            // Moon atmosphere rim
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }

        let clock = 0;
        let isRunning = true;
        let lastFrameTime = performance.now();
        const targetInterval = 1000 / 30; // Cap to 30 FPS for dramatic GPU & power savings

        const render = (currentTime: number) => {
            if (!isRunning) return;

            animationFrameId = requestAnimationFrame(render);

            const elapsed = currentTime - lastFrameTime;
            if (elapsed < targetInterval) return;
            lastFrameTime = currentTime - (elapsed % targetInterval);

            clock += 0.033; // ~30fps step

            const m = mousePosRef.current;
            m.x += (m.targetX - m.x) * 0.05;
            m.y += (m.targetY - m.y) * 0.05;

            const scrollY = scrollPosRef.current;

            // ── 1. BACKGROUND SKY ──
            if (isDark) {
                // Deep space void
                ctx.fillStyle = '#03010A';
                ctx.fillRect(0, 0, width, height);

                // Deep Purple Nebula
                const grad1 = ctx.createRadialGradient(
                    width * 0.2 + m.x * 0.5, height * 0.3 + m.y * 0.5, 50,
                    width * 0.2 + m.x * 0.5, height * 0.3 + m.y * 0.5, width * 0.55
                );
                grad1.addColorStop(0, 'rgba(109, 40, 217, 0.16)');
                grad1.addColorStop(0.6, 'rgba(76, 29, 149, 0.06)');
                grad1.addColorStop(1, 'rgba(3, 1, 10, 0)');
                ctx.fillStyle = grad1;
                ctx.fillRect(0, 0, width, height);

                // Cyan Cosmic Nebula
                const grad2 = ctx.createRadialGradient(
                    width * 0.8 - m.x * 0.5, height * 0.7 - m.y * 0.5, 40,
                    width * 0.8 - m.x * 0.5, height * 0.7 - m.y * 0.5, width * 0.5
                );
                grad2.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
                grad2.addColorStop(0.7, 'rgba(14, 116, 144, 0.04)');
                grad2.addColorStop(1, 'rgba(3, 1, 10, 0)');
                ctx.fillStyle = grad2;
                ctx.fillRect(0, 0, width, height);
            } else {
                // ── Light: Luminous Celestial Day-Cosmos / Stellar Dawn ──
                const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
                skyGrad.addColorStop(0, '#E8EEF8');   // Pale starlight sky
                skyGrad.addColorStop(0.22, '#EDE9FE'); // Celestial dawn lavender
                skyGrad.addColorStop(0.48, '#E0F2FE'); // Ethereal crystalline cyan
                skyGrad.addColorStop(0.75, '#EDE8F5'); // Soft amethyst horizon
                skyGrad.addColorStop(1, '#F1F5F9');    // Pearl starlight
                ctx.fillStyle = skyGrad;
                ctx.fillRect(0, 0, width, height);

                // Aurora Band 1 — Radiant Emerald / Teal Celestial Shimmer
                const auroraY1 = height * 0.16 + m.y * 0.8 + Math.sin(clock * 0.3) * 45;
                const aGrad1 = ctx.createRadialGradient(
                    width * 0.5 + m.x * 1.5 + Math.sin(clock * 0.2) * 110, auroraY1, 40,
                    width * 0.5 + m.x * 1.5 + Math.sin(clock * 0.2) * 110, auroraY1, width * 0.65
                );
                aGrad1.addColorStop(0, 'rgba(45, 212, 191, 0.32)');
                aGrad1.addColorStop(0.35, 'rgba(56, 189, 248, 0.18)');
                aGrad1.addColorStop(0.7, 'rgba(16, 185, 129, 0.06)');
                aGrad1.addColorStop(1, 'rgba(240, 249, 255, 0)');
                ctx.fillStyle = aGrad1;
                ctx.fillRect(0, 0, width, height);

                // Aurora Band 2 — Vivid Celestial Amethyst / Violet
                const auroraY2 = height * 0.42 - m.y * 0.5 + Math.cos(clock * 0.25) * 55;
                const aGrad2 = ctx.createRadialGradient(
                    width * 0.28 - m.x * 1.0 + Math.cos(clock * 0.18) * 85, auroraY2, 50,
                    width * 0.28 - m.x * 1.0 + Math.cos(clock * 0.18) * 85, auroraY2, width * 0.58
                );
                aGrad2.addColorStop(0, 'rgba(168, 85, 247, 0.28)');
                aGrad2.addColorStop(0.35, 'rgba(192, 132, 252, 0.16)');
                aGrad2.addColorStop(0.7, 'rgba(216, 180, 254, 0.05)');
                aGrad2.addColorStop(1, 'rgba(238, 242, 255, 0)');
                ctx.fillStyle = aGrad2;
                ctx.fillRect(0, 0, width, height);

                // Aurora Band 3 — Solar Dawn Warmth (Amber / Rose Quartz Glow)
                const auroraY3 = height * 0.68 + Math.sin(clock * 0.15 + 2) * 60;
                const aGrad3 = ctx.createRadialGradient(
                    width * 0.72 + m.x * 0.8, auroraY3, 50,
                    width * 0.72 + m.x * 0.8, auroraY3, width * 0.52
                );
                aGrad3.addColorStop(0, 'rgba(251, 191, 36, 0.24)');
                aGrad3.addColorStop(0.35, 'rgba(251, 113, 133, 0.14)');
                aGrad3.addColorStop(0.7, 'rgba(254, 243, 199, 0.05)');
                aGrad3.addColorStop(1, 'rgba(240, 249, 255, 0)');
                ctx.fillStyle = aGrad3;
                ctx.fillRect(0, 0, width, height);
            }

            // ── 2. CELESTIAL PLANETARY SYSTEM ──
            const responsiveScale = Math.max(0.75, Math.min(1.2, width / 1200));

            PLANETS.forEach((planet, idx) => {
                // Compute world Y in terms of document screen heights
                const planetBaseY = planet.yOffsetVh * height;
                // Apply smooth parallax relative to document scroll
                const screenY = planetBaseY - scrollY * planet.parallaxFactor + m.y * 1.5 + Math.sin(clock * 0.4 + idx) * 5;
                
                // Keep X responsive: clamp between screen margins
                let screenX = width * planet.xPct + m.x * planet.parallaxFactor * 1.5 + Math.cos(clock * 0.35 + idx) * 4;
                if (width < 768) {
                    screenX = planet.xPct < 0.5 ? width * 0.12 : width * 0.88;
                }

                // Render only if currently in or near viewport for ultra-high performance
                const margin = planet.radius * 2.5 * responsiveScale;
                if (screenY >= -margin && screenY <= height + margin) {
                    drawPlanet(planet, screenX, screenY, responsiveScale, clock);
                }
            });

            // ── 3. STARS & CELESTIAL STARDUST (Batch render without per-star save/restore) ──
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                s.alpha = s.baseAlpha + Math.sin(clock * 3 + i) * (isDark ? 0.25 : 0.22);
                if (s.alpha < 0.05) s.alpha = 0.05;
                if (s.alpha > 1) s.alpha = 1;

                const px = s.x + m.x * s.z * 1.5;
                const py = (s.y + m.y * s.z * 1.5 - (scrollY * 0.08 * s.z)) % height;
                const finalY = py < 0 ? py + height : py;

                ctx.globalAlpha = s.alpha;
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(px, finalY, s.size, 0, Math.PI * 2);
                ctx.fill();

                // Cross flare on bright stars
                const flareThreshold = isDark ? 1.3 : 1.1;
                const flareAlphaMin = isDark ? 0.6 : 0.25;
                if (s.size > flareThreshold && s.alpha > flareAlphaMin) {
                    ctx.fillStyle = s.color;
                    ctx.globalAlpha = Math.max(0, isDark ? (s.alpha - 0.6) * 0.45 : (s.alpha - 0.2) * 0.4);
                    const fl = isDark ? s.size * 4 : s.size * 3.5;
                    ctx.fillRect(px - fl / 2, finalY - 0.4, fl, 0.8);
                    ctx.fillRect(px - 0.4, finalY - fl / 2, 0.8, fl);
                }
            }
            ctx.globalAlpha = 1.0;

            // ── 4. CONSTELLATION LINES (Light Mode) ──
            if (!isDark) {
                ctx.save();
                ctx.strokeStyle = '#6366F1';
                ctx.lineWidth = 1.0;
                ctx.setLineDash([5, 9]);
                for (const line of constellations) {
                    const pf = 0.6;
                    const lx1 = line.x1 + m.x * pf;
                    const ly1 = (line.y1 + m.y * pf - scrollY * 0.05) % (height * 3);
                    const lx2 = line.x2 + m.x * pf;
                    const ly2 = (line.y2 + m.y * pf - scrollY * 0.05) % (height * 3);

                    if ((ly1 > -50 && ly1 < height + 50) || (ly2 > -50 && ly2 < height + 50)) {
                        ctx.globalAlpha = Math.max(0, line.alpha * 2.2 + Math.sin(clock * 1.5 + line.x1 * 0.01) * 0.04);
                        ctx.beginPath();
                        ctx.moveTo(lx1, ly1);
                        ctx.lineTo(lx2, ly2);
                        ctx.stroke();
                    }
                }
                ctx.setLineDash([]);
                ctx.restore();
            }

            // ── 5. METEORS & DAY COMETS ──
            const meteorInterval = isDark ? 4200 : 5500;
            const meteorChance = isDark ? 0.3 : 0.25;

            if (performance.now() - lastMeteorTime > meteorInterval && Math.random() < meteorChance) {
                spawnMeteor();
                lastMeteorTime = performance.now();
            }

            for (let j = meteors.length - 1; j >= 0; j--) {
                const met = meteors[j];
                if (!met.active) { meteors.splice(j, 1); continue; }

                met.x += Math.cos(met.angle) * met.speed;
                met.y += Math.sin(met.angle) * met.speed;
                met.alpha -= isDark ? 0.012 : 0.016;

                if (met.alpha <= 0 || met.x > width + 100 || met.y > height + 100) {
                    met.active = false; continue;
                }

                const tailX = met.x - Math.cos(met.angle) * met.length;
                const tailY = met.y - Math.sin(met.angle) * met.length;

                const mGrad = ctx.createLinearGradient(tailX, tailY, met.x, met.y);
                if (isDark) {
                    mGrad.addColorStop(0, 'rgba(168, 85, 247, 0)');
                    mGrad.addColorStop(0.7, `rgba(34, 211, 238, ${met.alpha * 0.7})`);
                    mGrad.addColorStop(1, `rgba(255, 255, 255, ${met.alpha})`);
                } else {
                    mGrad.addColorStop(0, 'rgba(129, 140, 248, 0)');
                    mGrad.addColorStop(0.6, `rgba(139, 92, 246, ${met.alpha * 0.45})`);
                    mGrad.addColorStop(1, `rgba(2, 132, 199, ${met.alpha * 0.75})`);
                }

                ctx.save();
                ctx.strokeStyle = mGrad;
                ctx.lineWidth = isDark ? 1.6 : 1.4;
                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(met.x, met.y);
                ctx.stroke();
                ctx.restore();
            }
        };

        animationFrameId = requestAnimationFrame(render);

        // Visibility handling: completely pause render when tab is backgrounded
        const handleVisibilityChange = () => {
            if (document.hidden) {
                isRunning = false;
                cancelAnimationFrame(animationFrameId);
            } else {
                if (!isRunning) {
                    isRunning = true;
                    lastFrameTime = performance.now();
                    animationFrameId = requestAnimationFrame(render);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            isRunning = false;
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-700"
        />
    );
}
