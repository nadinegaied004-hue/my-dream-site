import React, { useState, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, ChevronDown, ChevronRight, CalendarDays, MapPin, Info, X, MessageSquare, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LangContext";

const categories = ["Hôtel", "Maison", "Maison d'hôtes", "Ferme"];

const villes = [
  "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa", "Ben Arous", 
  "Kasserine", "Médenine", "Monastir", "Mahdia", "Nabeul", "Béja", "Jendouba", "Le Kef", 
  "Siliana", "Kébili", "Tataouine", "Tozeur", "Zaghouan", "Sidi Bouzid", "Manouba", "Beni Khalled",
  "Hammamet", "Djerba", "Sidi Bou Saïd", "Mahdia", "Kairouan", "Dougga", "Carthage", "El Jem"
];

const evenements = {
  "Culturel": ["Festival de Carthage", "Festival de Dougga", "Festival de Hammamet", "Journées Cinématographiques"],
  "Sportif": ["Football", "Basketball", "Tennis", "Handball"],
};

const saisons = ["Printemps", "Été", "Automne", "Hiver"];

const attractionsProximite = [
  "Stade Olympique de Radès", "Salle omnisports de Sousse", "Terrain de tennis", "Terrain de handball",
  "Palais des Congrès", "Salle des fêtes", "Foire Internationale de Tunis", "Centre commercial Tunisia Mall", "Parc du Belvédère"
];

// Get translated label helper
const getTranslated = (t: (key: string) => string, key: string, fallback: string) => {
  return t(key) !== key ? t(key) : fallback;
};

// Détails des événements et attractions cliquables
const detailsEvenements: Record<string, { description: string; lieu: string; date: string; prix?: string; images: string[] }> = {
  "Festival de Carthage": {
    description: "Le Festival International de Carthage est le plus grand festival culturel de Tunisie, accueillant des artistes de renommée mondiale dans l'amphithéâtre romain de Carthage. Musique, théâtre, danse et spectacles variés chaque été depuis 1964.",
    lieu: "Amphithéâtre de Carthage, Tunis",
    date: "Juillet - Août 2026",
    prix: "30 - 120 TND",
    images: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1569127102784-3b1d5ca3a3d0?w=800&h=400&fit=crop",
    ],
  },
  "Festival de Dougga": {
    description: "Festival de théâtre et de musique classique organisé dans le site archéologique classé UNESCO de Dougga. Un cadre exceptionnel pour des spectacles inoubliables au cœur des ruines romaines.",
    lieu: "Site archéologique de Dougga, Béja",
    date: "Juin - Juillet 2026",
    prix: "20 - 60 TND",
    images: [
      "https://images.unsplash.com/photo-1569127102784-3b1d5ca3a3d0?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    ],
  },
  "Festival de Hammamet": {
    description: "Le Festival International de Hammamet se déroule dans le Centre Culturel International de Hammamet. Musique, théâtre et arts visuels dans un cadre méditerranéen unique.",
    lieu: "Centre Culturel International, Hammamet",
    date: "Juillet - Août 2026",
    prix: "25 - 80 TND",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=400&fit=crop",
    ],
  },
  "Journées Cinématographiques": {
    description: "Les Journées Cinématographiques de Carthage (JCC) sont le plus ancien festival de cinéma du continent africain, fondé en 1966. Films arabes et africains en compétition.",
    lieu: "Cité de la Culture, Tunis",
    date: "Octobre - Novembre 2026",
    prix: "10 - 30 TND",
    images: [
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517604931442-71053e683e12?w=800&h=400&fit=crop",
    ],
  },
  "Football": {
    description: "La Ligue 1 tunisienne avec les grands derbys : Espérance de Tunis vs Club Africain, Étoile du Sahel vs CS Sfaxien. Des matchs passionnants dans les plus grands stades du pays.",
    lieu: "Stades divers en Tunisie",
    date: "Toute la saison",
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop",
    ],
  },
  "Basketball": {
    description: "Le championnat tunisien de basketball avec des clubs comme l'US Monastir et le Club Africain. Matchs dynamiques dans les salles omnisports modernes.",
    lieu: "Salles omnisports en Tunisie",
    date: "Octobre - Mai",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
    ],
  },
  "Tennis": {
    description: "Tournois nationaux et internationaux de tennis organisés dans les complexes sportifs tunisiens. Le Tennis Club de Tunis accueille régulièrement des compétition ITF.",
    lieu: "Complexes sportifs en Tunisie",
    date: "Mars - Novembre",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34bf?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34bf?w=800&h=400&fit=crop",
    ],
  },
  "Handball": {
    description: "La Tunisie est une nation forte du handball africain. Le championnat national offre des matchs intenses avec des clubs comme l'Espérance et l'Étoile du Sahel.",
    lieu: "Salles omnisports en Tunisie",
    date: "Septembre - Juin",
    images: [
      "https://images.unsplash.com/photo-1591129841117-3adfd863e3a4?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1591129841117-3adfd863e3a4?w=800&h=400&fit=crop",
    ],
  },
  "Parc Carthage Land": {
    description: "Le plus grand parc d'attractions de Tunisie situé à Hammamet Yasmine. Montagnes russes, manèges aquatiques, spectacles en plein air et zone pour enfants. Une journée de divertissement pour toute la famille.",
    lieu: "Hammamet Yasmine, Nabeul",
    date: "Ouvert toute l'année",
    prix: "35 TND adulte / 25 TND enfant",
    images: [
      "https://images.unsplash.com/photo-1596272875729-ed2c21d50c47?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1596272875729-ed2c21d50c47?w=800&h=400&fit=crop",
    ],
  },
  "Zoo de Tunis": {
    description: "Le parc zoologique du Belvédère abit plus de 100 espèces animales dans un cadre verdoyant au cœur de Tunis. Lions de l'Atlas, singes, reptiles et oiseaux exotiques.",
    lieu: "Parc du Belvédère, Tunis",
    date: "Ouvert tous les jours",
    prix: "5 TND",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop",
    ],
  },
  "Musée du Bardo": {
    description: "Le Musée National du Bardo possède la plus grande collection de mosaïques romaines au monde. Classé patrimoine mondial de l'UNESCO, il retrace l'histoire de la Tunisie de la préhistoire à l'ère ottomane.",
    lieu: "Le Bardo, Tunis",
    date: "Mar-Dim, 9h-17h",
    prix: "13 TND",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    ],
  },
  "Site archéologique": {
    description: "La Tunisie regorge de sites archéologiques : Carthage (UNESCO), El Jem avec son colisée romain, Kerkouane (seule cité punique intacte), et Sbeitla avec ses temples romains.",
    lieu: "Divers sites en Tunisie",
    date: "Ouvert toute l'année",
    prix: "8 - 12 TND",
    images: [
      "https://images.unsplash.com/photo-1569127102784-3b1d5ca3a3d0?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1569127102784-3b1d5ca3a3d0?w=800&h=400&fit=crop",
    ],
  },
};

