import { useNavigate, Link } from 'react-router-dom'
import { useVehicle } from '../context/VehicleContext'
import { Car, ChevronRight, ArrowLeft, Wrench } from 'lucide-react'

// Catégories enrichies avec sous-catégories et couleurs
const PART_CATEGORIES = [
  {
    id: 'freinage',
    label: 'Freinage',
    emoji: '🛑',
    color: 'from-red-50 to-red-100',
    border: 'border-red-200',
    iconBg: 'bg-red-100',
    iconText: 'text-red-600',
    hoverBorder: 'hover:border-red-400',
    items: ['Plaquettes de frein', 'Disques de frein', 'Kits freinage', 'Étriers', 'Flexibles de frein'],
    count: 342,
  },
  {
    id: 'entretien',
    label: 'Entretien / Vidange',
    emoji: '🛢️',
    color: 'from-amber-50 to-yellow-100',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    hoverBorder: 'hover:border-amber-400',
    items: ['Huile moteur', 'Filtre à huile', 'Filtre à air', 'Filtre habitacle', 'Bougies d\'allumage'],
    count: 486,
    catalogId: 'filtration',
  },
  {
    id: 'suspension',
    label: 'Suspension / Direction',
    emoji: '🔩',
    color: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    hoverBorder: 'hover:border-blue-400',
    items: ['Amortisseurs', 'Ressorts', 'Rotules de direction', 'Triangles', 'Silent-blocs'],
    count: 264,
  },
  {
    id: 'transmission',
    label: 'Transmission / Embrayage',
    emoji: '⚙️',
    color: 'from-slate-50 to-slate-100',
    border: 'border-slate-200',
    iconBg: 'bg-slate-100',
    iconText: 'text-slate-600',
    hoverBorder: 'hover:border-slate-400',
    items: ['Kits d\'embrayage', 'Courroie de distribution', 'Cardan & demi-arbres', 'Joint de cardan', 'Volant moteur'],
    count: 196,
  },
  {
    id: 'eclairage',
    label: 'Éclairage',
    emoji: '💡',
    color: 'from-yellow-50 to-yellow-100',
    border: 'border-yellow-200',
    iconBg: 'bg-yellow-100',
    iconText: 'text-yellow-600',
    hoverBorder: 'hover:border-yellow-400',
    items: ['Ampoules LED / Xénon', 'Phares avant', 'Feux arrière', 'Feux antibrouillard', 'Indicateurs de direction'],
    count: 187,
  },
  {
    id: 'moteur',
    label: 'Moteur',
    emoji: '🔧',
    color: 'from-orange-50 to-orange-100',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
    hoverBorder: 'hover:border-orange-400',
    items: ['Courroie accessoires', 'Joints de culasse', 'Pompe à eau', 'Thermostat', 'Soupapes & ressorts'],
    count: 415,
  },
  {
    id: 'electricite',
    label: 'Batterie / Électricité',
    emoji: '⚡',
    color: 'from-violet-50 to-purple-100',
    border: 'border-violet-200',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
    hoverBorder: 'hover:border-violet-400',
    items: ['Batteries', 'Alternateurs', 'Démarreurs', 'Capteurs & sondes', 'Bobines d\'allumage'],
    count: 143,
  },
  {
    id: 'climatisation',
    label: 'Climatisation',
    emoji: '❄️',
    color: 'from-cyan-50 to-cyan-100',
    border: 'border-cyan-200',
    iconBg: 'bg-cyan-100',
    iconText: 'text-cyan-600',
    hoverBorder: 'hover:border-cyan-400',
    items: ['Compresseurs clim', 'Condenseurs', 'Filtre déshydratant', 'Détendeurs', 'Liquide réfrigérant'],
    count: 98,
  },
  {
    id: 'carrosserie',
    label: 'Carrosserie',
    emoji: '🚗',
    color: 'from-green-50 to-green-100',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
    hoverBorder: 'hover:border-green-400',
    items: ['Pare-chocs', 'Ailes & capots', 'Rétroviseurs', 'Essuie-glaces', 'Vitrages'],
    count: 312,
  },
  {
    id: 'pneumatiques',
    label: 'Pneumatiques',
    emoji: '⭕',
    color: 'from-gray-50 to-gray-100',
    border: 'border-gray-200',
    iconBg: 'bg-gray-100',
    iconText: 'text-gray-600',
    hoverBorder: 'hover:border-gray-400',
    items: ['Pneus été', 'Pneus hiver', 'Toutes saisons', 'Jantes & roues', 'Valves & accessoires'],
    count: 521,
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
    <div className="min-h-screen bg-slate-50">

      {/* ─── Hero vehicle banner ─── */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeft size={15} />
            Modifier la plaque
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 border border-orange-500/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Car size={22} className="text-orange-400" />
              </div>
              <div>
                <div className="text-slate-400 text-xs font-medium mb-0.5">Pièces compatibles pour votre véhicule</div>
                <div className="text-white font-black text-xl sm:text-2xl">
                  {make.name} {model.name}
                  <span className="text-slate-400 font-normal text-base ml-2">({year})</span>
                </div>
              </div>
            </div>

            <div className="sm:ml-auto flex items-center gap-2">
              <Link
                to="/catalogue"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm border border-slate-700 hover:border-slate-500 rounded-xl px-3 py-2 transition-all"
              >
                <Wrench size={14} />
                Voir tout le catalogue
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Category selection ─── */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            Quelle pièce recherchez-vous ?
          </h1>
          <p className="text-slate-500 text-base">
            Sélectionnez une catégorie pour voir les pièces compatibles avec votre {make.name} {model.name}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {PART_CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/catalogue?categoryId=${cat.catalogId ?? cat.id}`}
              className={`group bg-white border-2 ${cat.border} ${cat.hoverBorder} rounded-2xl p-5 transition-all duration-200 hover:shadow-xl hover:-translate-y-1 flex flex-col gap-3`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className={`w-12 h-12 ${cat.iconBg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>
                  {cat.emoji}
                </div>
                <span className="text-xs text-slate-400 font-medium mt-1 flex-shrink-0">
                  {cat.count.toLocaleString()} réf.
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className={`font-bold text-slate-900 text-base group-hover:${cat.iconText} transition-colors`}>
                  {cat.label}
                </h3>
              </div>

              {/* Sub-items */}
              <ul className="space-y-1.5 flex-1">
                {cat.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className={`flex items-center gap-1 text-sm font-semibold ${cat.iconText} mt-1`}>
                Voir les pièces
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm mb-3">Vous ne trouvez pas ce que vous cherchez ?</p>
          <Link to="/catalogue" className="btn-primary">
            Parcourir tout le catalogue
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
