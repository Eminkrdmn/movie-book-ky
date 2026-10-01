import { Link, NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Favorites.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";

function App() {
  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">
          Movie Book
        </Link>
        <nav aria-label="Ana menü">
          <NavLink to="/">Ana sayfa</NavLink>
          <NavLink to="/favorites">Favoriler</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
