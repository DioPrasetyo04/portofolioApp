import { Megaphone, X } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

export default function AnnouncementModal({
    announcements = [],
}: AnnouncementModalProps) {
    const { t } = useTranslation();
    const [activeAnnouncement, setActiveAnnouncement] =
        useState<AnnouncementItem | null>(() => {
            if (
                typeof window === 'undefined' ||
                !announcements ||
                announcements.length === 0
            ) {
                return null;
            }

            const now = Date.now();

            for (const item of announcements) {
                const isDismissed = localStorage.getItem(
                    `announcement_dismissed_${item.id}`,
                );

                if (isDismissed) {
                    continue;
                }

                const startTime = item.start_time
                    ? new Date(item.start_time).getTime()
                    : 0;
                const endTime = item.end_time
                    ? new Date(item.end_time).getTime()
                    : Infinity;

                if (now >= startTime && now <= endTime) {
                    return item;
                }
            }

            return null;
        });
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const handleClose = () => {
        if (activeAnnouncement) {
            if (dontShowAgain) {
                localStorage.setItem(
                    `announcement_dismissed_${activeAnnouncement.id}`,
                    'true',
                );
            }

            setActiveAnnouncement(null);
        }
    };

    if (!activeAnnouncement) {
        return null;
    }

    const title = getTranslated(
        activeAnnouncement.title,
        'Special Announcement',
    );
    const description = getTranslated(activeAnnouncement.description, '');

    return (
        <div className="fixed inset-0 z-50 flex animate-in items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-300 fade-in">
            <div className="glow-card relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </button>

                {/* Banner Image if any */}
                {activeAnnouncement.image && (
                    <div className="-mx-6 -mt-6 mb-6 h-44 overflow-hidden sm:-mx-8 sm:-mt-8">
                        <img
                            src={`/storage/${activeAnnouncement.image}`}
                            alt={title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                        />
                    </div>
                )}

                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
                            <Megaphone className="h-5 w-5" />
                        </div>
                        <div>
                            <span className="font-mono text-[11px] tracking-wider text-purple-400 uppercase">
                                {t('announcement.modalTitle')}
                            </span>
                            <h3 className="text-lg leading-snug font-bold text-foreground">
                                {title}
                            </h3>
                        </div>
                    </div>

                    {/* Content */}
                    <div
                        className="prose prose-sm max-w-none text-xs leading-relaxed text-muted-foreground sm:text-sm dark:prose-invert [&>p]:mb-2"
                        dangerouslySetInnerHTML={{ __html: description }}
                    />

                    {/* Footer Controls */}
                    <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground select-none">
                            <input
                                type="checkbox"
                                checked={dontShowAgain}
                                onChange={(e) =>
                                    setDontShowAgain(e.target.checked)
                                }
                                className="rounded border-border text-purple-600 focus:ring-purple-500"
                            />
                            <span>{t('announcement.dontShowAgain')}</span>
                        </label>

                        <button
                            onClick={handleClose}
                            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-5 py-2 text-xs font-medium text-white shadow-md shadow-purple-500/20 transition-opacity hover:opacity-90 sm:w-auto"
                        >
                            {t('announcement.close')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
