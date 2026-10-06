import { FormEvent, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <img
          src={`${process.env.PUBLIC_URL}/images/film.png`}
          alt=""
          className="brand-logo"
        />
        <span>Reel List</span>
      </Link>

      <form onSubmit={submit} className="nav-search">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search movies..."
          aria-label="Search movies"
        />
      </form>

      <nav className="nav-links">
        <NavLink to="/">Browse</NavLink>
        {user ? (
          <>
            <NavLink to="/watchlist">My Watchlist</NavLink>
            <button className="link-btn" onClick={logout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/register">Sign up</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
