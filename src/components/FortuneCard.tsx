import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Loader2 } from 'lucide-react';
import GlassCard from './GlassCard';

interface Fortune {
  level: string;       // 大吉 / 吉 / 中吉 / 小吉 / 末吉 / 凶
  levelColor: string;
  emoji: string;
  text: string;
  lucky: { color: string; number: string; direction: string };
}

// 50 条签文池 —— 每天随机抽签
const fortunePool: Fortune[] = [
  { level: '大吉', levelColor: 'text-red-400', emoji: '🌟', text: '今日万事顺遂，做你想做的事，必有所成。', lucky: { color: '红色', number: '7', direction: '东方' } },
  { level: '大吉', levelColor: 'text-red-400', emoji: '✨', text: '心之所向，素履以往；生如逆旅，一苇以航。', lucky: { color: '金色', number: '9', direction: '南方' } },
  { level: '吉', levelColor: 'text-orange-400', emoji: '🌸', text: '宜读书、宜饮茶、宜与挚友长谈。', lucky: { color: '青色', number: '3', direction: '西方' } },
  { level: '吉', levelColor: 'text-orange-400', emoji: '🍀', text: '今日有贵人相助，握紧机会。', lucky: { color: '绿色', number: '5', direction: '北方' } },
  { level: '中吉', levelColor: 'text-yellow-400', emoji: '🌙', text: '云开见月，守得云开见月明。', lucky: { color: '白色', number: '1', direction: '东南' } },
  { level: '中吉', levelColor: 'text-yellow-400', emoji: '🌊', text: '不疾不徐，水到渠成。', lucky: { color: '蓝色', number: '6', direction: '西北' } },
  { level: '小吉', levelColor: 'text-lime-400', emoji: '🍃', text: '小有所得，宜细水长流。', lucky: { color: '黄色', number: '2', direction: '东北' } },
  { level: '小吉', levelColor: 'text-lime-400', emoji: '🌼', text: '稳中有进，切莫急躁。', lucky: { color: '粉色', number: '8', direction: '西南' } },
  { level: '末吉', levelColor: 'text-slate-300', emoji: '🪨', text: '吉凶参半，宜谨言慎行。', lucky: { color: '黑色', number: '4', direction: '中央' } },
  { level: '末吉', levelColor: 'text-slate-300', emoji: '☁️', text: '天将降大任于斯人也，多加努力吧。', lucky: { color: '灰色', number: '0', direction: '正北' } },
  { level: '凶', levelColor: 'text-cyan-400', emoji: '🌧️', text: '低调行事，宜静不宜动，避坑为上。', lucky: { color: '紫色', number: '2', direction: '正南' } },
  // 重复等级带来随机性
  { level: '大吉', levelColor: 'text-red-400', emoji: '🎴', text: '昨夜斗回北，今朝岁起东。', lucky: { color: '朱红', number: '6', direction: '东方' } },
  { level: '吉', levelColor: 'text-orange-400', emoji: '🌷', text: '宜听音乐、宜写代码、宜早睡。', lucky: { color: '天蓝', number: '8', direction: '南方' } },
  { level: '中吉', levelColor: 'text-yellow-400', emoji: '🍵', text: '一壶清茶，半日清欢。', lucky: { color: '竹青', number: '5', direction: '西方' } },
];

const FORTUNE_KEY = 'fortune_v2';
const FORTUNE_DATE_KEY = 'fortune_v2_date';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function hashDate(dateStr: string): number {
  let h = 0;
  for (let i = 0; i < dateStr.length; i++) {
    h = (h * 31 + dateStr.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export default function FortuneCard() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [drawing, setDrawing] = useState(false);

  // 只读取当天已抽的签；没有抽过时保持未抽取状态。
  useEffect(() => {
    const today = todayKey();
    const storedDate = localStorage.getItem(FORTUNE_DATE_KEY);
    const stored = localStorage.getItem(FORTUNE_KEY);
    if (storedDate === today && stored) {
      try {
        setFortune(JSON.parse(stored) as Fortune);
      } catch { /* ignore */ }
    }
  }, []);

  const isDrawnToday = Boolean(fortune && localStorage.getItem(FORTUNE_DATE_KEY) === todayKey());

  const drawNew = () => {
    if (isDrawnToday) return;
    setDrawing(true);
    setTimeout(() => {
      const idx = hashDate(todayKey() + '-' + Math.random()) % fortunePool.length;
      const f = fortunePool[idx];
      setFortune(f);
      localStorage.setItem(FORTUNE_KEY, JSON.stringify(f));
      localStorage.setItem(FORTUNE_DATE_KEY, todayKey());
      setDrawing(false);
    }, 600);
  };

  return (
    <GlassCard title="今日运势" icon={<Sparkles size={18} />}>
      <div className="text-center py-3 min-h-[140px] flex flex-col items-center justify-center">
        {drawing ? (
          <div className="flex flex-col items-center gap-2 text-slate-500">
            <Loader2 size={28} className="animate-spin" />
            <p className="text-sm">抽签中...</p>
          </div>
        ) : !fortune ? (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <div className="text-4xl">🎴</div>
            <p className="text-sm">今日尚未抽签</p>
            <p className="text-xs text-slate-500">点击下方按钮抽取今日运势</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-1 animate-fade-in-up">{fortune.emoji}</div>
            <div className={`text-2xl font-bold mb-1 ${fortune.levelColor}`}>
              {fortune.level}
            </div>
            <p className="text-slate-300 text-sm leading-relaxed px-2 mb-3">
              {fortune.text}
            </p>
            <div className="grid grid-cols-3 gap-1 text-center w-full text-xs mt-1 pt-2 border-t border-slate-700/40">
              <div>
                <div className="text-slate-500">幸运色</div>
                <div className="text-blue-300 mt-0.5">{fortune.lucky.color}</div>
              </div>
              <div>
                <div className="text-slate-500">幸运数</div>
                <div className="text-blue-300 mt-0.5">{fortune.lucky.number}</div>
              </div>
              <div>
                <div className="text-slate-500">吉方位</div>
                <div className="text-blue-300 mt-0.5">{fortune.lucky.direction}</div>
              </div>
            </div>
          </>
        )}
      </div>
      {!isDrawnToday && (
        <button
          onClick={drawNew}
          disabled={drawing}
          className="w-full mt-2 py-2 rounded-lg bg-slate-600/30 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 text-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={drawing ? 'animate-spin' : ''} />
          点击抽取今日运势
        </button>
      )}
      {isDrawnToday && (
        <div className="w-full mt-2 py-2 text-center text-slate-500 text-xs italic">
          今日已抽签，明天再来吧
        </div>
      )}
    </GlassCard>
  );
}
