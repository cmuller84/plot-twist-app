import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, Star, MapPin, Play, BarChart3, TrendingUp, Award, Heart, Shuffle, Eye, EyeOff, AlertTriangle, X } from 'lucide-react';

const PlotTwistMoviesApp = () => {
  // Initialize all state variables
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [yearRange, setYearRange] = useState([1920, 2023]);
  const [criticRange, setCriticRange] = useState([0, 100]);
  const [audienceRange, setAudienceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('year-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showSpoilers, setShowSpoilers] = useState({});
  const [spoilerWarning, setSpoilerWarning] = useState({});

  // Load movie data on component mount
  useEffect(() => {
    const loadMovieData = async () => {
      try {
        setLoading(true);
        
        // Core classic movies with full descriptions
        const coreMovies = [
          {
            Year: 1920, Title: "The Cabinet of Dr. Caligari", Genre: "Horror", Country: "Germany",
            Description: "In a German town, a mysterious hypnotist named Dr. Caligari arrives with his traveling carnival, featuring a somnambulist named Cesare who can predict the future. When a series of murders begins to plague the town, suspicion falls on the eerie duo. This landmark silent film pioneered German Expressionist cinema with its distorted sets, angular shadows, and psychological horror elements that influenced generations of filmmakers.",
            RT_Critic: 100, RT_Audience: 89, Availability: "Public domain",
            Spoilers: "The entire story is revealed to be the delusion of a mental patient in an asylum. Dr. Caligari is actually the director of the asylum, and the narrator is an unreliable protagonist suffering from psychological breakdown."
          },
          {
            Year: 1941, Title: "Citizen Kane", Genre: "Mystery/Drama", Country: "USA",
            Description: "After powerful newspaper magnate Charles Foster Kane dies alone in his mansion, uttering the cryptic word 'Rosebud,' a reporter investigates the meaning behind this final utterance. Through interviews with Kane's associates, the film explores the rise and fall of a media empire and the personal cost of ambition. Orson Welles' masterpiece revolutionized filmmaking techniques while telling a deeply human story about power, loneliness, and lost innocence.",
            RT_Critic: 99, RT_Audience: 93, Availability: "Max",
            Spoilers: "Rosebud is revealed to be Kane's childhood sled, symbolizing his lost innocence and the simple happiness he sacrificed in his pursuit of power and control."
          },
          {
            Year: 1999, Title: "The Sixth Sense", Genre: "Supernatural Drama", Country: "USA",
            Description: "Child psychologist Malcolm Crowe begins treating Cole Sear, a troubled eight-year-old boy who claims he can see and communicate with dead people. Initially skeptical, Malcolm works to help Cole understand his frightening visions while dealing with his own marital problems and professional doubts. As their therapeutic relationship develops, both Malcolm and Cole must confront difficult truths about life, death, and the unfinished business that keeps spirits trapped in our world.",
            RT_Critic: 86, RT_Audience: 90, Availability: "Prime Video",
            Spoilers: "Malcolm Crowe has been dead the entire time, killed by his former patient at the beginning of the film. He is one of the ghosts that Cole can see, and only realizes his death when he finally understands why his wife has been ignoring him."
          },
          {
            Year: 1999, Title: "Fight Club", Genre: "Psychological Thriller", Country: "USA",
            Description: "An insomniac office worker forms an underground fight club with soap salesman Tyler Durden as a form of male bonding and rebellion against consumer culture. What starts as a cathartic release evolves into Project Mayhem, an anarchist organization that plots to destroy corporate America. As the movement grows increasingly violent and out of control, the narrator must confront the dangerous path he's helped set in motion.",
            RT_Critic: 81, RT_Audience: 96, Availability: "Hulu",
            Spoilers: "Tyler Durden is the narrator's split personality, created by his insomnia and dissociation. The narrator has been unknowingly leading Project Mayhem himself, and Tyler only exists in his fractured mind as an idealized version of who he wishes he could be."
          },
          {
            Year: 1995, Title: "The Usual Suspects", Genre: "Crime Mystery", Country: "USA",
            Description: "Five criminals are brought together for a police lineup and subsequently recruited for a heist by the mysterious crime lord Keyser Söze. The job goes disastrously wrong, leading to a massacre on a ship where millions in drug money was being traded. Verbal Kint, a small-time con man with cerebral palsy, tells customs agent Dave Kujan the story of how they all came to be involved with the legendary and feared Söze.",
            RT_Critic: 87, RT_Audience: 96, Availability: "Prime Video",
            Spoilers: "Verbal Kint is actually Keyser Söze himself. He fabricated the entire story using details from objects in the police office, and his physical disability was an act. He manipulated the entire situation to eliminate the only witnesses who could identify him."
          },
          {
            Year: 1995, Title: "Se7en", Genre: "Crime Thriller", Country: "USA",
            Description: "Veteran detective William Somerset is partnered with hot-headed newcomer David Mills to investigate a series of gruesome murders based on the seven deadly sins. Each crime scene is elaborately staged to represent gluttony, greed, sloth, pride, lust, envy, and wrath, suggesting a methodical killer with a twisted moral philosophy. As Somerset prepares for retirement and Mills struggles with the city's corruption, they race to stop the killer before he completes his horrific masterpiece.",
            RT_Critic: 82, RT_Audience: 95, Availability: "Netflix",
            Spoilers: "The killer John Doe deliberately gets caught as part of his plan. He reveals he killed Mills' wife Tracy and their unborn child (representing envy), then manipulates Mills into killing him in rage (representing wrath), thus completing his seven deadly sins masterpiece."
          },
          {
            Year: 2019, Title: "Parasite", Genre: "Thriller/Drama", Country: "South Korea",
            Description: "The impoverished Kim family lives in a semi-basement apartment and struggles to make ends meet. When son Ki-woo gets an opportunity to tutor the teenage daughter of the wealthy Park family, the Kims devise a scheme to infiltrate the Parks' household by posing as unrelated, highly qualified workers. As the Kims become increasingly embedded in the Parks' lives, class tensions bubble beneath the surface, leading to a shocking discovery that threatens to destroy both families.",
            RT_Critic: 99, RT_Audience: 90, Availability: "Hulu",
            Spoilers: "Another family, the Parks' former housekeeper's husband Geun-sae, has been secretly living in a hidden bunker beneath the Parks' house for years. When this is discovered, the revelation leads to a violent confrontation that results in multiple deaths and exposes the brutal reality of class inequality."
          }
        ];

        // Try to load additional movies from Excel file if available
        try {
          const response = await window.fs.readFile('plot_twist_movies_expanded.xlsx');
          const XLSX = await import('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
          const workbook = XLSX.read(response);
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const expandedMovies = XLSX.utils.sheet_to_json(worksheet);

          // Enhance expanded movies with descriptions and spoilers
          const enhancedExpandedMovies = expandedMovies.map(movie => ({
            ...movie,
            Description: movie.Description || `${movie.Title} (${movie.Year}) is a compelling ${movie.Genre} film from ${movie.Country} that delivers unexpected plot twists and memorable cinematic moments that challenge audience expectations.`,
            Spoilers: movie.Spoilers || `The twist in ${movie.Title} reveals unexpected truths that completely reframe the story and characters' motivations, providing a shocking revelation that changes everything.`
          }));

          // Combine core movies with expanded dataset
          const allMovies = [...coreMovies, ...enhancedExpandedMovies];
          setMovies(allMovies);
        } catch (error) {
          console.log('Using core movies only');
          setMovies(coreMovies);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading movies:', error);
        setLoading(false);
      }
    };

    loadMovieData();
  }, []);

  // Extract unique values for filters (safe with empty arrays)
  const genres = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    return [...new Set(movies.map(m => m.Genre))].sort();
  }, [movies]);

  const countries = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    return [...new Set(movies.map(m => m.Country))].sort();
  }, [movies]);

  const availabilities = useMemo(() => {
    if (!movies || movies.length === 0) return [];
    return [...new Set(movies.map(m => m.Availability))].sort();
  }, [movies]);

  // Popular genres for quick filters
  const popularGenres = ['Horror', 'Psychological Thriller', 'Mystery/Drama', 'Crime Thriller', 'Sci-Fi'];

  // Filter and sort movies (safe with empty arrays)
  const filteredMovies = useMemo(() => {
    if (!movies || movies.length === 0) return [];

    let filtered = movies.filter(movie => {
      const matchesSearch = movie.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (movie.Description && movie.Description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesGenre = !selectedGenre || movie.Genre === selectedGenre;
      const matchesCountry = !selectedCountry || movie.Country === selectedCountry;
      const matchesAvailability = !selectedAvailability || movie.Availability === selectedAvailability;
      const matchesYear = movie.Year >= yearRange[0] && movie.Year <= yearRange[1];
      const matchesCritic = movie.RT_Critic >= criticRange[0] && movie.RT_Critic <= criticRange[1];
      const matchesAudience = movie.RT_Audience >= audienceRange[0] && movie.RT_Audience <= audienceRange[1];

      return matchesSearch && matchesGenre && matchesCountry && matchesAvailability && 
             matchesYear && matchesCritic && matchesAudience;
    });

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc': return a.Title.localeCompare(b.Title);
        case 'title-desc': return b.Title.localeCompare(a.Title);
        case 'year-asc': return a.Year - b.Year;
        case 'year-desc': return b.Year - a.Year;
        case 'critic-desc': return b.RT_Critic - a.RT_Critic;
        case 'critic-asc': return a.RT_Critic - b.RT_Critic;
        case 'audience-desc': return b.RT_Audience - a.RT_Audience;
        case 'audience-asc': return a.RT_Audience - b.RT_Audience;
        case 'country-asc': return a.Country.localeCompare(b.Country);
        case 'genre-asc': return a.Genre.localeCompare(b.Genre);
        default: return b.Year - a.Year;
      }
    });

    return filtered;
  }, [movies, searchTerm, selectedGenre, selectedCountry, selectedAvailability, yearRange, criticRange, audienceRange, sortBy]);

  // Statistics (safe with empty arrays)
  const stats = useMemo(() => {
    if (!filteredMovies || filteredMovies.length === 0) {
      return { avgCritic: 0, avgAudience: 0 };
    }

    const avgCritic = Math.round(filteredMovies.reduce((sum, m) => sum + m.RT_Critic, 0) / filteredMovies.length);
    const avgAudience = Math.round(filteredMovies.reduce((sum, m) => sum + m.RT_Audience, 0) / filteredMovies.length);
    
    return { avgCritic, avgAudience };
  }, [filteredMovies]);

  // Favorites management
  const toggleFavorite = (movieTitle) => {
    setFavorites(prev => 
      prev.includes(movieTitle) 
        ? prev.filter(title => title !== movieTitle)
        : [...prev, movieTitle]
    );
  };

  // Spoiler management
  const handleSpoilerClick = (movieTitle) => {
    if (!spoilerWarning[movieTitle]) {
      setSpoilerWarning(prev => ({ ...prev, [movieTitle]: true }));
    }
  };

  const confirmSpoiler = (movieTitle) => {
    setShowSpoilers(prev => ({ ...prev, [movieTitle]: true }));
    setSpoilerWarning(prev => ({ ...prev, [movieTitle]: false }));
  };

  const cancelSpoiler = (movieTitle) => {
    setSpoilerWarning(prev => ({ ...prev, [movieTitle]: false }));
  };

  // Random movie picker
  const getRandomMovie = () => {
    if (!filteredMovies || filteredMovies.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredMovies.length);
    const randomMovie = filteredMovies[randomIndex];
    if (randomMovie) {
      document.getElementById(`movie-${randomIndex}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSelectedCountry('');
    setSelectedAvailability('');
    setYearRange([1920, 2023]);
    setCriticRange([0, 100]);
    setAudienceRange([0, 100]);
    setSortBy('year-desc');
  };

  // Get rating color
  const getRatingColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading movie database...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white mb-2">🎬 Plot Twist Movies</h1>
          <p className="text-purple-200">
            Discover {movies.length} incredible films with mind-bending plot twists spanning from 1920 to 2023
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-purple-200 mb-1">
              <BarChart3 size={16} />
              <span className="text-sm">Total Movies</span>
            </div>
            <div className="text-2xl font-bold text-white">{filteredMovies.length}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-purple-200 mb-1">
              <TrendingUp size={16} />
              <span className="text-sm">Avg Critic Score</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.avgCritic}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-purple-200 mb-1">
              <Award size={16} />
              <span className="text-sm">Avg Audience Score</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.avgAudience}%</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 text-purple-200 mb-1">
              <Heart size={16} />
              <span className="text-sm">Favorites</span>
            </div>
            <div className="text-2xl font-bold text-white">{favorites.length}</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search movies by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={getRandomMovie}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Shuffle size={16} />
              <span>Random Movie</span>
            </button>
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              <X size={16} />
              <span>Reset Filters</span>
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Filter size={16} />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>

          {/* Popular Genre Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-purple-200 text-sm">Quick genres:</span>
            {popularGenres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  selectedGenre === genre 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-purple-200 hover:bg-white/30'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex flex-wrap gap-4 items-center mb-4">
            <span className="text-purple-200">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="year-desc" className="text-black">Year (Newest First)</option>
              <option value="year-asc" className="text-black">Year (Oldest First)</option>
              <option value="title-asc" className="text-black">Title (A-Z)</option>
              <option value="title-desc" className="text-black">Title (Z-A)</option>
              <option value="critic-desc" className="text-black">Critics Score (High-Low)</option>
              <option value="critic-asc" className="text-black">Critics Score (Low-High)</option>
              <option value="audience-desc" className="text-black">Audience Score (High-Low)</option>
              <option value="audience-asc" className="text-black">Audience Score (Low-High)</option>
              <option value="country-asc" className="text-black">Country (A-Z)</option>
              <option value="genre-asc" className="text-black">Genre (A-Z)</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre} className="text-black">{genre}</option>
                ))}
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country} className="text-black">{country}</option>
                ))}
              </select>

              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">All Platforms</option>
                {availabilities.map(platform => (
                  <option key={platform} value={platform} className="text-black">{platform}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie, index) => (
            <div
              key={movie.Title}
              id={`movie-${index}`}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white flex-1 mr-2">{movie.Title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-purple-300 text-sm bg-purple-900/50 px-2 py-1 rounded">{movie.Year}</span>
                  <button
                    onClick={() => toggleFavorite(movie.Title)}
                    className={`p-1 rounded transition-colors ${
                      favorites.includes(movie.Title) 
                        ? 'text-red-400 hover:text-red-300' 
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart size={16} fill={favorites.includes(movie.Title) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={14} className="text-gray-400" />
                <span className="text-purple-200 text-sm">{movie.Country}</span>
              </div>
              
              <div className="text-sm text-purple-300 mb-3 bg-purple-900/30 px-2 py-1 rounded">
                {movie.Genre}
              </div>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">{movie.Description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-current" />
                  <span className={`font-semibold ${getRatingColor(movie.RT_Critic)}`}>{movie.RT_Critic}%</span>
                  <span className="text-gray-400 text-xs">Critics</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-blue-400 fill-current" />
                  <span className={`font-semibold ${getRatingColor(movie.RT_Audience)}`}>{movie.RT_Audience}%</span>
                  <span className="text-gray-400 text-xs">Audience</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <Play size={14} />
                  <span>{movie.Availability}</span>
                </div>
              </div>

              {/* Spoiler Section */}
              <div className="border-t border-white/20 pt-4">
                {!showSpoilers[movie.Title] && !spoilerWarning[movie.Title] && (
                  <button
                    onClick={() => handleSpoilerClick(movie.Title)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg transition-colors text-sm w-full"
                  >
                    <Eye size={14} />
                    <span>Reveal Plot Twist</span>
                  </button>
                )}

                {spoilerWarning[movie.Title] && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <AlertTriangle size={16} />
                      <span className="font-semibold">Spoiler Warning!</span>
                    </div>
                    <p className="text-red-200 text-sm mb-3">
                      This will reveal the major plot twist(s) for "{movie.Title}". Are you sure you want to continue?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => confirmSpoiler(movie.Title)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                      >
                        Yes, Show Spoiler
                      </button>
                      <button
                        onClick={() => cancelSpoiler(movie.Title)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {showSpoilers[movie.Title] && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-red-400">
                        <EyeOff size={16} />
                        <span className="font-semibold">The Twist:</span>
                      </div>
                      <button
                        onClick={() => setShowSpoilers(prev => ({ ...prev, [movie.Title]: false }))}
                        className="text-gray-400 hover:text-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-red-100 text-sm leading-relaxed">
                      {movie.Spoilers}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-xl mb-2">No movies found</div>
            <div className="text-purple-200">Try adjusting your search criteria or filters</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotTwistMoviesApp;
