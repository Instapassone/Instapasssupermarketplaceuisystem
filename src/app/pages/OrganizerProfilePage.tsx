import { useParams, Link } from 'react-router';
import {
  MapPin, Calendar, Globe, Users, Star, ExternalLink,
  Shield, CheckCircle, Ticket,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EventCard } from '../components/EventCard';
import { mockEvents } from '../data/mockData';
import { motion } from 'motion/react';

const organizers: Record<string, {
  id: string; name: string; avatar: string; bio: string; location: string;
  website: string; verified: boolean; totalEvents: number; totalSold: number; rating: number;
  bannerGradient: string;
}> = {
  org1: {
    id: 'org1', name: 'Live Nation', avatar: 'LN',
    bio: 'Live Nation Entertainment is the world\'s leading live entertainment company, connecting over 100 million fans across all platforms.',
    location: 'Beverly Hills, CA', website: 'livenation.com', verified: true,
    totalEvents: 342, totalSold: 89400, rating: 4.8,
    bannerGradient: 'from-red-900 via-red-800 to-[#0F172A]',
  },
  org2: {
    id: 'org2', name: 'AEG Presents', avatar: 'AE',
    bio: 'AEG Presents is a world-class live entertainment company operating across five continents with a diverse portfolio of venues.',
    location: 'Los Angeles, CA', website: 'aegpresents.com', verified: true,
    totalEvents: 215, totalSold: 52000, rating: 4.7,
    bannerGradient: 'from-blue-900 via-blue-800 to-[#0F172A]',
  },
  org3: {
    id: 'org3', name: 'Broadway LA', avatar: 'BL',
    bio: 'Bringing the best of Broadway to Los Angeles since 1999. World-class theatrical productions at iconic LA venues.',
    location: 'Hollywood, CA', website: 'broadwayla.com', verified: true,
    totalEvents: 87, totalSold: 34000, rating: 4.9,
    bannerGradient: 'from-amber-900 via-amber-800 to-[#0F172A]',
  },
  org4: {
    id: 'org4', name: 'Goldenvoice', avatar: 'GV',
    bio: 'The promoter behind Coachella, Stagecoach, and hundreds of club shows across Southern California.',
    location: 'Los Angeles, CA', website: 'goldenvoice.com', verified: true,
    totalEvents: 156, totalSold: 425000, rating: 4.9,
    bannerGradient: 'from-emerald-900 via-emerald-800 to-[#0F172A]',
  },
  org5: {
    id: 'org5', name: 'Insomniac Events', avatar: 'IE',
    bio: 'Creating the world\'s most immersive festival and event experiences. Home of EDC and Beyond Wonderland.',
    location: 'Los Angeles, CA', website: 'insomniac.com', verified: true,
    totalEvents: 98, totalSold: 890000, rating: 4.8,
    bannerGradient: 'from-purple-900 via-purple-800 to-[#0F172A]',
  },
  org6: {
    id: 'org6', name: 'TechCrunch', avatar: 'TC',
    bio: 'TechCrunch produces world-class conferences bringing together the best founders, investors, and innovators.',
    location: 'San Francisco, CA', website: 'techcrunch.com', verified: true,
    totalEvents: 24, totalSold: 18000, rating: 4.6,
    bannerGradient: 'from-cyan-900 via-cyan-800 to-[#0F172A]',
  },
};

export function OrganizerProfilePage() {
  const { id } = useParams();
  const org = organizers[id || ''] || organizers.org1;
  const orgEvents = mockEvents.filter(e => e.organizer?.id === org.id);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      {/* Banner */}
      <div className={`relative h-48 sm:h-64 bg-gradient-to-b ${org.bannerGradient}`}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Organizer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-red-600/20 shrink-0">
              {org.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-black uppercase tracking-tight text-white">{org.name}</h1>
                {org.verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-4 max-w-2xl">{org.bio}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {org.location}</span>
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> {org.website}</span>
                <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {org.rating}/5</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#1F2937]">
            <div className="text-center">
              <div className="text-white font-black text-2xl">{org.totalEvents}</div>
              <div className="text-white/40 text-xs uppercase tracking-wider">Events</div>
            </div>
            <div className="text-center">
              <div className="text-white font-black text-2xl">{(org.totalSold / 1000).toFixed(0)}K+</div>
              <div className="text-white/40 text-xs uppercase tracking-wider">Tickets Sold</div>
            </div>
            <div className="text-center">
              <div className="text-white font-black text-2xl flex items-center justify-center gap-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> {org.rating}
              </div>
              <div className="text-white/40 text-xs uppercase tracking-wider">Rating</div>
            </div>
          </div>
        </motion.div>

        {/* Events */}
        <div className="mb-12">
          <h2 className="text-xl font-black uppercase tracking-tight text-white mb-6">
            Events by {org.name}
          </h2>
          {orgEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {orgEvents.map((event, idx) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#111827] rounded-2xl border border-[#1F2937]">
              <Ticket className="w-10 h-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No upcoming events</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
