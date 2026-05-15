import React from "react";
import { motion } from "motion/react";
import { Movie } from "../types";
import { Star, Heart, Film } from "lucide-react";
import { cn } from "../lib/utils";

interface MovieCardProps {
  key?: React.Key;
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onClick: (movie: Movie) => void;
}

export function MovieCard({ movie, isFavorite, onToggleFavorite, onClick }: MovieCardProps) {
  const imageUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => onClick(movie)}
      className="bg-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl hover:shadow-red-500/10 transition-all duration-300 relative group flex flex-col h-full border border-white/5 hover:border-white/10 cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-[#111]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={movie.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center transition-transform duration-700 group-hover:scale-105"
               style={{ background: 'linear-gradient(135deg, #1f1c2c 0%, #928dab 100%)' }}>
            <Film className="w-16 h-16 text-white/40 mb-4" />
            <span className="text-xl font-bold text-white drop-shadow-md">{movie.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-100 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80 pointer-events-none"></div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          className={cn(
            "absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 hover:scale-110 active:scale-95",
            isFavorite ? "bg-red-500/90 text-white shadow-lg shadow-red-500/20" : "bg-black/40 text-white/70 hover:bg-black/60 hover:text-white border border-white/10"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
        
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-sm font-semibold flex items-center gap-1.5 text-yellow-500 border border-white/10">
          <Star className="w-4 h-4 fill-current" />
          <span>{movie.vote_average.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg leading-tight mb-2 text-white line-clamp-1" title={movie.title}>{movie.title}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">{movie.overview}</p>
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {movie.release_date ? new Date(movie.release_date).getFullYear() : "Noma'lum sana"}
        </div>
      </div>
    </motion.div>
  );
}
