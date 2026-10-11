import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/tmdb": {
          target: "https://api.themoviedb.org",
          changeOrigin: true,
          headers: { Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}` },
          rewrite: (path) => {
            const url = new URL(
              path.replace("/api/tmdb", "/3"),
              "http://local",
            );
            if (url.pathname.startsWith("/3/account/")) {
              url.searchParams.set("session_id", env.TMDB_SESSION_ID);
            }
            return url.pathname + url.search;
          },
        },
      },
    },
  };
});
