import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronDown, ChevronRight, CalendarDays, MapPin, Info, X, MessageSquare, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["Hôtel", "Maison", "Maison d'hôtes", "Ferme"];

const evenements = {
  "Culturel": ["Festival de Carthage", "Festival de Dougga", "Festival de Hammamet", "Journées Cinématographiques"],
  "Sportif": ["Football", "Basketball", "Tennis", "Handball"],
};

const saisons = ["Printemps", "Été", "Automne", "Hiver"];

const attractionsProximite = [
  "Stade Olympique de Radès",
  "Salle omnisports de Sousse",
  "Terrain de tennis",
  "Terrain de handball",
  "Palais des Congrès",
  "Salle des fêtes",
  "Foire Internationale de Tunis",
  "Centre commercial Tunisia Mall",
  "Parc du Belvédère",
];

// Détails des événements et attractions cliquables
const detailsEvenements: Record<string, { description: string; lieu: string; date: string; prix?: string }> = {
  "Festival de Carthage": {
    description: "Le Festival International de Carthage est le plus grand festival culturel de Tunisie, accueillant des artistes de renommée mondiale dans l'amphithéâtre romain de Carthage. Musique, théâtre, danse et spectacles variés chaque été depuis 1964.",
    lieu: "Amphithéâtre de Carthage, Tunis",
    date: "Juillet - Août 2026",
    prix: "30 - 120 TND",
  },
  "Festival de Dougga": {
    description: "Festival de théâtre et de musique classique organisé dans le site archéologique classé UNESCO de Dougga. Un cadre exceptionnel pour des spectacles inoubliables au cœur des ruines romaines.",
    lieu: "Site archéologique de Dougga, Béja",
    date: "Juin - Juillet 2026",
    prix: "20 - 60 TND",
  },
  "Festival de Hammamet": {
    description: "Le Festival International de Hammamet se déroule dans le Centre Culturel International de Hammamet. Musique, théâtre et arts visuels dans un cadre méditerranéen unique.",
    lieu: "Centre Culturel International, Hammamet",
    date: "Juillet - Août 2026",
    prix: "25 - 80 TND",
  },
  "Journées Cinématographiques": {
    description: "Les Journées Cinématographiques de Carthage (JCC) sont le plus ancien festival de cinéma du continent africain, fondé en 1966. Films arabes et africains en compétition.",
    lieu: "Cité de la Culture, Tunis",
    date: "Octobre - Novembre 2026",
    prix: "10 - 30 TND",
  },
  "Football": {
    description: "La Ligue 1 tunisienne avec les grands derbys : Espérance de Tunis vs Club Africain, Étoile du Sahel vs CS Sfaxien. Des matchs passionnants dans les plus grands stades du pays.",
    lieu: "Stades divers en Tunisie",
    date: "Toute la saison",
  },
  "Basketball": {
    description: "Le championnat tunisien de basketball avec des clubs comme l'US Monastir et le Club Africain. Matchs dynamiques dans les salles omnisports modernes.",
    lieu: "Salles omnisports en Tunisie",
    date: "Octobre - Mai",
  },
  "Tennis": {
    description: "Tournois nationaux et internationaux de tennis organisés dans les complexes sportifs tunisiens. Le Tennis Club de Tunis accueille régulièrement des compétitions ITF.",
    lieu: "Complexes sportifs en Tunisie",
    date: "Mars - Novembre",
  },
  "Handball": {
    description: "La Tunisie est une nation forte du handball africain. Le championnat national offre des matchs intenses avec des clubs comme l'Espérance et l'Étoile du Sahel.",
    lieu: "Salles omnisports en Tunisie",
    date: "Septembre - Juin",
  },
  "Parc Carthage Land": {
    description: "Le plus grand parc d'attractions de Tunisie situé à Hammamet Yasmine. Montagnes russes, manèges aquatiques, spectacles en plein air et zone pour enfants. Une journée de divertissement pour toute la famille.",
    lieu: "Hammamet Yasmine, Nabeul",
    date: "Ouvert toute l'année",
    prix: "35 TND adulte / 25 TND enfant",
  },
  "Zoo de Tunis": {
    description: "Le parc zoologique du Belvédère abrite plus de 100 espèces animales dans un cadre verdoyant au cœur de Tunis. Lions de l'Atlas, singes, reptiles et oiseaux exotiques.",
    lieu: "Parc du Belvédère, Tunis",
    date: "Ouvert tous les jours",
    prix: "5 TND",
  },
  "Musée du Bardo": {
    description: "Le Musée National du Bardo possède la plus grande collection de mosaïques romaines au monde. Classé patrimoine mondial de l'UNESCO, il retrace l'histoire de la Tunisie de la préhistoire à l'ère ottomane.",
    lieu: "Le Bardo, Tunis",
    date: "Mar-Dim, 9h-17h",
    prix: "13 TND",
  },
  "Site archéologique": {
    description: "La Tunisie regorge de sites archéologiques : Carthage (UNESCO), El Jem avec son colisée romain, Kerkouane (seule cité punique intacte), et Sbeitla avec ses temples romains.",
    lieu: "Divers sites en Tunisie",
    date: "Ouvert toute l'année",
    prix: "8 - 12 TND",
  },
};

