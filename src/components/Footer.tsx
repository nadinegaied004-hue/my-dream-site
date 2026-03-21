import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-hotel-dark text-hotel-cream">
    <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-xl font-display font-bold text-primary mb-4">StayEase</h3>
        <p className="text-sm text-hotel-cream/70">
          Votre plateforme de confiance pour trouver le logement idéal.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-primary">Opportunités</h4>
        <ul className="space-y-2 text-sm text-hotel-cream/70">
          <li><Link to="/" className="hover:text-primary transition-colors">Emplois</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Partenaires</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Publications</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-primary">Liens utiles</h4>
        <ul className="space-y-2 text-sm text-hotel-cream/70">
          <li><Link to="/" className="hover:text-primary transition-colors">FAQ / Support</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Sécurité</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Nous contacter</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-primary">Conditions & Conformité</h4>
        <ul className="space-y-2 text-sm text-hotel-cream/70">
          <li><Link to="/" className="hover:text-primary transition-colors">Conditions d'utilisation</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Politique en matière de cookies</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Conformité</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Configurer les cookies</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-hotel-cream/10 py-4 text-center text-sm text-hotel-cream/50">
      © 2026 StayEase. Tous droits réservés.
    </div>
  </footer>
);

export default Footer;
