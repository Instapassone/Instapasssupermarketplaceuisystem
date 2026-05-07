import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  User, Ticket, LayoutDashboard, LogOut, Camera, Save,
  Eye, EyeOff, Bell, Shield, CreditCard, Star, Settings,
  ChevronRight, Heart, Clock, MapPin,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { InstaPassLogo } from '../components/InstaPassLogo';
import { motion } from 'motion/react';

const sidebarItems = [
  { label: 'Home', icon: LayoutDashboard, href: '/' },
  { label: 'Account Details', icon: User, href: '/profile' },
  { label: 'My Tickets', icon: Ticket, href: '/my-tickets' },
  { label: 'Order History', icon: Clock, href: '/orders' },
  { label: 'Favorites', icon: Heart, href: '/favorites' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
  { label: 'Payment Methods', icon: CreditCard, href: '/payment-methods' },
  { label: 'Security', icon: Shield, href: '/security' },
  { label: 'Admin Dashboard', icon: LayoutDashboard, href: '/admin' },
];

export function ProfilePage() {
  const location = useLocation();
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    firstName: 'Damone',
    lastName: 'Bush',
    phone: '3238154883',
    email: 'damonerbush@yahoo.com',
    address: '1234 Sunset Blvd',
    address2: 'Apt 12B',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90028',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const user = {
    name: 'Damone Bush',
    initials: 'DB',
    memberSince: 'January 2024',
    loyaltyPoints: 2480,
    tier: 'Gold',
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl bg-[#0a0e1a] border border-red-600/30 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/40 transition-all";

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <Header />

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#0d1117] border-r border-red-600/10 min-h-[calc(100vh-64px)] sticky top-16">
          <div className="p-6 flex-1">
            <nav className="space-y-1">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-red-600/10 text-red-500 border border-red-600/20'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-red-600/10">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-red-500 hover:bg-red-500/5 transition-all w-full">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Account Details.</h1>
              <p className="text-white/40 text-sm mb-10">Manage your profile, password, and preferences</p>

              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-600 to-red-800 border-[3px] border-red-600/50 flex items-center justify-center shadow-xl shadow-red-600/20">
                    <span className="text-3xl font-black text-white">{user.initials}</span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30 hover:bg-red-700 transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <div className="text-white font-black">{user.name}</div>
                  <div className="text-white/40 text-xs mt-1">Member since {user.memberSince}</div>
                  <div className="flex items-center gap-1.5 mt-2 justify-center">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-black text-yellow-500">{user.tier} Member</span>
                    <span className="text-white/30 text-xs">· {user.loyaltyPoints.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>

              {/* Divider line */}
              <div className="h-px bg-red-600/20 mb-10" />

              {/* General Information */}
              <div className="mb-10">
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-2">General Information</h2>
                <p className="text-white/40 text-xs mb-6 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  A valid billing address is required to receive tickets and process orders.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">First Name</label>
                    <input value={form.firstName} onChange={e => update('firstName', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">Last Name</label>
                    <input value={form.lastName} onChange={e => update('lastName', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">Mobile Number</label>
                    <input value={form.phone} onChange={e => update('phone', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">Email Address</label>
                    <input type="email" value={form.email} onChange={e => update('email', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">Address</label>
                    <input value={form.address} onChange={e => update('address', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">Address 2</label>
                    <input value={form.address2} onChange={e => update('address2', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">City</label>
                    <input value={form.city} onChange={e => update('city', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">State</label>
                    <input value={form.state} onChange={e => update('state', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">Zip Code</label>
                    <input value={form.zip} onChange={e => update('zip', e.target.value)} className={inputClass} />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-red-600 text-white text-sm font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  {saved ? <><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Save className="w-4 h-4" /></motion.div> Saved!</> : 'Update'}
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-red-600/20 mb-10" />

              {/* Password */}
              <div className="mb-10">
                <h2 className="text-xl font-black uppercase tracking-tight text-white mb-6">Password</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="relative">
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">Old Password</label>
                    <input
                      type={showOldPass ? 'text' : 'password'}
                      value={form.oldPassword}
                      onChange={e => update('oldPassword', e.target.value)}
                      placeholder="••••••••••"
                      className={inputClass}
                    />
                    <button
                      onClick={() => setShowOldPass(!showOldPass)}
                      className="absolute right-3 bottom-3.5 text-white/30 hover:text-white"
                    >
                      {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="relative">
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">New Password</label>
                    <input
                      type={showNewPass ? 'text' : 'password'}
                      value={form.newPassword}
                      onChange={e => update('newPassword', e.target.value)}
                      placeholder="••••••••••"
                      className={inputClass}
                    />
                    <button
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute right-3 bottom-3.5 text-white/30 hover:text-white"
                    >
                      {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block font-black">Confirm Password</label>
                    <input
                      type="password"
                      value={form.confirmPassword}
                      onChange={e => update('confirmPassword', e.target.value)}
                      placeholder="••••••••••"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button className="mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-red-600 text-white text-sm font-black uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
                  Update
                </button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}