import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} strokeWidth={1} className="mx-auto text-gray-300 mb-6" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">Parcourez notre catalogue pour trouver les pièces dont vous avez besoin.</p>
        <Link to="/catalogue" className="btn-primary">
          Parcourir le catalogue
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon panier ({items.length} article{items.length > 1 ? 's' : ''})</h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 font-medium">
          Vider le panier
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="card p-4 flex gap-4 items-start">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg border border-gray-100 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-mono">{product.reference}</p>
                <Link to={`/produit/${product.id}`} className="font-semibold text-gray-800 hover:text-brand-600 transition-colors text-sm leading-snug">
                  {product.name}
                </Link>
                <p className="text-xs text-gray-500 mt-0.5">{product.brand} · {product.categoryName}</p>
                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 font-semibold">{quantity}</span>
                    <button
                      className="px-3 py-1.5 hover:bg-gray-100 transition-colors"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-brand-700 text-lg">{(product.price * quantity).toFixed(2)} €</span>
                    <span className="text-xs text-gray-400">({product.price.toFixed(2)} € / u.)</span>
                    <button
                      onClick={() => removeItem(product.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-6 space-y-3">
            <h2 className="font-bold text-gray-900 text-lg">Récapitulatif</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total ({items.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">Gratuite</span> : `${shipping.toFixed(2)} €`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 text-center">
                  Plus que <strong>{(50 - subtotal).toFixed(2)} €</strong> pour la livraison gratuite
                </p>
              )}
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
              <span>Total TTC</span>
              <span className="text-brand-700">{total.toFixed(2)} €</span>
            </div>
            <Link to="/commande" className="btn-accent w-full justify-center mt-2">
              Passer la commande →
            </Link>
          </div>

          {/* Trust */}
          <div className="card p-4 space-y-3">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Truck size={18} className="text-brand-600 flex-shrink-0 mt-0.5" />
              <span><strong>Livraison rapide</strong> — Commandez avant 15h pour une expédition le jour même</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Shield size={18} className="text-brand-600 flex-shrink-0 mt-0.5" />
              <span><strong>Retour gratuit</strong> — 30 jours pour changer d'avis</span>
            </div>
          </div>
        </div>
      </div>

      <Link to="/catalogue" className="flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm font-medium mt-8">
        <ArrowLeft size={16} />
        Continuer mes achats
      </Link>
    </div>
  )
}
