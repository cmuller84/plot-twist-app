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
  const randomJump  = ()=> { if(filtered.length){ const i=Math.floor(Math.rando
