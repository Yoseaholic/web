import { Tag } from 'lucide-react';
import GlassCard from './GlassCard';
import { tags } from '../data/posts';

export default function TagsCard() {
  return (
    <GlassCard title="标签" icon={<Tag size={18} />}>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <a
            key={tag.name}
            href="#"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-600/30 text-slate-300 text-xs hover:bg-blue-500/20 hover:text-blue-300 transition-colors border border-slate-500/20 hover:border-blue-500/30"
          >
            <span className="text-blue-400">#</span>
            {tag.name}
            <span className="text-slate-500 ml-0.5">{tag.count}</span>
          </a>
        ))}
      </div>
    </GlassCard>
  );
}
