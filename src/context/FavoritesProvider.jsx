import { useEffect, useState } from "react";
import { FavoritesContext } from "./favoritesContext.js";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../services/movieApi.js";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFavorites() {
      try {
        setFavorites(await getFavorites());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  function isFavorite(id) {
    return favorites.some((movie) => movie.id === id);
  }

  async function toggleFavorite(movie) {
    const wasFavorite = isFavorite(movie.id);
    setError(null);

    // Ekranı hemen güncelle, sunucu cevabını bekleme
    setFavorites((prev) =>
      wasFavorite ? prev.filter((m) => m.id !== movie.id) : [...prev, movie],
    );

    try {
      if (wasFavorite) {
        await removeFavorite(movie.id);
      } else {
        await addFavorite(movie.id);
      }
    } catch (err) {
      // İstek başarısızsa değişikliği geri al
      setFavorites((prev) =>
        wasFavorite ? [...prev, movie] : prev.filter((m) => m.id !== movie.id),
      );
      setError(err.message);
    }
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, error, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
