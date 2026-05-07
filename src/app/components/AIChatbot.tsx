import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X, Send, Wallet, ShoppingBag, QrCode, Plane,
  Mic, MicOff, Volume2, VolumeX, Zap, Copy, Check, Sparkles, Upload,
  ArrowUp, Square, ChevronDown, MoreHorizontal, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { AIOrb, OrbState, VoiceModeOverlay, TalkButton } from './AIOrb';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ee934ec0/ai-chat`;
const TTS_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ee934ec0/ai-tts`;
const VOICE_INFO_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ee934ec0/voice-info`;
const AVATAR_CONFIG_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ee934ec0/get-avatar`;

// Avatar photos matched to ElevenLabs voice gender (Unsplash)
const VOICE_AVATAR_FEMALE = 'https://images.unsplash.com/photo-1635003913011-95971abba560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const VOICE_AVATAR_MALE   = 'https://images.unsplash.com/photo-1707396172424-f3293f788364?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

interface APIMessage {
  role: 'user' | 'assistant';
  content: string;
}

const quickActions = [
  { label: 'Find Events', icon: Zap, query: 'What are the hottest events on InstaPass right now?' },
  { label: 'Marketplace', icon: Wallet, query: 'Tell me about the InstaPass Super Marketplace - how do I buy or sell tickets?' },
  { label: 'Merch Shop', icon: ShoppingBag, query: 'What kind of merchandise can I buy on InstaPass? Any bundle deals?' },
  { label: 'QR Codes', icon: QrCode, query: 'How do QR codes and SmartCodes work on InstaPass?' },
  { label: 'Travel Deals', icon: Plane, query: 'What travel deals do you offer with Expedia and Hotels.com?' },
  { label: 'For Organizers', icon: Sparkles, query: 'How do I create an event on InstaPass as an organizer?' },
];

const greetingMessage: ChatMessage = {
  id: 'greeting',
  sender: 'bot',
  text: "Hey there! I'm your InstaPass AI concierge. I can help you find events, shop merch, explore our Super Marketplace, create QR codes, score travel deals with Expedia & Hotels.com, and more. Ask me anything!",
  timestamp: new Date(),
};

/* ── Audio utilities ── */
let audioCtx: AudioContext | null = null;
let analyserNode: AnalyserNode | null = null;
const amplitudeData = new Uint8Array(128);

function getAudioContext(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function connectAnalyser(audio: HTMLAudioElement): AnalyserNode {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  const source = ctx.createMediaElementSource(audio);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.3;
  source.connect(analyser);
  analyser.connect(ctx.destination);
  analyserNode = analyser;
  return analyser;
}

function getAmplitude(): number {
  if (!analyserNode) return 0;
  analyserNode.getByteFrequencyData(amplitudeData);
  let sum = 0;
  const speechStart = 2, speechEnd = Math.min(32, amplitudeData.length);
  for (let i = speechStart; i < speechEnd; i++) sum += amplitudeData[i];
  const avg = sum / (speechEnd - speechStart) / 255;
  return Math.min(1, avg * 3.5);
}

/* ── Sub-components ── */

function SoundWave({ active, color = '#E52324' }: { active: boolean; color?: string }) {
  return (
    <div className="flex items-center gap-[3px] h-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span key={i} className="w-[3px] rounded-full" style={{ backgroundColor: color }}
          animate={active ? { height: [4, 14, 6, 16, 4], transition: { duration: 0.8, repeat: Infinity, delay: i * 0.12, ease: 'easeInOut' } } : { height: 4 }} />
      ))}
    </div>
  );
}

/* Siri Wave Visualizer */
const SIRI_COLORS = {
  cyan: '#00d4ff', blue: '#1e90ff', violet: '#9b4dff',
  magenta: '#d4145a', redGlow: '#ff2d3a', teal: '#00e5c8',
};

