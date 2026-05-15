import { useState, useEffect, useCallback, useTransition } from "react";
import { Movie } from "../types";
import { fetchMoviesByGenre } from "../api/tmdb";

export function useFetchMovies(genreId?: number) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();

  // Reset when genre changes
  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [genreId]);

  const loadMoreMovies = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchMoviesByGenre(page, genreId);
      
      startTransition(() => {
        setMovies(prev => {
          // Avoid duplicates
          const newMovies = data.results.filter(m => !prev.some(p => p.id === m.id));
          return [...prev, ...newMovies];
        });
        setHasMore(page < data.total_pages);
        setPage(p => p + 1);
      });
    } catch (err) {
      setError("Kinolarni yuklashda xatolik yuz berdi. Iltimos, internet aloqasini tekshiring.");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, genreId]);

  // Initial load or load after genre reset
  useEffect(() => {
    if (movies.length === 0 && hasMore && !loading) {
      loadMoreMovies();
    }
  }, [loadMoreMovies, movies.length, hasMore, loading]);

  return { movies, loading: loading || isPending, hasMore, error, loadMoreMovies };
}
