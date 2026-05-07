import { AdminSidebar } from '../../components/AdminSidebar';
import { ChevronDown, Plus, Trash2, Eye, EyeOff, GripVertical, Upload, Calendar } from 'lucide-react';
import { useState } from 'react';

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  position: 'hero' | 'mid' | 'bottom';
  active: boolean;
  startDate: string;
  endDate: string;
}

const initialBanners: BannerItem[] = [
  {
    id: 'b1',
    title: 'Summer Music Festival 2026',
    subtitle: 'Early bird tickets on sale now — 40% off',
    image: 'https://images.unsplash.com/photo-1619973226698-b77a5b5dd14b?w=800&q=80',
    link: '/event/1',
    position: 'hero',
    active: true,
    startDate: '2026-02-01',
    endDate: '2026-03-31',
  },
  {
    id: 'b2',
    title: 'NBA Playoffs 2026',
    subtitle: 'Get your playoff tickets before they sell out',
    image: 'https://images.unsplash.com/photo-1762445964939-123200d655ee?w=800&q=80',
    link: '/events',
    position: 'hero',
    active: true,
    startDate: '2026-03-01',
    endDate: '2026-06-30',
  },
  {
    id: 'b3',
    title: 'Refer a Friend — Get $10',
    subtitle: 'Share InstaPass with friends and earn rewards',
    image: '',
    link: '/profile',
    position: 'mid',
    active: false,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
];

const positionLabels: Record<string, string> = {
  hero: 'Hero Section',
  mid: 'Mid-Page',
  bottom: 'Footer Banner',
};

export function AdminBanner() {
  const [banners, setBanners] = useState<BannerItem[]>(initialBanners);
  const [showForm, setShowForm] = useState(false);

  const toggleActive = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#070D1A]" style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}>
      <AdminSidebar />

      <div className="ml-[200px]">
        {/* Top bar */}
        <header className="h-[56px] bg-[#0B1120] border-b border-[#1a2744] flex items-center justify-between px-8 sticky top-0 z-30">
          <h1 className="text-white text-[16px] uppercase tracking-wider" style={{ fontWeight: 700 }}>
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-white/60">Damone Bush</span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E52324] to-[#ff6b6b] flex items-center justify-center">
              <span className="text-[9px] text-white" style={{ fontWeight: 700 }}>DB</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/30" />
          </div>
        </header>

        <div className="p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white text-[22px]" style={{ fontWeight: 800 }}>Banner Management</h2>
              <p className="text-white/30 text-[12px] mt-1">Manage hero banners and promotional sections on the marketplace homepage.</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E52324] hover:bg-[#d11f20] text-white text-[12px] transition-all"
              style={{ fontWeight: 600 }}
            >
              <Plus className="w-4 h-4" />
              Add Banner
            </button>
          </div>

          {/* Add Banner Form */}
          {showForm && (
            <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-6 mb-6">
              <h3 className="text-white text-[14px] mb-4" style={{ fontWeight: 700 }}>New Banner</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Title</label>
                  <input className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white placeholder:text-white/20 outline-none focus:border-[#E52324]/50 transition" placeholder="Banner title..." />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Subtitle</label>
                  <input className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white placeholder:text-white/20 outline-none focus:border-[#E52324]/50 transition" placeholder="Short description..." />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Link URL</label>
                  <input className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white placeholder:text-white/20 outline-none focus:border-[#E52324]/50 transition" placeholder="/event/1 or https://..." />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Position</label>
                  <select className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white outline-none">
                    <option value="hero">Hero Section</option>
                    <option value="mid">Mid-Page</option>
                    <option value="bottom">Footer Banner</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Start Date</label>
                  <input type="date" className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white outline-none" />
                </div>
                <div>
                  <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>End Date</label>
                  <input type="date" className="w-full bg-[#1a2744] border border-[#243354] rounded-lg px-3 py-2.5 text-[12px] text-white outline-none" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-[10px] text-white/30 uppercase tracking-wider block mb-1.5" style={{ fontWeight: 600 }}>Banner Image</label>
                <div className="border-2 border-dashed border-[#243354] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#E52324]/30 transition-colors">
                  <Upload className="w-6 h-6 text-white/20 mb-2" />
                  <span className="text-[11px] text-white/25">Drag & drop or click to upload</span>
                  <span className="text-[10px] text-white/15 mt-1">Recommended: 1920×600px, JPG/PNG</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-lg bg-[#E52324] text-white text-[12px] hover:bg-[#d11f20] transition" style={{ fontWeight: 600 }}>
                  Save Banner
                </button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-[#243354] text-white/40 text-[12px] hover:text-white/60 transition" style={{ fontWeight: 500 }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Banners List */}
          <div className="space-y-3">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-[#0F172A] border border-[#1a2744] rounded-xl overflow-hidden flex">
                {/* Image Preview */}
                <div className="w-[200px] h-[120px] bg-[#1a2744] shrink-0 relative">
                  {banner.image ? (
                    <img src={banner.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[10px] text-white/15">No Image</span>
                    </div>
                  )}
                  {!banner.active && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-[9px] text-white/40 uppercase tracking-wider" style={{ fontWeight: 600 }}>Inactive</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 p-4 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] text-white mb-1" style={{ fontWeight: 700 }}>{banner.title}</div>
                    <div className="text-[11px] text-white/30 mb-2">{banner.subtitle}</div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[9px] bg-blue-500/15 text-blue-400 uppercase tracking-wider" style={{ fontWeight: 600 }}>
                        {positionLabels[banner.position]}
                      </span>
                      <span className="text-[10px] text-white/20 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {banner.startDate} → {banner.endDate}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(banner.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        banner.active
                          ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                          : 'bg-white/5 text-white/20 hover:text-white/40'
                      }`}
                      title={banner.active ? 'Deactivate' : 'Activate'}
                    >
                      {banner.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteBanner(banner.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
