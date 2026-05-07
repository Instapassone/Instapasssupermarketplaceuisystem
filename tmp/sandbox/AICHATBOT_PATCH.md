# PATCH: AIChatbot.tsx - Add animated-bot.mp4 Default Video

## File Location
```
/tmp/sandbox/src/app/components/AIChatbot.tsx
```

## Changes Required

### Lines 249-250: Set Default Avatar Videos

**BEFORE:**
```typescript
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
  const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>(null);
```

**AFTER:**
```typescript
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');
  const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');
```

## Context (Lines 241-260)

```typescript
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState('');
  const [micError, setMicError] = useState('');
  const [unread, setUnread] = useState(1);
  const [copiedId, setCopiedId] = useState('');
  const [autoVoice, setAutoVoice] = useState(true);
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');  // ← CHANGE THIS
  const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');    // ← CHANGE THIS
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingIdle, setIsUploadingIdle] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [voiceInfo, setVoiceInfo] = useState<{ name: string; gender: string; accent: string; description: string; } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idleFileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
```

## How to Apply

### Option 1: Text Editor (Recommended)
1. Open `/tmp/sandbox/src/app/components/AIChatbot.tsx` in your code editor
2. Go to line 249
3. Find: `useState<string | null>(null);`
4. Replace with: `useState<string | null>('./animated-bot.mp4');`
5. Repeat for line 250
6. Save the file

### Option 2: VS Code Find & Replace
1. Open `AIChatbot.tsx`
2. Press `Ctrl+H` (or `Cmd+H` on Mac)
3. Search for: `const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);`
4. Replace with: `const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');`
5. Click "Replace"
6. Search for: `const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>(null);`
7. Replace with: `const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');`
8. Click "Replace"
9. Save the file

### Option 3: Command Line (sed)
```bash
cd /tmp/sandbox

# Backup the original file
cp src/app/components/AIChatbot.tsx src/app/components/AIChatbot.tsx.backup

# Apply the changes
sed -i "s/const \[avatarVideoUrl, setAvatarVideoUrl\] = useState<string | null>(null);/const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('.\/animated-bot.mp4');/" src/app/components/AIChatbot.tsx

sed -i "s/const \[avatarIdleUrl, setAvatarIdleUrl\] = useState<string | null>(null);/const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('.\/animated-bot.mp4');/" src/app/components/AIChatbot.tsx

# Verify the changes
grep "animated-bot.mp4" src/app/components/AIChatbot.tsx
```

## What This Does

### Before the Change
- Avatar video is `null` by default
- User must upload a custom video to see an avatar
- If server has uploaded videos, they are fetched and displayed

### After the Change  
- Avatar video defaults to `./animated-bot.mp4`
- Animated bot is immediately visible without uploads
- Video syncs with ElevenLabs voice automatically
- Users can still upload custom videos (which will override the default)
- If server has uploaded videos, they will still override the default

### Behavior Flow
1. Component loads → Animated bot video displays (default)
2. useEffect runs → Checks server for uploaded videos
3. If server has videos → Replaces default with uploaded ones
4. If no server videos → Keeps animated bot as default

## Testing After Change

1. Save the file
2. Refresh your app
3. Look for the AI chatbot widget
4. The avatar should show the animated bot video
5. When voice plays, video should animate
6. Status indicator should pulse red when speaking

## Verification

After making the change, verify by running:

```bash
# Check that the change was applied
grep -n "animated-bot.mp4" /tmp/sandbox/src/app/components/AIChatbot.tsx

# Expected output (should show lines 249-250):
# 249:  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');
# 250:  const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');
```

## Rollback (if needed)

If you backed up the file:
```bash
cp src/app/components/AIChatbot.tsx.backup src/app/components/AIChatbot.tsx
```

Or manually change the lines back to `null`.

## Related Files

This change works with:
- `/tmp/sandbox/animated-bot.mp4` - The video file (must be present!)
- `/tmp/sandbox/src/app/components/AvatarBotIntegrated.tsx` - Already updated ✅
- `/tmp/sandbox/supabase/functions/server/index.tsx` - Already updated ✅

## Notes

- The `./animated-bot.mp4` path is relative to the app root
- Vite will serve this file from the public directory
- The file must be named exactly `animated-bot.mp4`
- The video will loop automatically (handled by LipSyncAvatarMedia component)
- Voice sync is already implemented in the component

## Status

- ✅ Documentation created
- ⚠️ **Manual edit required** (2 lines)
- ✅ All other components updated
- ✅ Server endpoints ready
- ✅ Voice sync logic in place

**Time to complete:** 30 seconds
