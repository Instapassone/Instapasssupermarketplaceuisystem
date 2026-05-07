#!/usr/bin/env python3
import sys

file_path = '/tmp/sandbox/src/app/components/AIChatbot.tsx'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Make the replacements
    old_video = "const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);"
    new_video = "const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');"
    
    old_idle = "const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>(null);"
    new_idle = "const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');"
    
    if './animated-bot.mp4' in content:
        print('Already updated!')
        sys.exit(0)
    
    content = content.replace(old_video, new_video)
    content = content.replace(old_idle, new_idle)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print('Success!')
    
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
