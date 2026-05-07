import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Sparkles, Loader2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { InstaPassLogo } from './InstaPassLogo';
import { AIOrb, OrbState, VoiceModeOverlay, TalkButton } from './AIOrb';
import { Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ee934ec0`;

export function AvatarBotIntegrated() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState('');
  const [talkMode, setTalkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const chatRes = await fetch(`${API_BASE}/ai-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({
          message: userInput,
          history: messages.slice(-10).map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        }),
      });
      if (!chatRes.ok) throw new Error('Chat failed');
      const { reply } = await chatRes.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      setTimeout(() => playVoice(reply, assistantMessage.id), 300);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
      setIsLoading(false);
    }
  };

  const playVoice = async (text: string, messageId: string) => {
    if (!text.trim()) return;
    try {
      setSpeakingMsgId(messageId);
      setIsSpeaking(true);
      const ttsRes = await fetch(`${API_BASE}/ai-tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ text }),
      });
      if (!ttsRes.ok) { setIsSpeaking(false); setSpeakingMsgId(''); return; }
      const audioBlob = await ttsRes.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.onended = () => { setIsSpeaking(false); setSpeakingMsgId(''); URL.revokeObjectURL(audioUrl); };
      audio.onerror = () => { setIsSpeaking(false); setSpeakingMsgId(''); URL.revokeObjectURL(audioUrl); };
      await audio.play();
    } catch (err) {
      console.error('Voice playback error:', err);
      setIsSpeaking(false);
      setSpeakingMsgId('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const startListening = async () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMicError('not-supported'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
    } catch { setMicError('not-allowed'); return; }
    setMicError('');
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setInput(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        const ft = transcript.trim();
        if (ft) setInput(ft);
      }
    };
    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') setMicError('not-allowed');
      else if (event.error === 'no-speech') setMicError('no-speech');
      else setMicError(event.error);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      micStreamRef.current?.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    micStreamRef.current?.getTracks().forEach(t => t.stop());
    micStreamRef.current = null;
  };

  /* Talk mode send */
  const handleTalkSend = useCallback(async (text: string): Promise<string> => {
    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const res = await fetch(`${API_BASE}/ai-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ message: text, history: messages.slice(-10).map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })) }),
    });
    if (!res.ok) throw new Error('AI failed');
    const data = await res.json();
    const reply = data.reply || "I'm sorry, I couldn't generate a response right now.";
    const botMsg: Message = { id: (Date.now() + 1).toString(), type: 'assistant', content: reply, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    return reply;
  }, [messages]);

  const navigate = useNavigate();

  const currentOrbState: OrbState = isSpeaking ? 'speaking' : isLoading ? 'thinking' : isListening ? 'listening' : 'idle';

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#0A0E27] via-[#0F1535] to-[#0A0E27]">
      {/* Logo Header */}
      <div className="absolute top-4 left-4 z-50">
        <Link to="/" className="inline-flex items-center hover:opacity-80 transition-opacity">
          <InstaPassLogo size="sm" />
        </Link>
      </div>

      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/10 bg-[#0A0E27]/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mini orb in header */}
              <div className="relative">
                <AIOrb state={currentOrbState} size={48} />
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0A0E27] ${
                    isSpeaking ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                  }`}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-['Outfit']">
                  InstaPass AI Assistant
                </h1>
                <p className="text-sm text-white/60">
                  {isSpeaking ? '🔊 Speaking...' : isLoading ? '⚡ Thinking...' : 'Always here to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E52324]/10 text-[#E52324] border border-[#E52324]/20">
                <span className="w-1.5 h-1.5 bg-[#E52324] rounded-full mr-2 animate-pulse" />
                Live
              </span>
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
                title="Minimize chat"
              >
                <Minimize2 className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 relative">
        {/* Welcome message with large orb */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            {/* Large ElevenLabs-style orb */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 18, stiffness: 200 }}
              className="relative"
            >
              <AIOrb state={currentOrbState} size={200} />
            </motion.div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                👋 Welcome to InstaPass!
              </h2>
              <p className="text-white/60">
                I'm your personal event concierge. Ask me about tickets, events,
                our marketplace, or anything InstaPass!
              </p>
            </div>

            {/* Suggestion chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
              {[
                'Show me concerts near LA',
                'What are InstaPoints?',
                'How does the marketplace work?',
                'Find sports events this weekend',
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/80 hover:text-white transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
          >
            {msg.type === 'assistant' && (
              <div className="flex-shrink-0 pt-1 relative">
                <AIOrb state={speakingMsgId === msg.id ? 'speaking' : 'idle'} size={40} />
                {speakingMsgId === msg.id && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white" />
                )}
              </div>
            )}
            <div
              className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                msg.type === 'user'
                  ? 'bg-gradient-to-br from-[#E52324] to-[#B01819] text-white'
                  : 'bg-[#1A1F3A] text-white border border-white/10'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <p className="text-xs opacity-50 mt-2">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="flex-shrink-0 pt-1">
              <AIOrb state="thinking" size={40} />
            </div>
            <div className="max-w-[70%] rounded-2xl px-5 py-3 bg-[#1A1F3A] text-white border border-white/10">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-white/10 bg-[#0A0E27]/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          {micError && (
            <p className="text-xs text-red-400 mb-2 text-center">
              {micError === 'not-allowed' ? 'Microphone access denied.' : micError === 'not-supported' ? 'Voice not supported in this browser.' : micError === 'no-speech' ? 'No speech detected. Try again.' : `Voice error: ${micError}`}
            </p>
          )}
          {isListening && (
            <div className="flex items-center justify-center gap-2 mb-3 py-2 rounded-xl bg-[#E52324]/10 border border-[#E52324]/20">
              <span className="w-2 h-2 bg-[#E52324] rounded-full animate-pulse" />
              <span className="text-sm text-[#E52324] font-medium">Listening... speak now</span>
              <button onClick={stopListening} className="text-xs text-white/50 hover:text-white cursor-pointer ml-1">Cancel</button>
            </div>
          )}
          <div className="flex gap-3 items-end">
            {/* Talk button */}
            <TalkButton
              active={talkMode}
              onClick={() => setTalkMode(!talkMode)}
              size="md"
              theme="dark"
            />

            {/* Voice mic button */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isLoading}
              title={isListening ? 'Stop listening' : 'Voice input'}
              className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl transition-all disabled:opacity-50 ${isListening ? 'bg-[#E52324] text-white shadow-lg shadow-[#E52324]/30' : 'bg-[#1A1F3A] border border-white/10 text-white/60 hover:text-white hover:bg-[#252A4A]'}`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? 'Speak now...' : 'Ask me anything about InstaPass...'}
                disabled={isLoading}
                rows={1}
                className="w-full px-4 py-3 bg-[#1A1F3A] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#E52324] focus:border-transparent resize-none disabled:opacity-50"
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#E52324] to-[#B01819] hover:from-[#FF2D2E] hover:to-[#C01D1E] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-[#E52324]/25"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <Send className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
          <p className="text-xs text-white/40 mt-2 text-center">
            AI-powered assistant for InstaPass • Press Enter to send
          </p>
        </div>
      </div>

      {/* Voice Mode Overlay */}
      <VoiceModeOverlay
        isOpen={talkMode}
        ttsUrl={`${API_BASE}/ai-tts`}
        authHeader={`Bearer ${publicAnonKey}`}
        onSendMessage={handleTalkSend}
        onClose={() => setTalkMode(false)}
        orbSize={220}
      />
    </div>
  );
}
