import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWatchlist, WatchlistContextValue } from "../context/WatchlistContext";
import { errorMessage } from "../api/client";
import StarRating from "../components/StarRating";
import { posterUrl, year } from "../utils/image";
import { Status, WatchlistItem } from "../types";

type Filter = "all" | Status;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "want", label: "Want to watch" },
  { key: "watched", label: "Watched" },
];

interface ItemProps {
  item: WatchlistItem;
  update: WatchlistContextValue["update"];
  remove: WatchlistContextValue["remove"];
}

function Item({ item, update, remove }: ItemProps) {
  const [notes, setNotes] = useState(item.notes || "");
  const [error, setError] = useState("");
  const poster = posterUrl(item.posterPath, "w185");

  useEffect(() => {
    setNotes(item.notes || "");
  }, [item.notes]);

  const run = async (fn: () => Promise<void>) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <li className="wl-item">
      <Link to={`/movie/${item.tmdbMovieId}`}>
        {poster ? <img src={poster} alt={item.title} /> : <div className="no-poster">No poster</div>}
      </Link>

      <div className="wl-main">
        <h3>
          <Link to={`/movie/${item.tmdbMovieId}`}>{item.title}</Link>{" "}
          <span className="muted">{year(item.releaseDate)}</span>
        </h3>

        <div className="wl-controls">
          <select
            value={item.status}
            onChange={(e) => run(() => update(item.tmdbMovieId, { status: e.target.value as Status }))}
            aria-label="Status"
          >
            <option value="want">Want to watch</option>
            <option value="watched">Watched</option>
          </select>
          <StarRating
            value={item.rating}
            onChange={(rating) => run(() => update(item.tmdbMovieId, { rating }))}
          />
        </div>

        <textarea
          value={notes}
          maxLength={1000}
          placeholder="Add notes..."
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (item.notes || "")) run(() => update(item.tmdbMovieId, { notes }));
          }}
        />
        {error && <p className="error small">{error}</p>}
      </div>

      <button
        className="btn btn-danger"
        onClick={() => {
          if (window.confirm(`Remove "${item.title}"?`)) run(() => remove(item.tmdbMovieId));
        }}
      >
        Remove
      </button>
    </li>
  );
}

export default function Watchlist() {
  const { items, loading, update, remove } = useWatchlist();
  const [filter, setFilter] = useState<Filter>("all");
  const count = (f: Filter) => (f === "all" ? items.length : items.filter((i) => i.status === f).length);
  const shown = filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div className="page">
      <h1>My Watchlist</h1>

      <div className="tabs">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? "tab active" : "tab"}
            onClick={() => setFilter(f.key)}
          >
            {f.label} ({count(f.key)})
          </button>
        ))}
      </div>

      {loading && <p className="muted">Loading...</p>}
      {!loading && !shown.length && (
        <p className="muted">
          Nothing here yet. <Link to="/">Browse movies</Link> to add some.
        </p>
      )}

      <ul className="wl-list">
        {shown.map((item) => (
          <Item key={item._id} item={item} update={update} remove={remove} />
        ))}
      </ul>
    </div>
  );
}
