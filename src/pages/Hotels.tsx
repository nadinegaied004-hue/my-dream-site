import { useState } from "react";
import { Search, Filter, ChevronDown, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["Hôtels", "Maisons", "Maisons d'hôtes", "Fermes"];

const evenements = {
  "Culturel": ["Festival", "Exposition", "Concert", "Théâtre"],
  "Sportif": ["Football", "Basketball", "Padel", "Volleyball", "Tennis"],
  "Attraction": ["Parc d'attractions", "Zoo", "Aquarium", "Musée"],
};

const saisons = ["Printemps", "Été", "Automne", "Hiver"];

const attractionsProximite = [
  "Stade de football",
  "Salle de basketball",
  "Terrain de padel",
  "Terrain de volleyball",
  "Salle de conférences",
  "Salle des fêtes",
  "Foire / Exposition",
  "Centre commercial",
  "Parc / Jardin",
];

type FilterMode = "categorie" | "evenement" | "saison" | "attraction";

const mockLogements = [
  { id: 1, nom: "Hôtel Royal Palace", adresse: "123 Av. Mohammed V", disponible: true, avis: 128, categorie: "Hôtels", evenements: ["Festival", "Concert"], saison: "Été", attractions: ["Stade de football", "Salle de conférences"] },
  { id: 2, nom: "Hôtel Marrakech Inn", adresse: "45 Rue de Fès", disponible: true, avis: 95, categorie: "Hôtels", evenements: ["Exposition", "Théâtre"], saison: "Printemps", attractions: ["Salle des fêtes", "Parc / Jardin"] },
  { id: 3, nom: "Hôtel Casablanca View", adresse: "Bd de la Corniche", disponible: false, avis: 210, categorie: "Hôtels", evenements: ["Football", "Tennis"], saison: "Été", attractions: ["Stade de football", "Centre commercial"] },
  { id: 4, nom: "Maison du Jardin", adresse: "12 Rue des Fleurs", disponible: true, avis: 34, categorie: "Maisons", evenements: ["Parc d'attractions", "Zoo"], saison: "Printemps", attractions: ["Parc / Jardin", "Foire / Exposition"] },
  { id: 5, nom: "Résidence Marina", adresse: "Port de plaisance", disponible: true, avis: 156, categorie: "Maisons", evenements: ["Concert", "Festival"], saison: "Été", attractions: ["Centre commercial", "Salle des fêtes"] },
  { id: 6, nom: "Villa des Dunes", adresse: "Zone touristique", disponible: false, avis: 64, categorie: "Maisons", evenements: ["Volleyball", "Padel"], saison: "Été", attractions: ["Terrain de padel", "Terrain de volleyball"] },
  { id: 7, nom: "Riad Les Oliviers", adresse: "45 Rue des Roses", disponible: true, avis: 87, categorie: "Maisons d'hôtes", evenements: ["Exposition", "Musée"], saison: "Automne", attractions: ["Salle de conférences", "Parc / Jardin"] },
  { id: 8, nom: "Maison d'hôtes Atlas", adresse: "12 Bd Hassan II", disponible: false, avis: 45, categorie: "Maisons d'hôtes", evenements: ["Basketball", "Football"], saison: "Hiver", attractions: ["Salle de basketball", "Stade de football"] },
  { id: 9, nom: "Dar Essalam", adresse: "Médina ancienne", disponible: true, avis: 72, categorie: "Maisons d'hôtes", evenements: ["Festival", "Théâtre"], saison: "Printemps", attractions: ["Salle des fêtes", "Foire / Exposition"] },
  { id: 10, nom: "Ferme du Soleil", adresse: "Route de Ouarzazate", disponible: true, avis: 23, categorie: "Fermes", evenements: ["Zoo", "Parc d'attractions"], saison: "Été", attractions: ["Parc / Jardin", "Foire / Exposition"] },
  { id: 11, nom: "Ferme Bio Atlas", adresse: "Vallée de l'Ourika", disponible: true, avis: 18, categorie: "Fermes", evenements: ["Exposition", "Concert"], saison: "Automne", attractions: ["Centre commercial", "Parc / Jardin"] },
  { id: 12, nom: "Domaine des Oliviers", adresse: "Route de Meknès", disponible: false, avis: 41, categorie: "Fermes", evenements: ["Festival", "Aquarium"], saison: "Hiver", attractions: ["Salle de conférences", "Salle des fêtes"] },
];

const Hotels = () => {
  const [filterMode, setFilterMode] = useState<FilterMode>("categorie");
  const [selectedCategory, setSelectedCategory] = useState("Hôtels");
  const [selectedEvenement, setSelectedEvenement] = useState<string | null>(null);
  const [selectedSaison, setSelectedSaison] = useState<string | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);
  const [expandedEventGroup, setExpandedEventGroup] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = mockLogements.filter((h) => {
    const matchSearch = h.nom.toLowerCase().includes(search.toLowerCase());
    if (filterMode === "categorie") return h.categorie === selectedCategory && matchSearch;
    if (filterMode === "evenement" && selectedEvenement) return h.evenements.includes(selectedEvenement) && matchSearch;
    if (filterMode === "saison" && selectedSaison) return h.saison === selectedSaison && matchSearch;
    if (filterMode === "attraction" && selectedAttraction) return h.attractions.includes(selectedAttraction) && matchSearch;
    return matchSearch;
  });

  const filterModes: { key: FilterMode; label: string }[] = [
    { key: "categorie", label: "Par catégorie" },
    { key: "evenement", label: "Par événements" },
    { key: "saison", label: "Par saison" },
    { key: "attraction", label: "Par attractions" },
  ];

  const getTitle = () => {
    if (filterMode === "categorie") return `Liste des ${selectedCategory}`;
    if (filterMode === "evenement") return selectedEvenement ? `Logements près : ${selectedEvenement}` : "Sélectionnez un événement";
    if (filterMode === "saison") return selectedSaison ? `Logements en ${selectedSaison}` : "Sélectionnez une saison";
    if (filterMode === "attraction") return selectedAttraction ? `Logements près : ${selectedAttraction}` : "Sélectionnez une attraction";
    return "Logements";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-card border-r border-border p-4 space-y-4 overflow-y-auto">
          {/* Filter mode selector */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
              <Filter size={18} className="text-primary" />
              Type de tri
            </h3>
            <div className="space-y-1">
              {filterModes.map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setFilterMode(mode.key)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    filterMode === mode.key
                      ? "bg-primary/10 text-primary font-semibold border border-primary/30"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            {/* Category filter */}
            {filterMode === "categorie" && (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Catégories</h4>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Event filter */}
            {filterMode === "evenement" && (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Événements à proximité</h4>
                {Object.entries(evenements).map(([group, items]) => (
                  <div key={group}>
                    <button
                      onClick={() => setExpandedEventGroup(expandedEventGroup === group ? null : group)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors"
                    >
                      {group}
                      {expandedEventGroup === group ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                    {expandedEventGroup === group && (
                      <div className="ml-3 space-y-0.5">
                        {items.map((evt) => (
                          <button
                            key={evt}
                            onClick={() => setSelectedEvenement(evt)}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                              selectedEvenement === evt
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "hover:bg-muted text-muted-foreground"
                            }`}
                          >
                            {evt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Season filter */}
            {filterMode === "saison" && (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Saisons</h4>
                {saisons.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSaison(s)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedSaison === s
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Attraction filter */}
            {filterMode === "attraction" && (
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Attractions à proximité</h4>
                {attractionsProximite.map((a) => (
                  <button
                    key={a}
                    onClick={() => setSelectedAttraction(a)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedAttraction === a
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="section-title text-2xl">{getTitle()}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 !py-2 text-sm w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="hotel-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Adresse</th>
                  <th>Disponibilité</th>
                  <th>Nb. Avis</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted-foreground py-8">
                      Aucun logement trouvé pour ce filtre.
                    </td>
                  </tr>
                ) : (
                  filtered.map((hotel) => (
                    <tr key={hotel.id}>
                      <td className="font-mono text-muted-foreground">{hotel.id}</td>
                      <td className="font-semibold">{hotel.nom}</td>
                      <td className="text-muted-foreground">{hotel.adresse}</td>
                      <td>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            hotel.disponible
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {hotel.disponible ? "Disponible" : "Indisponible"}
                        </span>
                      </td>
                      <td className="text-muted-foreground">{hotel.avis}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Hotels;
