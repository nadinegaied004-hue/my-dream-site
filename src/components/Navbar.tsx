import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, Moon, Sun, Home } from "lucide-react";

const navItems = [
  { label: "Accueil", path: "/" },
  { label: "Logements", path: "/hotels" },
  { label: "Avis Clients", path: "/avis" },
  { label: "Avis Personnel", path: "/avis-personnel" },
  { label: "Sombre/Clair", path: "#theme" },
  { label: "Langues (3)", path: "#lang" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Home className="text-primary" size={26} />
          <span className="text-2xl font-display font-bold text-primary">StayEase</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            if (item.path === "#theme") {
              return (
                <button key="theme" onClick={toggleTheme} className="nav-link flex items-center gap-1">
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  Sombre/Clair
                </button>
              );
            }
            if (item.path === "#lang") {
              return (
                <button key="lang" className="nav-link flex items-center gap-1">
                  <Globe size={16} />
                  FR
                </button>
              );
            }
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? "nav-link-active" : ""}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/proprietaire" className="btn-outline text-sm !py-2 !px-4">
            Espace Propriétaire
          </Link>
          <Link to="/connexion" className="btn-primary text-sm !py-2 !px-4">
            Se connecter
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-2">
          {navItems.map((item) => {
            if (item.path === "#theme") {
              return (
                <button key="theme" onClick={() => { toggleTheme(); setMobileOpen(false); }} className="block nav-link w-full text-left">
                  {isDark ? "☀ Mode clair" : "🌙 Mode sombre"}
                </button>
              );
            }
            if (item.path === "#lang") return null;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block nav-link ${location.pathname === item.path ? "nav-link-active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-2 pt-2">
            <Link to="/proprietaire" className="btn-outline text-sm !py-2 text-center" onClick={() => setMobileOpen(false)}>
              Espace Propriétaire
            </Link>
            <Link to="/connexion" className="btn-primary text-sm !py-2 text-center" onClick={() => setMobileOpen(false)}>
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
