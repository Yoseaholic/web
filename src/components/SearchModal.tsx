import { useState, useEffect, useMemo } from 'react';
import { Search, X, FileText, Calendar } from 'lucide-react';
import { posts, type Post } from '../data/posts';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  onOpenPost: (post: Post) => void;
}

export default function SearchModal({ open, onClose, onOpenPost }: SearchModalProps) {
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    if (!kw) return posts.slice(0, 6);
    return posts.filter((p) => {
      const haystack = [
        p.title,
        p.description,
        p.category,
        p.date,
        ...p.tags,
        p.content || '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(kw);
    });
  }, [keyword]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-2xl p-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-2 pb-3 border-b border-slate-700/40">
          <Search size={18} className="text-blue-400 shrink-0" />
          <input
            autoFocus
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索文章标题、内容、标签…"
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-sm"
          />
          <kbd className="hidden sm:inline-block text-xs text-slate-500 bg-slate-700/40 px-2 py-0.5 rounded">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto mt-3 space-y-2 pr-1">
          {results.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">
              没有找到与「{keyword}」相关的文章
            </p>
          ) : (
            <>
              <p className="text-slate-500 text-xs px-1 mb-1">
                {keyword ? `找到 ${results.length} 条结果` : '推荐文章'}
              </p>
              {results.map((post) => (
                <div
                  key={post.id}
                  onClick={() => {
                    if (post.externalUrl) {
                      window.open(post.externalUrl, '_blank', 'noopener,noreferrer');
                    } else {
                      onOpenPost(post);
                    }
                    onClose();
                  }}
                  className="p-3 rounded-lg bg-slate-700/30 hover:bg-blue-500/15 hover:border-blue-500/30 border border-transparent cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`tag-badge ${post.categoryClass} text-xs`}>
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <h4 className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors flex items-center gap-1">
                    <FileText size={14} className="text-slate-500" />
                    {highlightKeyword(post.title, keyword)}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                    {highlightKeyword(post.description, keyword)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-slate-500 text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function highlightKeyword(text: string, kw: string) {
  if (!kw.trim()) return text;
  const idx = text.toLowerCase().indexOf(kw.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-blue-400 bg-blue-500/15 px-0.5 rounded">
        {text.slice(idx, idx + kw.length)}
      </span>
      {text.slice(idx + kw.length)}
    </>
  );
}
