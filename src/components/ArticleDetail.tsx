import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import type { Post } from '../data/posts';

interface ArticleDetailProps {
  post: Post;
  onBack: () => void;
}

export default function ArticleDetail({ post, onBack }: ArticleDetailProps) {
  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 pb-12 pt-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-slate-300 hover:text-white mb-4 transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        返回首页
      </button>

      <article className="glass-card p-5 sm:p-8">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {post.pinned && <span className="pinned-badge">🔥 置顶</span>}
          <span className={`tag-badge ${post.categoryClass}`}>{post.category}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{post.title}</h1>

        {/* Info row */}
        <div className="flex items-center gap-4 text-slate-500 text-sm mb-6 flex-wrap pb-6 border-b border-slate-700/40">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag size={14} />
            <span>{post.tags.map((t) => `#${t}`).join(' ')}</span>
          </div>
        </div>

        {/* Markdown body */}
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content || post.description}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
