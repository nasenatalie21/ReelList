import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import api from "../api/client";
import { useAuth } from "./AuthContext";
import { Movie, WatchlistChanges, WatchlistItem } from "../types";

export interface WatchlistContextValue {
  items: WatchlistItem[];
  loading: boolean;
  has: (tmdbMovieId: number) => boolean;
  add: (movie: Movie) => Promise<void>;
  update: (tmdbMovieId: number, changes: WatchlistChanges) => Promise<void>;
  remove: (tmdbMovieId: number) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

export function useWatchlist(): WatchlistContextValue {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error("useWatchlist must be used inside <WatchlistProvider>");
  return ctx;
}

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get<WatchlistItem[]>("/watchlist");
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const has = (tmdbMovieId: number) => items.some((i) => i.tmdbMovieId === tmdbMovieId);

  // CREATE
  const add = async (movie: Movie) => {
    const { data } = await api.post<WatchlistItem>("/watchlist", {
      tmdbMovieId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
    });
    setItems((prev) => [data, ...prev]);
  };

  // UPDATE (status, rating, notes)
  const update = async (tmdbMovieId: number, changes: WatchlistChanges) => {
    const { data } = await api.patch<WatchlistItem>(`/watchlist/${tmdbMovieId}`, changes);
    setItems((prev) => prev.map((i) => (i.tmdbMovieId === tmdbMovieId ? data : i)));
  };

  // DELETE
  const remove = async (tmdbMovieId: number) => {
    await api.delete(`/watchlist/${tmdbMovieId}`);
    setItems((prev) => prev.filter((i) => i.tmdbMovieId !== tmdbMovieId));
  };

  return (
    <WatchlistContext.Provider value={{ items, loading, has, add, update, remove }}>
      {children}
    </WatchlistContext.Provider>
  );
}
