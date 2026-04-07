import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Check, Eye } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import type { Product } from '../../types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock === 0 || added) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const stockColor =
    product.stock === 0 ? 'text-red-500' :
    product.stock <= 5 ? 'text-amber-500' :
    'text-green-600'

  const stockLabel =
    product.stock === 0 ? 'Rupture de stock' :
    product.stock <= 5 ? `Plus que ${product.stock} en stock` :
    'En stock'

  const stockDot =
    product.stock === 0 ? 'bg-red-500' :
    product.stock <= 5 ? 'bg-amber-500' :
    'bg-green-500'

  return (
    <div className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-aps-300 transition-all duration-200 flex flex-col h-full">

      {/* Image */}
      <Link to={`/produit/${product.id}`} className="relative block overflow-hidden bg-slate-50 aspect-[4/3]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-aps-600/0 group-hover:bg-aps-600/10 transition-colors duration-200 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-aps-600 font-semibold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow">
            <Eye size={13} />
            Voir le produit
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isPromo && discount && (
            <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded shadow-sm">
              -{discount}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded shadow-sm">
              ⭐ Best
            </span>
          )}
        </div>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
            <span className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
              Rupture de stock
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-black text-aps-600 uppercase tracking-wide">
            {product.brand}
          </span>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded">
            {product.reference}
          </span>
        </div>

        {/* Name */}
        <Link to={`/produit/${product.id}`} className="flex-1 mb-2.5">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug hover:text-aps-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.round(product.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-200 fill-slate-200'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.reviewCount})</span>
        </div>

        {/* Price + stock + cart */}
        <div className="border-t border-slate-100 pt-3 mt-auto">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="text-xl font-black text-slate-900">
                {product.price.toFixed(2)} <span className="text-lg">€</span>
              </div>
              {product.originalPrice && (
                <div className="text-xs text-slate-400 line-through">
                  {product.originalPrice.toFixed(2)} €
                </div>
              )}
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              title={product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex-shrink-0 ${
                added
                  ? 'bg-green-500 text-white'
                  : product.stock === 0
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-accent-500 hover:bg-accent-600 active:scale-95 text-white shadow-sm'
              }`}
            >
              {added ? <Check size={15} /> : <ShoppingCart size={15} />}
              <span className="hidden sm:inline">{added ? 'Ajouté' : 'Ajouter'}</span>
            </button>
          </div>

          {/* Stock indicator */}
          <div className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${stockColor}`}>
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${stockDot}`} />
            {stockLabel}
          </div>
        </div>
      </div>
    </div>
  )
}
