#!/usr/bin/env python3
"""
Update AIChatbot.tsx to use animated-bot.mp4 as default avatar video
Run with: python3 update-aichatbot.py
"""

import os
import sys

file_path = 'src/app/components/AIChatbot.tsx'

print('🤖 Updating AIChatbot.tsx with animated-bot.mp4...')
print(f'📁 File: {file_path}')

try:
    # Read the file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Make the replacements
    old_avatar_video = "const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);"
    new_avatar_video = "const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');"
    
    old_avatar_idle = "const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>(null);"
    new_avatar_idle = "const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');"
    
    # Check if already updated
    if './animated-bot.mp4' in content:
        print('⚠️  File appears to already be updated!')
        sys.exit(0)
    
    # Replace both lines
    content = content.replace(old_avatar_video, new_avatar_video)
    content = content.replace(old_avatar_idle, new_avatar_idle)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print('✅ Successfully updated AIChatbot.tsx!')
    print('📹 Default avatar video is now set to animated-bot.mp4')
    print('🎉 The AI chatbot widget will now show the animated bot by default')
    
except FileNotFoundError:
    print(f'❌ Error: Could not find {file_path}')
    print('💡 Make sure you run this from the project root directory')
    sys.exit(1)
except Exception as e:
    print(f'❌ Error: {e}')
    sys.exit(1)
