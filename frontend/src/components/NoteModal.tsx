'use client';

import { useState, useEffect } from 'react';
import { Note, NoteInput } from '@/types';

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: NoteInput) => Promise<void>;
    note?: Note | null;
}

export default function NoteModal({ isOpen, onClose, onSave, note }: NoteModalProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (note) {
            setTitle(note.title);
            setContent(note.content);
            setTagsInput(note.tags.join(', '));
        } else {
            setTitle('');
            setContent('');
            setTagsInput('');
        }
        setError('');
    }, [note, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!title.trim() || !content.trim()) {
            setError('Title and content are required');
            return;
        }

        setLoading(true);
        try {
            const tags = tagsInput
                .split(',')
                .map((tag) => tag.trim().toLowerCase())
                .filter((tag) => tag.length > 0);

            await onSave({ title: title.trim(), content: content.trim(), tags });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save note');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl glass-card rounded-3xl overflow-hidden animate-fade-up">
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-white/5">
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        {note ? 'Update' : 'Create'} <span className="gradient-text">Note</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all active:scale-90"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="px-5 py-4 rounded-2xl bg-red-500/10 border-2 border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-3 animate-shake">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">
                            Note Title <span className="text-violet-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full px-5 py-4 bg-slate-900/40 border-2 border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/30 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">
                            Content <span className="text-violet-500">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Unleash your thoughts..."
                            rows={8}
                            className="w-full px-5 py-4 bg-slate-900/40 border-2 border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/30 transition-all resize-none font-medium leading-relaxed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">
                            Tags <span className="text-slate-800">(comma separated)</span>
                        </label>
                        <input
                            type="text"
                            value={tagsInput}
                            onChange={(e) => setTagsInput(e.target.value)}
                            placeholder="e.g. brainstorming, urgent, research"
                            className="w-full px-5 py-4 bg-slate-900/40 border-2 border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/30 transition-all font-medium"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-4 rounded-2xl text-base font-bold text-slate-500 hover:text-white hover:bg-slate-800/60 transition-all"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-10 py-4 rounded-2xl text-base font-bold bg-white text-slate-950 hover:bg-slate-100 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-white/5"
                        >
                            {loading ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
