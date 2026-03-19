import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, Moon, Sun } from "lucide-react";

const navItems = [
  { label: "Accueil", path: "/" },
  { label: "Types de logement", path: "/hotels" },
  { label: "Avis Clients", path: "/avis" },
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
          <span className="text-2xl font-display font-bold text-primary">StayEase</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? "nav-link-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-1 text-sm">
            <Globe size={18} />
            <span>FR</span>
          </button>
          <Link to="/connexion" className="btn-outline text-sm !py-2 !px-4">
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
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block nav-link ${location.pathname === item.path ? "nav-link-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-muted">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/connexion" className="btn-primary text-sm !py-2" onClick={() => setMobileOpen(false)}>
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
