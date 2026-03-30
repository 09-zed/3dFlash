import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, Phone, Menu, X, Car, ChevronRight, Zap } from 'lucide-react'
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
      setMobileOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="flex items-center gap-1.5">
            <Zap size={11} className="text-orange-400" />
            Livraison offerte dès 50€ · Plus de 50 000 références
          </span>
          <a href="tel:+33123456789" className="flex items-center gap-1.5 hover:text-orange-400 transition-colors font-medium">
            <Phone size={11} />
            01 23 45 67 89 · Lun–Sam 8h–19h
          </a>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
              <div className="bg-orange-500 text-white font-black text-sm px-2.5 py-1.5 rounded-lg leading-none tracking-wide">
                APS
              </div>
              <div className="hidden sm:block">
                <div className="text-white font-bold text-sm leading-tight">Auto Pièces</div>
                <div className="text-slate-400 text-xs">spécialiste depuis 1995</div>
              </div>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 min-w-0 hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une pièce, une référence..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-r-xl transition-colors"
                >
                  <Search size={17} />
                </button>
              </div>
            </form>

            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <ShoppingCart size={18} />
                <span className="hidden sm:inline text-sm">Panier</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-white text-orange-600 text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="sm:hidden p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                onClick={() => setMobileOpen(v => !v)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          {mobileOpen && (
            <form onSubmit={handleSearch} className="mt-3 sm:hidden">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une pièce..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-all"
                />
                <button type="submit" className="absolute right-0 top-0 bottom-0 px-3.5 bg-orange-500 text-white rounded-r-xl">
                  <Search size={17} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Nav bar */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden sm:flex items-center gap-1 text-sm overflow-x-auto no-scrollbar">
            <Link to="/" className="flex-shrink-0 text-slate-300 hover:text-white px-3 py-2.5 font-medium transition-colors">
              Accueil
            </Link>
            <Link to="/catalogue" className="flex-shrink-0 text-slate-300 hover:text-white px-3 py-2.5 font-medium transition-colors">
              Catalogue
            </Link>
            <Link to="/catalogue?isPromo=true" className="flex-shrink-0 text-orange-400 hover:text-orange-300 px-3 py-2.5 font-bold transition-colors">
              🔥 Promotions
            </Link>
            <Link to="/catalogue?isBestSeller=true" className="flex-shrink-0 text-slate-300 hover:text-white px-3 py-2.5 font-medium transition-colors">
              ⭐ Bestsellers
            </Link>

            {/* Vehicle banner in nav */}
            {selectedVehicle ? (
              <div className="ml-auto flex-shrink-0 flex items-center gap-2 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 my-1.5">
                <Car size={14} className="text-orange-400" />
                <span className="text-white text-xs font-semibold">
                  {selectedVehicle.make.name} {selectedVehicle.model.name}
                </span>
                <span className="text-slate-400 text-xs">({selectedVehicle.year})</span>
                <Link to="/catalogue" className="text-orange-400 hover:text-orange-300 text-xs font-medium ml-1 flex items-center gap-0.5">
                  Pièces <ChevronRight size={12} />
                </Link>
                <button onClick={clearVehicle} className="text-slate-500 hover:text-red-400 transition-colors ml-0.5">
                  <X size={12} />
                </button>
              </div>
            ) : (
              <Link
                to="/#plaque"
                className="ml-auto flex-shrink-0 flex items-center gap-1.5 text-slate-400 hover:text-white text-xs px-3 py-2 transition-colors"
              >
                <Car size={13} />
                Mon véhicule
              </Link>
            )}
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <div className="sm:hidden py-2 space-y-0.5">
              <Link to="/" className="flex items-center text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-slate-700" onClick={() => setMobileOpen(false)}>Accueil</Link>
              <Link to="/catalogue" className="flex items-center text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-slate-700" onClick={() => setMobileOpen(false)}>Catalogue</Link>
              <Link to="/catalogue?isPromo=true" className="flex items-center text-orange-400 px-3 py-2 text-sm font-bold rounded-lg hover:bg-slate-700" onClick={() => setMobileOpen(false)}>🔥 Promotions</Link>
              <Link to="/catalogue?isBestSeller=true" className="flex items-center text-slate-300 px-3 py-2 text-sm rounded-lg hover:bg-slate-700" onClick={() => setMobileOpen(false)}>⭐ Bestsellers</Link>
              {selectedVehicle && (
                <div className="flex items-center gap-2 bg-slate-700 rounded-lg px-3 py-2">
                  <Car size={14} className="text-orange-400" />
                  <span className="text-white text-sm font-medium flex-1">
                    {selectedVehicle.make.name} {selectedVehicle.model.name} ({selectedVehicle.year})
                  </span>
                  <button onClick={clearVehicle} className="text-slate-500 hover:text-red-400">
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
