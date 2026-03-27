import { useState, useMemo, useEffect } from "react";
import { Star, MapPin, Filter } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLang } from "@/context/LangContext";

const calculerNoteSur20 = (reponses: { positives: number; total: number; aCommentaire: boolean; nbPhotos: number }) => {
  const baseScore = (reponses.positives / reponses.total) * 14;
  const commentBonus = reponses.aCommentaire ? 3 : 0;
  const photoBonus = Math.min(reponses.nbPhotos, 3);
  return Math.min(20, Math.round(baseScore + commentBonus + photoBonus));
};

const calculerReduction = (noteSur20: number) => {
  if (noteSur20 >= 18) return 15;
  if (noteSur20 >= 14) return 10;
  if (noteSur20 >= 10) return 5;
  return 2;
};

const mockReviews = [
  {
    id: 1, nomComplet: "Ahmed Ben Salah", note: 5,
    noteSur20: calculerNoteSur20({ positives: 8, total: 9, aCommentaire: true, nbPhotos: 2 }),
    avis: "Excellent séjour à Hammamet ! L'hôtel était impeccable et le personnel très accueillant.",
    date: "12 Mars 2026", photo: null, reduction: 0,
    lieu: "Hôtel El Mouradi Hammamet, Hammamet, Nabeul, Tunisia",
    typeLogement: "Hôtel",
  },
  {
    id: 2, nomComplet: "Sarah Mansouri", note: 4,
    noteSur20: calculerNoteSur20({ positives: 7, total: 9, aCommentaire: true, nbPhotos: 1 }),
    avis: "Très bon logement à Sidi Bou Saïd, propre et bien situé. Je recommande vivement.",
    date: "8 Mars 2026", photo: null, reduction: 0,
    lieu: "Maison Sidi Bou Saïd, Sidi Bou Saïd, Tunis, Tunisia",
    typeLogement: "Maison",
  },
  {
    id: 3, nomComplet: "Youssef Hammami", note: 5,
    noteSur20: calculerNoteSur20({ positives: 9, total: 9, aCommentaire: true, nbPhotos: 3 }),
    avis: "Une expérience inoubliable à Djerba. Le service était au top niveau.",
    date: "5 Mars 2026", photo: null, reduction: 0,
    lieu: "Villa Djerba Heritage, Djerba, Medenine, Tunisia",
    typeLogement: "Maison",
  },
  {
    id: 4, nomComplet: "Fatima Trabelsi", note: 3,
    noteSur20: calculerNoteSur20({ positives: 5, total: 9, aCommentaire: true, nbPhotos: 0 }),
    avis: "Correct dans l'ensemble, mais la localisation à Sousse pourrait être meilleure.",
    date: "1 Mars 2026", photo: null, reduction: 0,
    lieu: "Hôtel Sheraton Sousse, Sousse, Sousse, Tunisia",
    typeLogement: "Hôtel",
  },
  {
    id: 5, nomComplet: "Omar Khelifi", note: 5,
    noteSur20: calculerNoteSur20({ positives: 8, total: 9, aCommentaire: true, nbPhotos: 2 }),
    avis: "Parfait pour un séjour en famille à Tozeur. Les enfants ont adoré.",
    date: "25 Fév 2026", photo: null, reduction: 0,
    lieu: "Dar Essalem Tozeur, Tozeur, Tozeur, Tunisia",
    typeLogement: "Maison d'hôtes",
  },
  {
    id: 6, nomComplet: "Amina Cherif", note: 4,
    noteSur20: calculerNoteSur20({ positives: 7, total: 9, aCommentaire: false, nbPhotos: 1 }),
    avis: "Bon rapport qualité/prix à Zaghouan. L'accueil était chaleureux.",
    date: "20 Fév 2026", photo: null, reduction: 0,
    lieu: "Dar Zaghouan, Zaghouan, Zaghouan, Tunisia",
    typeLogement: "Maison d'hôtes",
  },
  {
    id: 7, nomComplet: "Karim Gharbi", note: 4,
    noteSur20: calculerNoteSur20({ positives: 7, total: 9, aCommentaire: true, nbPhotos: 0 }),
    avis: "Belle vue sur la Médina de Tunis, chambres spacieuses. Un petit déjeuner copieux.",
    date: "15 Fév 2026", photo: null, reduction: 0,
    lieu: "Hôtel Laico Tunis, Tunis, Tunisia",
    typeLogement: "Hôtel",
  },
  {
    id: 8, nomComplet: "Nadia Bouzid", note: 5,
    noteSur20: calculerNoteSur20({ positives: 9, total: 9, aCommentaire: true, nbPhotos: 2 }),
    avis: "Je reviens chaque année à Sidi Bou Saïd et je ne suis jamais déçue !",
    date: "10 Fév 2026", photo: null, reduction: 0,
    lieu: "Maison Sidi Bou Saïd, Sidi Bou Saïd, Tunis, Tunisia",
    typeLogement: "Maison",
  },
  {
    id: 9, nomComplet: "Rachid Sassi", note: 3,
    noteSur20: calculerNoteSur20({ positives: 4, total: 9, aCommentaire: true, nbPhotos: 0 }),
    avis: "Séjour agréable à Testour mais quelques améliorations à apporter.",
    date: "5 Fév 2026", photo: null, reduction: 0,
    lieu: "Ferme Bio Testour, Testour, Béja, Tunisia",
    typeLogement: "Ferme",
  },
  {
    id: 10, nomComplet: "Leila Bouazizi", note: 4,
    noteSur20: calculerNoteSur20({ positives: 7, total: 9, aCommentaire: true, nbPhotos: 1 }),
    avis: "Séjour parfait dans cette ferme oleicole. Le calme et la nature au rendez-vous.",
    date: "28 Jan 2026", photo: null, reduction: 0,
    lieu: "Ferme Oléicole Sfax, Sfax, Sfax, Tunisia",
    typeLogement: "Ferme",
  },
].map(r => ({ ...r, reduction: calculerReduction(r.noteSur20) }));

