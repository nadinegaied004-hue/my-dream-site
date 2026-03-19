import { useState } from "react";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = ["Hôtels", "Maisons", "Maisons d'hôtes", "Fermes"];

const mockLogements = [
  { id: 1, nom: "Hôtel Royal Palace", adresse: "123 Av. Mohammed V", disponible: true, avis: 128, categorie: "Hôtels" },
  { id: 2, nom: "Hôtel Marrakech Inn", adresse: "45 Rue de Fès", disponible: true, avis: 95, categorie: "Hôtels" },
  { id: 3, nom: "Hôtel Casablanca View", adresse: "Bd de la Corniche", disponible: false, avis: 210, categorie: "Hôtels" },
  { id: 4, nom: "Maison du Jardin", adresse: "12 Rue des Fleurs", disponible: true, avis: 34, categorie: "Maisons" },
  { id: 5, nom: "Résidence Marina", adresse: "Port de plaisance", disponible: true, avis: 156, categorie: "Maisons" },
  { id: 6, nom: "Villa des Dunes", adresse: "Zone touristique", disponible: false, avis: 64, categorie: "Maisons" },
  { id: 7, nom: "Riad Les Oliviers", adresse: "45 Rue des Roses", disponible: true, avis: 87, categorie: "Maisons d'hôtes" },
  { id: 8, nom: "Maison d'hôtes Atlas", adresse: "12 Bd Hassan II", disponible: false, avis: 45, categorie: "Maisons d'hôtes" },
  { id: 9, nom: "Dar Essalam", adresse: "Médina ancienne", disponible: true, avis: 72, categorie: "Maisons d'hôtes" },
  { id: 10, nom: "Ferme du Soleil", adresse: "Route de Ouarzazate", disponible: true, avis: 23, categorie: "Fermes" },
  { id: 11, nom: "Ferme Bio Atlas", adresse: "Vallée de l'Ourika", disponible: true, avis: 18, categorie: "Fermes" },
  { id: 12, nom: "Domaine des Oliviers", adresse: "Route de Meknès", disponible: false, avis: 41, categorie: "Fermes" },
];

const Hotels = () => {
  const [selectedCategory, setSelectedCategory] = useState("Hôtels");
  const [search, setSearch] = useState("");

  const filtered = mockLogements.filter(
    (h) =>
      h.categorie === selectedCategory &&
      h.nom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-card border-r border-border p-4 space-y-1">
          <h3 className="font-display font-semibold text-lg mb-3">Catégories</h3>
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
        </aside>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="section-title text-2xl">Liste des {selectedCategory}</h2>
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
                {filtered.map((hotel) => (
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
                ))}
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