const detailsAttractions: Record<string, { description: string; adresse: string; horaires?: string }> = {
  "Stade Olympique de Radès": {
    description: "Le Stade Olympique de Radès (Stade Hammadi Agrebi) est le plus grand stade de Tunisie avec 60 000 places. Il accueille les matchs de l'équipe nationale et les finales de coupe.",
    adresse: "Radès, Ben Arous",
    horaires: "Selon les événements",
  },
  "Salle omnisports de Sousse": {
    description: "Salle multifonctionnelle accueillant basketball, handball et volleyball. Capacité de 6 000 places, rénovée en 2020.",
    adresse: "Sousse, Tunisie",
    horaires: "Selon les événements",
  },
  "Terrain de tennis": {
    description: "Courts de tennis modernes disponibles dans les complexes sportifs et les hôtels balnéaires. Surfaces en dur et terre battue.",
    adresse: "Disponible dans plusieurs villes",
  },
  "Terrain de handball": {
    description: "Terrains couverts conformes aux normes internationales dans les principales villes tunisiennes.",
    adresse: "Disponible dans plusieurs villes",
  },
  "Palais des Congrès": {
    description: "Le Palais des Congrès de Tunis est un centre de conventions moderne accueillant conférences internationales, séminaires et expositions professionnelles.",
    adresse: "Cité de la Culture, Tunis",
    horaires: "Selon les événements",
  },
  "Salle des fêtes": {
    description: "Salles de réception pour mariages, événements sociaux et célébrations. Disponibles dans toutes les villes tunisiennes.",
    adresse: "Disponible partout en Tunisie",
  },
  "Foire Internationale de Tunis": {
    description: "La Foire Internationale de Tunis au Parc des Expositions du Kram accueille des salons professionnels, foires commerciales et expositions thématiques tout au long de l'année.",
    adresse: "Parc des Expositions, Le Kram, Tunis",
    horaires: "Selon les salons",
  },
  "Centre commercial Tunisia Mall": {
    description: "Le plus grand centre commercial de Tunisie avec plus de 150 boutiques, restaurants, cinéma et espace de divertissement.",
    adresse: "Les Berges du Lac 2, Tunis",
    horaires: "10h - 22h tous les jours",
  },
  "Parc du Belvédère": {
    description: "Le plus grand parc urbain de Tunis (110 hectares) avec zoo, jardin botanique, lac et sentiers ombragés. Un poumon vert au cœur de la capitale.",
    adresse: "Belvédère, Tunis",
    horaires: "6h - 20h",
  },
};

type FilterMode = "categorie" | "evenement" | "saison" | "attraction";

