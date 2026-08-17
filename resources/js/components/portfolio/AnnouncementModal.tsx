import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Megaphone, X, Check } from 'lucide-react';
import { getTranslated } from '@/lib/i18n-helper';

interface AnnouncementItem {
    id: number;
    title: any;
    description: any;
    image: string | null;
    start_time: string | null;
    end_time: string | null;
}

interface AnnouncementModalProps {
    announcements: AnnouncementItem[];
}

export default function AnnouncementModal({ announcements = [] }: AnnouncementModalProps) {
    const { t } = useTranslation();
    const [activeAnnouncement, setActiveAnnouncement] = useState<AnnouncementItem | null>(null);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        if (!announcements || announcements.length === 0) return;

        // Find the first valid announcement not dismissed in localStorage
        const now = new Date().getTime();
        for (const item of announcements) {
            const isDismissed = localStorage.getItem(`announcement_dismissed_${item.id}`);
            if (isDismissed) continue;

            const startTime = item.start_time ? new Date(item.start_time).getTime() : 0;
            const endTime = item.end_time ? new Date(item.end_time).getTime() : Infinity;

            if (now >= startTime && now <= endTime) {
                setActiveAnnouncement(item);
                break;
            }
        }
    }, [announcements]);

    const handleClose = () => {
        if (activeAnnouncement) {
            if (dontShowAgain) {
                localStorage.setItem(`announcement_dismissed_${activeAnnouncement.id}`, 'true');
            }
            setActiveAnnouncement(null);
        }
    };

    if (!activeAnnouncement) return null;

    const title = getTranslated(activeAnnouncement.title, 'Special Announcement');
    const description = getTranslated(activeAnnouncement.description, '');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl overflow-hidden glow-card">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-secondary hover:bg-border text-muted-foreground hover:text-foreground transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Banner Image if any */}
                {activeAnnouncement.image && (
                    <div className="mb-6 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 h-44 overflow-hidden">
                        <img
                            src={`/storage/${activeAnnouncement.image}`}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                                {t('announcement.modalTitle')}
                            </span>
                            <h3 className="font-bold text-lg text-foreground leading-snug">
                                {title}
                            </h3>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="text-xs sm:text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none [&>p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />

                    {/* Footer Controls */}
                    <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-muted-foreground select-none">
                            <input
                                type="checkbox"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="rounded border-border text-purple-600 focus:ring-purple-500"
                            />
                            <span>{t('announcement.dontShowAgain')}</span>
                        </label>

                        <button
                            onClick={handleClose}
                            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-medium text-xs shadow-md shadow-purple-500/20 hover:opacity-90 transition-opacity"
                        >
                            {t('announcement.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
