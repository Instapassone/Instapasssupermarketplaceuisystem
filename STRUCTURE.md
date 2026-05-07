# InstaPass - SaaS Ticketing Platform

## Overview
InstaPass is a modern, premium SaaS + marketplace UI system for a ticketing platform. Built with React, TypeScript, Tailwind CSS v4, and React Router.

## Design System

### Color Palette
- **Primary (Orange)**: `#ff4d00` - CTAs, accents, branding
- **Background**: `#000000` - Pure black base
- **Card**: `#0a0a0a` - Slightly elevated black
- **Secondary**: `#1a1a1a` - Charcoal elements
- **Muted**: `#262626` - Subtle backgrounds
- **Border**: `rgba(255, 255, 255, 0.1)` - Subtle dividers

### Typography
- Base font size: 16px
- Font weights: 400 (normal), 600 (medium/bold)
- Consistent heading hierarchy (h1-h4)

### Spacing
- 8pt grid system
- Border radius: 12px (0.75rem) for cards and buttons

## Project Structure

```
/src/app/
├── components/          # Reusable UI components
│   ├── Button.tsx       # Primary/Secondary/Ghost/Outline variants
│   ├── Card.tsx         # Default/Elevated/Bordered variants
│   ├── Input.tsx        # Form input with label and error states
│   ├── Modal.tsx        # Reusable modal dialog
│   ├── Header.tsx       # Main navigation header
│   ├── Footer.tsx       # Site footer
│   └── OrganizerSidebar.tsx  # Organizer portal sidebar
│
├── pages/               # Page components
│   ├── MarketplaceHome.tsx   # Main landing page
│   ├── EventDetail.tsx       # Event details with ticket selection
│   ├── Checkout.tsx          # 3-step checkout flow
│   ├── Confirmation.tsx      # Order confirmation
│   ├── MyTickets.tsx         # User ticket management
│   ├── NotFound.tsx          # 404 page
│   └── organizer/            # Organizer portal pages
│       ├── OrganizerDashboard.tsx
│       ├── CreateEvent.tsx
│       ├── MyEvents.tsx
│       ├── Sales.tsx
│       ├── Attendees.tsx
│       ├── Payouts.tsx
│       └── Settings.tsx
│
├── data/
│   └── mockData.ts      # Mock events, categories, tickets data
│
├── routes.ts            # React Router configuration
└── App.tsx              # Root component with RouterProvider
```

## Pages

### 1. Marketplace Home (`/`)
- Hero section with search bar
- Metrics strip (12M+ Tickets, 100% Guarantee, etc.)
- Category grid (8 categories)
- Trending events grid
- Organizer CTA section
- Travel partner cards (Hotels, Flights, Cars)

### 2. Event Detail (`/event/:id`)
- Event hero image
- Event metadata (date, time, venue)
- Ticket type selection with quantity controls
- Order summary sidebar (sticky)
- Buy Now CTA

### 3. Checkout (`/checkout/:eventId`)
- 3-step progress bar (Contact → Payment → Confirm)
- Form validation ready
- Order summary sidebar
- Stripe branding integration

### 4. Confirmation (`/confirmation`)
- Success state with checkmark icon
- Order number display
- Quick actions (View Tickets, Email Tickets)

### 5. My Tickets (`/my-tickets`)
- Tab navigation (Upcoming / Past / Transferred)
- Ticket cards with QR placeholder
- Download and transfer actions

### 6. Organizer Portal (`/organizer/*`)
- **Dashboard**: KPI cards, revenue chart, events table
- **Create Event**: Multi-step form (Details → Tickets → Publish)
- **My Events**: Event management table with search
- **Sales**: Revenue analytics with Recharts
- **Attendees**: Attendee list with search
- **Payouts**: Payout history and balance tracking
- **Settings**: Profile, payout settings, password management

## Reusable Components

### Button
```tsx
<Button variant="primary|secondary|ghost|outline" size="sm|md|lg">
  Click me
</Button>
```

### Card
```tsx
<Card variant="default|elevated|bordered">
  Content
</Card>
```

### Input
```tsx
<Input 
  label="Email" 
  placeholder="you@example.com"
  error="Invalid email"
/>
```

### Modal
```tsx
<Modal 
  isOpen={isOpen} 
  onClose={handleClose}
  title="Modal Title"
  size="sm|md|lg|xl"
>
  Content
</Modal>
```

## Routing
All routes are configured in `/src/app/routes.ts` using React Router's `createBrowserRouter`.

### Public Routes
- `/` - Marketplace home
- `/event/:id` - Event detail
- `/checkout/:eventId` - Checkout flow
- `/confirmation` - Order confirmation
- `/my-tickets` - User tickets

### Organizer Routes
- `/organizer` - Dashboard
- `/organizer/create-event` - Create new event
- `/organizer/events` - Manage events
- `/organizer/sales` - Sales analytics
- `/organizer/attendees` - Attendee management
- `/organizer/payouts` - Payout tracking
- `/organizer/settings` - Account settings

## Features

### Design
- ✅ Premium Stripe-level aesthetic
- ✅ Dark theme with orange accent
- ✅ Consistent 12px border radius
- ✅ 8pt grid spacing system
- ✅ Motion animations on hero section

### Navigation
- ✅ React Router v7 with Data mode
- ✅ Sticky header with navigation
- ✅ Organizer sidebar navigation
- ✅ 404 Not Found page

### User Experience
- ✅ Multi-step checkout flow
- ✅ Ticket quantity selectors
- ✅ Order summary calculations
- ✅ Tab navigation for ticket management
- ✅ Search functionality UI
- ✅ Responsive design

### Organizer Portal
- ✅ KPI dashboard cards
- ✅ Sales analytics chart (Recharts)
- ✅ Event management table
- ✅ Multi-step event creation
- ✅ Payout tracking
- ✅ Settings management

## Technologies
- **React 18.3.1**
- **TypeScript**
- **Tailwind CSS v4**
- **React Router v7**
- **Motion (Framer Motion)** - Animations
- **Recharts** - Analytics charts
- **Lucide React** - Icons

## Development Notes
- All mock data is in `/src/app/data/mockData.ts`
- Theme variables in `/src/styles/theme.css`
- Components follow consistent naming conventions
- All pages are production-ready with proper structure
