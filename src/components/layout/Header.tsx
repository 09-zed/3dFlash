import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingCart, Search, Phone, Menu, X, Car, ChevronDown,
  User, MapPin, Package
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useVehicle } from '../../context/VehicleContext'

const NAV_CATEGORIES = [
  { label: 'Freinage', id: 'freinage' },
  { label: 'Filtration / Vidange', id: 'filtration' },
  { label: 'Suspension', id: 'suspension' },
  { label: 'Transmission', id: 'transmission' },
  { label: 'Éclairage', id: 'eclairage' },
  { label: 'Moteur', id: 'moteur' },
  { label: 'Batterie / Élec.', id: 'electricite' },
  { label: 'Carrosserie', id: 'carrosserie' },
]

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
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 shadow-lg">

      {/* ─── Top utility bar ─── */}
      <div className="bg-[#001F5B] text-white/70 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin size={11} />
              Livraison France métropolitaine
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Package size={11} />
              +50 000 références en stock
            </span>
          </div>
          <a href="tel:+33123456789" className="flex items-center gap-1.5 hover:text-white transition-colors font-medium">
            <Phone size={11} />
            <span>01 23 45 67 89</span>
            <span className="text-white/40 hidden sm:inline">· Lun–Sam 8h–19h</span>
          </a>
        </div>
      </div>

      {/* ─── Main header (blue) ─── */}
      <div className="bg-aps-600">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group" onClick={() => setMobileOpen(false)}>
              <div className="bg-accent-500 text-white font-black text-base px-3 py-1.5 rounded-lg leading-none tracking-wider shadow-md group-hover:bg-accent-600 transition-colors">
                APS
              </div>
              <div className="hidden sm:block leading-tight">
                <div className="text-white font-bold text-sm">Auto Pièces</div>
                <div className="text-aps-200 text-xs font-medium">Spécialiste depuis 1995</div>
              </div>
            </Link>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex-1 min-w-0 hidden sm:flex">
              <div className="flex w-full rounded-lg overflow-hidden shadow-sm">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une pièce, une référence, une marque..."
                  className="flex-1 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-5 flex items-center gap-2 font-semibold text-sm transition-colors flex-shrink-0"
                >
                  <Search size={17} />
                  <span className="hidden lg:inline">Rechercher</span>
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-0">
              {/* Account */}
              <button className="hidden sm:flex flex-col items-center gap-0.5 text-white/80 hover:text-white transition-colors px-2 py-1">
                <User size={20} />
                <span className="text-xs font-medium">Mon compte</span>
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative flex flex-col items-center gap-0.5 text-white hover:text-white/90 transition-colors px-2 py-1"
              >
                <div className="relative">
                  <ShoppingCart size={22} />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center shadow leading-none px-0.5">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">Panier</span>
              </button>

              {/* Mobile burger */}
              <button
                className="sm:hidden p-2 text-white/80 hover:text-white transition-colors"
                onClick={() => setMobileOpen(v => !v)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          {mobileOpen && (
            <form onSubmit={handleSearch} className="mt-3 sm:hidden animate-fade-in">
              <div className="flex rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une pièce..."
                  className="flex-1 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                />
                <button type="submit" className="bg-accent-500 text-white px-4 flex items-center">
                  <Search size={17} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ─── Vehicle banner (shown when vehicle selected) ─── */}
      {selectedVehicle && (
        <div className="bg-aps-700 border-b border-aps-800">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3">
            <Car size={15} className="text-accent-500 flex-shrink-0" />
            <span className="text-white text-sm font-semibold flex-1 min-w-0 truncate">
              {selectedVehicle.make.name} {selectedVehicle.model.name}
              <span className="text-aps-300 font-normal ml-1.5">({selectedVehicle.year})</span>
            </span>
            <Link
              to="/mes-pieces"
              className="text-accent-400 hover:text-accent-500 text-xs font-semibold flex-shrink-0 transition-colors"
            >
              Mes pièces
            </Link>
            <span className="text-aps-500">|</span>
            <button
              onClick={clearVehicle}
              className="text-aps-300 hover:text-white text-xs transition-colors flex-shrink-0 flex items-center gap-1"
            >
              <X size={12} />
              Changer
            </button>
          </div>
        </div>
      )}

      {/* ─── Category navigation ─── */}
      <nav className="bg-aps-700 border-t border-aps-600/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden sm:flex items-center overflow-x-auto no-scrollbar">
            <Link
              to="/catalogue"
              className="flex-shrink-0 flex items-center gap-1.5 text-white font-bold text-sm px-4 py-3 hover:bg-aps-600 transition-colors border-r border-aps-600/50"
            >
              <Menu size={15} />
              Toutes catégories
              <ChevronDown size={13} />
            </Link>

            {NAV_CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={`/catalogue?categoryId=${cat.id}`}
                className="flex-shrink-0 text-aps-100 hover:text-white hover:bg-aps-600 text-sm px-3 py-3 transition-colors font-medium whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}

            <Link
              to="/catalogue?isPromo=true"
              className="flex-shrink-0 text-accent-400 hover:text-accent-500 hover:bg-aps-600 text-sm px-3 py-3 transition-colors font-bold whitespace-nowrap ml-auto"
            >
              🔥 Promotions
            </Link>
          </div>

          {/* Mobile nav menu */}
          {mobileOpen && (
            <div className="sm:hidden py-2 space-y-0.5 animate-fade-in">
              <Link to="/" className="flex items-center text-white px-3 py-2.5 text-sm font-medium hover:bg-aps-600 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                Accueil
              </Link>
              <Link to="/catalogue" className="flex items-center text-white px-3 py-2.5 text-sm font-medium hover:bg-aps-600 rounded-lg transition-colors" onClick={() => setMobileOpen(false)}>
                Catalogue complet
              </Link>
              {NAV_CATEGORIES.slice(0, 6).map(cat => (
                <Link
                  key={cat.id}
                  to={`/catalogue?categoryId=${cat.id}`}
                  className="flex items-center text-aps-200 px-3 py-2 text-sm hover:bg-aps-600 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {cat.label}
                </Link>
              ))}
              <Link
                to="/catalogue?isPromo=true"
                className="flex items-center text-accent-400 px-3 py-2.5 text-sm font-bold hover:bg-aps-600 rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                🔥 Promotions
              </Link>
              {selectedVehicle && (
                <div className="flex items-center gap-2 bg-aps-800 rounded-lg px-3 py-2.5 mt-2">
                  <Car size={14} className="text-accent-500" />
                  <span className="text-white text-sm font-medium flex-1">
                    {selectedVehicle.make.name} {selectedVehicle.model.name} ({selectedVehicle.year})
                  </span>
                  <button onClick={clearVehicle} className="text-aps-400 hover:text-red-400">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
