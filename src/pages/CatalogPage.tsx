import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X, Search, Car, SlidersHorizontal, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import ProductCard from '../components/catalog/ProductCard'
import VehicleSelector from '../components/vehicle/VehicleSelector'
import { productService } from '../services/productService'
import { categories } from '../data/categories'
import { useVehicle } from '../context/VehicleContext'
import type { Product, ProductFilters } from '../types'

type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'name'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedVehicle, clearVehicle } = useVehicle()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showVehicleSelector, setShowVehicleSelector] = useState(false)
  const [sort, setSort] = useState<SortOption>('name')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 600])
  const [searchLocal, setSearchLocal] = useState(searchParams.get('search') ?? '')

  const categoryId = searchParams.get('categoryId') ?? undefined
  const searchQuery = searchParams.get('search') ?? undefined
  const isPromo = searchParams.get('isPromo') === 'true'
  const inStock = searchParams.get('inStock') === 'true'

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const filters: ProductFilters = {
      categoryId,
      search: searchQuery,
      isPromo: isPromo || undefined,
      inStock: inStock || undefined,
      minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] < 600 ? priceRange[1] : undefined,
    }
    let data = await productService.getProducts(filters)
    data = [...data].sort((a, b) => {
      switch (sort) {
        case 'price_asc':  return a.price - b.price
        case 'price_desc': return b.price - a.price
        case 'rating':     return b.rating - a.rating
        default:           return a.name.localeCompare(b.name)
      }
    })
    setProducts(data)
    setLoading(false)
  }, [categoryId, searchQuery, isPromo, inStock, priceRange, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value === null) { next.delete(key) } else { next.set(key, value) }
    setSearchParams(next)
  }

  const clearAll = () => {
    setSearchParams(new URLSearchParams())
    setSearchLocal('')
    setPriceRange([0, 600])
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('search', searchLocal.trim() || null)
  }

  const activeCategory = categories.find(c => c.id === categoryId)
  const pageTitle = activeCategory ? `${activeCategory.name}`
    : searchQuery ? `Résultats pour "${searchQuery}"`
    : isPromo ? 'Promotions'
    : 'Catalogue pièces auto'

  const activeFiltersCount = [categoryId, searchQuery, isPromo, inStock, priceRange[1] < 600].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#F4F6FA]">

      {/* ─── Page header bar ─── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A2E]">{pageTitle}</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {loading ? 'Chargement…' : `${products.length} produit${products.length !== 1 ? 's' : ''} trouvé${products.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAll}
                className="flex-shrink-0 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-semibold border border-red-200 hover:border-red-300 bg-red-50 rounded-lg px-3 py-2 transition-colors"
              >
                <X size={14} />
                Effacer ({activeFiltersCount})
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5">

        {/* Vehicle banner */}
        {selectedVehicle ? (
          <div className="bg-aps-600 rounded-xl p-4 mb-5 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Car size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm">
                {selectedVehicle.make.name} {selectedVehicle.model.name}
                <span className="text-aps-200 font-normal ml-1.5">({selectedVehicle.year})</span>
              </div>
              <div className="text-aps-300 text-xs mt-0.5">Pièces compatibles avec votre véhicule</div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                className="text-accent-400 hover:text-accent-500 text-xs font-semibold transition-colors"
                onClick={() => setShowVehicleSelector(v => !v)}
              >
                Changer
              </button>
              <button onClick={clearVehicle} className="text-aps-300 hover:text-white transition-colors">
                <X size={15} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
            <button
              className="flex items-center gap-2 text-amber-800 font-semibold text-sm w-full"
              onClick={() => setShowVehicleSelector(v => !v)}
            >
              <Car size={17} className="text-amber-600" />
              <span className="flex-1 text-left">Indiquez votre véhicule pour filtrer les pièces compatibles</span>
              {showVehicleSelector ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {showVehicleSelector && (
              <div className="mt-3 bg-white rounded-lg p-4 border border-amber-100">
                <VehicleSelector compact onSelect={() => setShowVehicleSelector(false)} />
              </div>
            )}
          </div>
        )}

        {/* Vehicle selector dropdown (when changing) */}
        {selectedVehicle && showVehicleSelector && (
          <div className="bg-white rounded-xl p-4 mb-5 border border-aps-200 shadow-sm">
            <VehicleSelector compact onSelect={() => setShowVehicleSelector(false)} />
          </div>
        )}

        <div className="flex gap-5">

          {/* ─── Sidebar filters ─── */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 p-4 bg-black/50 lg:static lg:bg-transparent lg:p-0' : 'hidden lg:block'} lg:w-60 flex-shrink-0`}>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sticky top-24 space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal size={15} className="text-aps-600" />
                  Filtres
                  {activeFiltersCount > 0 && (
                    <span className="bg-aps-600 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </h2>
                <button className="lg:hidden text-slate-400 hover:text-slate-600 p-1" onClick={() => setShowFilters(false)}>
                  <X size={18} />
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Recherche</label>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchLocal}
                    onChange={e => setSearchLocal(e.target.value)}
                    placeholder="Pièce, référence..."
                    className="input-field pr-9 text-sm"
                  />
                  <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-aps-600 transition-colors">
                    <Search size={14} />
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Catégorie</label>
                <ul className="space-y-0.5">
                  <li>
                    <button
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!categoryId ? 'bg-aps-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                      onClick={() => updateParam('categoryId', null)}
                    >
                      Toutes les catégories
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.id}>
                      <button
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${categoryId === cat.id ? 'bg-aps-50 text-aps-700 font-semibold border border-aps-200' : 'text-slate-600 hover:bg-slate-50'}`}
                        onClick={() => updateParam('categoryId', categoryId === cat.id ? null : cat.id)}
                      >
                        <span className="text-base">{cat.icon}</span>
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Prix max : <span className="text-slate-900 normal-case font-black">{priceRange[1] >= 600 ? '600 €+' : `${priceRange[1]} €`}</span>
                </label>
                <input
                  type="range" min={0} max={600} step={10}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-aps-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 €</span><span>600 €+</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => updateParam('isPromo', !isPromo ? 'true' : null)}
                    className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${isPromo ? 'bg-accent-500' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isPromo ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm text-slate-700">Promotions uniquement</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => updateParam('inStock', !inStock ? 'true' : null)}
                    className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer flex-shrink-0 ${inStock ? 'bg-aps-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${inStock ? 'left-4' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm text-slate-700">En stock uniquement</span>
                </label>
              </div>

              {activeFiltersCount > 0 && (
                <button onClick={clearAll} className="w-full text-center text-sm text-red-500 hover:text-red-600 font-semibold py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  Effacer tous les filtres
                </button>
              )}
            </div>
          </aside>

          {/* ─── Products grid ─── */}
          <div className="flex-1 min-w-0">

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <button
                className="lg:hidden flex items-center gap-2 text-sm font-semibold border border-slate-200 bg-white rounded-lg px-3 py-2 hover:border-aps-300 transition-colors shadow-sm"
                onClick={() => setShowFilters(v => !v)}
              >
                <Filter size={14} />
                Filtres
                {activeFiltersCount > 0 && (
                  <span className="bg-aps-600 text-white text-xs font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-slate-500 hidden sm:inline">Trier :</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-aps-600 focus:border-aps-600 cursor-pointer shadow-sm"
                >
                  <option value="name">Nom A–Z</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                </select>
              </div>
            </div>

            {/* Active category pills */}
            {(categoryId || searchQuery || isPromo) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {categoryId && (
                  <span className="flex items-center gap-1.5 bg-aps-100 text-aps-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    {activeCategory?.icon} {activeCategory?.name}
                    <button onClick={() => updateParam('categoryId', null)}><X size={11} /></button>
                  </span>
                )}
                {searchQuery && (
                  <span className="flex items-center gap-1.5 bg-aps-100 text-aps-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    "{searchQuery}"
                    <button onClick={() => updateParam('search', null)}><X size={11} /></button>
                  </span>
                )}
                {isPromo && (
                  <span className="flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                    🔥 Promo
                    <button onClick={() => updateParam('isPromo', null)}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-400">
                <Loader2 size={36} className="animate-spin text-aps-600" />
                <span className="text-sm font-medium">Chargement des produits…</span>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-slate-400" />
                </div>
                <p className="text-lg font-bold text-slate-700">Aucun produit trouvé</p>
                <p className="text-sm text-slate-500 mt-1">Essayez de modifier vos filtres</p>
                <button className="btn-primary mt-5" onClick={clearAll}>
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