const detailsAttractions: Record<string, { description: string; adresse: string; horaires?: string; images: string[] }> = {
  "Stade Olympique de Radès": {
    description: "Le Stade Olympique de Radès (Stade Hammadi Agrebi) est le plus grand stade de Tunisie avec 60 000 places. Il accueille les matchs de l'équipe nationale et les finales de coupe.",
    adresse: "Radès, Ben Arous",
    horaires: "Selon les événements",
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop",
    ],
  },
  "Salle omnisports de Sousse": {
    description: "Salle multifonctionnelle accueillant basketball, handball et volleyball. Capacité de 6 000 places, rénovée en 2020.",
    adresse: "Sousse, Tunisie",
    horaires: "Selon les événements",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=400&fit=crop",
    ],
  },
  "Terrain de tennis": {
    description: "Courts de tennis modernes disponibles dans les complexes sportifs et les hôtels balnéaires. Surfaces en dur et terre battue.",
    adresse: "Disponible dans plusieurs villes",
    images: [
      "https://images.unsplash.com/photo-1554068865-24cecd4e34bf?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1554068865-24cecd4e34bf?w=800&h=400&fit=crop",
    ],
  },
  "Terrain de handball": {
    description: "Terrains couverts conformes aux normes internationales dans les principales villes tunisiennes.",
    adresse: "Disponible dans plusieurs villes",
    images: [
      "https://images.unsplash.com/photo-1591129841117-3adfd863e3a4?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1591129841117-3adfd863e3a4?w=800&h=400&fit=crop",
    ],
  },
  "Palais des Congrès": {
    description: "Le Palais des Congrès de Tunis est un centre de conventions moderne accueillant conférences internationales, séminaires et expositions professionnelles.",
    adresse: "Cité de la Culture, Tunis",
    horaires: "Selon les événements",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop",
    ],
  },
  "Salle des fêtes": {
    description: "Salles de réception pour mariages, événements sociaux et célébrations. Disponibles dans toutes les villes tunisiennes.",
    adresse: "Disponible partout en Tunisie",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=400&fit=crop",
    ],
  },
  "Foire Internationale de Tunis": {
    description: "La Foire Internationale de Tunis au Parc des Expositions du Kram accueille des salons professionnels, foires commerciales et expositions thématiques tout au long de l'année.",
    adresse: "Parc des Expositions, Le Kram, Tunis",
    horaires: "Selon les salons",
    images: [
      "https://images.unsplash.com/photo-1569127102784-3b1d5ca3a3d0?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1569127102784-3b1d5ca3a3d0?w=800&h=400&fit=crop",
    ],
  },
  "Centre commercial Tunisia Mall": {
    description: "Le plus grand centre commercial de Tunisie avec plus de 150 boutiques, restaurants, cinéma et espace de divertissement.",
    adresse: "Les Berges du Lac 2, Tunis",
    horaires: "10h - 22h tous les jours",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
    ],
  },
  "Parc du Belvédère": {
    description: "Le plus grand parc urbain de Tunis (110 hectares) avec zoo, jardin botanique, lac et sentiers ombragés. Un poumon vert au cœur de la capitale.",
    adresse: "Belvédère, Tunis",
    horaires: "6h - 20h",
    images: [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop",
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=400&fit=crop",
    ],
  },
};

