import { Star, User } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Formule de note sur 20 : chaque question vaut des points, bonus pour commentaire et photos
const calculerNoteSur20 = (reponses: { positives: number; total: number; aCommentaire: boolean; nbPhotos: number }) => {
  const baseScore = (reponses.positives / reponses.total) * 14; // 14 pts max pour les questions
  const commentBonus = reponses.aCommentaire ? 3 : 0; // 3 pts pour un commentaire
  const photoBonus = Math.min(reponses.nbPhotos, 3); // 1 pt par photo, max 3 pts
  return Math.min(20, Math.round(baseScore + commentBonus + photoBonus));
};

// Formule de réduction : les clients ayant donné un avis reçoivent un % de réduction
const calculerReduction = (noteSur20: number) => {
  if (noteSur20 >= 18) return 15; // 15% pour les notes excellentes
  if (noteSur20 >= 14) return 10; // 10% pour les bonnes notes
  if (noteSur20 >= 10) return 5;  // 5% pour les notes moyennes
  return 2; // 2% minimum pour avoir participé
};

const mockReviews = [
  {
    id: 1, nomComplet: "Ahmed Benjelloun", note: 5,
    noteSur20: calculerNoteSur20({ positives: 8, total: 9, aCommentaire: true, nbPhotos: 2 }),
    avis: "Excellent séjour ! L'hôtel était impeccable et le personnel très accueillant.",
    date: "12 Mars 2026", photo: null,
    reduction: 0,
  },
  {
    id: 2, nomComplet: "Sarah Mansouri", note: 4,
    noteSur20: calculerNoteSur20({ positives: 7, total: 9, aCommentaire: true, nbPhotos: 1 }),
    avis: "Très bon logement, propre et bien situé. Je recommande vivement.",
    date: "8 Mars 2026", photo: null,
    reduction: 0,
  },
  {
    id: 3, nomComplet: "Youssef Khaldoun", note: 5,
    noteSur20: calculerNoteSur20({ positives: 9, total: 9, aCommentaire: true, nbPhotos: 3 }),
    avis: "Une expérience inoubliable. Le service était au top niveau.",
    date: "5 Mars 2026", photo: null,
    reduction: 0,
  },
  {
    id: 4, nomComplet: "Fatima Zahra Idrissi", note: 3,
    noteSur20: calculerNoteSur20({ positives: 5, total: 9, aCommentaire: true, nbPhotos: 0 }),
    avis: "Correct dans l'ensemble, mais la localisation pourrait être meilleure.",
    date: "1 Mars 2026", photo: null,
    reduction: 0,
  },
  {
    id: 5, nomComplet: "Omar Laaroussi", note: 5,
    noteSur20: calculerNoteSur20({ positives: 8, total: 9, aCommentaire: true, nbPhotos: 2 }),
    avis: "Parfait pour un séjour en famille. Les enfants ont adoré.",
    date: "25 Fév 2026", photo: null,
    reduction: 0,
  },
  {
    id: 6, nomComplet: "Amina Rahmani", note: 4,
    noteSur20: calculerNoteSur20({ positives: 7, total: 9, aCommentaire: false, nbPhotos: 1 }),
    avis: "Bon rapport qualité/prix. L'accueil était chaleureux.",
    date: "20 Fév 2026", photo: null,
    reduction: 0,
  },
  {
    id: 7, nomComplet: "Karim Daoudi", note: 4,
    noteSur20: calculerNoteSur20({ positives: 7, total: 9, aCommentaire: true, nbPhotos: 0 }),
    avis: "Belle vue, chambres spacieuses. Un petit déjeuner copieux.",
    date: "15 Fév 2026", photo: null,
    reduction: 0,
  },
  {
    id: 8, nomComplet: "Nadia Hassani", note: 5,
    noteSur20: calculerNoteSur20({ positives: 9, total: 9, aCommentaire: true, nbPhotos: 2 }),
    avis: "Je reviens chaque année et je ne suis jamais déçue !",
    date: "10 Fév 2026", photo: null,
    reduction: 0,
  },
  {
    id: 9, nomComplet: "Rachid Tahiri", note: 3,
    noteSur20: calculerNoteSur20({ positives: 4, total: 9, aCommentaire: true, nbPhotos: 0 }),
    avis: "Séjour agréable mais quelques améliorations à apporter.",
    date: "5 Fév 2026", photo: null,
    reduction: 0,
  },
].map(r => ({ ...r, reduction: calculerReduction(r.noteSur20) }));

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

const Avis = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 container mx-auto px-4 py-10">
      <h2 className="section-title text-center mb-2">Les avis des clients</h2>
      <p className="text-muted-foreground text-center mb-10">Découvrez ce que nos visiteurs pensent</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {mockReviews.map((r) => (
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
            <NoteBar note={r.noteSur20} />
            <p className="text-sm text-muted-foreground flex-1">{r.avis}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60">{r.date}</span>
              {r.reduction > 0 && (
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  -{r.reduction}% obtenu
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CTA qui redirige vers l'historique des réservations */}
      <div className="auth-container text-center">
        <h3 className="font-display text-xl font-semibold mb-4">Veuillez entrer votre avis</h3>
        <p className="text-muted-foreground mb-6">
          Sélectionnez le logement ou l'événement sur lequel vous voulez donner votre avis
        </p>
        <Link
          to="/avis-personnel"
          className="btn-primary inline-flex items-center gap-2"
        >
          Accéder à mon historique de réservations
        </Link>
      </div>
    </main>
    <Footer />
  </div>
);

export default Avis;
