# 🗺️ File Location Guide

## 📁 What Was Updated

### ✅ Automatically Updated Files

#### 1. AvatarBotIntegrated Component
```
/tmp/sandbox/src/app/components/AvatarBotIntegrated.tsx
```
**Status:** ✅ COMPLETE  
**Changes:** 
- Replaced static image with video (`animated-bot.mp4`)
- Added voice-video sync functionality
- Added speaking status indicator
- Added multiple video refs for chat bubbles

#### 2. Backend Server
```
/tmp/sandbox/supabase/functions/server/index.tsx
```
**Status:** ✅ COMPLETE  
**Changes:**
- Added `/voice-info` endpoint
- Added `/ai-chat` endpoint (OpenAI integration)
- Added `/ai-tts` endpoint (ElevenLabs integration)

#### 3. AvatarAssistant Page
```
/tmp/sandbox/src/app/pages/AvatarAssistant.tsx
```
**Status:** ✅ COMPLETE (already existed, no changes needed)  
**Route:** `/avatar-assistant`

---

### ⚠️ Requires Manual Update

#### AIChatbot Component (Floating Widget)
```
/tmp/sandbox/src/app/components/AIChatbot.tsx
```
**Status:** ⚠️ NEEDS UPDATE (optional)  
**Lines to Change:** 249-250  
**From:** `null`  
**To:** `'./animated-bot.mp4'`

**How to Update:**
```bash
# Option 1: Node.js
node /tmp/sandbox/update-aichatbot.js

# Option 2: Python
python3 /tmp/sandbox/update-aichatbot.py

# Option 3: Manual edit in your code editor
```

---

### 📹 Required Asset

#### Animated Bot Video
```
/tmp/sandbox/animated-bot.mp4
```
**Status:** ⚠️ YOU MUST ADD THIS FILE  
**What:** Your animated bot video file  
**Format:** MP4 (H.264)  
**Size:** < 5MB recommended  
**Dimensions:** Square ratio (512x512 or 1024x1024)

**Where to place it:**
- In the project root directory
- Same directory as `package.json`
- Path: `/tmp/sandbox/animated-bot.mp4`

---

## 📚 Documentation Files Created

All documentation files are in `/tmp/sandbox/`:

### Main Guides
```
/tmp/sandbox/README_AVATAR_UPDATE.md    ← START HERE!
/tmp/sandbox/CHECKLIST.md               ← Step-by-step testing
/tmp/sandbox/AVATAR_UPDATE_SUMMARY.md   ← Complete overview
```

### Technical Docs
```
/tmp/sandbox/ARCHITECTURE.md            ← Technical architecture
/tmp/sandbox/AVATAR_SETUP.md            ← Detailed setup guide
/tmp/sandbox/AICHATBOT_UPDATE.md        ← AIChatbot manual update
```

### Update Scripts
```
/tmp/sandbox/update-aichatbot.js        ← Node.js script
/tmp/sandbox/update-aichatbot.py        ← Python script
```

---

## 🗂️ Complete Project Structure

```
/tmp/sandbox/
│
├── 📹 animated-bot.mp4                    ← ADD THIS FILE!
│
├── 📄 README_AVATAR_UPDATE.md             ← Start here
├── 📄 CHECKLIST.md                        ← Testing guide
├── 📄 AVATAR_UPDATE_SUMMARY.md            ← Overview
├── 📄 ARCHITECTURE.md                     ← Technical docs
├── 📄 AVATAR_SETUP.md                     ← Setup guide
├── 📄 AICHATBOT_UPDATE.md                 ← Widget update
│
├── 🔧 update-aichatbot.js                 ← Update script (Node)
├── 🔧 update-aichatbot.py                 ← Update script (Python)
│
├── 📦 package.json
├── 📦 pnpm-lock.yaml
├── ⚙️ vite.config.ts
├── ⚙️ postcss.config.mjs
│
├── src/
│   └── app/
│       ├── components/
│       │   ├── ✅ AvatarBotIntegrated.tsx   (UPDATED)
│       │   └── ⚠️ AIChatbot.tsx             (needs update)
│       │
│       └── pages/
│           └── ✅ AvatarAssistant.tsx       (uses AvatarBotIntegrated)
│
└── supabase/
    └── functions/
        └── server/
            └── ✅ index.tsx                 (UPDATED - API endpoints)
```

---

## 🔍 How to Find Files in Your Editor

### Visual Studio Code
```
Ctrl/Cmd + P  (Quick Open)
Type: AvatarBotIntegrated.tsx
```

### File Explorer
```
Navigate to: src/app/components/AvatarBotIntegrated.tsx
```

### Terminal
```bash
cd /tmp/sandbox
ls -la src/app/components/AvatarBotIntegrated.tsx
ls -la supabase/functions/server/index.tsx
ls -la src/app/pages/AvatarAssistant.tsx
```

---

## 🎯 What You Need to Do

