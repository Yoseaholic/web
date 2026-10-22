import { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import GlassCard from './GlassCard';
import { useMusicPlayer } from '../lib/musicPlayer';
import { musicTracks } from '../data/music';

function formatSeconds(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicCard() {
  const { currentTrack, isPlaying, currentTime, duration, track, togglePlay, next, prev, playAt, seek } =
    useMusicPlayer();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  // 让其他组件（如 navbar 音乐按钮）滚动到播放器并自动播放/暂停
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ action?: 'toggle' | 'play' | 'pause' | 'next' | 'prev' | 'scroll' }>;
      const action = ce.detail?.action ?? 'scroll';
      if (action === 'toggle') togglePlay();
      else if (action === 'play') togglePlay();
      else if (action === 'pause') {
        if (isPlaying) togglePlay();
      } else if (action === 'next') next();
      else if (action === 'prev') prev();
      // scroll: 滚动到播放器位置
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    window.addEventListener('music-control', handler);
    return () => window.removeEventListener('music-control', handler);
  }, [togglePlay, next, prev, isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    const newTime = (v / 100) * duration;
    seek(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 列表显示策略：折叠只显示前 4 首（与参考站一致），展开则可滚动
  const visibleTracks = showAll ? musicTracks : musicTracks.slice(0, 4);
  const hiddenCount = musicTracks.length - 4;

  return (
    <div ref={cardRef} id="music-player">
      <GlassCard title="音乐" icon={<Music size={18} />}>
        {/* Current playing */}
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl shrink-0 overflow-hidden ${isPlaying ? 'animate-pulse-slow' : ''}`}>
            {track.cover ? (
              <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
            ) : (
              '🎵'
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{track.title}</p>
            <p className="text-slate-400 text-xs truncate">{track.artist}</p>
          </div>
        </div>

        {/* Progress bar (seekable) */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-slate-500 text-xs w-9 text-right">{formatSeconds(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={handleSeek}
            className="music-progress flex-1"
            style={{
              background: `linear-gradient(to right, #60a5fa ${progress}%, rgba(148,163,184,0.3) ${progress}%)`,
            }}
          />
          <span className="text-slate-500 text-xs w-9">{formatSeconds(duration)}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            className="text-slate-400 hover:text-white transition-colors"
            onClick={prev}
            title="上一首"
          >
            <SkipBack size={18} />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-400 flex items-center justify-center text-white transition-colors shadow-lg shadow-blue-500/30"
            onClick={togglePlay}
            title={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button
            className="text-slate-400 hover:text-white transition-colors"
            onClick={next}
            title="下一首"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Track list — 可滚动 */}
        <div className="relative">
          <div
            className={`space-y-1 ${
              showAll ? 'max-h-48 overflow-y-auto pr-1' : ''
            }`}
          >
            {visibleTracks.map((t, index) => {
              const realIndex = showAll ? index : index;
              return (
                <div
                  key={t.src + index}
                  onClick={() => {
                    if (realIndex === currentTrack) {
                      togglePlay();
                    } else {
                      playAt(realIndex);
                    }
                  }}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                    currentTrack === realIndex
                      ? 'bg-blue-500/15 text-blue-400'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs w-4 text-center">
                      {currentTrack === realIndex && isPlaying ? '♪' : realIndex + 1}
                    </span>
                    <span className="text-sm truncate">{t.title}</span>
                  </div>
                  <span className="text-xs shrink-0 ml-2 text-slate-500">{t.artist}</span>
                </div>
              );
            })}
          </div>

          {/* 展开/收起按钮 */}
          {hiddenCount > 0 && (
            <button
              onClick={() => setShowAll((s) => !s)}
              className="w-full mt-2 py-1 text-xs text-slate-500 hover:text-blue-300 transition-colors"
            >
              {showAll ? '收起 ▲' : `展开其余 ${hiddenCount} 首 ▼`}
            </button>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
