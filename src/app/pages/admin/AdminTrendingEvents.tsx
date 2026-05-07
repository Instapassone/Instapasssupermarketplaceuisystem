import { AdminSidebar } from '../../components/AdminSidebar';
import { ChevronDown, Plus, Trash2, Eye, EyeOff, Flame, GripVertical, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { mockEvents } from '../../data/mockData';

interface TrendingEvent {
  eventId: string;
  title: string;
  category: string;
  venue: string;
  date: string;
  image: string;
  active: boolean;
  order: number;
  trendScore: number;
}

const initialTrending: TrendingEvent[] = [
  ...mockEvents.slice(0, 4).map((e, i) => ({
    eventId: e.id,
    title: e.title,
    category: e.category,
    venue: e.venue,
    date: e.date,
    image: e.image,
    active: true,
    order: i + 1,
    trendScore: [98, 92, 87, 81][i],
  })),
];

export function AdminTrendingEvents() {
  const [events, setEvents] = useState<TrendingEvent[]>(initialTrending);
  const [showAdd, setShowAdd] = useState(false);

  const toggleActive = (eventId: string) => {
    setEvents(prev => prev.map(e => e.eventId === eventId ? { ...e, active: !e.active } : e));
  };

  const removeEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.eventId !== eventId));
  };

  const availableToAdd = mockEvents.filter(me => !events.find(e => e.eventId === me.id));

  const addEvent = (id: string) => {
    const me = mockEvents.find(e => e.id === id);
    if (!me) return;
    setEvents(prev => [...prev, {
      eventId: me.id,
      title: me.title,
      category: me.category,
      venue: me.venue,
      date: me.date,
      image: me.image,
      active: true,
      order: prev.length + 1,
      trendScore: 50,
    }]);
    setShowAdd(false);
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
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-5 h-5 text-[#E52324]" />
                <h2 className="text-white text-[22px]" style={{ fontWeight: 800 }}>Trending Events</h2>
              </div>
              <p className="text-white/30 text-[12px]">Control which events appear in the "Trending" section on the marketplace. Higher trend score = higher visibility.</p>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E52324] hover:bg-[#d11f20] text-white text-[12px] transition-all"
              style={{ fontWeight: 600 }}
            >
              <Plus className="w-4 h-4" />
              Add Trending
            </button>
          </div>

          {/* Add Event Picker */}
          {showAdd && (
            <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl p-5 mb-6">
              <h3 className="text-white text-[14px] mb-3" style={{ fontWeight: 700 }}>Select Event to Feature</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {availableToAdd.length === 0 ? (
                  <p className="text-[12px] text-white/25 py-4 text-center">All events are already added.</p>
                ) : (
                  availableToAdd.map(me => (
                    <button
                      key={me.id}
                      onClick={() => addEvent(me.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#1a2744]/50 hover:bg-[#1a2744] border border-[#243354]/50 transition-all text-left"
                    >
                      <img src={me.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-white truncate" style={{ fontWeight: 600 }}>{me.title}</div>
                        <div className="text-[10px] text-white/30">{me.category} · {me.venue}</div>
                      </div>
                      <Plus className="w-4 h-4 text-emerald-400 shrink-0" />
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Trending Events Table */}
          <div className="bg-[#0F172A] border border-[#1a2744] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a2744]">
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Rank</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Event</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Category</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Venue</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Trend Score</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Status</th>
                  <th className="text-left px-5 py-3 text-[10px] text-[#E52324] uppercase tracking-widest" style={{ fontWeight: 700 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.eventId} className={`border-b border-[#1a2744]/50 hover:bg-[#1a2744]/30 transition-colors ${!event.active ? 'opacity-40' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-white/15 cursor-grab" />
                        <span className="text-[12px] text-white/40" style={{ fontWeight: 600 }}>#{event.order}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={event.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[12px] text-white truncate max-w-[200px]" style={{ fontWeight: 600 }}>{event.title}</div>
                          <div className="text-[10px] text-white/25">{event.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/15 text-blue-400" style={{ fontWeight: 600 }}>{event.category}</span>
                    </td>
                    <td className="px-5 py-3 text-[11px] text-white/40">{event.venue}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-[#1a2744] overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${event.trendScore}%`,
                              background: event.trendScore >= 80 ? '#E52324' : event.trendScore >= 60 ? '#F59E0B' : '#3B82F6',
                            }}
                          />
                        </div>
                        <span className={`text-[11px] ${
                          event.trendScore >= 80 ? 'text-[#E52324]' : event.trendScore >= 60 ? 'text-amber-400' : 'text-blue-400'
                        }`} style={{ fontWeight: 700 }}>{event.trendScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        event.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/25'
                      }`} style={{ fontWeight: 600 }}>
                        {event.active ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleActive(event.eventId)}
                          className={`w-7 h-7 rounded flex items-center justify-center transition-all ${
                            event.active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/20'
                          }`}
                        >
                          {event.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => removeEvent(event.eventId)}
                          className="w-7 h-7 rounded flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
