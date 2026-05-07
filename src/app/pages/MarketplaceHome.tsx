import {
  Search, Check, Music, Trophy, Laugh, Ticket, Flame, Sparkles,
  MapPin, Zap, BarChart3, DollarSign, Megaphone,
  TrendingUp, ArrowRight,
  Shield, CalendarDays, Star, Users, Heart,
  Play, X, Headphones,
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HeroSlider } from '../components/HeroSlider';
import { AIChatWidget } from '../components/AIChatWidget';
import { mockEvents, trustBadges } from '../data/mockData';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router';
import { PartnerScroller } from '../components/PartnerScroller';

import { ShopifyMerchPreview } from '../components/ShopifyMerchPreview';
import { HeroSubscribe } from '../components/HeroSubscribe';
import { PacManQR } from '../components/PacManQR';
import {
  encodeData, type PatternId, type CornerId,
} from '../components/qr-engine';

import {
  renderBrandedFrame, getQRInnerPaths, FRAME_OPTIONS,
  type BrandedFrameConfig,
} from '../components/qr-branded-frames';

import travisScottImg from 'figma:asset/0007f1441ca0e276ff2af2685f5b27f41eb4a831.png';
import dojaCatImg from 'figma:asset/b75b95dd29f422a11bb49b20322a557a2c91e87b.png';
import coldplayImg from 'figma:asset/8b22b98cf52f2d356a2b47465a00698aa5188841.png';
import skrillexImg from 'figma:asset/8af993549a463985010b06a88b597750457d0752.png';
import weekndImg from 'figma:asset/d38ab30e69682b18c620549b646f6b3b867ae04e.png';
import morganWallenImg from 'figma:asset/a5db1b3f7a464a37c058741378d3a13a209eae2d.png';
import lakersImg from 'figma:asset/e6d173f3230ed44404408c60bbac53d73822390c.png';
import cowboysImg from 'figma:asset/9ad7b1afb0db257bddc3cf01927f07835627ee88.png';
import lafcImg from 'figma:asset/0540241e4e905add8474939ede875bec3f618d08.png';
import yankeesImg from 'figma:asset/bcf8aa584f36c1582bc810df891e9b01f6096ce8.png';
import dodgersImg from 'figma:asset/21c9aea7a6d4e24d127b3880293bbe03486d2e27.png';
import knicksImg from 'figma:asset/0b07f32eff41f0e345c616030f59e83a527ad2e6.png';

/* ─── Hot Events Data (8 cards with gradient backgrounds) ─── */
const hotEvents = [
  { id: 'hot-1', title: 'Neon Nights Festival', date: 'Mar 15, 2026', venue: 'Staples Center, LA', price: 89, gradient: 'from-pink-600 to-purple-700', badge: 'Selling Fast', badgeColor: 'bg-red-500', icon: Music, image: 'https://images.unsplash.com/photo-1629276300230-34853d96aa2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwZmVzdGl2YWwlMjBuZW9uJTIwbGlnaHRzJTIwc3RhZ2V8ZW58MXx8fHwxNzcyMTAxMDkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Music' },
  { id: 'hot-2', title: 'Lakers vs Celtics', date: 'Mar 22, 2026', venue: 'Crypto.com Arena, LA', price: 145, gradient: 'from-yellow-500 to-orange-600', badge: 'Hot', badgeColor: 'bg-orange-500', icon: Trophy, image: 'https://images.unsplash.com/photo-1771882856158-c8e083134ee3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZ2FtZSUyME5CQSUyMGFyZW5hJTIwY3Jvd2R8ZW58MXx8fHwxNzcyMTAxMDk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Sports' },
  { id: 'hot-3', title: 'Kevin Hart Live', date: 'Apr 2, 2026', venue: 'Hollywood Bowl, LA', price: 65, gradient: 'from-emerald-500 to-teal-600', badge: null, badgeColor: '', icon: Laugh, image: 'https://images.unsplash.com/photo-1641903806973-17eaf2d2634f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZGlhbiUyMHN0YW5kdXAlMjBjb21lZHklMjBzdGFnZSUyMHNwb3RsaWdodHxlbnwxfHx8fDE3NzIxMDEwOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Comedy' },
  { id: 'hot-4', title: 'EDC Las Vegas 2026', date: 'May 16-18, 2026', venue: 'Las Vegas Speedway', price: 349, gradient: 'from-blue-600 to-indigo-700', badge: 'Limited', badgeColor: 'bg-blue-500', icon: Sparkles, image: 'https://images.unsplash.com/photo-1660634061919-a9e2e00ba19b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFRE0lMjBlbGVjdHJvbmljJTIwbXVzaWMlMjBmZXN0aXZhbCUyMGxhc2Vyc3xlbnwxfHx8fDE3NzIxMDEwOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Festival' },
  { id: 'hot-5', title: 'Rolling Loud Miami', date: 'Jul 10-12, 2026', venue: 'Hard Rock Stadium', price: 299, gradient: 'from-red-600 to-rose-700', badge: 'New', badgeColor: 'bg-green-500', icon: Music, image: 'https://images.unsplash.com/photo-1761381629127-636954e37215?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXAlMjBob3AlMjByYXAlMjBjb25jZXJ0JTIwY3Jvd2QlMjBlbmVyZ3l8ZW58MXx8fHwxNzcyMTAxMDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Music' },
  { id: 'hot-6', title: 'UFC 310', date: 'Mar 29, 2026', venue: 'T-Mobile Arena, LV', price: 199, gradient: 'from-slate-600 to-zinc-700', badge: 'VIP Avail', badgeColor: 'bg-purple-500', icon: Trophy, image: 'https://images.unsplash.com/photo-1620123449238-abaeff62d48d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxVRkMlMjBNTUElMjBib3hpbmclMjByaW5nJTIwZmlnaHR8ZW58MXx8fHwxNzcyMTAxMDk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Sports' },
  { id: 'hot-7', title: 'Dave Chappelle', date: 'Apr 18, 2026', venue: 'The Forum, LA', price: 120, gradient: 'from-amber-500 to-yellow-600', badge: null, badgeColor: '', icon: Laugh, image: 'https://images.unsplash.com/photo-1580188928585-0ef5c1a5c4dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFuZHVwJTIwY29tZWR5JTIwc2hvdyUyMGF1ZGllbmNlJTIwbGF1Z2hpbmd8ZW58MXx8fHwxNzcyMTAxMDk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Comedy' },
  { id: 'hot-8', title: 'Coachella Weekend 1', date: 'Apr 10-12, 2026', venue: 'Empire Polo Club', price: 499, gradient: 'from-violet-600 to-fuchsia-600', badge: 'Sold Out', badgeColor: 'bg-red-600', icon: Sparkles, image: 'https://images.unsplash.com/photo-1561577862-49a301dda61b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGZlc3RpdmFsJTIwb3V0ZG9vciUyMGNyb3dkJTIwc3Vuc2V0fGVufDF8fHx8MTc3MjEwMTA5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', category: 'Festival' },
];

