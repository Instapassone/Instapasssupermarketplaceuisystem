import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m the InstaPass AI assistant. I can help with events, tickets, refunds, transfers, and Insta Points.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmed,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const history = updatedMessages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const { data, error } = await supabase.functions.invoke("instapass-ai-chat", {
        body: {
          message: trimmed,
          history,
        },
      });

      if (error) {
        throw new Error(error.message || "Function invocation failed");
      }

      const reply =
        typeof data?.reply === "string" && data.reply.trim()
          ? data.reply
          : "Sorry, I couldn’t generate a response right now.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry — I’m having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage();
  };

  return (
    <div className="w-full max-w-md h-[600px] bg-white border rounded-2xl shadow-sm flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">InstaPass AI Support</h2>
        <p className="text-sm text-gray-500">
          Ask about tickets, events, transfers, refunds, or rewards.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
              message.role === "user"
                ? "ml-auto bg-black text-white"
                : "bg-white border text-gray-900"
            }`}
          >
            {message.content}
          </div>
        ))}

        {loading && (
          <div className="max-w-[85%] px-4 py-3 rounded-2xl text-sm bg-white border text-gray-500">
            Typing...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t bg-white flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask InstaPass something..."
          className="flex-1 border rounded-xl px-3 py-2 text-sm outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}