import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Volume1,
  Nfc, Bluetooth, ListPlus, Heart,
  Shuffle, Repeat, Share2,
  Disc3, Radio, Waves, ExternalLink, ChevronLeft, ChevronRight,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════
   TAPPLAY — Modern Music Streaming Widget
   with Spotify / Apple Music / SoundCloud Embeds
   ═══════════════════════════════════════════════════════════ */

const ACCENT = '#E52324';
const ACCENT_GLOW = 'rgba(229, 35, 36, 0.4)';
const ACCENT_DIM = 'rgba(229, 35, 36, 0.15)';

/* ─── Track Data (internal TapPlay tracks) ─── */
interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  duration: number;
}

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight Circuit',
    artist: 'NEON PULSE',
    album: 'Digital Dreams',
    artwork: 'https://images.unsplash.com/photo-1591856994616-80dbce32d7d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbGJ1bSUyMGNvdmVyJTIwYXJ0JTIwYWJzdHJhY3QlMjBuZW9uJTIwZGFya3xlbnwxfHx8fDE3NzMxOTI4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    duration: 234,
  },
  {
    id: '2',
    title: 'Analog Memories',
    artist: 'VINYL GHOSTS',
    album: 'Retrograde',
    artwork: 'https://images.unsplash.com/photo-1769090327906-210d10654db1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZCUyMGFsYnVtJTIwYXJ0d29yayUyMG11c2ljfGVufDF8fHx8MTc3MzE5Mjg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    duration: 198,
  },
  {
    id: '3',
    title: 'Crimson Wave',
    artist: 'RED STATIC',
    album: 'Afterglow',
    artwork: 'https://images.unsplash.com/photo-1580529352963-57ac28432755?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwYWJzdHJhY3QlMjBkYXJrJTIwcmVkfGVufDF8fHx8MTc3MzE5Mjg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    duration: 267,
  },
];

/* ─── Embed Track Data for external services ─── */
interface EmbedTrack {
  id: string;
  title: string;
  artist: string;
  embedUrl: string;
  externalUrl: string;
}

const SPOTIFY_TRACKS: EmbedTrack[] = [
  {
    id: 'sp1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    embedUrl: 'https://open.spotify.com/embed/track/0VjIjW4GlUZAMYd2vXMi3b?utm_source=generator&theme=0',
    externalUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
  },
  {
    id: 'sp2',
    title: 'Say So',
    artist: 'Doja Cat',
    embedUrl: 'https://open.spotify.com/embed/track/3Dv1eDb0MEgF93GpLXlucZ?utm_source=generator&theme=0',
    externalUrl: 'https://open.spotify.com/track/3Dv1eDb0MEgF93GpLXlucZ',
  },
  {
    id: 'sp3',
    title: 'SICKO MODE',
    artist: 'Travis Scott',
    embedUrl: 'https://open.spotify.com/embed/track/2xLMifQCjDGFmkHkpNLD9h?utm_source=generator&theme=0',
    externalUrl: 'https://open.spotify.com/track/2xLMifQCjDGFmkHkpNLD9h',
  },
  {
    id: 'sp4',
    title: 'Yellow',
    artist: 'Coldplay',
    embedUrl: 'https://open.spotify.com/embed/track/3AJwUDP919kvQ9QcozQPxg?utm_source=generator&theme=0',
    externalUrl: 'https://open.spotify.com/track/3AJwUDP919kvQ9QcozQPxg',
  },
  {
    id: 'sp5',
    title: 'Last Night',
    artist: 'Morgan Wallen',
    embedUrl: 'https://open.spotify.com/embed/track/7K3BhSpAxZBznislvUMVtn?utm_source=generator&theme=0',
    externalUrl: 'https://open.spotify.com/track/7K3BhSpAxZBznislvUMVtn',
  },
  {
    id: 'sp6',
    title: 'Bangarang',
    artist: 'Skrillex',
    embedUrl: 'https://open.spotify.com/embed/track/6VRhkROS2SZHGlp0pxndbJ?utm_source=generator&theme=0',
    externalUrl: 'https://open.spotify.com/track/6VRhkROS2SZHGlp0pxndbJ',
  },
];

