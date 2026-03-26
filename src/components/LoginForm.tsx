import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/context/LangContext";

interface LoginFormProps {
  onLoginSuccess?: (user: { id: number; nom: string; email: string; role: string }) => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const { t } = useLang();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulation de connexion (à remplacer par vrai appel API)
    // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    
    try {
      // Simuler un utilisateur connecté
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ICI: Appel API réel sera:
      // const response = await fetch(`${API_URL}/api/auth/login`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();
      
      // Pour l'instant, simulation:
      const mockUser = {
        id: 1,
        nom: formData.email.split('@')[0],
        email: formData.email,
        role: formData.email.includes('proprio') ? 'proprietaire' : 'client'
      };
      
      // Stocker dans localStorage
      localStorage.setItem("stayease_user", JSON.stringify(mockUser));
      
      if (onLoginSuccess) {
        onLoginSuccess(mockUser);
      }
      
      // Redirection selon le rôle
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-background rounded-lg border border-border">
      <h2 className="text-2xl font-display font-bold text-center mb-6">{t("Connexion")}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("Email")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="email@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("Mot de passe")}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="input-field w-full"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? t("Connexion en cours...") : t("Se connecter")}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>{t("Pas de compte?")} <a href="/inscription" className="text-primary hover:underline">{t("S'inscrire")}</a></p>
      </div>
    </div>
  );
};

export default LoginForm;