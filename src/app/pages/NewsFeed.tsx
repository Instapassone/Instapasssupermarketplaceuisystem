import { useState } from 'react';
import { Link } from 'react-router';
import { Calendar, ArrowRight, Tag, Clock, TrendingUp } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { newsItems } from '../data/mockData';
import { motion } from 'motion/react';

const categories = ['All', 'Music', 'Sports', 'Festivals', 'Comedy', 'Platform'];

export function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? newsItems
    : newsItems.filter(n => n.category === activeCategory);

  const featured = newsItems[0];
  const rest = filtered.filter(n => n.id !== featured.id);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">News Feed</h1>
            <p className="text-white/40 text-sm mt-1">Latest updates from the world of live events</p>
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600/10 border border-red-600/20">
            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[11px] text-red-500 font-black uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-[#111827] border border-[#1F2937] text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="group rounded-2xl overflow-hidden bg-[#111827] border border-[#1F2937] hover:border-[#374151] transition-all cursor-pointer">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-2.5 py-1 rounded-lg bg-red-600/10 text-red-500 text-[10px] font-black uppercase tracking-wider">{featured.category}</span>
                  <span className="text-white/30 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.date}</span>
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-4 group-hover:text-red-500 transition-colors">{featured.title}</h2>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-red-500 text-sm font-black uppercase tracking-wider group-hover:gap-3 transition-all">
                  Read More <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rest.map((article, idx) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group rounded-2xl overflow-hidden bg-[#111827] border border-[#1F2937] hover:border-[#374151] transition-all cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-2 py-0.5 rounded-lg bg-red-600/10 text-red-500 text-[9px] font-black uppercase tracking-wider">{article.category}</span>
                  <span className="text-white/30 text-[11px]">{article.date}</span>
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-tight leading-tight mb-2 group-hover:text-red-500 transition-colors line-clamp-2">{article.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed line-clamp-3">{article.excerpt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
