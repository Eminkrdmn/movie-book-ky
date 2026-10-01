const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL =
  import.meta.env.VITE_TMDB_BASE_URL || "https://api.themoviedb.org/3";
const IMAGE_URL =
  import.meta.env.VITE_TMDB_IMAGE_URL || "https://image.tmdb.org/t/p/w500";

async function request(endpoint, params = {}) {
  if (!API_KEY) {
    throw new Error("TMDB API anahtarı tanımlı değil (VITE_TMDB_API_KEY).");
  }

  const query = new URLSearchParams({
    api_key: API_KEY,
    language: "tr-TR",
    ...params,
  });

  const response = await fetch(`${BASE_URL}${endpoint}?${query}`);

  if (!response.ok) {
    throw new Error(`Film servisi isteği başarısız oldu (${response.status}).`);
  }

  return response.json();
}

export async function getPopularMovies(page = 1) {
  const data = await request("/movie/popular", { page });
  return data.results;
}

export async function searchMovies(searchText, page = 1) {
  const data = await request("/search/movie", { query: searchText, page });
  return data.results;
}

export function getMovieDetails(id) {
  return request(`/movie/${encodeURIComponent(id)}`);
}

export function getPosterUrl(posterPath) {
  return posterPath ? `${IMAGE_URL}${posterPath}` : null;
}
