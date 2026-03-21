import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Connexion = () => {
  const [form, setForm] = useState({ nom: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: handle login
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="auth-container w-full">
          <h2 className="section-title text-2xl text-center mb-2">Se connecter</h2>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Accédez à votre espace personnel
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom complet</label>
              <input name="nom" type="text" value={form.nom} onChange={handleChange} className="input-field" placeholder="Votre nom complet" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field" placeholder="••••••••" required />
            </div>

            <button type="submit" className="btn-primary w-full mt-2">Se connecter</button>
          </form>

          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Connexion;
