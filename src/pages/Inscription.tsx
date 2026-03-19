import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Inscription = () => {
  const [form, setForm] = useState({
    email: "", password: "", nom: "", confirmPassword: "", age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle registration
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="auth-container w-full">
          <h2 className="section-title text-2xl text-center mb-2">Créer un compte</h2>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Rejoignez StayEase pour une expérience personnalisée
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Adresse e-mail</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="votre@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nom complet</label>
              <input name="nom" type="text" value={form.nom} onChange={handleChange} className="input-field" placeholder="Votre nom complet" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field" placeholder="••••••••" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmer le mot de passe</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="input-field" placeholder="••••••••" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Âge</label>
              <select name="age" value={form.age} onChange={handleChange} className="input-field" required>
                <option value="">Sélectionner</option>
                {Array.from({ length: 83 }, (_, i) => i + 18).map((age) => (
                  <option key={age} value={age}>{age} ans</option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn-primary w-full mt-2">Valider</button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Vous avez déjà un compte ?{" "}
            <Link to="/connexion" className="text-primary font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Inscription;
