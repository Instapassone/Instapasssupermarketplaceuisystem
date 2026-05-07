import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, HelpCircle, MessageCircle, BookOpen, Mail, Phone, Sparkles, Mic, MicOff } from 'lucide-react';
import { Link } from 'react-router';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { InstaPassLogo } from '../components/InstaPassLogo';
import { AIOrb, OrbState, VoiceModeOverlay, TalkButton } from '../components/AIOrb';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ee934ec0/ai-chat`;
const TTS_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ee934ec0/ai-tts`;
const VOICE_INFO_URL = `https://${projectId}.supabase.co/functions/v1/make-server-ee934ec0/voice-info`;

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
}

const quickActions = [
  { label: 'How do I buy tickets?', icon: MessageCircle, query: 'How do I buy tickets on InstaPass?' },
  { label: 'Refund Policy', icon: HelpCircle, query: 'What is your refund and cancellation policy?' },
  { label: 'InstaPoints', icon: Sparkles, query: 'How do InstaPoints work and how can I earn them?' },
  { label: 'QR Codes', icon: BookOpen, query: 'How do I use my QR code ticket?' },
  { label: 'Sell Tickets', icon: Mail, query: 'How do I sell or transfer my tickets?' },
  { label: 'Contact Support', icon: Phone, query: 'How can I contact customer support directly?' },
];

const greetingMessage: ChatMessage = {
  id: 'greeting',
  sender: 'bot',
  text: "Hi! I'm your InstaPass Support Assistant. I'm here to help with any questions about buying tickets, using InstaPoints, managing your account, or anything else. What can I help you with today?",
  timestamp: new Date(),
};

