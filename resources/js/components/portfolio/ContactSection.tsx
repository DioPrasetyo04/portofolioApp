import { motion } from 'framer-motion';
import {
    Send,
    Mail,
    User,
    MessageSquare,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    Image as ImageIcon,
    Bold,
    Italic,
    List,
    Link2,
    X,
    MessageCircle,
    Instagram,
    Twitter,
    Linkedin,
    Github,
    Globe,
    Share2,
    ArrowUpRight,
} from 'lucide-react';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface SocialMediaItem {
    id: number;
    name: string;
    url: string;
    icon?: string | null;
    is_active: boolean;
}

interface ContactSectionProps {
    socialMedia?: SocialMediaItem[];
}

export default function ContactSection({
    socialMedia = [],
}: ContactSectionProps) {
    const { t } = useTranslation();

    // Form state
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showImageInput, setShowImageInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Validation & submission states
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        message?: string;
    }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Filter active social media items
    const activeSocialMedia = socialMedia.filter((item) => item.is_active);

    // Find WhatsApp link or fallback
    const waItem = activeSocialMedia.find((item) =>
        item.name.toLowerCase().includes('whatsapp'),
    );
    const waBaseUrl = waItem?.url || 'https://wa.me/';

    // Rich Text Toolbar Helpers
    const insertFormatting = (prefix: string, suffix: string = '') => {
        if (!textareaRef.current) {
            return;
        }

        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = message.substring(start, end);
        const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
        const newMessage =
            message.substring(0, start) + replacement + message.substring(end);

        setMessage(newMessage);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                start + prefix.length,
                end + prefix.length,
            );
        }, 0);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit');

                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddImageUrl = () => {
        if (imageUrl.trim()) {
            setImagePreview(imageUrl.trim());
            setImageUrl('');
            setShowImageInput(false);
        }
    };

    // Validation logic
    const validate = () => {
        const newErrors: { name?: string; email?: string; message?: string } =
            {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email.trim())) {
                newErrors.email = 'Please enter a valid email address';
            }
        }

        if (!message.trim()) {
            newErrors.message = 'Message cannot be empty';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        // Build WhatsApp Message
        let waText = `*New Contact Message via Portfolio*\n\n`;
        waText += `👤 *Name:* ${name.trim()}\n`;
        waText += `✉️ *Email:* ${email.trim()}\n`;
        waText += `📝 *Message:*\n${message.trim()}\n`;

        if (imagePreview) {
            waText += `\n🖼️ *Attachment Included* (Please share image directly)`;
        }

        // Get WhatsApp destination
        let cleanWaUrl = waBaseUrl.trim();

        if (!cleanWaUrl.startsWith('http')) {
            cleanWaUrl = `https://wa.me/${cleanWaUrl.replace(/[^0-9]/g, '')}`;
        }

        const separator = cleanWaUrl.includes('?') ? '&' : '?';
        const finalUrl = `${cleanWaUrl}${separator}text=${encodeURIComponent(waText)}`;

        // Trigger redirection
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitSuccess(true);
            window.open(finalUrl, '_blank', 'noopener,noreferrer');
        }, 600);
    };

    // Map icon (uploaded image or classes/names) to render element with graceful fallback
    function SocialMediaIcon({ item }: { item: SocialMediaItem }) {
        const [imageError, setImageError] = useState(false);

        const isImage = Boolean(
            item.icon &&
            (item.icon.includes('/') ||
                /\.(png|jpe?g|svg|webp|gif)$/i.test(item.icon)),
        );

        if (isImage && !imageError) {
            const src =
                item.icon!.startsWith('http') || item.icon!.startsWith('/')
                    ? item.icon!
                    : `/storage/${item.icon}`;

            return (
                <img
                    src={src}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    className="h-5 w-5 rounded object-contain"
                    onError={() => setImageError(true)}
                />
            );
        }

        const name = item.name.toLowerCase();
        const iconStr = (item.icon || '').toLowerCase();

        if (name.includes('whatsapp') || iconStr.includes('whatsapp')) {
            return <MessageCircle className="h-5 w-5 text-emerald-400" />;
        }

        if (name.includes('instagram') || iconStr.includes('instagram')) {
            return <Instagram className="h-5 w-5 text-pink-400" />;
        }

        if (
            name.includes('twitter') ||
            name.includes('x') ||
            iconStr.includes('twitter')
        ) {
            return <Twitter className="h-5 w-5 text-cyan-400" />;
        }

        if (name.includes('linkedin') || iconStr.includes('linkedin')) {
            return <Linkedin className="h-5 w-5 text-blue-400" />;
        }

        if (name.includes('github') || iconStr.includes('github')) {
            return <Github className="h-5 w-5 text-purple-400" />;
        }

        return <Globe className="h-5 w-5 text-indigo-400" />;
    }

    return (
        <section
            id="contact"
            className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-24 lg:py-28"
        >
            {/* Ambient Cosmic Background Glows */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-purple-400/20 blur-3xl dark:bg-purple-600/15" />
                <div className="absolute right-10 bottom-10 h-[500px] w-[500px] rounded-full bg-cyan-300/15 blur-3xl dark:bg-cyan-400/10" />
                <div className="absolute bottom-20 left-10 h-[450px] w-[450px] rounded-full bg-amber-300/15 blur-3xl dark:bg-transparent" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mx-auto mb-8 max-w-3xl space-y-3 text-center sm:mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 px-3.5 py-1.5 text-xs font-bold text-purple-700 shadow-sm dark:font-semibold dark:text-purple-300"
                    >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{t('contactUs.title')}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        {t('contactUs.subtitle')}
                    </motion.h2>
                </div>

                {/* 2 Grids Container */}
                <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12">
                    {/* ════════ SECTION 1: Contact Form Card (7 Cols) ════════ */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7"
                    >
                        <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl shadow-purple-950/20 backdrop-blur-sm sm:p-8">
                            <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-foreground">
                                <Send className="h-5 w-5 text-purple-400" />
                                <span>Send a Direct Inquiry</span>
                            </h3>
                            <p className="mb-6 text-xs text-muted-foreground">
                                Fill out the form below. Once submitted, it will
                                format and redirect you to WhatsApp for instant
                                chat.
                            </p>

                            {submitSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-400"
                                >
                                    <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                                    <span>
                                        Redirecting to WhatsApp with your
                                        details formatted!
                                    </span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Input */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                        <User className="h-3.5 w-3.5 text-purple-400" />
                                        <span>{t('contactUs.form.name')}</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);

                                            if (errors.name) {
                                                setErrors({
                                                    ...errors,
                                                    name: undefined,
                                                });
                                            }
                                        }}
                                        placeholder={t(
                                            'contactUs.form.namePlaceholder',
                                        )}
                                        className={`w-full rounded-xl border bg-background/60 px-4 py-2.5 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:ring-2 focus:outline-none ${
                                            errors.name
                                                ? 'border-red-500/60 focus:ring-red-500/30'
                                                : 'border-border focus:border-purple-500/60 focus:ring-purple-500/40'
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="flex items-center gap-1 text-[11px] text-red-400">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email Input */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                                        <Mail className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>{t('contactUs.form.email')}</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);

                                            if (errors.email) {
                                                setErrors({
                                                    ...errors,
                                                    email: undefined,
                                                });
                                            }
                                        }}
                                        placeholder={t(
                                            'contactUs.form.emailPlaceholder',
                                        )}
                                        className={`w-full rounded-xl border bg-background/60 px-4 py-2.5 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:ring-2 focus:outline-none ${
                                            errors.email
                                                ? 'border-red-500/60 focus:ring-red-500/30'
                                                : 'border-border focus:border-cyan-500/60 focus:ring-cyan-500/40'
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="flex items-center gap-1 text-[11px] text-red-400">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Rich Editor / Message Area */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center justify-between text-xs font-semibold text-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <MessageSquare className="h-3.5 w-3.5 text-pink-400" />
                                            <span>
                                                {t('contactUs.form.message')}
                                            </span>
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            Markdown supported
                                        </span>
                                    </label>

                                    {/* Editor Toolbar */}
                                    <div className="flex items-center gap-1 rounded-t-xl border border-b-0 border-border bg-secondary/50 p-1.5">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                insertFormatting('**', '**')
                                            }
                                            title="Bold"
                                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
                                        >
                                            <Bold className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                insertFormatting('_', '_')
                                            }
                                            title="Italic"
                                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
                                        >
                                            <Italic className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                insertFormatting('\n- ')
                                            }
                                            title="List item"
                                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
                                        >
                                            <List className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                insertFormatting('[', '](url)')
                                            }
                                            title="Add Link"
                                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
                                        >
                                            <Link2 className="h-3.5 w-3.5" />
                                        </button>
                                        <div className="mx-1 h-4 w-[1px] bg-border" />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            title="Attach Image file"
                                            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-purple-400 transition-colors hover:bg-purple-500/10"
                                        >
                                            <ImageIcon className="h-3.5 w-3.5" />
                                            <span>Upload Image</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowImageInput(
                                                    !showImageInput,
                                                )
                                            }
                                            title="Image URL"
                                            className="rounded-lg px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-background/80 hover:text-foreground"
                                        >
                                            Image URL
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Image URL dropdown */}
                                    {showImageInput && (
                                        <div className="flex gap-2 border border-b-0 border-border bg-secondary/70 p-2 text-xs">
                                            <input
                                                type="url"
                                                value={imageUrl}
                                                onChange={(e) =>
                                                    setImageUrl(e.target.value)
                                                }
                                                placeholder="https://example.com/image.jpg"
                                                className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddImageUrl}
                                                className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    )}

                                    {/* Textarea */}
                                    <textarea
                                        ref={textareaRef}
                                        rows={5}
                                        value={message}
                                        onChange={(e) => {
                                            setMessage(e.target.value);

                                            if (errors.message) {
                                                setErrors({
                                                    ...errors,
                                                    message: undefined,
                                                });
                                            }
                                        }}
                                        placeholder={t(
                                            'contactUs.form.messagePlaceholder',
                                        )}
                                        className={`w-full rounded-b-xl border bg-background/60 px-4 py-3 text-xs text-foreground transition-all placeholder:text-muted-foreground focus:ring-2 focus:outline-none ${
                                            errors.message
                                                ? 'border-red-500/60 focus:ring-red-500/30'
                                                : 'border-border focus:border-purple-500/60 focus:ring-purple-500/40'
                                        }`}
                                    />
                                    {errors.message && (
                                        <p className="flex items-center gap-1 text-[11px] text-red-400">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.message}
                                        </p>
                                    )}

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="group relative mt-2 w-32 rounded-xl border border-border bg-card/60 p-2">
                                            <img
                                                src={imagePreview}
                                                alt="Attachment Preview"
                                                loading="lazy"
                                                decoding="async"
                                                className="h-24 w-full rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setImagePreview(null)
                                                }
                                                className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white shadow transition-colors hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.01] hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                    <span>{t('contactUs.form.send')}</span>
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* ════════ SECTION 2: Social Media Cards (5 Cols) ════════ */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-4 lg:col-span-5"
                    >
                        <div className="rounded-3xl border border-border/80 bg-card/90 p-6 shadow-xl shadow-purple-950/20 backdrop-blur-sm sm:p-8">
                            <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
                                <div className="flex items-center gap-2 text-base font-bold text-foreground">
                                    <Share2 className="h-4 w-4 text-cyan-400" />
                                    <span>{t('contactUs.socialMedia')}</span>
                                </div>
                                <span className="rounded-full bg-secondary px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                                    {activeSocialMedia.length} Platforms
                                </span>
                            </div>

                            {activeSocialMedia.length === 0 ? (
                                <div className="py-8 text-center text-xs text-muted-foreground">
                                    No social media channels registered yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-1">
                                    {activeSocialMedia.map((item) => (
                                        <a
                                            key={item.id}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between rounded-2xl border border-border/70 bg-card/40 p-3.5 transition-all duration-300 hover:border-purple-500/40 hover:bg-secondary/70 hover:shadow-lg hover:shadow-purple-950/20"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-secondary/80 transition-all duration-300 group-hover:scale-110 group-hover:border-purple-500/50">
                                                    <SocialMediaIcon
                                                        item={item}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-foreground transition-colors group-hover:text-purple-400">
                                                        {item.name}
                                                    </h4>
                                                    <p className="max-w-[170px] truncate text-[11px] text-muted-foreground sm:max-w-[200px]">
                                                        {item.url.replace(
                                                            /^https?:\/\/(www\.)?/,
                                                            '',
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/50 text-muted-foreground transition-all group-hover:scale-105 group-hover:bg-cyan-500/10 group-hover:text-cyan-400">
                                                <ArrowUpRight className="h-3.5 w-3.5" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Additional quick connect card */}
                            <div className="mt-6 space-y-2 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-cyan-500/10 p-4">
                                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                                    <span>Looking for collaboration?</span>
                                </div>
                                <p className="text-[11px] leading-relaxed text-muted-foreground">
                                    I am open for full-time engineering roles,
                                    freelance opportunities, and open-source
                                    contributions.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
