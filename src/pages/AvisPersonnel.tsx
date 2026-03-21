import { useState } from "react";
import { Star, Camera, CheckCircle, XCircle, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockReservations = [
  { id: 1, nomLog: "Hôtel Royal Palace", periode: "3 nuits", dateDebut: "05/04/2026", avisEnvoye: true },
  { id: 2, nomLog: "Résidence Marina", periode: "5 nuits", dateDebut: "12/04/2026", avisEnvoye: false },
  { id: 3, nomLog: "Riad Les Oliviers", periode: "2 nuits", dateDebut: "19/04/2026", avisEnvoye: false },
];

const mockEvenements = [
  { id: 1, nom: "Festival International de Marrakech", date: "10/04/2026", lieu: "Palais des Congrès" },
  { id: 2, nom: "Match Football - Raja vs Wydad", date: "15/04/2026", lieu: "Stade Mohammed V" },
  { id: 3, nom: "Exposition Art Contemporain", date: "20/04/2026", lieu: "Musée MACMA" },
];

type Question = { id: string; label: string; reponse: boolean | null };

const questionsInitiales: Question[] = [
  { id: "experience", label: "L'expérience était bonne ?", reponse: null },
  { id: "logement", label: "Le logement était bon ?", reponse: null },
  { id: "evenement", label: "S'il y a eu un événement, il a été bon ?", reponse: null },
  { id: "description", label: "Le logement respecte la description établie par le propriétaire ?", reponse: null },
  { id: "comportement", label: "Le comportement du propriétaire était bon ?", reponse: null },
  { id: "localisation", label: "La localisation était bien précisée ?", reponse: null },
  { id: "securise", label: "C'était bien sécurisé ?", reponse: null },
  { id: "propre", label: "C'était propre ?", reponse: null },
  { id: "derange", label: "Quelque chose vous a dérangé (bruit, etc.) ?", reponse: null },
];

const AvisPersonnel = () => {
  const [activeTab, setActiveTab] = useState<"logement" | "evenement">("logement");
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
  const [selectedEvenement, setSelectedEvenement] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>(questionsInitiales);
  const [photos, setPhotos] = useState<string[]>([]);
  const [commentaire, setCommentaire] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleReponse = (id: string, val: boolean) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, reponse: val } : q));
  };

  const noteCalculee = () => {
    const answered = questions.filter(q => q.reponse !== null);
    if (answered.length === 0) return 0;
    const positives = questions.filter(q => {
      if (q.id === "derange") return q.reponse === false;
      return q.reponse === true;
    }).length;
    return Math.round((positives / questions.length) * 5);
  };

  const handlePhotoUpload = () => {
    setPhotos([...photos, `photo_${photos.length + 1}.jpg`]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedReservation(null);
      setSelectedEvenement(null);
      setQuestions(questionsInitiales);
      setPhotos([]);
      setCommentaire("");
    }, 3000);
  };

  const allAnswered = questions.every(q => q.reponse !== null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h2 className="section-title text-center mb-2">Mon espace avis</h2>
        <p className="text-muted-foreground text-center mb-8">
          Veuillez répondre avec toute transparence. Votre identité ne sera pas révélée.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => { setActiveTab("logement"); setSelectedEvenement(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "logement" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Avis sur un logement
          </button>
          <button
            onClick={() => { setActiveTab("evenement"); setSelectedReservation(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "evenement" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            Avis sur un événement
          </button>
        </div>

        {/* Reservation table */}
        {activeTab === "logement" && !selectedReservation && (
          <div className="overflow-x-auto rounded-lg border border-border mb-8">
            <table className="hotel-table w-full">
              <thead>
                <tr>
                  <th>Nom du logement</th>
                  <th>Période</th>
                  <th>Date début</th>
                  <th>Avis envoyé</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {mockReservations.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.nomLog}</td>
                    <td className="text-muted-foreground">{r.periode}</td>
                    <td className="text-muted-foreground">{r.dateDebut}</td>
                    <td>
                      {r.avisEnvoye ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle size={12} /> Envoyé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                          En attente
                        </span>
                      )}
                    </td>
                    <td>
                      {!r.avisEnvoye && (
                        <button
                          onClick={() => setSelectedReservation(r.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          Donner mon avis
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Event selection */}
        {activeTab === "evenement" && !selectedEvenement && (
          <div className="max-w-2xl mx-auto">
            <h3 className="font-display font-semibold text-lg mb-4">Sélectionnez l'événement sur lequel vous voulez donner votre avis</h3>
            <div className="space-y-3">
              {mockEvenements.map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEvenement(evt.id)}
                  className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <div className="font-semibold">{evt.nom}</div>
                  <div className="text-sm text-muted-foreground">{evt.date} — {evt.lieu}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Questionnaire */}
        {(selectedReservation || selectedEvenement) && !submitted && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display font-semibold text-lg mb-1">Questionnaire d'évaluation</h3>
              <p className="text-sm text-muted-foreground mb-6">⚠ Tous les champs sont obligatoires</p>

              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                    <span className="text-sm font-medium flex-1">{q.label}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReponse(q.id, true)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          q.reponse === true
                            ? "bg-green-600 text-white"
                            : "bg-muted text-foreground hover:bg-green-100"
                        }`}
                      >
                        Oui
                      </button>
                      <button
                        onClick={() => handleReponse(q.id, false)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          q.reponse === false
                            ? "bg-red-600 text-white"
                            : "bg-muted text-foreground hover:bg-red-100"
                        }`}
                      >
                        Non
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Si localisation non précisée */}
              {questions.find(q => q.id === "localisation")?.reponse === false && (
                <div className="mt-4 p-3 rounded-lg bg-accent/50 text-sm text-accent-foreground">
                  📍 Si non, voici la carte — vous pourrez préciser l'emplacement exact.
                </div>
              )}

              {/* Photos */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Si vous avez pris des photos :</h4>
                <button
                  onClick={handlePhotoUpload}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Camera size={16} />
                  Télécharger des photos
                </button>
                {photos.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {photos.map((p, i) => (
                      <span key={i} className="px-2 py-1 bg-muted rounded text-xs">{p}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Commentaire libre */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Vous pouvez vous exprimer librement :</h4>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  className="input-field min-h-[80px]"
                  placeholder="Partagez votre expérience..."
                />
              </div>

              {/* Note calculée */}
              {allAnswered && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Note attribuée automatiquement</p>
                  <div className="flex items-center justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className={i < noteCalculee() ? "fill-primary text-primary" : "text-muted-foreground/30"}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-primary">{noteCalculee()}/5</span>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
                  allAnswered
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                <Send size={16} />
                Valider le formulaire
              </button>
            </div>
          </div>
        )}

        {/* Confirmation */}
        {submitted && (
          <div className="max-w-md mx-auto text-center py-12">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
            <h3 className="font-display text-xl font-semibold mb-2">Merci beaucoup !</h3>
            <p className="text-muted-foreground">
              Votre avis a été enregistré avec succès. Vous contribuez à améliorer l'expérience pour tous.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AvisPersonnel;
