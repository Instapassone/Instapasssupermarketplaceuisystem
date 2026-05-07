# ⚡ QUICK REFERENCE CARD

## 🎯 2-MINUTE SETUP

### 1. Add Video File
```bash
# Place here:
/tmp/sandbox/animated-bot.mp4
```

### 2. Test Full Page Chat (Ready Now!)
```
Visit: /avatar-assistant
✅ Works immediately!
```

### 3. Update Widget (Optional - 30 seconds)
```bash
# Open: src/app/components/AIChatbot.tsx
# Lines 249-250
# Change: null → './animated-bot.mp4'
```

---

## 📊 STATUS

```
✅ AvatarBotIntegrated  → DONE
✅ Server Endpoints     → DONE
⚠️  AIChatbot          → 2 lines to edit
⚠️  Video File         → You must add
```

---

## 🎬 VIDEO SPECS

- Format: MP4 (H.264)
- Size: < 5MB
- Dimensions: Square (512x512+)
- Duration: 3-10 sec (loop)

---

## 🧪 QUICK TEST

1. Add `animated-bot.mp4`
2. Visit `/avatar-assistant`
3. Send message
4. ✅ Voice + Video sync!

---

## 📚 DOCUMENTATION

| File | Purpose |
|------|---------|
| **FINAL_SUMMARY.md** | Complete guide |
| **AICHATBOT_PATCH.md** | Edit instructions |
| **CHECKLIST.md** | Full testing |

---

## 🔧 AICHATBOT EDIT

**File:** `src/app/components/AIChatbot.tsx`

**Line 249:**
```typescript
const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');
```

**Line 250:**
```typescript
const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');
```

---

## ✅ CHECKLIST

- [ ] Add animated-bot.mp4
- [ ] Visit /avatar-assistant
- [ ] Test voice sync
- [ ] (Optional) Edit AIChatbot.tsx
- [ ] (Optional) Test widget

---

## 🆘 TROUBLESHOOTING

**No video?**
→ Check `/tmp/sandbox/animated-bot.mp4` exists

**No voice?**
→ Check ELEVENLABS_API_KEY

**Widget no video?**
→ Did you edit lines 249-250?

---

## 🎉 SUCCESS!

When working:
- ✅ Video in welcome screen
- ✅ Video syncs with voice
- ✅ Status indicator pulses
- ✅ No console errors

---

**Time:** 5 minutes  
**Difficulty:** Easy  
**Status:** Ready! 🚀
