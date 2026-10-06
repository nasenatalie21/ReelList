export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  overview?: string;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieDetails extends Movie {
  tagline?: string;
  runtime?: number | null;
  genres?: { id: number; name: string }[];
  credits?: { cast: { id: number; name: string }[] };
  videos?: { results: { key: string; site: string; type: string }[] };
}

export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type Status = "want" | "watched";

export interface WatchlistItem {
  _id: string;
  tmdbMovieId: number;
  title: string;
  posterPath?: string | null;
  releaseDate?: string;
  status: Status;
  rating: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type WatchlistChanges = Partial<Pick<WatchlistItem, "status" | "rating" | "notes">>;
