import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Star, Shield, Truck, Package, ChevronRight, Plus, Minus, ArrowLeft } from 'lucide-react'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/catalog/ProductCard'
import type { Product } from '../types'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    productService.getProductById(id).then(p => {
      setProduct(p)
      setLoading(false)
      if (p) {
        productService.getProducts({ categoryId: p.categoryId }).then(all =>
          setRelated(all.filter(x => x.id !== p.id).slice(0, 4))
        )
      }
    })
  }, [id])

  const handleAddToCart = () => {
    if (!product) return
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="grid lg:grid-cols-2 gap-10">
          <div className="bg-gray-200 rounded-xl h-96" />
          <div className="space-y-4">
            <div className="bg-gray-200 h-6 w-32 rounded" />
            <div className="bg-gray-200 h-8 w-full rounded" />
            <div className="bg-gray-200 h-10 w-24 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-xl font-semibold text-gray-600">Produit introuvable</p>
        <Link to="/catalogue" className="btn-primary mt-6">Retour au catalogue</Link>
      </div>
    )
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-brand-600">Accueil</Link>
        <ChevronRight size={14} />
        <Link to="/catalogue" className="hover:text-brand-600">Catalogue</Link>
        <ChevronRight size={14} />
        <Link to={`/catalogue?categoryId=${product.categoryId}`} className="hover:text-brand-600">{product.categoryName}</Link>
        <ChevronRight size={14} />
        <span className="text-gray-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* ── Images ─────────────────────────────────────────────────────────── */}
        <div>
          <div className="card overflow-hidden mb-3">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`border-2 rounded-lg overflow-hidden ${i === activeImg ? 'border-brand-500' : 'border-gray-200'}`}
                >
                  <img src={img} alt="" className="w-16 h-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details ────────────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">{product.brand}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400 font-mono">Réf: {product.reference}</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({product.reviewCount} avis)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl font-extrabold text-brand-700">{product.price.toFixed(2)} €</span>
            {product.originalPrice && (
              <span className="text-xl text-gray-400 line-through">{product.originalPrice.toFixed(2)} €</span>
            )}
            {discount && (
              <span className="badge bg-red-100 text-red-600 text-sm font-bold">-{discount}%</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-5">TVA incluse</p>

          {/* Stock */}
          <div className={`flex items-center gap-2 text-sm font-medium mb-5 ${product.stock > 5 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : product.stock > 0 ? 'bg-orange-500' : 'bg-red-500'}`} />
            {product.stock > 5 ? `En stock (${product.stock} unités)` : product.stock > 0 ? `Stock limité (${product.stock} restant${product.stock > 1 ? 's' : ''})` : 'Rupture de stock'}
          </div>

          {/* Qty + CTA */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setQty(q => Math.max(1, q - 1))}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-bold text-lg">{qty}</span>
              <button
                className="px-3 py-2 hover:bg-gray-100 transition-colors"
                onClick={() => setQty(q => Math.min(product.stock, q + 1))}
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white transition-all ${added ? 'bg-green-500' : 'bg-brand-600 hover:bg-brand-700'} disabled:bg-gray-300 disabled:cursor-not-allowed`}
            >
              <ShoppingCart size={20} />
              {added ? 'Ajouté au panier ✓' : `Ajouter au panier · ${(product.price * qty).toFixed(2)} €`}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4 mb-6">
            <div className="text-center">
              <Truck size={20} className="mx-auto text-brand-600 mb-1" />
              <p className="text-xs text-gray-600 font-medium">Livraison 24/48h</p>
            </div>
            <div className="text-center">
              <Shield size={20} className="mx-auto text-brand-600 mb-1" />
              <p className="text-xs text-gray-600 font-medium">Garantie 2 ans</p>
            </div>
            <div className="text-center">
              <Package size={20} className="mx-auto text-brand-600 mb-1" />
              <p className="text-xs text-gray-600 font-medium">Retour 30j</p>
            </div>
          </div>

          {/* Compatible vehicles */}
          {product.compatibleVehicles.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Compatibilité</h3>
              <div className="flex flex-wrap gap-1">
                {product.compatibleVehicles.map(v => (
                  <span key={v} className="badge bg-brand-50 text-brand-700">{v}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs: Description / Specs ────────────────────────────────────────── */}
      <div className="mt-10 border-t border-gray-100 pt-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Caractéristiques techniques</h2>
            <dl className="space-y-2">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="flex gap-2 text-sm border-b border-gray-100 pb-2">
                  <dt className="w-40 flex-shrink-0 text-gray-500 font-medium">{key}</dt>
                  <dd className="text-gray-800">{val}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* ── Related products ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Produits similaires</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <div className="mt-8">
        <Link to="/catalogue" className="flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium">
          <ArrowLeft size={16} />
          Retour au catalogue
        </Link>
      </div>
    </div>
  )
}
