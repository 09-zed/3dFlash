import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Phone, Menu, X, ChevronDown } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useVehicle } from '../../context/VehicleContext'

export default function Header() {
  const { totalItems, toggleCart } = useCart()
  const { selectedVehicle, clearVehicle } = useVehicle()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top bar */}
      <div className="bg-brand-800 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>Livraison offerte dès 50€ d'achat</span>
          <div className="flex items-center gap-4">
            <a href="tel:+33123456789" className="flex items-center gap-1 hover:text-accent-400 transition-colors">
              <Phone size={12} />
              01 23 45 67 89
            </a>
            <span>Lun-Sam 8h-19h</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 text-white font-extrabold text-lg px-3 py-1.5 rounded-lg">APS</div>
              <div className="hidden sm:block">
                <div className="text-brand-800 font-bold text-sm leading-tight">Auto Pièces</div>
                <div className="text-gray-500 text-xs">spécialiste depuis 1995</div>
              </div>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1 min-w-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher une pièce, une référence, une marque..."
                className="w-full border-2 border-brand-200 rounded-xl pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-r-xl transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Cart button */}
          <button
            onClick={toggleCart}
            className="relative flex-shrink-0 flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            <ShoppingCart size={20} />
            <span className="hidden sm:inline">Panier</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-brand-600"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Vehicle selector banner */}
        {selectedVehicle && (
          <div className="mt-2 flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-lg px-3 py-1.5 text-sm">
            <span className="text-brand-700 font-medium">
              🚗 {selectedVehicle.make.name} {selectedVehicle.model.name} ({selectedVehicle.year})
            </span>
            <span className="text-brand-400 mx-1">—</span>
            <Link to="/catalogue" className="text-accent-600 hover:text-accent-700 font-medium">
              Voir les pièces compatibles
            </Link>
            <button
              onClick={clearVehicle}
              className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Nav bar */}
      <nav className="border-t border-gray-100 bg-brand-700">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="hidden md:flex items-center gap-1 text-sm">
            <li>
              <Link to="/" className="flex items-center gap-1 text-white hover:text-accent-400 font-medium px-3 py-3 transition-colors">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/catalogue" className="flex items-center gap-1 text-white hover:text-accent-400 font-medium px-3 py-3 transition-colors">
                Catalogue
                <ChevronDown size={14} />
              </Link>
            </li>
            <li>
              <Link to="/catalogue?isPromo=true" className="flex items-center gap-1 text-accent-400 hover:text-accent-300 font-bold px-3 py-3 transition-colors">
                🔥 Promotions
              </Link>
            </li>
            <li>
              <Link to="/catalogue?isBestSeller=true" className="flex items-center gap-1 text-white hover:text-accent-400 font-medium px-3 py-3 transition-colors">
                ⭐ Bestsellers
              </Link>
            </li>
            <li className="ml-auto">
              <Link to="/catalogue" className="flex items-center gap-1 text-white hover:text-accent-400 font-medium px-3 py-3 transition-colors">
                Mon véhicule
              </Link>
            </li>
          </ul>

          {/* Mobile nav */}
          {mobileOpen && (
            <ul className="md:hidden flex flex-col py-2">
              <li><Link to="/" className="block text-white px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>Accueil</Link></li>
              <li><Link to="/catalogue" className="block text-white px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>Catalogue</Link></li>
              <li><Link to="/catalogue?isPromo=true" className="block text-accent-400 px-3 py-2 text-sm font-bold" onClick={() => setMobileOpen(false)}>🔥 Promotions</Link></li>
              <li><Link to="/catalogue?isBestSeller=true" className="block text-white px-3 py-2 text-sm" onClick={() => setMobileOpen(false)}>⭐ Bestsellers</Link></li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  )
}
