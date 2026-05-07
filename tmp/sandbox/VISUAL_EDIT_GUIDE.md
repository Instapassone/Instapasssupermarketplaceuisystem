# 🎯 AICHATBOT EDIT - VISUAL GUIDE

## THE ONLY EDIT YOU NEED TO MAKE

### File Location
```
📁 /tmp/sandbox/src/app/components/AIChatbot.tsx
```

### Exact Lines to Change: 249-250

---

## VISUAL DIAGRAM

```typescript
┌─────────────────────────────────────────────────────────────┐
│ Line 241  const [isStreaming, setIsStreaming] = ...        │
│ Line 242  const [isListening, setIsListening] = ...        │
│ Line 243  const [isSpeaking, setIsSpeaking] = ...          │
│ Line 244  const [speakingMsgId, setSpeakingMsgId] = ...    │
│ Line 245  const [micError, setMicError] = ...              │
│ Line 246  const [unread, setUnread] = ...                  │
│ Line 247  const [copiedId, setCopiedId] = ...              │
│ Line 248  const [autoVoice, setAutoVoice] = ...            │
├─────────────────────────────────────────────────────────────┤
│ Line 249  const [avatarVideoUrl, setAvatarVideoUrl] =     │
│           useState<string | null>(null);  ← CHANGE THIS!   │
│                                     ^^^^                    │
│                              Change null to:                │
│                         './animated-bot.mp4'                │
├─────────────────────────────────────────────────────────────┤
│ Line 250  const [avatarIdleUrl, setAvatarIdleUrl] =       │
│           useState<string | null>(null);  ← CHANGE THIS!   │
│                                     ^^^^                    │
│                              Change null to:                │
│                         './animated-bot.mp4'                │
├─────────────────────────────────────────────────────────────┤
│ Line 251  const [isUploading, setIsUploading] = ...        │
│ Line 252  const [isUploadingIdle, setIsUploadingIdle] ...  │
│ Line 253  const [showAvatarMenu, setShowAvatarMenu] = ...  │
└─────────────────────────────────────────────────────────────┘
```

---

## BEFORE & AFTER

### ❌ BEFORE (Current - Lines 249-250)
```typescript
const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);
const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>(null);
```

### ✅ AFTER (Updated - Lines 249-250)
```typescript
const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');
const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');
```

---

## STEP-BY-STEP GUIDE

### Step 1: Open File
```
Open: /tmp/sandbox/src/app/components/AIChatbot.tsx
```

### Step 2: Go to Line 249
- Press `Ctrl+G` (or `Cmd+G` on Mac)
- Type: `249`
- Press Enter

### Step 3: Find This Text
```typescript
useState<string | null>(null);
```

### Step 4: Replace With
```typescript
useState<string | null>('./animated-bot.mp4');
```

### Step 5: Repeat for Line 250
- Go to line 250
- Find: `useState<string | null>(null);`
- Replace with: `useState<string | null>('./animated-bot.mp4');`

### Step 6: Save
- Press `Ctrl+S` (or `Cmd+S` on Mac)
- File is now updated!

---

## FIND & REPLACE METHOD

### VS Code
1. Press `Ctrl+H` (or `Cmd+H`)
2. Find: `const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);`
3. Replace: `const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');`
4. Click "Replace" (should find 1 match)
5. Find: `const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>(null);`
6. Replace: `const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');`
7. Click "Replace" (should find 1 match)
8. Save file

---

## COMMAND LINE METHOD

### Using sed (macOS/Linux)
```bash
cd /tmp/sandbox

# Backup first
cp src/app/components/AIChatbot.tsx src/app/components/AIChatbot.tsx.backup

# Apply changes
sed -i.bak '249s/null/'\''\.\/animated-bot.mp4'\''/' src/app/components/AIChatbot.tsx
sed -i.bak '250s/null/'\''\.\/animated-bot.mp4'\''/' src/app/components/AIChatbot.tsx

# Verify
grep -n "animated-bot.mp4" src/app/components/AIChatbot.tsx
```

### Expected Output
```
249:  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');
250:  const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');
```

---

## WHAT THIS CHANGES

### Current Behavior (Before Edit)
```
Component loads
  ↓
avatarVideoUrl = null
  ↓
No video shows (empty circle)
  ↓
User must upload video to see avatar
```

### New Behavior (After Edit)
```
Component loads
  ↓
avatarVideoUrl = './animated-bot.mp4'
  ↓
Animated bot video shows immediately!
  ↓
Video syncs with ElevenLabs voice
  ↓
User can still upload custom video (optional)
```

---

## VERIFICATION

### After Editing, Check:

1. **File saved?**
   - Look for * (asterisk) in tab name
   - Should disappear after saving

2. **Changes applied?**
   ```bash
   grep "animated-bot.mp4" /tmp/sandbox/src/app/components/AIChatbot.tsx
   ```
   Should see 2 lines (249 and 250)

3. **No syntax errors?**
   - Check for red underlines in editor
   - Should be none

4. **Refresh browser**
   - Reload your app
   - Check chatbot widget

---

## TROUBLESHOOTING

### "I can't find line 249"
→ Scroll down in the file or use Ctrl+G to jump to line

### "Nothing changed after edit"
→ Did you save the file? (Ctrl+S)
→ Did you refresh the browser?

### "Syntax error"
→ Copy the exact text from this guide
→ Don't miss the single quotes: `'./animated-bot.mp4'`

### "Still shows no video"
→ Check `/tmp/sandbox/animated-bot.mp4` file exists
→ Check browser console for 404 errors

---

## FULL CONTEXT (Lines 240-260)

```typescript
export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([greetingMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState('');
  const [micError, setMicError] = useState('');
  const [unread, setUnread] = useState(1);
  const [copiedId, setCopiedId] = useState('');
  const [autoVoice, setAutoVoice] = useState(true);
  
  // ✏️ EDIT THESE TWO LINES ✏️
  const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');
  const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');
  
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingIdle, setIsUploadingIdle] = useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [voiceInfo, setVoiceInfo] = useState<{ name: string; gender: string; accent: string; description: string; } | null>(null);
```

---

## ⏱️ TIME ESTIMATE

- **Find the file:** 10 seconds
- **Navigate to lines:** 5 seconds
- **Make changes:** 10 seconds
- **Save & verify:** 5 seconds

**Total:** 30 seconds ⚡

---

## ✅ DONE!

After this edit:
- ✅ Chatbot widget shows animated video
- ✅ Video syncs with ElevenLabs voice
- ✅ Status indicator works
- ✅ Upload custom videos still works
- ✅ All other features intact

---

**That's it!** Just 2 lines, 30 seconds. Easy! 🎉