function SiriWaveVisualizer({ speaking, active = true, width = 400, height = 180 }: {
  speaking: boolean; active?: boolean; width?: number; height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const ampRef = useRef(0.05);
  const smoothAudioRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const waves = [
      { color: SIRI_COLORS.cyan, a: 0.55, freq: 0.007, mul: 1.0, spd: 1, w: 2.8 },
      { color: SIRI_COLORS.blue, a: 0.4, freq: 0.009, mul: 0.8, spd: 1.4, w: 2.2 },
      { color: SIRI_COLORS.violet, a: 0.45, freq: 0.011, mul: 0.65, spd: 0.7, w: 2 },
      { color: SIRI_COLORS.magenta, a: 0.5, freq: 0.008, mul: 0.9, spd: 1.6, w: 2.5 },
      { color: SIRI_COLORS.redGlow, a: 0.3, freq: 0.01, mul: 0.55, spd: 1.2, w: 1.8 },
      { color: SIRI_COLORS.teal, a: 0.25, freq: 0.013, mul: 0.45, spd: 0.9, w: 1.5 },
      { color: SIRI_COLORS.cyan, a: 0.07, freq: 0.007, mul: 1.0, spd: 1, w: 0, fill: true },
      { color: SIRI_COLORS.magenta, a: 0.05, freq: 0.008, mul: 0.9, spd: 1.6, w: 0, fill: true },
    ];
    const draw = () => {
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.scale(dpr, dpr); ctx.clearRect(0, 0, width, height);
      const rawAudio = speaking ? getAmplitude() : 0;
      const audioAttack = rawAudio > smoothAudioRef.current ? 0.3 : 0.08;
      smoothAudioRef.current += (rawAudio - smoothAudioRef.current) * audioAttack;
      const targetAmp = speaking ? Math.max(0.5, 0.5 + smoothAudioRef.current * 0.5) : active ? 0.4 : 0.05;
      ampRef.current += (targetAmp - ampRef.current) * (speaking ? 0.12 : 0.05);
      const amp = ampRef.current;
      const speedMul = speaking ? (1 + smoothAudioRef.current * 2) : 1;
      phaseRef.current += (speaking ? 0.06 : active ? 0.025 : 0.01) * speedMul;
      const phase = phaseRef.current;
      const cx = width / 2; const cy = height / 2;
      const audioNoise = speaking ? smoothAudioRef.current * 12 : 0;
      waves.forEach(wave => {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const d = Math.abs(x - cx) / cx; const env = Math.exp(-d * d * 3.2);
          const y1 = Math.sin(x * wave.freq + phase * wave.spd) * 40;
          const y2 = Math.sin(x * wave.freq * 2.1 + phase * wave.spd * 0.6) * 18;
          const y3 = Math.sin(x * wave.freq * 0.4 + phase * wave.spd * 1.5) * 22;
          const noise = speaking ? (Math.random() - 0.5) * (8 + audioNoise) : 0;
          const y = cy + (y1 + y2 + y3 + noise) * amp * wave.mul * env;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        if ((wave as any).fill) {
          ctx.lineTo(width, cy); ctx.lineTo(0, cy); ctx.closePath();
          const g = ctx.createLinearGradient(0, cy - 70, 0, cy + 10);
          g.addColorStop(0, wave.color + Math.round(wave.a * 255).toString(16).padStart(2, '0'));
          g.addColorStop(1, 'transparent'); ctx.fillStyle = g; ctx.fill();
        } else {
          ctx.strokeStyle = wave.color;
          ctx.globalAlpha = wave.a * (0.4 + amp * 0.6);
          ctx.lineWidth = wave.w * (1 + (speaking ? smoothAudioRef.current * 0.5 : 0));
          ctx.shadowColor = wave.color;
          ctx.shadowBlur = speaking ? 20 + smoothAudioRef.current * 15 : 10;
          ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        }
      });
      const r = 30 + amp * 20 + Math.sin(phase * 2) * 5 + (speaking ? smoothAudioRef.current * 15 : 0);
      const og = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      og.addColorStop(0, speaking ? `rgba(255,45,58,${0.15 + smoothAudioRef.current * 0.15})` : 'rgba(123,47,190,0.12)');
      og.addColorStop(0.6, speaking ? `rgba(212,20,90,${0.04 + smoothAudioRef.current * 0.06})` : 'rgba(0,212,255,0.04)');
      og.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = og; ctx.fill();
      if (amp > 0.15) {
        const n = Math.floor(amp * (speaking ? 20 + smoothAudioRef.current * 16 : 16));
        for (let i = 0; i < n; i++) {
          const angle = phase * 0.4 + (i / n) * Math.PI * 2;
          const dist = r + 15 + Math.sin(phase * 2.5 + i * 1.3) * 25;
          const sx = cx + Math.cos(angle) * dist;
          const sy = cy + Math.sin(angle) * dist * 0.45;
          const sa = Math.max(0, Math.sin(phase * 1.8 + i * 2)) * amp * 0.5;
          ctx.beginPath(); ctx.arc(sx, sy, 1.5 + (speaking ? smoothAudioRef.current : 0), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${sa})`; ctx.fill();
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speaking, active, width, height]);

  return <canvas ref={canvasRef} className="pointer-events-none" style={{ width, height, display: 'block' }} />;
}

function LipSyncAvatarMedia({ videoUrl, fallbackImg, speaking, style, className, alt = 'InstaPass AI', draggable = false }: {
  videoUrl: string | null; fallbackImg: string; speaking: boolean; style?: React.CSSProperties; className?: string; alt?: string; draggable?: boolean;
}) {
  const vidRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const videoStyle = style ? { ...style } : {};
  if (videoStyle.filter && typeof videoStyle.filter === 'string') {
    videoStyle.filter = videoStyle.filter.replace(/hue-rotate\([^)]*\)\s*/g, '').replace(/saturate\([^)]*\)\s*/g, '').trim() || undefined;
  }
  useEffect(() => {
    if (!videoUrl || !vidRef.current) return;
    const vid = vidRef.current;
    const tick = () => {
      vid.playbackRate = speaking ? 0.15 + getAmplitude() * 1.25 : 1.0;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [videoUrl, speaking]);
  if (videoUrl) {
    return <video ref={vidRef} src={videoUrl} autoPlay loop muted playsInline className={className} style={videoStyle} draggable={draggable} />;
  }
  return <img src={fallbackImg} alt={alt} className={className} style={style} draggable={draggable} />;
}

/* ── Typing dots ── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-[6px] h-[6px] rounded-full bg-gray-300"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ── Main Component ── */
export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([greetingMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState('');
  const [micError, setMicError] = useState('');
  const [unread, setUnread] = useState(1);
  const [copiedId, setCopiedId] = useState('');
  const [autoVoice, setAutoVoice] = useState(true);
  const [voiceInfo, setVoiceInfo] = useState<{ name: string; gender: string; accent: string; description: string; } | null>(null);
  const [talkMode, setTalkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingTTSRef = useRef<string>('');
  const hasIntroducedRef = useRef(false);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping, isStreaming]);
  useEffect(() => { if (isOpen) setUnread(0); }, [isOpen]);

  /* ── Voice Info fetch ── */
  useEffect(() => {
    (async () => {
      try {
        const voiceRes = await fetch(VOICE_INFO_URL, { 
          headers: { Authorization: `Bearer ${publicAnonKey}` },
          signal: AbortSignal.timeout(5000)
        });
        if (voiceRes.ok) {
          const d = await voiceRes.json();
          if (d?.name) {
            setVoiceInfo({ name: d.name, gender: d.gender || '', accent: d.accent || '', description: d.description || '' });
            console.log('ElevenLabs voice loaded:', d.name, d.gender, d.accent);
          }
        }
      } catch (err) { console.log('Failed to fetch voice data:', err); }
    })();
  }, []);

  const sendToAIRef = useRef<(text: string) => void>(() => {});

  const buildHistory = useCallback((): APIMessage[] => {
    return messages.filter((m) => m.id !== 'greeting').map((m) => ({ role: m.sender === 'user' ? ('user' as const) : ('assistant' as const), content: m.text })).slice(-10);
  }, [messages]);

  /* ── Auto-intro ── */
  const triggerIntroRef = useRef(false);
  useEffect(() => {
    if (isOpen && !hasIntroducedRef.current && !triggerIntroRef.current) {
      triggerIntroRef.current = true; hasIntroducedRef.current = true;
      const timer = setTimeout(() => {
        sendToAIRef.current('[SYSTEM] The user just opened the chat for the first time. Introduce yourself warmly. Tell them your name is InstaPass AI, you are their personal event concierge, and briefly mention 2-3 things you can help with. Keep it short, friendly, and under 80 words.');
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  /* ── TTS ── */
  const speakText = useCallback(async (text: string, msgId?: string) => {
    if (!text || isSpeaking) return;
    setIsSpeaking(true); setSpeakingMsgId(msgId || '');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const response = await fetch(TTS_URL, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify({ text: text.slice(0, 2000) }), signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) { const e = await response.json().catch(() => ({})); console.error('TTS error:', response.status, e); throw new Error(e?.error || 'TTS failed'); }
      const blob = await response.blob();
      if (!blob.size) throw new Error('TTS returned empty audio');
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      connectAnalyser(audio);
      audio.play();
      audio.onended = () => { setIsSpeaking(false); setSpeakingMsgId(''); URL.revokeObjectURL(url); audioRef.current = null; analyserNode = null; };
      audio.onerror = () => { console.error('TTS playback error'); setIsSpeaking(false); setSpeakingMsgId(''); URL.revokeObjectURL(url); audioRef.current = null; analyserNode = null; };
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') console.error('TTS timed out');
      else console.error('TTS error:', err);
      setIsSpeaking(false); setSpeakingMsgId('');
    }
  }, [isSpeaking]);

  const stopSpeaking = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setIsSpeaking(false); setSpeakingMsgId(''); analyserNode = null;
  };

  /* ── AI Chat ── */
  const sendToAI = useCallback(async (userText: string) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController(); abortRef.current = controller;
    setIsTyping(true);
    try {
      const history = buildHistory();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ message: userText, history }),
        signal: controller.signal,
      });
      if (!response.ok) {
        const e = await response.json().catch(() => ({}));
        console.error('AI error:', response.status, e);
        throw new Error(e?.error || 'AI request failed');
      }
      const data = await response.json();
      const reply = data.reply || "I'm sorry, I couldn't generate a response right now. Please try again.";
      const botMsgId = `bot-${Date.now()}`;
      setMessages((prev) => [...prev, { id: botMsgId, sender: 'bot', text: reply, timestamp: new Date() }]);
      if (!isOpen) setUnread((n) => n + 1);
      pendingTTSRef.current = botMsgId + '|||' + reply;
    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      console.error('AI Chat error:', err);
      setMessages((prev) => [...prev, { id: `err-${Date.now()}`, sender: 'bot', text: "Sorry - I'm having trouble connecting right now. Please try again.", timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [buildHistory, isOpen]);

  sendToAIRef.current = sendToAI;

  useEffect(() => {
    if (!isStreaming && pendingTTSRef.current && autoVoice && !isSpeaking) {
      const [msgId, text] = pendingTTSRef.current.split('|||'); pendingTTSRef.current = '';
      if (text) speakText(text, msgId);
    }
  }, [isStreaming, autoVoice, isSpeaking, speakText]);

  /* ── Actions ── */
  const handleQuickAction = (q: string) => { setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: q, timestamp: new Date() }]); sendToAI(q); };

  const handleSend = () => {
    if (!inputValue.trim() || isStreaming) return;
    const text = inputValue.trim();
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text, timestamp: new Date() }]);
    setInputValue(''); sendToAI(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  /* ── Voice input ── */
  const startListening = async () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMicError('not-supported'); return; }
    try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); micStreamRef.current = stream; } catch { setMicError('not-allowed'); return; }
    setMicError('');
    const recognition = new SR(); recognition.continuous = false; recognition.interimResults = true; recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setInputValue(transcript);
      if (event.results[event.results.length - 1].isFinal) { const ft = transcript.trim(); if (ft) { setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'user', text: ft, timestamp: new Date() }]); setInputValue(''); sendToAI(ft); } }
    };
    recognition.onerror = (event: any) => { if (event.error === 'not-allowed' || event.error === 'service-not-allowed') setMicError('not-allowed'); else if (event.error === 'no-speech') setMicError('no-speech'); else setMicError(event.error); setIsListening(false); };
    recognition.onend = () => { setIsListening(false); micStreamRef.current?.getTracks().forEach((t) => t.stop()); micStreamRef.current = null; };
    recognitionRef.current = recognition; recognition.start();
  };

  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); micStreamRef.current?.getTracks().forEach((t) => t.stop()); micStreamRef.current = null; };
  const copyToClipboard = (text: string, msgId: string) => { navigator.clipboard.writeText(text); setCopiedId(msgId); setTimeout(() => setCopiedId(''), 2000); };

  /* ── Talk mode send ── */
  const handleTalkSend = useCallback(async (text: string): Promise<string> => {
    const userMsg = { id: Date.now().toString(), sender: 'user' as const, text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const history = buildHistory();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ message: text, history }),
    });
    if (!response.ok) throw new Error('AI failed');
    const data = await response.json();
    const reply = data.reply || "I'm sorry, I couldn't generate a response right now.";
    const botMsg = { id: (Date.now() + 1).toString(), sender: 'bot' as const, text: reply, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    return reply;
  }, [buildHistory]);

  /* ── Markdown renderer ── */
  const renderMarkdown = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const bullet = line.match(/^[-*]\s+(.+)/);
      if (bullet) return <div key={i} className="flex gap-2 mt-0.5"><span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 bg-gray-300" /><span>{renderInline(bullet[1])}</span></div>;
      const num = line.match(/^(\d+)[.\\)]\s+(.+)/);
      if (num) return <div key={i} className="flex gap-2 mt-0.5"><span className="text-[12px] font-semibold mt-[1px] shrink-0 w-4 text-right text-gray-400">{num[1]}.</span><span>{renderInline(num[2])}</span></div>;
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <div key={i} className="mt-0.5">{renderInline(line)}</div>;
    });
  };

  const renderInline = (text: string) => {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <span key={i} className="font-semibold text-gray-800">{part.slice(2, -2)}</span>;
      return <span key={i}>{part}</span>;
    });
  };

  /* ── Render ── */
  return (
    <>
      {/* Chat Window - ChatGPT Style */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[620px] flex flex-col overflow-hidden"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {/* ── Header ── */}
            <div className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <AIOrb state={isSpeaking ? 'speaking' : 'idle'} size={40} />
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white z-10"
                    style={{ background: isSpeaking ? '#E52324' : '#22c55e' }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[14px] font-semibold text-gray-900" style={{ fontFamily: "'Outfit', sans-serif" }}>InstaPass AI</span>
                    {voiceInfo && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold tracking-wide uppercase"
                        style={{ background: 'linear-gradient(135deg,rgba(229,35,36,0.1),rgba(120,60,200,0.12))', color: '#7b3fd4', border: '1px solid rgba(120,60,200,0.2)' }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#7b3fd4', display: 'inline-block' }} />
                        {voiceInfo.name}
                      </span>
                    )}
                    {isSpeaking && (
                      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center">
                        <SoundWave active color="#E52324" />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {isSpeaking
                      ? 'Speaking...'
                      : isStreaming
                        ? 'Generating...'
                        : 'Always here to help'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Voice toggle */}
                <button
                  onClick={() => { if (autoVoice && isSpeaking) stopSpeaking(); setAutoVoice(!autoVoice); }}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${autoVoice ? 'text-[#E52324] bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                  title={autoVoice ? 'Voice on' : 'Voice muted'}
                >
                  {autoVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Stop speaking */}
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#E52324] hover:bg-red-100 transition-colors cursor-pointer"
                    title="Stop speaking"
                  >
                    <Square className="w-3 h-3 fill-current" />
                  </button>
                )}

                {/* Close */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Avatar + Siri Wave Hero ── */}
            <div className="shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0c0a1a 0%, #110e22 100%)' }}>
              <div className="relative z-10 px-4 pt-2 flex items-center justify-center">
                <span className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: isSpeaking ? '#E52324' : '#22c55e' }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: isSpeaking ? '#E52324' : '#22c55e' }} />
                  </span>
                  <span className="text-[10px] font-medium tracking-widest uppercase" style={{ fontFamily: "'Share Tech Mono', monospace", color: isSpeaking ? '#E52324' : isStreaming ? 'rgba(229,35,36,0.6)' : 'rgba(255,255,255,0.35)' }}>
                    {isSpeaking ? 'SPEAKING' : isStreaming ? 'GENERATING' : voiceInfo ? voiceInfo.name.toUpperCase() : 'ONLINE'}
                  </span>
                </span>
              </div>
              <div className="flex flex-col items-center pb-0">
                <div className="relative flex items-center justify-center" style={{ width: '100%', height: 160 }}>
                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ opacity: 0.7 }}>
                    <SiriWaveVisualizer speaking={isSpeaking} active={true} width={420} height={160} />
                  </div>
                  <div className="relative z-10">
                    <motion.div
                      animate={isSpeaking ? { scale: [1, 1.03, 0.98, 1.02, 1] } : {}}
                      transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <AIOrb state={isSpeaking ? 'speaking' : isTyping ? 'thinking' : 'idle'} size={100} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Messages ── */}
            <div
              className="flex-1 overflow-y-auto px-4 py-5 space-y-5"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,0,0,0.06) transparent' }}
            >
              {messages.map((msg, idx) => {
                const isUser = msg.sender === 'user';
                const isLast = idx === messages.length - 1;
                const isCurrentlyStreaming = isStreaming && msg.id.startsWith('bot-') && isLast;
                const isThisSpeaking = speakingMsgId === msg.id;
                const isGreeting = msg.id === 'greeting';

                if (isUser) {
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 bg-[#f4f4f4] text-gray-900">
                        <div className="text-[13.5px] leading-relaxed">{msg.text}</div>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="group">
                    <div className="flex items-start gap-3">
                      {/* Bot orb */}
                      <div className="w-7 h-7 shrink-0 mt-0.5 flex items-center justify-center">
                        <AIOrb state={speakingMsgId === msg.id ? 'speaking' : 'idle'} size={28} />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Reasoning indicator */}
                        {isCurrentlyStreaming && !msg.text && (
                          <motion.div className="flex items-center gap-2.5 mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f7f7f8]">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              >
                                <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                              </motion.div>
                              <span className="text-[12px] font-medium text-gray-500">Reasoning</span>
                              <TypingDots />
                            </div>
                            <button
                              onClick={() => { if (abortRef.current) abortRef.current.abort(); }}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                            >
                              <Square className="w-2.5 h-2.5" />
                              Stop
                            </button>
                          </motion.div>
                        )}

                        {/* Speaking indicator */}
                        {isThisSpeaking && (
                          <div className="flex items-center gap-2 mb-1.5">
                            <SoundWave active color="#E52324" />
                            <span className="text-[10px] text-[#E52324] font-medium">Speaking</span>
                          </div>
                        )}

                        {/* Message text */}
                        <div className="text-[13.5px] leading-[1.75] text-gray-700">
                          {isGreeting ? msg.text : renderMarkdown(msg.text)}
                          {isCurrentlyStreaming && (
                            <motion.span
                              className="inline-block w-[2px] h-[15px] ml-0.5 align-middle rounded-full bg-gray-400"
                              animate={{ opacity: [1, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, ease: 'easeInOut' }}
                            />
                          )}
                        </div>

                        {/* Action buttons */}
                        {msg.text && !isCurrentlyStreaming && !isGreeting && (
                          <div className="mt-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => copyToClipboard(msg.text, msg.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                            >
                              {copiedId === msg.id ? <><Check className="w-3 h-3 text-green-500" /><span className="text-green-500">Copied</span></> : <><Copy className="w-3 h-3" /><span>Copy</span></>}
                            </button>
                            <button
                              onClick={() => isThisSpeaking ? stopSpeaking() : speakText(msg.text, msg.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
                            >
                              {isThisSpeaking ? <><VolumeX className="w-3 h-3" /><span>Stop</span></> : <><Volume2 className="w-3 h-3" /><span>Listen</span></>}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3">
                  <div className="w-7 h-7 shrink-0 mt-0.5 flex items-center justify-center">
                    <AIOrb state="thinking" size={28} />
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#f7f7f8]">
                    <TypingDots />
                  </div>
                </motion.div>
              )}

              {/* Quick actions */}
              {messages.length === 1 && !isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.25 }} className="pt-2">
                  <div className="text-[11px] font-medium text-gray-400 mb-3 flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    Suggested
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action) => {
                      const Icon = action.icon;
                      return (
                        <motion.button
                          key={action.label}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleQuickAction(action.query)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px] font-medium bg-[#f7f7f8] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all cursor-pointer text-left"
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                          <span>{action.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ── */}
            <div className="px-3 pb-3 pt-1.5 shrink-0">
              {/* Mic error */}
              <AnimatePresence>
                {micError && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-2">
                    <div className="text-[11px] text-center px-3 py-2 rounded-xl bg-red-50 text-red-500 border border-red-100">
                      {micError === 'not-allowed' ? 'Microphone access denied. Allow mic in browser settings.' : micError === 'not-supported' ? 'Voice input not supported. Try Chrome or Edge.' : micError === 'no-speech' ? 'No speech detected. Tap the mic and speak clearly.' : `Voice error: ${micError}`}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Listening indicator */}
              <AnimatePresence>
                {isListening && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-2">
                    <div className="flex items-center justify-center gap-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
                      <SoundWave active />
                      <span className="text-[11px] font-medium text-red-500">Listening...</span>
                      <button onClick={stopListening} className="text-[11px] font-medium text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">Cancel</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input bar */}
              <div
                className="flex items-end gap-1 rounded-2xl px-1.5 py-1.5 transition-all border border-gray-200 focus-within:border-gray-300 focus-within:shadow-sm"
                style={{ background: '#f7f7f8' }}
              >
                {/* Talk button (ChatGPT-style voice mode) */}
                <TalkButton
                  active={talkMode}
                  onClick={() => setTalkMode(!talkMode)}
                  size="sm"
                  theme="light"
                />

                {/* Mic button */}
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isStreaming}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer shrink-0 ${isListening ? 'bg-[#E52324] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600 hover:bg-white'}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Text input */}
                <div className="flex-1 flex items-center min-h-[32px]">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setMicError(''); }}
                    onKeyDown={handleKeyDown}
                    placeholder={isStreaming ? 'Generating response...' : isListening ? 'Speak now...' : 'Message InstaPass AI...'}
                    disabled={isStreaming}
                    className="flex-1 bg-transparent text-[13.5px] text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 py-1"
                    style={{ caretColor: '#E52324' }}
                  />
                </div>

                {/* Send button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isStreaming}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  style={{
                    background: inputValue.trim() && !isStreaming ? '#1a1a1a' : 'transparent',
                    color: inputValue.trim() && !isStreaming ? '#fff' : '#d1d5db',
                  }}
                >
                  <ArrowUp className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
              </div>

              {/* Disclaimer + auto-voice indicator */}
              <div className="flex items-center justify-center gap-2 mt-2">
                {autoVoice && !isSpeaking && !isListening && (
                  <span className="flex items-center gap-1 text-[9px] text-gray-300">
                    <Volume2 className="w-2.5 h-2.5" />Auto-voice
                  </span>
                )}
                <span className="text-[9px] text-gray-300">InstaPass AI may make mistakes</span>
              </div>
            </div>

            {/* ── Voice Mode Overlay ── */}
            <VoiceModeOverlay
              isOpen={talkMode}
              ttsUrl={TTS_URL}
              authHeader={`Bearer ${publicAnonKey}`}
              onSendMessage={handleTalkSend}
              onClose={() => setTalkMode(false)}
              orbSize={180}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ── */}
      <div className="fixed bottom-6 right-4 sm:right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="absolute inset-[-20px] pointer-events-none">
              <motion.div className="absolute inset-0 rounded-full" style={{ background: isSpeaking ? 'radial-gradient(circle, rgba(229,35,36,0.35) 0%, rgba(229,35,36,0.08) 40%, transparent 65%)' : 'radial-gradient(circle, rgba(229,35,36,0.12) 0%, rgba(123,47,190,0.04) 45%, transparent 60%)' }}
                animate={isSpeaking ? { scale: [1, 1.35, 1.15, 1.3, 1], opacity: [0.7, 1, 0.7] } : { scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: isSpeaking ? 1 : 4, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.div className="absolute inset-[1px] rounded-full"
                style={{ background: `conic-gradient(from 0deg, transparent 0%, rgba(229,35,36,${isSpeaking ? 0.55 : 0.3}) 12%, transparent 25%, transparent 50%, rgba(0,212,255,${isSpeaking ? 0.25 : 0.1}) 62%, transparent 75%)`, padding: '2px', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
                animate={{ rotate: 360 }} transition={{ duration: isSpeaking ? 2.5 : 8, repeat: Infinity, ease: 'linear' }} />
              {isSpeaking && [0, 0.4, 0.8].map((delay, i) => (
                <motion.div key={`sonar-${i}`} className="absolute inset-[6px] rounded-full" style={{ border: `${1.5 - i * 0.3}px solid rgba(229,35,36,${0.3 - i * 0.08})` }}
                  animate={{ scale: [1, 2], opacity: [0.4 - i * 0.1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay }} />
              ))}
              {[{ delay: 0, dur: 5, sz: 2.5, radius: 42, color: 'rgba(229,35,36,0.7)' }, { delay: 1.8, dur: 6, sz: 2, radius: 44, color: 'rgba(0,212,255,0.5)' }, { delay: 3.2, dur: 5.5, sz: 2, radius: 40, color: 'rgba(123,47,190,0.5)' }].map((p, i) => (
                <motion.div key={`particle-${i}`} className="absolute rounded-full"
                  style={{ width: p.sz, height: p.sz, background: p.color, top: '50%', left: '50%', marginLeft: -p.sz / 2, marginTop: -p.sz / 2, boxShadow: `0 0 ${p.sz * 2.5}px ${p.color}` }}
                  animate={{ x: [0,1,2,3,4].map(idx => Math.cos(((idx+i*1.3)*Math.PI*2)/4)*p.radius), y: [0,1,2,3,4].map(idx => Math.sin(((idx+i*1.3)*Math.PI*2)/4)*p.radius), opacity: isSpeaking ? [0.2,1,0.4,1,0.2] : [0,0.6,0.2,0.6,0], scale: [0.5,1,0.7,1,0.5] }}
                  transition={{ duration: isSpeaking ? p.dur*0.6 : p.dur, repeat: Infinity, delay: p.delay, ease: 'linear' }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button onClick={() => setIsOpen(!isOpen)} className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: isOpen ? 'rgba(12,8,20,0.95)' : 'radial-gradient(ellipse at 50% 30%, rgba(35,16,56,0.98) 0%, rgba(15,8,28,0.99) 65%)', border: 'none', boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.5), inset 0 0 0 1.5px rgba(229,35,36,0.2)' : `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(229,35,36,${isSpeaking?0.5:0.25}), 0 0 ${isSpeaking?40:20}px rgba(229,35,36,${isSpeaking?0.25:0.08}), inset 0 1px 0 rgba(255,255,255,0.06)`, overflow: 'hidden', transition: 'box-shadow 0.4s ease' }}
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} aria-label={isOpen ? 'Close chat' : 'Open chat'}>
          {!isOpen && <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }} />}
          {!isOpen && <motion.div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)' }} animate={{ x: [-90, 90] }} transition={{ duration: 4, repeat: Infinity, repeatDelay: 6, ease: 'easeInOut' }} />}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0, scale: 0.4 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.4 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="flex items-center justify-center">
                <X className="w-5 h-5 text-white/90" />
              </motion.div>
            ) : (
              <motion.div key="mascot-fab" initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.2, opacity: 0, rotate: 90 }} transition={{ type: 'spring', damping: 14, stiffness: 260 }} className="relative w-full h-full rounded-full flex items-center justify-center">
                <AIOrb state={isSpeaking ? 'speaking' : 'idle'} size={72} />
              </motion.div>
            )}
          </AnimatePresence>
          {!isOpen && (
            <motion.div className="absolute bottom-[1px] right-[1px] z-10" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}>
              <motion.div className="w-[15px] h-[15px] rounded-full"
                style={{ background: isSpeaking ? 'linear-gradient(135deg, #E52324, #ff5252)' : 'linear-gradient(135deg, #00C853, #69F0AE)', border: '2.5px solid rgba(15,8,28,0.95)', boxShadow: isSpeaking ? '0 0 8px rgba(229,35,36,0.6)' : '0 0 6px rgba(0,200,83,0.4)' }}
                animate={isSpeaking ? { scale: [1,1.25,1], opacity: [1,0.7,1] } : {}} transition={{ duration: 0.6, repeat: Infinity }} />
            </motion.div>
          )}
          {!isOpen && (
            <motion.div className="absolute -bottom-[2px] -left-[2px] z-10" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, type: 'spring', stiffness: 250 }}>
              <motion.div className="px-[5px] h-[16px] rounded-full flex items-center justify-center gap-[2px]"
                style={{ background: isSpeaking ? 'linear-gradient(135deg, rgba(229,35,36,0.95), rgba(200,30,30,0.98))' : 'linear-gradient(135deg, rgba(25,15,40,0.92), rgba(35,18,55,0.95))', border: isSpeaking ? '1.5px solid rgba(255,80,80,0.3)' : '1.5px solid rgba(229,35,36,0.35)', fontSize: '7px', fontWeight: 800, color: isSpeaking ? 'white' : 'rgba(229,35,36,0.9)', letterSpacing: '0.8px', boxShadow: isSpeaking ? '0 2px 10px rgba(229,35,36,0.5)' : '0 2px 8px rgba(0,0,0,0.3)', fontFamily: "'Share Tech Mono', monospace" }}
                animate={isSpeaking ? { opacity: [1,0.6,1] } : {}} transition={{ duration: 0.8, repeat: Infinity }}>
                {isSpeaking && <motion.div className="w-[4px] h-[4px] rounded-full bg-white" animate={{ opacity: [1,0.3,1] }} transition={{ duration: 0.5, repeat: Infinity }} />}
                {isSpeaking ? 'LIVE' : 'AI'}
              </motion.div>
            </motion.div>
          )}
          {!isOpen && unread > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 11, stiffness: 280 }}
              className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] rounded-full text-[10px] font-black text-white flex items-center justify-center px-1.5 z-10"
              style={{ background: 'linear-gradient(135deg, #E52324, #ff4040)', border: '2px solid rgba(15,8,28,0.95)', boxShadow: '0 2px 10px rgba(229,35,36,0.5)' }}>{unread}</motion.span>
          )}
        </motion.button>
        <AnimatePresence>
          {!isOpen && unread > 0 && (
            <motion.div initial={{ opacity: 0, x: 14, scale: 0.85 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 14, scale: 0.85 }} transition={{ delay: 0.7, duration: 0.35, ease: 'easeOut' }} className="absolute right-[86px] top-1/2 -translate-y-1/2 whitespace-nowrap">
              <div className="relative px-4 py-2.5 rounded-xl text-[11px] font-semibold text-white flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, rgba(25,14,42,0.92), rgba(18,10,32,0.95))', backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 1px rgba(229,35,36,0.15)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Sparkles className="w-3.5 h-3.5 text-red-400/80" />
                <span style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '0.2px' }}>Need help? Ask me!</span>
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '6px solid rgba(25,14,42,0.92)' }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}