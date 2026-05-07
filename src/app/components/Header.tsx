import { Link, useLocation } from 'react-router';
import {
  Search, X, Menu, ChevronDown, User, Ticket, Newspaper,
  Settings, LogOut, Heart, CreditCard, Bell, HelpCircle, Star,
  Compass, CalendarPlus, QrCode, Shield, LayoutGrid, Music, Trophy, Drama, Sparkles,
  LayoutDashboard, Info, ShoppingBag, Zap, Award, Gift,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { InstaPassLogo } from './InstaPassLogo';
import { SportsTicker } from './SportsTicker';

/* ─── Profile menu items ─── */
const profileMenuItems = [
  { label: 'My Profile', icon: User, href: '/profile' },
  { label: 'InstaPoints', icon: Zap, href: '/instapoints', accent: true },
  { label: 'My Tickets', icon: Ticket, href: '/my-tickets' },
  { label: 'Rewards Store', icon: Gift, href: '/rewards' },
  { label: 'Favorites', icon: Heart, href: '/favorites' },
  { label: 'Order History', icon: CreditCard, href: '/orders' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Help & Support', icon: HelpCircle, href: '/help' },
];

/* ─── Categories data ─── */
const categories = [
  {
    title: 'Music',
    icon: Music,
    color: '#E52324',
    subcategories: [
      'Concerts', 'Rock and Pop', 'Rap and Hiphop', 'R&B/Urban Soul',
      'Country/Folk', 'Jazz/Blues', 'Alternatives & Indie', 'Latin',
      'World Music', 'Festivals', 'Cabaret', 'New Age/Spiritual',
    ],
  },
  {
    title: 'Arts & Theater',
    icon: Drama,
    color: '#A855F7',
    subcategories: [
      'Theatres', 'Musicals', 'Plays', 'Opera', 'Ballet and Dance',
      'Comedy', 'Award Shows', 'TV Shows', 'Special Events',
    ],
  },
  {
    title: 'Sports',
    icon: Trophy,
    color: '#3B82F6',
    subcategories: [
      'Baseball', 'MLB', 'Basketball', 'NBA', 'WNBA', 'Hockey',
      'Football', 'Soccer', 'World Cup', 'Boxing', 'Wrestling',
      'MMA', 'NASCAR', 'Formula 1', 'Auto Racing', 'IndyCar Series',
      'Cycling', 'Extreme Sports', 'Golf', 'Tennis',
    ],
  },
  {
    title: 'College & League',
    icon: Sparkles,
    color: '#F59E0B',
    subcategories: [
      'NCAA', 'NCAA Men', 'NCAA Women', 'Minor Leagues', 'AFL',
      'ECHL', 'NBA D-League', 'Mexican League', 'NLL',
      'Euroleague Basketball', 'FIBA World Championship',
      'World Basketball Classic', 'International Friendlies',
      'Highschool', 'Summer Games', 'Winter Games',
    ],
  },
  {
    title: 'Family & More',
    icon: Heart,
    color: '#06B6D4',
    subcategories: [
      'Family', 'Fundraisers', 'Supercross', 'Monster Trucks',
      'Volleyball', 'Lacrosse', 'Fighting', 'Miscellaneous',
    ],
  },
];

export function Header() {
  const location = useLocation();
  const isOrganizerPortal = location.pathname.startsWith('/organizer');
  const isAdminPortal = location.pathname.startsWith('/admin');
  const isQRStudio = location.pathname.startsWith('/qr-studio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) setCategoriesOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Other systems have their own layouts
  if (isOrganizerPortal || isAdminPortal || isQRStudio) return null;

  const mainNav = [
    { label: 'All Events', href: '/events', icon: Compass },
    { label: 'My Tickets', href: '/my-tickets', icon: Ticket },
    { label: 'QR Code Studio', href: '/qr-studio', icon: QrCode },
    { label: 'Merch', href: '/merch', icon: ShoppingBag },
    { label: 'Create Event', href: '/create-event', icon: CalendarPlus, accent: true },
    { label: 'InstaPoints', href: '/instapoints', icon: Zap, gold: true },
  ];

  const user = {
    name: 'Alex Rivera',
    email: 'alex@instapass.ai',
    avatar: null as string | null,
    initials: 'AR',
    memberSince: 'Member since 2024',
    loyaltyPoints: 2480,
  };

  return (
    <>
      <SportsTicker />

      <header className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
        <div className="w-full px-6 sm:px-8 lg:px-10">
          <div className="flex items-center h-[64px]">

            {/* ─── Logo (far left, 32px padding) ─── */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-10">
              <InstaPassLogo size="md" />
            </Link>

            {/* ─── Center Navigation (wider spacing) ─── */}
            <nav className="hidden lg:flex items-center gap-1 flex-1">
              {/* Categories Dropdown */}
              <div ref={categoriesRef} className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-[13px] tracking-wide transition-all duration-200 ${
                    categoriesOpen
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <LayoutGrid className="w-[15px] h-[15px]" strokeWidth={1.8} />
                  Categories
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-[720px] bg-[#111111] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header */}
                    <div className="px-5 pt-4 pb-3 border-b border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>Popular Categories</span>
                        <div className="flex items-center bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5">
                          <Search className="w-3.5 h-3.5 text-white/30 mr-2" strokeWidth={1.8} />
                          <input
                            type="text"
                            placeholder="Search categories..."
                            className="bg-transparent text-[12px] text-white placeholder:text-white/30 outline-none w-36"
                            style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="p-4 grid grid-cols-3 gap-4 max-h-[420px] overflow-y-auto">
                      {categories.map((cat) => {
                        const CatIcon = cat.icon;
                        return (
                          <div key={cat.title}>
                            <div className="flex items-center gap-2 mb-2.5 px-1">
                              <div
                                className="w-6 h-6 rounded-md flex items-center justify-center"
                                style={{ backgroundColor: `${cat.color}15` }}
                              >
                                <CatIcon className="w-3.5 h-3.5" style={{ color: cat.color }} strokeWidth={2} />
                              </div>
                              <span
                                className="text-[11px] uppercase tracking-[0.12em]"
                                style={{ fontWeight: 700, color: cat.color }}
                              >
                                {cat.title}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              {cat.subcategories.map((sub) => (
                                <Link
                                  key={sub}
                                  to={`/events?category=${encodeURIComponent(sub)}`}
                                  onClick={() => setCategoriesOpen(false)}
                                  className="block px-2 py-1.5 rounded-lg text-[12px] text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
                                >
                                  {sub}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between">
                      <Link
                        to="/events"
                        onClick={() => setCategoriesOpen(false)}
                        className="text-[12px] text-[#E52324] hover:text-[#ff6b6b] transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        View All Categories →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href || (item.href === '/events' && location.pathname === '/');
                const isAccent = 'accent' in item && item.accent;
                const isGold = 'gold' in item && item.gold;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-[13px] tracking-wide transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/[0.08]'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className={`w-[15px] h-[15px] ${isAccent && !isActive ? 'text-[#E52324]' : ''} ${isGold && !isActive ? 'text-[#D4A84B]' : ''}`} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* ─── Right Actions ─── */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Search */}
              <div className="hidden md:flex items-center bg-white/[0.04] border border-white/[0.06] rounded-full px-4 py-[9px]">
                <Search className="w-[15px] h-[15px] text-white/30 mr-2.5" strokeWidth={1.8} />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="bg-transparent text-[13px] text-white placeholder:text-white/30 outline-none w-32 lg:w-40"
                  style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
                />
              </div>

              {/* Notifications */}
              <button className="hidden md:flex relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all">
                <Bell className="w-[15px] h-[15px]" strokeWidth={1.8} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E52324] rounded-full text-[8px] text-white flex items-center justify-center" style={{ fontWeight: 700 }}>
                  3
                </span>
              </button>

              {/* ─── User Profile Dropdown ─── */}
              <div ref={profileRef} className="relative hidden md:block">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 ${
                    profileOpen
                      ? 'bg-white/[0.08] border-white/[0.12]'
                      : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.10]'
                  }`}
                >
                  <User className="w-[15px] h-[15px] text-white/50" strokeWidth={1.8} />
                </button>

                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-[#111111] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User info header */}
                    <div className="p-4 border-b border-white/[0.05]">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E52324] to-[#ff6b6b] flex items-center justify-center shrink-0">
                          <span className="text-sm text-white" style={{ fontWeight: 700 }}>
                            {user.initials}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] text-white truncate" style={{ fontWeight: 700 }}>{user.name}</div>
                          <div className="text-[11px] text-white/35 truncate">{user.email}</div>
                          <div className="text-[10px] text-white/25 mt-0.5">{user.memberSince}</div>
                        </div>
                      </div>

                      {/* Loyalty Points */}
                      <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-[#E52324]/10 to-transparent border border-[#E52324]/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-[#E52324] fill-[#E52324]" />
                            <span className="text-[11px] text-[#E52324] uppercase tracking-wider" style={{ fontWeight: 700 }}>
                              Insta Points
                            </span>
                          </div>
                          <span className="text-sm text-white" style={{ fontWeight: 700 }}>
                            {user.loyaltyPoints.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      {profileMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.label}
                            to={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-[#E52324]/10 flex items-center justify-center transition-colors">
                              <Icon className="w-4 h-4 group-hover:text-[#E52324] transition-colors" strokeWidth={1.8} />
                            </div>
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Admin Dashboard & Sign out */}
                    <div className="p-1.5 border-t border-white/[0.05]">
                      <Link
                        to="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all group w-full"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-[#E52324]/10 flex items-center justify-center transition-colors">
                          <LayoutDashboard className="w-4 h-4 group-hover:text-[#E52324] transition-colors" strokeWidth={1.8} />
                        </div>
                        Admin Dashboard
                      </Link>
                      <button
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/35 hover:text-red-400 hover:bg-red-500/5 transition-all group w-full"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-red-500/10 flex items-center justify-center transition-colors">
                          <LogOut className="w-4 h-4 group-hover:text-red-400 transition-colors" strokeWidth={1.8} />
                        </div>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white/60 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Mobile menu ─── */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0a0a0a] border-t border-white/[0.06] px-5 py-4 max-h-[80vh] overflow-y-auto" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
            {/* Search */}
            <div className="flex items-center bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 mb-4">
              <Search className="w-4 h-4 text-white/30 mr-2" strokeWidth={1.8} />
              <input
                type="text"
                placeholder="Search events..."
                className="bg-transparent text-[13px] text-white placeholder:text-white/30 outline-none flex-1"
              />
            </div>

            {/* Mobile user card */}
            <div className="flex items-center gap-3 p-3 mb-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E52324] to-[#ff6b6b] flex items-center justify-center shrink-0">
                <span className="text-xs text-white" style={{ fontWeight: 700 }}>{user.initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] text-white truncate" style={{ fontWeight: 700 }}>{user.name}</div>
                <div className="text-[11px] text-white/35 truncate">{user.email}</div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#E52324]/10">
                <Star className="w-3 h-3 text-[#E52324] fill-[#E52324]" />
                <span className="text-[10px] text-[#E52324]" style={{ fontWeight: 700 }}>{user.loyaltyPoints}</span>
              </div>
            </div>

            <div className="space-y-0.5">
              {mainNav.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href || (item.href === '/events' && location.pathname === '/');
                const isAccent = 'accent' in item && item.accent;
                const isGold = 'gold' in item && item.gold;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                  >
                    <Icon className={`w-4 h-4 ${isAccent ? 'text-[#E52324]' : ''} ${isGold ? 'text-[#D4A84B]' : ''}`} strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}

              <div className="!my-2 border-t border-white/[0.06]" />

              {profileMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-white/45 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors"
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.8} />
                    {item.label}
                  </Link>
                );
              })}

            </div>
          </div>
        )}
      </header>
    </>
  );
}