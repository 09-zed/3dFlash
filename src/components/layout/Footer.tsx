import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-brand-500 text-white font-extrabold text-xl px-3 py-1.5 rounded-lg">APS</div>
            <div>
              <div className="text-white font-bold text-sm">Auto Pièces</div>
              <div className="text-gray-400 text-xs">spécialiste depuis 1995</div>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Votre partenaire de confiance pour toutes les pièces automobiles.
            Qualité garantie, livraison rapide, prix compétitifs.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-4">Catalogue</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/catalogue?categoryId=freinage" className="hover:text-accent-400 transition-colors">Freinage</Link></li>
            <li><Link to="/catalogue?categoryId=filtration" className="hover:text-accent-400 transition-colors">Filtration</Link></li>
            <li><Link to="/catalogue?categoryId=eclairage" className="hover:text-accent-400 transition-colors">Éclairage</Link></li>
            <li><Link to="/catalogue?categoryId=suspension" className="hover:text-accent-400 transition-colors">Suspension</Link></li>
            <li><Link to="/catalogue?categoryId=moteur" className="hover:text-accent-400 transition-colors">Moteur</Link></li>
            <li><Link to="/catalogue?isPromo=true" className="text-accent-400 hover:text-accent-300 transition-colors font-medium">🔥 Promotions</Link></li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Informations</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-accent-400 transition-colors">À propos d'APS</a></li>
            <li><a href="#" className="hover:text-accent-400 transition-colors">Livraison & retours</a></li>
            <li><a href="#" className="hover:text-accent-400 transition-colors">Garanties</a></li>
            <li><a href="#" className="hover:text-accent-400 transition-colors">Paiement sécurisé</a></li>
            <li><a href="#" className="hover:text-accent-400 transition-colors">Mentions légales</a></li>
            <li><a href="#" className="hover:text-accent-400 transition-colors">CGV</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <Phone size={14} className="mt-0.5 flex-shrink-0 text-accent-400" />
              <a href="tel:+33123456789" className="hover:text-accent-400 transition-colors">01 23 45 67 89</a>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={14} className="mt-0.5 flex-shrink-0 text-accent-400" />
              <a href="mailto:contact@aps-autopieces.fr" className="hover:text-accent-400 transition-colors">contact@aps-autopieces.fr</a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 flex-shrink-0 text-accent-400" />
              <span>15 rue de l'Industrie<br />75011 Paris</span>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={14} className="mt-0.5 flex-shrink-0 text-accent-400" />
              <span>Lun–Ven 8h–19h<br />Sam 9h–17h</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <span>© {new Date().getFullYear()} APS Auto Pièces. Tous droits réservés.</span>
          <div className="flex items-center gap-3">
            <span>💳 CB, Visa, Mastercard</span>
            <span>📦 Livraison Colissimo</span>
            <span>🔒 Paiement sécurisé SSL</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
