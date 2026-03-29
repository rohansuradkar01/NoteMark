'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkInput } from '@/types';

interface BookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (bookmark: BookmarkInput) => Promise<void>;
    bookmark?: Bookmark | null;
}

export default function BookmarkModal({ isOpen, onClose, onSave, bookmark }: BookmarkModalProps) {
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (bookmark) {
            setUrl(bookmark.url);
            setTitle(bookmark.title || '');
            setDescription(bookmark.description || '');
            setTagsInput(bookmark.tags.join(', '));
        } else {
            setUrl('');
            setTitle('');
            setDescription('');
            setTagsInput('');
        }
        setError('');
    }, [bookmark, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!url.trim()) {
            setError('URL is required');
            return;
        }

        // Basic URL validation
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
        if (!urlPattern.test(url.trim())) {
            setError('Please enter a valid URL');
            return;
        }

        setLoading(true);
        try {
            const tags = tagsInput
                .split(',')
                .map((tag) => tag.trim().toLowerCase())
                .filter((tag) => tag.length > 0);

            await onSave({
                url: url.trim(),
                title: title.trim() || undefined,
                description: description.trim() || undefined,
                tags,
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save bookmark');
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
                        {bookmark ? 'Update' : 'Add'} <span className="gradient-text">Bookmark</span>
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
                            Destination URL <span className="text-cyan-500">*</span>
                        </label>
                        <div className="relative group/url">
                            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                <span className="text-slate-600 group-focus-within/url:text-cyan-500 transition-colors">🔗</span>
                            </div>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://excellent-resource.com"
                                className="w-full pl-12 pr-5 py-4 bg-slate-900/40 border-2 border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all font-medium"
                            />
                        </div>
                        <p className="px-1 text-[10px] font-bold text-slate-500 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-cyan-500"></span>
                            Leave title empty to auto-fetch metadata from the source
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">
                            Custom Title <span className="text-slate-800">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="A memorable name for this link"
                            className="w-full px-5 py-4 bg-slate-900/40 border-2 border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all font-medium"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">
                            Notes & Description <span className="text-slate-800">(optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Why did you save this?"
                            rows={3}
                            className="w-full px-5 py-4 bg-slate-900/40 border-2 border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all resize-none font-medium leading-relaxed"
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
                            placeholder="e.g. documentation, tutorial, design"
                            className="w-full px-5 py-4 bg-slate-900/40 border-2 border-white/5 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all font-medium"
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
                            {loading ? 'Saving...' : bookmark ? 'Update Bookmark' : 'Add Bookmark'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