const APPLE_TRACKS: EmbedTrack[] = [
  {
    id: 'ap1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    embedUrl: 'https://embed.music.apple.com/us/album/blinding-lights/1499378108?i=1499378615&app=music&theme=dark',
    externalUrl: 'https://music.apple.com/us/album/blinding-lights/1499378108?i=1499378615',
  },
  {
    id: 'ap2',
    title: 'Anti-Hero',
    artist: 'Taylor Swift',
    embedUrl: 'https://embed.music.apple.com/us/album/anti-hero/1645315529?i=1645315935&app=music&theme=dark',
    externalUrl: 'https://music.apple.com/us/album/anti-hero/1645315529?i=1645315935',
  },
  {
    id: 'ap3',
    title: 'As It Was',
    artist: 'Harry Styles',
    embedUrl: 'https://embed.music.apple.com/us/album/as-it-was/1615584999?i=1615585008&app=music&theme=dark',
    externalUrl: 'https://music.apple.com/us/album/as-it-was/1615584999?i=1615585008',
  },
];

const SOUNDCLOUD_TRACKS: EmbedTrack[] = [
  {
    id: 'sc1',
    title: 'Wanderlust',
    artist: 'The Weeknd',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/110045951&color=%23e52324&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true',
    externalUrl: 'https://soundcloud.com/theweeknd/wanderlust',
  },
  {
    id: 'sc2',
    title: 'Scary Monsters and Nice Sprites',
    artist: 'Skrillex',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/17790341&color=%23e52324&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true',
    externalUrl: 'https://soundcloud.com/skrillex/scary-monsters-and-nice-sprites',
  },
  {
    id: 'sc3',
    title: 'Strobe',
    artist: 'deadmau5',
    embedUrl: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/18216134&color=%23e52324&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true',
    externalUrl: 'https://soundcloud.com/deadmau5/strobe',
  },
];

/* ─── Source Tabs ─── */
type SourceTab = 'tapplay' | 'spotify' | 'apple' | 'soundcloud';
interface SourceConfig {
  id: SourceTab;
  label: string;
  icon: string;
  color: string;
}

const SOURCES: SourceConfig[] = [
  { id: 'tapplay', label: 'TapPlay', icon: '🎵', color: ACCENT },
  { id: 'spotify', label: 'Spotify', icon: '🟢', color: '#1DB954' },
  { id: 'apple', label: 'Apple', icon: '🍎', color: '#FC3C44' },
  { id: 'soundcloud', label: 'SoundCloud', icon: '☁️', color: '#FF5500' },
];

/* ─── Helpers ─── */
function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function getEmbedTracks(source: SourceTab): EmbedTrack[] {
  switch (source) {
    case 'spotify': return SPOTIFY_TRACKS;
    case 'apple': return APPLE_TRACKS;
    case 'soundcloud': return SOUNDCLOUD_TRACKS;
    default: return [];
  }
}

function getEmbedHeight(source: SourceTab): number {
  switch (source) {
    case 'spotify': return 352;
    case 'apple': return 175;
    case 'soundcloud': return 300;
    default: return 352;
  }
}

/* ═══════════════════════════════════════════════════════════
   WAVEFORM VISUALIZER (Canvas)
   ═══════════════════════════════════════════════════════════ */
