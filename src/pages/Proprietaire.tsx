import { useState } from "react";
import { Upload, Calendar, Percent, Star, Wrench, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LangContext";

const Proprietaire = () => {
  const { t } = useLang();
  const [photos, setPhotos] = useState<string[]>([]);
  const [annonces, setAnnonces] = useState<{ id: number; titre: string; date: string }[]>([]);
  const [nouvelleAnnonce, setNouvelleAnnonce] = useState({ titre: "", date: "" });
  const [promo, setPromo] = useState({ pourcentage: "", dateDebut: "", dateFin: "" });
  const [celebrites, setCelebrites] = useState("");
  const [renovations, setRenovations] = useState("");

  const handleAddPhoto = () => {
    setPhotos([...photos, `photo_${photos.length + 1}.jpg`]);
  };

  const handleAddAnnonce = () => {
    if (nouvelleAnnonce.titre && nouvelleAnnonce.date) {
      setAnnonces([...annonces, { id: annonces.length + 1, ...nouvelleAnnonce }]);
      setNouvelleAnnonce({ titre: "", date: "" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h2 className="section-title text-center mb-2">{t("Espace Propriétaire")}</h2>
        <p className="text-muted-foreground text-center mb-10">
          {t("Bienvenue")}
        </p>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Photos / Vidéos */}
          <section className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Upload size={18} className="text-primary" />
              {t("Photos / Vidéos du logement")}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {photos.map((p, i) => (
                <span key={i} className="px-3 py-2 bg-muted rounded-lg text-sm">{p}</span>
              ))}
            </div>
            <button
              onClick={handleAddPhoto}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Upload size={16} />
              {t("Télécharger")}
            </button>
          </section>

          {/* Annonces événements */}
          <section className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-primary" />
              {t("Annonces des événements")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{t("Soirées, productions, films, foires, jours nouveaux...")}</p>
            <div className="space-y-2 mb-4">
              {annonces.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium text-sm">{a.titre}</span>
                  <span className="text-xs text-muted-foreground">{a.date}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("Titre de l'événement")}
                value={nouvelleAnnonce.titre}
                onChange={(e) => setNouvelleAnnonce({ ...nouvelleAnnonce, titre: e.target.value })}
                className="input-field flex-1 !py-2 text-sm"
              />
              <input
                type="text"
                placeholder={t("Date (JJ/MM/AAAA)")}
                value={nouvelleAnnonce.date}
                onChange={(e) => setNouvelleAnnonce({ ...nouvelleAnnonce, date: e.target.value })}
                className="input-field w-40 !py-2 text-sm"
              />
              <button onClick={handleAddAnnonce} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                {t("Ajouter")}
              </button>
            </div>
          </section>

          {/* Promotions */}
          <section className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Percent size={18} className="text-primary" />
              {t("Promotions lors des basses saisons")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">{t("Pourcentage (%)")}</label>
                <input
                  type="number"
                  value={promo.pourcentage}
                  onChange={(e) => setPromo({ ...promo, pourcentage: e.target.value })}
                  className="input-field !py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("Du")}</label>
                <input
                  type="text"
                  placeholder="JJ/MM/AAAA"
                  value={promo.dateDebut}
                  onChange={(e) => setPromo({ ...promo, dateDebut: e.target.value })}
                  className="input-field !py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("Jusqu'à")}</label>
                <input
                  type="text"
                  placeholder="JJ/MM/AAAA"
                  value={promo.dateFin}
                  onChange={(e) => setPromo({ ...promo, dateFin: e.target.value })}
                  className="input-field !py-2 text-sm"
                />
              </div>
            </div>
          </section>

          {/* Célébrités */}
          <section className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Star size={18} className="text-primary" />
              {t("Personnes célèbres")}
            </h3>
            <input
              type="text"
              value={celebrites}
              onChange={(e) => setCelebrites(e.target.value)}
              className="input-field !py-2 text-sm"
              placeholder={t("Noms séparés par des virgules")}
            />
          </section>

          {/* Rénovations */}
          <section className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
              <Wrench size={18} className="text-primary" />
              {t("Rénovations récentes")}
            </h3>
            <textarea
              value={renovations}
              onChange={(e) => setRenovations(e.target.value)}
              className="input-field min-h-[80px] text-sm"
              placeholder={t("Décrivez les rénovations")}
            />
          </section>

          {/* Save */}
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            <Save size={18} />
            {t("Mettre à jour")}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Proprietaire;
