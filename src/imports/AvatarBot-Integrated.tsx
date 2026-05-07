'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Play, CheckCircle } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'avatar';
  content: string;
  videoUrl?: string;
  timestamp: Date;
}

interface Job {
  id: string;
  status: 'processing' | 'completed';
  progress: {
    stage: string;
    percentage: number;
  };
  response?: {
    text: string;
    video: string;
  };
  video_url?: string;
}

export function AvatarBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Try to connect to Socket.io
    try {
      socketRef.current = require('socket.io-client')('http://localhost:5000', {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      socketRef.current.on('job_status', (job: Job) => {
        setCurrentJob(job);
      });
    } catch {
      console.log('Socket.io not available, using polling');
    }

    return () => socketRef.current?.disconnect?.();
  }, []);

  const pollJobStatus = async (jobId: string) => {
    const maxAttempts = 40;
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/job/${jobId}`);
        if (!res.ok) throw new Error('Job not found');

        const job: Job = await res.json();
        setCurrentJob(job);

        if (job.status === 'completed') {
          if (job.response) {
            setMessages((prev) => [
              ...prev,
              {
                id: Math.random().toString(),
                type: 'avatar',
                content: job.response.text,
                videoUrl: job.video_url || job.response.video,
                timestamp: new Date(),
              },
            ]);
          }
          setIsLoading(false);
          setCurrentJob(null);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 500);
        }
      } catch (err) {
        console.error('Poll error:', err);
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 500);
        }
      }
    };

    poll();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentJob(null);

    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, conversationId }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const { jobId } = await res.json();
      pollJobStatus(jobId);
    } catch (err) {
      console.error('Error:', err);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          type: 'avatar',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-slate-900 border-slate-700">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-white">✨ Avatar Shopping Assistant</h1>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300">
              Live Demo
            </Badge>
          </div>
          <p className="text-sm text-slate-400">Instapass Super Marketplace</p>
        </div>

        {/* Chat Area */}
        <ScrollArea className="h-96 rounded-lg border border-slate-700 bg-slate-800/50 p-4 mb-4">
          <div className="space-y-4">
            {messages.length === 0 && !currentJob && (
              <div className="flex items-center justify-center h-full text-slate-400 text-center">
                <div>
                  <p className="text-lg mb-2">👋 Hi! I'm your shopping assistant</p>
                  <p className="text-sm">Ask me anything about our products</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-100'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  {msg.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      controls
                      className="mt-2 rounded w-full max-w-xs"
                      style={{ maxHeight: '200px' }}
                    />
                  )}
                </div>
              </div>
            ))}

            {currentJob && currentJob.status === 'processing' && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-slate-100 rounded-lg px-4 py-3 max-w-xs">
                  <p className="text-sm mb-2">{currentJob.progress.stage}</p>
                  <div className="w-40 bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${currentJob.progress.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            disabled={isLoading}
            className="bg-slate-800 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-4 text-xs text-slate-500 text-center">
          🎬 Demo Mode - Connected to localhost:5000
        </div>
      </div>
    </Card>
  );
}

export default AvatarBot;
