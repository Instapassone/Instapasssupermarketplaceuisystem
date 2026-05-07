import { useEffect, useRef, useState, useCallback } from 'react';

interface TickerItem {
  id: string;
  league: string;
  leagueColor: string;
  away: string;
  home: string;
  awayScore?: number;
  homeScore?: number;
  status: string;
  live?: boolean;
}

/* ── ESPN public scoreboard endpoints (no API key required) ── */
const ESPN_FEEDS = [
  { league: 'NBA', color: '#E52324', url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard' },
  { league: 'MLB', color: '#002D72', url: 'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard' },
  { league: 'NHL', color: '#000000', url: 'https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard' },
  { league: 'MLS', color: '#78BE20', url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard' },
];

/* ── Minimal static fallback (only shown if ALL fetches fail) ── */
const fallbackItems: TickerItem[] = [
  { id: 'fb1', league: 'NBA', leagueColor: '#E52324', away: 'BOS', home: 'PHI', status: 'Loading scores…' },
  { id: 'fb2', league: 'MLB', leagueColor: '#002D72', away: 'LAD', home: 'SF',  status: 'Loading scores…' },
  { id: 'fb3', league: 'NHL', leagueColor: '#000000', away: 'FLA', home: 'TBL', status: 'Loading scores…' },
];

/* ── Parse a single ESPN event into a TickerItem ── */
function parseEvent(event: any, league: string, color: string, idx: number): TickerItem | null {
  try {
    const comp = event.competitions?.[0];
    if (!comp) return null;

    const competitors: any[] = comp.competitors ?? [];
    const away = competitors.find((c: any) => c.homeAway === 'away') ?? competitors[0];
    const home = competitors.find((c: any) => c.homeAway === 'home') ?? competitors[1];
    if (!away || !home) return null;

    const awayAbbr: string = away.team?.abbreviation ?? away.team?.shortDisplayName ?? '???';
    const homeAbbr: string = home.team?.abbreviation ?? home.team?.shortDisplayName ?? '???';

    const statusType: string = comp.status?.type?.name ?? '';
    const shortDetail: string = comp.status?.type?.shortDetail ?? comp.status?.displayClock ?? '';

    const isLive  = statusType === 'STATUS_IN_PROGRESS' || statusType === 'STATUS_HALFTIME';
    const isFinal = statusType.includes('FINAL') || statusType === 'STATUS_FINAL';

    let statusLabel = shortDetail;
    // Shorten common ESPN status strings
    if (statusType === 'STATUS_HALFTIME') statusLabel = 'HALFTIME';
    if (isFinal) statusLabel = `FINAL`;

    const awayScore = isFinal || isLive ? parseInt(away.score ?? '', 10) : undefined;
    const homeScore = isFinal || isLive ? parseInt(home.score ?? '', 10) : undefined;

    return {
      id: `${league}-${event.id ?? idx}`,
      league,
      leagueColor: color,
      away: awayAbbr,
      home: homeAbbr,
      awayScore: isNaN(awayScore!) ? undefined : awayScore,
      homeScore: isNaN(homeScore!) ? undefined : homeScore,
      status: statusLabel,
      live: isLive,
    };
  } catch {
    return null;
  }
}

/* ── Fetch one league's scoreboard ── */
async function fetchLeague(feed: typeof ESPN_FEEDS[0]): Promise<TickerItem[]> {
  const res = await fetch(feed.url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`${feed.league} fetch failed`);
  const json = await res.json();
  const events: any[] = json.events ?? [];
  return events
    .map((ev, i) => parseEvent(ev, feed.league, feed.color, i))
    .filter(Boolean) as TickerItem[];
}

function TickerCard({ item }: { item: TickerItem }) {
  const hasScore = item.awayScore !== undefined && item.homeScore !== undefined;

  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1 mr-6 whitespace-nowrap">
      {/* League badge */}
      <span
        className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded"
        style={{ backgroundColor: item.leagueColor, color: '#fff' }}
      >
        {item.league}
      </span>

      {hasScore ? (
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-white/90 font-black">{item.away}</span>
          <span className="text-white/60">{item.awayScore}</span>
          <span className="text-white/30 mx-0.5">–</span>
          <span className="text-white/60">{item.homeScore}</span>
          <span className="text-white/90 font-black">{item.home}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-white/90 font-black">{item.away}</span>
          <span className="text-white/30">vs</span>
          <span className="text-white/90 font-black">{item.home}</span>
        </div>
      )}

      {/* Status */}
      <span className={`text-[9px] font-black uppercase tracking-wider ${item.live ? 'text-[#00C853]' : 'text-white/40'}`}>
        {item.live && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00C853] mr-1 animate-pulse align-middle" />
        )}
        {item.status}
      </span>

      {/* Separator */}
      <span className="text-white/10 ml-2">|</span>
    </div>
  );
}

export function SportsTicker() {
  const scrollRef  = useRef<HTMLDivElement>(null);
  const posRef     = useRef(0);
  const frameRef   = useRef<number>(0);
  const [items, setItems] = useState<TickerItem[]>(fallbackItems);
  const [hasLive, setHasLive] = useState(false);

  /* ── Fetch all leagues and merge ── */
  const refresh = useCallback(async () => {
    try {
      const results = await Promise.allSettled(ESPN_FEEDS.map(fetchLeague));
      const merged: TickerItem[] = [];
      results.forEach((r) => {
        if (r.status === 'fulfilled') merged.push(...r.value);
      });
      if (merged.length > 0) {
        setItems(merged);
        setHasLive(merged.some((m) => m.live));
      }
    } catch {
      /* keep whatever we have */
    }
  }, []);

  /* Initial fetch + poll every 60 s */
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 60_000);
    return () => clearInterval(id);
  }, [refresh]);

  /* Marquee animation */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const tick = () => {
      posRef.current += 0.5;
      const half = el.scrollWidth / 2;
      if (half > 0 && posRef.current >= half) posRef.current = 0;
      el.style.transform = `translateX(-${posRef.current}px)`;
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [items]);

  return (
    <div className="bg-[#111] border-b border-white/5 overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#111] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#111] to-transparent z-10 pointer-events-none" />

      {/* Live indicator */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1">
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${hasLive ? 'bg-[#00C853]' : 'bg-[#E52324]'} animate-pulse`} />
        <span className="text-[8px] font-black tracking-widest text-[#E52324]/80 uppercase">
          {hasLive ? 'LIVE' : 'SCORES'}
        </span>
      </div>

      <div className="py-1.5">
        <div ref={scrollRef} className="inline-flex will-change-transform">
          {[...items, ...items].map((item, i) => (
            <TickerCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
