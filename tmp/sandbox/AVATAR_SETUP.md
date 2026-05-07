# Avatar Bot Video Setup

## Updated Components

The InstaPass AI Assistant has been updated to use the animated bot video with ElevenLabs voice sync.

### Components Updated:
- `/src/app/components/AvatarBotIntegrated.tsx` - Main avatar chatbot component
- `/src/app/pages/AvatarAssistant.tsx` - Avatar assistant page wrapper
- `/supabase/functions/server/index.tsx` - Backend with AI chat and TTS endpoints

## Required Video File

**IMPORTANT:** You need to place your `animated-bot.mp4` file in the project root directory:

```
/tmp/sandbox/animated-bot.mp4
```

The video should be placed in the same directory as your `package.json` file.

## Features Implemented

### 1. Video Avatar Integration
- ✅ Animated bot video in welcome screen (large format)
- ✅ Animated bot video in header avatar (small format)
- ✅ Animated bot video in chat message bubbles
- ✅ Responsive design for mobile/tablet/desktop

### 2. ElevenLabs Voice Sync
- ✅ Voice info fetched from `/voice-info` endpoint
- ✅ Voice name displayed in header ("Powered by...")
- ✅ TTS audio generation via `/ai-tts` endpoint
- ✅ Auto-play functionality for voice responses
- ✅ Video plays when voice speaks
- ✅ Video pauses when voice stops
- ✅ Status indicator (green = idle, pulsing red = speaking)

### 3. AI Chat Integration
- ✅ OpenAI GPT-4o-mini powered responses
- ✅ Context-aware conversation with message history
- ✅ InstaPass-specific knowledge base
- ✅ Error handling and loading states

### 4. UI/UX Features
- ✅ InstaPass brand colors (#E52324 red on dark navy)
- ✅ Smooth animations and transitions
- ✅ Message timestamps
- ✅ Click-to-play audio controls
- ✅ Suggested prompts for new users
- ✅ Auto-scroll to latest message

## How to Access

Visit: `/avatar-assistant` in your app

## Environment Variables

The following environment variables are already configured:
- `OPENAI_API_KEY` ✅
- `ELEVENLABS_API_KEY` ✅
- `ELEVENLABS_VOICE_ID` ✅
- `SUPABASE_URL` ✅
- `SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅

## Video Specifications

Your `animated-bot.mp4` should ideally be:
- Format: MP4 (H.264 codec)
- Dimensions: Square ratio recommended (e.g., 512x512 or 1024x1024)
- Duration: Loopable animation (3-10 seconds recommended)
- File size: < 5MB for optimal loading

## How Voice-Video Sync Works

1. User sends a message
2. OpenAI generates text response
3. ElevenLabs converts text to speech audio
4. Audio blob is created and stored with the message
5. When audio plays:
   - Video element starts playing (synced)
   - Status indicator turns red and pulses
6. When audio ends:
   - Video pauses and resets
   - Status indicator returns to green

## Next Steps

1. Place your `animated-bot.mp4` in `/tmp/sandbox/`
2. Test the assistant at `/avatar-assistant`
3. Verify voice sync is working properly
4. Customize the voice name in the `/voice-info` endpoint if needed
