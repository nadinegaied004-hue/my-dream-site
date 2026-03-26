import { Link } from "react-router-dom";
import { Shield, Home, Zap, Award, Users, Eye, Star, MapPin, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLang } from "@/context/LangContext";
import { useState, useEffect } from "react";

const heroImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop",
];

const features = [
  { icon: Award, titleKey: "Expérience personnalisée", descKey: "Des recommandations adaptées" },
  { icon: Home, titleKey: "Logements variés", descKey: "Hôtel, maisons, fermes" },
  { icon: Zap, titleKey: "Service rapide", descKey: "Réservation en quelques clics" },
  { icon: Shield, titleKey: "Données sécurisées", descKey: "Vos informations sont protégées" },
  { icon: Users, titleKey: "Expérience depuis 6 ans", descKey: "Une expertise reconnue" },
];

const Index = () => {
  const { t } = useLang();
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero with sliding images */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {heroImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Hôtel ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-hotel-dark/60" />
        
        {/* Image indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImage ? "bg-primary w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-hotel-cream mb-4">
            {t("Trouvez votre logement idéal")}
          </h1>
          <p className="text-lg md:text-xl text-hotel-cream/80 mb-8">
            {t("Les meilleures activités et hébergements")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/hotels" className="btn-primary text-lg">
              {t("Explorer les logements")}
            </Link>
            <Link to="/connexion" className="btn-outline border-hotel-cream text-hotel-cream hover:bg-hotel-cream hover:text-hotel-dark text-lg">
              {t("Se connecter")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title mb-2">{t("Notre communauté en chiffres")}</h2>
            <p className="text-muted-foreground">{t("Visiteurs par mois")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="stat-card animate-count-up">
              <Eye className="mx-auto mb-2 text-primary" size={32} />
              <div className="text-3xl font-display font-bold text-primary">4 000 000+</div>
              <div className="text-sm text-muted-foreground mt-1">{t("Visiteurs par mois")}</div>
            </div>
            <div className="stat-card animate-count-up" style={{ animationDelay: "0.15s" }}>
              <Home className="mx-auto mb-2 text-primary" size={32} />
              <div className="text-3xl font-display font-bold text-primary">12 500+</div>
              <div className="text-sm text-muted-foreground mt-1">{t("Logements")}</div>
            </div>
            <div className="stat-card animate-count-up" style={{ animationDelay: "0.3s" }}>
              <Star className="mx-auto mb-2 text-primary" size={32} />
              <div className="text-3xl font-display font-bold text-primary">4.8/5</div>
              <div className="text-sm text-muted-foreground mt-1">{t("Note moyenne")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title mb-2">{t("Pourquoi choisir StayEase")}</h2>
            <p className="text-muted-foreground">{t("Une expérience unique")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((f, i) => (
              <div key={i} className="feature-card text-center">
                <f.icon className="mx-auto mb-3 text-primary" size={28} />
                <h3 className="font-display font-semibold mb-2">{t(f.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular destinations */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="section-title mb-2">{t("Destinations populaires")}</h2>
            <p className="text-muted-foreground">{t("Les lieux les plus visités")}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Hammamet", region: "Nabeul", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop" },
              { name: "Sidi Bou Saïd", region: "Tunis", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop" },
              { name: "Djerba", region: "Médenine", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop" },
              { name: "Sousse", region: "Sousse", img: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop" },
            ].map((dest, i) => (
              <div key={i} className="group relative overflow-hidden rounded-xl">
                <img src={dest.img} alt={dest.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <MapPin size={14} className="inline mr-1" />
                  <span className="font-semibold">{dest.name}</span>
                  <span className="text-xs text-white/70 block">{dest.region}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">{t("Prêt à explorer la Tunisie?")}</h2>
          <p className="text-lg mb-8 text-white/90">{t("Réservez votre prochain séjour")}</p>
          <Link 
            to="/hotels" 
            className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg text-lg hover:bg-gray-100 transition-colors shadow-lg border-2 border-transparent hover:border-white"
          >
            {t("Découvrir les logements")}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;