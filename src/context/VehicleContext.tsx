import { createContext, useContext, useState, type ReactNode } from 'react'
import type { SelectedVehicle } from '../types'

interface VehicleContextValue {
  selectedVehicle: SelectedVehicle | null
  setSelectedVehicle: (vehicle: SelectedVehicle | null) => void
  clearVehicle: () => void
}

const VehicleContext = createContext<VehicleContextValue | null>(null)

const STORAGE_KEY = 'aps_selected_vehicle'

function loadStoredVehicle(): SelectedVehicle | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [selectedVehicle, setSelectedVehicleState] = useState<SelectedVehicle | null>(
    loadStoredVehicle
  )

  const setSelectedVehicle = (vehicle: SelectedVehicle | null) => {
    setSelectedVehicleState(vehicle)
    if (vehicle) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicle))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <VehicleContext.Provider
      value={{
        selectedVehicle,
        setSelectedVehicle,
        clearVehicle: () => setSelectedVehicle(null),
      }}
    >
      {children}
    </VehicleContext.Provider>
  )
}

export function useVehicle() {
  const ctx = useContext(VehicleContext)
  if (!ctx) throw new Error('useVehicle must be used within VehicleProvider')
  return ctx
}
