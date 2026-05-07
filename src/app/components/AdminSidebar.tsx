import { Link, useLocation } from 'react-router';
import {
  Home, LayoutDashboard, ShoppingCart, Users, User,
  Image, CalendarDays, TrendingUp, Tag,
} from 'lucide-react';
import { InstaPassLogo } from './InstaPassLogo';

const menuItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: User, label: 'Profile', href: '/admin/profile' },
  { icon: Image, label: 'Banner', href: '/admin/banner' },
  { icon: CalendarDays, label: 'Latest Events', href: '/admin/latest-events' },
  { icon: TrendingUp, label: 'Trending Events', href: '/admin/trending-events' },
  { icon: Tag, label: 'Create CouponCode', href: '/admin/coupons' },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[200px] bg-[#0B1120] border-r border-[#1a2744] flex flex-col z-40"
      style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
    >
      {/* Nav */}
      <nav className="flex-1 pt-5 px-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href ||
            (item.href === '/admin' && location.pathname === '/admin');
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-all duration-150 mb-0.5 ${
                isActive
                  ? 'text-white bg-[#1a2744]'
                  : 'text-white/50 hover:text-white hover:bg-[#1a2744]/50'
              }`}
              style={{ fontWeight: isActive ? 600 : 400 }}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/40'}`} strokeWidth={1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* InstaPass logo at bottom */}
      <div className="px-4 py-6">
        <InstaPassLogo size="lg" />
      </div>
    </aside>
  );
}