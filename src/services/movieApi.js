const API_URL = "/api/tmdb";
const ACCOUNT_ID = import.meta.env.VITE_TMDB_ACCOUNT_ID;
const IMAGE_URL =
  import.meta.env.VITE_TMDB_IMAGE_URL || "https://image.tmdb.org/t/p/w500";

async function request(endpoint, { method = "GET", params = {}, body } = {}) {
  const query = new URLSearchParams({
    ...(method === "GET" && { language: "tr-TR" }),
    ...params,
  });

  const response = await fetch(`${API_URL}${endpoint}?${query}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`Film servisi isteği başarısız oldu (${response.status}).`);
  }

  return response.json();
}

export async function getPopularMovies(page = 1) {
  const data = await request("/movie/popular", { params: { page } });
  return data.results;
}

export async function searchMovies(searchText, page = 1) {
  const data = await request("/search/movie", {
    params: { query: searchText, page },
  });
  return data.results;
}

export function getMovieDetails(id) {
  return request(`/movie/${encodeURIComponent(id)}`);
}

export function getPosterUrl(posterPath) {
  return posterPath ? `${IMAGE_URL}${posterPath}` : null;
}

export async function getFavorites() {
  const data = await request(`/account/${ACCOUNT_ID}/favorite/movies`);
  return data.results;
}

export function addFavorite(movieId) {
  return request(`/account/${ACCOUNT_ID}/favorite`, {
    method: "POST",
    body: { media_type: "movie", media_id: movieId, favorite: true },
  });
}

export function removeFavorite(movieId) {
  return request(`/account/${ACCOUNT_ID}/favorite`, {
    method: "POST",
    body: { media_type: "movie", media_id: movieId, favorite: false },
  });
}
