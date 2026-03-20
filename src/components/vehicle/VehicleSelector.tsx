import { useState, useEffect } from 'react'
import { ChevronDown, Car, CheckCircle } from 'lucide-react'
import { vehicleService } from '../../services/vehicleService'
import { useVehicle } from '../../context/VehicleContext'
import type { VehicleMake, VehicleModel } from '../../types'

interface Props {
  onSelect?: () => void
  compact?: boolean
}

export default function VehicleSelector({ onSelect, compact = false }: Props) {
  const { selectedVehicle, setSelectedVehicle } = useVehicle()
  const [makes, setMakes] = useState<VehicleMake[]>([])
  const [models, setModels] = useState<VehicleModel[]>([])
  const [years, setYears] = useState<number[]>([])

  const [selectedMake, setSelectedMake] = useState<VehicleMake | null>(selectedVehicle?.make ?? null)
  const [selectedModel, setSelectedModel] = useState<VehicleModel | null>(selectedVehicle?.model ?? null)
  const [selectedYear, setSelectedYear] = useState<number | null>(selectedVehicle?.year ?? null)

  const [loadingModels, setLoadingModels] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    vehicleService.getMakes().then(setMakes)
    vehicleService.getYears().then(setYears)
  }, [])

  useEffect(() => {
    if (!selectedMake) { setModels([]); setSelectedModel(null); return }
    setLoadingModels(true)
    vehicleService.getModelsByMake(selectedMake.id).then(m => {
      setModels(m)
      setLoadingModels(false)
    })
  }, [selectedMake])

  const handleConfirm = () => {
    if (!selectedMake || !selectedModel || !selectedYear) return
    setSelectedVehicle({ make: selectedMake, model: selectedModel, year: selectedYear })
    setConfirmed(true)
    setTimeout(() => {
      setConfirmed(false)
      onSelect?.()
    }, 800)
  }

  const isReady = selectedMake && selectedModel && selectedYear

  const selectClass = compact
    ? 'border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white w-full'
    : 'border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white w-full font-medium'

  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {!compact && (
        <div className="flex items-center gap-2 text-brand-700 font-semibold">
          <Car size={20} />
          <span>Sélectionnez votre véhicule</span>
        </div>
      )}

      <div className={compact ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 md:grid-cols-3 gap-3'}>
        {/* Make */}
        <div className="relative">
          <select
            className={selectClass}
            value={selectedMake?.id ?? ''}
            onChange={e => {
              const make = makes.find(m => m.id === e.target.value) ?? null
              setSelectedMake(make)
              setSelectedModel(null)
              setSelectedYear(null)
            }}
          >
            <option value="">Marque</option>
            {makes.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Model */}
        <div className="relative">
          <select
            className={selectClass}
            value={selectedModel?.id ?? ''}
            disabled={!selectedMake || loadingModels}
            onChange={e => {
              const model = models.find(m => m.id === e.target.value) ?? null
              setSelectedModel(model)
            }}
          >
            <option value="">{loadingModels ? 'Chargement...' : 'Modèle'}</option>
            {models.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Year */}
        <div className="relative">
          <select
            className={selectClass}
            value={selectedYear ?? ''}
            disabled={!selectedModel}
            onChange={e => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Année</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={!isReady || confirmed}
        className={`${compact ? 'w-full py-2 text-sm' : 'px-8 py-3'} ${confirmed ? 'bg-green-500' : 'bg-brand-600 hover:bg-brand-700'} text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {confirmed ? (
          <>
            <CheckCircle size={18} />
            Véhicule enregistré !
          </>
        ) : (
          <>
            <Car size={18} />
            {compact ? 'Confirmer' : 'Trouver les pièces compatibles'}
          </>
        )}
      </button>
    </div>
  )
}
