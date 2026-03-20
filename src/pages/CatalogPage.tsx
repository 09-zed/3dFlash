import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X, ChevronDown, ChevronUp, Search, Car } from 'lucide-react'
import ProductCard from '../components/catalog/ProductCard'
import VehicleSelector from '../components/vehicle/VehicleSelector'
import { productService } from '../services/productService'
import { categories } from '../data/categories'
import { useVehicle } from '../context/VehicleContext'
import type { Product, ProductFilters } from '../types'

type SortOption = 'price_asc' | 'price_desc' | 'rating' | 'name'

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { selectedVehicle } = useVehicle()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showVehicleSelector, setShowVehicleSelector] = useState(false)
  const [sort, setSort] = useState<SortOption>('name')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 600])

  // Filters from URL
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

    // Sort
    data = [...data].sort((a, b) => {
      switch (sort) {
        case 'price_asc': return a.price - b.price
        case 'price_desc': return b.price - a.price
        case 'rating': return b.rating - a.rating
        default: return a.name.localeCompare(b.name)
      }
    })

    setProducts(data)
    setLoading(false)
  }, [categoryId, searchQuery, isPromo, inStock, priceRange, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams)
    if (value === null) next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  const activeCategory = categories.find(c => c.id === categoryId)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* ── Page header ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {activeCategory ? activeCategory.name
            : searchQuery ? `Résultats pour "${searchQuery}"`
            : isPromo ? '🔥 Promotions'
            : 'Catalogue pièces auto'}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? 'Chargement...' : `${products.length} produit${products.length !== 1 ? 's' : ''} trouvé${products.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* ── Vehicle banner ──────────────────────────────────────────────────── */}
      {selectedVehicle ? (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <Car size={20} className="text-brand-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="font-semibold text-brand-800">
              {selectedVehicle.make.name} {selectedVehicle.model.name} ({selectedVehicle.year})
            </span>
            <span className="text-brand-600 text-sm ml-2">— Affichage des pièces compatibles</span>
          </div>
          <button
            className="text-brand-400 hover:text-brand-600 text-sm underline"
            onClick={() => setShowVehicleSelector(v => !v)}
          >
            Changer
          </button>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <button
            className="flex items-center gap-2 text-amber-700 font-medium text-sm"
            onClick={() => setShowVehicleSelector(v => !v)}
          >
            <Car size={18} />
            Sélectionner votre véhicule pour voir les pièces compatibles
            {showVehicleSelector ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showVehicleSelector && (
            <div className="mt-4 bg-white rounded-lg p-4 border border-amber-100">
              <VehicleSelector compact onSelect={() => setShowVehicleSelector(false)} />
            </div>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* ── Sidebar filters ───────────────────────────────────────────────── */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
          <div className="card p-4 sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Filtres</h2>
              <button className="lg:hidden" onClick={() => setShowFilters(false)}><X size={18} /></button>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue={searchQuery ?? ''}
                  placeholder="Nom, référence..."
                  className="input-field pr-8"
                  onKeyDown={e => {
                    if (e.key === 'Enter') updateParam('search', (e.target as HTMLInputElement).value || null)
                  }}
                />
                <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${!categoryId ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => updateParam('categoryId', null)}
                  >
                    Toutes les catégories
                  </button>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button
                      className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${categoryId === cat.id ? 'bg-brand-100 text-brand-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => updateParam('categoryId', categoryId === cat.id ? null : cat.id)}
                    >
                      <span>{cat.icon} {cat.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix: {priceRange[0]} € — {priceRange[1] >= 600 ? '600+ €' : `${priceRange[1]} €`}
              </label>
              <input
                type="range"
                min={0}
                max={600}
                step={10}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-brand-600"
              />
            </div>

            {/* Switches */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPromo}
                  onChange={e => updateParam('isPromo', e.target.checked ? 'true' : null)}
                  className="w-4 h-4 accent-brand-600"
                />
                <span className="text-sm text-gray-700">Promotions uniquement</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={e => updateParam('inStock', e.target.checked ? 'true' : null)}
                  className="w-4 h-4 accent-brand-600"
                />
                <span className="text-sm text-gray-700">En stock uniquement</span>
              </label>
            </div>

            {/* Reset */}
            <button
              className="w-full text-sm text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg py-2 transition-colors"
              onClick={() => setSearchParams(new URLSearchParams())}
            >
              Réinitialiser les filtres
            </button>
          </div>
        </aside>

        {/* ── Products grid ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
            <button
              className="lg:hidden flex items-center gap-2 text-sm font-medium border border-gray-300 rounded-lg px-3 py-2"
              onClick={() => setShowFilters(v => !v)}
            >
              <Filter size={16} />
              Filtres
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-500">Trier par :</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="name">Nom</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="rating">Meilleures notes</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-72 animate-pulse">
                  <div className="bg-gray-200 h-44 w-full" />
                  <div className="p-4 space-y-2">
                    <div className="bg-gray-200 h-4 w-24 rounded" />
                    <div className="bg-gray-200 h-4 w-full rounded" />
                    <div className="bg-gray-200 h-6 w-20 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Search size={48} strokeWidth={1} className="mx-auto mb-4" />
              <p className="text-lg font-semibold text-gray-600">Aucun produit trouvé</p>
              <p className="text-sm mt-2">Essayez de modifier vos filtres ou votre recherche</p>
              <button
                className="btn-primary mt-6"
                onClick={() => setSearchParams(new URLSearchParams())}
              >
                Réinitialiser
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
