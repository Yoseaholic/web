import { useState, useEffect } from 'react';
import { CalendarDays } from 'lucide-react';
import GlassCard from './GlassCard';

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export default function CalendarCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const day = now.getDay();

  const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  // Calendar grid
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false });

  return (
    <GlassCard title="日期" icon={<CalendarDays size={18} />}>
      {/* Big date display */}
      <div className="text-center mb-3">
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          {year}年{month + 1}月{date}日
        </div>
        <div className="text-slate-400 text-sm mt-1">{dayNames[day]}</div>
      </div>

      {/* Month label */}
      <div className="text-center text-slate-300 text-sm mb-2">
        {monthNames[month]} {year}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 text-center mb-3">
        {weekDays.map((wd) => (
          <div key={wd} className="text-slate-500 text-xs py-1 font-medium">{wd}</div>
        ))}
        {calendarDays.map((d, i) => (
          <div key={i} className="flex items-center justify-center py-0.5">
            {d === null ? (
              <span className="w-7 h-7"></span>
            ) : d === date ? (
              <span className="calendar-today text-xs font-bold">{d}</span>
            ) : (
              <span className="w-7 h-7 flex items-center justify-center text-slate-400 text-xs hover:bg-white/10 rounded-full cursor-pointer transition-colors">
                {d}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Clock */}
      <div className="text-center text-slate-400 text-sm font-mono">
        {timeStr}
      </div>
    </GlassCard>
  );
}
