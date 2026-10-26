import React from 'react';
import { Share2, Twitter, Facebook, Linkedin, Mail, Link as LinkIcon, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareProps {
    url: string;
    title: string;
}

export default function SocialShare({ url, title }: SocialShareProps) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    const shareLinks = [
        { name: 'X', icon: Twitter, href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, color: 'hover:text-neutral-300' },
        { name: 'Facebook', icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, color: 'hover:text-blue-500' },
        { name: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, color: 'hover:text-blue-400' },
        { name: 'WhatsApp', icon: MessageCircle, href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`, color: 'hover:text-green-500' },
        { name: 'Email', icon: Mail, href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, color: 'hover:text-red-400' },
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
    };

    return (
        <div className="flex items-center gap-3 py-6 mt-8 border-y border-border">
            <span className="text-sm font-semibold text-foreground mr-2">Share this article:</span>
            <div className="flex flex-wrap items-center gap-2">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2.5 rounded-full border border-border bg-card/50 transition-all ${link.color} hover:bg-card hover:border-border hover:scale-110`}
                        title={`Share on ${link.name}`}
                    >
                        <link.icon className="w-4 h-4" />
                    </a>
                ))}
                <button
                    onClick={copyToClipboard}
                    className="p-2.5 rounded-full border border-border bg-card/50 transition-all hover:text-cyan-400 hover:bg-card hover:border-border hover:scale-110"
                    title="Copy Link"
                >
                    <LinkIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
