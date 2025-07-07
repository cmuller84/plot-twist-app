
// PlotTwistMoviesApp.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, Star, MapPin, Play, BarChart3, TrendingUp, Award, Heart, Shuffle, Eye, EyeOff, AlertTriangle, X } from 'lucide-react';

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

const MOVIES_URL = '/movies.json';

const coreMovies: Movie[] = [
  {
    Year: 1999,
    Title: 'The Sixth Sense',
    Genre: 'Supernatural Drama',
    Country: 'USA',
    Description: 'A child psychologist tries to help a boy who sees spirits.',
    RT_Critic: 86,
    RT_Audience: 90,
    Availability: 'Prime Video',
    Spoilers: 'Dr. Crowe realises he is one of the ghosts the boy sees.'
  },
  {
    Year: 2019,
    Title: 'Parasite',
    Genre: 'Thriller/Drama',
    Country: 'South Korea',
    Description: 'A poor family infiltrates a rich household with disastrous results.',
    RT_Critic: 99,
    RT_Audience: 90,
    Availability: 'Hulu',
    Spoilers: 'A man is secretly living in the Park family’s basement bunker.'
  }
];

const ratingColour = (score: number) => {
  if (score >= 90) return 'text-green-400';
  if (score >= 80) return 'text-yellow-400';
  if (score >= 70) return 'text-orange-400';
  return 'text-red-400';
};

const PlotTwistMoviesApp: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [yearRange, setYearRange] = useState<[number, number]>([1920, 2025]);
  const [criticRange, setCriticRange] = useState<[number, number]>([0, 100]);
  const [audienceRange, setAudienceRange] = useState<[number, number]>([0, 100]);
  const [sortBy, setSortBy] = useState<'year-desc' | 'year-asc' | 'title-asc' | 'title-desc' | 'critic-desc' | 'critic-asc' | 'audience-desc' | 'audience-asc'>('year-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showSpoilers, setShowSpoilers] = useState<Record<string, boolean>>({});
  const [spoilerWarn, setSpoilerWarn] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(MOVIES_URL);
        if (!res.ok) throw new Error('movies.json not found');
        const data: Movie[] = await res.json();
        setMovies(data.length ? data : coreMovies);
      } catch {
        setMovies(coreMovies);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const genres = useMemo(() => [...new Set(movies.map(m => m.Genre))].sort(), [movies]);
  const countries = useMemo(() => [...new Set(movies.map(m => m.Country))].sort(), [movies]);
  const platforms = useMemo(() => [...new Set(movies.map(m => m.Availability))].sort(), [movies]);

  const filtered = useMemo(() => {
    return movies
      .filter(m => (
        (!searchTerm || m.Title.toLowerCase().includes(searchTerm.toLowerCase()) || m.Description.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!selectedGenre || m.Genre === selectedGenre) &&
        (!selectedCountry || m.Country === selectedCountry) &&
        (!selectedAvailability || m.Availability === selectedAvailability) &&
        (m.Year >= yearRange[0] && m.Year <= yearRange[1]) &&
        (m.RT_Critic >= criticRange[0] && m.RT_Critic <= criticRange[1]) &&
        (m.RT_Audience >= audienceRange[0] && m.RT_Audience <= audienceRange[1])
      ))
      .sort((a, b) => {
        switch (sortBy) {
          case 'title-asc': return a.Title.localeCompare(b.Title);
          case 'title-desc': return b.Title.localeCompare(a.Title);
          case 'year-asc': return a.Year - b.Year;
          case 'year-desc': return b.Year - a.Year;
          case 'critic-asc': return a.RT_Critic - b.RT_Critic;
          case 'critic-desc': return b.RT_Critic - a.RT_Critic;
          case 'audience-asc': return a.RT_Audience - b.RT_Audience;
          case 'audience-desc': return b.RT_Audience - a.RT_Audience;
          default: return b.Year - a.Year;
        }
      });
  }, [movies, searchTerm, selectedGenre, selectedCountry, selectedAvailability, yearRange, criticRange, audienceRange, sortBy]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Plot‑Twist Movies ({filtered.length})</h1>
      <input
        className="w-full mb-4 p-2 rounded bg-gray-700 placeholder-gray-400"
        placeholder="Search…" value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(m=>(
          <div key={m.Title} className="bg-gray-800 p-4 rounded border border-gray-700">
            <h2 className="font-semibold text-lg mb-1">{m.Title} <span className="text-sm text-gray-400">({m.Year})</span></h2>
            <p className="text-sm text-gray-400 mb-1">{m.Genre} • {m.Country}</p>
            <p className="text-sm mb-2 line-clamp-3">{m.Description}</p>
            <div className="flex justify-between text-xs">
              <span className={ratingColour(m.RT_Critic)}>{m.RT_Critic}% Critic</span>
              <span className={ratingColour(m.RT_Audience)}>{m.RT_Audience}% Audience</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlotTwistMoviesApp;
