'use client';

interface TagFilterProps {
    availableTags: string[];
    selectedTags: string[];
    onTagSelect: (tags: string[]) => void;
}

export default function TagFilter({ availableTags, selectedTags, onTagSelect }: TagFilterProps) {
    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            onTagSelect(selectedTags.filter((t) => t !== tag));
        } else {
            onTagSelect([...selectedTags, tag]);
        }
    };

    const clearAll = () => {
        onTagSelect([]);
    };

    if (availableTags.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ml-1">Filter by Tags</span>
            <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border-2 ${selectedTags.includes(tag)
                            ? 'bg-violet-600/20 text-violet-300 border-violet-500/30 glow-primary scale-105 shadow-xl shadow-violet-500/10'
                            : 'bg-slate-900/40 text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 border-white/5 active:scale-95'
                            }`}
                    >
                        #{tag}
                    </button>
                ))}
                {selectedTags.length > 0 && (
                    <button
                        onClick={clearAll}
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-all border-2 border-transparent hover:border-red-500/20"
                    >
                        Clear Filters ({selectedTags.length})
                    </button>
                )}
            </div>
        </div>
    );
}