/* ─── Trending Events Data (6 image cards) ─── */
const trendingEvents = [
  { id: 'trend-1', title: 'Summer Sounds Festival', date: 'Jun 20, 2026', venue: 'Griffith Park, LA', price: 125, image: 'https://images.unsplash.com/photo-1656283384430-73d69535101f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBsaXZlJTIwbXVzaWN8ZW58MXx8fHwxNzcyMDQyMDI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', badge: 'Trending', badgeColor: 'bg-[#E52324]' },
  { id: 'trend-2', title: 'Comedy All-Stars Tour', date: 'May 5, 2026', venue: 'The Improv, Hollywood', price: 55, image: 'https://images.unsplash.com/photo-1641903806973-17eaf2d2634f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBzaG93JTIwY3N0YWcxlMjBzcG90bGlnaHR8ZW58MXx8fHwxNzcyMDkzNDU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', badge: 'New', badgeColor: 'bg-emerald-500' },
  { id: 'trend-3', title: 'Championship Finals', date: 'Apr 28, 2026', venue: 'SoFi Stadium, LA', price: 210, image: 'https://images.unsplash.com/photo-1638569795530-d617985ed7b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwZ2FtZSUyMGFyZW5hJTIwc3BvcnRzfGVufDF8fHx8MTc3MjAwMDkyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', badge: 'Hot', badgeColor: 'bg-orange-500' },
  { id: 'trend-4', title: 'Electric Pulse Rave', date: 'Jul 4, 2026', venue: 'Warehouse District, DTLA', price: 75, image: 'https://images.unsplash.com/photo-1624929303661-22c5bce0169b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJvbmljJTIwbXVzaWMlMjBESiUyMGZlc3RpdmFsJTIwc3RhZ2V8ZW58MXx8fHwxNzcyMDk4MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', badge: 'Selling Fast', badgeColor: 'bg-red-500' },
  { id: 'trend-5', title: 'Broadway Revival: Hamilton', date: 'Aug 12, 2026', venue: 'Pantages Theatre, LA', price: 185, image: 'https://images.unsplash.com/photo-1767979400753-68241ee99633?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVhdGVyJTIwYnJvYWR3YXklMjBwZXJmb3JtYW5jZSUyMHN0YWdlfGVufDF8fHx8MTc3MjA5ODE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', badge: 'Premium', badgeColor: 'bg-purple-500' },
  { id: 'trend-6', title: 'World Cup Qualifier', date: 'Sep 8, 2026', venue: 'Rose Bowl, Pasadena', price: 95, image: 'https://images.unsplash.com/photo-1549923015-badf41b04831?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmb290YmFsbCUyMHN0YWRpdW0lMjBtYXRjaCUyMGNyb3dkfGVufDF8fHx8MTc3MjAyOTk1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', badge: 'Limited', badgeColor: 'bg-blue-500' },
];

/* ─── Top Artists Data ─── */
const topArtists = [
  { id: 'artist-1', name: 'The Weeknd', genre: 'R&B / Pop', events: 12, price: 95, image: weekndImg, spotifyTrackId: '0VjIjW4GlUZAMYd2vXMi4' },
  { id: 'artist-2', name: 'Doja Cat', genre: 'Pop / Rap', events: 8, price: 85, image: dojaCatImg, spotifyTrackId: '3LtpKP5abr2qqjunvjlX5i' },
  { id: 'artist-3', name: 'Travis Scott', genre: 'Hip Hop', events: 6, price: 120, image: travisScottImg, spotifyTrackId: '0RiRZpuVRbi7oqRd02mvnB' },
  { id: 'artist-4', name: 'Coldplay', genre: 'Rock / Alt', events: 10, price: 110, image: coldplayImg, spotifyTrackId: '1mea3bSkSGXuIRvnydlB5b' },
  { id: 'artist-5', name: 'Morgan Wallen', genre: 'Country', events: 14, price: 75, image: morganWallenImg, spotifyTrackId: '4S7YHmlWwfwArgaZnMdVJQ' },
  { id: 'artist-6', name: 'Skrillex', genre: 'EDM', events: 9, price: 65, image: skrillexImg, spotifyTrackId: '5HCvJnOsLuDIEjGKFrfnCt' },
];

/* ─── Top Teams Data ─── */
const topTeams = [
  { id: 'team-1', name: 'Los Angeles Lakers', league: 'NBA', nextGame: 'Mar 28, 2026', price: 145, image: lakersImg },
  { id: 'team-2', name: 'Dallas Cowboys', league: 'NFL', nextGame: 'Sep 12, 2026', price: 185, image: cowboysImg },
  { id: 'team-3', name: 'LAFC', league: 'MLS', nextGame: 'Apr 5, 2026', price: 95, image: lafcImg },
  { id: 'team-4', name: 'New York Yankees', league: 'MLB', nextGame: 'Apr 1, 2026', price: 75, image: yankeesImg },
  { id: 'team-5', name: 'LA Dodgers', league: 'MLB', nextGame: 'Mar 30, 2026', price: 110, image: dodgersImg },
  { id: 'team-6', name: 'NY Knicks', league: 'NBA', nextGame: 'Mar 28, 2026', price: 130, image: knicksImg },
];

