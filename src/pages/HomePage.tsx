import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Shield, Truck, CreditCard, Headphones,
  Star, Search, Car, CheckCircle, AlertCircle, Loader2,
  ChevronRight, Wrench, Zap
} from 'lucide-react'
import ProductCard from '../components/catalog/ProductCard'
import { productService } from '../services/productService'
import { categories } from '../data/categories'
import { lookupPlate, validatePlate } from '../services/plateService'
import type { PlateVehicleResult } from '../services/plateService'
import { useVehicle } from '../context/VehicleContext'
import { makes, models } from '../data/vehicles'
import type { Product } from '../types'

type PlateStatus = 'idle' | 'loading' | 'found' | 'error'

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [promos, setPromos] = useState<Product[]>([])

  const [plate, setPlate] = useState('')
  const [plateStatus, setPlateStatus] = useState<PlateStatus>('idle')
  const [plateResult, setPlateResult] = useState<PlateVehicleResult | null>(null)
  const [plateError, setPlateError] = useState('')

  const { setSelectedVehicle } = useVehicle()
  const navigate = useNavigate()
  const plateRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    productService.getBestSellers().then(setBestSellers)
    productService.getPromos().then(p => setPromos(p.slice(0, 4)))
  }, [])

  const handlePlateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9\-\s]/g, '')
    setPlate(val)
    if (plateStatus !== 'idle') {
      setPlateStatus('idle')
      setPlateResult(null)
      setPlateError('')
    }
  }

  const handlePlateLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!plate.trim()) return

    if (!validatePlate(plate)) {
      setPlateError('Format invalide. Exemple : AB-123-CD')
      setPlateStatus('error')
      return
    }

    setPlateStatus('loading')
    setPlateError('')
    try {
      const result = await lookupPlate(plate)
      setPlateResult(result)
      setPlateStatus('found')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur de recherche'
      setPlateError(msg)
      setPlateStatus('error')
    }
  }

  const handleConfirmVehicle = () => {
    if (!plateResult) return
    const make = makes.find(m => m.id === plateResult.makeId)
    const model = models.find(m => m.id === plateResult.modelId)
    if (make && model) {
      setSelectedVehicle({ make, model, year: plateResult.year })
    }
    navigate('/mes-pieces')
  }

  return (
    <div className="min-h-screen">

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-14 lg:py-20">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-500/25 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Zap size={12} />
              Spécialiste pièces auto depuis 1995 · +50 000 références
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Trouvez vos pièces<br />
              <span className="text-orange-400">par plaque</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Entrez votre plaque d'immatriculation et trouvez
              instantanément toutes les pièces compatibles avec votre véhicule.
            </p>
          </div>

          {/* ─── Plate Search Card ─── */}
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
              {/* Card header */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Car size={16} className="text-orange-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Recherche par immatriculation</div>
                  <div className="text-xs text-slate-500">Renseigne ta plaque pour trouver tes pièces</div>
                </div>
              </div>

              <form onSubmit={handlePlateLookup} className="space-y-4">
                {/* Plate input with FR flag */}
                <div className="relative">
                  {/* FR flag strip */}
                  <div className="absolute left-0 top-0 bottom-0 w-10 bg-blue-700 rounded-l-xl flex flex-col items-center justify-center gap-0.5 z-10">
                    <div className="text-white text-xs font-black leading-none">🇪🇺</div>
                    <div className="text-white text-xs font-black leading-none">F</div>
                  </div>
                  <input
                    ref={plateRef}
                    type="text"
                    value={plate}
                    onChange={handlePlateInput}
                    placeholder="AB-123-CD"
                    maxLength={10}
                    className="plate-input pl-14"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>

                {/* Error */}
                {plateStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 animate-fade-in">
                    <AlertCircle size={15} />
                    {plateError}
                  </div>
                )}

                {/* Found result */}
                {plateStatus === 'found' && plateResult && (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-green-800 text-sm mb-1">Véhicule identifié !</div>
                        <div className="text-green-700 font-semibold text-base">
                          {plateResult.make} {plateResult.model}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                            {plateResult.year}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                            {plateResult.fuel}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                            {plateResult.engine}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                            {plateResult.bodyType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit / Confirm button */}
                {plateStatus !== 'found' ? (
                  <button
                    type="submit"
                    disabled={plateStatus === 'loading' || !plate.trim()}
                    className="w-full btn-primary-lg"
                  >
                    {plateStatus === 'loading' ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Identification en cours…
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        Trouver mes pièces
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmVehicle}
                    className="w-full btn-primary-lg"
                  >
                    <Wrench size={20} />
                    Voir les pièces compatibles
                    <ArrowRight size={20} />
                  </button>
                )}
              </form>

              <p className="text-center text-xs text-slate-400 mt-3">
                Ou{' '}
                <Link to="/catalogue" className="text-orange-500 hover:text-orange-600 font-semibold underline">
                  parcourez le catalogue
                </Link>
                {' '}manuellement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRUST BADGES ═══════════════════════ */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: <Truck size={20} className="text-orange-500" />, title: 'Livraison 24h/48h', desc: 'Offerte dès 50€ d\'achat' },
              { icon: <Shield size={20} className="text-orange-500" />, title: 'Garantie 2 ans', desc: 'Sur toutes nos pièces' },
              { icon: <CreditCard size={20} className="text-orange-500" />, title: 'Paiement sécurisé', desc: 'CB, PayPal, virement' },
              { icon: <Headphones size={20} className="text-orange-500" />, title: 'Experts disponibles', desc: 'Lun–Sam 8h–19h' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex-shrink-0 w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                  {b.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">{b.title}</div>
                  <div className="text-xs text-slate-500">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CATEGORIES ═══════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Nos catégories</h2>
            <p className="text-slate-500 text-sm mt-1">Plus de 50 000 références en stock</p>
          </div>
          <Link to="/catalogue" className="hidden sm:flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-sm transition-colors">
            Tout le catalogue <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categories.slice(0, 10).map(cat => (
            <Link
              key={cat.id}
              to={`/catalogue?categoryId=${cat.id}`}
              className="group bg-white border border-slate-100 rounded-2xl p-4 text-center hover:border-orange-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div className="text-3xl mb-2.5 group-hover:scale-110 transition-transform duration-200">
                {cat.icon}
              </div>
              <div className="font-semibold text-sm text-slate-800 group-hover:text-orange-600 transition-colors leading-tight">
                {cat.name}
              </div>
              <div className="text-xs text-slate-400 mt-1">{cat.productCount.toLocaleString()} réf.</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ PROMOS ═══════════════════════ */}
      {promos.length > 0 && (
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-12 border-y border-orange-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                  🔥 <span>Promotions du moment</span>
                </h2>
                <p className="text-slate-500 text-sm mt-1">Offres limitées, prix cassés</p>
              </div>
              <Link to="/catalogue?isPromo=true" className="hidden sm:flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-sm">
                Toutes les promos <ChevronRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {promos.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            <div className="sm:hidden mt-4 text-center">
              <Link to="/catalogue?isPromo=true" className="btn-primary">
                Voir toutes les promos <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════ BESTSELLERS ═══════════════════════ */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Star size={24} className="text-amber-400 fill-amber-400" />
                Bestsellers
              </h2>
              <p className="text-slate-500 text-sm mt-1">Les pièces les plus vendues</p>
            </div>
            <Link to="/catalogue" className="hidden sm:flex items-center gap-1 text-orange-500 hover:text-orange-600 font-semibold text-sm">
              Voir plus <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ═══════════════════════ CTA BANNER ═══════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-slate-900 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-orange-500/10 to-transparent" />
          <div className="relative">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Vous ne trouvez pas votre pièce ?
            </h3>
            <p className="text-slate-400">
              Nos experts sont disponibles pour vous aider à trouver la bonne référence.
            </p>
          </div>
          <div className="relative flex flex-wrap gap-3 flex-shrink-0">
            <a href="tel:+33123456789" className="btn-primary">
              <Headphones size={18} />
              Appeler un expert
            </a>
            <a
              href="mailto:contact@aps-autopieces.fr"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/20 rounded-xl transition-all"
            >
              Envoyer un email
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
