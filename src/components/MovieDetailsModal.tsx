import { motion, AnimatePresence } from "motion/react";
import { Movie, MovieDetails } from "../types";
import { X, Star, Calendar, Clock, Film, Clapperboard, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { getMovieDetails } from "../api/tmdb";
import { cn } from "../lib/utils";

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onSelectMovie?: (movie: Movie) => void;
}

export function MovieDetailsModal({ movie, onClose, onSelectMovie }: MovieDetailsModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (movie) {
      setDetails(null);
      setLoading(true);
      getMovieDetails(movie).then(res => {
        if (active) {
          setDetails(res);
          setLoading(false);
        }
      }).catch(err => {
        console.error(err);
        if (active) setLoading(false);
      });
    }
    return () => { active = false; };
  }, [movie]);

  if (!movie) return null;

  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
    : undefined;

  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : "Noma'lum";

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0a0a0a] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl border border-white/10 flex flex-col md:flex-row relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white backdrop-blur-md transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left: Poster */}
          <div className="w-full md:w-2/5 aspect-[2/3] md:aspect-auto md:h-auto relative flex-shrink-0 bg-[#111]">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80 md:hidden"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0a0a0a] opacity-100 hidden md:block"></div>
              </>
            ) : (
               <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
               style={{ background: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)' }}>
                <Film className="w-24 h-24 text-white/40 mb-4" />
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 md:bottom-auto md:top-4 md:left-4 flex gap-2">
              <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 text-yellow-500 border border-white/10 shadow-lg">
                <Star className="w-4 h-4 fill-current" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              {movie.title} <span className="text-gray-500 font-medium tracking-tight">({releaseYear})</span>
            </h2>
            
            <div className="min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 mt-20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Film className="w-8 h-8 opacity-50" />
                  </motion.div>
                  <p className="animate-pulse">Batafsil ma'lumotlar yuklanmoqda...</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {details?.tagline && (
                    <p className="text-indigo-400 font-medium italic text-lg opacity-90">
                      "{details.tagline}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {movie.release_date || "Noma'lum sana"}
                    </div>
                    {details?.runtime && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {details.runtime} daq
                      </div>
                    )}
                  </div>

                  {details?.genres && details.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {details.genres.map(g => (
                        <span key={g} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                          {g}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                      Qisqacha mazmuni
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {movie.overview || "Bu kino haqida hozircha qisqacha ma'lumot mavjud emas."}
                    </p>
                  </div>

                  {details?.trailerKey && (
                     <div className="pt-4">
                       <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                         <Film className="w-5 h-5 text-red-500" />
                         Treyler
                       </h3>
                       <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
                         <iframe 
                           src={`https://www.youtube.com/embed/${details.trailerKey}`} 
                           title="YouTube video player" 
                           frameBorder="0" 
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                           allowFullScreen
                           className="absolute top-0 left-0 w-full h-full"
                         ></iframe>
                       </div>
                     </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {details?.director && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Clapperboard className="w-4 h-4" />
                          Rejissyor
                        </h4>
                        <p className="text-white font-medium">{details.director}</p>
                      </div>
                    )}

                    {details?.cast && details.cast.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Bosh rollarda
                        </h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          {details.cast.map(c => (
                            <span key={c} className="text-gray-300">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {details?.similar && details.similar.length > 0 && (
                    <div className="pt-6 border-t border-white/10 mt-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Film className="w-5 h-5 text-red-500" />
                        O'xshash kinolar
                      </h3>
                      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                        {details.similar.map(sim => (
                          <div 
                            key={sim.id} 
                            onClick={() => {
                              if (onSelectMovie) {
                                onSelectMovie(sim);
                              }
                            }}
                            className="w-32 flex-shrink-0 snap-start group relative cursor-pointer"
                          >
                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a] mb-2 border border-white/5 relative">
                              {sim.poster_path ? (
                                <img src={`https://image.tmdb.org/t/p/w200${sim.poster_path}`} alt={sim.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" loading="lazy" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-center text-gray-600 p-2">
                                  {sim.title}
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                  <Star className="w-3 h-3 fill-current" />
                                  {sim.vote_average.toFixed(1)}
                                </div>
                              </div>
                            </div>
                            <h4 className="text-xs font-medium text-gray-300 line-clamp-2 leading-tight group-hover:text-white transition-colors">{sim.title}</h4>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
            
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
