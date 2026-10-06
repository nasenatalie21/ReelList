import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api, { errorMessage } from "../api/client";
import MovieCard from "../components/MovieCard";
import { MovieListResponse } from "../types";

export default function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const page = parseInt(params.get("page") || "1", 10) || 1;

  const [data, setData] = useState<MovieListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!q) {
      setData(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .get<MovieListResponse>("/movies/search", { params: { q, page } })
      .then((res) => {
        if (!cancelled) setData(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [q, page]);

  const go = (p: number) => setParams({ q, page: String(p) });
  const lastPage = data ? Math.min(data.total_pages, 500) : 1; 

  return (
    <div className="page">
      <h1>{q ? `Results for "${q}"` : "Search"}</h1>
      {!q && <p className="muted">Type a title in the search bar above.</p>}
      {loading && <p className="muted">Searching...</p>}
      {error && <p className="error">{error}</p>}
      {data && !data.results.length && <p className="muted">No movies found.</p>}

      {data && data.results.length > 0 && (
        <>
          <div className="grid">
            {data.results.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
          <div className="pager">
            <button className="btn" disabled={page <= 1} onClick={() => go(page - 1)}>
              ← Prev
            </button>
            <span className="muted">
              Page {data.page} of {lastPage}
            </span>
            <button className="btn" disabled={page >= lastPage} onClick={() => go(page + 1)}>
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
