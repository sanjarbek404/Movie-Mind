/// <reference types="vite/client" />
import { Movie, MovieDetails } from "../types";
import { mockMovies } from "./mockData";

// Try to get from environment first, otherwise fallback to a common read-only TMDB API key for demo purposes.
let API_KEY = import.meta.env.VITE_TMDB_API_KEY;
if (!API_KEY || API_KEY === "YOUR_TMDB_API_KEY") {
  // Free public API key used for educational/demo purposes
  API_KEY = "15d2ea6d0dc1d476efbca3eba2b9bbfb";
}

const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchMovies(page: number): Promise<{ results: Movie[]; total_pages: number }> {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}&include_adult=false`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch movies from TMDB");
  }
  const data = await res.json();
  return data;
}

export async function searchMovies(query: string, page: number = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to search movies from TMDB");
  }
  const data = await res.json();
  return data;
}

const UZBEK_GENRE_MAP: Record<number, string> = {
  28: "Jangari",
  12: "Sarguzasht",
  16: "Animasiya",
  35: "Komediya",
  80: "Kriminal",
  18: "Drama",
  10751: "Oklaviy",
  14: "Fantastika",
  36: "Tarixiy",
  27: "Dahshat",
  10402: "Musiqiy",
  9648: "Sirli",
  10749: "Romantika",
  878: "Ilmiy fantastika",
  10770: "TV Kino",
  53: "Triller",
  10752: "Urush",
  37: "Vestern"
};

export async function fetchGenres(): Promise<{ id: number; name: string }[]> {
  const url = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`;
  const res = await fetch(url);
  if (!res.ok) {
    return [];
  }
  const data = await res.json();
  const genres = (data.genres || []).filter((g: any) => g.id !== 99);
  
  // Translate to Uzbek manually
  return genres.map((g: any) => ({
    id: g.id,
    name: UZBEK_GENRE_MAP[g.id] || g.name
  }));
}

export async function fetchMoviesByGenre(page: number, genreId?: number): Promise<{ results: Movie[]; total_pages: number }> {
  const url = genreId 
    ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}&with_genres=${genreId}&include_adult=false`
    : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}&include_adult=false`;
    
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch movies from TMDB");
  }
  const data = await res.json();
  return data;
}

export async function getMovieDetails(movie: Movie): Promise<MovieDetails & { similar?: Movie[], trailerKey?: string }> {
  const url = `${BASE_URL}/movie/${movie.id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,similar,videos`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch movie details from TMDB");
  }
  const data = await res.json();
  
  const director = data.credits?.crew?.find((member: any) => member.job === "Director")?.name;
  const cast = data.credits?.cast?.slice(0, 5).map((actor: any) => actor.name);
  
  let similar = data.similar?.results?.slice(0, 6) || [];

  // Find YouTube trailer
  const trailer = data.videos?.results?.find((v: any) => v.site === "YouTube" && v.type === "Trailer");

  return {
    ...movie,
    runtime: data.runtime,
    director,
    cast,
    similar,
    genres: data.genres?.map((g: any) => UZBEK_GENRE_MAP[g.id] || g.name),
    tagline: data.tagline,
    overview: data.overview || movie.overview,
    trailerKey: trailer?.key
  };
}
