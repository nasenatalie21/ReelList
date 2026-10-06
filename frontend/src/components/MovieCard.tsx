import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";
import { errorMessage } from "../api/client";
import { posterUrl, year } from "../utils/image";
import { Movie } from "../types";

export default function MovieCard({ movie }: { movie: Movie }) {
  const { user } = useAuth();
  const { has, add } = useWatchlist();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const saved = has(movie.id);
  const poster = posterUrl(movie.poster_path);

  const onAdd = async () => {
    setBusy(true);
    setError("");
    try {
      await add(movie);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const meta = `${year(movie.release_date)}${movie.vote_average ? ` · ★ ${movie.vote_average.toFixed(1)}` : ""}`;

  return (
    <div className="card">
      <Link to={`/movie/${movie.id}`}>
        {poster ? (
          <img src={poster} alt={movie.title} loading="lazy" />
        ) : (
          <div className="no-poster">No poster</div>
        )}
        <div className="card-body">
          <h3>{movie.title}</h3>
          <p className="muted">{meta}</p>
        </div>
      </Link>

      {user ? (
        <button className="btn" disabled={saved || busy} onClick={onAdd}>
          {saved ? "✓ In watchlist" : busy ? "Adding..." : "+ Add to watchlist"}
        </button>
      ) : (
        <Link className="btn btn-ghost" to="/login">
          Log in to save
        </Link>
      )}

      {error ? <p className="error small">{error}</p> : null}
    </div>
  );
}
