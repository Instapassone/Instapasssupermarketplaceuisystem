import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Ticket, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

interface HeroSlide {
  id: string;
  tag: string;
  tagColor: string;
  headline: string;
  headlineAccent: string;
  date: string;
  venue: string;
  city: string;
  availability: string;
  startingPrice: number;
  image: string;
  video?: string;
  eventId: string;
}

const slides: HeroSlide[] = [
  {
    id: 'taylor-swift',
    tag: 'NOW ON SALE',
    tagColor: 'bg-[#E52324]',
    headline: 'TAYLOR SWIFT',
    headlineAccent: 'ERAS TOUR 2026',
    date: 'Mar 14 – Apr 28, 2026',
    venue: 'SoFi Stadium',
    city: 'Los Angeles, CA',
    availability: '2,400+ tickets available',
    startingPrice: 189,
    image: 'https://images.unsplash.com/photo-1658046413536-6e5933dfd939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHMlMjBjcm93ZHxlbnwxfHx8fDE3NzE5OTM1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    video: 'https://videos.pexels.com/video-files/1763075/1763075-uhd_2560_1440_30fps.mp4',
    eventId: '1',
  },
  {
    id: 'nba-playoffs',
    tag: 'PLAYOFFS 2026',
    tagColor: 'bg-blue-600',
    headline: 'NBA PLAYOFFS',
    headlineAccent: 'LAKERS VS CELTICS',
    date: 'Apr 20 – May 15, 2026',
    venue: 'Crypto.com Arena',
    city: 'Los Angeles, CA',
    availability: '850 tickets remaining',
    startingPrice: 87,
    image: 'https://images.unsplash.com/photo-1771882856158-c8e083134ee3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwYXJlbmElMjBnYW1lJTIwbmlnaHR8ZW58MXx8fHwxNzcyMDM4NTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    eventId: '2',
  },
  {
    id: 'hamilton',
    tag: 'LIMITED RUN',
    tagColor: 'bg-amber-600',
    headline: 'HAMILTON',
    headlineAccent: 'BROADWAY TOUR',
    date: 'Mar 16 – Jun 1, 2026',
    venue: 'Pantages Theatre',
    city: 'Hollywood, CA',
    availability: '320 seats left — selling fast',
    startingPrice: 149,
    image: 'https://images.unsplash.com/photo-1494436567119-7f392017bb34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicm9hZHdheSUyMHRoZWF0ZXIlMjBzdGFnZXxlbnwxfHx8fDE3NzIwNDM3NDF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    video: 'https://videos.pexels.com/video-files/3695650/3695650-uhd_2560_1440_25fps.mp4',
    eventId: '3',
  },
  {
    id: 'coachella',
    tag: 'FESTIVAL',
    tagColor: 'bg-[#E52324]',
    headline: 'COACHELLA',
    headlineAccent: '2026 — WEEKEND 1',
    date: 'Jun 7 – Jun 9, 2026',
    venue: 'Empire Polo Club',
    city: 'Indio, CA',
    availability: 'Weekend passes available',
    startingPrice: 399,
    image: 'https://images.unsplash.com/photo-1605286232233-e448650f5914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwb3V0ZG9vciUyMGNyb3dkfGVufDF8fHx8MTc3MjAwNjgwOHww&ixlib=rb-4.1.0&q=80&w=1080',
    video: 'https://videos.pexels.com/video-files/2022395/2022395-uhd_2560_1440_30fps.mp4',
    eventId: '6',
  },
];

const AUTOPLAY_INTERVAL = 6000;

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const [muted, setMuted] = useState(true);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
    setVideoReady(false);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
    setVideoReady(false);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setVideoReady(false);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const slide = slides[current];
  const hasVideo = !!slide.video;

  return (
    <section
      className="relative w-full h-[420px] sm:h-[480px] lg:h-[560px] overflow-hidden bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Media */}
      <AnimatePresence mode="popLayout" custom={direction}>
        <motion.div
          key={slide.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          {/* Fallback image (always present) */}
          <img
            src={slide.image}
            alt={slide.headline}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              hasVideo && videoReady ? 'opacity-0' : 'opacity-100'
            }`}
          />

          {/* Video overlay */}
          {hasVideo && (
            <video
              ref={videoRef}
              src={slide.video}
              autoPlay
              loop
              muted={muted}
              playsInline
              onCanPlayThrough={() => setVideoReady(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoReady ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Slide Content */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + '-content'}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            className="max-w-xl lg:max-w-2xl"
          >
            {/* Tag Badge */}
            <div className="flex items-center gap-2 mb-5">
              <span className={`inline-block px-3 py-1 rounded ${slide.tagColor} text-white text-[10px] font-black uppercase tracking-[0.15em]`}>
                {slide.tag}
              </span>
              {hasVideo && videoReady && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 backdrop-blur-sm text-white/60 text-[9px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E52324] animate-pulse" />
                  Live Preview
                </span>
              )}
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.92] tracking-tight text-white mb-2">
              {slide.headline}
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-[0.92] tracking-tight text-[#E52324] mb-5">
              {slide.headlineAccent}
            </h3>

            {/* Event Meta */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/60 mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                {slide.date}
              </span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/40" />
                {slide.venue}, {slide.city}
              </span>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 text-xs text-[#00C853] mb-6">
              <Ticket className="w-3.5 h-3.5" />
              <span>{slide.availability}</span>
            </div>

            {/* Price + CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Price pill */}
              <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="text-white/50 text-xs mr-1">From</span>
                <span className="text-white text-lg font-black">${slide.startingPrice}</span>
              </div>

              <Link
                to={`/event/${slide.eventId}`}
                className="px-7 py-3 rounded-lg bg-[#E52324] text-white text-sm font-black uppercase tracking-wider hover:bg-[#c91f20] transition-colors"
              >
                Get Tickets
              </Link>
              <Link
                to={`/event/${slide.eventId}`}
                className="px-7 py-3 rounded-lg border border-white/20 text-white text-sm font-black uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                View All Dates
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-0 right-0 z-20 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? 'w-8 h-2 bg-[#E52324]'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Mute/Unmute for video slides */}
            {hasVideo && videoReady && (
              <button
                onClick={() => setMuted(!muted)}
                className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={prev}
              className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}