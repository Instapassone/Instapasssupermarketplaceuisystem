# InstaPass Avatar Bot Architecture

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                              │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND COMPONENTS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────┐    ┌──────────────────────────┐  │
│  │  AvatarBotIntegrated.tsx │    │    AIChatbot.tsx         │  │
│  │  (Full Page Chat)        │    │    (Floating Widget)     │  │
│  ├──────────────────────────┤    ├──────────────────────────┤  │
│  │ • Welcome screen video   │    │ • Avatar circle video    │  │
│  │ • Header avatar video    │    │ • Lip-sync animation     │  │
│  │ • Chat bubble avatars    │    │ • Upload functionality   │  │
│  │ • Voice sync             │    │ • Voice sync             │  │
│  │ • Status indicator       │    │ • Siri wave visualizer   │  │
│  └──────────┬───────────────┘    └────────┬─────────────────┘  │
│             │                               │                     │
│             └───────────┬───────────────────┘                     │
│                         │                                         │
└─────────────────────────┼─────────────────────────────────────────┘
                          │
                          │ HTTP Requests
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER (Hono)                           │
│          /supabase/functions/server/index.tsx                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  📍 GET  /voice-info                                             │
│     └─> Returns: { name, gender, category }                      │
│                                                                   │
│  📍 POST /ai-chat                                                │
│     ├─> Input: { message, history[] }                            │
│     ├─> Calls: OpenAI GPT-4o-mini                               │
│     └─> Returns: { reply }                                        │
│                                                                   │
│  📍 POST /ai-tts                                                 │
│     ├─> Input: { text }                                          │
│     ├─> Calls: ElevenLabs TTS API                               │
│     └─> Returns: audio/mpeg stream                               │
│                                                                   │
└───────────┬───────────────────┬───────────────────────────────────┘
            │                   │
            │                   │
            ▼                   ▼
┌─────────────────┐   ┌─────────────────────┐
│  OpenAI API     │   │  ElevenLabs API     │
│  GPT-4o-mini    │   │  Text-to-Speech     │
└─────────────────┘   └─────────────────────┘
```

## Voice-Video Sync Flow

```
USER SENDS MESSAGE
       │
       ▼
┌──────────────────────────────────────┐
│ 1. POST to /ai-chat                  │
│    • OpenAI generates text response  │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ 2. POST to /ai-tts                   │
│    • ElevenLabs converts to audio    │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ 3. Create Audio Blob                 │
│    • URL.createObjectURL(audioBlob)  │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ 4. Play Audio with Video Sync        │
│    ┌─────────────────────────────┐  │
│    │ audio.play()                │  │
│    │   ↓                         │  │
│    │ video.play()  ←─ synced     │  │
│    │   ↓                         │  │
│    │ status: speaking (red)      │  │
│    └─────────────────────────────┘  │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ 5. Audio Ends                        │
│    ┌─────────────────────────────┐  │
│    │ audio.onended               │  │
│    │   ↓                         │  │
│    │ video.pause()               │  │
│    │   ↓                         │  │
│    │ video.currentTime = 0       │  │
│    │   ↓                         │  │
│    │ status: idle (green)        │  │
│    └─────────────────────────────┘  │
└──────────────────────────────────────┘
```

## Video Element Locations

### AvatarBotIntegrated.tsx

```
┌─────────────────────────────────────────────┐
│ HEADER                                      │
│ ┌─────┐ InstaPass AI Assistant             │
│ │VIDEO│ Powered by [Voice Name]             │
│ └─────┘                                     │
├─────────────────────────────────────────────┤
│ CHAT AREA                                   │
│                                             │
│ ┌─────────────┐                             │
│ │   WELCOME   │ (if no messages)            │
│ │    VIDEO    │                             │
│ │  (large)    │                             │
│ └─────────────┘                             │
│                                             │
│ ┌──┐ Assistant message                      │
│ │VID│ bubble                                │
│ └──┘                                        │
│                                             │
│                 User message ┌────────┐    │
│                       bubble │        │    │
│                              └────────┘    │
├─────────────────────────────────────────────┤
│ INPUT AREA                                  │
│ [Type message...] [SEND]                    │
└─────────────────────────────────────────────┘
```

### AIChatbot.tsx (Floating Widget)

```
┌─────────────────────────┐
│   ┌─────────────┐       │
│   │   VIDEO     │       │
│   │   AVATAR    │       │
│   │  (circular) │       │
│   └─────────────┘       │
│                         │
│  InstaPass AI Assistant │
│  [Voice Name Badge]     │
│                         │
├─────────────────────────┤
│ Chat messages...        │
│ ┌──┐ Bot message        │
│ │VID│                   │
│ └──┘                    │
├─────────────────────────┤
│ [Input] [Send]          │
└─────────────────────────┘
```

## File Structure

```
/tmp/sandbox/
├── animated-bot.mp4                    ← VIDEO FILE (Required!)
├── update-aichatbot.js                 ← Update script (Node)
├── update-aichatbot.py                 ← Update script (Python)
├── AVATAR_SETUP.md                     ← Setup instructions
├── AVATAR_UPDATE_SUMMARY.md            ← This file
├── AICHATBOT_UPDATE.md                 ← Manual update guide
│
├── src/
│   └── app/
│       ├── components/
│       │   ├── AvatarBotIntegrated.tsx ← ✅ UPDATED (Full page)
│       │   └── AIChatbot.tsx           ← ⚠️ Needs update (Widget)
│       └── pages/
│           └── AvatarAssistant.tsx     ← ✅ UPDATED (Route page)
│
└── supabase/
    └── functions/
        └── server/
            └── index.tsx               ← ✅ UPDATED (API endpoints)
