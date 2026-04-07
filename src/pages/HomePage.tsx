import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Shield, Truck, CreditCard, Headphones,
  Star, Search, Car, CheckCircle, AlertCircle, Loader2,
  ChevronRight, Wrench, Zap, Phone, RotateCcw
} from 'lucide-react'
import ProductCard from '../components/catalog/ProductCard'
import { productService } from '../services/productService'
import { categories } from '../data/categories'
import { lookupPlate, validatePlate } from '../services/plateService'
import type { PlateVehicleResult } from '../services/plateService'
import { useVehicle } from '../context/VehicleContext'
import { makes, models } from '../data/vehicles'
import type { Product } from '../types'

type PlateStatus = 'idle' | 'loading' | 'found' | 'error' | 'manual'

const CATEGORY_ICONS: Record<string, string> = {
  freinage: '🛑',
  filtration: '🛢️',
  suspension: '🔩',
  transmission: '⚙️',
  eclairage: '💡',
  moteur: '🔧',
  electricite: '⚡',
  climatisation: '❄️',
  carrosserie: '🚗',
  pneumatiques: '⭕',
}

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [promos, setPromos] = useState<Product[]>([])

  const [plate, setPlate] = useState('')
  const [plateStatus, setPlateStatus] = useState<PlateStatus>('idle')
  const [plateResult, setPlateResult] = useState<PlateVehicleResult | null>(null)
  const [plateError, setPlateError] = useState('')

  // Manual entry state
  const [manualMakeId, setManualMakeId] = useState('')
  const [manualModelId, setManualModelId] = useState('')
  const [manualYear, setManualYear] = useState('')

  const { setSelectedVehicle } = useVehicle()
  const navigate = useNavigate()

  useEffect(() => {
    productService.getBestSellers().then(setBestSellers)
    productService.getPromos().then(p => setPromos(p.slice(0, 4)))
  }, [])

  const resetPlate = () => {
    setPlateStatus('idle')
    setPlateResult(null)
    setPlateError('')
    setPlate('')
  }

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
      setPlateError('Format invalide. Exemple : AB-123-CD ou 1234AB75')
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

  const handleManualSelect = () => {
    const make = makes.find(m => m.id === manualMakeId)
    const model = models.find(m => m.id === manualModelId)
    const year = parseInt(manualYear)
    if (!make || !model || !year) return
    setSelectedVehicle({ make, model, year })
    navigate('/mes-pieces')
  }

  const manualModels = models.filter(m => m.makeId === manualMakeId)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  return (
    <div className="min-h-screen">

      {/* ═══════════════════════ HERO OSCARO-STYLE ═══════════════════════ */}
      <section className="bg-aps-600 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-aps-400" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-10 lg:py-14">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* Left: heading */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Zap size={12} className="text-accent-400" />
                +50 000 références · Livraison 24h
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight mb-3">
                La bonne pièce pour
                <br />
                <span className="text-accent-400">votre véhicule</span>
              </h1>
              <p className="text-aps-200 text-base lg:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                Entrez votre plaque d'immatriculation et trouvez instantanément toutes les pièces compatibles.
              </p>

              {/* Trust metrics */}
              <div className="flex items-center justify-center lg:justify-start gap-5 mt-5">
                {[
                  { val: '50k+', label: 'Références' },
                  { val: '24h', label: 'Livraison' },
                  { val: '2 ans', label: 'Garantie' },
                ].map(m => (
                  <div key={m.val} className="text-center">
                    <div className="text-xl font-black text-white">{m.val}</div>
                    <div className="text-xs text-aps-300">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Plate search card */}
            <div className="w-full lg:w-[440px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Card tabs */}
                <div className="flex border-b border-slate-100">
                  <button
                    onClick={() => plateStatus === 'manual' ? setPlateStatus('idle') : null}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${
                      plateStatus !== 'manual'
                        ? 'bg-aps-600 text-white'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Car size={15} />
                    Par immatriculation
                  </button>
                  <button
                    onClick={() => setPlateStatus('manual')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${
                      plateStatus === 'manual'
                        ? 'bg-aps-600 text-white'
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <Wrench size={15} />
                    Saisie manuelle
                  </button>
                </div>

                <div className="p-5 sm:p-6">

                  {plateStatus === 'manual' ? (
                    /* ── Manual entry ── */
                    <div className="space-y-3 animate-fade-in">
                      <p className="text-sm text-slate-500 mb-1">Sélectionnez votre véhicule manuellement</p>
                      <select
                        value={manualMakeId}
                        onChange={e => { setManualMakeId(e.target.value); setManualModelId('') }}
                        className="input-field"
                      >
                        <option value="">-- Marque --</option>
                        {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                      <select
                        value={manualModelId}
                        onChange={e => setManualModelId(e.target.value)}
                        disabled={!manualMakeId}
                        className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">-- Modèle --</option>
                        {manualModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                      </select>
                      <select
                        value={manualYear}
                        onChange={e => setManualYear(e.target.value)}
                        className="input-field"
                      >
                        <option value="">-- Année --</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <button
                        onClick={handleManualSelect}
                        disabled={!manualMakeId || !manualModelId || !manualYear}
                        className="w-full btn-primary-lg text-base py-3.5 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Search size={18} />
                        Trouver mes pièces
                      </button>
                    </div>

                  ) : (
                    /* ── Plate search ── */
                    <form onSubmit={handlePlateLookup} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                          Plaque d'immatriculation
                        </label>

                        {/* Plate input */}
                        <div className="relative">
                          {/* EU/FR strip */}
                          <div className="absolute left-0 top-0 bottom-0 w-11 bg-[#003399] rounded-l-[8px] flex flex-col items-center justify-center gap-0.5 z-10">
                            <div className="text-yellow-300 text-xs leading-none">★</div>
                            <div className="text-white text-[10px] font-black leading-none tracking-widest">F</div>
                          </div>
                          <input
                            type="text"
                            value={plate}
                            onChange={handlePlateInput}
                            placeholder="AB-123-CD"
                            maxLength={10}
                            className="plate-input"
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 text-center">
                          Format SIV : AB-123-CD · ou ancienne immatriculation : 1234 AB 75
                        </p>
                      </div>

                      {/* Error */}
                      {plateStatus === 'error' && (
                        <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 animate-fade-in">
                          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">{plateError}</div>
                            <button
                              type="button"
                              onClick={() => setPlateStatus('manual')}
                              className="text-xs text-red-500 underline mt-0.5"
                            >
                              Saisir manuellement
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Found result */}
                      {plateStatus === 'found' && plateResult && (
                        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 animate-fade-in-up">
                          <div className="flex items-start gap-3">
                            <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-0.5">
                                Véhicule identifié ✓
                              </div>
                              <div className="font-black text-green-900 text-lg leading-tight">
                                {plateResult.make} {plateResult.model}
                              </div>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {[plateResult.year, plateResult.fuel, plateResult.engine].filter(Boolean).map((tag, i) => (
                                  <span key={i} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={resetPlate}
                              className="text-green-400 hover:text-green-600 flex-shrink-0"
                              title="Effacer"
                            >
                              <RotateCcw size={15} />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* CTA button */}
                      {plateStatus !== 'found' ? (
                        <button
                          type="submit"
                          disabled={plateStatus === 'loading' || !plate.trim()}
                          className="w-full btn-primary-lg text-base py-3.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {plateStatus === 'loading' ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Identification en cours…
                            </>
                          ) : (
                            <>
                              <Search size={18} />
                              Trouver mes pièces
                            </>
                          )}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleConfirmVehicle}
                          className="w-full btn-primary-lg text-base py-3.5"
                        >
                          <Wrench size={18} />
                          Voir les pièces compatibles
                          <ArrowRight size={18} />
                        </button>
                      )}

                      {plateStatus !== 'found' && (
                        <p className="text-center text-xs text-slate-400">
                          Impossible d'identifier ?{' '}
                          <button
                            type="button"
                            onClick={() => setPlateStatus('manual')}
                            className="text-aps-600 font-semibold hover:underline"
                          >
                            Saisir manuellement
                          </button>
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════ TRUST BAR ═══════════════════════ */}
      <section className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">
            {[
              { icon: <Truck size={22} className="text-aps-600" />, title: 'Livraison 24h/48h', desc: 'Offerte dès 50€' },
              { icon: <Shield size={22} className="text-aps-600" />, title: 'Garantie 2 ans', desc: 'Sur toutes nos pièces' },
              { icon: <CreditCard size={22} className="text-aps-600" />, title: 'Paiement sécurisé', desc: 'CB, PayPal, Virement' },
              { icon: <Headphones size={22} className="text-aps-600" />, title: 'Experts auto', desc: 'Lun–Sam 8h–19h' },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-3 p-4 sm:p-5">
                <div className="flex-shrink-0 w-10 h-10 bg-aps-50 border border-aps-100 rounded-xl flex items-center justify-center">
                  {b.icon}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">{b.title}</div>
                  <div className="text-xs text-slate-500">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════ CATEGORIES OSCARO-STYLE ═══════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="section-title">Nos catégories de pièces</h2>
            <p className="section-subtitle">Plus de 50 000 références disponibles</p>
          </div>
          <Link to="/catalogue" className="hidden sm:flex items-center gap-1 text-aps-600 hover:text-aps-700 font-semibold text-sm transition-colors">
            Tout voir <ChevronRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {categories.slice(0, 12).map(cat => (
            <Link
              key={cat.id}
              to={`/catalogue?categoryId=${cat.id}`}
              className="group bg-white border border-slate-200 rounded-xl p-3 sm:p-4 text-center hover:border-aps-400 hover:shadow-md transition-all duration-200 flex flex-col items-center gap-2"
            >
              <div className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200">
                {CATEGORY_ICONS[cat.id] ?? cat.icon}
              </div>
              <div className="font-semibold text-xs sm:text-sm text-slate-700 group-hover:text-aps-600 transition-colors leading-tight text-center">
                {cat.name}
              </div>
              <div className="text-xs text-slate-400 hidden sm:block">{cat.productCount.toLocaleString()} réf.</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════ PROMOS BANNER ═══════════════════════ */}
      {promos.length > 0 && (
        <section className="bg-[#FFF3E8] border-y border-orange-200 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="section-title flex items-center gap-2">
                  <span className="bg-accent-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-lg">PROMO</span>
                  Offres du moment
                </h2>
                <p className="section-subtitle">Pièces en promotion, stocks limités</p>
              </div>
              <Link to="/catalogue?isPromo=true" className="hidden sm:flex items-center gap-1 text-accent-500 hover:text-accent-600 font-bold text-sm transition-colors">
                Toutes les promos <ChevronRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {promos.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════ BESTSELLERS ═══════════════════════ */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Star size={22} className="text-amber-400 fill-amber-400" />
                Bestsellers
              </h2>
              <p className="section-subtitle">Les pièces les plus vendues du moment</p>
            </div>
            <Link to="/catalogue?isBestSeller=true" className="hidden sm:flex items-center gap-1 text-aps-600 hover:text-aps-700 font-semibold text-sm">
              Voir plus <ChevronRight size={15} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* ═══════════════════════ WHY US ═══════════════════════ */}
      <section className="bg-aps-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                Pourquoi choisir APS Auto Pièces ?
              </h2>
              <ul className="space-y-3">
                {[
                  '✅ Pièces d\'origine et équivalentes testées',
                  '✅ Compatibilité vérifiée avec votre véhicule',
                  '✅ Livraison express 24h/48h partout en France',
                  '✅ Retours gratuits sous 30 jours',
                  '✅ Experts disponibles par téléphone ou chat',
                ].map((item, i) => (
                  <li key={i} className="text-aps-100 text-sm sm:text-base">{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-aps-700 rounded-2xl p-6 border border-aps-500">
              <div className="text-white font-bold text-lg mb-2">Vous ne trouvez pas votre pièce ?</div>
              <p className="text-aps-200 text-sm mb-4">
                Nos experts auto vous aident à identifier la bonne référence pour votre véhicule.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+33123456789" className="btn-primary flex items-center gap-2">
                  <Phone size={16} />
                  Appeler un expert
                </a>
                <Link to="/catalogue" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/20 rounded-lg transition-all text-sm">
                  Parcourir le catalogue
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
