# Avatar Bot Integration Guide for Figma Make

## Quick Start - See It Live

Your Avatar Bot is running RIGHT NOW on:
```
http://localhost:3000
```

Visit that URL in your browser to see the bot in action with:
- Real-time conversation interface
- Mock AI responses (simulated backend)
- Live video playback simulation
- Full chat history

## Backend Status
- Server: `localhost:5000`
- API Endpoint: `POST /api/chat`
- Status: ✓ Connected and responding

## How to Integrate Into Your Figma Make

### Step 1: Use the Production React Component

The Avatar Bot is ready as a fully-featured React component with TypeScript support:

**File**: `~/avatar-bot/AvatarBot-Integrated.tsx`

This component includes:
- Full shadcn/ui integration (Button, Input, Card, Badge, ScrollArea)
- Lucide React icons
- Socket.io real-time updates
- Job status polling
- Message history
- Video playback support
- Dark theme matching your design system

### Step 2: Add to Your Figma Make Codebase

In your Figma Make project, import the component:

```typescript
import AvatarBot from './AvatarBot-Integrated';

export default function SupermarketPlace() {
  return (
    <div className="flex h-screen w-screen bg-slate-900">
      <AvatarBot />
    </div>
  );
}
```

### Step 3: Configure Backend Connection

Update the backend URL in `AvatarBot-Integrated.tsx`:

```typescript
// Change this line:
const socket = io('http://localhost:5000', {

// To your production URL:
const socket = io('https://your-production-backend.com', {
```

## API Endpoints (Mock Backend)

Your backend provides these endpoints:

```
POST /api/chat
- Body: { message: "user message", conversationId?: "id" }
- Response: { jobId: "uuid" }

GET /api/job/:jobId
- Response: {
    status: 'processing' | 'completed',
    progress: { stage: string, percentage: number },
    result: { videoUrl: string, transcript: string }
  }

GET /api/conversation/:conversationId
- Response: { messages: Message[] }
```

## Next Steps: Production Setup

When ready for production, gather these credentials:

1. **Supabase** (PostgreSQL database)
   - Project URL
   - API Key
   - Database credentials

2. **Eleven Labs** (AI voice generation)
   - API Key

3. **Hedra** (AI video generation)
   - API Key

4. **Cloudinary** (Media storage)
   - Cloud Name
   - API Key
   - API Secret

Then update `backend/server.js` with your credentials to enable:
- Real API responses (instead of mock data)
- Actual video generation
- Real speech synthesis
- Production-grade video hosting

## Architecture

```
┌─────────────────────────────────────┐
│   Figma Make                        │
│  (Your Design System)               │
│  ┌─────────────────────────────┐    │
│  │ AvatarBot-Integrated.tsx    │    │
│  │ (React Component)           │    │
│  └──────────────┬──────────────┘    │
└─────────────────┼────────────────────┘
                  │
        HTTP/WebSocket
                  │
┌─────────────────▼────────────────────┐
│   Backend (Node.js + Express)        │
│   localhost:5000                     │
│  ┌─────────────────────────────┐    │
│  │ Mock API (demo mode)        │    │
│  │ OR                          │    │
│  │ Real APIs (production)      │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

## File Locations

- **React Component**: `~/avatar-bot/AvatarBot-Integrated.tsx`
- **Backend**: `~/avatar-bot/backend/server-demo.js`
- **Frontend Demo**: `~/avatar-bot/frontend/public/index.html`
- **Live Demo**: `http://localhost:3000`

## Support

The Avatar Bot includes:
- ✓ Full TypeScript type safety
- ✓ Real-time WebSocket updates
- ✓ Fallback polling mechanism
- ✓ Error handling and reconnection logic
- ✓ Responsive dark theme UI
- ✓ Compatible with shadcn/ui components
- ✓ Production-ready code

Visit `http://localhost:3000` now to see it working!
