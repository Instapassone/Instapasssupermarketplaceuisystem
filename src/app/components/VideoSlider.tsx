import { useState, useRef, useCallback, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Radio,
  Heart,
  MoreHorizontal,
  Shuffle,
  Repeat,
  ListMusic,
  Cast,
  Monitor,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import tapPlayerLogo from "figma:asset/431c75b9e2db0d18f12eb6bf59d059e5aa9b4d68.png";
import tapPlayLogo from "figma:asset/1c1143f35abd5b6c7a9fe57688987d2ca17b6a46.png";
import kendrickImg from "figma:asset/0dd5f8fc13d7ff6ebe85f826e7ca899abb1c5a1e.png";
import taylorImg from "figma:asset/5fd2a0f03b9867b36cf6dbd29e1abfc3bb1962d2.png";
import festivalsImg from "figma:asset/6ae2ee7eb1417edbbd5969fa23aafa101e875eba.png";
import beyonceImg from "figma:asset/a1cd832870905dabefe62ee289049edbaf5ea2e6.png";
import drakeImg from "figma:asset/440307d5a1390d64d3b7945585097e23f1087e40.png";
import sportsImg from "figma:asset/d4e9e9f480bd6a1911e3371c3c5c96417bfb8ef4.png";
import hamiltonImg from "figma:asset/6a4a0883fffe1b2c9e9829330368aab41132c51a.png";

/* ─── TapPlay brand color ─── */
const TP_BLUE = '#1E3A5F';
const TP_BLUE_LIGHT = '#2B5A8F';

interface VideoSlide {
  id: string;
  label: string;
  sublabel: string;
  artist: string;
  video: string;
  poster: string;
  duration: string;
  imageOnly?: boolean;
}

const videoSlides: VideoSlide[] = [
  {
    id: 'concert',
    label: 'Live Concerts',
    sublabel: 'Feel the energy of the crowd',
    artist: 'TapPlayer Live',
    video: 'https://videos.pexels.com/video-files/2022395/2022395-hd_1920_1080_30fps.mp4',
    poster: 'https://images.unsplash.com/photo-1558258021-971dd2148be5?w=800&q=80',
    duration: '3:47',
  },
  {
    id: 'drake',
    label: 'Drake Live',
    sublabel: "It's All A Blur Tour",
    artist: 'Drake',
    video: '',
    poster: drakeImg,
    duration: '4:12',
    imageOnly: true,
  },
  {
    id: 'taylor',
    label: 'Taylor Swift Live',
    sublabel: 'The Eras Tour',
    artist: 'Taylor Swift',
    video: '',
    poster: taylorImg,
    duration: '5:33',
    imageOnly: true,
  },
  {
    id: 'festivals',
    label: 'Music Festivals',
    sublabel: 'Rolling Loud & more',
    artist: 'Festival Season',
    video: '',
    poster: festivalsImg,
    duration: '4:20',
    imageOnly: true,
  },
  {
    id: 'theater',
    label: 'Hamilton',
    sublabel: 'The hit Broadway musical',
    artist: 'Hamilton on Broadway',
    video: '',
    poster: hamiltonImg,
    duration: '5:10',
    imageOnly: true,
  },
  {
    id: 'beyonce',
    label: 'Beyonce Live',
    sublabel: 'Renaissance World Tour',
    artist: 'Beyonce',
    video: '',
    poster: beyonceImg,
    duration: '4:45',
    imageOnly: true,
  },
  {
    id: 'kendrick',
    label: 'Kendrick Lamar Live',
    sublabel: 'The Big Steppers Tour',
    artist: 'Kendrick Lamar',
    video: '',
    poster: kendrickImg,
    duration: '3:58',
    imageOnly: true,
  },
  {
    id: 'sports',
    label: 'Live Sports',
    sublabel: 'Courtside to nosebleed seats',
    artist: 'Game Day',
    video: '',
    poster: sportsImg,
    duration: '2:58',
    imageOnly: true,
  },
];

const SLIDE_DURATION = 7000;

/* ─── TapPlay brand header — matches reference ─── */
function TapPlayBrand() {
  return (
    <div className="flex items-center gap-6 overflow-hidden">
      {/* Tap Player logo — large & prominent */}
      <img
        src={tapPlayerLogo}
        alt="Tap Player"
        className="h-32 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        style={{ mixBlendMode: 'screen', filter: 'contrast(1.5) brightness(1.2)' }}
      />
      {/* Divider */}
      <div className="h-16 w-px bg-white/20 flex-shrink-0" />
      {/* Powered by Tap Play — inline */}
      <div className="flex items-center gap-3">
        <span className="text-[15px] text-white/55 tracking-wide whitespace-nowrap">Powered by</span>
        <img
          src={tapPlayLogo}
          alt="Tap Play"
          className="h-20 w-auto object-contain brightness-0 invert opacity-90 drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
        />
      </div>
    </div>
  );
}

export function VideoSlider() {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [readyMap, setReadyMap] = useState<Record<string, boolean>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [elapsed, setElapsed] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const slide = videoSlides[current];

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setElapsed(0);
    setIsPlaying(true);
  }, []);

  const next = useCallback(() => {
    setCurrent((p) => (p + 1) % videoSlides.length);
    setElapsed(0);
  }, []);

  const prev = useCallback(() => {
    setCurrent((p) => (p - 1 + videoSlides.length) % videoSlides.length);
    setElapsed(0);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((p) => !p);
    setIsPaused((p) => !p);
    const vid = videoRefs.current[current];
    if (vid) {
      if (isPlaying) vid.pause();
      else vid.play().catch(() => {});
    }
  }, [current, isPlaying]);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || !isPlaying) return;
    const t = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(t);
  }, [isPaused, isPlaying, next]);

  // Elapsed time ticker
  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [isPlaying, current]);

  // Play/pause videos on slide change
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === current) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [current]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min((elapsed / (SLIDE_DURATION / 1000)) * 100, 100);

  return (
    <div className="relative">
      {/* Ambient glow behind player — TapPlay blue */}
      <div className="absolute -inset-6 rounded-[2.5rem] blur-[60px] pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/50 via-[#1E3A5F]/25 to-[#0F2744]/25 rounded-[2.5rem]" />
      </div>

      {/* Main player container — deep navy chrome with prominent blue border */}
      <div
        className="relative rounded-[20px] overflow-hidden bg-[#0a0e27] shadow-2xl shadow-black/60"
        style={{
          border: '2px solid rgba(30, 58, 95, 0.5)',
          boxShadow: '0 0 30px rgba(30, 58, 95, 0.15), 0 0 60px rgba(30, 58, 95, 0.08), 0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        }}
      >

        {/* ═══ Dedicated branding header bar ═══ */}
        <div className="relative z-20 px-6 py-3 flex items-center justify-between bg-[#0a0e27] border-b border-[#1E3A5F]/15">
          <div className="flex items-center gap-4">
            <span className="text-[15px] text-white/55 tracking-wide whitespace-nowrap">Powered by</span>
            <img
              src={tapPlayLogo}
              alt="Tap Play"
              className="h-24 w-auto object-contain brightness-0 invert opacity-95 drop-shadow-[0_0_14px_rgba(255,255,255,0.25)] -ml-4"
            />
          </div>
          <div className="flex items-center gap-5 flex-shrink-0">
            <button className="text-white/50 hover:text-white/90 transition-colors" aria-label="Cast">
              <Cast className="w-6 h-6" />
            </button>
            <button className="text-white/50 hover:text-white/90 transition-colors" aria-label="Screen">
              <Monitor className="w-6 h-6" />
            </button>
            <button
              onClick={() => setMuted(!muted)}
              className="text-white/50 hover:text-white/90 transition-colors"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Video viewport */}
        <div className="relative aspect-[16/10]">
          {videoSlides.map((s, i) => (
            <div
              key={s.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            >
              <img
                src={s.poster}
                alt={s.label}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  s.imageOnly ? 'opacity-100' : (readyMap[s.id] ? 'opacity-0' : 'opacity-100')
                }`}
              />
              {!s.imageOnly && (
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={s.video}
                  autoPlay={i === 0}
                  loop
                  muted={muted}
                  playsInline
                  onCanPlayThrough={() =>
                    setReadyMap((prev) => ({ ...prev, [s.id]: true }))
                  }
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    readyMap[s.id] ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
            </div>
          ))}

          {/* Gradient overlays */}
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#0a0e27] via-black/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#0a0e27]/30 via-transparent to-transparent pointer-events-none" />

          {/* LIVE pill — Red */}
          <div className="absolute top-4 left-5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E52324] backdrop-blur-sm shadow-lg shadow-[#E52324]/30">
            <Radio className="w-3 h-3 text-white animate-pulse" />
            <span className="text-[9px] text-white font-bold uppercase tracking-widest">Live</span>
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0a0e27]/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#0a0e27]/80 transition-all"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#0a0e27]/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#0a0e27]/80 transition-all"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ═══ Now Playing bar — TapPlay style ═══ */}
        <div className="relative z-10 px-5 pt-4 pb-5 bg-[#0a0e27]">

          {/* Track info row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {/* Spinning album art thumbnail */}
              <motion.div
                className="relative w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-[#1E3A5F]/20 flex-shrink-0 border border-[#1E3A5F]/20"
                animate={{ rotate: isPlaying ? [0, 360] : 0 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
              >
                <img src={slide.poster} alt={slide.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-3 h-3 rounded-full bg-[#0a0e27] border-2 border-white/20" />
                </div>
              </motion.div>

              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slide.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-white text-sm truncate">
                      {slide.label}
                    </div>
                    <div className="text-white/50 text-xs truncate">
                      {slide.artist} — {slide.sublabel}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 ml-4">
              <button
                onClick={() => setLiked((prev) => ({ ...prev, [slide.id]: !prev[slide.id] }))  }
                className="transition-colors"
                aria-label="Like"
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    liked[slide.id] ? 'text-[#E52324] fill-[#E52324] scale-110' : 'text-white/40 hover:text-white/70'
                  }`}
                />
              </button>
              <button className="text-white/40 hover:text-white/70 transition-colors" aria-label="More">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Progress scrubber — TapPlay blue-to-teal gradient */}
          <div className="mb-3">
            <div className="relative h-1 bg-white/10 rounded-full overflow-hidden group cursor-pointer">
              <motion.div
                key={`${current}-${isPaused}`}
                className="absolute left-0 top-0 h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${TP_BLUE}, ${TP_BLUE_LIGHT})` }}
                initial={{ width: '0%' }}
                animate={{ width: isPaused ? `${progressPercent}%` : '100%' }}
                transition={isPaused ? { duration: 0 } : { duration: SLIDE_DURATION / 1000, ease: 'linear' }}
              />
              {/* Scrubber knob */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md shadow-[#1E3A5F]/40"
                style={{ left: `${progressPercent}%`, marginLeft: -6 }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[10px] text-white/30 tabular-nums">
                {formatTime(elapsed)}
              </span>
              <span className="text-[10px] text-white/30 tabular-nums">
                -{slide.duration}
              </span>
            </div>
          </div>

          {/* Playback controls */}
          <div className="flex items-center justify-center gap-6">
            <button className="text-white/25 hover:text-white/60 transition-colors" aria-label="Shuffle">
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={prev} className="text-white/70 hover:text-white transition-colors" aria-label="Previous">
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-[#1E3A5F]/30"
              style={{ background: `linear-gradient(135deg, ${TP_BLUE}, ${TP_BLUE_LIGHT})` }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white fill-white" />
              ) : (
                <Play className="w-6 h-6 text-white fill-white ml-0.5" />
              )}
            </button>
            <button onClick={next} className="text-white/70 hover:text-white transition-colors" aria-label="Next">
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
            <button className="text-white/25 hover:text-white/60 transition-colors" aria-label="Repeat">
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Slide indicator dots */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <div className="flex gap-1">
              {videoSlides.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => goTo(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === current ? 'bg-white scale-125' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to ${s.label}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Up Next queue ═══ */}
      {/* removed */}
    </div>
  );
}