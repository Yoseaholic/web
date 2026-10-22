import { useEffect, useState } from 'react';
import { BarChart3, FileText, Users, Eye, Tag, Clock } from 'lucide-react';
import GlassCard from './GlassCard';
import { posts } from '../data/posts';
import { incrementAndGetVisitors, formatVisitorCount } from '../lib/visitorCount';

export default function SiteStatsCard() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    incrementAndGetVisitors().then(setVisitors);
  }, []);

  // 实时统计文章数、分类数、总字数
  const articleCount = posts.length;
  const categoryCount = new Set(posts.map((p) => p.category)).size;
  const totalChars = posts.reduce(
    (sum, p) => sum + (p.content?.length || 0) + p.description.length,
    0
  );
  const formattedChars = totalChars >= 1000 ? (totalChars / 1000).toFixed(1) + 'k' : String(totalChars);

  // 计算运行天数（从某个起始日期开始）
  const SITE_START = new Date('2026-01-01').getTime();
  const runDays = Math.max(1, Math.floor((Date.now() - SITE_START) / (1000 * 60 * 60 * 24)));

  const stats = [
    { icon: <FileText size={14} />, value: String(articleCount), label: '文章数', color: 'text-blue-400' },
    {
      icon: <Users size={14} />,
      value: visitors === null ? '...' : formatVisitorCount(visitors),
      label: '访客数',
      color: 'text-pink-400',
    },
    { icon: <Tag size={14} />, value: String(categoryCount), label: '分类数', color: 'text-cyan-400' },
    { icon: <Eye size={14} />, value: formattedChars, label: '总字数', color: 'text-green-400' },
  ];

  return (
    <GlassCard title="站点数据" icon={<BarChart3 size={18} />}>
      <div className="grid grid-cols-2 gap-3 mb-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center p-2.5 rounded-lg bg-slate-600/20 hover:bg-slate-600/30 transition-colors"
          >
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-slate-500">{stat.icon}</span>
              <span className="text-slate-500 text-xs">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center p-2.5 rounded-lg bg-slate-600/20">
        <div className="flex flex-col items-center">
          <div className="text-xl font-bold text-amber-400">{runDays}</div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-slate-500"><Clock size={14} /></span>
            <span className="text-slate-500 text-xs">运行天数</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
