import { useState } from 'react';
import { FileText, Calendar, ChevronRight, ChevronLeft, ExternalLink } from 'lucide-react';
import { posts, type Post } from '../data/posts';

interface PostListProps {
  onOpenPost: (post: Post) => void;
}

export default function PostList({ onOpenPost }: PostListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <div className="glass-card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-400"><FileText size={18} /></span>
          <h2 className="text-white font-semibold text-base">文章归档</h2>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-3">
        {paginatedPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => {
              if (post.externalUrl) {
                window.open(post.externalUrl, '_blank', 'noopener,noreferrer');
              } else {
                onOpenPost(post);
              }
            }}
            className="post-card p-4 cursor-pointer group"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {/* Category & pinned badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {post.pinned && <span className="pinned-badge">🔥 置顶</span>}
                </div>

                {/* Title */}
                <h3 className="text-white font-medium text-base sm:text-lg mb-2 group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed mb-3 line-clamp-2">
                  {post.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Calendar size={13} />
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-slate-500 group-hover:text-blue-400 transition-colors mt-6 shrink-0">
                {post.externalUrl ? <ExternalLink size={18} /> : <ChevronRight size={20} />}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={14} />
            上一页
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            下一页
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
