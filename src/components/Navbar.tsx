import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Globe, Moon, Sun, Home, User, LogOut } from "lucide-react";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { labelKey: "Accueil", path: "/" },
  { labelKey: "Logements", path: "/hotels" },
  { labelKey: "Avis Clients", path: "/avis" },
  { labelKey: "Avis Personnel", path: "/avis-personnel" },
];

const Navbar = () => {
  const { t, language, setLanguage } = useLang();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const languages = [
    { code: "FR" as const, name: "Français", flag: "🇫🇷" },
    { code: "EN" as const, name: "English", flag: "🇬🇧" },
    { code: "AR" as const, name: "العربية", flag: "🇸🇦" },
  ];

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
              {t(item.labelKey)}
            </Link>
          ))}
          <button onClick={toggleTheme} className="nav-link flex items-center gap-1">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? t("Mode clair") : t("Mode sombre")}
          </button>
          <div className="relative">
            <button onClick={() => setShowLangMenu(!showLangMenu)} className="nav-link flex items-center gap-1">
              <Globe size={16} />
              {language}
            </button>
            {showLangMenu && (
              <div className="absolute right-0 top-full mt-1 bg-background border border-border rounded-lg shadow-lg py-1 min-w-32 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                    className={`w-full text-left px-4 py-2 hover:bg-muted text-sm ${language === lang.code ? "font-bold" : ""}`}
                  >
                    {lang.flag} {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <User size={16} />
                <span className="text-sm font-medium">{user.nom}</span>
                {user.role === "proprietaire" && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">{t("Propriétaire")}</span>
                )}
              </div>
              <button onClick={handleLogout} className="btn-outline text-sm !py-2 !px-4 flex items-center gap-1">
                <LogOut size={16} />
                {t("Déconnexion")}
              </button>
            </>
          ) : (
            <>
              <Link to="/proprietaire" className="btn-outline text-sm !py-2 !px-4">
                {t("Espace Propriétaire")}
              </Link>
              <Link to="/connexion" className="btn-primary text-sm !py-2 !px-4">
                {t("Se connecter")}
              </Link>
            </>
          )}
        </div>

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
              {t(item.labelKey)}
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
                  onClick={() => { setLanguage(lang.code); setMobileOpen(false); }}
                  className={`px-3 py-1 rounded text-sm ${language === lang.code ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                >
                  {lang.flag} {lang.code}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <User size={16} />
                  <span className="font-medium">{user.nom}</span>
                </div>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn-outline text-sm !py-2 text-center">
                  {t("Déconnexion")}
                </button>
              </>
            ) : (
              <>
                <Link to="/proprietaire" className="btn-outline text-sm !py-2 text-center" onClick={() => setMobileOpen(false)}>
                  {t("Espace Propriétaire")}
                </Link>
                <Link to="/connexion" className="btn-primary text-sm !py-2 text-center" onClick={() => setMobileOpen(false)}>
                  {t("Se connecter")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;