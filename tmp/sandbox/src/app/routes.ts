import { createBrowserRouter } from 'react-router';
import { MarketplaceLayout } from './components/MarketplaceLayout';
import { MarketplaceHome } from './pages/MarketplaceHome';
import { EventsListing } from './pages/EventsListing';
import { EventDetail } from './pages/EventDetail';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { MyTickets } from './pages/MyTickets';
import { ProfilePage } from './pages/ProfilePage';
import { OrganizerProfilePage } from './pages/OrganizerProfilePage';
import { NewsFeed } from './pages/NewsFeed';
import { SellPage } from './pages/SellPage';
import { QRGeneratorPage } from './pages/QRGeneratorPage';
import { NotFound } from './pages/NotFound';
import { CreateEventLanding } from './pages/CreateEventLanding';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { AboutUs } from './pages/AboutUs';
import { MerchShop } from './pages/MerchShop';
import { TapPlayWidget } from './pages/TapPlayWidget';
import { InstaPointsPage } from './pages/InstaPointsPage';
import { RewardsStore } from './pages/RewardsStore';
import { AvatarAssistant } from './pages/AvatarAssistant';
import { HelpSupport } from './pages/HelpSupport';

// Organizer Portal
import { OrganizerDashboard } from './pages/organizer/OrganizerDashboard';
import { CreateEvent } from './pages/organizer/CreateEvent';
import { MyEvents } from './pages/organizer/MyEvents';
import { Sales } from './pages/organizer/Sales';
import { Attendees } from './pages/organizer/Attendees';
import { Payouts } from './pages/organizer/Payouts';
import { Settings } from './pages/organizer/Settings';
import { SmartCodes } from './pages/organizer/SmartCodes';

// Admin Dashboard (internal platform)
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminProfile } from './pages/admin/AdminProfile';
import { AdminBanner } from './pages/admin/AdminBanner';
import { AdminLatestEvents } from './pages/admin/AdminLatestEvents';
import { AdminTrendingEvents } from './pages/admin/AdminTrendingEvents';
import { AdminCoupons } from './pages/admin/AdminCoupons';

// QR Code Studio (tool system)
import { QRStudioLanding } from './pages/qr-studio/QRStudioLanding';
import { QRStudioGenerate } from './pages/qr-studio/QRStudioGenerate';
import { QRStudioAnalytics } from './pages/qr-studio/QRStudioAnalytics';
import { QRStudioLibrary } from './pages/qr-studio/QRStudioLibrary';
import { QRStudioTemplates } from './pages/qr-studio/QRStudioTemplates';

export const router = createBrowserRouter([
  {
    Component: MarketplaceLayout,
    children: [
      // ─── 1. MARKETPLACE (Public Buyer Experience) ───
      { path: '/', Component: MarketplaceHome },
      { path: '/create-event', Component: CreateEventLanding },
      { path: '/how-it-works', Component: CreateEventLanding },
      { path: '/events', Component: EventsListing },
      { path: '/event/:id', Component: EventDetail },
      { path: '/cart', Component: CartPage },
      { path: '/checkout/:eventId', Component: Checkout },
      { path: '/confirmation', Component: Confirmation },
      { path: '/my-tickets', Component: MyTickets },
      { path: '/profile', Component: ProfilePage },
      { path: '/organizer-profile/:id', Component: OrganizerProfilePage },
      { path: '/news', Component: NewsFeed },
      { path: '/sell', Component: SellPage },
      { path: '/qr-generator', Component: QRGeneratorPage },
      { path: '/privacy', Component: PrivacyPolicy },
      { path: '/terms', Component: TermsOfService },
      { path: '/about', Component: AboutUs },
      { path: '/merch', Component: MerchShop },
      { path: '/tapplay', Component: TapPlayWidget },
      { path: '/instapoints', Component: InstaPointsPage },
      { path: '/rewards', Component: RewardsStore },
      { path: '/avatar-assistant', Component: AvatarAssistant },
      { path: '/help', Component: HelpSupport },

      // ─── 2. ORGANIZER PORTAL (Event Creators) ───
      { path: '/organizer', Component: CreateEvent },
      { path: '/organizer/create-event', Component: CreateEvent },
      { path: '/organizer/dashboard', Component: OrganizerDashboard },
      { path: '/organizer/events', Component: MyEvents },
      { path: '/organizer/sales', Component: Sales },
      { path: '/organizer/attendees', Component: Attendees },
      { path: '/organizer/payouts', Component: Payouts },
      { path: '/organizer/tax', Component: Payouts },
      { path: '/organizer/integrations', Component: Settings },
      { path: '/organizer/smartcodes', Component: SmartCodes },
      { path: '/organizer/settings', Component: Settings },

      // ─── 3. ADMIN DASHBOARD (Internal Platform) ───
      { path: '/admin', Component: AdminDashboard },
      { path: '/admin/dashboard', Component: AdminDashboard },
      { path: '/admin/orders', Component: AdminOrders },
      { path: '/admin/customers', Component: AdminCustomers },
      { path: '/admin/profile', Component: AdminProfile },
      { path: '/admin/banner', Component: AdminBanner },
      { path: '/admin/latest-events', Component: AdminLatestEvents },
      { path: '/admin/trending-events', Component: AdminTrendingEvents },
      { path: '/admin/coupons', Component: AdminCoupons },

      // ─── 4. QR CODE STUDIO (Tool System) ───
      { path: '/qr-studio', Component: QRStudioLanding },
      { path: '/qr-studio/create', Component: QRStudioGenerate },
      { path: '/qr-studio/library', Component: QRStudioLibrary },
      { path: '/qr-studio/analytics', Component: QRStudioAnalytics },
      { path: '/qr-studio/templates', Component: QRStudioTemplates },
      { path: '/qr-studio/batch', Component: QRStudioGenerate },
      { path: '/qr-studio/ai', Component: QRStudioGenerate },
      { path: '/qr-studio/team', Component: QRStudioGenerate },

      // ─── Catch-all routes ───
      { path: '/favorites', Component: ProfilePage },
      { path: '/orders', Component: ProfilePage },
      { path: '/notifications', Component: ProfilePage },
      { path: '/settings', Component: ProfilePage },
      { path: '/security', Component: ProfilePage },
      { path: '/payment-methods', Component: ProfilePage },
      { path: '*', Component: NotFound },
    ],
  },
]);
