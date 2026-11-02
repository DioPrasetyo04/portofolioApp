import {
    Twitter,
    Facebook,
    Linkedin,
    Mail,
    Link as LinkIcon,
    MessageCircle,
} from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface SocialShareProps {
    url: string;
    title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        {
            name: 'X',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: 'hover:text-neutral-300',
        },
        {
            name: 'Facebook',
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'hover:text-blue-500',
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'hover:text-blue-400',
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
            color: 'hover:text-green-500',
        },
        {
            name: 'Email',
            icon: Mail,
            href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
            color: 'hover:text-red-400',
        },
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="mt-8 flex items-center gap-3 border-y border-border py-6">
            <span className="mr-2 text-sm font-semibold text-foreground">
                Share this article:
            </span>
            <div className="flex flex-wrap items-center gap-2">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`rounded-full border border-border bg-card/50 p-2.5 transition-all ${link.color} hover:scale-110 hover:border-border hover:bg-card`}
                        title={`Share on ${link.name}`}
                    >
                        <link.icon className="h-4 w-4" />
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className="rounded-full border border-border bg-card/50 p-2.5 transition-all hover:scale-110 hover:border-border hover:bg-card hover:text-cyan-400"
                    title="Copy Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
