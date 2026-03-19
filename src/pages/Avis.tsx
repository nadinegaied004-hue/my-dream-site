import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockReviews = [
  { id: 1, nom: "Ahmed B.", note: 5, avis: "Excellent séjour ! L'hôtel était impeccable et le personnel très accueillant.", date: "12 Mars 2026" },
  { id: 2, nom: "Sarah M.", note: 4, avis: "Très bon logement, propre et bien situé. Je recommande vivement.", date: "8 Mars 2026" },
  { id: 3, nom: "Youssef K.", note: 5, avis: "Une expérience inoubliable. Le service était au top niveau.", date: "5 Mars 2026" },
  { id: 4, nom: "Fatima Z.", note: 3, avis: "Correct dans l'ensemble, mais la localisation pourrait être meilleure.", date: "1 Mars 2026" },
  { id: 5, nom: "Omar L.", note: 5, avis: "Parfait pour un séjour en famille. Les enfants ont adoré.", date: "25 Fév 2026" },
  { id: 6, nom: "Amina R.", note: 4, avis: "Bon rapport qualité/prix. L'accueil était chaleureux.", date: "20 Fév 2026" },
  { id: 7, nom: "Karim D.", note: 4, avis: "Belle vue, chambres spacieuses. Un petit déjeuner copieux.", date: "15 Fév 2026" },
  { id: 8, nom: "Nadia H.", note: 5, avis: "Je reviens chaque année et je ne suis jamais déçue !", date: "10 Fév 2026" },
  { id: 9, nom: "Rachid T.", note: 3, avis: "Séjour agréable mais quelques améliorations à apporter.", date: "5 Fév 2026" },
];

const Stars = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={14} className={i < count ? "fill-primary text-primary" : "text-muted-foreground/30"} />
    ))}
  </div>
);

const Avis = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-10">
      <h2 className="section-title text-center mb-2">Les avis des clients</h2>
      <p className="text-muted-foreground text-center mb-10">Découvrez ce que nos visiteurs pensent</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mockReviews.map((r) => (
          <div key={r.id} className="review-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{r.nom}</span>
              <Stars count={r.note} />
            </div>
            <p className="text-sm text-muted-foreground flex-1">{r.avis}</p>
            <span className="text-xs text-muted-foreground/60">{r.date}</span>
          </div>
        ))}
      </div>

      <div className="auth-container text-center">
        <h3 className="font-display text-xl font-semibold mb-4">Veuillez entrer votre avis</h3>
        <textarea
          className="input-field min-h-[100px] mb-4"
          placeholder="Partagez votre expérience..."
        />
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">Note :</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className="p-1 hover:scale-110 transition-transform">
                <Star size={20} className="text-primary hover:fill-primary" />
              </button>
            ))}
          </div>
        </div>
        <button className="btn-primary">Soumettre mon avis</button>
      </div>
    </main>
    <Footer />
  </div>
);

export default Avis;
