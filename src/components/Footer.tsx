import { Link } from "react-router-dom";
import { useLang } from "@/context/LangContext";

const Footer = () => {
  const { t } = useLang();
  return (
  <footer className="bg-hotel-dark text-hotel-cream">
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-4 gap-4 w-full justify-items-center">
        <div className="text-center">
          <h3 className="text-lg font-display font-bold text-primary mb-2">StayEase</h3>
          <p className="text-xs text-hotel-cream/70">
            {t("Votre plateforme de confiance")}
          </p>
        </div>
        <div className="text-center">
          <h4 className="font-semibold mb-2 text-primary">{t("Emplois")}</h4>
          <ul className="space-y-1 text-xs text-hotel-cream/70">
            <li><Link to="/" className="hover:text-primary transition-colors">{t("Emplois")}</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">{t("Partenaires")}</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">{t("Publications")}</Link></li>
          </ul>
        </div>
        <div className="text-center">
          <h4 className="font-semibold mb-2 text-primary">{t("FAQ / Support")}</h4>
          <ul className="space-y-1 text-xs text-hotel-cream/70">
            <li><Link to="/" className="hover:text-primary transition-colors">{t("FAQ / Support")}</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">{t("Sécurité")}</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">{t("Nous contacter")}</Link></li>
          </ul>
        </div>
        <div className="text-center">
          <h4 className="font-semibold mb-2 text-primary">{t("Conditions")}</h4>
          <ul className="space-y-1 text-xs text-hotel-cream/70">
            <li><Link to="/" className="hover:text-primary transition-colors">{t("Conditions")}</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">{t("Confidentialité")}</Link></li>
            <li><Link to="/" className="hover:text-primary transition-colors">{t("Cookies")}</Link></li>
          </ul>
        </div>
      </div>
    </div>
    <div className="border-t border-hotel-cream/10 py-2 text-center text-xs text-hotel-cream/50">
      © 2026 StayEase. {t("Tous droits réservés")}
    </div>
  </footer>
);
};

export default Footer;