type FilterMode = "categorie" | "evenement" | "saison" | "attraction" | "gouvernorat";

const mockLogements = [
  {
    id: 1, nom: "Hôtel El Mouradi Hammamet", ville: "Hammamet", lat: 36.4000, lng: 10.6167, proprietaire: "Ahmed Ben Salah",
    description: "Hôtel 5 étoiles avec vue sur mer, piscines, spa et restaurant gastronomique. 250 chambres et suites spacieuses avec balcon.",
    motivation: "Proximité de la plage et des monuments historiques de Hammamet. Idéal pour les familles et couples.",
    datesDisponibles: [new Date(2026, 3, 5), new Date(2026, 3, 10), new Date(2026, 3, 15), new Date(2026, 4, 1), new Date(2026, 4, 12)],
    datesEvenements: [new Date(2026, 3, 8), new Date(2026, 4, 20)],
    avis: 128, categorie: "Hôtel",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Festival de Hammamet", distance: 0.5 }, { nom: "Parc Carthage Land", distance: 1.2 }],
    saison: "Été",
    attractions: [{ nom: "Parc du Belvédère", distance: 80 }, { nom: "Centre commercial Tunisia Mall", distance: 75 }],
  },
  {
    id: 2, nom: "Hôtel Laico Tunis", ville: "Tunis", lat: 36.8065, lng: 10.1815, proprietaire: "Fatima Trabelsi",
    description: "Hôtel moderne au centre-ville de Tunis, proche des ministères et ambassades. 180 chambres spacieuses et business center.",
    motivation: "Accès facile aux transports et proximité de la médina de Tunis. Parfait pour les voyages d'affaires.",
    datesDisponibles: [new Date(2026, 3, 2), new Date(2026, 3, 18), new Date(2026, 4, 5)],
    datesEvenements: [new Date(2026, 3, 14)],
    avis: 95, categorie: "Hôtel",
    images: [
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Journées Cinématographiques", distance: 0.8 }, { nom: "Festival de Carthage", distance: 5.0 }],
    saison: "Printemps",
    attractions: [{ nom: "Musée du Bardo", distance: 2.0 }, { nom: "Parc du Belvédère", distance: 1.5 }],
  },
  {
    id: 3, nom: "Hôtel Sheraton Sousse", ville: "Sousse", lat: 35.8256, lng: 10.6369, proprietaire: "Karim Gharbi",
    description: "Hôtel de luxe en front de mer à Sousse. Accès privé à la plage, piscine olimpique et 320 chambres avec vue sur mer.",
    motivation: "Idéal pour les amateurs de sports nautiques et la vie nocturne de Sousse. Réservation early bird disponible.",
    datesDisponibles: [new Date(2026, 4, 3), new Date(2026, 4, 20)],
    datesEvenements: [new Date(2026, 3, 25), new Date(2026, 4, 10)],
    avis: 210, categorie: "Hôtel",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Football", distance: 0.5 }, { nom: "Tennis", distance: 3.0 }],
    saison: "Été",
    attractions: [{ nom: "Salle omnisports de Sousse", distance: 2.0 }, { nom: "Centre commercial Tunisia Mall", distance: 120 }],
  },
  {
    id: 4, nom: "Maison Sidi Bou Saïd", ville: "Sidi Bou Saïd", lat: 36.8687, lng: 10.3497, proprietaire: "Nadia Bouzid",
    description: "Maison traditionnelle bleue et blanche avec vue panoramique sur la mer. Terrasse privée et décoration authentique tunisienne. 4 chambres.",
    motivation: "Cadre romantique parfait pour les couples. À distance de marche de la célèbre colline de Sidi Bou Saïd.",
    datesDisponibles: [new Date(2026, 3, 1), new Date(2026, 3, 7), new Date(2026, 3, 22), new Date(2026, 4, 8)],
    datesEvenements: [new Date(2026, 3, 12)],
    avis: 34, categorie: "Maison",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Festival de Carthage", distance: 2.0 }, { nom: "Site archéologique", distance: 1.5 }],
    saison: "Printemps",
    attractions: [{ nom: "Parc du Belvédère", distance: 10 }, { nom: "Musée du Bardo", distance: 12 }],
  },
  {
    id: 5, nom: "Résidence Marina Yasmine", ville: "Hammamet", lat: 36.3833, lng: 10.5500, proprietaire: "Youssef Hammami",
    description: "Résidence de charme avec jardin et piscine privée. Proche du port de Yasmine Hammamet et des restaurants. 6 chambres.",
    motivation: "Parfait pour les familles nombreuses. Cuisine équipée et espace de vie spacieux.",
    datesDisponibles: [new Date(2026, 3, 4), new Date(2026, 3, 11), new Date(2026, 4, 2), new Date(2026, 4, 15)],
    datesEvenements: [new Date(2026, 4, 5)],
    avis: 156, categorie: "Maison",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Parc Carthage Land", distance: 0.3 }, { nom: "Festival de Hammamet", distance: 2.0 }],
    saison: "Été",
    attractions: [{ nom: "Centre commercial Tunisia Mall", distance: 70 }, { nom: "Salle des fêtes", distance: 1.2 }],
  },
  {
    id: 6, nom: "Villa Djerba Heritage", ville: "Djerba", lat: 33.8076, lng: 10.8451, proprietaire: "Samira Jlassi",
    description: "Villa de luxe avec piscine à Djerba. Architecture traditionnellemerge avec modernité. Plage privée à 5 minutes. 5 chambres.",
    motivation: "Destination prisée pour les lune de miel. Séjour tout inclus disponible.",
    datesDisponibles: [new Date(2026, 5, 1), new Date(2026, 5, 15)],
    datesEvenements: [new Date(2026, 5, 10)],
    avis: 64, categorie: "Maison",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Site archéologique", distance: 3.0 }, { nom: "Handball", distance: 5.0 }],
    saison: "Été",
    attractions: [{ nom: "Terrain de handball", distance: 5.0 }, { nom: "Salle des fêtes", distance: 2.0 }],
  },
  {
    id: 7, nom: "Dar El Jeld", ville: "Tunis", lat: 36.7994, lng: 10.1712, proprietaire: "Hassan Meddeb",
    description: "Maison d'hôtes de caractère dans la médina de Tunis. Patio intérieur, chambres décorées avec des éléments traditionnels. 8 chambres.",
    motivation: "Immersion totale dans la culture tunisienne. Petit-déjeuner traditionnel inclus.",
    datesDisponibles: [new Date(2026, 3, 3), new Date(2026, 3, 19), new Date(2026, 4, 7)],
    datesEvenements: [new Date(2026, 3, 20)],
    avis: 87, categorie: "Maison d'hôtes",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Journées Cinématographiques", distance: 1.0 }, { nom: "Musée du Bardo", distance: 3.0 }],
    saison: "Automne",
    attractions: [{ nom: "Palais des Congrès", distance: 4.0 }, { nom: "Parc du Belvédère", distance: 0.5 }],
  },
  {
    id: 8, nom: "Dar Zaghouan", ville: "Zaghouan", lat: 36.4025, lng: 10.1427, proprietaire: "Amina Cherif",
    description: "Maison d'hôtes campagne aux pieds des montagnes de Zaghouan. Air pur,randonnées et détente garantis. 5 chambres.",
    motivation: "Échappez au stress de la ville. Idéal pour les amateurs de nature et d'histoire.",
    datesDisponibles: [new Date(2026, 4, 10), new Date(2026, 4, 25)],
    datesEvenements: [new Date(2026, 4, 18)],
    avis: 45, categorie: "Maison d'hôtes",
    images: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Basketball", distance: 15.0 }, { nom: "Football", distance: 20.0 }],
    saison: "Hiver",
    attractions: [{ nom: "Terrain de tennis", distance: 5.0 }, { nom: "Stade Olympique de Radès", distance: 40 }],
  },
  {
    id: 9, nom: "Dar Essalem Tozeur", ville: "Tozeur", lat: 33.9197, lng: 8.1335, proprietaire: "Omar Khelifi",
    description: "Maison d'hôtes traditionnelle à Tozeur. Architecture berbère authentique, patio avec palmiers et fontaine. 6 chambres.",
    motivation: "Point de départ idéal pour explorer le désert du Sahara et les oasis de montagne.",
    datesDisponibles: [new Date(2026, 3, 6), new Date(2026, 3, 14), new Date(2026, 3, 28), new Date(2026, 4, 9)],
    datesEvenements: [new Date(2026, 3, 10), new Date(2026, 4, 1)],
    avis: 72, categorie: "Maison d'hôtes",
    images: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Festival de Dougga", distance: 200 }, { nom: "Site archéologique", distance: 5.0 }],
    saison: "Printemps",
    attractions: [{ nom: "Salle des fêtes", distance: 1.0 }, { nom: "Foire Internationale de Tunis", distance: 350 }],
  },
  {
    id: 10, nom: "Ferme Bio Testour", ville: "Béja", lat: 36.5500, lng: 9.4450, proprietaire: "Rachid Sassi",
    description: "Ferme biologique certifications aux produits locaux. Séjours découverte de la vie rurale tunisienne. 4 chambres d'hôtes.",
    motivation: "Apprentissage de l'agriculture biologique. Repas traditionnels avec produits de la ferme.",
    datesDisponibles: [new Date(2026, 3, 8), new Date(2026, 3, 20), new Date(2026, 4, 4), new Date(2026, 4, 18)],
    datesEvenements: [new Date(2026, 4, 12)],
    avis: 23, categorie: "Ferme",
    images: [
      "https://images.unsplash.com/photo-1595855709915-bd98974a31d2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Festival de Dougga", distance: 30 }, { nom: "Site archéologique", distance: 25 }],
    saison: "Été",
    attractions: [{ nom: "Parc du Belvédère", distance: 100 }, { nom: "Foire Internationale de Tunis", distance: 95 }],
  },
  {
    id: 11, nom: "Ferme Oléicole Sfax", ville: "Sfax", lat: 34.7406, lng: 10.7603, proprietaire: "Leila Bouazizi",
    description: "Ferme oléicole familiale à Sfax. Production d'huile d'olive extra vierge et séjour découverte. 3 chambres d'hôtes.",
    motivation: "Dégustation d'huiles d'olive et découverte du processus de fabrication.",
    datesDisponibles: [new Date(2026, 3, 9), new Date(2026, 3, 25), new Date(2026, 4, 6)],
    datesEvenements: [new Date(2026, 3, 30)],
    avis: 18, categorie: "Ferme",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Football", distance: 2.0 }, { nom: "Handball", distance: 3.0 }],
    saison: "Automne",
    attractions: [{ nom: "Salle omnisports de Sousse", distance: 130 }, { nom: "Terrain de handball", distance: 3.0 }],
  },
  {
    id: 12, nom: "Domaine Viticole Grombalia", ville: "Nabeul", lat: 36.6000, lng: 10.5000, proprietaire: "Mehdi Daoud",
    description: "Domaine viticole produces des vins rouges et blancs de qualité. Séjour œnologique avec cave à vin. 5 chambres d'hôtes.",
    motivation: "Circuit de visite des vignobles et degustation de vins tunisiens.",
    datesDisponibles: [new Date(2026, 5, 5), new Date(2026, 5, 20)],
    datesEvenements: [new Date(2026, 5, 15)],
    avis: 41, categorie: "Ferme",
    images: [
      "https://images.unsplash.com/photo-1523528283115-9bf9b1699245?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    ],
    evenements: [{ nom: "Festival de Carthage", distance: 40 }, { nom: "Zoo de Tunis", distance: 35 }],
    saison: "Hiver",
    attractions: [{ nom: "Palais des Congrès", distance: 50 }, { nom: "Centre commercial Tunisia Mall", distance: 45 }],
  },
];

const Hotels = () => {
  const { t } = useLang();
  const [filterMode, setFilterMode] = useState<FilterMode | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGouvernorat, setSelectedGouvernorat] = useState<string | null>(null);
  const [selectedEvenement, setSelectedEvenement] = useState<string | null>(null);
  const [selectedSaison, setSelectedSaison] = useState<string | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<string | null>(null);
  const [expandedEventGroup, setExpandedEventGroup] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [detailPopup, setDetailPopup] = useState<{ type: "evenement" | "attraction" | "logement"; nom: string } | null>(null);
  const [lodgingDetail, setLodgingDetail] = useState<typeof mockLogements[0] | null>(null);
  const [lodgingImageIndex, setLodgingImageIndex] = useState(0);
  const [recommendPopup, setRecommendPopup] = useState<{ hotelId: number; nom: string } | null>(null);
  const [recommendation, setRecommendation] = useState({ attraction: "", evenement: "", details: "" });
  const [expandedLodging, setExpandedLodging] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: "left" | "right") => {
    const tableContainer = document.getElementById("table-scroll-container");
    if (tableContainer) {
      const scrollAmount = 200;
      const currentScroll = tableContainer.scrollLeft;
      tableContainer.scrollTo({
        left: direction === "right" ? currentScroll + scrollAmount : currentScroll - scrollAmount,
        behavior: "smooth"
      });
    }
  };

  const filtered = useMemo(() => {
    let results = mockLogements;

    if (search) {
      results = results.filter(h => h.nom.toLowerCase().startsWith(search.toLowerCase()));
    }

    if (filterMode === "categorie" && selectedCategory) {
      results = results.filter(h => h.categorie === selectedCategory);
    } else if (filterMode === "gouvernorat" && selectedGouvernorat) {
      results = results.filter(h => h.ville === selectedGouvernorat);
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
  }, [filterMode, selectedCategory, selectedGouvernorat, selectedEvenement, selectedSaison, selectedAttraction, search]);

  const handleFilterMode = (mode: FilterMode) => {
    if (filterMode === mode) {
      setFilterMode(null);
      setSelectedCategory(null);
      setSelectedGouvernorat(null);
      setSelectedEvenement(null);
      setSelectedSaison(null);
      setSelectedAttraction(null);
      setExpandedEventGroup(null);
    } else {
      setFilterMode(mode);
      setSelectedCategory(null);
      setSelectedGouvernorat(null);
      setSelectedEvenement(null);
      setSelectedSaison(null);
      setSelectedAttraction(null);
      setExpandedEventGroup(null);
    }
  };

  const filterModes: { key: FilterMode; labelKey: string }[] = [
    { key: "categorie", labelKey: "Catégorie" },
    { key: "gouvernorat", labelKey: "Gouvernorat" },
    { key: "evenement", labelKey: "Événements" },
    { key: "saison", labelKey: "Saison" },
    { key: "attraction", labelKey: "Attractions" },
  ];

  const getTitle = () => {
    if (filterMode === "categorie" && selectedCategory) return `${t("Liste des")} ${selectedCategory}`;
    if (filterMode === "gouvernorat") {
      if (selectedGouvernorat) return `${t("Logements à")} ${selectedGouvernorat}`;
      return t("Sélectionnez un gouvernorat");
    }
    if (filterMode === "evenement") {
      if (selectedEvenement) return `${t("Logements près")} ${selectedEvenement}`;
      return t("Sélectionnez un événement");
    }
    if (filterMode === "saison") {
      if (selectedSaison) return `${t("Logements près")} ${selectedSaison}`;
      return t("Sélectionnez une saison");
    }
    if (filterMode === "attraction") {
      if (selectedAttraction) return `${t("Logements près")} ${selectedAttraction}`;
      return t("Sélectionnez une attraction");
    }
    return t("Tous les logements");
  };

  const detail = detailPopup
    ? detailPopup.type === "evenement"
      ? detailsEvenements[detailPopup.nom]
      : detailsAttractions[detailPopup.nom]
    : null;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
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
                {t("Trier par")}
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
                        : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-[#FFAB91]"
                    }`}
                  >
                    {t(mode.labelKey)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {filterMode && (
            <div className="border-t border-gray-300 pt-3">
              {filterMode === "categorie" && (
                <div className="space-y-1">
                  <h4 className="text-sm font-bold mb-2">{t("Catégories")}</h4>
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
                      {t(cat)}
                    </button>
                  ))}
                </div>
              )}

              {filterMode === "gouvernorat" && (
                <div className="space-y-1 mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-bold mb-2">{t("Gouvernorat")}</h4>
                  {villes.map((ville) => (
                    <button
                      key={ville}
                      onClick={() => setSelectedGouvernorat(selectedGouvernorat === ville ? null : ville)}
                      className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                        selectedGouvernorat === ville
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {ville}
                    </button>
                  ))}
                </div>
              )}

              {filterMode === "evenement" && (
                <div className="space-y-1 mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-bold mb-2">{t("Événements à proximité")}</h4>
                  {Object.entries(evenements).map(([groupKey, items]) => (
                    <div key={groupKey}>
                      <button
                        onClick={() => setExpandedEventGroup(expandedEventGroup === groupKey ? null : groupKey)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted text-foreground transition-colors"
                      >
                        {t(groupKey)}
                        {expandedEventGroup === groupKey ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </button>
                      {expandedEventGroup === groupKey && (
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
                              {t(evt)}
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
                  <h4 className="text-sm font-bold mb-2">{t("Saisons")}</h4>
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
                      {t(s)}
                    </button>
                  ))}
                </div>
              )}

              {filterMode === "attraction" && (
                <div className="space-y-1 mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-bold mb-2">{t("Attractions à proximité")}</h4>
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
                      {t(a)}
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
                placeholder={t("Rechercher")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-9 !py-2 text-sm w-64"
              />
            </div>
          </div>

            <div className="relative pt-4 pb-4">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("table-scroll-container");
                if (el) el.scrollLeft = el.scrollLeft - 200;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
              style={{ marginLeft: "-16px" }}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("table-scroll-container");
                if (el) el.scrollLeft = el.scrollLeft + 200;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
              style={{ marginRight: "-16px" }}
            >
              →
            </button>
            <div className="overflow-x-auto rounded-lg border border-border scrollbar-hide" id="table-scroll-container">
              <div className="max-h-[600px] overflow-y-auto">
              <table className="hotel-table w-full">
              <thead className="sticky top-0 z-10 bg-background dark:bg-[#2a241e]">
                <tr>
                  <th>{t("Nom")}</th>
                  <th>{t("Gouvernorat")}</th>
                  <th>{t("Catégorie_col")}</th>
                  <th>{t("Propriétaire")}</th>
                  <th>{t("Adresse (coordonnées)")}</th>
                  <th>{t("Calendrier")}</th>
                  <th>{t("Événements (dist.)")}</th>
                  <th>{t("Saison_col")}</th>
                  <th>{t("Attractions (dist.)")}</th>
                  <th>{t("Nb. Avis")}</th>
                  <th>{t("Avis_col")}</th>
                  <th>{t("Recommander")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-muted-foreground py-8">
                      {t("Aucun logement trouvé")}
                    </td>
                  </tr>
                ) : (
                  filtered.map((hotel) => (
                    <React.Fragment key={hotel.id}>
                      <tr className="dark:bg-[#3d3428]">
                        <td>
                          <button
                            onClick={() => { setLodgingDetail(hotel); setLodgingImageIndex(0); setDetailPopup({ type: "logement", nom: hotel.nom }); }}
                            className="font-semibold whitespace-nowrap text-primary hover:underline"
                          >
                            {t(hotel.nom)}
                          </button>
                        </td>
                        <td className="text-muted-foreground whitespace-nowrap">{t(hotel.ville)}</td>
                        <td>
                          <span className="px-2 py-1 rounded-full text-xs bg-accent text-accent-foreground whitespace-nowrap">
                            {t(hotel.categorie)}
                          </span>
                        </td>
                        <td className="text-muted-foreground whitespace-nowrap">{t(hotel.proprietaire)}</td>
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
                              {hotel.datesDisponibles.length} {t("dates")}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-2 text-xs space-y-1 border-b border-border">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
                                <span>{t("Logement disponible")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-600 inline-block" />
                                <span>{t("Événement à proximité")}</span>
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
                            {hotel.evenements.length > 0 && (
                              <div className="p-2 border-t border-border max-h-32 overflow-y-auto">
                                <p className="text-xs font-medium mb-1">{t("Événements disponibles")}:</p>
                                <div className="space-y-1">
                                  {hotel.evenements.map((e) => (
                                    <button
                                      key={e.nom}
                                      onClick={() => setDetailPopup({ type: "evenement", nom: e.nom })}
                                      className="text-xs text-left text-amber-700 hover:text-amber-900 flex items-center gap-1 w-full"
                                    >
                                      <span>•</span> {t(e.nom)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
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
                              <span className="font-medium text-foreground underline decoration-dotted">{t(e.nom)}</span>
                              <span className="text-muted-foreground">({e.distance} km)</span>
                            </button>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                          {t(hotel.saison)}
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
                              <span className="font-medium text-foreground underline decoration-dotted">{t(a.nom)}</span>
                              <span className="text-muted-foreground">({a.distance} km)</span>
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="text-muted-foreground">{hotel.avis}</td>
                      <td>
                        <Link
                          to={`/avis?type=${encodeURIComponent(hotel.categorie)}&logement=${encodeURIComponent(hotel.nom)}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <MessageSquare size={12} />
                          {t("Voir les avis")}
                        </Link>
                      </td>
                      <td>
                        <button
                          onClick={() => setRecommendPopup({ hotelId: hotel.id, nom: hotel.nom })}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                        >
                          <Plus size={12} />
                          {t("Ajouter")}
                        </button>
                      </td>
                    </tr>
                    {expandedLodging === hotel.id && (
                      <tr key={`${hotel.id}-details`}>
                        <td colSpan={11} className="p-4 bg-muted/30">
                          <div className="flex gap-6">
                            <img 
                              src={hotel.images && hotel.images[0] ? hotel.images[0] : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"} 
                              alt={hotel.nom}
                              className="w-48 h-32 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-2">{t("Description")}</h4>
                              <p className="text-sm text-muted-foreground mb-3">{hotel.description}</p>
                              <h4 className="font-semibold mb-2">{t("Pourquoi choisir ce logement")}</h4>
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
            </div>
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
            {"images" in detail && detail.images && detail.images.length > 0 && (
              <div className="grid grid-cols-2 gap-1 mb-4">
                {detail.images.map((img: string, idx: number) => (
                  <img key={idx} src={img} alt={`${detailPopup.nom} ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                ))}
              </div>
            )}
            <h3 className="font-display text-xl font-semibold mb-3 pr-8">{detailPopup.nom}</h3>
            <p className="text-sm text-muted-foreground mb-4">{"description" in detail ? detail.description : ""}</p>
            <div className="space-y-2 text-sm">
              {"lieu" in detail && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>{t("Lieu")}</strong> {(detail as any).lieu}</span>
                </div>
              )}
              {"adresse" in detail && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>{t("Adresse")}</strong> {(detail as any).adresse}</span>
                </div>
              )}
              {"date" in detail && (
                <div className="flex items-start gap-2">
                  <CalendarDays size={16} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>{t("Date")}</strong> {(detail as any).date}</span>
                </div>
              )}
              {"horaires" in detail && (detail as any).horaires && (
                <div className="flex items-start gap-2">
                  <CalendarDays size={16} className="text-primary shrink-0 mt-0.5" />
                  <span><strong>{t("Horaires")}</strong> {(detail as any).horaires}</span>
                </div>
              )}
              {"prix" in detail && (detail as any).prix && (
                <div className="flex items-start gap-2">
                  <span className="text-primary font-bold shrink-0">💰</span>
                  <span><strong>{t("Prix")}</strong> {(detail as any).prix}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lodging detail popup */}
      {detailPopup?.type === "logement" && lodgingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setDetailPopup(null); setLodgingDetail(null); }}>
          <div
            className="bg-background rounded-xl border border-border shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => { setDetailPopup(null); setLodgingDetail(null); }} 
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10 bg-background/80 rounded-full p-1"
            >
              <X size={24} />
            </button>

            <div className="p-6 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-display font-bold">{lodgingDetail.nom}</h3>
                <span className="px-2 py-1 rounded-full text-xs bg-accent text-accent-foreground">
                  {t(lodgingDetail.categorie)}
                </span>
              </div>
            </div>

            {/* Images grid */}
            <div className="grid grid-cols-2 gap-1 p-1">
              {(lodgingDetail.images && lodgingDetail.images.length > 0 ? lodgingDetail.images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"]).map((img: string, idx: number) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`${lodgingDetail.nom} ${idx + 1}`} 
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-semibold mb-2">{t("Description")}</h4>
                <p className="text-sm text-muted-foreground">{lodgingDetail.description}</p>
              </div>

              {/* Motivation */}
              <div>
                <h4 className="font-semibold mb-2">{t("Pourquoi choisir ce logement")}</h4>
                <p className="text-sm text-muted-foreground">{lodgingDetail.motivation}</p>
              </div>
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
            <h3 className="font-display text-xl font-semibold mb-3 pr-8">{t("Recommander pour")} {recommendPopup.nom}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t("Partagez vos recommandations")}</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">{t("Attraction recommandée:")}</label>
                <input
                  type="text"
                  value={recommendation.attraction}
                  onChange={(e) => setRecommendation({...recommendation, attraction: e.target.value})}
                  className="input-field"
                  placeholder={t("Nom de l'attraction")}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">{t("Événement recommandé:")}</label>
                <input
                  type="text"
                  value={recommendation.evenement}
                  onChange={(e) => setRecommendation({...recommendation, evenement: e.target.value})}
                  className="input-field"
                  placeholder={t("Nom de l'événement")}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">{t("Détails:")}</label>
                <textarea
                  value={recommendation.details}
                  onChange={(e) => setRecommendation({...recommendation, details: e.target.value})}
                  className="input-field min-h-[80px]"
                  placeholder={t("Pourquoi recommandez-vous")}
                />
              </div>
              <button
                onClick={() => { alert(t("Merci ! Votre recommandation")); setRecommendPopup(null); setRecommendation({ attraction: "", evenement: "", details: "" }); }}
                className="w-full btn-primary"
              >
                {t("Enregistrer la recommandation")}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
      <Footer />
    </div>
  );
};

export default Hotels;
