import { makes, models, years } from '../data/vehicles'
import type { VehicleMake, VehicleModel } from '../types'

/**
 * VehicleService — abstraction layer over vehicle data.
 * Replace mock implementations with real API calls when backend is ready.
 */
export const vehicleService = {
  async getMakes(): Promise<VehicleMake[]> {
    // TODO: replace with: return api.get('/vehicles/makes')
    return Promise.resolve([...makes].sort((a, b) => a.name.localeCompare(b.name)))
  },

  async getModelsByMake(makeId: string): Promise<VehicleModel[]> {
    // TODO: replace with: return api.get(`/vehicles/makes/${makeId}/models`)
    return Promise.resolve(models.filter(m => m.makeId === makeId))
  },

  async getYears(): Promise<number[]> {
    // TODO: replace with: return api.get('/vehicles/years')
    return Promise.resolve(years)
  },
}
