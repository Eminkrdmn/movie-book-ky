import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMovieDetails, getPosterUrl } from "../services/movieApi.js";
import { useFavorites } from "../hooks/useFavorites.js";

function MovieDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMovie() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  if (loading) return <p className="page">Yükleniyor...</p>;
  if (error) return <p className="page">Hata: {error}</p>;
  if (!movie) return null;

  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <section className="page movie-details">
      <Link to="/">← Ana sayfa</Link>

      <div className="movie-details-body">
        {posterUrl ? (
          <img
            className="movie-details-poster"
            src={posterUrl}
            alt={`${movie.title} posteri`}
          />
        ) : (
          <div className="movie-poster movie-poster-placeholder">
            Poster yok
          </div>
        )}

        <div className="movie-details-info">
          <h1>{movie.title}</h1>
          <button type="button" onClick={() => toggleFavorite(movie)}>
            {isFavorite(movie.id) ? "♥ Favoriden çıkar" : "♡ Favoriye ekle"}
          </button>
          <p>
            {movie.release_date?.slice(0, 4)} · {movie.runtime} dk · ⭐{" "}
            {movie.vote_average.toFixed(1)}
          </p>
          <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
          <h2>Özet</h2>
          <p>{movie.overview || "Bu film için özet bulunamadı."}</p>
        </div>
      </div>
    </section>
  );
}

export default MovieDetails;