/* ─── Community Events Data ─── */
const communityEvents = [
  { id: 'comm-1', title: 'LA Charity Gala 2026', date: 'Apr 15, 2026', venue: 'Beverly Hilton', price: 50, badge: 'Fundraiser', badgeColor: 'bg-emerald-500', image: 'https://images.unsplash.com/photo-1769867628840-0aae1c912a77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjaGFyaXR5JTIwZnVuZHJhaXNlciUyMGV2ZW50fGVufDF8fHx8MTc3MjEzMjc5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: 'comm-2', title: 'Smorgasburg Food Festival', date: 'May 3, 2026', venue: 'ROW DTLA', price: 15, badge: 'Food & Drink', badgeColor: 'bg-blue-500', image: 'https://images.unsplash.com/photo-1760039756604-fb028be464bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZm9vZCUyMGZlc3RpdmFsJTIwbWFya2V0fGVufDF8fHx8MTc3MjEzMjc5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: 'comm-3', title: 'DTLA Art Walk', date: 'Mar 20, 2026', venue: 'Arts District, DTLA', price: 0, badge: 'Free', badgeColor: 'bg-purple-500', image: 'https://images.unsplash.com/photo-1596649300028-340ad0ec6146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwb3BlbmluZyUyMG5pZ2h0JTIwY3Jvd2R8ZW58MXx8fHwxNzcyMTMyODAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: 'comm-4', title: 'Highland Park Block Party', date: 'Jun 7, 2026', venue: 'York Blvd, LA', price: 0, badge: 'Local', badgeColor: 'bg-amber-500', image: 'https://images.unsplash.com/photo-1763731374189-c86c0592e6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmZXN0aXZhbCUyMGNlbGVicmF0aW9uJTIwY29tbXVuaXR5fGVufDF8fHx8MTc3MjEzMjgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: 'comm-5', title: 'Sunset Yoga in the Park', date: 'Every Sat, 2026', venue: 'Griffith Park', price: 10, badge: 'Wellness', badgeColor: 'bg-teal-500', image: 'https://images.unsplash.com/photo-1758274538046-ef5f8f6c9ba0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwd2VsbG5lc3MlMjBvdXRkb29yJTIwY2xhc3N8ZW58MXx8fHwxNzcyMTMyNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { id: 'comm-6', title: 'LA Marathon 5K Fun Run', date: 'Mar 15, 2026', venue: 'Dodger Stadium', price: 35, badge: 'Sports', badgeColor: 'bg-orange-500', image: 'https://images.unsplash.com/photo-1633458585088-4ca49c07e78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHw1SyUyMG1hcmF0aG9uJTIwcnVubmluZyUyMHJhY2V8ZW58MXx8fHwxNzcyMTMyNzk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
];

/* ─── Organizer Features ─── */
const organizerFeatures = [
  { icon: CalendarDays, title: 'Event Builder', desc: 'Create multi-day, multi-tier events in minutes', color: 'text-[#E52324]', bg: 'bg-[#E52324]/10' },
  { icon: Ticket, title: 'Smart Ticketing', desc: 'Dynamic pricing, promo codes, and group bundles', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: BarChart3, title: 'Live Analytics', desc: 'Real-time dashboards for sales and attendance', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { icon: Megaphone, title: 'Marketing Suite', desc: 'Email blasts, social sharing, and affiliate links', color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { icon: DollarSign, title: 'Fast Payouts', desc: 'Get paid within 48 hours after your event', color: 'text-green-400', bg: 'bg-green-400/10' },
  { icon: Shield, title: 'Fraud Protection', desc: 'AI-powered ticket verification and anti-scalping', color: 'text-purple-400', bg: 'bg-purple-400/10' },
];

/* ─── QR Studio Section Data ─── */
const QR_SHOWCASE_CODES: { label: string; dest: string; fg: string; bg: string; pattern: PatternId; corner: CornerId; category: string; shape: 'square' | 'circle'; accent: string; gradient: string; logo: string; logoBg: string }[] = [
  { label: "Apple",             dest: "https://apple.com",            fg: "#000000", bg: "#FFFFFF", pattern: "square",    corner: "sharp",    category: "Technology",   shape: "square", accent: "#A2AAAD", gradient: "from-slate-800 to-gray-700/60",    logo: "⌘",  logoBg: "#000000" },
  { label: "McDonald's",        dest: "https://mcdonalds.com",        fg: "#DA291C", bg: "#FFC72C", pattern: "square",    corner: "sharp",    category: "Food & Bev",   shape: "square", accent: "#FFC72C", gradient: "from-yellow-950 to-amber-900/60",  logo: "M",  logoBg: "#DA291C" },
  { label: "Starbucks",         dest: "https://starbucks.com",        fg: "#00704A", bg: "#FFFFFF", pattern: "dots",      corner: "rounded",  category: "Coffee",       shape: "circle", accent: "#00704A", gradient: "from-emerald-950 to-green-900/60", logo: "SB", logoBg: "#00704A" },
  { label: "TikTok",            dest: "https://tiktok.com",           fg: "#00F2EA", bg: "#010101", pattern: "dots",      corner: "bullseye", category: "Social",       shape: "square", accent: "#00F2EA", gradient: "from-cyan-950 to-teal-900/60",    logo: "TT", logoBg: "#000000" },
  { label: "YouTube",           dest: "https://youtube.com",          fg: "#FF0000", bg: "#FFFFFF", pattern: "rounded",   corner: "bullseye", category: "Video",        shape: "square", accent: "#FF0000", gradient: "from-red-950 to-rose-900/60",     logo: "▶",  logoBg: "#FF0000" },
  { label: "Burger King",       dest: "https://bk.com",               fg: "#D62300", bg: "#F5EBDC", pattern: "square",    corner: "sharp",    category: "Food & Bev",   shape: "square", accent: "#F5A623", gradient: "from-orange-950 to-amber-900/60",  logo: "BK", logoBg: "#D62300" },
  { label: "Nike",              dest: "https://nike.com",             fg: "#111111", bg: "#FFFFFF", pattern: "diamond",   corner: "sharp",    category: "Sportswear",   shape: "square", accent: "#111111", gradient: "from-zinc-900 to-neutral-800/60",  logo: "✓",  logoBg: "#111111" },
  { label: "Spotify",           dest: "https://spotify.com",          fg: "#1DB954", bg: "#191414", pattern: "dots",      corner: "rounded",  category: "Music",        shape: "circle", accent: "#1DB954", gradient: "from-green-950 to-emerald-900/60", logo: "♫",  logoBg: "#1DB954" },
  { label: "DHL",               dest: "https://dhl.com",              fg: "#D40511", bg: "#FFCC00", pattern: "square",    corner: "sharp",    category: "Logistics",    shape: "square", accent: "#FFCC00", gradient: "from-yellow-950 to-red-900/60",    logo: "DHL",logoBg: "#D40511" },
  { label: "Coca-Cola",         dest: "https://coca-cola.com",        fg: "#F40009", bg: "#FFFFFF", pattern: "rounded",   corner: "rounded",  category: "Beverage",     shape: "circle", accent: "#F40009", gradient: "from-red-950 to-red-900/60",      logo: "CC", logoBg: "#F40009" },
  { label: "Netflix",           dest: "https://netflix.com",          fg: "#E50914", bg: "#141414", pattern: "rounded",   corner: "bullseye", category: "Streaming",    shape: "square", accent: "#E50914", gradient: "from-red-950 to-zinc-900/60",     logo: "N",  logoBg: "#E50914" },
  { label: "Amazon",            dest: "https://amazon.com",           fg: "#FF9900", bg: "#232F3E", pattern: "instapass", corner: "rounded",  category: "E-Commerce",   shape: "square", accent: "#FF9900", gradient: "from-orange-950 to-amber-900/60",  logo: "a→", logoBg: "#FF9900" },
  { label: "Amex",              dest: "https://americanexpress.com",  fg: "#006FCF", bg: "#FFFFFF", pattern: "square",    corner: "sharp",    category: "Finance",      shape: "square", accent: "#006FCF", gradient: "from-blue-950 to-indigo-900/60",   logo: "AX", logoBg: "#006FCF" },
  { label: "InstaPass",         dest: "https://instapass.ai",         fg: "#E52324", bg: "#FFFFFF", pattern: "instapass", corner: "bullseye", category: "Events",       shape: "circle", accent: "#E52324", gradient: "from-red-950 to-red-900/60",      logo: "IP", logoBg: "#E52324" },
];



/* ─── Branded Frames Row (5 frame types) ─── */
const BRANDED_FRAMES_DATA = [
  { frameId: "ring-red" as const, fg: "#E52324", pattern: "instapass" as PatternId, corner: "bullseye" as CornerId, cta: "SCAN TO UNLOCK EXCLUSIVE CONTENT" },
  { frameId: "ring-cyan" as const, fg: "#00D9FF", pattern: "dots" as PatternId, corner: "rounded" as CornerId, cta: "SCAN FOR EVENT ACCESS" },
  { frameId: "badge-vip" as const, fg: "#8B5CF6", pattern: "rounded" as PatternId, corner: "bullseye" as CornerId, cta: "VIP ENTRY" },
  { frameId: "badge-gold" as const, fg: "#D4A017", pattern: "dots" as PatternId, corner: "rounded" as CornerId, cta: "SCAN TO SHOP" },
  { frameId: "badge-purple" as const, fg: "#6D28D9", pattern: "rounded" as PatternId, corner: "bullseye" as CornerId, cta: "SCAN TO UNLOCK CONTENT" },
];

function BrandedFramesRow() {
  const data = encodeData("https://instapass.ai");
  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {BRANDED_FRAMES_DATA.map((item) => {
        const frame = FRAME_OPTIONS.find((f) => f.id === item.frameId)!;
        const { paths, totalSize } = getQRInnerPaths(data.modules, data.size, item.fg, "#FFFFFF", item.pattern, item.corner, true, 2);
        const svg = renderBrandedFrame(paths, 480, totalSize, {
          frameId: item.frameId,
          ctaText: item.cta,
          watermarkText: "INSTAPASS",
          borderColor: frame.borderColor,
          accentColor: frame.accentColor,
        }, "#FFFFFF");
        return (
          <motion.div
            key={item.frameId}
            whileHover={{ scale: 1.06, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group cursor-pointer"
          >
            <div className="rounded-xl overflow-hidden bg-black/40 border border-white/[0.06] group-hover:border-white/[0.15] transition-all p-1.5 sm:p-2">
              <div
                dangerouslySetInnerHTML={{ __html: svg }}
                className="w-full aspect-square [&_svg]:w-full [&_svg]:h-full"
              />
            </div>
            <div className="text-center mt-1.5">
              <span className="text-[9px] sm:text-[10px] text-white/40" style={{ fontWeight: 600 }}>{frame.label}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Frame cycle order for scroller ─── */
const SCROLLER_FRAME_CYCLE: { frameId: "ring-red" | "ring-cyan" | "badge-vip" | "badge-gold" | "badge-purple"; cta: string }[] = [
  { frameId: "ring-red",     cta: "SCAN NOW" },
  { frameId: "ring-cyan",    cta: "SCAN TO ACCESS" },
  { frameId: "badge-vip",    cta: "VIP ENTRY" },
  { frameId: "badge-gold",   cta: "SCAN TO SHOP" },
  { frameId: "badge-purple", cta: "SCAN TO UNLOCK" },
];

/* ─── QR Code Scroller (auto-scroll showcase with branded frames) ─── */
function QRShowcaseScroller() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let frame: number;
    let pos = 0;
    const speed = 0.6;
    const animate = () => {
      if (!isHovered) {
        pos += speed;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isHovered]);

  const items = [...QR_SHOWCASE_CODES, ...QR_SHOWCASE_CODES];

  return (
    <div className="relative">
      {/* Dark glassmorphism bar */}
      <div
        className="relative rounded-2xl border border-[#E52324]/20 bg-[#0a0a0a]/90 backdrop-blur-xl overflow-hidden shadow-2xl"
        style={{ boxShadow: '0 8px 40px rgba(229,35,36,0.08), inset 0 1px 0 rgba(255,255,255,0.04)' }}
      >
        {/* Subtle red glow at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#E52324]/[0.06] to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#E52324]/[0.06] to-transparent pointer-events-none z-10" />

        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-5 overflow-hidden px-5 py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {items.map((code, i) => {
            const frameCfg = SCROLLER_FRAME_CYCLE[i % SCROLLER_FRAME_CYCLE.length];
            const frameOpt = FRAME_OPTIONS.find((f) => f.id === frameCfg.frameId)!;
            const data = encodeData(code.dest);
            const { paths, totalSize } = getQRInnerPaths(data.modules, data.size, code.fg, code.bg, code.pattern, code.corner, true, 2);
            const svg = renderBrandedFrame(paths, 480, totalSize, {
              frameId: frameCfg.frameId,
              ctaText: `${frameCfg.cta} — ${code.label.toUpperCase()}`,
              watermarkText: code.label.toUpperCase(),
              borderColor: frameOpt.borderColor,
              accentColor: frameOpt.accentColor,
            }, code.bg);

            return (
              <motion.div
                key={`${code.label}-${i}`}
                className="shrink-0 group cursor-pointer"
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative">
                  {/* Accent glow ring */}
                  <div
                    className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: `0 0 20px ${code.accent}30, 0 0 40px ${code.accent}15`, transform: 'scale(1.05)' }}
                  />
                  {/* Branded frame QR */}
                  <div
                    className="w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-xl overflow-hidden transition-all duration-300 ring-2 ring-transparent group-hover:ring-current"
                    style={{ color: code.accent }}
                  >
                    <div
                      dangerouslySetInnerHTML={{ __html: svg }}
                      className="w-full h-full [&_svg]:w-full [&_svg]:h-full"
                    />
                  </div>

                  {/* Brand category badge */}
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div
                      className="px-2.5 py-1 rounded-lg backdrop-blur-md border whitespace-nowrap"
                      style={{ backgroundColor: `${code.accent}18`, borderColor: `${code.accent}30` }}
                    >
                      <div className="text-[9px] text-center" style={{ fontWeight: 700, color: code.accent }}>{code.label}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MarketplaceHome() {
  const [zipCode, setZipCode] = useState('');
  const [activeArtist, setActiveArtist] = useState<string | null>(null);

  /* Hero QR data — used by BrandedFramesRow in Section 7 */

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <Header />

      {/* ============ HERO SLIDER (Full Width, Edge to Edge) ============ */}
      <HeroSlider />

      {/* ════════════════════════════════════════════════════════
          GUARANTEE BADGE — Clean divider between Hero & Tap Player
          ════════════════════════════════════════════════════════ */}
      <section className="bg-[#0a0a0a]">
        <div className="border-y border-white/[0.06] py-4">
          <div className="flex items-center justify-center gap-3">
            <div className="hidden sm:block w-16 h-px bg-gradient-to-r from-transparent to-white/10" />
            <div className="flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-[#00C853]" strokeWidth={1.8} />
              <span className="text-[12px] text-white/50 tracking-wide" style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontWeight: 500 }}>
                Every Ticket <span className="text-white/80" style={{ fontWeight: 700 }}>100% Guaranteed</span>
              </span>
            </div>
            <div className="hidden sm:block w-16 h-px bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO (with AI Chat Widget)
          ════════════════════════════════════════════════════════ */}
      <section className="relative bg-black overflow-hidden py-20 lg:py-28">
        {/* Subtle ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#E52324]/[0.04] rounded-full blur-[160px] pointer-events-none" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Email Subscribe */}
              <div className="mb-12">
                <HeroSubscribe />
              </div>

              {/* Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/10 border border-[#E52324]/15 mb-8">
                <Zap className="w-3.5 h-3.5 text-[#E52324]" />
                <span className="text-[11px] tracking-[0.15em] uppercase text-[#E52324] font-black">
                  Instant Ticket Delivery
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.92] tracking-tight text-white mb-6">
                THE{' '}
                <span className="text-[#E52324]">FASTEST</span>
                <br />
                WAY TO GET
                <br />
                TICKETS.
              </h1>

              {/* Subline */}
              <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-10 max-w-lg">
                Instant checkout. 100% guaranteed.
              </p>

              {/* Search bar */}
              <div className="flex gap-2 max-w-xl mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search artists, teams, venues..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#E52324]/30 focus:border-[#E52324]/30 transition-all"
                  />
                </div>
                <button className="px-7 py-3.5 rounded-2xl bg-[#E52324] text-white text-sm font-black uppercase tracking-wider hover:bg-[#c91f20] transition-colors shadow-lg shadow-[#E52324]/20 whitespace-nowrap">
                  Find Tickets
                </button>
              </div>
            </motion.div>

            {/* Right — AI Chat Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="h-[540px]"
            >
              <AIChatWidget />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 2 — HOT EVENTS (4-column gradient cards)
          ════════════════════════════════════════════════════════ */}
      <section className="bg-black py-20 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* ─── Hot Events Near You ─── */}
          <div className="flex items-center justify-between mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight flex items-center gap-3"
            >
              <Flame className="w-6 h-6 text-[#E52324]" /> Hot Events Near You
            </motion.h2>

            <div className="flex items-center gap-3">
              {/* Zip Code Input */}
              <div className="flex items-center bg-white/[0.06] border border-white/[0.10] rounded-xl overflow-hidden">
                <div className="flex items-center gap-1.5 pl-3 pr-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E52324]" strokeWidth={2} />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  placeholder="Zip Code"
                  value={zipCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                    setZipCode(val);
                  }}
                  className="bg-transparent text-[13px] text-white placeholder:text-white/30 outline-none w-[72px] py-2 pr-1"
                  style={{ fontFamily: "'Outfit', 'Inter', sans-serif" }}
                />
                {zipCode && (
                  <button
                    onClick={() => setZipCode('')}
                    className="pr-2.5 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                )}
              </div>

              <Link to="/events" className="text-[#E52324] text-sm font-black uppercase tracking-wider hover:underline">
                See all →
              </Link>
            </div>
          </div>

          {/* ─── 4-column gradient cards grid ─── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-16">
            {hotEvents.map((event, idx) => {
              return (
                <Link key={event.id} to={`/event/${event.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.04 }}
                    className="relative rounded-2xl overflow-hidden cursor-pointer group bg-[#111] border border-white/[0.08] hover:border-white/15 transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                      {/* Badge */}
                      {event.badge && (
                        <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider text-white ${event.badgeColor} shadow-lg`}>
                          {event.badge}
                        </span>
                      )}

                      {/* Category pill */}
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider text-white/80 bg-black/40 backdrop-blur-sm border border-white/10">
                        {event.category}
                      </span>

                      {/* Price overlay bottom-left */}
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="text-white text-[18px] sm:text-[22px] font-black drop-shadow-lg">${event.price}</span>
                        <span className="text-white/50 text-[9px] ml-1">+</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3 sm:p-3.5">
                      <h3 className="text-white text-[12px] sm:text-[13px] font-black uppercase leading-tight tracking-tight mb-1.5 line-clamp-1 group-hover:text-[#E52324] transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-1 text-white/35 text-[10px] mb-1">
                        <CalendarDays className="w-3 h-3 shrink-0 text-white/25" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/35 text-[10px]">
                        <MapPin className="w-3 h-3 shrink-0 text-white/25" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* ─── Section Breaker ─── */}
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-2 px-4">
              <TrendingUp className="w-4 h-4 text-[#E52324]" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">What's Trending</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ─── Trending Events (image cards) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingEvents.map((event, idx) => (
              <Link key={event.id} to={`/event/${event.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className="group bg-[#111] rounded-2xl overflow-hidden border border-white/10 shadow-sm hover:shadow-xl hover:shadow-white/5 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {event.badge && (
                      <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-white ${event.badgeColor}`}>
                        {event.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-[11px] text-white/50 uppercase tracking-wider mb-1">
                      {event.date}
                    </div>
                    <h3 className="text-white font-black uppercase text-sm tracking-tight mb-1 group-hover:text-[#E52324] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1 text-white/40 text-[11px] mb-3">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white text-xl font-black">${event.price}</span>
                      <span className="px-4 py-1.5 rounded-xl bg-[#E52324] text-white text-xs font-black uppercase tracking-wider hover:bg-[#c91f20] transition-colors">
                        Get Tickets
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* ─── Top Artists Breaker ─── */}
          <div className="flex items-center gap-4 mt-16 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-2 px-4">
              <Star className="w-4 h-4 text-[#E52324]" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Top Artists</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ─── Top Artists Header ─── */}
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-3"
            >
              <Music className="w-5 h-5 text-[#E52324]" /> Artist Spotlight
            </motion.h2>
            <Link to="/events" className="text-[#E52324] text-sm font-black uppercase tracking-wider hover:underline">
              See all →
            </Link>
          </div>

          {/* ─── Top Artists Cards with Spotify Player ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {topArtists.map((artist, idx) => {
              const isActive = activeArtist === artist.id;
              return (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group cursor-pointer"
                  whileHover={{ y: -6 }}
                >
                  {/* Circular artist image */}
                  <div
                    className={`relative w-full aspect-square rounded-full overflow-hidden mb-3 ring-2 transition-all duration-300 ${isActive ? 'ring-[#E52324] shadow-lg shadow-[#E52324]/20' : 'ring-white/10 group-hover:ring-[#E52324]/50'}`}
                    onClick={() => setActiveArtist(isActive ? null : artist.id)}
                  >
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Play / Active overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${isActive ? 'bg-[#E52324] scale-100' : 'bg-black/50 scale-90 group-hover:scale-100'}`}>
                        {isActive ? (
                          <Headphones className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                        )}
                      </div>
                    </div>

                    {/* Events count badge */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <span className="px-2 py-0.5 rounded-full bg-[#E52324] text-white text-[8px] font-black uppercase tracking-wider shadow-lg">
                        {artist.events} Events
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3
                      className={`text-[12px] sm:text-[13px] font-black uppercase tracking-tight mb-0.5 transition-colors line-clamp-1 ${isActive ? 'text-[#E52324]' : 'text-white group-hover:text-[#E52324]'}`}
                    >
                      {artist.name}
                    </h3>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">{artist.genre}</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-white/50 text-[11px]">From <span className="text-white font-black">${artist.price}</span></span>
                      <Link to="/events" className="text-[#E52324] text-[10px] font-black uppercase hover:underline" onClick={(e) => e.stopPropagation()}>
                        Tickets
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─── Spotify Embed Player ─── */}
          <AnimatePresence>
            {activeArtist && (() => {
              const artist = topArtists.find(a => a.id === activeArtist);
              if (!artist) return null;
              return (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 64 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="relative rounded-2xl overflow-hidden bg-[#111] border border-white/10 p-4 sm:p-5">
                    {/* Close button */}
                    <button
                      onClick={() => setActiveArtist(null)}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 text-white/60" />
                    </button>

                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                      {/* Artist info sidebar */}
                      <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 sm:w-[140px] shrink-0">
                        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-[#E52324]/40 shrink-0">
                          <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="sm:mt-1">
                          <h4 className="text-white text-[13px] sm:text-[14px] font-black uppercase tracking-tight">{artist.name}</h4>
                          <p className="text-white/30 text-[10px] uppercase tracking-wider">{artist.genre}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Headphones className="w-3 h-3 text-[#1DB954]" />
                            <span className="text-[10px] text-[#1DB954] font-semibold">Now Playing</span>
                          </div>
                        </div>
                      </div>

                      {/* Spotify embed */}
                      <div className="flex-1 w-full min-w-0">
                        <iframe
                          style={{ borderRadius: '12px' }}
                          src={`https://open.spotify.com/embed/track/${artist.spotifyTrackId}?utm_source=generator&theme=0`}
                          width="100%"
                          height="152"
                          frameBorder="0"
                          allowFullScreen
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                        />
                      </div>
                    </div>

                    {/* Get Tickets CTA */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <span className="text-white/40 text-[11px]">
                        <span className="text-white font-black">{artist.events}</span> upcoming events &middot; From <span className="text-white font-black">${artist.price}</span>
                      </span>
                      <Link
                        to="/events"
                        className="px-5 py-2 rounded-xl bg-[#E52324] text-white text-[11px] font-black uppercase tracking-wider hover:bg-[#c91f20] transition-colors"
                      >
                        Get Tickets
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </AnimatePresence>

          {/* ─── Top Teams Breaker ─── */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-2 px-4">
              <Trophy className="w-4 h-4 text-[#E52324]" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Top Teams</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ─── Top Teams Header ─── */}
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-3"
            >
              <Trophy className="w-5 h-5 text-[#E52324]" /> Popular Teams & Leagues
            </motion.h2>
            <Link to="/events" className="text-[#E52324] text-sm font-black uppercase tracking-wider hover:underline">
              See all →
            </Link>
          </div>

          {/* ─── Top Teams Cards (landscape cards like SeatGeek) ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
            {topTeams.map((team, idx) => (
              <Link key={team.id} to="/events">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-[#111] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/15 transition-all duration-300 cursor-pointer flex"
                  whileHover={{ y: -4 }}
                >
                  {/* Team image */}
                  <div className="relative w-[140px] sm:w-[160px] shrink-0 overflow-hidden">
                    <img
                      src={team.image}
                      alt={team.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111]/30" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 p-4 flex flex-col justify-center">
                    <span className="inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider text-white/80 bg-white/10 border border-white/10 w-fit mb-2">
                      {team.league}
                    </span>
                    <h3 className="text-white text-[13px] sm:text-[14px] font-black uppercase tracking-tight mb-1.5 group-hover:text-[#E52324] transition-colors line-clamp-1">
                      {team.name}
                    </h3>
                    <div className="flex items-center gap-1 text-white/35 text-[10px] mb-2">
                      <CalendarDays className="w-3 h-3 shrink-0 text-white/25" />
                      <span>Next: {team.nextGame}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-[11px]">From <span className="text-white font-black text-[15px]">${team.price}</span></span>
                      <span className="px-3 py-1 rounded-lg bg-[#E52324] text-white text-[9px] font-black uppercase tracking-wider hover:bg-[#c91f20] transition-colors">
                        Tickets
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* ─── Community Events Breaker ─── */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-2 px-4">
              <Users className="w-4 h-4 text-[#E52324]" />
              <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">Community Events</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* ─── Community Events Header ─── */}
          <div className="flex items-center justify-between mb-6">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight flex items-center gap-3"
            >
              <Heart className="w-5 h-5 text-[#E52324]" /> Community & Local Events
            </motion.h2>
            <Link to="/events" className="text-[#E52324] text-sm font-black uppercase tracking-wider hover:underline">
              See all →
            </Link>
          </div>

          {/* ─── Community Events Cards ─── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {communityEvents.map((event, idx) => (
              <Link key={event.id} to="/events">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="group bg-[#111] rounded-2xl overflow-hidden border border-white/[0.08] hover:border-white/15 transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {event.badge && (
                      <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider text-white ${event.badgeColor} shadow-lg`}>
                        {event.badge}
                      </span>
                    )}
                    {/* Price overlay */}
                    <div className="absolute bottom-2 left-2">
                      <span className="text-white text-[16px] font-black drop-shadow-lg">
                        {event.price === 0 ? 'Free' : `$${event.price}`}
                      </span>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-2.5">
                    <h3 className="text-white text-[11px] font-black uppercase leading-tight tracking-tight mb-1 line-clamp-1 group-hover:text-[#E52324] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-1 text-white/35 text-[9px] mb-0.5">
                      <CalendarDays className="w-2.5 h-2.5 shrink-0 text-white/25" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/35 text-[9px]">
                      <MapPin className="w-2.5 h-2.5 shrink-0 text-white/25" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 3 — ORGANIZER TOOLS: LAUNCH EVENTS + QR GENERATOR
          ════════════════════════════════════════════════════════ */}
      <section className="bg-[#0a0a0a] py-20 lg:py-28 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* ─── Section Header ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/10 border border-[#E52324]/20 mb-6">
              <Zap className="w-3.5 h-3.5 text-[#E52324]" />
              <span className="text-[11px] tracking-[0.15em] uppercase text-[#E52324] font-black">
                Organizer Tools
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-4">
              Everything You Need to{' '}
              <span className="text-[#E52324]">Sell Out</span>
            </h2>
            <p className="text-white/40 text-sm sm:text-base max-w-xl mx-auto">
              Powerful event creation tools and branded QR codes — all in one platform. No tech skills required.
            </p>
          </motion.div>

          {/* ─── Two Side-by-Side Blocks ─── */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* ────────────────────────────────────────────
                BLOCK 1 — LAUNCH YOUR EVENT
                ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden bg-[#111] border border-white/10 shadow-lg"
            >
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#E52324]/[0.05] rounded-full blur-[120px] pointer-events-none" />

              <div className="relative z-10 p-8 sm:p-10">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-6 h-px bg-[#E52324]" />
                  <span className="text-[11px] tracking-[0.2em] uppercase text-[#E52324] font-black">
                    For Event Organizers
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black uppercase leading-[0.92] tracking-tight text-white mb-4">
                  Launch Your
                  <br />
                  Event on
                  <br />
                  <span className="text-[#E52324]">InstaPass</span>
                </h3>

                <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-md">
                  Whether you're organizing a club night, a corporate conference, or a massive festival — InstaPass gives you the tools to sell out and scale up.
                </p>

                {/* 6 Feature Cards — 2-col grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {organizerFeatures.map((feat, idx) => {
                    const Icon = feat.icon;
                    return (
                      <motion.div
                        key={feat.title}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.1 + idx * 0.05 }}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 transition-all"
                      >
                        <div className={`w-9 h-9 rounded-lg ${feat.bg} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-4 h-4 ${feat.color}`} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-xs uppercase tracking-tight mb-0.5">
                            {feat.title}
                          </h4>
                          <p className="text-white/40 text-[10px] leading-relaxed">
                            {feat.desc}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <Link
                    to="/sell"
                    className="px-6 py-3 rounded-2xl bg-[#E52324] text-white text-sm font-black uppercase tracking-wider hover:bg-[#c91f20] transition-colors shadow-lg shadow-[#E52324]/20"
                  >
                    Create Your First Event →
                  </Link>
                  <Link
                    to="/organizer"
                    className="px-6 py-3 rounded-2xl border border-white/15 text-white/60 text-sm font-bold hover:bg-white/5 hover:text-white transition-all"
                  >
                    Organizer Dashboard
                  </Link>
                </div>

                {/* Trust line */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/40">
                  {['Free to create events', 'No monthly fees', 'Built-in fraud protection', 'Fast payouts'].map((item) => (
                    <span key={item} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#E52324]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ────────────────────────────────────────────
                BLOCK 2 — QR CODE STUDIO (FULL LANDING EXPERIENCE)
                ──────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative rounded-3xl overflow-hidden bg-[#0B0F19] border border-white/10 shadow-2xl"
            >
              {/* Multiple ambient glows */}
              <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-[#E52324]/[0.06] rounded-full blur-[160px] pointer-events-none" />
              <div className="absolute -top-16 -right-16 w-[300px] h-[300px] bg-[#E52324]/[0.04] rounded-full blur-[120px] pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/[0.03] rounded-full blur-[140px] pointer-events-none" />

              <div className="relative z-10 p-8 sm:p-10">
                {/* ── HERO: Tag + Heading + Description ── */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E52324]/8 border border-[#E52324]/15 mb-6">
                    <Sparkles className="w-3.5 h-3.5 text-[#E52324]" strokeWidth={2} />
                    <span className="text-[10px] text-[#E52324] uppercase tracking-[0.15em]" style={{ fontWeight: 800 }}>SmartCodes by InstaPass</span>
                  </div>

                  <h3 className="text-[28px] sm:text-[34px] leading-[1.05] text-white mb-4" style={{ fontWeight: 900, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.03em" }}>
                    Create QR Codes That
                    <br />
                    <span className="text-[#E52324]">Drive Action</span>
                  </h3>

                  <p className="text-[14px] text-white/35 leading-relaxed mb-8 max-w-md">
                    Design custom, branded QR codes in seconds. Track every scan with real-time analytics. Power your events, marketing, and business.
                  </p>
                </motion.div>

                {/* ── Pac-Man Animated QR Code ── */}
                <div className="relative min-h-[320px] mb-10">
                  <div className="flex items-center justify-center">
                    <PacManQR size={300} />
                  </div>
                </div>

                {/* ── Branded Frames Showcase ── */}
                <div className="mb-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <h4 className="text-[16px] text-white mb-0.5" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
                        Premium Branded Frames
                      </h4>
                      <p className="text-[11px] text-white/25">CTA text, watermarks & glow effects included</p>
                    </div>
                  </div>
                  <BrandedFramesRow />
                </div>

                {/* ── QR Showcase Scroller (inside card) ── */}
                <div className="pt-2 pb-2 -mx-8 sm:-mx-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 px-8 sm:px-10">
                    <div>
                      <h4 className="text-[16px] text-white mb-0.5" style={{ fontWeight: 800, fontFamily: "'Outfit', sans-serif", letterSpacing: "-0.02em" }}>
                        Branded QR Codes for Every Use Case
                      </h4>
                      <p className="text-[11px] text-white/25">Fully customizable designs. Scroll to explore →</p>
                    </div>
                    <Link
                      to="/qr-studio/create"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] text-[#E52324] border border-[#E52324]/20 hover:bg-[#E52324]/5 transition-all shrink-0"
                      style={{ fontWeight: 700 }}
                    >
                      Create Your Own <ArrowRight className="w-3 h-3" strokeWidth={2} />
                    </Link>
                  </div>
                  <QRShowcaseScroller />
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============ TRUST BADGES ============ */}
      <section className="bg-[#111] py-10 border-y border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
            {trustBadges.map((badge) => (
              <div key={badge.text} className="flex items-center gap-2 text-sm">
                <span className="text-[#00C853]">{badge.icon}</span>
                <span className="text-white/90">
                  <span className="font-black">{badge.bold}</span>
                  <span className="text-white/50 ml-1">{badge.text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MERCH SHOP PROMO (live from Shopify) ============ */}
      <ShopifyMerchPreview />

      {/* ============ PARTNER SCROLLER ============ */}
      <PartnerScroller />

      <Footer />
    </div>
  );
}