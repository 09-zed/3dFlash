import { useNavigate, Link } from 'react-router-dom'
import { useVehicle } from '../context/VehicleContext'
import { Car, ChevronRight, ArrowLeft } from 'lucide-react'

const PART_CATEGORIES = [
  {
    id: 'freinage',
    label: 'Freinage',
    emoji: '🛑',
    items: ['Plaquettes de frein', 'Disques de frein', 'Kits freinage', 'Étriers', 'Flexibles de frein'],
    count: 342,
    color: 'border-red-300 hover:border-red-500 hover:bg-red-50',
    accent: 'text-red-600',
  },
  {
    id: 'entretien',
    label: 'Entretien / Vidange',
    emoji: '🛢️',
    items: ['Huile moteur', 'Filtre à huile', 'Filtre à air', 'Filtre habitacle', 'Bougies'],
    count: 486,
    catalogId: 'filtration',
    color: 'border-amber-300 hover:border-amber-500 hover:bg-amber-50',
    accent: 'text-amber-700',
  },
  {
    id: 'suspension',
    label: 'Suspension / Direction',
    emoji: '🔩',
    items: ['Amortisseurs', 'Ressorts', 'Rotules', 'Triangles', 'Silent-blocs'],
    count: 264,
    color: 'border-blue-300 hover:border-blue-500 hover:bg-blue-50',
    accent: 'text-blue-700',
  },
  {
    id: 'transmission',
    label: 'Transmission / Embrayage',
    emoji: '⚙️',
    items: ['Kits embrayage', 'Courroie distrib.', 'Cardans', 'Joint de cardan', 'Volant moteur'],
    count: 196,
    color: 'border-slate-300 hover:border-slate-500 hover:bg-slate-50',
    accent: 'text-slate-700',
  },
  {
    id: 'eclairage',
    label: 'Éclairage',
    emoji: '💡',
    items: ['Ampoules LED / Xénon', 'Phares avant', 'Feux arrière', 'Antibrouillards', 'Clignotants'],
    count: 187,
    color: 'border-yellow-300 hover:border-yellow-500 hover:bg-yellow-50',
    accent: 'text-yellow-700',
  },
  {
    id: 'moteur',
    label: 'Moteur',
    emoji: '🔧',
    items: ['Courroie accessoires', 'Joints de culasse', 'Pompe à eau', 'Thermostat', 'Soupapes'],
    count: 415,
    color: 'border-orange-300 hover:border-orange-500 hover:bg-orange-50',
    accent: 'text-orange-700',
  },
  {
    id: 'electricite',
    label: 'Batterie / Électricité',
    emoji: '⚡',
    items: ['Batteries', 'Alternateurs', 'Démarreurs', 'Capteurs & sondes', 'Bobines'],
    count: 143,
    color: 'border-violet-300 hover:border-violet-500 hover:bg-violet-50',
    accent: 'text-violet-700',
  },
  {
    id: 'climatisation',
    label: 'Climatisation',
    emoji: '❄️',
    items: ['Compresseurs clim', 'Condenseurs', 'Filtre déshydratant', 'Détendeurs', 'Liquide réfrigérant'],
    count: 98,
    color: 'border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50',
    accent: 'text-cyan-700',
  },
  {
    id: 'carrosserie',
    label: 'Carrosserie',
    emoji: '🚗',
    items: ['Pare-chocs', 'Ailes & capots', 'Rétroviseurs', 'Essuie-glaces', 'Vitrages'],
    count: 312,
    color: 'border-green-300 hover:border-green-500 hover:bg-green-50',
    accent: 'text-green-700',
  },
  {
    id: 'pneumatiques',
    label: 'Pneumatiques',
    emoji: '⭕',
    items: ['Pneus été', 'Pneus hiver', 'Toutes saisons', 'Jantes', 'Valves & accessoires'],
    count: 521,
    color: 'border-gray-300 hover:border-gray-500 hover:bg-gray-50',
    accent: 'text-gray-700',
  },
]

export default function VehiclePartsPage() {
  const { selectedVehicle } = useVehicle()
  const navigate = useNavigate()

  if (!selectedVehicle) {
    navigate('/')
    return null
  }

  const { make, model, year } = selectedVehicle

  return (
    <div className="min-h-screen bg-[#F4F6FA]">

      {/* ─── Breadcrumb + Vehicle banner ─── */}
      <div className="bg-aps-600 border-b border-aps-700">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-aps-200 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={14} />
            Modifier mon véhicule
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Car size={24} className="text-white" />
              </div>
              <div>
                <div className="text-aps-300 text-xs font-medium mb-0.5">Pièces compatibles pour votre véhicule</div>
                <div className="text-white font-black text-xl sm:text-2xl">
                  {make.name} {model.name}
                  <span className="text-aps-300 font-normal text-base ml-2">· {year}</span>
                </div>
              </div>
            </div>
            <Link
              to="/catalogue"
              className="sm:ml-auto flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg px-4 py-2 transition-all font-medium"
            >
              Catalogue complet
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Categories grid ─── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-7">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] mb-2">
            Quelle pièce recherchez-vous ?
          </h1>
          <p className="text-slate-500">
            Sélectionnez une catégorie pour voir les pièces compatibles avec votre {make.name} {model.name}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PART_CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/catalogue?categoryId=${cat.catalogId ?? cat.id}`}
              className={`group bg-white border-2 ${cat.color} rounded-xl p-5 transition-all duration-200 hover:shadow-lg flex flex-col gap-3 hover:-translate-y-0.5`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="text-3xl">{cat.emoji}</div>
                <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded-full">
                  {cat.count.toLocaleString()} réf.
                </span>
              </div>

              {/* Title */}
              <h3 className="font-bold text-slate-900 text-base leading-tight">{cat.label}</h3>

              {/* Sub-items */}
              <ul className="space-y-1 flex-1">
                {cat.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className={`flex items-center gap-1 text-sm font-bold ${cat.accent} mt-1`}>
                Voir les pièces
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom link */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-3">Vous ne trouvez pas ce que vous cherchez ?</p>
          <Link to="/catalogue" className="btn-primary">
            Parcourir tout le catalogue
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
