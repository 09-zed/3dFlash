import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Tag } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import type { Product } from '../../types'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <div className="card group flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <Link to={`/produit/${product.id}`} className="relative overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isPromo && discount && (
            <span className="badge bg-red-500 text-white">-{discount}%</span>
          )}
          {product.isBestSeller && (
            <span className="badge bg-accent-500 text-white">Bestseller</span>
          )}
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded">Rupture de stock</span>
          </div>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute bottom-2 right-2 badge bg-orange-100 text-orange-700">
            Plus que {product.stock} en stock
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Brand & ref */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wide">{product.brand}</span>
          <span className="text-xs text-gray-400 font-mono">{product.reference}</span>
        </div>

        {/* Name */}
        <Link to={`/produit/${product.id}`} className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800 leading-snug hover:text-brand-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>

        {/* Category */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Tag size={11} />
          <span>{product.categoryName}</span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mt-auto pt-2">
          <div>
            <span className="text-xl font-extrabold text-brand-700">{product.price.toFixed(2)} €</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">{product.originalPrice.toFixed(2)} €</span>
            )}
          </div>
          <button
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
            className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
            title="Ajouter au panier"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
