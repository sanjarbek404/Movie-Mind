export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface MovieDetails extends Movie {
  runtime?: number;
  genres?: string[];
  director?: string;
  cast?: string[];
  tagline?: string;
  similar?: Movie[];
}
