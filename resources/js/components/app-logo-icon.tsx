import type { HTMLAttributes } from 'react';

export default function AppLogoIcon({ className = '', ...props }: HTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/dio-cutout.png"
            alt="DIOSTACK"
            className={`object-cover object-top rounded-full ${className}`}
            {...props}
        />
    );
}
