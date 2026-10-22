import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnnouncementCard from './components/AnnouncementCard';
import MusicCard from './components/MusicCard';
import TagsCard from './components/TagsCard';
import FriendsCard from './components/FriendsCard';
import PostList from './components/PostList';
import SiteStatsCard from './components/SiteStatsCard';
import CalendarCard from './components/CalendarCard';
import MessageCard from './components/MessageCard';
import FortuneCard from './components/FortuneCard';
import ArticleDetail from './components/ArticleDetail';
import SearchModal from './components/SearchModal';
import RainBackground from './components/RainBackground';
import IntroScreen from './components/IntroScreen';
import { MusicPlayerProvider } from './lib/musicPlayer';
import type { Post } from './data/posts';

export default function App() {
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePost]);

  // Listen for global "open-search" event from the navbar
  useEffect(() => {
    const handler = () => setSearchOpen(true);
    window.addEventListener('open-search', handler);
    return () => window.removeEventListener('open-search', handler);
  }, []);

  // Listen for "go-home" event from navbar - returns to home view from any state
  useEffect(() => {
    const handler = () => {
      setActivePost(null);
      setSearchOpen(false);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    };
    window.addEventListener('go-home', handler);
    return () => window.removeEventListener('go-home', handler);
  }, []);

  return (
    <MusicPlayerProvider>
      <div className="min-h-screen relative">
        {/* Background Image */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/images/bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-slate-900/40"></div>
        </div>
        
        {/* Real Rain Effect */}
        <RainBackground />

        {/* Content */}
        <div className="relative z-10">
          <Navbar />

          {activePost ? (
            <div className="pt-14">
              <ArticleDetail post={activePost} onBack={() => setActivePost(null)} />
            </div>
          ) : (
            <>
              <div id="home">
                <Hero />
              </div>

              {/* Three-column layout */}
              <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* Left Sidebar */}
                  <aside className="lg:col-span-3 space-y-4 order-2 lg:order-1">
                    <div className="opacity-0 animate-fade-in-up animate-delay-100">
                      <AnnouncementCard />
                    </div>
                    <div className="opacity-0 animate-fade-in-up animate-delay-200">
                      <MusicCard />
                    </div>
                    <div id="tags" className="opacity-0 animate-fade-in-up animate-delay-300">
                      <TagsCard />
                    </div>
                    <div className="opacity-0 animate-fade-in-up animate-delay-400">
                      <MessageCard />
                    </div>
                  </aside>

                  {/* Main Content */}
                  <main className="lg:col-span-6 order-1 lg:order-2 space-y-4">
                    <div id="articles" className="opacity-0 animate-fade-in-up">
                      <PostList onOpenPost={setActivePost} />
                    </div>
                  </main>

                  {/* Right Sidebar */}
                  <aside className="lg:col-span-3 space-y-4 order-3">
                    <div id="about" className="opacity-0 animate-fade-in-up animate-delay-100">
                      <SiteStatsCard />
                    </div>
                    <div className="opacity-0 animate-fade-in-up animate-delay-150">
                      <FortuneCard />
                    </div>
                    <div className="opacity-0 animate-fade-in-up animate-delay-200">
                      <CalendarCard />
                    </div>
                    <div id="friends" className="opacity-0 animate-fade-in-up animate-delay-300">
                      <FriendsCard />
                    </div>
                  </aside>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <footer className="relative z-10 py-8 border-t border-slate-700/30">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-slate-500 text-sm">
                © 2026 鹤川 · Powered by React & Tailwind CSS
              </p>
              <p className="text-slate-600 text-xs mt-1">
                「 愿你我都能在代码与文字中，找到属于自己的星辰大海 」
              </p>
            </div>
          </footer>
        </div>

        <SearchModal
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onOpenPost={(p) => {
            setActivePost(p);
          }}
        />
        {showIntro && <IntroScreen onFinish={() => setShowIntro(false)} />}
      </div>
    </MusicPlayerProvider>
  );
}
