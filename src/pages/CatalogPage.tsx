import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X, ChevronDown, ChevronUp, Search, Car, SlidersHorizontal, Loader2 } from 'lucide-react'
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateParam('search', searchLocal.trim() || null)
  }

  const activeCategory = categories.find(c => c.id === categoryId)
  const title = activeCategory ? `${activeCategory.icon} ${activeCategory.name}`
    : searchQuery ? `Résultats pour "${searchQuery}"`
    : isPromo ? '🔥 Promotions'
    : 'Catalogue pièces auto'

  const activeFiltersCount = [categoryId, searchQuery, isPromo, inStock, priceRange[1] < 600].filter(Boolean).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? 'Chargement...' : `${products.length} produit${products.length !== 1 ? 's' : ''} trouvé${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={() => { setSearchParams(new URLSearchParams()); setSearchLocal(''); setPriceRange([0, 600]) }}
            className="flex-shrink-0 flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium border border-red-200 hover:border-red-300 bg-red-50 rounded-xl px-3 py-2 transition-colors"
          >
            <X size={14} />
            Effacer filtres ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Vehicle banner */}
      {selectedVehicle ? (
        <div className="bg-slate-900 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-9 h-9 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Car size={18} className="text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm">
              {selectedVehicle.make.name} {selectedVehicle.model.name}
              <span className="text-slate-400 font-normal ml-1.5">({selectedVehicle.year})</span>
            </div>
            <div className="text-slate-400 text-xs mt-0.5">Pièces compatibles avec votre véhicule</div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="text-orange-400 hover:text-orange-300 text-xs font-medium transition-colors"
              onClick={() => setShowVehicleSelector(v => !v)}
            >
              Changer
            </button>
            <span className="text-slate-700">·</span>
            <button onClick={clearVehicle} className="text-slate-500 hover:text-red-400 transition-colors">
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <button
            className="flex items-center gap-2 text-amber-700 font-semibold text-sm w-full"
            onClick={() => setShowVehicleSelector(v => !v)}
          >
            <Car size={18} />
            <span className="flex-1 text-left">Sélectionner votre véhicule pour filtrer les pièces compatibles</span>
            {showVehicleSelector ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showVehicleSelector && (
            <div className="mt-4 bg-white rounded-xl p-4 border border-amber-100">
              <VehicleSelector compact onSelect={() => setShowVehicleSelector(false)} />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar filters */}
        <aside className={`${showFilters ? 'fixed inset-0 z-50 p-4 bg-black/50 lg:static lg:bg-transparent lg:p-0 lg:inset-auto lg:z-auto' : 'hidden lg:block'} lg:w-64 flex-shrink-0`}>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24 space-y-6 lg:h-auto max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-orange-500" />
                Filtres
              </h2>
              <button className="lg:hidden p-1 hover:bg-slate-100 rounded-lg" onClick={() => setShowFilters(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Recherche</label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchLocal}
                  onChange={e => setSearchLocal(e.target.value)}
                  placeholder="Nom, référence..."
                  className="input-field pr-9"
                />
                <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500">
                  <Search size={15} />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Catégorie</label>
              <ul className="space-y-0.5">
                <li>
                  <button
                    className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${!categoryId ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => updateParam('categoryId', null)}
                  >
                    Toutes les catégories
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-colors ${categoryId === cat.id ? 'bg-orange-50 text-orange-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                      onClick={() => updateParam('categoryId', categoryId === cat.id ? null : cat.id)}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                Prix max : <span className="text-slate-900">{priceRange[1] >= 600 ? '600 €+' : `${priceRange[1]} €`}</span>
              </label>
              <input
                type="range" min={0} max={600} step={10}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0 €</span><span>600 €+</span>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => updateParam('isPromo', !isPromo ? 'true' : null)}
                  className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${isPromo ? 'bg-orange-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${isPromo ? 'left-4' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-slate-700">Promotions uniquement</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => updateParam('inStock', !inStock ? 'true' : null)}
                  className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${inStock ? 'bg-orange-500' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${inStock ? 'left-4' : 'left-0.5'}`} />
                </div>
                <span className="text-sm text-slate-700">En stock uniquement</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <button
              className="lg:hidden flex items-center gap-2 text-sm font-semibold border border-slate-200 bg-white rounded-xl px-3 py-2 hover:border-orange-300 transition-colors"
              onClick={() => setShowFilters(v => !v)}
            >
              <Filter size={15} />
              Filtres
              {activeFiltersCount > 0 && (
                <span className="bg-orange-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-slate-500 hidden sm:inline">Trier par :</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 cursor-pointer"
              >
                <option value="name">Nom A–Z</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          </div>

          {/* Products */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-orange-500" />
              <span className="text-sm font-medium">Chargement des produits…</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-slate-400" />
              </div>
              <p className="text-lg font-bold text-slate-700">Aucun produit trouvé</p>
              <p className="text-sm text-slate-500 mt-2">Essayez de modifier vos filtres ou votre recherche</p>
              <button
                className="btn-primary mt-6"
                onClick={() => { setSearchParams(new URLSearchParams()); setSearchLocal(''); setPriceRange([0, 600]) }}
              >
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
  )
}
