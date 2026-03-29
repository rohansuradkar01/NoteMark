'use client';

import { Bookmark } from '@/types';

interface BookmarkCardProps {
    bookmark: Bookmark;
    onEdit: (bookmark: Bookmark) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
}

export default function BookmarkCard({
    bookmark,
    onEdit,
    onDelete,
    onToggleFavorite,
}: BookmarkCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getDomain = (url: string) => {
        try {
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            return urlObj.hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    const getFaviconUrl = (url: string) => {
        const domain = getDomain(url);
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    };

    return (
        <div className="group relative glass-card-hover rounded-3xl p-6">
            {/* Favorite Button */}
            <button
                onClick={() => onToggleFavorite(bookmark._id)}
                className={`absolute top-5 right-5 p-2.5 rounded-xl transition-all duration-300 ${bookmark.isFavorite
                    ? 'text-amber-400 bg-amber-400/10 glow-secondary'
                    : 'text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 opacity-0 group-hover:opacity-100'
                    }`}
            >
                <svg
                    className="w-5 h-5 transition-transform group-active:scale-90"
                    fill={bookmark.isFavorite ? 'currentColor' : 'none'}
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
            </button>

            {/* Content */}
            <div className="flex items-start gap-5 pr-12">
                {/* Favicon Container */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <img
                        src={getFaviconUrl(bookmark.url)}
                        alt=""
                        className="w-9 h-9 object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230ea5e9"><path d="M17 7h-4v2h4c1.65 0 3 1.35 3 3s-1.35 3-3 3h-4v2h4c2.76 0 5-2.24 5-5s-2.24-5-5-5zm-6 8H7c-1.65 0-3-1.35-3-3s1.35-3 3-3h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-2zm-3-4h8v2H8z"/></svg>';
                        }}
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                        {bookmark.title || getDomain(bookmark.url)}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Source</span>
                        <a
                            href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-all line-clamp-1"
                        >
                            {getDomain(bookmark.url)}
                        </a>
                    </div>
                    {bookmark.description && (
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-4">{bookmark.description}</p>
                    )}
                </div>
            </div>

            {/* Tags */}
            {bookmark.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 mb-6 ml-[4.5rem]">
                    {bookmark.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm"
                        >
                            #{tag}
                        </span>
                    ))}
                    {bookmark.tags.length > 3 && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800/60 text-slate-500 border border-white/5">
                            +{bookmark.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-5 mt-auto border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(bookmark.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <a
                        href={bookmark.url.startsWith('http') ? bookmark.url : `https://${bookmark.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-all active:scale-90"
                        title="Open URL"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </a>
                    <button
                        onClick={() => onEdit(bookmark)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all active:scale-90"
                        title="Edit"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(bookmark._id)}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all active:scale-90"
                        title="Delete"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
