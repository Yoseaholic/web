import { Megaphone } from 'lucide-react';
import GlassCard from './GlassCard';

export default function AnnouncementCard() {
  return (
    <div className="space-y-4">
      <GlassCard title="公告" icon={<Megaphone size={18} />}>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="pinned-badge text-xs whitespace-nowrap mt-0.5">置顶</span>
            <span className="text-lg">🏠</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            欢迎来到鹤川的小站 🎉
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            这里记录着我的技术笔记与生活感悟，愿你我都能在代码与文字中找到属于自己的星辰大海。
          </p>
        </div>
      </GlassCard>

      <a 
        href="https://github.com/your-username" 
        target="_blank" 
        rel="noopener noreferrer"
        className="glass-card p-3 flex items-center justify-between group hover:border-blue-500/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          <span className="text-slate-300 group-hover:text-white text-sm font-medium transition-colors">我的 GitHub 主页</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
      </a>
    </div>
  );
}
