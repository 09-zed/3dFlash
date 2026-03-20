import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, CreditCard, Headphones, Star, Tag } from 'lucide-react'
import VehicleSelector from '../components/vehicle/VehicleSelector'
import ProductCard from '../components/catalog/ProductCard'
import { productService } from '../services/productService'
import { categories } from '../data/categories'
import type { Product } from '../types'

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [promos, setPromos] = useState<Product[]>([])

  useEffect(() => {
    productService.getBestSellers().then(setBestSellers)
    productService.getPromos().then(p => setPromos(p.slice(0, 4)))
  }, [])

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-500/30 text-accent-300 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
                <Tag size={14} />
                Spécialiste pièces auto depuis 1995
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                Trouvez la pièce<br />
                <span className="text-accent-400">qu'il vous faut</span><br />
                en 3 clics
              </h1>
              <p className="text-brand-200 text-lg mb-8 leading-relaxed">
                Plus de 50 000 références disponibles. Sélectionnez votre véhicule
                et découvrez toutes les pièces compatibles, disponibles et livrées sous 24h.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/catalogue" className="btn-accent text-base px-8 py-3">
                  Voir le catalogue
                  <ArrowRight size={18} />
                </Link>
                <a href="tel:+33123456789" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 text-base px-8 py-3">
                  Nous appeler
                </a>
              </div>
            </div>

            {/* Vehicle selector card */}
            <div className="bg-white rounded-2xl p-6 shadow-2xl text-gray-900">
              <VehicleSelector onSelect={() => window.location.href = '/catalogue'} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust Badges ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={24} className="text-brand-600" />, title: 'Livraison rapide', desc: 'Sous 24h / 48h en France' },
              { icon: <Shield size={24} className="text-brand-600" />, title: 'Pièces garanties', desc: '2 ans minimum sur toutes les pièces' },
              { icon: <CreditCard size={24} className="text-brand-600" />, title: 'Paiement sécurisé', desc: 'CB, PayPal, virement bancaire' },
              { icon: <Headphones size={24} className="text-brand-600" />, title: 'Experts disponibles', desc: 'Lun–Ven 8h–19h, Sam 9h–17h' },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <div className="flex-shrink-0 bg-brand-50 p-2 rounded-lg">{b.icon}</div>
                <div>
                  <div className="font-semibold text-sm text-gray-900">{b.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
          <Link to="/catalogue" className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
            Tout voir <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.slice(0, 10).map(cat => (
            <Link
              key={cat.id}
              to={`/catalogue?categoryId=${cat.id}`}
              className="card p-4 text-center hover:shadow-md hover:border-brand-200 transition-all duration-200 group"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-sm text-gray-800 group-hover:text-brand-600 transition-colors">{cat.name}</div>
              <div className="text-xs text-gray-400 mt-0.5">{cat.productCount.toLocaleString()} réf.</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Promos ───────────────────────────────────────────────────────────── */}
      {promos.length > 0 && (
        <section className="bg-gradient-to-r from-red-50 to-orange-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🔥 Promotions du moment
              </h2>
              <Link to="/catalogue?isPromo=true" className="text-accent-600 hover:text-accent-700 text-sm font-medium flex items-center gap-1">
                Toutes les promos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {promos.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Best Sellers ─────────────────────────────────────────────────────── */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Star size={22} className="text-amber-400 fill-amber-400" />
              Bestsellers
            </h2>
            <Link to="/catalogue" className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
              Voir plus <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── Banner CTA ───────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-brand-700 to-brand-900 rounded-2xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 text-white">
          <div>
            <h3 className="text-2xl font-bold mb-2">Vous ne trouvez pas votre pièce ?</h3>
            <p className="text-brand-200">Nos experts sont disponibles pour vous aider à trouver la bonne référence.</p>
          </div>
          <div className="flex flex-wrap gap-3 flex-shrink-0">
            <a href="tel:+33123456789" className="btn-accent">
              Appeler un expert
            </a>
            <a href="mailto:contact@aps-autopieces.fr" className="btn-secondary bg-white/10 border-white/30 text-white hover:bg-white/20">
              Envoyer un email
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
