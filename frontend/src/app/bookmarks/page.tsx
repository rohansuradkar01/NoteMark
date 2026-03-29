'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Bookmark, BookmarkInput } from '@/types';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import BookmarkCard from '@/components/BookmarkCard';
import BookmarkModal from '@/components/BookmarkModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

export default function BookmarksPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();

    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showFavorites, setShowFavorites] = useState(false);

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Get all unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        bookmarks.forEach((bookmark) => bookmark.tags.forEach((tag) => tags.add(tag)));
        return Array.from(tags).sort();
    }, [bookmarks]);

    // Filtered bookmarks
    const filteredBookmarks = useMemo(() => {
        return bookmarks.filter((bookmark) => {
            // Filter by favorites
            if (showFavorites && !bookmark.isFavorite) return false;

            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = bookmark.title?.toLowerCase().includes(query);
                const matchesUrl = bookmark.url.toLowerCase().includes(query);
                const matchesDescription = bookmark.description?.toLowerCase().includes(query);
                const matchesTags = bookmark.tags.some((tag) => tag.toLowerCase().includes(query));
                if (!matchesTitle && !matchesUrl && !matchesDescription && !matchesTags) return false;
            }

            // Filter by selected tags
            if (selectedTags.length > 0) {
                const hasTag = selectedTags.some((tag) => bookmark.tags.includes(tag));
                if (!hasTag) return false;
            }

            return true;
        });
    }, [bookmarks, searchQuery, selectedTags, showFavorites]);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        } else if (!authLoading && isAuthenticated) {
            fetchBookmarks();
        }
    }, [authLoading, isAuthenticated, router]);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const response = await api.getBookmarks();
            setBookmarks(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch bookmarks');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateBookmark = async (bookmarkData: BookmarkInput) => {
        await api.createBookmark(bookmarkData);
        await fetchBookmarks();
    };

    const handleUpdateBookmark = async (bookmarkData: BookmarkInput) => {
        if (!editingBookmark) return;
        await api.updateBookmark(editingBookmark._id, bookmarkData);
        await fetchBookmarks();
    };

    const handleDeleteBookmark = async () => {
        if (!deletingId) return;
        setDeleteLoading(true);
        try {
            await api.deleteBookmark(deletingId);
            await fetchBookmarks();
            setDeleteModalOpen(false);
            setDeletingId(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete bookmark');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleToggleFavorite = async (id: string) => {
        try {
            await api.toggleBookmarkFavorite(id);
            setBookmarks((prev) =>
                prev.map((bookmark) =>
                    bookmark._id === id ? { ...bookmark, isFavorite: !bookmark.isFavorite } : bookmark
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update favorite');
        }
    };

    const openCreateModal = () => {
        setEditingBookmark(null);
        setIsModalOpen(true);
    };

    const openEditModal = (bookmark: Bookmark) => {
        setEditingBookmark(bookmark);
        setIsModalOpen(true);
    };

    const openDeleteModal = (id: string) => {
        setDeletingId(id);
        setDeleteModalOpen(true);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12 animate-fade-in">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">
                            My <span className="gradient-text">Bookmarks</span>
                        </h1>
                        <p className="text-slate-400 font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                            {bookmarks.length} {bookmarks.length === 1 ? 'Web Discovery' : 'Web Discoveries'}
                            {filteredBookmarks.length !== bookmarks.length && (
                                <span className="text-slate-600 font-bold">• {filteredBookmarks.length} matching</span>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-base font-bold bg-white text-slate-950 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Bookmark
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                        {error}
                        <button onClick={() => setError('')} className="ml-2 underline">
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Filters */}
                <div className="space-y-6 mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <SearchBar onSearch={setSearchQuery} placeholder="Search across your saved links..." />
                        </div>
                        <button
                            onClick={() => setShowFavorites(!showFavorites)}
                            className={`group px-6 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 border-2 ${showFavorites
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-lg shadow-amber-500/10'
                                : 'bg-slate-900/40 text-slate-500 border-white/5 hover:bg-slate-800/60 hover:text-slate-300'
                                }`}
                        >
                            <svg
                                className={`w-5 h-5 transition-transform group-hover:scale-110 ${showFavorites ? 'fill-amber-500' : 'fill-none'}`}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                            {showFavorites ? 'Showing Favorites' : 'Favorites'}
                        </button>
                    </div>

                    <TagFilter
                        availableTags={allTags}
                        selectedTags={selectedTags}
                        onTagSelect={setSelectedTags}
                    />
                </div>

                {/* Bookmarks Grid */}
                {filteredBookmarks.length === 0 ? (
                    <div className="text-center py-24 glass-card rounded-3xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-900/60 border border-white/5 flex items-center justify-center shadow-inner">
                            <span className="text-4xl filter drop-shadow-md">🔖</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">
                            {bookmarks.length === 0 ? 'No bookmarks saved' : 'No matches found'}
                        </h3>
                        <p className="text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                            {bookmarks.length === 0
                                ? 'Spotted something interesting online? Save it here for later reference.'
                                : 'We couldn\'t find any bookmarks matching your current filters. Try expanding your search.'}
                        </p>
                        {bookmarks.length === 0 && (
                            <button
                                onClick={openCreateModal}
                                className="px-8 py-4 rounded-2xl text-base font-bold bg-gradient-to-r from-cyan-600 to-violet-600 text-white hover:from-cyan-500 hover:to-violet-500 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-600/20"
                            >
                                Add First Bookmark
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                        {filteredBookmarks.map((bookmark) => (
                            <BookmarkCard
                                key={bookmark._id}
                                bookmark={bookmark}
                                onEdit={openEditModal}
                                onDelete={openDeleteModal}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Bookmark Modal */}
            <BookmarkModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingBookmark(null);
                }}
                onSave={editingBookmark ? handleUpdateBookmark : handleCreateBookmark}
                bookmark={editingBookmark}
            />

            {/* Delete Confirm Modal */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeletingId(null);
                }}
                onConfirm={handleDeleteBookmark}
                title="Delete Bookmark"
                message="Are you sure you want to delete this bookmark? This action cannot be undone."
                loading={deleteLoading}
            />
        </div>
    );
}
