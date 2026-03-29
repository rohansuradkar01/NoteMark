'use client';

import { Note } from '@/types';

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
    onToggleFavorite: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete, onToggleFavorite }: NoteCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="group relative glass-card-hover rounded-3xl p-6">
            {/* Favorite Button */}
            <button
                onClick={() => onToggleFavorite(note._id)}
                className={`absolute top-5 right-5 p-2.5 rounded-xl transition-all duration-300 ${note.isFavorite
                    ? 'text-amber-400 bg-amber-400/10 glow-secondary'
                    : 'text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 opacity-0 group-hover:opacity-100'
                    }`}
            >
                <svg
                    className="w-5 h-5 transition-transform group-active:scale-90"
                    fill={note.isFavorite ? 'currentColor' : 'none'}
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
            <div className="pr-12">
                <h3 className="text-xl font-bold text-white mb-3 tracking-snug group-hover:text-violet-300 transition-colors line-clamp-1">{note.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-4 mb-6">{note.content}</p>
            </div>

            {/* Tags */}
            {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                    {note.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-sm"
                        >
                            #{tag}
                        </span>
                    ))}
                    {note.tags.length > 3 && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800/60 text-slate-500 border border-white/5">
                            +{note.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-5 border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-500">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(note.updatedAt)}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button
                        onClick={() => onEdit(note)}
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
                        onClick={() => onDelete(note._id)}
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
