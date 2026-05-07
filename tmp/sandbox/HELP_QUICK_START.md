# ⚡ Help & Support - Quick Setup Guide

## ✅ What's Been Done

1. **Created HelpSupport Component** (`/src/app/pages/HelpSupport.tsx`)
   - Animated bot video integration
   - ElevenLabs voice sync
   - Real-time AI chat
   - Quick action buttons
   - Contact information sidebar

2. **Updated Routes** (`/src/app/routes.ts`)
   - Added HelpSupport import
   - Changed `/help` route from NotFound to HelpSupport

---

## 🎯 Quick Start (2 Minutes)

### Step 1: Verify Video File
```bash
# Make sure animated-bot.mp4 is here:
ls -la /tmp/sandbox/animated-bot.mp4
```

### Step 2: Test the Page
```bash
# Start your dev server (if not running)
npm run dev  # or pnpm dev

# Visit in browser:
http://localhost:5173/help
```

### Step 3: Test Features
1. ✅ Click "Help & Support" in header menu
2. ✅ See animated bot in welcome screen
3. ✅ Type a message or click quick action
4. ✅ Watch video sync with voice
5. ✅ See status indicator change (green → red pulse)

---

## 🎬 Features Overview

### Animated Bot
- **Welcome Screen:** Large 132x132px video
- **Header:** Small 48x48px avatar
- **Chat Messages:** 40x40px avatars
- **Auto-plays and loops**
- **Syncs with voice perfectly**

### Voice Integration
- **Auto-play:** Voice plays automatically
- **Voice Badge:** "Powered by [Voice Name]"
- **Status Indicator:** Green (idle) / Red pulsing (speaking)
- **Gender-matched:** Supports male/female/neutral voices

### Chat Features
- **AI Responses:** GPT-4o-mini powered
- **Quick Actions:** 6 common support topics
- **Message History:** Last 10 messages
- **Typing Indicator:** Animated dots
- **Auto-scroll:** Keeps latest message visible

---

## 📱 Mobile Responsive

### Desktop (1024px+)
```
┌─────────────────────────────────────────────┐
│  Header                                     │
├──────────────────┬──────────────────────────┤
│  Chat Interface  │  Sidebar                 │
│  (2/3 width)     │  - Quick Actions         │
│                  │  - Contact Info          │
│                  │  - Help Resources        │
└──────────────────┴──────────────────────────┘
```

### Mobile (< 1024px)
```
┌──────────────────┐
│  Header          │
├──────────────────┤
│  Chat Interface  │
│  (full width)    │
├──────────────────┤
│  Quick Actions   │
├──────────────────┤
│  Contact Info    │
├──────────────────┤
│  Help Resources  │
└──────────────────┘
```

---

## 🎨 InstaPass Branding

### Colors Used
- Primary Red: `#E52324`
- Dark Red: `#B01819`
- Dark Navy: `#0A0E27`
- Card BG: `#0F1535`
- Border: `#1A1F3A`

### Fonts
- Headings: Outfit
- Body: Inter (default)

---

## 🔗 API Endpoints

All endpoints are already configured:
- ✅ `/voice-info` - Gets ElevenLabs voice info
- ✅ `/ai-chat` - AI conversation
- ✅ `/ai-tts` - Text-to-speech

---

## 📊 File Changes Summary

```
Created:
└── src/app/pages/HelpSupport.tsx (new component)

Modified:
└── src/app/routes.ts (added /help route)

Required:
└── animated-bot.mp4 (in project root)
```

---

## ✅ Testing Checklist

Quick test (2 minutes):
- [ ] Visit `/help`
- [ ] See animated bot video
- [ ] Type "How do I buy tickets?"
- [ ] AI responds with text
- [ ] Voice plays automatically
- [ ] Video syncs with voice
- [ ] Status indicator pulses red
- [ ] Video stops when voice ends

---

## 🆘 Troubleshooting

### Page shows 404
→ Refresh browser or restart dev server

### Video not showing
→ Check `animated-bot.mp4` is in `/tmp/sandbox/`

### Voice not playing
→ Check ELEVENLABS_API_KEY environment variable

### AI not responding
→ Check OPENAI_API_KEY environment variable

---

## 📚 Documentation

Full documentation:
- **HELP_SUPPORT_INTEGRATION.md** - Complete technical docs
- **README_AVATAR_UPDATE.md** - Avatar setup guide
- **FINAL_SUMMARY.md** - Overall project summary

---

## 🎉 That's It!

The Help & Support section is now live with:
✅ Animated bot video  
✅ ElevenLabs voice sync  
✅ AI-powered chat  
✅ Mobile responsive design  
✅ InstaPass branding  

**Visit:** http://localhost:5173/help

---

**Time to complete:** Already done!  
**Status:** ✅ Ready to use  
**Last updated:** April 8, 2026
