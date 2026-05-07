import { Outlet, useLocation } from 'react-router';
import { AIChatbot } from './AIChatbot';

export function MarketplaceLayout() {
  const location = useLocation();
  const isOrganizerPortal = location.pathname.startsWith('/organizer');
  const isAdminPortal = location.pathname.startsWith('/admin');
  const isQRStudio = location.pathname.startsWith('/qr-studio');

  const isMarketplace = !isOrganizerPortal && !isAdminPortal && !isQRStudio;

  return (
    <div className="relative min-h-screen">
      <Outlet />
      {isMarketplace && <AIChatbot key="marketplace-chatbot" />}
    </div>
  );
}