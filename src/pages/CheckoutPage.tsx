import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, CreditCard, Truck, ArrowLeft, Lock } from 'lucide-react'
import { useCart } from '../context/CartContext'
import type { ShippingAddress } from '../types'

type Step = 'shipping' | 'payment' | 'confirmation'

const emptyAddress: ShippingAddress = {
  firstName: '', lastName: '', email: '', phone: '',
  street: '', city: '', postalCode: '', country: 'France',
}

export default function CheckoutPage() {
  const { items, subtotal, shipping, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('shipping')
  const [address, setAddress] = useState<ShippingAddress>(emptyAddress)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'transfer'>('card')
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({})
  const [orderRef] = useState(`APS-${Date.now().toString(36).toUpperCase()}`)

  if (items.length === 0 && step !== 'confirmation') {
    navigate('/panier')
    return null
  }

  const validateShipping = () => {
    const errs: Partial<ShippingAddress> = {}
    if (!address.firstName) errs.firstName = 'Requis'
    if (!address.lastName) errs.lastName = 'Requis'
    if (!address.email || !/\S+@\S+\.\S+/.test(address.email)) errs.email = 'Email invalide'
    if (!address.phone) errs.phone = 'Requis'
    if (!address.street) errs.street = 'Requis'
    if (!address.city) errs.city = 'Requis'
    if (!address.postalCode || !/^\d{5}$/.test(address.postalCode)) errs.postalCode = 'Code postal invalide'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleShippingNext = () => {
    if (validateShipping()) setStep('payment')
  }

  const handlePlaceOrder = () => {
    // TODO: call orderService.createOrder({ items, address, paymentMethod, subtotal, shipping, total })
    clearCart()
    setStep('confirmation')
  }

  const field = (key: keyof ShippingAddress, label: string, type = 'text', className = '') => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={address[key]}
        onChange={e => setAddress(a => ({ ...a, [key]: e.target.value }))}
        className={`input-field ${errors[key] ? 'border-red-400 focus:ring-red-400' : ''}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Steps */}
      {step !== 'confirmation' && (
        <div className="flex items-center gap-2 mb-8">
          {(['shipping', 'payment'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step === s ? 'bg-brand-600 text-white' : i < (['shipping', 'payment'] as Step[]).indexOf(step) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                {i < (['shipping', 'payment'] as Step[]).indexOf(step) ? <CheckCircle size={16} /> : null}
                {s === 'shipping' ? '1. Livraison' : '2. Paiement'}
              </div>
              {i < 1 && <div className="w-8 h-0.5 bg-gray-200" />}
            </div>
          ))}
        </div>
      )}

      {/* ── Step: Confirmation ───────────────────────────────────────────────── */}
      {step === 'confirmation' && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-500 mb-2">Votre commande <span className="font-mono font-semibold text-brand-700">#{orderRef}</span> a été passée avec succès.</p>
          <p className="text-gray-500 mb-8">Un email de confirmation a été envoyé à <strong>{address.email}</strong>.</p>
          <div className="bg-gray-50 rounded-xl p-6 max-w-sm mx-auto mb-8 text-sm text-gray-600 space-y-2">
            <div className="flex justify-between">
              <span>Livraison à</span>
              <span className="font-medium text-gray-900">{address.firstName} {address.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span>Adresse</span>
              <span className="font-medium text-gray-900 text-right">{address.street}, {address.postalCode} {address.city}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
              <span>Total payé</span>
              <span className="font-bold text-brand-700">{total.toFixed(2)} €</span>
            </div>
          </div>
          <Link to="/" className="btn-primary">Retour à l'accueil</Link>
        </div>
      )}

      {step !== 'confirmation' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main form */}
          <div className="lg:col-span-2">
            {/* ── Step: Shipping ─────────────────────────────────────────────── */}
            {step === 'shipping' && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <Truck size={20} className="text-brand-600" />
                  Adresse de livraison
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {field('firstName', 'Prénom')}
                  {field('lastName', 'Nom')}
                  {field('email', 'Email', 'email', 'col-span-2')}
                  {field('phone', 'Téléphone', 'tel')}
                  {field('street', 'Adresse', 'text', 'col-span-2')}
                  {field('postalCode', 'Code postal')}
                  {field('city', 'Ville')}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                    <select
                      value={address.country}
                      onChange={e => setAddress(a => ({ ...a, country: e.target.value }))}
                      className="input-field"
                    >
                      <option>France</option>
                      <option>Belgique</option>
                      <option>Suisse</option>
                      <option>Luxembourg</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Link to="/panier" className="flex items-center gap-2 text-brand-600 text-sm font-medium">
                    <ArrowLeft size={16} /> Retour au panier
                  </Link>
                  <button onClick={handleShippingNext} className="btn-primary">
                    Continuer vers le paiement
                  </button>
                </div>
              </div>
            )}

            {/* ── Step: Payment ──────────────────────────────────────────────── */}
            {step === 'payment' && (
              <div className="card p-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
                  <CreditCard size={20} className="text-brand-600" />
                  Mode de paiement
                </h2>
                <div className="space-y-3 mb-6">
                  {[
                    { id: 'card', label: '💳 Carte bancaire', desc: 'Visa, Mastercard, CB' },
                    { id: 'paypal', label: '🅿️ PayPal', desc: 'Paiement via votre compte PayPal' },
                    { id: 'transfer', label: '🏦 Virement bancaire', desc: 'Expédition dès réception du virement' },
                  ].map(m => (
                    <label
                      key={m.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === m.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={m.id}
                        checked={paymentMethod === m.id as typeof paymentMethod}
                        onChange={() => setPaymentMethod(m.id as typeof paymentMethod)}
                        className="mt-1 accent-brand-600"
                      />
                      <div>
                        <div className="font-semibold text-sm text-gray-800">{m.label}</div>
                        <div className="text-xs text-gray-500">{m.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de carte</label>
                      <input type="text" placeholder="•••• •••• •••• ••••" className="input-field font-mono" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date d'expiration</label>
                        <input type="text" placeholder="MM/AA" className="input-field" maxLength={5} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input type="text" placeholder="•••" className="input-field" maxLength={3} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Lock size={12} />
                      Vos données bancaires sont sécurisées et chiffrées
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button onClick={() => setStep('shipping')} className="flex items-center gap-2 text-brand-600 text-sm font-medium">
                    <ArrowLeft size={16} /> Modifier la livraison
                  </button>
                  <button onClick={handlePlaceOrder} className="btn-accent">
                    <Lock size={16} />
                    Confirmer la commande · {total.toFixed(2)} €
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="card p-6 h-fit space-y-3">
            <h3 className="font-bold text-gray-900">Votre commande</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-2 text-sm">
                  <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 line-clamp-1 text-xs">{product.name}</p>
                    <p className="text-gray-500 text-xs">x{quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-800 flex-shrink-0">{(product.price * quantity).toFixed(2)} €</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>{shipping === 0 ? <span className="text-green-600 font-medium">Gratuite</span> : `${shipping.toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-brand-700">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
