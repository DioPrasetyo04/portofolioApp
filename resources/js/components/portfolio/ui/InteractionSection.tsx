import Placeholder from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import DOMPurify from 'dompurify';
import { Heart, Star, MessageSquare, Send } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Comment {
    id: number;
    name: string;
    content: string;
    rating: number;
    created_at: string;
}

interface InteractionProps {
    type: 'project' | 'certificate' | 'news';
    id: number;
    initialLikes: number;
    initialComments: Comment[];
}

export default function InteractionSection({
    type,
    id,
    initialLikes,
    initialComments,
}: InteractionProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(() =>
        typeof window !== 'undefined'
            ? Boolean(localStorage.getItem(`liked_${type}_${id}`))
            : false,
    );
    const [comments, setComments] = useState<Comment[]>(initialComments || []);

    // Form state
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write your comment here...',
            }),
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[120px] px-3 py-2 text-foreground',
            },
        },
    });

    const handleLike = async () => {
        if (isLiked) {
            return;
        }

        setIsLiked(true);
        setLikes((prev) => prev + 1);
        localStorage.setItem(`liked_${type}_${id}`, 'true');

        try {
            await fetch('/interactions/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document.head
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify({ type, id }),
            });
        } catch (error) {
            console.error('Failed to like', error);
        }
    };

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const htmlContent = editor?.getHTML();
        const textContent = editor?.getText();

        if (!name.trim() || !textContent?.trim()) {
            return toast.error('Name and comment are required.');
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/interactions/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document.head
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    type,
                    id,
                    name,
                    content: htmlContent,
                    rating,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setComments((prev) => [data.comment, ...prev]);
                setName('');
                editor?.commands.setContent('');
                setRating(5);
                toast.success('Comment posted!');
            } else {
                toast.error(data.message || 'Failed to post comment.');
            }
        } catch {
            toast.error('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="clear-both mt-16 mb-24 space-y-12 pb-12">
            {/* Like Section */}
            <div className="flex items-center gap-4 border-y border-border py-8">
                <button
                    onClick={handleLike}
                    disabled={isLiked}
                    className={`flex items-center gap-2 rounded-full px-6 py-3 font-bold transition-all ${
                        isLiked
                            ? 'border border-red-500/30 bg-red-500/10 text-red-500'
                            : 'border border-border bg-card text-foreground shadow-sm hover:scale-105 hover:border-red-500 hover:text-red-500'
                    }`}
                >
                    <Heart
                        className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`}
                    />
                    <span>
                        {likes} {likes === 1 ? 'Like' : 'Likes'}
                    </span>
                </button>
                <p className="text-sm text-muted-foreground">
                    {isLiked
                        ? 'Thanks for liking!'
                        : 'Show some love if you enjoyed this.'}
                </p>
            </div>

            {/* Comments Section */}
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
                <div className="lg:col-span-5">
                    <Card className="glow-card sticky top-24 border-border bg-card/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <MessageSquare className="h-5 w-5 text-purple-400" />
                                Leave a Review
                            </CardTitle>
                            <CardDescription>
                                Share your thoughts and rating.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={submitComment}
                                className="space-y-5"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Rating
                                    </label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="transition-transform hover:scale-110 focus:outline-none"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="name"
                                        className="text-sm font-medium"
                                    >
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Your name"
                                        disabled={isSubmitting}
                                        className="bg-background"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Comment
                                    </label>
                                    <div className="overflow-hidden rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                        {/* Tiptap Toolbar */}
                                        <div className="flex items-center gap-1 border-b border-border bg-muted/50 p-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor
                                                        ?.chain()
                                                        .focus()
                                                        .toggleBold()
                                                        .run()
                                                }
                                                className={`rounded p-1.5 hover:bg-muted ${editor?.isActive('bold') ? 'bg-muted text-primary' : ''}`}
                                            >
                                                <strong className="px-1">
                                                    B
                                                </strong>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor
                                                        ?.chain()
                                                        .focus()
                                                        .toggleItalic()
                                                        .run()
                                                }
                                                className={`rounded p-1.5 hover:bg-muted ${editor?.isActive('italic') ? 'bg-muted text-primary' : ''}`}
                                            >
                                                <em className="px-1">I</em>
                                            </button>
                                            <div className="mx-1 h-4 w-px bg-border" />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor
                                                        ?.chain()
                                                        .focus()
                                                        .toggleHeading({
                                                            level: 3,
                                                        })
                                                        .run()
                                                }
                                                className={`rounded p-1.5 text-sm font-bold hover:bg-muted ${editor?.isActive('heading') ? 'bg-muted text-primary' : ''}`}
                                            >
                                                H3
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editor
                                                        ?.chain()
                                                        .focus()
                                                        .toggleBulletList()
                                                        .run()
                                                }
                                                className={`rounded p-1.5 text-sm hover:bg-muted ${editor?.isActive('bulletList') ? 'bg-muted text-primary' : ''}`}
                                            >
                                                List
                                            </button>
                                        </div>
                                        <div
                                            className={
                                                isSubmitting
                                                    ? 'pointer-events-none opacity-50'
                                                    : ''
                                            }
                                        >
                                            <EditorContent editor={editor} />
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary font-bold text-primary-foreground hover:bg-primary/90"
                                >
                                    {isSubmitting ? (
                                        'Posting...'
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />{' '}
                                            Post Comment
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6 lg:col-span-7">
                    <h3 className="flex items-center gap-2 text-2xl font-bold">
                        Comments{' '}
                        <span className="rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium">
                            {comments.length}
                        </span>
                    </h3>

                    {comments.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border bg-card/30 px-4 py-12 text-center">
                            <MessageSquare className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                                No comments yet. Be the first to share your
                                thoughts!
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="rounded-2xl border border-border bg-card/80 p-5 transition-all hover:bg-card"
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div>
                                            <h4 className="font-bold text-foreground">
                                                {comment.name}
                                            </h4>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    comment.created_at,
                                                ).toLocaleDateString(
                                                    undefined,
                                                    {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    },
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-3.5 w-3.5 ${i < comment.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div
                                        className="prose prose-sm max-w-none leading-relaxed text-muted-foreground dark:prose-invert"
                                        dangerouslySetInnerHTML={{
                                            __html: DOMPurify.sanitize(
                                                comment.content,
                                            ),
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