```

## Video Refs Management

### AvatarBotIntegrated.tsx

```typescript
// Single ref for welcome screen
const welcomeVideoRef = useRef<HTMLVideoElement>(null);

// Multiple refs for chat bubbles (one per message)
const chatVideoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

// Set refs in JSX
<video ref={welcomeVideoRef} ... />
<video ref={(el) => { chatVideoRefs.current[msg.id] = el; }} ... />

// Use in playback function
const videoElement = chatVideoRefs.current[messageId] || welcomeVideoRef.current;
videoElement.play();
```

## Environment Variables Flow

```
┌────────────────────────┐
│ Environment Variables  │
│ (Supabase Secrets)     │
├────────────────────────┤
│ OPENAI_API_KEY         │ ──┐
│ ELEVENLABS_API_KEY     │ ──┤
│ ELEVENLABS_VOICE_ID    │ ──┤
│ SUPABASE_URL           │ ──┤
│ SUPABASE_ANON_KEY      │ ──┤
│ SUPABASE_SERVICE_KEY   │ ──┤
└────────────────────────┘   │
                             │
                             ▼
                   ┌──────────────────┐
                   │ Deno.env.get()   │
                   │ (Server-side)    │
                   └──────────────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │ API Endpoints    │
                   │ Use in requests  │
                   └──────────────────┘
```

## Status Indicator States

```
┌──────────────────────────────────────┐
│ Status Indicator (Dot on Avatar)     │
├──────────────────────────────────────┤
│                                      │
│  🟢 GREEN (Idle)                     │
│  • Voice not playing                 │
│  • Video paused                      │
│  • User can send messages            │
│                                      │
│  🔴 RED PULSING (Speaking)           │
│  • Voice is playing                  │
│  • Video is playing (synced)         │
│  • animate-pulse CSS class           │
│                                      │
└──────────────────────────────────────┘

CSS: bg-green-500 (idle) / bg-[#E52324] animate-pulse (speaking)
```

## API Response Formats

### /voice-info Response
```json
{
  "name": "InstaPass Voice",
  "gender": "neutral",
  "category": "conversational"
}
```

### /ai-chat Request
```json
{
  "message": "What are InstaPoints?",
  "history": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi! How can I help?" }
  ]
}
```

### /ai-chat Response
```json
{
  "reply": "InstaPoints are our gamification rewards..."
}
```

### /ai-tts Request
```json
{
  "text": "InstaPoints are our gamification rewards..."
}
```

### /ai-tts Response
```
Binary audio data (audio/mpeg)
Content-Type: audio/mpeg
```

## Color Scheme

```
InstaPass Brand Colors:
├── Primary Red: #E52324
├── Dark Red: #B01819
├── Hover Red: #FF2D2E / #C01D1E
├── Dark Navy: #0A0E27
├── Medium Navy: #0F1535
├── Card Background: #1A1F3A
└── Status Green: #10B981 (Tailwind green-500)
```

## Typography

```
Fonts:
├── Headings / Navigation: font-['Outfit']
└── Body / Messages: font-['Inter'] (default)
```
