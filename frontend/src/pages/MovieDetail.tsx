import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { errorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { posterUrl, year } from "../utils/image";
import { MovieDetails } from "../types";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { has, add, remove } = useWatchlist();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setMovie(null);
    setError("");
    api
      .get<MovieDetails>(`/movies/${id}`)
      .then((res) => {
        if (!cancelled) setMovie(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) return <p className="error page">{error}</p>;
  if (!movie) return <p className="muted page">Loading...</p>;

  const saved = has(movie.id);
  const poster = posterUrl(movie.poster_path, "w500");

  const toggle = async () => {
    setActionError("");
    try {
      if (saved) await remove(movie.id);
      else await add(movie);
    } catch (err) {
      setActionError(errorMessage(err));
    }
  };

  return (
    <div className="page detail">
      {poster ? (
        <img className="detail-poster" src={poster} alt={movie.title} />
      ) : (
        <div className="no-poster big">No poster</div>
      )}

      <div className="detail-info">
        <h1>
          {movie.title} <span className="muted">({year(movie.release_date)})</span>
        </h1>
        {movie.tagline && (
          <p className="muted">
            <em>{movie.tagline}</em>
          </p>
        )}
        <p className="muted">
          {movie.genres?.map((g) => g.name).join(", ")}
          {movie.runtime ? ` · ${movie.runtime} min` : ""}
          {movie.vote_average ? ` · ★ ${movie.vote_average.toFixed(1)}` : ""}
        </p>
        <p>{movie.overview || "No overview available."}</p>

        {user ? (
          <button className={saved ? "btn btn-danger" : "btn"} onClick={toggle}>
            {saved ? "Remove from watchlist" : "+ Add to watchlist"}
          </button>
        ) : (
          <Link className="btn" to="/login">
            Log in to save
          </Link>
        )}
        {saved && (
          <p className="muted small">
            Edit your rating and notes in <Link to="/watchlist">My Watchlist</Link>.
          </p>
        )}
        {actionError && <p className="error small">{actionError}</p>}
      </div>
    </div>
  );
}
