import { Link } from "react-router-dom";
import { Shield, Home, Zap, Award, Users, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/hero-hotel.jpg";

const features = [
  { icon: Award, title: "Expérience personnalisée", desc: "Des recommandations adaptées à vos goûts et besoins" },
  { icon: Home, title: "Logements variés", desc: "Hôtels, maisons, fermes, et bien plus encore" },
  { icon: Zap, title: "Service rapide", desc: "Réservation en quelques clics, réponse immédiate" },
  { icon: Shield, title: "Données sécurisées", desc: "Vos informations sont protégées et confidentielles" },
  { icon: Users, title: "Expérience depuis 6 ans", desc: "Une expertise reconnue dans le domaine de l'hébergement" },
];

const Index = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />

    {/* Hero */}
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <img src={heroImage} alt="Lobby d'hôtel luxueux" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-hotel-dark/60" />
      <div className="relative z-10 text-center px-4 max-w-3xl animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-hotel-cream mb-4">
          Trouvez votre logement idéal
        </h1>
        <p className="text-lg md:text-xl text-hotel-cream/80 mb-8">
          Les meilleures activités et hébergements présentés sur notre site web
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/hotels" className="btn-primary text-lg">
            Explorer les logements
          </Link>
          <Link to="/connexion" className="btn-outline border-hotel-cream text-hotel-cream hover:bg-hotel-cream hover:text-hotel-dark text-lg">
            Se connecter
          </Link>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-title mb-2">Notre communauté en chiffres</h2>
          <p className="text-muted-foreground">Nombre de personnes qui ont consulté notre site</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="stat-card animate-count-up">
            <Eye className="mx-auto mb-2 text-primary" size={32} />
            <div className="text-3xl font-display font-bold text-primary">4 000 000+</div>
            <div className="text-sm text-muted-foreground mt-1">Visiteurs par mois</div>
          </div>
          <div className="stat-card animate-count-up" style={{ animationDelay: "0.15s" }}>
            <Home className="mx-auto mb-2 text-primary" size={32} />
            <div className="text-3xl font-display font-bold text-primary">12 500+</div>
            <div className="text-sm text-muted-foreground mt-1">Logements listés</div>
          </div>
          <div className="stat-card animate-count-up" style={{ animationDelay: "0.3s" }}>
            <Users className="mx-auto mb-2 text-primary" size={32} />
            <div className="text-3xl font-display font-bold text-primary">98%</div>
            <div className="text-sm text-muted-foreground mt-1">Clients satisfaits</div>
          </div>
        </div>
      </div>
    </section>

    {/* Why choose us */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="section-title text-center mb-10">Pourquoi choisir notre site ?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="feature-card flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="text-primary" size={28} />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
          Se connecter pour profiter au maximum de l'expérience
        </h2>
        <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
          Créez votre compte gratuitement et accédez à des fonctionnalités exclusives
        </p>
        <Link to="/inscription" className="inline-block px-8 py-4 bg-background text-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity text-lg">
          Commencer maintenant
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default Index;