### Step 1: Add Video File ⚠️
```bash
# Place your animated-bot.mp4 in:
/tmp/sandbox/animated-bot.mp4

# Verify it's there:
ls -la /tmp/sandbox/animated-bot.mp4
```

### Step 2: Update AIChatbot (Optional) ⚠️
```bash
# Go to project root
cd /tmp/sandbox

# Run update script
node update-aichatbot.js
# OR
python3 update-aichatbot.py
```

### Step 3: Test ✅
```bash
# Start your dev server
npm run dev
# or pnpm dev

# Visit in browser:
http://localhost:5173/avatar-assistant
```

---

## 🌐 Routes

### Main Application Routes
```
/                           → Home/Marketplace
/avatar-assistant          → AI Assistant (Full Page) ← NEW!
/events                    → Events listing
/cart                      → Shopping cart
/checkout                  → Checkout page
/confirmation              → Order confirmation
/my-tickets                → User tickets
/profile                   → User profile
... (other routes)
```

### API Endpoints
```
GET  /make-server-ee934ec0/voice-info   ← NEW!
POST /make-server-ee934ec0/ai-chat      ← NEW!
POST /make-server-ee934ec0/ai-tts       ← NEW!
GET  /make-server-ee934ec0/health
```

---

## 🔗 Component Relationships

```
┌─────────────────────────────────────┐
│ App.tsx (Router)                    │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Route: /avatar-assistant     │  │
│  ├──────────────────────────────┤  │
│  │                              │  │
│  │  📄 AvatarAssistant.tsx      │  │
│  │          │                   │  │
│  │          └──► uses           │  │
│  │                              │  │
│  │  🤖 AvatarBotIntegrated.tsx │  │
│  │     ├─► welcomeVideoRef      │  │
│  │     ├─► chatVideoRefs        │  │
│  │     └─► Voice sync logic     │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                     │
└─────────────────────────────────────┘
              │
              │ HTTP Requests
              ▼
┌─────────────────────────────────────┐
│ 🖥️ Server (index.tsx)               │
│    /supabase/functions/server/      │
├─────────────────────────────────────┤
│                                     │
│  📍 GET  /voice-info                │
│  📍 POST /ai-chat                   │
│  📍 POST /ai-tts                    │
│                                     │
└─────────────────────────────────────┘
              │
              ├──► OpenAI API
              └──► ElevenLabs API
```

---

## 📋 Quick Reference

### To View Updated Code
```bash
# AvatarBotIntegrated
cat /tmp/sandbox/src/app/components/AvatarBotIntegrated.tsx

# Server endpoints
cat /tmp/sandbox/supabase/functions/server/index.tsx

# AvatarAssistant page
cat /tmp/sandbox/src/app/pages/AvatarAssistant.tsx
```

### To Check File Sizes
```bash
ls -lh /tmp/sandbox/src/app/components/AvatarBotIntegrated.tsx
ls -lh /tmp/sandbox/supabase/functions/server/index.tsx
ls -lh /tmp/sandbox/animated-bot.mp4  # After you add it
```

### To Search for Video References
```bash
grep -r "animated-bot.mp4" /tmp/sandbox/src/
```

---

## ✅ Verification Commands

### Check if files exist
```bash
# Updated components (should exist)
[ -f /tmp/sandbox/src/app/components/AvatarBotIntegrated.tsx ] && echo "✅ AvatarBotIntegrated exists" || echo "❌ Missing"
[ -f /tmp/sandbox/supabase/functions/server/index.tsx ] && echo "✅ Server exists" || echo "❌ Missing"
[ -f /tmp/sandbox/src/app/pages/AvatarAssistant.tsx ] && echo "✅ AvatarAssistant exists" || echo "❌ Missing"

# Video file (you need to add)
[ -f /tmp/sandbox/animated-bot.mp4 ] && echo "✅ Video exists" || echo "⚠️ Add video file"
```

### Check file content
```bash
# Verify video reference in AvatarBotIntegrated
grep "animated-bot.mp4" /tmp/sandbox/src/app/components/AvatarBotIntegrated.tsx

# Verify endpoints in server
grep -E "(voice-info|ai-chat|ai-tts)" /tmp/sandbox/supabase/functions/server/index.tsx
```

---

## 🎓 Summary

**Files Updated Automatically:**
- ✅ `/src/app/components/AvatarBotIntegrated.tsx`
- ✅ `/supabase/functions/server/index.tsx`

**Files That Need Your Action:**
- ⚠️ `/animated-bot.mp4` (must add)
- ⚠️ `/src/app/components/AIChatbot.tsx` (optional update)

**Documentation Created:**
- 📚 7 documentation files in project root
- 🔧 2 update scripts ready to use

**Next Step:**
1. Add `animated-bot.mp4` to `/tmp/sandbox/`
2. Optionally run `update-aichatbot.js`
3. Visit `/avatar-assistant` and test!

---

**Need Help?** Check `README_AVATAR_UPDATE.md` in the project root!