function WaveformBar({
  progress,
  isPlaying,
  onSeek,
}: {
  progress: number;
  isPlaying: boolean;
  onSeek: (pct: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const phaseRef = useRef(0);

  const barsRef = useRef<number[]>([]);
  if (barsRef.current.length === 0) {
    const count = 64;
    for (let i = 0; i < count; i++) {
      const base = 0.3 + Math.random() * 0.7;
      const envelope = Math.sin((i / count) * Math.PI) * 0.4 + 0.6;
      barsRef.current.push(base * envelope);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const bars = barsRef.current;
      const count = bars.length;
      const gap = 2;
      const barW = (w - gap * (count - 1)) / count;

      if (isPlaying) phaseRef.current += 0.06;

      for (let i = 0; i < count; i++) {
        const x = i * (barW + gap);
        const pct = i / count;
        const played = pct <= progress;

        let amplitude = bars[i];
        if (isPlaying) {
          const dist = Math.abs(pct - progress);
          if (dist < 0.15) {
            amplitude *= 1 + Math.sin(phaseRef.current * 3 + i * 0.5) * 0.3 * (1 - dist / 0.15);
          }
        }

        const barH = Math.max(3, amplitude * (h - 4));
        const y = (h - barH) / 2;
        const radius = Math.min(barW / 2, 2);

        ctx.beginPath();
        ctx.roundRect(x, y, barW, barH, radius);

        if (played) {
          const grad = ctx.createLinearGradient(x, y, x, y + barH);
          grad.addColorStop(0, ACCENT);
          grad.addColorStop(1, '#ff6b6b');
          ctx.fillStyle = grad;
          ctx.shadowColor = ACCENT_GLOW;
          ctx.shadowBlur = isPlaying ? 6 : 3;
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.12)';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      const px = progress * w;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.strokeStyle = ACCENT;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = ACCENT_GLOW;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(px, h / 2, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.shadowColor = ACCENT_GLOW;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      frameRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [progress, isPlaying]);

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(pct);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-14 cursor-pointer group"
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NFC TAP BUTTON
   ═══════════════════════════════════════════════════════════ */
function NfcTapButton() {
  const [tapped, setTapped] = useState(false);
  const [ripple, setRipple] = useState(false);

  const handleTap = () => {
    setRipple(true);
    setTimeout(() => {
      setTapped(true);
      setTimeout(() => { setTapped(false); setRipple(false); }, 2000);
    }, 600);
  };

  return (
    <motion.button
      onClick={handleTap}
      whileTap={{ scale: 0.92 }}
      className="relative flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        background: tapped
          ? 'linear-gradient(135deg, rgba(229,35,36,0.2) 0%, rgba(229,35,36,0.05) 100%)'
          : 'rgba(255,255,255,0.04)',
        borderColor: tapped ? 'rgba(229,35,36,0.5)' : 'rgba(255,255,255,0.08)',
        boxShadow: tapped ? `0 0 20px ${ACCENT_GLOW}` : 'none',
      }}
    >
      <AnimatePresence>
        {ripple && (
          <motion.div
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 m-auto w-10 h-10 rounded-full"
            style={{ background: ACCENT_GLOW }}
          />
        )}
      </AnimatePresence>

      <div className="relative">
        <Nfc
          className="w-5 h-5 transition-colors"
          style={{ color: tapped ? ACCENT : 'rgba(255,255,255,0.5)' }}
        />
        {!tapped && (
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: ACCENT_DIM }}
          />
        )}
      </div>

      <div className="text-left z-10">
        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: tapped ? ACCENT : 'rgba(255,255,255,0.7)' }}>
          {tapped ? 'Merch Unlocked!' : 'Tap to Unlock'}
        </p>
        <p className="text-[9px] text-white/30">
          {tapped ? 'Exclusive content available' : 'NFC merch & exclusives'}
        </p>
      </div>

      <AnimatePresence>
        {tapped && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            className="ml-auto w-5 h-5 rounded-full flex items-center justify-center text-[10px]"
            style={{ background: ACCENT }}
          >
            ✓
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMBED PLAYER VIEW (Spotify / Apple Music / SoundCloud)
   ═══════════════════════════════════════════════════════════ */
function EmbedPlayerView({ source }: { source: SourceTab }) {
  const tracks = getEmbedTracks(source);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const embedHeight = getEmbedHeight(source);
  const sourceConfig = SOURCES.find((s) => s.id === source)!;
  const track = tracks[selectedIdx];

  if (!track) return null;

  const prev = () => setSelectedIdx((i) => (i - 1 + tracks.length) % tracks.length);
  const next = () => setSelectedIdx((i) => (i + 1) % tracks.length);

  return (
    <motion.div
      key={source}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Track selector carousel */}
      <div className="flex items-center gap-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="p-1.5 rounded-full cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <ChevronLeft className="w-4 h-4 text-white/50" />
        </motion.button>

        <div className="flex-1 text-center min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <p
                className="text-sm font-bold text-white truncate"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {track.title}
              </p>
              <p className="text-[11px] text-white/35 truncate">{track.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="p-1.5 rounded-full cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <ChevronRight className="w-4 h-4 text-white/50" />
        </motion.button>
      </div>

      {/* Track dots */}
      <div className="flex justify-center gap-1.5 mb-4">
        {tracks.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setSelectedIdx(i)}
            className="transition-all duration-300 cursor-pointer rounded-full"
            style={{
              width: i === selectedIdx ? 16 : 6,
              height: 6,
              background: i === selectedIdx ? sourceConfig.color : 'rgba(255,255,255,0.15)',
              boxShadow: i === selectedIdx ? `0 0 8px ${sourceConfig.color}66` : 'none',
            }}
          />
        ))}
      </div>

      {/* Embed iframe with glow wrapper */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          boxShadow: `0 0 30px ${sourceConfig.color}15, 0 10px 40px rgba(0,0,0,0.4)`,
          border: `1px solid ${sourceConfig.color}22`,
        }}
      >
        {/* Loading shimmer behind iframe */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, ${sourceConfig.color}08 0%, rgba(0,0,0,0.3) 50%, ${sourceConfig.color}05 100%)`,
          }}
        >
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 w-1/3"
            style={{
              background: `linear-gradient(90deg, transparent, ${sourceConfig.color}10, transparent)`,
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={track.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            <iframe
              src={track.embedUrl}
              width="100%"
              height={embedHeight}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{
                borderRadius: '16px',
                display: 'block',
                background: 'transparent',
              }}
              title={`${track.title} - ${track.artist}`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Open in app link */}
      <motion.a
        href={track.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl transition-all cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${sourceConfig.color}20 0%, ${sourceConfig.color}08 100%)`,
          border: `1px solid ${sourceConfig.color}30`,
        }}
      >
        <ExternalLink className="w-3.5 h-3.5" style={{ color: sourceConfig.color }} />
        <span
          className="text-[11px] font-bold uppercase tracking-wider"
          style={{ color: sourceConfig.color }}
        >
          Open in {sourceConfig.label}
        </span>
      </motion.a>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN TAPPLAY WIDGET
   ═══════════════════════════════════════════════════════════ */
