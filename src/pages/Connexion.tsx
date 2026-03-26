import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LangContext";
import { useAuth } from "@/context/AuthContext";

const Connexion = () => {
  const { t } = useLang();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulation de connexion (à remplacer par vrai appel API)
    // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pour la démo, accepter n'importe quel email/password
      // En production: vérifier avec le serveur
      const mockUser = {
        id: 1,
        nom: form.email.split('@')[0],
        email: form.email,
        role: form.email.includes('proprio') ? 'proprietaire' as const : 'client' as const
      };
      
      login(mockUser);
      
      if (mockUser.role === "proprietaire") {
        navigate("/proprietaire");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(t("Email ou mot de passe incorrect"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="auth-container w-full max-w-md">
          <h2 className="section-title text-2xl text-center mb-2">{t("Se connecter_title")}</h2>
          <p className="text-muted-foreground text-center text-sm mb-8">
            {t("Accédez à votre espace personnel")}
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("Email")}</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                className="input-field" 
                placeholder="email@example.com" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("Mot de passe")}</label>
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                className="input-field" 
                placeholder="••••••••" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50"
            >
              {loading ? t("Connexion en cours...") : t("Se connecter")}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {t("Pas de compte?")} <a href="#" className="text-primary hover:underline">{t("S'inscrire")}</a>
          </p>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              {t("Compte démo")}: <br />
              {t("Client")}: client@test.com<br />
              {t("Propriétaire")}: proprio@test.com
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Connexion;