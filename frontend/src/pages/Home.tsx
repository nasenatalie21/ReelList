import { useEffect, useState } from "react";
import api, { errorMessage } from "../api/client";
import MovieRow from "../components/MovieRow";
import { Movie, MovieListResponse } from "../types";

interface Rows {
  trending: Movie[];
  popular: Movie[];
  topRated: Movie[];
  nowPlaying: Movie[];
}

export default function Home() {
  const [rows, setRows] = useState<Rows | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get<MovieListResponse>("/movies/trending"),
      api.get<MovieListResponse>("/movies/popular"),
      api.get<MovieListResponse>("/movies/top-rated"),
      api.get<MovieListResponse>("/movies/now-playing"),
    ])
      .then(([trending, popular, topRated, nowPlaying]) => {
        if (cancelled) return;
        setRows({
          trending: trending.data.results,
          popular: popular.data.results,
          topRated: topRated.data.results,
          nowPlaying: nowPlaying.data.results,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) return <p className="error page">{error}</p>;
  if (!rows) return <p className="muted page">Loading movies...</p>;

  return (
    <div className="page">
      <MovieRow title="Trending this week" movies={rows.trending} />
      <MovieRow title="Popular" movies={rows.popular} />
      <MovieRow title="Top rated" movies={rows.topRated} />
      <MovieRow title="Now playing" movies={rows.nowPlaying} />
    </div>
  );
}