const categories = ["Hôtel", "Maison", "Maison d'hôtes", "Ferme"];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < count ? "fill-primary text-primary" : "text-muted-foreground/30"} />
    ))}
  </div>
);

const NoteBar = ({ note }: { note: number }) => {
  const color = note >= 16 ? "bg-green-500" : note >= 12 ? "bg-primary" : note >= 8 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(note / 20) * 100}%` }} />
      </div>
      <span className="text-sm font-bold">{note}/20</span>
    </div>
  );
};

const Avis = () => {
  const { t } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const typeFilter = searchParams.get("type");
  const logementFilter = searchParams.get("logement");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(typeFilter || null);
  const [localReviews, setLocalReviews] = useState<typeof mockReviews>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("stayease_reviews") || "[]");
    setLocalReviews(stored);
  }, []);

  const allReviews = useMemo(() => {
    return [...localReviews, ...mockReviews];
  }, [localReviews]);

  const handleFilter = (category: string | null) => {
    setSelectedCategory(category);
    // Clear URL params when selecting a category from buttons
    if (category) {
      navigate(`/avis?type=${encodeURIComponent(category)}`, { replace: true });
    } else {
      navigate("/avis", { replace: true });
    }
  };

  const filteredReviews = useMemo(() => {
    let results = [...allReviews];
    if (selectedCategory) {
      results = results.filter(r => r.typeLogement === selectedCategory);
    }
    if (logementFilter) {
      results = results.filter(r => r.lieu && r.lieu.toLowerCase().includes(logementFilter.toLowerCase()));
    }
    return [...results].sort((a, b) => {
      const catCompare = (a.typeLogement || "").localeCompare(b.typeLogement || "", "fr");
      if (catCompare !== 0) return catCompare;
      return (a.nomComplet || "").localeCompare(b.nomComplet || "", "fr");
    });
  }, [selectedCategory, logementFilter, allReviews]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h2 className="section-title text-center mb-2">{t("Les avis des clients")}</h2>
        <p className="text-muted-foreground text-center mb-6">{t("Découvrez ce que nos visiteurs pensent")}</p>

        {/* Filter by housing type */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <button
            onClick={() => handleFilter(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {t("Tous")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(selectedCategory === cat ? null : cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredReviews.map((r) => (
            <div key={r.id} className="review-card flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {r.nomComplet.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="font-semibold block">{r.nomComplet}</span>
                  <Stars count={r.note} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin size={12} className="text-primary shrink-0" />
                <span>{t(r.lieu.split(",")[0])}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{t(r.typeLogement)}</span>
              </div>
              <NoteBar note={r.noteSur20} />
              <p className="text-sm text-muted-foreground flex-1">{r.avis}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/60">{r.date}</span>
                {r.reduction > 0 && (
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                    -{r.reduction}% {t("obtenu")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="auth-container text-center">
          <h3 className="font-display text-xl font-semibold mb-4">{t("Veuillez entrer votre avis")}</h3>
          <p className="text-muted-foreground mb-6">
            {t("Sélectionnez le logement")}
          </p>
          <Link
            to="/avis-personnel"
            className="btn-primary inline-flex items-center gap-2"
          >
            {t("Accéder à mon historique")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Avis;
