import { useState, useEffect } from 'react';
import { Search, Music, Sun, Moon, Menu, X, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useMusicPlayer } from '../lib/musicPlayer';

const navLinks = [
  { name: '首页', target: 'home' },
  { name: '文章', target: 'articles' },
  { name: '标签', target: 'tags' },
  { name: '友链', target: 'friends' },
  { name: '关于', target: 'about' },
];

function MiniPlayer() {
  const { track, isPlaying, togglePlay, next, prev } = useMusicPlayer();
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded bg-blue-500 flex items-center justify-center text-white shrink-0 overflow-hidden ${isPlaying ? 'animate-spin-slow' : ''}`}>
          {track.cover ? <img src={track.cover} className="w-full h-full object-cover" /> : '🎵'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-xs font-medium truncate">{track.title}</p>
          <p className="text-slate-400 text-[10px] truncate">{track.artist}</p>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button onClick={prev} className="text-slate-400 hover:text-white"><SkipBack size={14}/></button>
        <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {isPlaying ? <Pause size={14}/> : <Play size={14} className="ml-0.5"/>}
        </button>
        <button onClick={next} className="text-slate-400 hover:text-white"><SkipForward size={14}/></button>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });
  const [isDark, setIsDark] = useState(theme === 'dark');
  const [musicOn, setMusicOn] = useState(false);
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);

  useEffect(() => {
    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 监听全局音乐播放状态（来自 MusicPlayerProvider），更新 navbar 音乐按钮样式
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ isPlaying: boolean }>).detail;
      if (detail) setMusicOn(detail.isPlaying);
    };
    window.addEventListener('music-state', handler);
    return () => window.removeEventListener('music-state', handler);
  }, []);

  const scrollTo = (id: string) => {
    if (id === 'home') {
      // 触发返回主页（如果当前在文章详情页，会先返回首页）
      window.dispatchEvent(new CustomEvent('go-home'));
      return;
    }
    // 其他锚点：如果在文章详情页，先返回首页再滚动
    window.dispatchEvent(new CustomEvent('go-home'));
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  const handleMusic = () => {
    setMusicPanelOpen((open) => !open);
  };

  const handleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo - click returns to home from any state */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('go-home'))}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src="/images/avatar.png"
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover border border-slate-500/30"
            />
            <span className="brand-gradient text-lg">鹤川</span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.target)}
                className="text-slate-300 hover:text-white text-sm transition-colors duration-200 hover:underline underline-offset-4"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleSearch}
              title="搜索"
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              <Search size={18} />
            </button>
            <div className="relative">
              <button
                onClick={handleMusic}
                title="音乐控制"
                className={`transition-colors p-1.5 rounded-lg hover:bg-white/10 ${
                  musicOn ? 'text-blue-400 animate-pulse-slow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Music size={18} />
              </button>
              
              {/* Popover Mini Player */}
              <div className={`absolute right-0 top-full mt-2 w-64 transition-all duration-300 z-[60] ${
                musicPanelOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-2 pointer-events-none'
              }`}>
                <div className="glass-card p-4 shadow-2xl border-blue-500/30">
                  <MiniPlayer />
                </div>
              </div>
            </div>
            <button
              onClick={handleTheme}
              title="切换主题"
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="md:hidden text-slate-400 hover:text-white transition-colors p-1.5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              title="菜单"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-700/50 mt-2 pt-3">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => {
                  scrollTo(link.target);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left text-slate-300 hover:text-white py-2 px-2 text-sm transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
