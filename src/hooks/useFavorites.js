import { useContext } from "react";
import { FavoritesContext } from "../context/favoritesContext.js";

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites, FavoritesProvider içinde kullanılmalı.");
  }

  return context;
}
