import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-hotel-dark text-hotel-cream">
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div>
        <h3 className="text-lg font-display font-bold text-primary mb-2">StayEase</h3>
        <p className="text-xs text-hotel-cream/70">
          Votre plateforme de confiance pour trouver le logement idéal.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-primary">Opportunités</h4>
        <ul className="space-y-1 text-xs text-hotel-cream/70">
          <li><Link to="/" className="hover:text-primary transition-colors">Emplois</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Partenaires</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Publications</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-primary">Liens utiles</h4>
        <ul className="space-y-1 text-xs text-hotel-cream/70">
          <li><Link to="/" className="hover:text-primary transition-colors">FAQ / Support</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Sécurité</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Nous contacter</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-2 text-primary">Conditions</h4>
        <ul className="space-y-1 text-xs text-hotel-cream/70">
          <li><Link to="/" className="hover:text-primary transition-colors">Conditions</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Confidentialité</Link></li>
          <li><Link to="/" className="hover:text-primary transition-colors">Cookies</Link></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-hotel-cream/10 py-2 text-center text-xs text-hotel-cream/50">
      © 2026 StayEase. Tous droits réservés.
    </div>
  </footer>
);

export default Footer;