export function TapPlayWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [activeSource, setActiveSource] = useState<SourceTab>('tapplay');
  const [isLiked, setIsLiked] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const progressRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const track = TRACKS[currentTrackIdx];
  const isNativePlayer = activeSource === 'tapplay';

  // Progress simulation (only for TapPlay internal player)
  useEffect(() => {
    if (isPlaying && isNativePlayer) {
      intervalRef.current = setInterval(() => {
        progressRef.current += 1 / track.duration;
        if (progressRef.current >= 1) {
          progressRef.current = 0;
          if (!isRepeat) {
            setCurrentTrackIdx((i) => (i + 1) % TRACKS.length);
          }
        }
        setProgress(progressRef.current);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, track.duration, isRepeat, isNativePlayer]);

  // Pause native player when switching to embeds
  useEffect(() => {
    if (!isNativePlayer) {
      setIsPlaying(false);
    }
  }, [isNativePlayer]);

  const handleSeek = useCallback((pct: number) => {
    progressRef.current = pct;
    setProgress(pct);
  }, []);

  const nextTrack = () => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentTrackIdx((i) => (i + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  };

  const togglePlay = () => setIsPlaying((p) => !p);

  const effectiveVolume = isMuted ? 0 : volume;
  const VolumeIcon = effectiveVolume === 0 ? VolumeX : effectiveVolume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-8"
      style={{
        background: 'radial-gradient(ellipse at 50% 20%, rgba(229,35,36,0.06) 0%, #000 60%)',
      }}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: `${SOURCES.find(s => s.id === activeSource)?.color || ACCENT}08` }}
        />
        <motion.div
          animate={{
            x: [0, -25, 20, 0],
            y: [0, 20, -15, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ background: `${SOURCES.find(s => s.id === activeSource)?.color || ACCENT}06` }}
        />
      </div>

      {/* ─── Player Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full max-w-[420px] rounded-[32px] overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(40px)',
          boxShadow: `0 0 80px rgba(0,0,0,0.5), 0 0 40px ${ACCENT_DIM}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
      >
        {/* Inner glass highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%)',
          }}
        />

        <div className="relative z-10 p-6 sm:p-8">

          {/* ─── Header: Logo + Tagline ─── */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-1.5">
              <motion.div
                animate={(isPlaying && isNativePlayer) ? { rotate: 360 } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Disc3 className="w-5 h-5" style={{ color: ACCENT }} />
              </motion.div>
              <h1
                className="text-xl font-black uppercase tracking-[0.15em]"
                style={{ fontFamily: "'Outfit', sans-serif", color: '#fff' }}
              >
                Tap<span style={{ color: ACCENT }}>Play</span>
              </h1>
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium">
              Tap to Unlock Exclusive Music
            </p>
          </div>

          {/* ─── Source Tabs ─── */}
          <div className="flex gap-1.5 p-1 rounded-2xl mb-6" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {SOURCES.map((src) => {
              const active = activeSource === src.id;
              return (
                <button
                  key={src.id}
                  onClick={() => setActiveSource(src.id)}
                  className="relative flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer"
                  style={{
                    color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="source-tab-bg"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: `linear-gradient(135deg, ${src.color}33 0%, ${src.color}11 100%)`,
                        border: `1px solid ${src.color}44`,
                        boxShadow: `0 0 15px ${src.color}22`,
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 text-[11px]">{src.icon}</span>
                  <span className="relative z-10 hidden sm:inline">{src.label}</span>
                  <span className="relative z-10 sm:hidden">{src.label.slice(0, 3)}</span>
                </button>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════
             CONTENT AREA — TapPlay native vs Embed iframes
             ═══════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {isNativePlayer ? (
              <motion.div
                key="tapplay-native"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {/* ─── Album Artwork ─── */}
                <div className="flex justify-center mb-6">
                  <motion.div
                    className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl overflow-hidden"
                    style={{
                      boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px ${isPlaying ? ACCENT_DIM : 'transparent'}`,
                    }}
                  >
                    <motion.img
                      key={track.id}
                      src={track.artwork}
                      alt={track.album}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: isPlaying ? 360 : 0,
                      }}
                      transition={
                        isPlaying
                          ? { rotate: { duration: 30, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.5 }, scale: { duration: 0.5 } }
                          : { opacity: { duration: 0.5 }, scale: { duration: 0.5 } }
                      }
                    />

                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.4) 100%)',
                      }}
                    />

                    <AnimatePresence>
                      {isPlaying && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                          style={{
                            background: 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${ACCENT}44`,
                          }}
                        >
                          <motion.div className="flex items-end gap-[2px] h-3">
                            {[0, 1, 2, 3].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ height: ['4px', '12px', '6px', '10px', '4px'] }}
                                transition={{
                                  duration: 0.8 + i * 0.1,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: i * 0.1,
                                }}
                                className="w-[2px] rounded-full"
                                style={{ background: ACCENT }}
                              />
                            ))}
                          </motion.div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-white/70">
                            Live
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(10px)',
                        color: ACCENT,
                        border: `1px solid ${ACCENT}33`,
                      }}
                    >
                      TapPlay
                    </div>
                  </motion.div>
                </div>

                {/* ─── Track Info ─── */}
                <div className="text-center mb-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2
                        className="text-lg sm:text-xl font-black uppercase tracking-tight text-white mb-1"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                      >
                        {track.title}
                      </h2>
                      <p className="text-sm text-white/40 font-medium">{track.artist}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* ─── Secondary Controls Row ─── */}
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-1.5 transition-all cursor-pointer"
                  >
                    <Heart
                      className="w-4 h-4 transition-colors"
                      style={{ color: isLiked ? ACCENT : 'rgba(255,255,255,0.3)' }}
                      fill={isLiked ? ACCENT : 'none'}
                    />
                  </button>
                  <button
                    onClick={() => setIsShuffle(!isShuffle)}
                    className="p-1.5 transition-all cursor-pointer"
                  >
                    <Shuffle
                      className="w-4 h-4"
                      style={{ color: isShuffle ? ACCENT : 'rgba(255,255,255,0.3)' }}
                    />
                  </button>
                  <button
                    onClick={() => setIsRepeat(!isRepeat)}
                    className="p-1.5 transition-all cursor-pointer"
                  >
                    <Repeat
                      className="w-4 h-4"
                      style={{ color: isRepeat ? ACCENT : 'rgba(255,255,255,0.3)' }}
                    />
                  </button>
                  <button className="p-1.5 transition-all cursor-pointer">
                    <Share2 className="w-4 h-4 text-white/30 hover:text-white/60" />
                  </button>
                </div>

                {/* ─── Main Controls ─── */}
                <div className="flex items-center justify-center gap-6 mb-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevTrack}
                    className="p-3 rounded-full transition-colors cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <SkipBack className="w-5 h-5 text-white/70" fill="rgba(255,255,255,0.7)" />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={togglePlay}
                    className="relative p-5 rounded-full cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${ACCENT} 0%, #ff4444 100%)`,
                      boxShadow: `0 8px 30px ${ACCENT_GLOW}, 0 0 60px ${ACCENT_DIM}`,
                    }}
                  >
                    <AnimatePresence>
                      {isPlaying && (
                        <motion.div
                          initial={{ scale: 1, opacity: 0.5 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute inset-0 rounded-full"
                          style={{ border: `2px solid ${ACCENT}` }}
                        />
                      )}
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                      {isPlaying ? (
                        <motion.div
                          key="pause"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Pause className="w-7 h-7 text-white" fill="white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="play"
                          initial={{ scale: 0, rotate: 90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: -90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Play className="w-7 h-7 text-white ml-0.5" fill="white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextTrack}
                    className="p-3 rounded-full transition-colors cursor-pointer"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <SkipForward className="w-5 h-5 text-white/70" fill="rgba(255,255,255,0.7)" />
                  </motion.button>
                </div>

                {/* ─── Waveform Progress Bar ─── */}
                <div className="mb-2">
                  <WaveformBar
                    progress={progress}
                    isPlaying={isPlaying}
                    onSeek={handleSeek}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-white/30 font-mono mb-5 px-0.5">
                  <span>{formatTime(progress * track.duration)}</span>
                  <span>{formatTime(track.duration)}</span>
                </div>

                {/* ─── Volume Slider ─── */}
                <div className="flex items-center gap-3 mb-2 px-1">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 cursor-pointer"
                  >
                    <VolumeIcon className="w-4 h-4 text-white/40" />
                  </button>
                  <div className="flex-1 relative h-6 flex items-center group">
                    <div
                      className="absolute w-full h-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.08)' }}
                    />
                    <motion.div
                      className="absolute h-1 rounded-full"
                      style={{
                        width: `${effectiveVolume * 100}%`,
                        background: `linear-gradient(90deg, ${ACCENT} 0%, #ff6b6b 100%)`,
                        boxShadow: `0 0 8px ${ACCENT_GLOW}`,
                      }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={effectiveVolume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value));
                        if (isMuted) setIsMuted(false);
                      }}
                      className="absolute w-full h-6 opacity-0 cursor-pointer z-10"
                    />
                    <div
                      className="absolute w-3 h-3 rounded-full bg-white pointer-events-none transition-shadow"
                      style={{
                        left: `calc(${effectiveVolume * 100}% - 6px)`,
                        boxShadow: `0 0 10px ${ACCENT_GLOW}`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-white/25 font-mono w-8 text-right">
                    {Math.round(effectiveVolume * 100)}%
                  </span>
                </div>
              </motion.div>
            ) : (
              /* ════════════════════════════════════════════
                 EXTERNAL EMBED PLAYER (Spotify / Apple / SC)
                 ════════════════════════════════════════════ */
              <EmbedPlayerView key={activeSource} source={activeSource} />
            )}
          </AnimatePresence>

          {/* ─── Divider ─── */}
          <div className="my-5 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* ─── Bottom Actions Row (always visible) ─── */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            <NfcTapButton />

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-3 py-3 rounded-2xl border transition-all cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Bluetooth className="w-4 h-4 text-white/40" />
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                Connect
              </span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="flex items-center justify-center gap-2 px-3 py-3 rounded-2xl border transition-all cursor-pointer"
              style={{
                background: showPlaylist ? ACCENT_DIM : 'rgba(255,255,255,0.04)',
                borderColor: showPlaylist ? `${ACCENT}44` : 'rgba(255,255,255,0.08)',
              }}
            >
              <ListPlus className="w-4 h-4" style={{ color: showPlaylist ? ACCENT : 'rgba(255,255,255,0.4)' }} />
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: showPlaylist ? ACCENT : 'rgba(255,255,255,0.4)' }}
              >
                Add
              </span>
            </motion.button>
          </div>

          {/* ─── Playlist Drawer ─── */}
          <AnimatePresence>
            {showPlaylist && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-4"
              >
                <div
                  className="rounded-2xl p-3"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold mb-3">
                    {isNativePlayer ? 'Up Next' : `${SOURCES.find(s => s.id === activeSource)?.label} Tracks`}
                  </p>

                  {isNativePlayer ? (
                    /* TapPlay internal queue */
                    TRACKS.map((t, i) => (
                      <motion.button
                        key={t.id}
                        onClick={() => {
                          setCurrentTrackIdx(i);
                          progressRef.current = 0;
                          setProgress(0);
                        }}
                        className="flex items-center gap-3 w-full p-2 rounded-xl transition-all cursor-pointer mb-1"
                        style={{
                          background: i === currentTrackIdx ? ACCENT_DIM : 'transparent',
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <img
                          src={t.artwork}
                          alt={t.album}
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                        <div className="text-left flex-1 min-w-0">
                          <p
                            className="text-[11px] font-bold truncate"
                            style={{
                              color: i === currentTrackIdx ? ACCENT : 'rgba(255,255,255,0.7)',
                            }}
                          >
                            {t.title}
                          </p>
                          <p className="text-[9px] text-white/30 truncate">{t.artist}</p>
                        </div>
                        <span className="text-[9px] text-white/20 font-mono">
                          {formatTime(t.duration)}
                        </span>
                        {i === currentTrackIdx && isPlaying && (
                          <motion.div className="flex items-end gap-[1.5px] h-3 ml-1">
                            {[0, 1, 2].map((j) => (
                              <motion.div
                                key={j}
                                animate={{ height: ['3px', '10px', '5px', '8px', '3px'] }}
                                transition={{
                                  duration: 0.7 + j * 0.1,
                                  repeat: Infinity,
                                  ease: 'easeInOut',
                                  delay: j * 0.08,
                                }}
                                className="w-[1.5px] rounded-full"
                                style={{ background: ACCENT }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </motion.button>
                    ))
                  ) : (
                    /* External embed track list */
                    getEmbedTracks(activeSource).map((t) => {
                      const srcColor = SOURCES.find(s => s.id === activeSource)?.color || '#fff';
                      return (
                        <motion.a
                          key={t.id}
                          href={t.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 w-full p-2 rounded-xl transition-all cursor-pointer mb-1"
                          style={{ background: 'transparent' }}
                          whileHover={{ x: 4, background: 'rgba(255,255,255,0.03)' }}
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-[14px]"
                            style={{ background: `${srcColor}15` }}
                          >
                            {SOURCES.find(s => s.id === activeSource)?.icon}
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-[11px] font-bold truncate text-white/70">
                              {t.title}
                            </p>
                            <p className="text-[9px] text-white/30 truncate">{t.artist}</p>
                          </div>
                          <ExternalLink className="w-3 h-3 text-white/20" />
                        </motion.a>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ─── Footer ─── */}
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <div className="flex items-center gap-1.5">
              <Radio className="w-3 h-3" style={{ color: SOURCES.find(s => s.id === activeSource)?.color || ACCENT }} />
              <span className="text-[9px] text-white/20 uppercase tracking-wider font-medium">
                {isNativePlayer ? 'High Quality Audio' : `Streaming via ${SOURCES.find(s => s.id === activeSource)?.label}`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Waves className="w-3 h-3 text-white/15" />
              <span className="text-[9px] text-white/20 font-mono">
                {isNativePlayer ? '320kbps' : 'Embed'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
