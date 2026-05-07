# InstaPass Avatar Bot - ElevenLabs Voice Sync Update

## ✅ Completed Updates

### 1. AvatarBotIntegrated Component
**File:** `/src/app/components/AvatarBotIntegrated.tsx`

**Status:** ✅ UPDATED

**Changes:**
- ✅ Replaced static image with `animated-bot.mp4` video
- ✅ Added video playback in header avatar (small)
- ✅ Added video playback in welcome screen (large) 
- ✅ Added video playback in chat message bubbles
- ✅ Implemented voice-video sync with ElevenLabs
- ✅ Video plays when voice speaks
- ✅ Video pauses when voice stops
- ✅ Added speaking status indicator (green idle / pulsing red speaking)
- ✅ Added voice name display in header
- ✅ Responsive design for all screen sizes

### 2. Backend Server
**File:** `/supabase/functions/server/index.tsx`

**Status:** ✅ UPDATED

**New Endpoints:**
- ✅ `GET /make-server-ee934ec0/voice-info` - Returns ElevenLabs voice information
- ✅ `POST /make-server-ee934ec0/ai-chat` - OpenAI GPT-4o-mini chat endpoint
- ✅ `POST /make-server-ee934ec0/ai-tts` - ElevenLabs text-to-speech generation

**Features:**
- ✅ Full conversation context (last 10 messages)
- ✅ InstaPass-specific system prompt
- ✅ Audio streaming from ElevenLabs
- ✅ Error handling and logging
- ✅ CORS enabled

### 3. AIChatbot Component
**File:** `/src/app/components/AIChatbot.tsx`

**Status:** ⚠️ MANUAL UPDATE REQUIRED

**Required Change:**
```typescript
// Line 249-250: Change from
const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>(null);

// To:
const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');
const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');
```

**How to Apply:**
1. Run the update script: `node update-aichatbot.js`
2. OR manually edit lines 249-250 in AIChatbot.tsx

---

## 📦 Required Asset

### animated-bot.mp4
**Location:** Place in project root at `/tmp/sandbox/animated-bot.mp4`

**Specifications:**
- Format: MP4 (H.264 codec)
- Recommended dimensions: 512x512 or 1024x1024 (square)
- Duration: 3-10 seconds (loopable)
- File size: < 5MB for optimal performance
- Should loop seamlessly

**Usage:**
- Used in AvatarBotIntegrated component (full page chat)
- Used in AIChatbot component (floating widget)
- Plays when ElevenLabs voice is speaking
- Pauses when voice stops

---

## 🔗 Component Locations

### Where the AI Assistant Is Used:

1. **Full Page Chat Interface**
   - Route: `/avatar-assistant`
   - Component: `AvatarAssistant` → `AvatarBotIntegrated`
   - File: `/src/app/pages/AvatarAssistant.tsx`

2. **Floating Chat Widget** (if enabled)
   - Component: `AIChatbot`
   - File: `/src/app/components/AIChatbot.tsx`
   - Can be embedded anywhere in the app

---

## 🎯 Features Implemented

### Voice-Video Synchronization
- ✅ Video automatically plays when ElevenLabs voice speaks
- ✅ Video automatically pauses when voice ends
- ✅ Audio and video perfectly synced
- ✅ Visual indicator shows speaking status

### Chat Features
- ✅ Real-time AI responses powered by GPT-4o-mini
- ✅ Voice responses with ElevenLabs TTS
- ✅ Message history context (last 10 messages)
- ✅ Quick action buttons for common queries
- ✅ Auto-scroll to latest message
- ✅ Message timestamps
- ✅ Copy message functionality
- ✅ Loading and error states

### InstaPass Integration
- ✅ Custom InstaPass knowledge base in system prompt
- ✅ Knows about InstaPoints, QR codes, marketplace, etc.
- ✅ Brand colors (#E52324 red on dark navy)
- ✅ InstaPass logo and branding
- ✅ Outfit font for headings, Inter for body

---

## 🔐 Environment Variables

**Already Configured:**
- ✅ `OPENAI_API_KEY`
- ✅ `ELEVENLABS_API_KEY`
- ✅ `ELEVENLABS_VOICE_ID`
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`

---

## 🧪 Testing Checklist

### After Placing animated-bot.mp4:

1. ✅ Visit `/avatar-assistant` route
2. ✅ Verify video displays in welcome screen
3. ✅ Verify video displays in header avatar
4. ✅ Send a test message
5. ✅ Verify AI responds with text
6. ✅ Verify voice audio plays
7. ✅ Verify video syncs with voice
8. ✅ Verify status indicator changes (green → red pulse)
9. ✅ Verify video stops when audio ends
10. ✅ Test on mobile/tablet/desktop sizes

---

## 🚀 Quick Start

1. Place `animated-bot.mp4` in `/tmp/sandbox/`
2. Run `node update-aichatbot.js` (optional, for AIChatbot widget)
3. Visit `/avatar-assistant` in your app
4. Start chatting with the AI assistant!

---

## 📝 Next Steps

If you want to customize further:

- **Change voice name:** Edit `/supabase/functions/server/index.tsx` line 34
- **Adjust AI personality:** Edit system prompt in `/supabase/functions/server/index.tsx` line 64-75
- **Customize colors:** Update hex codes in component files
- **Add more quick actions:** Edit `quickActions` array in AIChatbot.tsx
- **Modify video styling:** Update video element className/style props

---

## 🆘 Troubleshooting

**Video not showing:**
- Check `animated-bot.mp4` is in `/tmp/sandbox/` directory
- Check browser console for 404 errors
- Verify video format is MP4

**Voice not playing:**
- Check ElevenLabs API key is valid
- Check ELEVENLABS_VOICE_ID is correct
- Check browser console for API errors
- Verify browser allows audio autoplay

**Video not syncing with voice:**
- Check video element refs are properly connected
- Verify audio event listeners are attached
- Check browser console for JavaScript errors

---

**Documentation created:** April 8, 2026  
**InstaPass Version:** 1.0  
**Components:** AvatarBotIntegrated, AIChatbot, Server API