export function HelpSupport() {
  const [messages, setMessages] = useState<ChatMessage[]>([greetingMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceInfo, setVoiceInfo] = useState<{ name: string; gender: string } | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState('');
  const [talkMode, setTalkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(VOICE_INFO_URL, {
          headers: { Authorization: `Bearer ${publicAnonKey}` },
          signal: AbortSignal.timeout(5000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.name) setVoiceInfo({ name: data.name, gender: data.gender || 'neutral' });
        }
      } catch { setVoiceInfo({ name: 'AI Assistant', gender: 'neutral' }); }
    })();
  }, []);

  const playVoice = async (text: string, messageId: string) => {
    if (!text.trim()) return;
    try {
      setSpeakingMsgId(messageId);
      setIsSpeaking(true);
      const res = await fetch(TTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) { setIsSpeaking(false); setSpeakingMsgId(''); return; }
      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => { setIsSpeaking(false); setSpeakingMsgId(''); URL.revokeObjectURL(audioUrl); };
      audio.onerror = () => { setIsSpeaking(false); setSpeakingMsgId(''); URL.revokeObjectURL(audioUrl); };
      await audio.play();
    } catch (err) {
      console.error('Voice playback error:', err);
      setIsSpeaking(false);
      setSpeakingMsgId('');
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    try {
      const history = messages.slice(-10).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ message: text.trim(), history }),
      });
      if (!res.ok) throw new Error('Chat request failed');
      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      setTimeout(() => playVoice(botMsg.text, botMsg.id), 300);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { id: `bot-error-${Date.now()}`, sender: 'bot', text: 'Sorry, I had trouble connecting. Please try again or contact support directly.', timestamp: new Date() }]);
      setIsTyping(false);
    }
  };

  const handleQuickAction = (query: string) => sendMessage(query);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(inputValue); };

  const startListening = async () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setMicError('not-supported'); return; }
    try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); micStreamRef.current = stream; }
    catch { setMicError('not-allowed'); return; }
    setMicError('');
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join('');
      setInputValue(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        const ft = transcript.trim();
        if (ft) { sendMessage(ft); setInputValue(''); }
      }
    };
    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') setMicError('not-allowed');
      else if (event.error === 'no-speech') setMicError('no-speech');
      else setMicError(event.error);
      setIsListening(false);
    };
    recognition.onend = () => { setIsListening(false); micStreamRef.current?.getTracks().forEach(t => t.stop()); micStreamRef.current = null; };
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
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const history = messages.slice(-10).map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text }));
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${publicAnonKey}` },
      body: JSON.stringify({ message: text, history }),
    });
    if (!res.ok) throw new Error('AI failed');
    const data = await res.json();
    const reply = data.reply || "I'm sorry, I couldn't generate a response right now.";
    const botMsg: ChatMessage = { id: `bot-${Date.now()}`, sender: 'bot', text: reply, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    return reply;
  }, [messages]);

  const currentOrbState: OrbState = isSpeaking ? 'speaking' : isTyping ? 'thinking' : isListening ? 'listening' : 'idle';

  return (
    <div className="min-h-screen bg-[#0A0E27] pt-20 pb-8">
      {/* Logo Header */}
      <div className="fixed top-0 left-0 right-0 bg-[#0A0E27]/95 backdrop-blur-sm border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="inline-flex items-center">
            <InstaPassLogo size="md" />
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Orb instead of avatar */}
            <div className="relative">
              <AIOrb state={currentOrbState} size={64} />
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0A0E27] ${
                  isSpeaking ? 'bg-[#E52324] animate-pulse' : 'bg-green-500'
                }`}
              />
            </div>
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-['Outfit'] font-bold text-white">
                Help & Support
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                AI-powered assistance{voiceInfo ? ` · ${voiceInfo.name}` : ''}
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            Get instant help from our AI assistant or browse common questions
          </p>
        </motion.div>

        {/* Main Chat Interface */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-[#0F1535] rounded-2xl border border-[#1A1F3A] overflow-hidden relative"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#E52324] to-[#B01819] p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <AIOrb state={currentOrbState} size={48} />
                  <div
                    className={`absolute -bottom-0 -right-0 w-3 h-3 rounded-full border-2 border-white ${
                      isSpeaking ? 'bg-[#E52324] animate-pulse' : 'bg-green-500'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="font-['Outfit'] font-semibold text-white text-lg">
                    InstaPass AI Support
                  </h2>
                  <p className="text-white/80 text-sm">
                    {isSpeaking ? 'Speaking...' : isTyping ? 'Thinking...' : 'Always here to help'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {/* Welcome section */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <AIOrb state={currentOrbState} size={120} />
                  <h3 className="text-xl font-['Outfit'] font-semibold text-white mt-4 mb-2">
                    Welcome to Support!
                  </h3>
                  <p className="text-gray-400 text-center max-w-md">
                    I'm here to help you with anything InstaPass related. Ask me anything!
                  </p>
                </motion.div>
              )}

              <AnimatePresence>
                {messages.map(msg => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="relative flex-shrink-0">
                        <AIOrb state={speakingMsgId === msg.id ? 'speaking' : 'idle'} size={40} />
                        {speakingMsgId === msg.id && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#E52324] rounded-full animate-pulse border-2 border-white" />
                        )}
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender === 'user' ? 'bg-[#E52324] text-white' : 'bg-[#1A1F3A] text-gray-100'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <AIOrb state="thinking" size={40} />
                  <div className="bg-[#1A1F3A] rounded-2xl px-4 py-3 flex items-center">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="w-2 h-2 rounded-full bg-gray-400"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 bg-[#1A1F3A] border-t border-[#0A0E27]">
              {micError && (
                <p className="text-xs text-red-400 mb-2 text-center">
                  {micError === 'not-allowed' ? 'Microphone access denied.' : micError === 'not-supported' ? 'Voice not supported.' : micError === 'no-speech' ? 'No speech detected.' : `Error: ${micError}`}
                </p>
              )}
              {isListening && (
                <div className="flex items-center justify-center gap-2 mb-2 py-1.5 rounded-xl bg-[#E52324]/10 border border-[#E52324]/20">
                  <span className="w-2 h-2 bg-[#E52324] rounded-full animate-pulse" />
                  <span className="text-sm text-[#E52324] font-medium">Listening...</span>
                  <button type="button" onClick={stopListening} className="text-xs text-white/50 hover:text-white cursor-pointer ml-1">Cancel</button>
                </div>
              )}
              <div className="flex gap-2">
                {/* Talk button */}
                <TalkButton
                  active={talkMode}
                  onClick={() => setTalkMode(!talkMode)}
                  size="md"
                  theme="dark"
                />

                {/* Mic button */}
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isTyping}
                  title={isListening ? 'Stop listening' : 'Voice input'}
                  className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-all disabled:opacity-50 ${isListening ? 'bg-[#E52324] text-white shadow-lg shadow-[#E52324]/30' : 'bg-[#0F1535] border border-white/10 text-white/60 hover:text-white hover:bg-[#252A4A]'}`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  placeholder={isListening ? 'Speak now...' : 'Type your question...'}
                  className="flex-1 bg-[#0F1535] text-white rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E52324] placeholder-gray-500"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-[#E52324] hover:bg-[#C01D1E] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full p-3 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Voice Mode Overlay */}
            <VoiceModeOverlay
              isOpen={talkMode}
              ttsUrl={TTS_URL}
              authHeader={`Bearer ${publicAnonKey}`}
              onSendMessage={handleTalkSend}
              onClose={() => setTalkMode(false)}
              orbSize={180}
            />
          </motion.div>

          {/* Quick Actions Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-[#0F1535] rounded-2xl border border-[#1A1F3A] p-4">
              <h3 className="font-['Outfit'] font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E52324]" />
                Quick Questions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAction(action.query)}
                    className="w-full text-left bg-[#1A1F3A] hover:bg-[#252A4A] text-gray-300 hover:text-white rounded-xl p-3 transition-colors flex items-center gap-3"
                  >
                    <action.icon className="w-5 h-5 text-[#E52324]" />
                    <span className="text-sm">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-[#0F1535] rounded-2xl border border-[#1A1F3A] p-4">
              <h3 className="font-['Outfit'] font-semibold text-white mb-4">Still Need Help?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#E52324] mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Email Support</p>
                    <p className="text-gray-400">Admin@instapass.shop</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#E52324] mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Phone Support</p>
                    <p className="text-gray-400">(844) 244-6782</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-[#E52324] mt-0.5" />
                  <div>
                    <p className="text-white font-medium">Response Time</p>
                    <p className="text-gray-400">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Resources */}
            <div className="bg-[#0F1535] rounded-2xl border border-[#1A1F3A] p-4">
              <h3 className="font-['Outfit'] font-semibold text-white mb-4">Help Resources</h3>
              <div className="space-y-2">
                <Link to="/how-it-works" className="block text-[#E52324] hover:text-[#FF2D2E] text-sm transition-colors">
                  → How InstaPass Works
                </Link>
                <Link to="/terms" className="block text-[#E52324] hover:text-[#FF2D2E] text-sm transition-colors">
                  → Terms of Service
                </Link>
                <Link to="/privacy" className="block text-[#E52324] hover:text-[#FF2D2E] text-sm transition-colors">
                  → Privacy Policy
                </Link>
                <Link to="/about" className="block text-[#E52324] hover:text-[#FF2D2E] text-sm transition-colors">
                  → About Us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
