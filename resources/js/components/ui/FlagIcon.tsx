import React from 'react';

interface FlagProps {
    className?: string;
}

/**
 * Flag of the United Kingdom (Union Jack)
 * Crisp pure-vector path rendering (viewBox 640x480)
 */
export function FlagUk({ className = 'w-5 h-3.5' }: FlagProps) {
    return (
        <svg
            viewBox="0 0 640 480"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path fill="#012169" d="M0 0h640v480H0z" />
            <path
                fill="#FFF"
                d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-179L0 64V0h75z"
            />
            <path
                fill="#C8102E"
                d="m424 281 216 159v40L369 281h55zm-184-82L23 40V0l270 199h-53zM640 0v3L443 149 416 112 597 0h43zM0 480v-5l197-147 27 37L43 480H0z"
            />
            <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
            <path fill="#C8102E" d="M267 0v480h106V0H267zM0 187v106h640V187H0z" />
        </svg>
    );
}

/**
 * Flag of Indonesia (Sang Saka Merah Putih)
 * Half red (#CE1126), half white (#FFFFFF)
 */
export function FlagId({ className = 'w-5 h-3.5' }: FlagProps) {
    return (
        <svg
            viewBox="0 0 640 480"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path fill="#CE1126" d="M0 0h640v240H0z" />
            <path fill="#FFFFFF" d="M0 240h640v240H0z" />
        </svg>
    );
}

/**
 * Flag of the People's Republic of China (Five-star Red Flag)
 * Exact geometric construction (viewBox 900x600)
 */
export function FlagZh({ className = 'w-5 h-3.5' }: FlagProps) {
    return (
        <svg
            viewBox="0 0 900 600"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <path fill="#DE2910" d="M0 0h900v600H0z" />
            {/* Big star: center (150, 150), radius 90 */}
            <path
                fill="#FFDE00"
                d="M 150.0 60.0 L 170.2 122.2 L 235.6 122.2 L 182.7 160.6 L 202.9 222.8 L 150.0 184.4 L 97.1 222.8 L 117.3 160.6 L 64.4 122.2 L 129.8 122.2 Z"
            />
            {/* 4 Small stars pointing to big star */}
            <path
                fill="#FFDE00"
                d="M 274.3 75.4 L 288.6 59.0 L 277.4 40.3 L 297.4 48.8 L 311.7 32.4 L 309.8 54.1 L 329.9 62.6 L 308.6 67.5 L 306.7 89.2 L 295.5 70.5 Z"
            />
            <path
                fill="#FFDE00"
                d="M 330.3 124.2 L 349.9 114.6 L 346.8 93.1 L 362.0 108.7 L 381.5 99.1 L 371.3 118.4 L 386.5 134.0 L 365.0 130.3 L 354.9 149.6 L 351.8 128.0 Z"
            />
            <path
                fill="#FFDE00"
                d="M 331.2 201.8 L 352.9 201.0 L 358.9 180.0 L 366.4 200.5 L 388.2 199.7 L 371.0 213.1 L 378.5 233.6 L 360.4 221.5 L 343.2 234.9 L 349.2 213.9 Z"
            />
            <path
                fill="#FFDE00"
                d="M 276.6 251.3 L 297.0 258.9 L 310.6 241.9 L 309.6 263.7 L 330.0 271.4 L 308.9 277.2 L 307.9 298.9 L 296.0 280.7 L 274.9 286.5 L 288.6 269.5 Z"
            />
        </svg>
    );
}

/**
 * Universal FlagIcon component with border and rounded container helper
 */
export default function FlagIcon({
    code,
    className = 'w-5 h-3.5',
}: {
    code: string;
    className?: string;
}) {
    const lang = (code || '').toLowerCase().trim();
    if (lang === 'id') {
        return <FlagId className={className} />;
    }
    if (lang === 'zh' || lang === 'cn') {
        return <FlagZh className={className} />;
    }
    return <FlagUk className={className} />;
}
