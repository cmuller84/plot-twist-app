// PlotTwistMoviesApp.tsx – cleaned-up, standalone version
// --------------------------------------------------------
// • Fetches movies from /movies.json (must live in public/).
// • No Excel / window.fs calls: runs anywhere (Netlify, Vercel, CodeSandbox).
// • Full UI: search, quick genre buttons, advanced filters, stats, spoilers, favorites, random jump.

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, Play, BarChart3, TrendingUp, Award, Heart, Shuffle,
  Eye, EyeOff, AlertTriangle, X, MapPin, Star
} from 'lucide-react';

// ---------- types -----------------------------------------------------------
interface Movie {
  Year: number;
  Title: string;
  Genre: string;
  Country: string;
  Description: string;
  RT_Critic: number;
  RT_Audience: number;
  Availability: string;
  Spoilers: string;
}

// ---------- constants -------------------------------------------------------
const MOVIES_URL = '/movies.json';
const POPULAR_GENRES = ['Horror', 'Psychological Thriller', 'Mystery/Drama', 'Crime Thriller', 'Sci-Fi'];

// ---------- helpers ---------------------------------------------------------
const ratingColor = (score: number) =>
  score >= 90 ? 'text-green-400'
  : score >= 80 ? 'text-yellow-400'
  : score >= 70 ? 'text-orange-400'
  : 'text-red-400';

