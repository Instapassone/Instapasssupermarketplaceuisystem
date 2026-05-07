import { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
  timestamp: Date;
}

interface VoiceInfo {
  name: string;
  gender: string;
  category: string;
}

export function AvatarBotIntegrated() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [voiceInfo, setVoiceInfo] = useState<VoiceInfo | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const welcomeVideoRef = useRef<HTMLVideoElement>(null);
  const chatVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ee934ec0`;

  useEffect(() => {
    // Fetch voice info on mount
    fetch(`${API_BASE}/voice-info`, {
      headers: { Authorization: `Bearer ${publicAnonKey}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.name) {
          setVoiceInfo(data);
        }
      })
      .catch((err) => console.log('Voice info fetch error:', err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const playVideoWithAudio = (audioUrl: string, messageId: string) => {
    const audio = new Audio(audioUrl);
    currentAudioRef.current = audio;
    
    // Find the video element for this message
    const videoElement = chatVideoRefs.current[messageId] || welcomeVideoRef.current;
    
    if (videoElement) {
      // Sync video playback with audio
      audio.addEventListener('play', () => {
        setIsSpeaking(true);
        videoElement.play().catch((err) => console.log('Video play error:', err));
      });
      
      audio.addEventListener('ended', () => {
        setIsSpeaking(false);
        videoElement.pause();
        videoElement.currentTime = 0;
      });
      
      audio.addEventListener('pause', () => {
        setIsSpeaking(false);
        videoElement.pause();
      });
    }
    
    audio.play().catch((err) => console.log('Audio playback error:', err));
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Get AI text response
      const chatRes = await fetch(`${API_BASE}/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          message: userInput,
          history: messages.slice(-10).map((m) => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        }),
      });

      if (!chatRes.ok) {
        throw new Error('Chat request failed');
      }

      const { reply } = await chatRes.json();

      // Generate TTS audio for the response
      let audioUrl: string | undefined;
      try {
        const ttsRes = await fetch(`${API_BASE}/ai-tts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ text: reply }),
        });

        if (ttsRes.ok) {
          const audioBlob = await ttsRes.blob();
          audioUrl = URL.createObjectURL(audioBlob);
        }
      } catch (err) {
        console.log('TTS generation error:', err);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: reply,
        audioUrl,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-play audio with video sync
      if (audioUrl) {
        playVideoWithAudio(audioUrl, assistantMessage.id);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#0A0E27] via-[#0F1535] to-[#0A0E27]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/10 bg-[#0A0E27]/80 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E52324]/30 bg-[#1A1F3A]">
                  <video
                    ref={welcomeVideoRef}
                    src="./animated-bot.mp4"
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                  />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A0E27] ${
                  isSpeaking ? 'bg-[#E52324] animate-pulse' : 'bg-green-500'
                }`} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white font-['Outfit']">
                  InstaPass AI Assistant
                </h1>
                {voiceInfo && (
                  <p className="text-sm text-white/60">
                    Powered by {voiceInfo.name}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#E52324]/10 text-[#E52324] border border-[#E52324]/20">
                <span className="w-1.5 h-1.5 bg-[#E52324] rounded-full mr-2 animate-pulse" />
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Welcome message */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-[#E52324]/20 shadow-2xl bg-[#1A1F3A]">
              <video
                ref={welcomeVideoRef}
                src="./animated-bot.mp4"
                className="w-full h-full object-cover"
                loop
                muted
                playsInline
                autoPlay
              />
            </div>
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold text-white font-['Outfit']">
                👋 Welcome to InstaPass!
              </h2>
              <p className="text-white/60">
                I'm your personal event concierge. Ask me about tickets, events,
                our marketplace, or anything InstaPass!
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl">
              {[
                'Show me concerts near LA',
                'What are InstaPoints?',
                'How does the marketplace work?',
                'Find sports events this weekend',
              ].map((suggestion) => (
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
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
          >
            {/* Assistant Avatar with Video */}
            {msg.type === 'assistant' && (
              <div className="flex-shrink-0 pt-1">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E52324]/30 bg-[#1A1F3A]">
                  <video
                    ref={(el) => {
                      chatVideoRefs.current[msg.id] = el;
                    }}
                    src="./animated-bot.mp4"
                    className="w-full h-full object-cover"
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>
            )}
            
            <div
              className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                msg.type === 'user'
                  ? 'bg-gradient-to-br from-[#E52324] to-[#B01819] text-white'
                  : 'bg-[#1A1F3A] text-white border border-white/10'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
              {msg.audioUrl && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => playVideoWithAudio(msg.audioUrl!, msg.id)}
                    className="w-full px-3 py-2 rounded-lg bg-[#E52324]/10 hover:bg-[#E52324]/20 border border-[#E52324]/20 text-[#E52324] text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Play Voice Response
                  </button>
                </div>
              )}
              <p className="text-xs opacity-50 mt-2">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="flex-shrink-0 pt-1">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E52324]/30 bg-[#1A1F3A]">
                <video
                  src="./animated-bot.mp4"
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                  autoPlay
                />
              </div>
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
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about InstaPass..."
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
    </div>
  );
}
