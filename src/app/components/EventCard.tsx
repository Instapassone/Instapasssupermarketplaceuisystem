import { Link } from 'react-router';
import { Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    category: string;
    date: string;
    venue: string;
    city?: string;
    price: number;
    image: string;
    badge?: string;
    badgeColor?: string;
    totalTickets?: number;
    soldTickets?: number;
  };
  variant?: 'default' | 'featured' | 'compact';
}

export function EventCard({ event, variant = 'default' }: EventCardProps) {
  const soldPercent = event.totalTickets && event.soldTickets
    ? Math.round((event.soldTickets / event.totalTickets) * 100)
    : null;
  const almostSoldOut = soldPercent !== null && soldPercent > 90;

  if (variant === 'compact') {
    return (
      <Link to={`/event/${event.id}`}>
        <div className="group flex gap-4 p-3 rounded-xl bg-[#111827] border border-[#1F2937] hover:border-[#374151] transition-all cursor-pointer">
          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] text-red-500 font-black uppercase tracking-wider mb-1">{event.date}</div>
            <h4 className="text-white text-sm font-black uppercase tracking-tight truncate group-hover:text-red-500 transition-colors">{event.title}</h4>
            <div className="flex items-center gap-1 text-white/40 text-[11px] mt-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{event.venue}{event.city ? `, ${event.city}` : ''}</span>
            </div>
            <div className="text-white font-black mt-1">${event.price}</div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link to={`/event/${event.id}`}>
        <motion.div
          whileHover={{ y: -6 }}
          className="group relative rounded-2xl overflow-hidden bg-[#111827] border border-[#1F2937] hover:border-[#374151] shadow-lg hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 cursor-pointer h-full"
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
            {event.badge && (
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white ${event.badgeColor}`}>
                {event.badge}
              </span>
            )}
            {almostSoldOut && (
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white bg-orange-600">
                Almost Sold Out
              </span>
            )}
          </div>
          <div className="p-5">
            <div className="text-[10px] text-red-500 font-black uppercase tracking-wider mb-2">{event.date}</div>
            <h3 className="text-white font-black text-lg uppercase tracking-tight leading-tight mb-2 group-hover:text-red-500 transition-colors line-clamp-2">{event.title}</h3>
            <div className="flex items-center gap-1.5 text-white/40 text-xs mb-4">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{event.venue}{event.city ? `, ${event.city}` : ''}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
              <div>
                <div className="text-[9px] text-white/30 uppercase">From</div>
                <div className="text-white font-black text-xl">${event.price}</div>
              </div>
              <span className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider hover:bg-red-700 transition-colors">
                View Event
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  // Default
  return (
    <Link to={`/event/${event.id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="group relative rounded-2xl overflow-hidden bg-[#111827] border border-[#1F2937] hover:border-[#374151] shadow-sm hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 cursor-pointer h-full"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
          {event.badge && (
            <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-white ${event.badgeColor}`}>
              {event.badge}
            </span>
          )}
          {almostSoldOut && (
            <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider text-white bg-orange-600 animate-pulse">
              Almost Sold Out
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="text-[10px] text-red-500 font-black uppercase tracking-wider mb-1.5">{event.date}</div>
          <h3 className="text-white font-black text-sm uppercase tracking-tight leading-tight mb-1.5 group-hover:text-red-500 transition-colors line-clamp-2 min-h-[2.5rem]">{event.title}</h3>
          <div className="flex items-center gap-1 text-white/40 text-[11px] mb-4">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{event.venue}{event.city ? `, ${event.city}` : ''}</span>
          </div>

          {/* Availability bar */}
          {soldPercent !== null && (
            <div className="mb-3">
              <div className="h-1 rounded-full bg-[#1F2937] overflow-hidden">
                <div className={`h-full rounded-full transition-all ${almostSoldOut ? 'bg-orange-500' : 'bg-red-600'}`} style={{ width: `${soldPercent}%` }} />
              </div>
              <div className="text-[9px] text-white/30 mt-1">{soldPercent}% sold</div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] text-white/30 uppercase">From</div>
              <div className="text-white font-black text-lg">${event.price}</div>
            </div>
            <span className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-[11px] font-black uppercase tracking-wider hover:bg-red-700 transition-colors">
              Get Tickets
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