const mockLogements = [
  {
    id: 1, nom: "Hôtel El Mouradi Hammamet", lat: 36.4000, lng: 10.6167, proprietaire: "Ahmed Ben Salah",
    description: "Hôtel 5 étoiles avec vue sur mer, piscines, spa et restaurant gastronomique. Situé au cœur de la station balnéaire de Hammamet.",
    motivation: "Proximité de la plage et des monuments historiques de Hammamet. Idéal pour les familles et couples.",
    datesDisponibles: [new Date(2026, 3, 5), new Date(2026, 3, 10), new Date(2026, 3, 15), new Date(2026, 4, 1), new Date(2026, 4, 12)],
    datesEvenements: [new Date(2026, 3, 8), new Date(2026, 4, 20)],
    avis: 128, categorie: "Hôtel",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    evenements: [{ nom: "Festival de Hammamet", distance: 0.5 }, { nom: "Parc Carthage Land", distance: 1.2 }],
    saison: "Été",
    attractions: [{ nom: "Parc du Belvédère", distance: 80 }, { nom: "Centre commercial Tunisia Mall", distance: 75 }],
  },
  {
    id: 2, nom: "Hôtel Laico Tunis", lat: 36.8065, lng: 10.1815, proprietaire: "Fatima Trabelsi",
    description: "Hôtel moderne au centre-ville de Tunis, proche des ministères et ambassades. Chambres spacieuses et business center.",
    motivation: "Accès facile aux transports et proximité de la médina de Tunis. Parfait pour les voyages d'affaires.",
    datesDisponibles: [new Date(2026, 3, 2), new Date(2026, 3, 18), new Date(2026, 4, 5)],
    datesEvenements: [new Date(2026, 3, 14)],
    avis: 95, categorie: "Hôtel",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
    evenements: [{ nom: "Journées Cinématographiques", distance: 0.8 }, { nom: "Festival de Carthage", distance: 5.0 }],
    saison: "Printemps",
    attractions: [{ nom: "Musée du Bardo", distance: 2.0 }, { nom: "Parc du Belvédère", distance: 1.5 }],
  },
  {
    id: 3, nom: "Hôtel Sheraton Sousse", lat: 35.8256, lng: 10.6369, proprietaire: "Karim Gharbi",
    description: "Hôtel de luxe en front de mer à Sousse. Accès privé à la plage, piscine olimpique et animations nocturnes.",
    motivation: "Idéal pour les amateurs de sports nautiques et la vie nocturne de Sousse. Réservation early bird disponible.",
    datesDisponibles: [new Date(2026, 4, 3), new Date(2026, 4, 20)],
    datesEvenements: [new Date(2026, 3, 25), new Date(2026, 4, 10)],
    avis: 210, categorie: "Hôtel",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
    evenements: [{ nom: "Football", distance: 0.5 }, { nom: "Tennis", distance: 3.0 }],
    saison: "Été",
    attractions: [{ nom: "Salle omnisports de Sousse", distance: 2.0 }, { nom: "Centre commercial Tunisia Mall", distance: 120 }],
  },
  {
    id: 4, nom: "Maison Sidi Bou Saïd", lat: 36.8687, lng: 10.3497, proprietaire: "Nadia Bouzid",
    description: "Maison traditionnelle bleue et blanche avec vue panoramique sur la mer. Terrasse privée et décoration authentique tunisienne.",
    motivation: "Cadre romantique parfait pour les couples. À distance de marche de la célèbre colline de Sidi Bou Saïd.",
    datesDisponibles: [new Date(2026, 3, 1), new Date(2026, 3, 7), new Date(2026, 3, 22), new Date(2026, 4, 8)],
    datesEvenements: [new Date(2026, 3, 12)],
    avis: 34, categorie: "Maison",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    evenements: [{ nom: "Festival de Carthage", distance: 2.0 }, { nom: "Site archéologique", distance: 1.5 }],
    saison: "Printemps",
    attractions: [{ nom: "Parc du Belvédère", distance: 10 }, { nom: "Musée du Bardo", distance: 12 }],
  },
  {
    id: 5, nom: "Résidence Marina Yasmine", lat: 36.3833, lng: 10.5500, proprietaire: "Youssef Hammami",
    description: "Résidence de charme avec jardin et piscine privée. Proche du port de Yasmine Hammamet et des restaurants.",
    motivation: "Parfait pour les familles nombreuses. Cuisine équipée et espace de vie spacieux.",
    datesDisponibles: [new Date(2026, 3, 4), new Date(2026, 3, 11), new Date(2026, 4, 2), new Date(2026, 4, 15)],
    datesEvenements: [new Date(2026, 4, 5)],
    avis: 156, categorie: "Maison",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    evenements: [{ nom: "Parc Carthage Land", distance: 0.3 }, { nom: "Festival de Hammamet", distance: 2.0 }],
    saison: "Été",
    attractions: [{ nom: "Centre commercial Tunisia Mall", distance: 70 }, { nom: "Salle des fêtes", distance: 1.2 }],
  },
  {
    id: 6, nom: "Villa Djerba Heritage", lat: 33.8076, lng: 10.8451, proprietaire: "Samira Jlassi",
    description: "Villa de luxe avec piscine à Djerba. Architecture traditionnellemerge avec modernité. Plage privée à 5 minutes.",
    motivation: "Destination prisée pour les lune de miel. Séjour tout inclus disponible.",
    datesDisponibles: [new Date(2026, 5, 1), new Date(2026, 5, 15)],
    datesEvenements: [new Date(2026, 5, 10)],
    avis: 64, categorie: "Maison",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    evenements: [{ nom: "Site archéologique", distance: 3.0 }, { nom: "Handball", distance: 5.0 }],
    saison: "Été",
    attractions: [{ nom: "Terrain de handball", distance: 5.0 }, { nom: "Salle des fêtes", distance: 2.0 }],
  },
  {
    id: 7, nom: "Dar El Jeld", lat: 36.7994, lng: 10.1712, proprietaire: "Hassan Meddeb",
    description: "Maison d'hôtes de caractère dans la médina de Tunis. Patio intérieur, chambres décorées avec des éléments traditionnels.",
    motivation: "Immersion totale dans la culture tunisienne. Petit-déjeuner traditionnel inclus.",
    datesDisponibles: [new Date(2026, 3, 3), new Date(2026, 3, 19), new Date(2026, 4, 7)],
    datesEvenements: [new Date(2026, 3, 20)],
    avis: 87, categorie: "Maison d'hôtes",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
    evenements: [{ nom: "Journées Cinématographiques", distance: 1.0 }, { nom: "Musée du Bardo", distance: 3.0 }],
    saison: "Automne",
    attractions: [{ nom: "Palais des Congrès", distance: 4.0 }, { nom: "Parc du Belvédère", distance: 0.5 }],
  },
  {
    id: 8, nom: "Dar Zaghouan", lat: 36.4025, lng: 10.1427, proprietaire: "Amina Cherif",
    description: "Maison d'hôtes campagne aux pieds des montagnes de Zaghouan. Air pur,randonnées et détente garantis.",
    motivation: "Échappez au stress de la ville. Idéal pour les amateurs de nature et d'histoire.",
    datesDisponibles: [new Date(2026, 4, 10), new Date(2026, 4, 25)],
    datesEvenements: [new Date(2026, 4, 18)],
    avis: 45, categorie: "Maison d'hôtes",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
    evenements: [{ nom: "Basketball", distance: 15.0 }, { nom: "Football", distance: 20.0 }],
    saison: "Hiver",
    attractions: [{ nom: "Terrain de tennis", distance: 5.0 }, { nom: "Stade Olympique de Radès", distance: 40 }],
  },
  {
    id: 9, nom: "Dar Essalem Tozeur", lat: 33.9197, lng: 8.1335, proprietaire: "Omar Khelifi",
    description: "Maison d'hôtes traditionnelle à Tozeur. Architecture berbère authentique, patio avec palmiers et fontaine.",
    motivation: "Point de départ idéal pour explorer le désert du Sahara et les oasis de montagne.",
    datesDisponibles: [new Date(2026, 3, 6), new Date(2026, 3, 14), new Date(2026, 3, 28), new Date(2026, 4, 9)],
    datesEvenements: [new Date(2026, 3, 10), new Date(2026, 4, 1)],
    avis: 72, categorie: "Maison d'hôtes",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop",
    evenements: [{ nom: "Festival de Dougga", distance: 200 }, { nom: "Site archéologique", distance: 5.0 }],
    saison: "Printemps",
    attractions: [{ nom: "Salle des fêtes", distance: 1.0 }, { nom: "Foire Internationale de Tunis", distance: 350 }],
  },
  {
    id: 10, nom: "Ferme Bio Testour", lat: 36.5500, lng: 9.4450, proprietaire: "Rachid Sassi",
    description: "Ferme biologique certifiés aux produits locaux. Séjours découverte de la vie rurale tunisienne.",
    motivation: "Apprentissage de l'agriculture biologique. Repas traditionnels avec produits de la ferme.",
    datesDisponibles: [new Date(2026, 3, 8), new Date(2026, 3, 20), new Date(2026, 4, 4), new Date(2026, 4, 18)],
    datesEvenements: [new Date(2026, 4, 12)],
    avis: 23, categorie: "Ferme",
    image: "https://images.unsplash.com/photo-1595855709915-bd98974a31d2?w=400&h=300&fit=crop",
    evenements: [{ nom: "Festival de Dougga", distance: 30 }, { nom: "Site archéologique", distance: 25 }],
    saison: "Été",
    attractions: [{ nom: "Parc du Belvédère", distance: 100 }, { nom: "Foire Internationale de Tunis", distance: 95 }],
  },
  {
    id: 11, nom: "Ferme Oléicole Sfax", lat: 34.7406, lng: 10.7603, proprietaire: "Leila Bouazizi",
    description: "Ferme oléicole familiale à Sfax. Production d'huile d'olive extra vierge et séjour découverte.",
    motivation: "Dégustation d'huiles d'olive et découverte du processus de fabrication.",
    datesDisponibles: [new Date(2026, 3, 9), new Date(2026, 3, 25), new Date(2026, 4, 6)],
    datesEvenements: [new Date(2026, 3, 30)],
    avis: 18, categorie: "Ferme",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop",
    evenements: [{ nom: "Football", distance: 2.0 }, { nom: "Handball", distance: 3.0 }],
    saison: "Automne",
    attractions: [{ nom: "Salle omnisports de Sousse", distance: 130 }, { nom: "Terrain de handball", distance: 3.0 }],
  },
  {
    id: 12, nom: "Domaine Viticole Grombalia", lat: 36.6000, lng: 10.5000, proprietaire: "Mehdi Daoud",
    description: "Domaine viticole produces des vins rouges et blancs de qualité. Séjour œnologique avec cave à vin.",
    motivation: "Circuit de visite des vignobles et degustation de vins tunisiens.",
    datesDisponibles: [new Date(2026, 5, 5), new Date(2026, 5, 20)],
    datesEvenements: [new Date(2026, 5, 15)],
    avis: 41, categorie: "Ferme",
    image: "https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=400&h=300&fit=crop",
    evenements: [{ nom: "Festival de Carthage", distance: 40 }, { nom: "Zoo de Tunis", distance: 35 }],
    saison: "Hiver",
    attractions: [{ nom: "Palais des Congrès", distance: 50 }, { nom: "Centre commercial Tunisia Mall", distance: 45 }],
  },
];

