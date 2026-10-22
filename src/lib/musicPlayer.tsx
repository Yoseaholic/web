import { createContext, useContext, useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import { musicTracks, type Track } from '../data/music';

interface MusicPlayerState {
  currentTrack: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  track: Track;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  playAt: (index: number) => void;
  seek: (sec: number) => void;
  // ref to the audio element so consumers can attach event listeners
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const MusicPlayerContext = createContext<MusicPlayerState | null>(null);

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
  return ctx;
}

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const track = musicTracks[currentTrack] ?? musicTracks[0];

  // Sync play state with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
    // 派发全局状态事件，让 Navbar 同步显示
    window.dispatchEvent(new CustomEvent('music-state', { detail: { isPlaying } }));
  }, [isPlaying, currentTrack]);

  // When track changes, reload
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setCurrentTime(0);
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);
  const next = useCallback(
    () => setCurrentTrack((p) => (musicTracks.length === 0 ? 0 : (p + 1) % musicTracks.length)),
    []
  );
  const prev = useCallback(
    () =>
      setCurrentTrack((p) =>
        musicTracks.length === 0 ? 0 : (p - 1 + musicTracks.length) % musicTracks.length
      ),
    []
  );
  const playAt = useCallback((index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  }, []);
  const seek = useCallback((sec: number) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = sec;
    setCurrentTime(sec);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        track,
        togglePlay,
        next,
        prev,
        playAt,
        seek,
        audioRef,
      }}
    >
      {children}
      {/* Single global audio element */}
      <audio
        ref={audioRef}
        src={track.src}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
        preload="metadata"
      />
    </MusicPlayerContext.Provider>
  );
}
