import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import {
  Search, SlidersHorizontal, MapPin, Calendar, ChevronDown, X, Filter,
  Music, Trophy, Theater, Laugh, Tent, Moon, Briefcase, Palette, Grid3X3,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EventCard } from '../components/EventCard';
import { mockEvents } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';

const categoryFilters = [
  { name: 'All', icon: Grid3X3 },
  { name: 'Concerts', icon: Music },
  { name: 'Sports', icon: Trophy },
  { name: 'Theater', icon: Theater },
  { name: 'Comedy', icon: Laugh },
  { name: 'Festivals', icon: Tent },
  { name: 'Nightlife', icon: Moon },
  { name: 'Conferences', icon: Briefcase },
];

const cities = ['All Cities', 'Los Angeles, CA', 'New York, NY', 'Las Vegas, NV', 'San Francisco, CA', 'Boston, MA', 'Chicago, IL'];
const sortOptions = ['Popular', 'Newest', 'Price: Low to High', 'Price: High to Low', 'Date: Soonest'];

export function EventsListing() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [sortBy, setSortBy] = useState('Popular');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [freeOnly, setFreeOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 9;

  const filtered = useMemo(() => {
    let results = [...mockEvents];
    if (search) results = results.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.venue.toLowerCase().includes(search.toLowerCase()));
    if (activeCategory !== 'All') results = results.filter(e => e.category === activeCategory);
    if (selectedCity !== 'All Cities') results = results.filter(e => e.city === selectedCity);
    if (freeOnly) results = results.filter(e => e.price === 0);
    results = results.filter(e => e.price >= priceRange[0] && e.price <= priceRange[1]);
    if (sortBy === 'Price: Low to High') results.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') results.sort((a, b) => b.price - a.price);
    return results;
  }, [search, activeCategory, selectedCity, sortBy, priceRange, freeOnly]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const FilterPanel = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? '' : 'sticky top-20'}>
      <div className="bg-[#111827] rounded-2xl border border-[#1F2937] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-black text-sm uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-red-500" /> Filters
          </h3>
          {mobile && (
            <button onClick={() => setMobileFilterOpen(false)} className="text-white/40 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* City */}
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">City</label>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#1F2937] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
          >
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Categories */}
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">Category</label>
          <div className="space-y-1">
            {categoryFilters.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => { setActiveCategory(cat.name); setCurrentPage(1); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    activeCategory === cat.name
                      ? 'bg-red-600 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-xs text-white/50 uppercase tracking-wider mb-2 block">
            Price Range: ${priceRange[0]} – ${priceRange[1]}
          </label>
          <input
            type="range"
            min={0}
            max={500}
            value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-red-500"
          />
        </div>

        {/* Free Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Free Events Only</span>
          <button
            onClick={() => setFreeOnly(!freeOnly)}
            className={`w-11 h-6 rounded-full transition-colors ${freeOnly ? 'bg-red-600' : 'bg-[#1F2937]'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition-transform ${freeOnly ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Apply */}
        <button
          onClick={() => { setCurrentPage(1); if (mobile) setMobileFilterOpen(false); }}
          className="w-full py-3 rounded-xl bg-red-600 text-white text-sm font-black uppercase tracking-wider hover:bg-red-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      {/* Page Header */}
      <section className="bg-[#0F172A] border-b border-[#1F2937] py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">All Events</h1>
              <p className="text-white/40 text-sm mt-1">{filtered.length} events found</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search events..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                />
              </div>
              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-[#111827] border border-[#1F2937] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500/30 hidden sm:block"
              >
                {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111827] border border-[#1F2937] text-white/60 text-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <FilterPanel />
          </aside>

          {/* Event Grid */}
          <div className="lg:col-span-3">
            {paginated.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginated.map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.04 }}
                    >
                      <EventCard event={event} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-xl text-sm transition-all ${
                          currentPage === i + 1
                            ? 'bg-red-600 text-white'
                            : 'bg-[#111827] border border-[#1F2937] text-white/50 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/30 text-sm">No events match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setMobileFilterOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-[#0F172A] z-50 p-4 overflow-y-auto lg:hidden"
            >
              <FilterPanel mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
