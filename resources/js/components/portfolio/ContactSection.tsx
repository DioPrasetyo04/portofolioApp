import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
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
    ExternalLink,
    MessageCircle,
    Instagram,
    Twitter,
    Linkedin,
    Github,
    Globe,
    Share2,
    ArrowUpRight
} from 'lucide-react';

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

export default function ContactSection({ socialMedia = [] }: ContactSectionProps) {
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
    const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Filter active social media items
    const activeSocialMedia = socialMedia.filter((item) => item.is_active);

    // Find WhatsApp link or fallback
    const waItem = activeSocialMedia.find((item) => item.name.toLowerCase().includes('whatsapp'));
    const waBaseUrl = waItem?.url || 'https://wa.me/';

    // Rich Text Toolbar Helpers
    const insertFormatting = (prefix: string, suffix: string = '') => {
        if (!textareaRef.current) return;
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = message.substring(start, end);
        const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
        const newMessage = message.substring(0, start) + replacement + message.substring(end);
        
        setMessage(newMessage);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
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
        const newErrors: { name?: string; email?: string; message?: string } = {};

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
        if (!validate()) return;

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

    const isImage = Boolean(item.icon && (item.icon.includes('/') || /\.(png|jpe?g|svg|webp|gif)$/i.test(item.icon)));

    if (isImage && !imageError) {
        const src = item.icon!.startsWith('http') || item.icon!.startsWith('/') ? item.icon! : `/storage/${item.icon}`;
        return (
            <img
                src={src}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="w-5 h-5 object-contain rounded"
                onError={() => setImageError(true)}
            />
        );
    }

    const name = item.name.toLowerCase();
    const iconStr = (item.icon || '').toLowerCase();

    if (name.includes('whatsapp') || iconStr.includes('whatsapp')) {
        return <MessageCircle className="w-5 h-5 text-emerald-400" />;
    }
    if (name.includes('instagram') || iconStr.includes('instagram')) {
        return <Instagram className="w-5 h-5 text-pink-400" />;
    }
    if (name.includes('twitter') || name.includes('x') || iconStr.includes('twitter')) {
        return <Twitter className="w-5 h-5 text-cyan-400" />;
    }
    if (name.includes('linkedin') || iconStr.includes('linkedin')) {
        return <Linkedin className="w-5 h-5 text-blue-400" />;
    }
    if (name.includes('github') || iconStr.includes('github')) {
        return <Github className="w-5 h-5 text-purple-400" />;
    }
    return <Globe className="w-5 h-5 text-indigo-400" />;
}

    return (
        <section id="contact" className="py-12 sm:py-16 md:py-24 lg:py-28 relative overflow-hidden bg-transparent">
            {/* Ambient Cosmic Background Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-cyan-300/15 dark:bg-cyan-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-10 w-[450px] h-[450px] bg-amber-300/15 dark:bg-transparent rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16 space-y-3">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-500/40 bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-bold dark:font-semibold shadow-sm"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{t('contactUs.title')}</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight"
                    >
                        {t('contactUs.subtitle')}
                    </motion.h2>
                </div>

                {/* 2 Grids Container */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* ════════ SECTION 1: Contact Form Card (7 Cols) ════════ */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-7"
                    >
                        <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-xl shadow-purple-950/20 relative overflow-hidden">
                            <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                                <Send className="w-5 h-5 text-purple-400" />
                                <span>Send a Direct Inquiry</span>
                            </h3>
                            <p className="text-xs text-muted-foreground mb-6">
                                Fill out the form below. Once submitted, it will format and redirect you to WhatsApp for instant chat.
                            </p>

                            {submitSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3"
                                >
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                    <span>Redirecting to WhatsApp with your details formatted!</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Input */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5 text-purple-400" />
                                        <span>{t('contactUs.form.name')}</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (errors.name) setErrors({ ...errors, name: undefined });
                                        }}
                                        placeholder={t('contactUs.form.namePlaceholder')}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-background/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                                            errors.name
                                                ? 'border-red-500/60 focus:ring-red-500/30'
                                                : 'border-border focus:ring-purple-500/40 focus:border-purple-500/60'
                                        }`}
                                    />
                                    {errors.name && (
                                        <p className="text-[11px] text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email Input */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                                        <Mail className="w-3.5 h-3.5 text-cyan-400" />
                                        <span>{t('contactUs.form.email')}</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (errors.email) setErrors({ ...errors, email: undefined });
                                        }}
                                        placeholder={t('contactUs.form.emailPlaceholder')}
                                        className={`w-full px-4 py-2.5 rounded-xl border text-xs bg-background/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                                            errors.email
                                                ? 'border-red-500/60 focus:ring-red-500/30'
                                                : 'border-border focus:ring-cyan-500/40 focus:border-cyan-500/60'
                                        }`}
                                    />
                                    {errors.email && (
                                        <p className="text-[11px] text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Rich Editor / Message Area */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                                        <span className="flex items-center gap-1.5">
                                            <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
                                            <span>{t('contactUs.form.message')}</span>
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">Markdown supported</span>
                                    </label>

                                    {/* Editor Toolbar */}
                                    <div className="flex items-center gap-1 p-1.5 rounded-t-xl border border-b-0 border-border bg-secondary/50">
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('**', '**')}
                                            title="Bold"
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
                                        >
                                            <Bold className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('_', '_')}
                                            title="Italic"
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
                                        >
                                            <Italic className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('\n- ')}
                                            title="List item"
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
                                        >
                                            <List className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => insertFormatting('[', '](url)')}
                                            title="Add Link"
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
                                        >
                                            <Link2 className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="h-4 w-[1px] bg-border mx-1" />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Attach Image file"
                                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-purple-400 hover:bg-purple-500/10 transition-colors"
                                        >
                                            <ImageIcon className="w-3.5 h-3.5" />
                                            <span>Upload Image</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowImageInput(!showImageInput)}
                                            title="Image URL"
                                            className="px-2 py-1 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
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
                                        <div className="flex gap-2 p-2 bg-secondary/70 border border-border border-b-0 text-xs">
                                            <input
                                                type="url"
                                                value={imageUrl}
                                                onChange={(e) => setImageUrl(e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                                className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-xs"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleAddImageUrl}
                                                className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold"
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
                                            if (errors.message) setErrors({ ...errors, message: undefined });
                                        }}
                                        placeholder={t('contactUs.form.messagePlaceholder')}
                                        className={`w-full px-4 py-3 rounded-b-xl border text-xs bg-background/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                                            errors.message
                                                ? 'border-red-500/60 focus:ring-red-500/30'
                                                : 'border-border focus:ring-purple-500/40 focus:border-purple-500/60'
                                        }`}
                                    />
                                    {errors.message && (
                                        <p className="text-[11px] text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.message}
                                        </p>
                                    )}

                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="relative mt-2 p-2 rounded-xl border border-border bg-card/60 w-32 group">
                                            <img
                                                src={imagePreview}
                                                alt="Attachment Preview"
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setImagePreview(null)}
                                                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:opacity-95 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
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
                        className="lg:col-span-5 space-y-4"
                    >
                        <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-sm shadow-xl shadow-purple-950/20">
                            <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-6">
                                <div className="flex items-center gap-2 font-bold text-base text-foreground">
                                    <Share2 className="w-4 h-4 text-cyan-400" />
                                    <span>{t('contactUs.socialMedia')}</span>
                                </div>
                                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                    {activeSocialMedia.length} Platforms
                                </span>
                            </div>

                            {activeSocialMedia.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-xs">
                                    No social media channels registered yet.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                                    {activeSocialMedia.map((item) => (
                                        <a
                                            key={item.id}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between p-3.5 rounded-2xl border border-border/70 bg-card/40 hover:bg-secondary/70 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-950/20 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-secondary/80 border border-border/80 flex items-center justify-center group-hover:scale-110 group-hover:border-purple-500/50 transition-all duration-300">
                                                    <SocialMediaIcon item={item} />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-foreground group-hover:text-purple-400 transition-colors">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[11px] text-muted-foreground truncate max-w-[170px] sm:max-w-[200px]">
                                                        {item.url.replace(/^https?:\/\/(www\.)?/, '')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-cyan-400 group-hover:bg-cyan-500/10 group-hover:scale-105 transition-all">
                                                <ArrowUpRight className="w-3.5 h-3.5" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}

                            {/* Additional quick connect card */}
                            <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-cyan-500/10 border border-purple-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Looking for collaboration?</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    I am open for full-time engineering roles, freelance opportunities, and open-source contributions.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
