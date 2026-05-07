# ✅ Avatar Bot Update Checklist

## Step 1: Place Video File
- [ ] Place `animated-bot.mp4` in `/tmp/sandbox/` directory
- [ ] Verify video is MP4 format (H.264 codec)
- [ ] Verify video is square ratio (e.g., 512x512 or 1024x1024)
- [ ] Verify video file size is < 5MB
- [ ] Verify video loops seamlessly

## Step 2: Update AIChatbot Component (Optional)
Choose ONE method:

### Method A: Node.js Script
```bash
cd /tmp/sandbox
node update-aichatbot.js
```

### Method B: Python Script
```bash
cd /tmp/sandbox
python3 update-aichatbot.py
```

### Method C: Manual Edit
1. Open `/src/app/components/AIChatbot.tsx`
2. Find line 249-250
3. Change both `null` values to `'./animated-bot.mp4'`
4. Save file

**Skip this step if you only need the full-page chat interface**

## Step 3: Verify Components

### AvatarBotIntegrated (Full Page Chat)
- [x] ✅ Updated automatically
- [x] ✅ Uses animated-bot.mp4 by default
- [x] ✅ Voice sync implemented
- [x] ✅ Located at `/avatar-assistant` route

### AIChatbot (Floating Widget)
- [ ] ⚠️ Needs manual update (see Step 2)
- [ ] After update: Uses animated-bot.mp4 by default
- [ ] After update: Voice sync works

### Backend Server
- [x] ✅ Updated automatically
- [x] ✅ /voice-info endpoint added
- [x] ✅ /ai-chat endpoint added
- [x] ✅ /ai-tts endpoint added

## Step 4: Test the Application

### Test Full Page Chat (/avatar-assistant)
- [ ] Navigate to `/avatar-assistant`
- [ ] Verify large video displays in welcome screen
- [ ] Verify video auto-plays on welcome screen
- [ ] Verify small video displays in header
- [ ] Click a suggested prompt or type a message
- [ ] Verify AI responds with text
- [ ] Verify voice audio plays automatically
- [ ] Verify welcome video or chat bubble video plays during voice
- [ ] Verify status indicator is green when idle
- [ ] Verify status indicator pulses red when speaking
- [ ] Verify video pauses when voice ends
- [ ] Verify video resets to beginning after playback
- [ ] Test on desktop browser
- [ ] Test on tablet (responsive)
- [ ] Test on mobile (responsive)

### Test Floating Widget (if AIChatbot updated)
- [ ] Verify avatar circle shows video
- [ ] Verify video syncs with voice
- [ ] Verify status indicator works
- [ ] Verify can still upload custom videos
- [ ] Test on all screen sizes

## Step 5: Environment Check
- [x] ✅ OPENAI_API_KEY configured
- [x] ✅ ELEVENLABS_API_KEY configured
- [x] ✅ ELEVENLABS_VOICE_ID configured
- [x] ✅ SUPABASE_URL configured
- [x] ✅ SUPABASE_ANON_KEY configured
- [x] ✅ SUPABASE_SERVICE_ROLE_KEY configured

## Step 6: Browser Console Check
- [ ] Open browser DevTools (F12)
- [ ] Check Console tab for errors
- [ ] Verify no 404 errors for animated-bot.mp4
- [ ] Verify no API errors
- [ ] Verify no JavaScript errors

## Common Issues & Solutions

### ❌ Video not showing
**Problem:** 404 error in console  
**Solution:** Verify `animated-bot.mp4` is in `/tmp/sandbox/` root directory

### ❌ Voice not playing
**Problem:** ElevenLabs API error  
**Solution:** 
- Check ELEVENLABS_API_KEY is valid
- Check ELEVENLABS_VOICE_ID is correct
- Check you have ElevenLabs API credits

### ❌ Video not syncing with voice
**Problem:** Video plays but not synchronized  
**Solution:**
- Check video refs are properly set
- Check audio event listeners in console
- Try refreshing the page

### ❌ OpenAI not responding
**Problem:** Chat fails  
**Solution:**
- Check OPENAI_API_KEY is valid
- Check you have OpenAI API credits
- Check network connection

### ❌ Status indicator not changing
**Problem:** Stays green or red  
**Solution:**
- Check `isSpeaking` state is updating
- Check audio play/pause/end events
- Check video play/pause is called

## Success Criteria

✅ All items checked above means:
- Video file is in correct location
- Components are updated (AvatarBotIntegrated ✅, AIChatbot optional)
- Backend endpoints are working
- Full page chat works perfectly
- Voice-video sync is smooth
- Status indicators work correctly
- Responsive on all devices
- No console errors

## Next Steps After Completion

1. **Customize Voice Name**
   - Edit `/supabase/functions/server/index.tsx` line 34
   - Change `"InstaPass Voice"` to your desired name

2. **Adjust AI Personality**
   - Edit system prompt in `/supabase/functions/server/index.tsx`
   - Lines 64-75 contain the personality definition

3. **Customize Styling**
   - Update colors in component files
   - Change brand colors from #E52324 to your colors
   - Update fonts from Outfit/Inter to your fonts

4. **Add More Quick Actions**
   - Edit `quickActions` array in components
   - Add your custom prompts

5. **Deploy to Production**
   - Test all features in development first
   - Ensure all environment variables are set in production
   - Deploy and test again

---

**Need Help?**
- Check `AVATAR_SETUP.md` for detailed setup instructions
- Check `ARCHITECTURE.md` for technical details
- Check `AVATAR_UPDATE_SUMMARY.md` for complete overview
- Check `AICHATBOT_UPDATE.md` for AIChatbot-specific instructions

**Last Updated:** April 8, 2026  
**Status:** Ready for testing
