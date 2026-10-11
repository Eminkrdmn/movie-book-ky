const BASE_URL = "https://api.themoviedb.org/3";

export default async function handler(req, res) {
  const token = process.env.TMDB_ACCESS_TOKEN;
  const sessionId = process.env.TMDB_SESSION_ID;
  const accountId = process.env.VITE_TMDB_ACCOUNT_ID;

  if (!token || !sessionId || !accountId) {
    return res.status(500).json({ error: "Sunucu ayarları eksik." });
  }

  const path = [].concat(req.query.path || []).join("/");

  // Sadece uygulamanın kullandığı istekler geçer
  const routes = [
    { method: "GET", pattern: /^movie\/popular$/ },
    { method: "GET", pattern: /^search\/movie$/ },
    { method: "GET", pattern: /^movie\/\d+$/ },
    {
      method: "GET",
      pattern: new RegExp(`^account/${accountId}/favorite/movies$`),
    },
    { method: "POST", pattern: new RegExp(`^account/${accountId}/favorite$`) },
  ];

  const allowed = routes.some(
    (route) => route.method === req.method && route.pattern.test(path),
  );

  if (!allowed) {
    return res.status(404).json({ error: "Bulunamadı." });
  }

  const query = new URLSearchParams(req.query);
  query.delete("path");
  if (path.startsWith("account/")) {
    query.set("session_id", sessionId);
  }

  const response = await fetch(`${BASE_URL}/${path}?${query}`, {
    method: req.method,
    headers: {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
      ...(req.method === "POST" && { "Content-Type": "application/json" }),
    },
    body: req.method === "POST" ? JSON.stringify(req.body) : undefined,
  });

  const data = await response.json();
  res.status(response.status).json(data);
}
