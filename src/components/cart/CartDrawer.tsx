import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../../context/CartContext'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, shipping, total } = useCart()
  const ref = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeCart])

  // Prevent scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={ref}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag size={20} className="text-brand-600" />
            Mon panier
            {items.length > 0 && (
              <span className="bg-brand-100 text-brand-700 text-sm font-semibold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </h2>
          <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400 p-8">
              <ShoppingBag size={56} strokeWidth={1} />
              <div className="text-center">
                <p className="font-semibold text-gray-600">Votre panier est vide</p>
                <p className="text-sm mt-1">Ajoutez des pièces pour continuer</p>
              </div>
              <button onClick={closeCart} className="btn-primary mt-2">
                Parcourir le catalogue
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="p-4 flex gap-3">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 font-mono">{product.reference}</p>
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-tight">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
                    <div className="flex items-center justify-between mt-2">
                      {/* Qty controls */}
                      <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          className="p-1 hover:bg-gray-100 transition-colors"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm font-semibold w-7 text-center">{quantity}</span>
                        <button
                          className="p-1 hover:bg-gray-100 transition-colors"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="font-bold text-brand-700">
                        {(product.price * quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors self-start mt-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer totals */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Livraison</span>
              <span>{shipping === 0 ? <span className="text-green-600 font-medium">Gratuite</span> : `${shipping.toFixed(2)} €`}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gray-400 text-center">
                Plus que <span className="font-semibold text-brand-600">{(50 - subtotal).toFixed(2)} €</span> pour la livraison gratuite
              </p>
            )}
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
              <span>Total TTC</span>
              <span className="text-brand-700">{total.toFixed(2)} €</span>
            </div>
            <Link
              to="/panier"
              onClick={closeCart}
              className="btn-accent w-full justify-center mt-2"
            >
              Valider la commande →
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
