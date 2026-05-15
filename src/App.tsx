/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useFetchMovies } from './hooks/useFetchMovies';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { MovieCard } from './components/MovieCard';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { Movie } from './types';
import { searchMovies, fetchGenres } from './api/tmdb';
import { Film, Loader2, Heart, X, Search, Star, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [selectedGenre, setSelectedGenre] = useState<number | undefined>(undefined);
  const { movies, loading, hasMore, error, loadMoreMovies } = useFetchMovies(selectedGenre);
  const { targetRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
  
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Movie[] | null>(null);
  
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<{id: number; name: string}[]>([]);
  const [isPending, startTransition] = useTransition();

  // Fetch genres on mount
  useEffect(() => {
    fetchGenres().then(setGenres).catch(console.error);
  }, []);

  useEffect(() => {
    if (isIntersecting && !loading && hasMore && searchResults === null) {
      loadMoreMovies();
    }
  }, [isIntersecting, loading, hasMore, loadMoreMovies, searchResults]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    
    setIsSearching(true);
    try {
      const resp = await searchMovies(searchQuery);
      startTransition(() => {
        setSearchResults(resp.results);
      });
    } catch (err) {
      console.error(err);
      // fallback smoothly
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  const toggleFavorite = useCallback((movie: Movie) => {
    setFavorites(prev => {
      const isFav = prev.some(m => m.id === movie.id);
      if (isFav) {
        return prev.filter(m => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  }, []);

  const displayedMovies = searchResults !== null ? searchResults : movies;
  const heroMovie = movies.length > 0 && searchResults === null && !searchQuery ? movies[0] : null;
  const gridMovies = heroMovie ? displayedMovies.slice(1) : displayedMovies;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-red-500 cursor-pointer" onClick={handleClearSearch}>
          <Film className="w-8 h-8" />
          <h1 className="text-2xl font-black tracking-tight text-white hidden sm:block">MovieMind</h1>
        </div>
        
        <div className="flex-1 max-w-md mx-6 relative">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Istalgan kinoni qidirish..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value === "") setSearchResults(null);
              }}
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-full py-2.5 pl-11 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all placeholder:text-gray-600"
            />
            {searchQuery && (
              <button 
                type="button" 
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button type="submit" className="hidden">Qidirish</button>
          </form>
        </div>

        <button 
          onClick={() => setShowSidebar(true)}
          className="relative p-2.5 rounded-full bg-[#1a1a1a] border border-white/10 hover:bg-[#222] transition-colors flex flex-shrink-0"
        >
          <Heart className={cn("w-5 h-5", favorites.length > 0 ? "text-red-500" : "text-gray-400")} />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </button>
      </header>

      <main className="max-w-[1600px] mx-auto p-4 md:p-8">
        
        {/* Cinematic Hero */}
        {heroMovie && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 relative rounded-3xl overflow-hidden aspect-video md:aspect-[21/9] bg-gradient-to-r from-black to-zinc-900 border border-white/5 shadow-2xl group cursor-pointer"
            onClick={() => setSelectedMovie(heroMovie)}
          >
            {heroMovie.poster_path && (
               <img 
                 src={`https://image.tmdb.org/t/p/w1280${heroMovie.poster_path}`} 
                 alt={heroMovie.title} 
                 className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen transition-transform duration-[2s] group-hover:scale-105"
               />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-6 md:p-12 max-w-2xl">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-[#0a0a0a] bg-red-500 rounded-sm">
                TAVSIYA ETILGAN
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                {heroMovie.title}
              </h2>
              <p className="text-gray-300 md:text-lg mb-6 line-clamp-2 md:line-clamp-3 max-w-xl text-shadow">
                {heroMovie.overview}
              </p>
              
              <div className="flex items-center gap-4">
                <button 
                   onClick={() => setSelectedMovie(heroMovie)}
                   className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <Play className="w-5 h-5 fill-current" /> Treylerni Ko'rish
                </button>
                <div className="bg-black/40 backdrop-blur-md px-4 py-3 rounded-full text-sm font-bold flex items-center gap-2 border border-white/10 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  {heroMovie.vote_average.toFixed(1)}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Categories / Genres */}
        {searchResults === null && !searchQuery && genres.length > 0 && (
          <div className="mb-10 flex items-center gap-3 overflow-x-auto custom-scrollbar pb-4">
            <button
               onClick={() => setSelectedGenre(undefined)}
               className={cn(
                 "px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all border",
                 selectedGenre === undefined 
                   ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20" 
                   : "bg-[#1a1a1a] text-gray-400 border-white/10 hover:text-white hover:bg-[#222]"
               )}
            >
              Barcha Kinolar
            </button>
            {genres.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all border",
                  selectedGenre === g.id 
                    ? "bg-white text-black border-white shadow-lg shadow-white/10" 
                    : "bg-[#1a1a1a] text-gray-400 border-white/10 hover:text-white hover:bg-[#222]"
                )}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8">
            {error}
          </div>
        )}

        {searchResults !== null && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-300 flex items-center gap-2">
              <Search className="w-5 h-5" />
              <span className="text-white">"{searchQuery}"</span> uchun natijalar
            </h2>
            <button onClick={handleClearSearch} className="text-sm text-red-400 hover:text-red-300 transition-colors">
              Qidiruvni tozalash
            </button>
          </div>
        )}

        {isSearching || (isPending && searchResults === null) ? (
          <div className="py-32 flex flex-col items-center justify-center text-gray-500 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-red-500" />
            <p>Kinolar qidirilmoqda...</p>
          </div>
        ) : gridMovies.length === 0 && !heroMovie ? (
          <div className="py-32 flex flex-col items-center justify-center text-gray-500 gap-4 text-center">
            <Film className="w-16 h-16 opacity-20" />
            <p className="text-xl">Kinolar topilmadi. Boshqa qidiruv yoki janrni sinab ko'ring.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {gridMovies.map((movie) => (
                <MovieCard
                  key={`movie-${movie.id}`}
                  movie={movie}
                  isFavorite={favorites.some(f => f.id === movie.id)}
                  onToggleFavorite={toggleFavorite}
                  onClick={setSelectedMovie}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Intersection Observer Target */}
        {searchResults === null && !isSearching && gridMovies.length > 0 && (
          <div ref={targetRef} className="h-24 mt-8 flex items-center justify-center">
            {loading && hasMore && (
              <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-full">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-medium">Ko'proq kinolar yuklanmoqda...</span>
              </div>
            )}
            {!hasMore && !loading && (
              <p className="text-gray-500 text-sm">Siz ro'yxatning oxiriga yetdingiz.</p>
            )}
          </div>
        )}
      </main>

      {/* Sidebar for Favorites & Recommendations */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-[#111] border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0a0a0a]">
                <div className="flex items-center gap-2 text-white">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                  <h2 className="font-bold text-lg">Saqlanganlar</h2>
                </div>
                <button 
                  onClick={() => setShowSidebar(false)}
                  className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8">
                {favorites.length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Hali saqlangan kinolar yo'q. Saqlash uchun kinolarga layk bosing!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {favorites.map(movie => (
                      <div key={movie.id} className="flex items-center gap-3 bg-white/5 p-2 rounded-xl group relative">
                        <div className="w-12 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          {movie.poster_path ? (
                            <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600 text-center p-1 bg-gray-900">{movie.title}</div>
                          )}
                        </div>
                        <div className="flex-1 pr-8">
                          <h4 className="font-semibold text-sm line-clamp-1">{movie.title}</h4>
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            {movie.vote_average.toFixed(1)}
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleFavorite(movie)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-black/40 text-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <MovieDetailsModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
        onSelectMovie={setSelectedMovie}
      />
    </div>
  );
}
