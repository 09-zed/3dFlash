import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Shield, Truck, RotateCcw } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-aps-900 text-slate-400 mt-12">
      {/* Trust strip */}
      <div className="border-b border-aps-800">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-aps-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <Truck size={18} className="text-orange-400" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Livraison 24h/48h</div>
              <div className="text-xs">Offerte dès 50€ d'achat</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-aps-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-orange-400" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Garantie 2 ans</div>
              <div className="text-xs">Sur toutes nos pièces</div>
            </div>
          </div>
          <div className="flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 bg-aps-800 rounded-xl flex items-center justify-center flex-shrink-0">
              <RotateCcw size={18} className="text-orange-400" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Retour 30 jours</div>
              <div className="text-xs">Retour gratuit et facile</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="bg-orange-500 text-white font-black text-sm px-2.5 py-1.5 rounded-lg">APS</div>
            <div>
              <div className="text-white font-bold text-sm">Auto Pièces</div>
              <div className="text-slate-500 text-xs">spécialiste depuis 1995</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            Votre partenaire de confiance pour toutes les pièces automobiles.
            Qualité garantie, livraison rapide, prix compétitifs.
          </p>
        </div>

        {/* Catalogue */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4">Catalogue</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'Freinage', slug: 'freinage' },
              { label: 'Filtration', slug: 'filtration' },
              { label: 'Éclairage', slug: 'eclairage' },
              { label: 'Suspension', slug: 'suspension' },
              { label: 'Moteur', slug: 'moteur' },
            ].map(c => (
              <li key={c.slug}>
                <Link to={`/catalogue?categoryId=${c.slug}`} className="hover:text-orange-400 transition-colors">
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/catalogue?isPromo=true" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                🔥 Promotions
              </Link>
            </li>
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4">Informations</h3>
          <ul className="space-y-2.5 text-sm">
            {['À propos d\'APS', 'Livraison & retours', 'Garanties', 'Paiement sécurisé', 'Mentions légales', 'CGV'].map(l => (
              <li key={l}><a href="#" className="hover:text-orange-400 transition-colors">{l}</a></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <Phone size={14} className="mt-0.5 flex-shrink-0 text-orange-400" />
              <a href="tel:+33123456789" className="hover:text-orange-400 transition-colors">01 23 45 67 89</a>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail size={14} className="mt-0.5 flex-shrink-0 text-orange-400" />
              <a href="mailto:contact@aps-autopieces.fr" className="hover:text-orange-400 transition-colors">contact@aps-autopieces.fr</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 flex-shrink-0 text-orange-400" />
              <span>15 rue de l'Industrie<br />75011 Paris</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock size={14} className="mt-0.5 flex-shrink-0 text-orange-400" />
              <span>Lun–Ven 8h–19h<br />Sam 9h–17h</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-aps-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600">
          <span>© {new Date().getFullYear()} APS Auto Pièces. Tous droits réservés.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">💳 CB · Visa · Mastercard · PayPal</span>
            <span>🔒 SSL sécurisé</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
