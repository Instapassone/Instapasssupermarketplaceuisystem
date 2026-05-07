# AIChatbot Component Update Instructions

## File: `/src/app/components/AIChatbot.tsx`

### Change Required (Line 249-250)

**Current Code:**
```typescript
const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>(null);
```

**Updated Code:**
```typescript
const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');
const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');
```

### What This Does

This sets the default avatar video to `animated-bot.mp4` instead of null. The chatbot will now:
1. Use the animated bot video by default (no upload required)
2. Show the animated bot in both speaking and idle states
3. Still allow users to upload custom avatar videos if desired
4. Sync the video playback with ElevenLabs voice automatically

### How to Apply This Change

**Option 1: Manual Edit**
1. Open `/src/app/components/AIChatbot.tsx`
2. Find line 249 (search for `const [avatarVideoUrl`)
3. Change `null` to `'./animated-bot.mp4'` on both lines 249 and 250
4. Save the file

**Option 2: Find & Replace**
1. Search for: `useState<string | null>(null);` (lines 249-250)
2. Replace with: `useState<string | null>('./animated-bot.mp4');`
3. Only replace these two specific lines (avatarVideoUrl and avatarIdleUrl)

## Verification

After making the change, the AI chatbot widget should:
- Display the animated-bot.mp4 video in the avatar circle
- Play the video when speaking (synced with ElevenLabs voice)
- Show the video in the idle state
- Still allow custom video uploads via the upload menu

## Important Note

Make sure `animated-bot.mp4` is placed in the project root directory (`/tmp/sandbox/animated-bot.mp4`) for this to work properly.
