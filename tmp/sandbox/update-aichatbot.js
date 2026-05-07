#!/usr/bin/env node
/**
 * Script to update AIChatbot.tsx with animated-bot.mp4 default video
 * Run with: node update-aichatbot.js
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'components', 'AIChatbot.tsx');

console.log('Updating AIChatbot.tsx...');
console.log('File path:', filePath);

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Make the replacements
  const oldAvatarVideoUrl = "const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>(null);";
  const newAvatarVideoUrl = "const [avatarVideoUrl, setAvatarVideoUrl] = useState<string | null>('./animated-bot.mp4');";
  
  const oldAvatarIdleUrl = "const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>(null);";
  const newAvatarIdleUrl = "const [avatarIdleUrl, setAvatarIdleUrl] = useState<string | null>('./animated-bot.mp4');";
  
  // Replace both lines
  content = content.replace(oldAvatarVideoUrl, newAvatarVideoUrl);
  content = content.replace(oldAvatarIdleUrl, newAvatarIdleUrl);
  
  // Write back to file
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log('✅ Successfully updated AIChatbot.tsx');
  console.log('The animated-bot.mp4 is now set as the default avatar video.');
} catch (error) {
  console.error('❌ Error updating file:', error.message);
  process.exit(1);
}