const Hotels = () => {
  const [filterMode, setFilterMode] = useState<FilterMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvenement, setSelectedEvenement] = useState<string | null>(null);
  const [selectedSaison, setSelectedSaison] = useState<string | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);
  const [expandedEventGroup, setExpandedEventGroup] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [detailPopup, setDetailPopup] = useState<{ type: "evenement" | "attraction"; nom: string } | null>(null);
  const [recommendPopup, setRecommendPopup] = useState<{ hotelId: number; nom: string } | null>(null);
  const [recommendation, setRecommendation] = useState({ attraction: "", evenement: "", details: "" });
  const [expandedLodging, setExpandedLodging] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let results = mockLogements;

    if (search) {
      results = results.filter(h => h.nom.toLowerCase().includes(search.toLowerCase()));
    }

    if (filterMode === "categorie" && selectedCategory) {
      results = results.filter(h => h.categorie === selectedCategory);
    } else if (filterMode === "evenement" && selectedEvenement) {
      results = results.filter(h => h.evenements.some(e => e.nom === selectedEvenement));
    } else if (filterMode === "saison" && selectedSaison) {
      results = results.filter(h => h.saison === selectedSaison);
    } else if (filterMode === "attraction" && selectedAttraction) {
      results = results.filter(h => h.attractions.some(a => a.nom === selectedAttraction));
    }

    return [...results].sort((a, b) => {
      const catCompare = a.categorie.localeCompare(b.categorie, "fr");
      if (catCompare !== 0) return catCompare;
      return a.nom.localeCompare(b.nom, "fr");
    });
  }, [filterMode, selectedCategory, selectedEvenement, selectedSaison, selectedAttraction, search]);

  const handleFilterMode = (mode: FilterMode) => {
    if (filterMode === mode) {
      setFilterMode(null);
      setSelectedCategory(null);
      setSelectedEvenement(null);
      setSelectedSaison(null);
      setSelectedAttraction(null);
      setExpandedEventGroup(null);
    } else {
      setFilterMode(mode);
      setSelectedCategory(null);
      setSelectedEvenement(null);
      setSelectedSaison(null);
      setSelectedAttraction(null);
      setExpandedEventGroup(null);
    }
  };

  const filterModes: { key: FilterMode; label: string }[] = [
    { key: "categorie", label: "Catégorie" },
    { key: "evenement", label: "Événements" },
    { key: "saison", label: "Saison" },
    { key: "attraction", label: "Attractions" },
  ];

  const getTitle = () => {
    if (filterMode === "categorie" && selectedCategory) return `Liste des ${selectedCategory}`;
    if (filterMode === "evenement") {
      if (selectedEvenement) return `Logements près : ${selectedEvenement}`;
      return "Sélectionnez un événement";
    }
    if (filterMode === "saison") {
      if (selectedSaison) return `Logements en ${selectedSaison}`;
      return "Sélectionnez une saison";
    }
    if (filterMode === "attraction") {
      if (selectedAttraction) return `Logements près : ${selectedAttraction}`;
      return "Sélectionnez une attraction";
    }
    return "Tous les logements (A-Z)";
  };

  const detail = detailPopup
    ? detailPopup.type === "evenement"
      ? detailsEvenements[detailPopup.nom]
      : detailsAttractions[detailPopup.nom]
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-28 lg:w-32 bg-muted border-r border-border p-1 space-y-1 overflow-y-auto">
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between gap-1 text-sm hover:text-primary transition-colors"
            >
              <span className="flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                Trier par
              </span>
              <span>{showFilters ? "▲" : "▼"}</span>
            </button>
            {showFilters && (
              <div className="space-y-1 mt-2">
                {filterModes.map((mode) => (
                  <button
                    key={mode.key}
                    onClick={() => handleFilterMode(mode.key)}
                    className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                      filterMode === mode.key
                        ? "bg-primary text-white"
                        : "hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filterMode && (
            <div className="border-t border-gray-300 pt-3">
              {filterMode === "categorie" && (
                <div className="space-y-1">
                  <h4 className="text-xs font-medium text-pink-500 mb-1">Catégories</h4>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                      className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
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
                <div className="space-y-1 mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-pink-500 mb-1">Événements à proximité</h4>
                  {Object.entries(evenements).map(([group, items]) => (
                    <div key={group}>
                      <button
                        onClick={() => setExpandedEventGroup(expandedEventGroup === group ? null : group)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors"
                      >
                        {group}
                        {expandedEventGroup === group ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </button>
                      {expandedEventGroup === group && (
                        <div className="ml-3 space-y-0.5">
                          {items.map((evt) => (
                            <button
                              key={evt}
                              onClick={() => setSelectedEvenement(selectedEvenement === evt ? null : evt)}
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
                <div className="space-y-1 mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-pink-500 mb-1">Saisons</h4>
                  {saisons.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSaison(selectedSaison === s ? null : s)}
                      className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
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
                <div className="space-y-1 mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-xs font-medium text-pink-500 mb-1">Attractions à proximité</h4>
                  {attractionsProximite.map((a) => (
                    <button
                      key={a}
                      onClick={() => setSelectedAttraction(selectedAttraction === a ? null : a)}
                      className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
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
          )}
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
                  <th>Catégorie</th>
                  <th>Propriétaire</th>
                  <th>Adresse (coordonnées)</th>
                  <th>Calendrier</th>
                  <th>Événements (dist.)</th>
                  <th>Saison</th>
                  <th>Attractions (dist.)</th>
                  <th>Nb. Avis</th>
                  <th>Avis</th>
                  <th>Recommander</th>
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
                    <React.Fragment key={hotel.id}>
<tr className="dark:bg-[#3d3428]">
                      <td>
                        <button
                          onClick={() => setExpandedLodging(expandedLodging === hotel.id ? null : hotel.id)}
                          className="font-semibold whitespace-nowrap text-primary hover:underline"
                        >
                          {hotel.nom}
                        </button>
                      </td>
                      <td>
                        <span className="px-2 py-1 rounded-full text-xs bg-accent text-accent-foreground whitespace-nowrap">
                          {hotel.categorie}
                        </span>
                      </td>
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
                                <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
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
                                evenement: { backgroundColor: "hsl(35 60% 45%)", color: "white", borderRadius: "9999px" },
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </td>
                      <td className="text-xs">
                        <div className="space-y-0.5">
                          {hotel.evenements.map((e) => (
                            <button
                              key={e.nom}
                              onClick={() => setDetailPopup({ type: "evenement", nom: e.nom })}
                              className="whitespace-nowrap flex items-center gap-1 hover:text-primary transition-colors text-left"
                            >
                              <Info size={12} className="text-primary shrink-0" />
                              <span className="font-medium text-foreground underline decoration-dotted">{e.nom}</span>
                              <span className="text-muted-foreground">({e.distance} km)</span>
                            </button>
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
                            <button
                              key={a.nom}
                              onClick={() => setDetailPopup({ type: "attraction", nom: a.nom })}
                              className="whitespace-nowrap flex items-center gap-1 hover:text-primary transition-colors text-left"
                            >
                              <Info size={12} className="text-primary shrink-0" />
                              <span className="font-medium text-foreground underline decoration-dotted">{a.nom}</span>
                              <span className="text-muted-foreground">({a.distance} km)</span>
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="text-muted-foreground">{hotel.avis}</td>
                      <td>
                        <Link
                          to={`/avis?type=${encodeURIComponent(hotel.categorie)}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <MessageSquare size={12} />
                          Voir les avis
                        </Link>
                      </td>
                      <td>
                        <button
                          onClick={() => setRecommendPopup({ hotelId: hotel.id, nom: hotel.nom })}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          <Plus size={12} />
                          Ajouter
                        </button>
                      </td>
                    </tr>
                    {expandedLodging === hotel.id && (
                      <tr key={`${hotel.id}-details`}>
                        <td colSpan={11} className="p-4 bg-muted/30">
                          <div className="flex gap-6">
                            <img 
                              src={hotel.image} 
                              alt={hotel.nom}
                              className="w-48 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground mb-3">{hotel.description}</p>
                              <h4 className="font-semibold mb-2">Pourquoi choisir ce logement ?</h4>
                              <p className="text-sm text-muted-foreground">{hotel.motivation}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* Detail popup */}
      {detailPopup && detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDetailPopup(null)}>
          <div
            className="bg-background rounded-xl border border-border shadow-xl max-w-lg w-full mx-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setDetailPopup(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            <h3 className="font-display text-xl font-semibold mb-3 pr-8">{detailPopup.nom}</h3>
            <p className="text-sm text-muted-foreground mb-4">{"description" in detail ? detail.description : ""}</p>
            <div className="space-y-2 text-sm">
              {"lieu" in detail && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>Lieu :</strong> {(detail as any).lieu}</span>
                </div>
              )}
              {"adresse" in detail && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>Adresse :</strong> {(detail as any).adresse}</span>
                </div>
              )}
              {"date" in detail && (
                <div className="flex items-start gap-2">
                  <CalendarDays size={16} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>Date :</strong> {(detail as any).date}</span>
                </div>
              )}
              {"horaires" in detail && (detail as any).horaires && (
                <div className="flex items-start gap-2">
                  <CalendarDays size={16} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>Horaires :</strong> {(detail as any).horaires}</span>
                </div>
              )}
              {"prix" in detail && (detail as any).prix && (
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">💰</span>
                  <span><strong>Prix :</strong> {(detail as any).prix}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommendation popup */}
      {recommendPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRecommendPopup(null)}>
          <div
            className="bg-background rounded-xl border border-border shadow-xl max-w-lg w-full mx-4 p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setRecommendPopup(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            <h3 className="font-display text-xl font-semibold mb-3 pr-8">Recommander pour {recommendPopup.nom}</h3>
            <p className="text-sm text-muted-foreground mb-4">Partagez vos recommandations d'attractions et événements à proximité de ce logement.</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Attraction recommandée :</label>
                <input
                  type="text"
                  value={recommendation.attraction}
                  onChange={(e) => setRecommendation({...recommendation, attraction: e.target.value})}
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
                  className="input-field"
                  placeholder="Nom de l'événement..."
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Détails :</label>
                <textarea
                  value={recommendation.details}
                  onChange={(e) => setRecommendation({...recommendation, details: e.target.value})}
                  className="input-field min-h-[80px]"
                  placeholder="Pourquoi recommandez-vous cet endroit/événement..."
                />
              </div>
              <button
                onClick={() => { alert("Merci ! Votre recommandation a été enregistrée."); setRecommendPopup(null); setRecommendation({ attraction: "", evenement: "", details: "" }); }}
                className="w-full btn-primary"
              >
                Enregistrer la recommandation
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Hotels;
