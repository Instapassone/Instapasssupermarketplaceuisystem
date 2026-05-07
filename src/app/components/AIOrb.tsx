import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic } from 'lucide-react';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

// ─── AIOrb ────────────────────────────────────────────────────────────────────
interface AIOrbProps {
  state?: OrbState;
  size?: number;
  className?: string;
}

export function AIOrb({ state = 'idle', size = 80, className = '' }: AIOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const ampRef = useRef(0.22);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const draw = () => {
      const w = size;
      const h = size;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = size * 0.36;

      // Amp target & smooth
      const targetAmp =
        state === 'speaking' ? 0.85 :
        state === 'listening' ? 0.65 :
        state === 'thinking' ? 0.48 : 0.22;
      ampRef.current += (targetAmp - ampRef.current) * (state !== 'idle' ? 0.07 : 0.035);
      const amp = ampRef.current;

      // Phase speed
      const speed =
        state === 'speaking' ? 0.054 :
        state === 'listening' ? 0.040 :
        state === 'thinking' ? 0.027 : 0.013;
      phaseRef.current += speed;
      const phase = phaseRef.current;

      // ── Outer aura rings ──
      for (let i = 3; i >= 1; i--) {
        const auraR = r * (1.15 + i * 0.4 * amp + Math.sin(phase * 0.55 + i * 1.2) * 0.04 * amp);
        const auraAlpha = Math.max(0, (0.14 - i * 0.035) * amp * 1.6);
        const aG = ctx.createRadialGradient(cx, cy, auraR * 0.45, cx, cy, auraR);
        const [cr, cg, cb] =
          state === 'speaking' ? [229, 35, 36] :
          state === 'listening' ? [0, 212, 255] :
          state === 'thinking' ? [123, 63, 212] : [90, 55, 200];
        aG.addColorStop(0, `rgba(${cr},${cg},${cb},${auraAlpha})`);
        aG.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(cx, cy, auraR, 0, Math.PI * 2);
        ctx.fillStyle = aG;
        ctx.fill();
      }

      // ── Base sphere ──
      const sG = ctx.createRadialGradient(cx - r * 0.22, cy - r * 0.22, r * 0.04, cx, cy, r);
      sG.addColorStop(0, '#1d1245');
      sG.addColorStop(0.5, '#0c0920');
      sG.addColorStop(1, '#050315');
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = sG;
      ctx.fill();

      // ── Color blobs ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.96, 0, Math.PI * 2);
      ctx.clip();

      const blobs = [
        { col: '#E52324', ang: phase * 0.85,        dist: 0.28, sz: 0.52 },
        { col: '#7b3fd4', ang: phase * 1.25 + 2.09, dist: 0.33, sz: 0.46 },
        { col: '#00d4ff', ang: phase * 0.62 + 4.19, dist: 0.26, sz: 0.40 },
        { col: '#d4145a', ang: phase * 1.05 + 1.05, dist: 0.30, sz: 0.36 },
        { col: '#00e5c8', ang: phase * 0.74 + 3.35, dist: 0.22, sz: 0.32 },
      ];

      blobs.forEach(b => {
        const bx = cx + Math.cos(b.ang) * r * b.dist * (0.35 + amp * 0.65);
        const by = cy + Math.sin(b.ang) * r * b.dist * (0.30 + amp * 0.60);
        const br = r * b.sz * (0.60 + amp * 0.50);
        const bG = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        bG.addColorStop(0, b.col + 'cc');
        bG.addColorStop(0.5, b.col + '55');
        bG.addColorStop(1, 'transparent');
        ctx.globalAlpha = 0.55 + amp * 0.40;
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fillStyle = bG;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      ctx.restore();

      // ── Rim glow ──
      const [rr, rg, rb] =
        state === 'speaking' ? [229, 35, 36] :
        state === 'listening' ? [0, 212, 255] : [123, 63, 212];
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${rr},${rg},${rb},${0.30 + amp * 0.55})`;
      ctx.lineWidth = 1.5 + amp * 2;
      ctx.stroke();

      // ── Specular highlight ──
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.96, 0, Math.PI * 2);
      ctx.clip();
      const hlG = ctx.createRadialGradient(
        cx - r * 0.30, cy - r * 0.35, 0,
        cx - r * 0.14, cy - r * 0.17, r * 0.50
      );
      hlG.addColorStop(0, 'rgba(255,255,255,0.22)');
      hlG.addColorStop(0.45, 'rgba(255,255,255,0.06)');
      hlG.addColorStop(1, 'transparent');
      ctx.fillStyle = hlG;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // ── Pulsing outer rings ──
      if (state === 'listening' || state === 'speaking') {
        const spd = state === 'speaking' ? 2.1 : 1.5;
        [0, Math.PI].forEach((offset, idx) => {
          const prog = (Math.sin(phase * spd + offset) + 1) / 2;
          const ringR = r * (1.1 + prog * 0.55);
          const ringA = (1 - prog) * (idx === 0 ? 0.55 : 0.30) * amp;
          ctx.beginPath();
          ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = state === 'speaking'
            ? `rgba(229,35,36,${ringA})`
            : `rgba(0,212,255,${ringA})`;
          ctx.lineWidth = idx === 0 ? 1.5 : 1;
          ctx.stroke();
        });
      }

      // ── Thinking particles ──
      if (state === 'thinking') {
        for (let i = 0; i < 6; i++) {
          const pAngle = phase * 1.2 + (i / 6) * Math.PI * 2;
          const pDist = r * (1.2 + Math.sin(phase * 2 + i * 1.1) * 0.08 * amp);
          const px = cx + Math.cos(pAngle) * pDist;
          const py = cy + Math.sin(pAngle) * pDist * 0.85;
          const pA = Math.max(0, Math.sin(phase * 1.8 + i * 2)) * amp * 0.6;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(123,63,212,${pA})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [state, size]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{ width: size, height: size, display: 'block' }}
    />
  );
}

// ─── VoiceModeOverlay ─────────────────────────────────────────────────────────
interface VoiceModeOverlayProps {
  isOpen: boolean;
  ttsUrl: string;
  authHeader: string;
  onSendMessage: (text: string) => Promise<string>;
  onClose: () => void;
  orbSize?: number;
}

export function VoiceModeOverlay({
  isOpen,
  ttsUrl,
  authHeader,
  onSendMessage,
  onClose,
  orbSize = 200,
}: VoiceModeOverlayProps) {
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [statusLabel, setStatusLabel] = useState('');
  const loopRef = useRef(false);
  const recRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopAll = useCallback(() => {
    recRef.current?.abort?.();
    recRef.current?.stop?.();
    recRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    if (!loopRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      setStatusLabel('Speech recognition not supported');
      return;
    }
    setOrbState('listening');
    setStatusLabel('Listening…');
    setTranscript('');

    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      const t = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setTranscript(t);
      if (event.results[event.results.length - 1].isFinal) {
        recRef.current = null;
        handleFinal(t.trim());
      }
    };

    rec.onerror = () => {
      if (loopRef.current) setTimeout(() => startListening(), 800);
    };

    rec.onend = () => {
      if (loopRef.current && recRef.current === rec) {
        // recognition ended without final — restart
        setTimeout(() => startListening(), 400);
      }
    };

    recRef.current = rec;
    try { rec.start(); } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFinal = useCallback(async (text: string) => {
    if (!text || !loopRef.current) return;
    setTranscript(text);
    setOrbState('thinking');
    setStatusLabel('Thinking…');

    try {
      const reply = await onSendMessage(text);
      if (!loopRef.current) return;
      setResponse(reply);
      await playTTS(reply);
    } catch {
      if (loopRef.current) startListening();
    }
  }, [onSendMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  const playTTS = useCallback(async (text: string) => {
    if (!loopRef.current) return;
    setOrbState('speaking');
    setStatusLabel('Speaking…');

    try {
      const res = await fetch(ttsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify({ text }),
      });
      if (!res.ok || !loopRef.current) {
        if (loopRef.current) startListening();
        return;
      }
      const blob = await res.blob();
      if (!loopRef.current) return;
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        if (loopRef.current) startListening();
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        audioRef.current = null;
        if (loopRef.current) startListening();
      };

      await audio.play();
    } catch {
      if (loopRef.current) startListening();
    }
  }, [ttsUrl, authHeader]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) {
      loopRef.current = true;
      setTranscript('');
      setResponse('');
      startListening();
    } else {
      loopRef.current = false;
      stopAll();
      setOrbState('idle');
      setTranscript('');
      setResponse('');
      setStatusLabel('');
    }
    return () => {
      loopRef.current = false;
      stopAll();
    };
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    loopRef.current = false;
    stopAll();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(180deg, #03021a 0%, #070520 60%, #0a0827 100%)',
          }}
        >
          {/* Orb */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.05 }}
            className="relative flex items-center justify-center"
          >
            <AIOrb state={orbState} size={orbSize} />
          </motion.div>

          {/* Status label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-6 text-center px-6 space-y-2"
          >
            <p
              className="text-sm font-semibold tracking-widest uppercase"
              style={{
                color:
                  orbState === 'speaking' ? '#E52324' :
                  orbState === 'listening' ? '#00d4ff' :
                  orbState === 'thinking' ? '#a855f7' : 'rgba(255,255,255,0.4)',
              }}
            >
              {statusLabel || 'InstaPass AI'}
            </p>

            {/* Transcript */}
            {transcript && orbState !== 'speaking' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/50 text-xs max-w-[240px] text-center leading-relaxed"
              >
                "{transcript}"
              </motion.p>
            )}

            {/* Response preview */}
            {response && orbState === 'speaking' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white/40 text-xs max-w-[240px] text-center leading-relaxed line-clamp-3"
              >
                {response.slice(0, 120)}{response.length > 120 ? '…' : ''}
              </motion.p>
            )}
          </motion.div>

          {/* Animated bars when listening */}
          {orbState === 'listening' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-1 mt-4"
            >
              {[0, 1, 2, 3, 4, 5, 6].map(i => (
                <motion.span
                  key={i}
                  className="w-[3px] rounded-full bg-[#00d4ff]"
                  animate={{ height: [4, 16, 6, 20, 4] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          )}

          {/* End button */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleClose}
            className="mt-8 w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer"
            style={{
              background: 'rgba(229,35,36,0.12)',
              border: '1.5px solid rgba(229,35,36,0.35)',
            }}
            whileHover={{ scale: 1.08, background: 'rgba(229,35,36,0.22)' }}
            whileTap={{ scale: 0.94 }}
          >
            <X className="w-6 h-6 text-red-400" />
          </motion.button>

          <p className="mt-3 text-[10px] text-white/25 tracking-wider uppercase">
            Tap to end
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── TalkButton ───────────────────────────────────────────────────────────────
interface TalkButtonProps {
  active: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
  theme?: 'dark' | 'light';
}

export function TalkButton({ active, onClick, size = 'md', theme = 'dark' }: TalkButtonProps) {
  const dim = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={`${dim} rounded-xl flex items-center justify-center relative overflow-hidden transition-all cursor-pointer shrink-0`}
      style={
        active
          ? {
              background: 'linear-gradient(135deg, #E52324, #b01819)',
              boxShadow: '0 0 18px rgba(229,35,36,0.45)',
            }
          : theme === 'dark'
          ? {
              background: '#1A1F3A',
              border: '1px solid rgba(255,255,255,0.1)',
            }
          : {
              background: '#f7f7f8',
              border: '1px solid rgba(0,0,0,0.07)',
            }
      }
      title={active ? 'End voice chat' : 'Start voice chat'}
    >
      {active ? (
        // animated bars when active
        <span className="flex items-center gap-[2px]">
          {[0, 1, 2, 3].map(i => (
            <motion.span
              key={i}
              className="w-[2.5px] rounded-full bg-white"
              animate={{ height: [4, 12, 5, 14, 4] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
            />
          ))}
        </span>
      ) : (
        // static bars when inactive
        <span className="flex items-center gap-[2px]">
          {[3, 5, 8, 5, 3].map((h, i) => (
            <span
              key={i}
              className="w-[2.5px] rounded-full"
              style={{
                height: h,
                background: theme === 'light' ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)',
              }}
            />
          ))}
        </span>
      )}
    </motion.button>
  );
}