// ---------- component -------------------------------------------------------
const PlotTwistMoviesApp: React.FC = () => {
  // state
  const [movies,        setMovies]        = useState<Movie[]>([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');
  const [genre,         setGenre]         = useState('');
  const [country,       setCountry]       = useState('');
  const [platform,      setPlatform]      = useState('');
  const [yearRange,     setYearRange]     = useState<[number, number]>([1920, 2025]);
  const [criticRange,   setCriticRange]   = useState<[number, number]>([0, 100]);
  const [audienceRange, setAudienceRange] = useState<[number, number]>([0, 100]);
  const [sort,          setSort]          = useState<'year-desc' | 'year-asc' |
                                            'title-asc' | 'title-desc' |
                                            'critic-desc' | 'critic-asc' |
                                            'audience-desc' | 'audience-asc'>('year-desc');
  const [showFilters,   setShowFilters]   = useState(false);
  const [favorites,     setFavorites]     = useState<string[]>([]);
  const [spoilerWarn,   setSpoilerWarn]   = useState<Record<string, boolean>>({});
  const [showSpoiler,   setShowSpoiler]   = useState<Record<string, boolean>>({});

  // fetch movies.json
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(MOVIES_URL);
        const data: Movie[] = await res.json();
        setMovies(data);
      } catch (err) {
        console.error('Failed to fetch movies.json', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // derived lists for filters
  const genres     = useMemo(() => [...new Set(movies.map(m => m.Genre))].sort(), [movies]);
  const countries  = useMemo(() => [...new Set(movies.map(m => m.Country))].sort(), [movies]);
  const platforms  = useMemo(() => [...new Set(movies.map(m => m.Availability))].sort(), [movies]);

  // filtering & sorting
  const filtered = useMemo(() => {
    let list = movies.filter(m => {
      const q = search.toLowerCase();
      return (
        (!q || m.Title.toLowerCase().includes(q) || m.Description.toLowerCase().includes(q)) &&
        (!genre     || m.Genre       === genre) &&
        (!country   || m.Country     === country) &&
        (!platform  || m.Availability=== platform) &&
        m.Year       >= yearRange[0] && m.Year <= yearRange[1] &&
        m.RT_Critic  >= criticRange[0] && m.RT_Critic  <= criticRange[1] &&
        m.RT_Audience>= audienceRange[0] && m.RT_Audience<= audienceRange[1]
      );
    });

    list.sort((a,b) => {
      switch (sort) {
        case 'year-asc'      : return a.Year - b.Year;
        case 'year-desc'     : return b.Year - a.Year;
        case 'title-asc'     : return a.Title.localeCompare(b.Title);
        case 'title-desc'    : return b.Title.localeCompare(a.Title);
        case 'critic-asc'    : return a.RT_Critic - b.RT_Critic;
        case 'critic-desc'   : return b.RT_Critic - a.RT_Critic;
        case 'audience-asc'  : return a.RT_Audience - b.RT_Audience;
        case 'audience-desc' : return b.RT_Audience - a.RT_Audience;
        default              : return b.Year - a.Year;
      }
    });
    return list;
  }, [movies, search, genre, country, platform, yearRange, criticRange, audienceRange, sort]);

  // stats
  const avgCritic   = filtered.length ? Math.round(filtered.reduce((s,m)=>s+m.RT_Critic ,0)/filtered.length) : 0;
  const avgAudience = filtered.length ? Math.round(filtered.reduce((s,m)=>s+m.RT_Audience,0)/filtered.length) : 0;

  // actions
  const toggleFav   = (t:string)=> setFavorites(f=>f.includes(t)?f.filter(x=>x!==t):[...f,t]);
  const randomJump  = ()=> { if(filtered.length){ const i=Math.floor(Math.random()*filtered.length); document.getElementById(`m${i}`)?.scrollIntoView({behavior:'smooth'});} };
  const reset       = ()=>{ setSearch(''); setGenre(''); setCountry(''); setPlatform(''); setSort('year-desc'); };

  // loading state
  if (loading)
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading…</div>;

  // ---- render --------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-4">
      {/* Header & stats */}
      <header className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold mb-1">🎬 Plot-Twist Movies</h1>
        <p className="text-purple-200 mb-6">Catalog: {movies.length} films with mind-bending twists.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-8">
          <div className="bg-white/10 p-4 rounded"><BarChart3 size={18}/> {filtered.length} Movies</div>
          <div className="bg-white/10 p-4 rounded"><TrendingUp size={18}/> {avgCritic}% Critic</div>
          <div className="bg-white/10 p-4 rounded"><Award size={18}/> {avgAudience}% Audience</div>
          <div className="bg-white/10 p-4 rounded"><Heart size={18}/> {favorites.length} Fav</div>
        </div>
      </header>

      {/* Controls */}
      <section className="max-w-7xl mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
          <input
            value={search}
            onChange={e=>setSearch(e.target.value)}
            placeholder="Search by title or description…"
            className="w-full pl-10 py-3 rounded-lg bg-white/20 placeholder-gray-300 focus:ring-2 focus:ring-purple-400 outline-none"/>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded flex items-center gap-1" onClick={randomJump}><Shuffle size={16}/>Random</button>
          <button className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded flex items-center gap-1" onClick={reset}><X size={16}/>Reset</button>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-1" onClick={()=>setShowFilters(!showFilters)}><Filter size={16}/>{showFilters?'Hide':'Show'} Filters</button>
        </div>

        {/* quick genre buttons */}
        <div className="flex flex-wrap gap-2">
          {POPULAR_GENRES.map(g=>(
            <button key={g}
              onClick={()=>setGenre(genre===g?'':g)}
              className={`px-3 py-1 rounded-full text-xs ${genre===g?'bg-purple-600':'bg-white/20 hover:bg-white/30'}`}>
              {g}
            </button>
          ))}
        </div>

        {/* advanced filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select className="bg-white/20 p-2 rounded" value={genre} onChange={e=>setGenre(e.target.value)}>
              <option value="">All Genres</option>{genres.map(g=><option key={g} className="text-black">{g}</option>)}
            </select>
            <select className="bg-white/20 p-2 rounded" value={country} onChange={e=>setCountry(e.target.value)}>
              <option value="">All Countries</option>{countries.map(c=><option key={c} className="text-black">{c}</option>)}
            </select>
            <select className="bg-white/20 p-2 rounded" value={platform} onChange={e=>setPlatform(e.target.value)}>
              <option value="">All Platforms</option>{platforms.map(p=><option key={p} className="text-black">{p}</option>)}
            </select>
          </div>
        )}
      </section>

      {/* movie grid */}
      <main className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((m,i)=>(
          <article id={`m${i}`} key={m.Title} className="bg-white/10 p-5 rounded-xl border border-white/10 hover:bg-white/20 transition">
            <header className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg mr-2">{m.Title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm bg-purple-800/60 px-2 py-0.5 rounded">{m.Year}</span>
                <button onClick={()=>toggleFav(m.Title)} className={favorites.includes(m.Title)?'text-red-400':'text-gray-400'}>
                  <Heart size={16} fill={favorites.includes(m.Title)?'currentColor':'none'}/>
                </button>
              </div>
            </header>

            <p className="text-purple-300 text-xs mb-1">{m.Genre} • {m.Country}</p>
            <p className="text-sm text-gray-200 mb-3 line-clamp-3">{m.Description}</p>

            <div className="flex justify-between text-sm mb-3">
              <span className={ratingColor(m.RT_Critic)}>{m.RT_Critic}% Critics</span>
              <span className={ratingColor(m.RT_Audience)}>{m.RT_Audience}% Audience</span>
            </div>

            <div className="flex items-center gap-1 text-green-400 text-sm mb-4"><Play size={14}/> {m.Availability}</div>

            {/* spoiler toggle */}
            {!showSpoiler[m.Title] && !spoilerWarn[m.Title] && (
              <button className="bg-red-900/40 hover:bg-red-900/60 px-3 py-2 rounded text-red-300 text-sm flex items-center gap-1 w-full"
                onClick={()=>setSpoilerWarn({...spoilerWarn, [m.Title]:true})}>
                <Eye size={14}/> Reveal Twist
              </button>
            )}

            {spoilerWarn[m.Title] && (
              <div className="bg-red-900/30 p-3 rounded mb-2 text-xs">
                <p className="flex items-center gap-1 text-red-300 mb-2"><AlertTriangle size={14}/> Spoiler ahead for <strong>{m.Title}</strong></p>
                <button className="bg-red-600 px-3 py-1 rounded mr-2" onClick={()=>{ setShowSpoiler({...showSpoiler, [m.Title]:true}); setSpoilerWarn({...spoilerWarn, [m.Title]:false}); }}>Yes, show</button>
                <button className="bg-gray-600 px-3 py-1 rounded" onClick={()=>setSpoilerWarn({...spoilerWarn, [m.Title]:false})}>Cancel</button>
              </div>
            )}

            {showSpoiler[m.Title] && (
              <div className="bg-red-900/30 p-3 rounded text-sm relative">
                <button className="absolute top-1 right-1 text-gray-400" onClick={()=>setShowSpoiler({...showSpoiler, [m.Title]:false})}><X size={14}/></button>
                <p className="flex items-center gap-1 mb-1"><EyeOff size={14}/> <span className="font-semibold">Twist:</span></p>
                <p className="text-red-100 leading-snug">{m.Spoilers}</p>
              </div>
            )}
          </article>
        ))}
      </main>

      {!filtered.length && (
        <p className="text-center py-16 text-purple-200">No movies match your criteria.</p>
      )}
    </div>
  );
};

export default PlotTwistMoviesApp;
