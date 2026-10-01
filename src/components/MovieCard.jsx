import { Link } from "react-router-dom";
import { getPosterUrl } from "../services/movieApi.js";

function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <article className="movie-card">
      {posterUrl ? (
        <img
          className="movie-poster"
          src={posterUrl}
          alt={`${movie.title} posteri`}
        />
      ) : (
        <div className="movie-poster movie-poster-placeholder">Poster yok</div>
      )}
      <div className="movie-card-content">
        <h2>{movie.title}</h2>
        <p>
          {movie.release_date?.slice(0, 4)} · ⭐ {movie.vote_average.toFixed(1)}
        </p>
        <Link to={`/movie/${movie.id}`}>Film detayları</Link>
        <button type="button" onClick={() => onToggleFavorite(movie)}>
          {isFavorite ? "♥ Favoriden çıkar" : "♡ Favoriye ekle"}
        </button>
      </div>
    </article>
  );
}

export default MovieCard;
