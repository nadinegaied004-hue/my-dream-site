import { useState } from "react";
import { Star, Camera, CheckCircle, Send, Gift, Plus, X, MapPin, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mockReservations = [
  { id: 1, nomLog: "Hôtel El Mouradi Hammamet", periode: "3 nuits", dateDebut: "05/04/2026", dateFin: "08/04/2026", avisEnvoye: true, lieu: "Hammamet, Nabeul" },
  { id: 2, nomLog: "Résidence Marina Yasmine", periode: "5 nuits", dateDebut: "12/04/2026", dateFin: "17/04/2026", avisEnvoye: false, lieu: "Hammamet, Nabeul" },
  { id: 3, nomLog: "Dar El Jeld", periode: "2 nuits", dateDebut: "19/04/2026", dateFin: "21/04/2026", avisEnvoye: false, lieu: "Tunis, Tunisia" },
];

const mockEvenements = [
  { id: 1, nom: "Festival International de Carthage", date: "10/07/2026", lieu: "Amphithéâtre de Carthage" },
  { id: 2, nom: "Match Football - EST vs CSS", date: "15/04/2026", lieu: "Stade Olympique de Radès" },
  { id: 3, nom: "Festival de Jazz de Tabarka", date: "20/06/2026", lieu: "Fort Génois, Tabarka" },
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

// Note sur 20 : questions (14 pts) + commentaire (3 pts) + photos (3 pts)
const calculerNoteSur20 = (questions: Question[], commentaire: string, nbPhotos: number) => {
  const positives = questions.filter(q => {
    if (q.id === "derange") return q.reponse === false;
    return q.reponse === true;
  }).length;
  const baseScore = (positives / questions.length) * 14;
  const commentBonus = commentaire.trim().length > 0 ? 3 : 0;
  const photoBonus = Math.min(nbPhotos, 3);
  return Math.min(20, Math.round(baseScore + commentBonus + photoBonus));
};

const calculerReduction = (noteSur20: number) => {
  if (noteSur20 >= 18) return 15;
  if (noteSur20 >= 14) return 10;
  if (noteSur20 >= 10) return 5;
  return 2;
};

const AvisPersonnel = () => {
  const [activeTab, setActiveTab] = useState<"logement" | "evenement">("logement");
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
  const [selectedEvenement, setSelectedEvenement] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>(questionsInitiales);
  const [photos, setPhotos] = useState<string[]>([]);
  const [commentaire, setCommentaire] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [resultat, setResultat] = useState<{ note20: number; reduction: number } | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState({ attraction: "", evenement: "", details: "" });

  const isDuringStay = (dateDebut: string, dateFin: string) => {
    const today = new Date();
    const debut = new Date(dateDebut.split('/').reverse().join('-'));
    const fin = new Date(dateFin.split('/').reverse().join('-'));
    return today >= debut && today <= fin;
  };

  const isAfterStay = (dateFin: string) => {
    const today = new Date();
    const fin = new Date(dateFin.split('/').reverse().join('-'));
    return today > fin;
  };

  const getSelectedReservationData = () => mockReservations.find(r => r.id === selectedReservation);
  const selectedRes = getSelectedReservationData();
  const canEdit = selectedRes ? !isAfterStay(selectedRes.dateFin) : true;

  const handleReponse = (id: string, val: boolean) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, reponse: val } : q));
  };

  const noteCalculee = () => {
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
    const note20 = calculerNoteSur20(questions, commentaire, photos.length);
    const reduction = calculerReduction(note20);
    setResultat({ note20, reduction });
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setResultat(null);
    setSelectedReservation(null);
    setSelectedEvenement(null);
    setQuestions(questionsInitiales);
    setPhotos([]);
    setCommentaire("");
  };

  const allAnswered = questions.every(q => q.reponse !== null);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h2 className="section-title text-center mb-2">Mon espace avis — Historique</h2>
        <p className="text-muted-foreground text-center mb-8">
          Veuillez répondre avec toute transparence.
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
        {activeTab === "logement" && !selectedReservation && !submitted && (
          <div className="overflow-x-auto rounded-lg border border-border mb-8">
            <table className="hotel-table w-full">
              <thead>
                <tr>
                  <th>Nom du logement</th>
                  <th>Durée</th>
                  <th>Date début</th>
                  <th>Dates (début - fin)</th>
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
                    <td className="text-muted-foreground text-xs">{r.dateDebut} - {r.dateFin}</td>
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
        {activeTab === "evenement" && !selectedEvenement && !submitted && (
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

              {!canEdit && (
                <div className="mb-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    ⏰ Votre séjour est terminé. Vous pouvez uniquement visualiser ce formulaire mais vous ne pouvez plus le modifier.
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.id} className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
                    <span className="text-sm font-medium flex-1">{q.label}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReponse(q.id, true)}
                        disabled={!canEdit}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          q.reponse === true
                            ? "bg-green-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-green-100"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        Oui
                      </button>
                      <button
                        onClick={() => handleReponse(q.id, false)}
                        disabled={!canEdit}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                          q.reponse === false
                            ? "bg-red-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-red-100"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        Non
                      </button>
                    </div>
                  </div>
                ))}
              </div>

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
                  disabled={!canEdit}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed text-sm transition-colors ${
                    canEdit
                      ? "border-border text-muted-foreground hover:border-primary hover:text-primary"
                      : "border-border text-muted-foreground/50 cursor-not-allowed"
                  }`}
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

              {/* Commentaire */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">Vous pouvez vous exprimer librement :</h4>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  disabled={!canEdit}
                  className={`input-field min-h-[80px] ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
                  placeholder="Partagez votre expérience..."
                />
              </div>

              {/* Recommandations du client */}
              <div className="mt-6 border-t border-border pt-6">
                {canEdit && (
                  <button
                    onClick={() => setShowRecommendation(!showRecommendation)}
                    className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus size={16} />
                    Ajouter une recommandation (attractions/événements à proximité)
                  </button>
                )}
                
                {showRecommendation && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-4">
                    <div>
                      <label className="text-sm font-medium block mb-1">Attraction recommandée :</label>
                      <input
                        type="text"
                        value={recommendation.attraction}
                        onChange={(e) => setRecommendation({...recommendation, attraction: e.target.value})}
                        disabled={!canEdit}
                        className="input-field"
                        placeholder="Nom de l'attraction..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Événement recommandé :</label>
                      <input
                        type="text"
                        value={recommendation.evenement}
                        onChange={(e) => setRecommendation({...recommendation, evenement: e.target.value})}
                        disabled={!canEdit}
                        className="input-field"
                        placeholder="Nom de l'événement..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-1">Détails :</label>
                      <textarea
                        value={recommendation.details}
                        onChange={(e) => setRecommendation({...recommendation, details: e.target.value})}
                        disabled={!canEdit}
                        className="input-field min-h-[60px]"
                        placeholder="Pourquoi recommandez-vous cet endroit/événement..."
                      />
                    </div>
                    <button
                      onClick={() => setShowRecommendation(false)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} className="inline mr-1" /> Masquer
                    </button>
                  </div>
                )}
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

              {/* Message des points cadeau */}
              {allAnswered && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                    <Gift size={16} />
                    <span>En remplissant ce formulaire, vous pouvez profiter de <strong>{resultat ? resultat.reduction : 0}% de réduction</strong> sur votre prochaine réservation !</span>
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 mt-6">
                {allAnswered && resultat && (
                  <div className="flex-1 p-3 rounded-lg bg-primary/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Note du site</p>
                    <div className="flex items-center justify-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={i < noteCalculee() ? "fill-primary text-primary" : "text-muted-foreground/30"}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-primary">{noteCalculee()}/5 ({resultat.note20}/20)</span>
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || !canEdit}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
                    allAnswered && canEdit
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  <Send size={16} />
                  {canEdit ? "Valider le formulaire" : "Formulaire verrouillé"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation avec bonus */}
        {submitted && resultat && (
          <div className="max-w-lg mx-auto text-center py-12">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
            <h3 className="font-display text-xl font-semibold mb-2">Merci beaucoup !</h3>
            <p className="text-muted-foreground mb-6">
              Votre avis a été enregistré avec succès.
            </p>

            {/* Points bonus & réduction */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Gift size={24} />
                <span className="font-display text-lg font-semibold">Vos récompenses</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">Note obtenue</p>
                  <p className="text-2xl font-bold text-primary">{resultat.note20}/20</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <p className="text-sm text-muted-foreground mb-1">Réduction obtenue</p>
                  <p className="text-2xl font-bold text-green-600">-{resultat.reduction}%</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                🎁 Votre réduction de <strong>{resultat.reduction}%</strong> sera appliquée automatiquement sur votre prochaine réservation.
              </p>

              <div className="text-xs text-muted-foreground/60 space-y-1">
                <p>📝 Commentaire : +3 pts | 📸 Photos : +1 pt/photo (max 3)</p>
                <p>≥18/20 → 15% | ≥14/20 → 10% | ≥10/20 → 5% | &lt;10/20 → 2%</p>
              </div>
            </div>

            <button onClick={handleReset} className="btn-primary mt-6">
              Retour à l'historique
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AvisPersonnel;
