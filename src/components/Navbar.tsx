import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, Moon, Sun, Home } from "lucide-react";

const navItems = [
  { label: "Accueil", path: "/" },
  { label: "Logements", path: "/hotels" },
  { label: "Avis Clients", path: "/avis" },
  { label: "Avis Personnel", path: "/avis-personnel" },
  { label: "Sombre/Clair", path: "#theme" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [currentLang, setCurrentLang] = useState("FR");
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const languages = [
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "EN", name: "English", flag: "🇬🇧" },
    { code: "AR", name: "العربية", flag: "🇸🇦" },
  ];

  const translations: Record<string, Record<string, string>> = {
    FR: {
      "Accueil": "Accueil",
      "Logements": "Logements",
      "Avis Clients": "Avis Clients",
      "Avis Personnel": "Avis Personnel",
      "Sombre/Clair": "Sombre/Clair",
    },
    EN: {
      "Accueil": "Home",
      "Logements": "Accommodations",
      "Avis Clients": "Client Reviews",
      "Avis Personnel": "Personal Reviews",
      "Sombre/Clair": "Dark/Light",
    },
    AR: {
      "Accueil": "الرئيسية",
      "Logements": "الإقامة",
      "Avis Clients": "آراء العملاء",
      "Avis Personnel": "آراء شخصية",
      "Sombre/Clair": "داكن/فاتح",
    },
  };

  const t = (key: string) => translations[currentLang]?.[key] || key;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Home className="text-primary" size={26} />
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
              {t(item.label)}
            </Link>
          ))}
          <button onClick={toggleTheme} className="nav-link flex items-center gap-1">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {t("Sombre/Clair")}
          </button>
          <div className="relative">
            <button onClick={() => setShowLangMenu(!showLangMenu)} className="nav-link flex items-center gap-1">
              <Globe size={16} />
              {currentLang}
            </button>
            {showLangMenu && (
              <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg py-1 min-w-32 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setCurrentLang(lang.code); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-muted text-sm ${currentLang === lang.code ? "font-bold" : ""}`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
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
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block nav-link ${location.pathname === item.path ? "nav-link-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {t(item.label)}
            </Link>
          ))}
          <button onClick={() => { toggleTheme(); setMobileOpen(false); }} className="block nav-link w-full text-left">
            {isDark ? "☀ Mode clair" : "🌙 Mode sombre"}
          </button>
          <div className="border-t border-border pt-2">
            <p className="text-xs text-muted-foreground mb-1">Langue:</p>
            <div className="flex gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setCurrentLang(lang.code); setMobileOpen(false); }}
                  className={`px-3 py-1 rounded text-sm ${currentLang === lang.code ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {lang.flag} {lang.code}
                </button>
              ))}
            </div>
          </div>
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
