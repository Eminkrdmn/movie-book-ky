import { Link } from "react-router-dom";
import MovieCard from "../components/MovieCard.jsx";
import { useFavorites } from "../hooks/useFavorites.js";

function Favorites() {
  const { favorites, loading, error, isFavorite, toggleFavorite } =
    useFavorites();

  return (
    <section className="page">
      <h1>Favoriler</h1>

      {loading && <p>Favoriler yükleniyor...</p>}
      {error && <p>Hata: {error}</p>}

      {!loading && !error && favorites.length === 0 && (
        <p>
          Henüz favori film yok. <Link to="/">Filmlere göz at</Link>
        </p>
      )}

      <div className="movie-grid">
        {favorites.map((movie) => (
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

export default Favorites;
