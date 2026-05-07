// Wrapper to import the bot mascot image as a data URI
import raw from '../../imports/bot-image.txt?raw';

// Extract the data URI from line 1: const BOT_IMG = "data:image/jpeg;base64,...";
const start = raw.indexOf('"data:image/jpeg;base64,');
const end = raw.indexOf('";', start);
export const botImage: string = (start !== -1 && end !== -1)
  ? raw.substring(start + 1, end)
  : '';
