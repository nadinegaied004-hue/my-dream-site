import { useState } from "react";
import { Search, Filter, ChevronDown, ChevronRight, CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  {
    id: 1, nom: "Hôtel Royal Palace", lat: 33.5731, lng: -7.5898, proprietaire: "Ahmed Benjelloun",
    datesDisponibles: [new Date(2026, 3, 5), new Date(2026, 3, 10), new Date(2026, 3, 15), new Date(2026, 4, 1), new Date(2026, 4, 12)],
    datesEvenements: [new Date(2026, 3, 8), new Date(2026, 4, 20)],
    avis: 128, categorie: "Hôtels",
    evenements: [{ nom: "Festival", distance: 0.5 }, { nom: "Concert", distance: 1.2 }],
    saison: "Été",
    attractions: [{ nom: "Stade de football", distance: 0.3 }, { nom: "Salle de conférences", distance: 1.0 }],
  },
  {
    id: 2, nom: "Hôtel Marrakech Inn", lat: 31.6295, lng: -7.9811, proprietaire: "Fatima Zahra",
    datesDisponibles: [new Date(2026, 3, 2), new Date(2026, 3, 18), new Date(2026, 4, 5)],
    datesEvenements: [new Date(2026, 3, 14)],
    avis: 95, categorie: "Hôtels",
    evenements: [{ nom: "Exposition", distance: 0.8 }, { nom: "Théâtre", distance: 2.0 }],
    saison: "Printemps",
    attractions: [{ nom: "Salle des fêtes", distance: 0.6 }, { nom: "Parc / Jardin", distance: 1.5 }],
  },
  {
    id: 3, nom: "Hôtel Casablanca View", lat: 33.5950, lng: -7.6187, proprietaire: "Karim El Fassi",
    datesDisponibles: [new Date(2026, 4, 3), new Date(2026, 4, 20)],
    datesEvenements: [new Date(2026, 3, 25), new Date(2026, 4, 10)],
    avis: 210, categorie: "Hôtels",
    evenements: [{ nom: "Football", distance: 0.2 }, { nom: "Tennis", distance: 3.0 }],
    saison: "Été",
    attractions: [{ nom: "Stade de football", distance: 0.2 }, { nom: "Centre commercial", distance: 0.9 }],
  },
  {
    id: 4, nom: "Maison du Jardin", lat: 34.0209, lng: -6.8416, proprietaire: "Nadia Berrada",
    datesDisponibles: [new Date(2026, 3, 1), new Date(2026, 3, 7), new Date(2026, 3, 22), new Date(2026, 4, 8)],
    datesEvenements: [new Date(2026, 3, 12)],
    avis: 34, categorie: "Maisons",
    evenements: [{ nom: "Parc d'attractions", distance: 1.0 }, { nom: "Zoo", distance: 2.5 }],
    saison: "Printemps",
    attractions: [{ nom: "Parc / Jardin", distance: 0.1 }, { nom: "Foire / Exposition", distance: 1.8 }],
  },
  {
    id: 5, nom: "Résidence Marina", lat: 33.6065, lng: -7.6322, proprietaire: "Youssef Tazi",
    datesDisponibles: [new Date(2026, 3, 4), new Date(2026, 3, 11), new Date(2026, 4, 2), new Date(2026, 4, 15)],
    datesEvenements: [new Date(2026, 4, 5)],
    avis: 156, categorie: "Maisons",
    evenements: [{ nom: "Concert", distance: 0.7 }, { nom: "Festival", distance: 1.5 }],
    saison: "Été",
    attractions: [{ nom: "Centre commercial", distance: 0.4 }, { nom: "Salle des fêtes", distance: 1.2 }],
  },
  {
    id: 6, nom: "Villa des Dunes", lat: 30.4278, lng: -9.5981, proprietaire: "Samira Alaoui",
    datesDisponibles: [new Date(2026, 5, 1), new Date(2026, 5, 15)],
    datesEvenements: [new Date(2026, 5, 10)],
    avis: 64, categorie: "Maisons",
    evenements: [{ nom: "Volleyball", distance: 0.3 }, { nom: "Padel", distance: 0.8 }],
    saison: "Été",
    attractions: [{ nom: "Terrain de padel", distance: 0.3 }, { nom: "Terrain de volleyball", distance: 0.5 }],
  },
  {
    id: 7, nom: "Riad Les Oliviers", lat: 31.6340, lng: -8.0100, proprietaire: "Hassan Moussaoui",
    datesDisponibles: [new Date(2026, 3, 3), new Date(2026, 3, 19), new Date(2026, 4, 7)],
    datesEvenements: [new Date(2026, 3, 20)],
    avis: 87, categorie: "Maisons d'hôtes",
    evenements: [{ nom: "Exposition", distance: 0.4 }, { nom: "Musée", distance: 1.0 }],
    saison: "Automne",
    attractions: [{ nom: "Salle de conférences", distance: 0.7 }, { nom: "Parc / Jardin", distance: 0.3 }],
  },
  {
    id: 8, nom: "Maison d'hôtes Atlas", lat: 34.0331, lng: -5.0003, proprietaire: "Amina Chraibi",
    datesDisponibles: [new Date(2026, 4, 10), new Date(2026, 4, 25)],
    datesEvenements: [new Date(2026, 4, 18)],
    avis: 45, categorie: "Maisons d'hôtes",
    evenements: [{ nom: "Basketball", distance: 0.6 }, { nom: "Football", distance: 1.5 }],
    saison: "Hiver",
    attractions: [{ nom: "Salle de basketball", distance: 0.6 }, { nom: "Stade de football", distance: 1.5 }],
  },
  {
    id: 9, nom: "Dar Essalam", lat: 31.6300, lng: -7.9890, proprietaire: "Omar Kettani",
    datesDisponibles: [new Date(2026, 3, 6), new Date(2026, 3, 14), new Date(2026, 3, 28), new Date(2026, 4, 9)],
    datesEvenements: [new Date(2026, 3, 10), new Date(2026, 4, 1)],
    avis: 72, categorie: "Maisons d'hôtes",
    evenements: [{ nom: "Festival", distance: 0.9 }, { nom: "Théâtre", distance: 1.8 }],
    saison: "Printemps",
    attractions: [{ nom: "Salle des fêtes", distance: 0.5 }, { nom: "Foire / Exposition", distance: 2.0 }],
  },
  {
    id: 10, nom: "Ferme du Soleil", lat: 30.9200, lng: -6.9000, proprietaire: "Rachid Benali",
    datesDisponibles: [new Date(2026, 3, 8), new Date(2026, 3, 20), new Date(2026, 4, 4), new Date(2026, 4, 18)],
    datesEvenements: [new Date(2026, 4, 12)],
    avis: 23, categorie: "Fermes",
    evenements: [{ nom: "Zoo", distance: 2.0 }, { nom: "Parc d'attractions", distance: 3.5 }],
    saison: "Été",
    attractions: [{ nom: "Parc / Jardin", distance: 0.2 }, { nom: "Foire / Exposition", distance: 4.0 }],
  },
  {
    id: 11, nom: "Ferme Bio Atlas", lat: 31.3500, lng: -7.7300, proprietaire: "Leila Ouazzani",
    datesDisponibles: [new Date(2026, 3, 9), new Date(2026, 3, 25), new Date(2026, 4, 6)],
    datesEvenements: [new Date(2026, 3, 30)],
    avis: 18, categorie: "Fermes",
    evenements: [{ nom: "Exposition", distance: 1.5 }, { nom: "Concert", distance: 3.0 }],
    saison: "Automne",
    attractions: [{ nom: "Centre commercial", distance: 5.0 }, { nom: "Parc / Jardin", distance: 0.5 }],
  },
  {
    id: 12, nom: "Domaine des Oliviers", lat: 33.8935, lng: -5.5473, proprietaire: "Mehdi Slaoui",
    datesDisponibles: [new Date(2026, 5, 5), new Date(2026, 5, 20)],
    datesEvenements: [new Date(2026, 5, 15)],
    avis: 41, categorie: "Fermes",
    evenements: [{ nom: "Festival", distance: 1.2 }, { nom: "Aquarium", distance: 4.0 }],
    saison: "Hiver",
    attractions: [{ nom: "Salle de conférences", distance: 2.0 }, { nom: "Salle des fêtes", distance: 3.0 }],
  },
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
    if (filterMode === "evenement" && selectedEvenement) return h.evenements.some(e => e.nom === selectedEvenement) && matchSearch;
    if (filterMode === "saison" && selectedSaison) return h.saison === selectedSaison && matchSearch;
    if (filterMode === "attraction" && selectedAttraction) return h.attractions.some(a => a.nom === selectedAttraction) && matchSearch;
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
        <main className="flex-1 p-6 overflow-x-auto">
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
            <table className="hotel-table w-full">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Propriétaire</th>
                  <th>Coordonnées (Lat, Lng)</th>
                  <th>Calendrier</th>
                  <th>Événements (dist.)</th>
                  <th>Saison</th>
                  <th>Attractions (dist.)</th>
                  <th>Nb. Avis</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted-foreground py-8">
                      Aucun logement trouvé pour ce filtre.
                    </td>
                  </tr>
                ) : (
                  filtered.map((hotel) => (
                    <tr key={hotel.id}>
                      <td className="font-semibold whitespace-nowrap">{hotel.nom}</td>
                      <td className="text-muted-foreground whitespace-nowrap">{hotel.proprietaire}</td>
                      <td className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                        <a
                          href={`https://www.google.com/maps?q=${hotel.lat},${hotel.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline hover:text-primary/80"
                        >
                          {hotel.lat.toFixed(4)}, {hotel.lng.toFixed(4)}
                        </a>
                      </td>
                      <td>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                              <CalendarDays size={14} />
                              {hotel.datesDisponibles.length} dates
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-2 text-xs space-y-1 border-b border-border">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                                <span>Logement disponible</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-orange-500 inline-block" />
                                <span>Événement à proximité</span>
                              </div>
                            </div>
                            <Calendar
                              mode="multiple"
                              selected={[...hotel.datesDisponibles, ...hotel.datesEvenements]}
                              className="p-3 pointer-events-auto"
                              modifiers={{
                                disponible: hotel.datesDisponibles,
                                evenement: hotel.datesEvenements,
                              }}
                              modifiersStyles={{
                                disponible: { backgroundColor: "hsl(142 71% 45%)", color: "white", borderRadius: "9999px" },
                                evenement: { backgroundColor: "hsl(25 95% 53%)", color: "white", borderRadius: "9999px" },
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="text-xs">
                        <div className="space-y-0.5">
                          {hotel.evenements.map((e) => (
                            <div key={e.nom} className="whitespace-nowrap">
                              <span className="font-medium text-foreground">{e.nom}</span>
                              <span className="text-muted-foreground ml-1">({e.distance} km)</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                          {hotel.saison}
                        </span>
                      </td>
                      <td className="text-xs">
                        <div className="space-y-0.5">
                          {hotel.attractions.map((a) => (
                            <div key={a.nom} className="whitespace-nowrap">
                              <span className="font-medium text-foreground">{a.nom}</span>
                              <span className="text-muted-foreground ml-1">({a.distance} km)</span>
                            </div>
                          ))}
                        </div>
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
