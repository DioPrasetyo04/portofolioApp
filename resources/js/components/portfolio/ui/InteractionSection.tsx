import React, { useState, useEffect } from 'react';
import { Heart, Star, MessageSquare, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import DOMPurify from 'dompurify';

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

export default function InteractionSection({ type, id, initialLikes, initialComments }: InteractionProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
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
                class: 'prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[120px] px-3 py-2 text-foreground'
            }
        }
    });

    // Check local storage for like
    useEffect(() => {
        const liked = localStorage.getItem(`liked_${type}_${id}`);
        if (liked) setIsLiked(true);
    }, [type, id]);

    const handleLike = async () => {
        if (isLiked) return;
        
        setIsLiked(true);
        setLikes(prev => prev + 1);
        localStorage.setItem(`liked_${type}_${id}`, 'true');

        try {
            await fetch('/interactions/like', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: JSON.stringify({ type, id })
            });
        } catch (error) {
            console.error('Failed to like', error);
        }
    };

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const htmlContent = editor?.getHTML();
        const textContent = editor?.getText();
        
        if (!name.trim() || !textContent?.trim()) return toast.error('Name and comment are required.');
        
        setIsSubmitting(true);
        try {
            const response = await fetch('/interactions/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ type, id, name, content: htmlContent, rating })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setComments(prev => [data.comment, ...prev]);
                setName('');
                editor?.commands.setContent('');
                setRating(5);
                toast.success('Comment posted!');
            } else {
                toast.error(data.message || 'Failed to post comment.');
            }
        } catch (error) {
            toast.error('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 mb-24 pb-12 clear-both space-y-12">
            {/* Like Section */}
            <div className="flex items-center gap-4 border-y border-border py-8">
                <button
                    onClick={handleLike}
                    disabled={isLiked}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                        isLiked 
                            ? 'bg-red-500/10 text-red-500 border border-red-500/30' 
                            : 'bg-card text-foreground border border-border hover:border-red-500 hover:text-red-500 hover:scale-105 shadow-sm'
                    }`}
                >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
                </button>
                <p className="text-muted-foreground text-sm">
                    {isLiked ? 'Thanks for liking!' : 'Show some love if you enjoyed this.'}
                </p>
            </div>

            {/* Comments Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-5">
                    <Card className="sticky top-24 bg-card/90 backdrop-blur-sm border-border glow-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl">
                                <MessageSquare className="w-5 h-5 text-purple-400" />
                                Leave a Review
                            </CardTitle>
                            <CardDescription>Share your thoughts and rating.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitComment} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Rating</label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                                    <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" disabled={isSubmitting} className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Comment</label>
                                    <div className="rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                                        {/* Tiptap Toolbar */}
                                        <div className="flex items-center gap-1 border-b border-border bg-muted/50 p-1">
                                            <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-1.5 rounded hover:bg-muted ${editor?.isActive('bold') ? 'bg-muted text-primary' : ''}`}><strong className="px-1">B</strong></button>
                                            <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-1.5 rounded hover:bg-muted ${editor?.isActive('italic') ? 'bg-muted text-primary' : ''}`}><em className="px-1">I</em></button>
                                            <div className="w-px h-4 bg-border mx-1" />
                                            <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-1.5 rounded hover:bg-muted text-sm font-bold ${editor?.isActive('heading') ? 'bg-muted text-primary' : ''}`}>H3</button>
                                            <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded hover:bg-muted text-sm ${editor?.isActive('bulletList') ? 'bg-muted text-primary' : ''}`}>List</button>
                                        </div>
                                        <div className={isSubmitting ? 'opacity-50 pointer-events-none' : ''}>
                                            <EditorContent editor={editor} />
                                        </div>
                                    </div>
                                </div>
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                                    {isSubmitting ? 'Posting...' : <><Send className="w-4 h-4 mr-2" /> Post Comment</>}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="lg:col-span-7 space-y-6">
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                        Comments <span className="px-2.5 py-0.5 rounded-full bg-muted text-sm font-medium">{comments.length}</span>
                    </h3>
                    
                    {comments.length === 0 ? (
                        <div className="text-center py-12 px-4 rounded-xl border border-dashed border-border bg-card/30">
                            <MessageSquare className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment.id} className="p-5 rounded-2xl border border-border bg-card/80 transition-all hover:bg-card">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-foreground">{comment.name}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(comment.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < comment.rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/20'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div 
                                        className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(comment.content) }}
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
