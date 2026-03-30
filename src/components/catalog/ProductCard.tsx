import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Check } from 'lucide-react'
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
    'text-green-500'

  const stockLabel =
    product.stock === 0 ? 'Rupture' :
    product.stock <= 5 ? `Plus que ${product.stock}` :
    'En stock'

  return (
    <div className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-200 flex flex-col h-full">
      {/* Image */}
      <Link to={`/produit/${product.id}`} className="relative block overflow-hidden bg-slate-50 aspect-[4/3]">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.isPromo && discount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm">
              -{discount}%
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm">
              ⭐ Best
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
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
        {/* Brand & ref */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">
            {product.brand}
          </span>
          <span className="text-xs text-slate-400 font-mono">{product.reference}</span>
        </div>

        {/* Name */}
        <Link to={`/produit/${product.id}`} className="flex-1 mb-2">
          <h3 className="text-sm font-semibold text-slate-800 leading-snug hover:text-orange-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={12}
                className={i < Math.round(product.rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-200 fill-slate-200'}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.reviewCount})</span>
        </div>

        {/* Price + cart */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
          <div>
            <div className="text-lg font-black text-slate-900">
              {product.price.toFixed(2)} €
            </div>
            {product.originalPrice && (
              <div className="text-xs text-slate-400 line-through">
                {product.originalPrice.toFixed(2)} €
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Stock dot */}
            <span className={`text-xs font-semibold ${stockColor}`}>
              {stockLabel}
            </span>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              title={product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                added
                  ? 'bg-green-500 text-white scale-95'
                  : product.stock === 0
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 active:scale-90 text-white shadow-sm'
              }`}
            >
              {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
