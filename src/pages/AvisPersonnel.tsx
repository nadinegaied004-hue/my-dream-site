import { useState, useMemo } from "react";
import { Star, Camera, CheckCircle, Send, Gift, Plus, X, MapPin, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LangContext";

const mockReservations = [
  { id: 1, nomLog: "Hôtel El Mouradi Hammamet", periode: "3 nuits", dateDebut: "05/04/2026", dateFin: "08/04/2026", avisEnvoye: true, lieu: "Hammamet, Nabeul", evenements: ["Festival de Carthage", "Festival de Hammamet"], attractions: ["Stade Olympique de Radès", "Parc du Belvédère"] },
  { id: 2, nomLog: "Résidence Marina Yasmine", periode: "5 nuits", dateDebut: "12/04/2026", dateFin: "17/04/2026", avisEnvoye: false, lieu: "Hammamet, Nabeul", evenements: ["Festival de Carthage", "Football"], attractions: ["Stade Olympique de Radès", "Foire Internationale de Tunis"] },
  { id: 3, nomLog: "Dar El Jeld", periode: "2 nuits", dateDebut: "19/04/2026", dateFin: "21/04/2026", avisEnvoye: false, lieu: "Tunis, Tunisia", evenements: ["Festival de Carthage", "Journées Cinématographiques"], attractions: ["Parc du Belvédère", "Centre commercial Tunisia Mall"] },
];

const mockEvenements = [
  { id: 1, nom: "Festival International de Carthage", date: "10/07/2026", lieu: "Amphithéâtre de Carthage" },
  { id: 2, nom: "Match Football - EST vs CSS", date: "15/04/2026", lieu: "Stade Olympique de Radès" },
  { id: 3, nom: "Festival de Jazz de Tabarka", date: "20/06/2026", lieu: "Fort Génois, Tabarka" },
];

type Question = { id: string; labelKey: string; reponse: string | boolean | null; type: "yesNo" | "experience" | "comportement" | "events" };

const questionsInitiales: Question[] = [
  { id: "experience", labelKey: "Comment évaluez-vous votre expérience globale", reponse: null, type: "experience" },
  { id: "conforme", labelKey: "Le logement était-il conforme à vos attentes", reponse: null, type: "yesNo" },
  { id: "description", labelKey: "Le logement correspondait-il à la description fournie", reponse: null, type: "yesNo" },
  { id: "propre", labelKey: "Le logement était-il propre", reponse: null, type: "yesNo" },
  { id: "securise", labelKey: "Le logement était-il sécurisé", reponse: null, type: "yesNo" },
  { id: "localisation", labelKey: "La localisation du logement était-elle correctement indiquée", reponse: null, type: "yesNo" },
  { id: "comportement", labelKey: "Comment évaluez-vous le comportement du propriétaire", reponse: null, type: "comportement" },
  { id: "evenements", labelKey: "Avez-vous assisté à des événements durant votre séjour", reponse: null, type: "yesNo" },
  { id: "qualite_evenements", labelKey: "Comment évaluez-vous la qualité des événements", reponse: null, type: "experience" },
  { id: "attractions", labelKey: "Avez-vous visité des attractions durant votre séjour", reponse: null, type: "yesNo" },
  { id: "qualite_attractions", labelKey: "Comment évaluez-vous la qualité des attractions", reponse: null, type: "experience" },
  { id: "incident", labelKey: "Avez-vous rencontré un problème durant votre séjour", reponse: null, type: "yesNo" },
  { id: "derange", labelKey: "Y a-t-il eu des éléments qui vous ont dérangé", reponse: null, type: "yesNo" },
  { id: "photos", labelKey: "Avez-vous pris des photos du logement", reponse: null, type: "yesNo" },
  { id: "recommander", labelKey: "Recommanderiez-vous ce logement", reponse: null, type: "yesNo" },
];

const calculerNoteSur20 = (questions: Question[], commentaire: string, nbPhotos: number) => {
  const positives = questions.filter(q => {
    if (q.type === "yesNo") {
      if (q.id === "derange" || q.id === "incident") return q.reponse === false;
      return q.reponse === true;
    }
    if (q.type === "experience" || q.type === "comportement") {
      return q.reponse === "Très satisfaisante" || q.reponse === "Excellent";
    }
    return false;
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
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<"logement" | "evenement">("logement");
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
  const [selectedEvenement, setSelectedEvenement] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>(questionsInitiales);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [resultat, setResultat] = useState<{ note20: number; reduction: number } | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendation, setRecommendation] = useState({ attraction: "", evenement: "", details: "" });
  const [localisationDetail, setLocalisationDetail] = useState("");
  const [incidentDetail, setIncidentDetail] = useState("");
  const [derangeDetail, setDerangeDetail] = useState("");
  const [commentaireLibre, setCommentaireLibre] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [selectedEvenementsFromList, setSelectedEvenementsFromList] = useState<string[]>([]);
  const [selectedAttractionsFromList, setSelectedAttractionsFromList] = useState<string[]>([]);

  const isAfterStay = (dateFin: string) => {
    const today = new Date();
    const fin = new Date(dateFin.split('/').reverse().join('-'));
    return today > fin;
  };

  const selectedRes = useMemo(() => {
    return mockReservations.find(r => r.id === selectedReservation);
  }, [selectedReservation]);
  const canEdit = selectedRes ? !isAfterStay(selectedRes.dateFin) : true;

  const availableEvenements = selectedRes?.evenements || [];
  const availableAttractions = selectedRes?.attractions || [];

  const handleReponse = (id: string, val: string | boolean) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, reponse: val } : q));
  };

  const noteCalculee = () => {
    const positives = questions.filter(q => {
      if (q.type === "yesNo") {
        if (q.id === "derange" || q.id === "incident") return q.reponse === false;
        return q.reponse === true;
      }
      if (q.type === "experience") return q.reponse === "Très satisfaisante" || q.reponse === "Satisfaisante";
      if (q.type === "comportement") return q.reponse === "Excellent" || q.reponse === "Bon";
      return false;
    }).length;
    return Math.round((positives / questions.length) * 5);
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const newPhotos: string[] = [];
        const newFiles: File[] = [];
        Array.from(files).forEach((file) => {
          newFiles.push(file);
          newPhotos.push(URL.createObjectURL(file));
        });
        setPhotos([...photos, ...newPhotos]);
        setPhotoFiles([...photoFiles, ...newFiles]);
      }
    };
    input.click();
  };

  const handleSubmit = () => {
    const note20 = calculerNoteSur20(questions, commentaireLibre, photos.length);
    const reduction = calculerReduction(note20);
    setResultat({ note20, reduction });
    setSubmitted(true);

    const currentRes = mockReservations.find(r => r.id === selectedReservation);
    const newReview = {
      id: Date.now(),
      nomComplet: "Vous",
      note: noteCalculee(),
      noteSur20: note20,
      avis: commentaireLibre,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }),
      photo: null,
      reduction,
      lieu: currentRes ? `${currentRes.nomLog}, ${currentRes.lieu}` : "",
      typeLogement: "Hôtel",
    };

    const existingReviews = JSON.parse(localStorage.getItem("stayease_reviews") || "[]");
    localStorage.setItem("stayease_reviews", JSON.stringify([newReview, ...existingReviews]));
  };

  const handleReset = () => {
    setSubmitted(false);
    setResultat(null);
    setSelectedReservation(null);
    setSelectedEvenement(null);
    setQuestions(questionsInitiales);
    setPhotos([]);
    setPhotoFiles([]);
    setCommentaireLibre("");
    setSuggestions("");
    setLocalisationDetail("");
    setIncidentDetail("");
    setDerangeDetail("");
    setSelectedEvenementsFromList([]);
    setSelectedAttractionsFromList([]);
  };

  const allAnswered = questions.every(q => {
    if (q.id === "qualite_evenements") {
      return questions.find(x => x.id === "evenements")?.reponse !== true || q.reponse !== null;
    }
    if (q.id === "qualite_attractions") {
      return questions.find(x => x.id === "attractions")?.reponse !== true || q.reponse !== null;
    }
    return q.reponse !== null;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-10">
        <h2 className="section-title text-center mb-2">{t("Mon espace avis")}</h2>
        <p className="text-muted-foreground text-center mb-8">
          {t("Veuillez répondre avec toute transparence")}
        </p>

        {activeTab === "logement" && !selectedReservation && !submitted && (
          <div className="overflow-x-auto rounded-lg border border-border mb-8">
            <table className="hotel-table w-full">
              <thead>
                <tr>
                  <th>{t("Nom du logement")}</th>
                  <th>{t("Durée")}</th>
                  <th>{t("Date début")}</th>
                  <th>{t("Dates (début - fin)")}</th>
                  <th>{t("Avis envoyé")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {mockReservations.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold">{t(r.nomLog)}</td>
                    <td className="text-muted-foreground">{t(r.periode)}</td>
                    <td className="text-muted-foreground">{r.dateDebut}</td>
                    <td className="text-muted-foreground text-xs">{r.dateDebut} - {r.dateFin}</td>
                    <td>
                      {r.avisEnvoye ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle size={12} /> {t("Envoyé")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                          {t("En attente")}
                        </span>
                      )}
                    </td>
                    <td>
                      {!r.avisEnvoye && (
                        <button
                          onClick={() => setSelectedReservation(r.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                          {t("Donner mon avis")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(selectedReservation || selectedEvenement) && !submitted && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-display font-semibold text-lg mb-1">{t("Questionnaire d'évaluation")}</h3>
              <p className="text-sm text-muted-foreground mb-6">⚠ {t("Tous les champs sont obligatoires")}</p>

              {!canEdit && (
                <div className="mb-4 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    ⏰ {t("Votre séjour est terminé. Vous pouvez uniquement visualiser ce formulaire mais vous ne pouvez plus le modifier.")}
                  </p>
                </div>
              )}

              {/* 🔹 1. Évaluation générale */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Évaluation générale")}
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium block mb-2">{t("Comment évaluez-vous votre expérience globale")}</span>
                    <div className="flex flex-wrap gap-2">
                      {["Très satisfaisante", "Satisfaisante", "Moyenne", "Insatisfaisante"].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleReponse("experience", opt)}
                          disabled={!canEdit}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            questions.find(q => q.id === "experience")?.reponse === opt
                              ? "bg-green-600 text-white"
                              : canEdit
                                ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          }`}
                        >
                          {t(opt)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔹 2. Qualité du logement */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Qualité du logement")}
                </h4>
                <div className="space-y-4">
                  {[
                    { id: "conforme", label: "Le logement était-il conforme à vos attentes" },
                    { id: "description", label: "Le logement correspondait-il à la description fournie" },
                    { id: "propre", label: "Le logement était-il propre" },
                    { id: "securise", label: "Le logement était-il sécurisé" },
                  ].map((q) => (
                    <div key={q.id}>
                      <span className="text-sm font-medium block mb-2">{t(q.label)}</span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReponse(q.id, true)}
                          disabled={!canEdit}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            questions.find(x => x.id === q.id)?.reponse === true
                              ? "bg-green-600 text-white"
                              : canEdit
                                ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          }`}
                        >
                          {t("Oui")}
                        </button>
                        <button
                          onClick={() => handleReponse(q.id, false)}
                          disabled={!canEdit}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            questions.find(x => x.id === q.id)?.reponse === false
                              ? "bg-red-600 text-white"
                              : canEdit
                                ? "bg-muted text-foreground hover:bg-red-100 border border-border"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          }`}
                        >
                          {t("Non")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🔹 3. Localisation */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Localisation")}
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium block mb-2">{t("La localisation du logement était-elle correctement indiquée")}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReponse("localisation", true)}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questions.find(q => q.id === "localisation")?.reponse === true
                            ? "bg-green-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        {t("Oui")}
                      </button>
                      <button
                        onClick={() => handleReponse("localisation", false)}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questions.find(q => q.id === "localisation")?.reponse === false
                            ? "bg-red-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-red-100 border border-border"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        {t("Non")}
                      </button>
                    </div>
                  </div>
                  {questions.find(q => q.id === "localisation")?.reponse === false && (
                    <div className="p-3 rounded-lg bg-accent/50">
                      <label className="text-sm text-accent-foreground block mb-2">
                        {t("Si non, veuillez préciser la localisation correcte (facultatif)")}
                      </label>
                      <textarea
                        value={localisationDetail}
                        onChange={(e) => setLocalisationDetail(e.target.value)}
                        disabled={!canEdit}
                        className="input-field min-h-[60px] text-sm"
                        placeholder={t("Votre localisation...")}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 🔹 4. Propriétaire / Hôte */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Propriétaire / Hôte")}
                </h4>
                <div>
                  <span className="text-sm font-medium block mb-2">{t("Comment évaluez-vous le comportement du propriétaire")}</span>
                  <div className="flex flex-wrap gap-2">
                    {["Excellent", "Bon", "Moyen", "Insatisfaisant"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleReponse("comportement", opt)}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questions.find(q => q.id === "comportement")?.reponse === opt
                            ? "bg-green-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        {t(opt)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 🔹 5. Événements */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Événements")}
                </h4>
                <div className="space-y-4">
                  {availableEvenements.length > 0 && (
                    <div>
                      <span className="text-sm font-medium block mb-2">{t("Sélectionnez les événements auxquels vous avez assisté")}</span>
                      <div className="flex flex-wrap gap-2">
                        {availableEvenements.map((event) => (
                          <button
                            key={event}
                            onClick={() => {
                              setSelectedEvenementsFromList(prev => 
                                prev.includes(event) 
                                  ? prev.filter(e => e !== event)
                                  : [...prev, event]
                              );
                              handleReponse("evenements", true);
                            }}
                            disabled={!canEdit}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedEvenementsFromList.includes(event)
                                ? "bg-green-600 text-white"
                                : canEdit
                                  ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            }`}
                          >
                            {selectedEvenementsFromList.includes(event) && "✓ "}
                            {t(event)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {availableEvenements.length === 0 && (
                    <div>
                      <span className="text-sm font-medium block mb-2">{t("Avez-vous assisté à des événements durant votre séjour")}</span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReponse("evenements", true)}
                          disabled={!canEdit}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            questions.find(q => q.id === "evenements")?.reponse === true
                              ? "bg-green-600 text-white"
                              : canEdit
                                ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          }`}
                        >
                          {t("Oui")}
                        </button>
                        <button
                          onClick={() => handleReponse("evenements", false)}
                          disabled={!canEdit}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            questions.find(q => q.id === "evenements")?.reponse === false
                              ? "bg-red-600 text-white"
                              : canEdit
                                ? "bg-muted text-foreground hover:bg-red-100 border border-border"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          }`}
                        >
                          {t("Non")}
                        </button>
                      </div>
                    </div>
                  )}
                  {(questions.find(q => q.id === "evenements")?.reponse === true || selectedEvenementsFromList.length > 0) && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <label className="text-sm font-medium block mb-2">{t("Comment évaluez-vous la qualité des événements")}</label>
                      <div className="flex flex-wrap gap-2">
                        {["Très satisfaisante", "Satisfaisante", "Moyenne", "Insatisfaisante"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleReponse("qualite_evenements", opt)}
                            disabled={!canEdit}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              questions.find(q => q.id === "qualite_evenements")?.reponse === opt
                                ? "bg-green-600 text-white"
                                : canEdit
                                  ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            }`}
                          >
                            {t(opt)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 🔹 6. Attractions */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Attractions")}
                </h4>
                <div className="space-y-4">
                  {availableAttractions.length > 0 && (
                    <div>
                      <span className="text-sm font-medium block mb-2">{t("Sélectionnez les attractions que vous avez visitées")}</span>
                      <div className="flex flex-wrap gap-2">
                        {availableAttractions.map((attr) => (
                          <button
                            key={attr}
                            onClick={() => {
                              setSelectedAttractionsFromList(prev => 
                                prev.includes(attr) 
                                  ? prev.filter(a => a !== attr)
                                  : [...prev, attr]
                              );
                              handleReponse("attractions", true);
                            }}
                            disabled={!canEdit}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedAttractionsFromList.includes(attr)
                                ? "bg-green-600 text-white"
                                : canEdit
                                  ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            }`}
                          >
                            {selectedAttractionsFromList.includes(attr) && "✓ "}
                            {t(attr)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {availableAttractions.length === 0 && (
                    <div>
                      <span className="text-sm font-medium block mb-2">{t("Avez-vous visité des attractions durant votre séjour")}</span>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReponse("attractions", true)}
                          disabled={!canEdit}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            questions.find(q => q.id === "attractions")?.reponse === true
                              ? "bg-green-600 text-white"
                              : canEdit
                                ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          }`}
                        >
                          {t("Oui")}
                        </button>
                        <button
                          onClick={() => handleReponse("attractions", false)}
                          disabled={!canEdit}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            questions.find(q => q.id === "attractions")?.reponse === false
                              ? "bg-red-600 text-white"
                              : canEdit
                                ? "bg-muted text-foreground hover:bg-red-100 border border-border"
                                : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                          }`}
                        >
                          {t("Non")}
                        </button>
                      </div>
                    </div>
                  )}
                  {(questions.find(q => q.id === "attractions")?.reponse === true || selectedAttractionsFromList.length > 0) && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <label className="text-sm font-medium block mb-2">{t("Comment évaluez-vous la qualité des attractions")}</label>
                      <div className="flex flex-wrap gap-2">
                        {["Très satisfaisante", "Satisfaisante", "Moyenne", "Insatisfaisante"].map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleReponse("qualite_attractions", opt)}
                            disabled={!canEdit}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              questions.find(q => q.id === "qualite_attractions")?.reponse === opt
                                ? "bg-green-600 text-white"
                                : canEdit
                                  ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                            }`}
                          >
                            {t(opt)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 🔹 7. Incidents ou problèmes */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Incidents ou problèmes")}
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium block mb-2">{t("Avez-vous rencontré un problème durant votre séjour")}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReponse("incident", true)}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questions.find(q => q.id === "incident")?.reponse === true
                            ? "bg-green-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        {t("Oui")}
                      </button>
                      <button
                        onClick={() => handleReponse("incident", false)}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questions.find(q => q.id === "incident")?.reponse === false
                            ? "bg-red-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-red-100 border border-border"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        {t("Non")}
                      </button>
                    </div>
                  </div>
                  {questions.find(q => q.id === "incident")?.reponse === true && (
                    <div className="p-3 rounded-lg bg-accent/50">
                      <label className="text-sm text-accent-foreground block mb-2">
                        {t("Si oui, veuillez préciser (facultatif)")}
                      </label>
                      <textarea
                        value={incidentDetail}
                        onChange={(e) => setIncidentDetail(e.target.value)}
                        disabled={!canEdit}
                        className="input-field min-h-[60px] text-sm"
                        placeholder={t("Décrivez le problème...")}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 🔹 7. Points négatifs */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Points négatifs")}
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium block mb-2">{t("Y a-t-il eu des éléments qui vous ont dérangé")}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReponse("derange", true)}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questions.find(q => q.id === "derange")?.reponse === true
                            ? "bg-green-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        {t("Oui")}
                      </button>
                      <button
                        onClick={() => handleReponse("derange", false)}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questions.find(q => q.id === "derange")?.reponse === false
                            ? "bg-red-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-red-100 border border-border"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        {t("Non")}
                      </button>
                    </div>
                  </div>
                  {questions.find(q => q.id === "derange")?.reponse === true && (
                    <div className="p-3 rounded-lg bg-accent/50">
                      <label className="text-sm text-accent-foreground block mb-2">
                        {t("Si oui, précisez (facultatif)")}
                      </label>
                      <textarea
                        value={derangeDetail}
                        onChange={(e) => setDerangeDetail(e.target.value)}
                        disabled={!canEdit}
                        className="input-field min-h-[60px] text-sm"
                        placeholder={t("Décrivez ce qui vous a gêné...")}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 🔹 8. Photos */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Photos")}
                </h4>
                <div>
                  <span className="text-sm font-medium block mb-2">{t("Avez-vous pris des photos du logement")}</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReponse("photos", true)}
                      disabled={!canEdit}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        questions.find(q => q.id === "photos")?.reponse === true
                          ? "bg-green-600 text-white"
                          : canEdit
                            ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                      }`}
                    >
                      {t("Oui")}
                    </button>
                    <button
                      onClick={() => handleReponse("photos", false)}
                      disabled={!canEdit}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        questions.find(q => q.id === "photos")?.reponse === false
                          ? "bg-red-600 text-white"
                          : canEdit
                            ? "bg-muted text-foreground hover:bg-red-100 border border-border"
                            : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                      }`}
                    >
                      {t("Non")}
                    </button>
                  </div>
                  {questions.find(q => q.id === "photos")?.reponse === true && (
                    <button
                      onClick={handlePhotoUpload}
                      disabled={!canEdit}
                      className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed text-sm transition-colors ${
                        canEdit
                          ? "border-border text-muted-foreground hover:border-primary hover:text-primary"
                          : "border-border text-muted-foreground/50 cursor-not-allowed"
                      }`}
                    >
                      <Camera size={16} />
                      {t("Télécharger des photos")}
                    </button>
                  )}
                  {photos.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {photos.map((p, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border">
                          <img src={p} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 🔹 9. Commentaire libre */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Commentaire libre")}
                </h4>
                <div>
                  <label className="text-sm font-medium block mb-2">{t("Commentaires (facultatif)")}</label>
                  <textarea
                    value={commentaireLibre}
                    onChange={(e) => setCommentaireLibre(e.target.value)}
                    disabled={!canEdit}
                    className={`input-field min-h-[80px] ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
                    placeholder={t("Partagez votre expérience...")}
                  />
                </div>
              </div>

              {/* 🔹 10. Recommandations */}
              <div className="mb-6">
                <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
                  <span className="text-primary">🔹</span> {t("Recommandations")}
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium block mb-2">{t("Recommanderiez-vous ce logement")}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReponse("recommander", true)}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questions.find(q => q.id === "recommander")?.reponse === true
                            ? "bg-green-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-green-100 border border-border"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        {t("Oui")}
                      </button>
                      <button
                        onClick={() => handleReponse("recommander", false)}
                        disabled={!canEdit}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          questions.find(q => q.id === "recommander")?.reponse === false
                            ? "bg-red-600 text-white"
                            : canEdit
                              ? "bg-muted text-foreground hover:bg-red-100 border border-border"
                              : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                        }`}
                      >
                        {t("Non")}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">{t("Suggestions d'amélioration ou recommandations (facultatif)")}</label>
                    <textarea
                      value={suggestions}
                      onChange={(e) => setSuggestions(e.target.value)}
                      disabled={!canEdit}
                      className={`input-field min-h-[80px] ${!canEdit ? "opacity-50 cursor-not-allowed" : ""}`}
                      placeholder={t("Vos suggestions...")}
                    />
                  </div>
                </div>
              </div>

              {allAnswered && (
                <div className="mt-6 p-4 rounded-lg bg-primary/10 text-center">
                  <p className="text-sm text-muted-foreground mb-1">{t("Note attribuée automatiquement")}</p>
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

              {allAnswered && (
                <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                    <Gift size={16} />
                    <span>{t("En remplissant ce formulaire, vous pouvez profiter de")} <strong>{resultat ? resultat.reduction : 0}% {t("de réduction sur votre prochaine réservation")}</strong></span>
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 mt-6">
                {allAnswered && resultat && (
                  <div className="flex-1 p-3 rounded-lg bg-primary/10 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{t("Note du site")}</p>
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
                  {canEdit ? t("Valider le formulaire") : t("Formulaire verrouillé")}
                </button>
              </div>
            </div>
          </div>
        )}

        {submitted && resultat && (
          <div className="max-w-lg mx-auto text-center py-12">
            <CheckCircle className="mx-auto text-green-600 mb-4" size={48} />
            <h3 className="font-display text-xl font-semibold mb-2">{t("Merci beaucoup !")}</h3>
            <p className="text-muted-foreground mb-6">
              {t("Votre avis a été enregistré avec succès.")}
            </p>

            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Gift size={24} />
                <span className="font-display text-lg font-semibold">{t("Vos récompenses")}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-primary/10">
                  <p className="text-sm text-muted-foreground mb-1">{t("Note obtained")}</p>
                  <p className="text-2xl font-bold text-primary">{resultat.note20}/20</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <p className="text-sm text-muted-foreground mb-1">{t("Réduction obtained")}</p>
                  <p className="text-2xl font-bold text-green-600">-{resultat.reduction}%</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                🎁 {t("Votre réduction de")} <strong>{resultat.reduction}%</strong> {t("sera appliquée automatiquement sur votre prochaine réservation.")}
              </p>

              <div className="text-xs text-muted-foreground/60 space-y-1">
                <p>{t("Commentaire")}</p>
                <p>{t("Note calculation")}</p>
              </div>
            </div>

            <button onClick={handleReset} className="btn-primary mt-6">
              {t("Retour à l'historique")}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AvisPersonnel;