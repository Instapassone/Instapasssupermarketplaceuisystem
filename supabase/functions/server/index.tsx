import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ee934ec0/health", (c) => {
  return c.json({ status: "ok" });
});

// Get ElevenLabs voice information
app.get("/make-server-ee934ec0/voice-info", async (c) => {
  try {
    const voiceId = Deno.env.get("ELEVENLABS_VOICE_ID");
    
    if (!voiceId) {
      return c.json({ 
        name: "Hailey", 
        gender: "female", 
        category: "conversational",
        accent: "american"
      });
    }

    // Return Hailey voice info
    return c.json({
      name: "Hailey",
      gender: "female",
      category: "conversational",
      accent: "american"
    });
  } catch (error) {
    console.error("Voice info error:", error);
    return c.json({ 
      name: "Hailey", 
      gender: "female", 
      category: "conversational",
      accent: "american"
    });
  }
});

// Get avatar configuration for different sections
app.get("/make-server-ee934ec0/get-avatar", async (c) => {
  try {
    const section = c.req.query("section") || "default";
    const voiceId = Deno.env.get("ELEVENLABS_VOICE_ID");
    
    // Get avatar config from KV store
    const configKey = `avatar-config-${section}`;
    let config = await kv.get(configKey);
    
    // If no config exists, create default config
    if (!config) {
      config = {
        video_url: "./animated-bot.mp4",
        voice_id: voiceId || "",
        voice_name: "Hailey",
        auto_play: true,
        sync_with_speech: true,
        section: section,
      };
      
      // Save default config
      await kv.set(configKey, config);
    }
    
    return c.json(config);
  } catch (error) {
    console.error("Avatar config error:", error);
    
    // Return fallback config
    return c.json({
      video_url: "./animated-bot.mp4",
      voice_id: Deno.env.get("ELEVENLABS_VOICE_ID") || "",
      voice_name: "Hailey",
      auto_play: true,
      sync_with_speech: true,
      section: "default",
    });
  }
});

// AI Chat endpoint
app.post("/make-server-ee934ec0/ai-chat", async (c) => {
  try {
    const { message, history = [] } = await c.req.json();
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      return c.json({ error: "OpenAI API key not configured" }, 500);
    }

    // Build messages array for OpenAI
    const messages = [
      {
        role: "system",
        content: `You are the InstaPass AI Assistant, a helpful and friendly event concierge for InstaPass, a modern ticketing platform and marketplace. 

Key features you can help with:
- InstaPass is a SaaS ticketing platform with a marketplace
- InstaPoints: Our gamification rewards system where users earn points for purchases and engagement
- QR Code system: We generate branded QR codes for event tickets
- Event discovery: Users can browse concerts, sports, festivals, and more
- Marketplace: Users can buy/sell tickets securely
- Voice assistant: You have voice capabilities powered by ElevenLabs

Be conversational, enthusiastic, and helpful. Keep responses concise and engaging.`,
      },
      ...history,
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      return c.json({ error: "AI chat request failed" }, 500);
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

    return c.json({ reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return c.json({ error: "Internal server error during chat" }, 500);
  }
});

// AI Text-to-Speech endpoint
app.post("/make-server-ee934ec0/ai-tts", async (c) => {
  try {
    const { text } = await c.req.json();
    const elevenLabsKey = Deno.env.get("ELEVENLABS_API_KEY");
    const voiceId = Deno.env.get("ELEVENLABS_VOICE_ID");

    if (!elevenLabsKey || !voiceId) {
      return c.json({ error: "ElevenLabs credentials not configured" }, 500);
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": elevenLabsKey,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      return c.json({ error: "TTS generation failed" }, 500);
    }

    const audioData = await response.arrayBuffer();
    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioData.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return c.json({ error: "Internal server error during TTS" }, 500);
  }
});

Deno.serve(app.fetch);