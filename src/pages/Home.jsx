import { useEffect, useState } from "react";
import { getPopularMovies, searchMovies } from "../services/movieApi.js";
import MovieCard from "../components/MovieCard.jsx";
import { useFavorites } from "../hooks/useFavorites.js";

function Home() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 500);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      setLoading(true);
      setError(null);
      try {
        const data = debouncedQuery
          ? await searchMovies(debouncedQuery)
          : await getPopularMovies();
        if (!cancelled) setMovies(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <section className="page">
      <h1>
        {debouncedQuery ? `"${debouncedQuery}" sonuçları` : "Popüler Filmler"}
      </h1>

      <div className="search-box">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          className="search-input"
          type="text"
          placeholder="Film ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {query && (
          <button
            type="button"
            className="search-clear"
            onClick={() => setQuery("")}
            aria-label="Aramayı temizle"
          >
            ✕
          </button>
        )}
      </div>

      {loading && <p>Yükleniyor...</p>}
      {error && <p>Hata: {error}</p>}
      {!loading && !error && movies.length === 0 && <p>Film bulunamadı.</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={isFavorite(movie.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}

export default Home;
