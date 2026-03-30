/**
 * Service de recherche par plaque d'immatriculation française.
 * Utilise l'API gratuite api.apiplaques.fr (mock en dev).
 */

export interface PlateVehicleResult {
  plate: string
  make: string
  makeId: string
  model: string
  modelId: string
  year: number
  fuel: string
  engine: string
  bodyType: string
  color?: string
}

// Base de données déterministe pour la démo
// En production, remplacer par un appel réel à l'API SIV/UTAC
const VEHICLE_DATABASE: PlateVehicleResult[] = [
  { plate: '', make: 'Renault', makeId: 'renault', model: 'Clio V', modelId: 'clio5', year: 2021, fuel: 'Essence', engine: '1.0 TCe 100', bodyType: 'Berline' },
  { plate: '', make: 'Peugeot', makeId: 'peugeot', model: '208 (2019+)', modelId: '208-2', year: 2020, fuel: 'Essence', engine: '1.2 PureTech 100', bodyType: 'Berline' },
  { plate: '', make: 'Citroën', makeId: 'citroen', model: 'C3 III', modelId: 'c3-3', year: 2019, fuel: 'Diesel', engine: '1.5 BlueHDi 100', bodyType: 'Berline' },
  { plate: '', make: 'Volkswagen', makeId: 'volkswagen', model: 'Golf VIII', modelId: 'golf8', year: 2022, fuel: 'Essence', engine: '1.5 TSI 130', bodyType: 'Berline' },
  { plate: '', make: 'Toyota', makeId: 'toyota', model: 'Yaris IV', modelId: 'yaris4', year: 2021, fuel: 'Hybride', engine: '1.5 Hybrid 116', bodyType: 'Berline' },
  { plate: '', make: 'BMW', makeId: 'bmw', model: 'Série 3 (G20)', modelId: 'serie3g20', year: 2020, fuel: 'Diesel', engine: '2.0d 190', bodyType: 'Berline' },
  { plate: '', make: 'Mercedes-Benz', makeId: 'mercedes', model: 'Classe A (W177)', modelId: 'classa177', year: 2019, fuel: 'Essence', engine: '1.3 AMG Line 163', bodyType: 'Berline' },
  { plate: '', make: 'Ford', makeId: 'ford', model: 'Focus IV', modelId: 'focus4', year: 2018, fuel: 'Essence', engine: '1.0 EcoBoost 125', bodyType: 'Berline' },
  { plate: '', make: 'Opel', makeId: 'opel', model: 'Corsa F', modelId: 'corsa5', year: 2020, fuel: 'Diesel', engine: '1.5 CDTI 100', bodyType: 'Berline' },
  { plate: '', make: 'Audi', makeId: 'audi', model: 'A3 (8Y)', modelId: 'a3-8y', year: 2021, fuel: 'Essence', engine: '1.5 TFSI 150', bodyType: 'Berline' },
  { plate: '', make: 'Renault', makeId: 'renault', model: 'Mégane IV', modelId: 'megane4', year: 2018, fuel: 'Diesel', engine: '1.5 dCi 115', bodyType: 'Berline' },
  { plate: '', make: 'Peugeot', makeId: 'peugeot', model: '308 (2021+)', modelId: '308-2', year: 2022, fuel: 'Essence', engine: '1.2 PureTech 130', bodyType: 'Berline' },
  { plate: '', make: 'Citroën', makeId: 'citroen', model: 'C5 Aircross', modelId: 'c5air', year: 2019, fuel: 'Diesel', engine: '2.0 BlueHDi 180', bodyType: 'SUV' },
  { plate: '', make: 'Renault', makeId: 'renault', model: 'Captur', modelId: 'captur', year: 2020, fuel: 'Essence', engine: '1.3 TCe 130', bodyType: 'SUV' },
  { plate: '', make: 'Volkswagen', makeId: 'volkswagen', model: 'Tiguan', modelId: 'tiguan', year: 2019, fuel: 'Diesel', engine: '2.0 TDI 150', bodyType: 'SUV' },
  { plate: '', make: 'Fiat', makeId: 'fiat', model: '500 III', modelId: '500-3', year: 2021, fuel: 'Électrique', engine: 'Moteur 118 ch', bodyType: 'Citadine' },
  { plate: '', make: 'SEAT', makeId: 'seat', model: 'León IV', modelId: 'leon4', year: 2020, fuel: 'Essence', engine: '1.5 TSI 150', bodyType: 'Berline' },
  { plate: '', make: 'Toyota', makeId: 'toyota', model: 'RAV4 V', modelId: 'rav4', year: 2019, fuel: 'Hybride', engine: '2.5 Hybrid 222', bodyType: 'SUV' },
  { plate: '', make: 'Renault', makeId: 'renault', model: 'Duster', modelId: 'duster', year: 2018, fuel: 'Diesel', engine: '1.5 dCi 115 4x4', bodyType: 'SUV' },
  { plate: '', make: 'Peugeot', makeId: 'peugeot', model: '3008', modelId: '3008', year: 2020, fuel: 'Hybride', engine: '1.6 Hybrid4 300', bodyType: 'SUV' },
]

/** Normalise une plaque FR : retire espaces/tirets, met en majuscule */
export function normalizePlate(raw: string): string {
  return raw.toUpperCase().replace(/[\s\-\.]/g, '')
}

/** Valide le format plaque SIV (AB-123-CD) ou ancien format (123-AB-75) */
export function validatePlate(raw: string): boolean {
  const plate = normalizePlate(raw)
  // Nouveau format : 2 lettres + 3 chiffres + 2 lettres (ex: AB123CD)
  const newFormat = /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(plate)
  // Ancien format : 1-4 chiffres + 2-3 lettres + 2 chiffres (ex: 1234AB75)
  const oldFormat = /^\d{1,4}[A-Z]{2,3}\d{2}$/.test(plate)
  return newFormat || oldFormat
}

/** Formate une plaque pour affichage : AB123CD → AB-123-CD */
export function formatPlate(raw: string): string {
  const plate = normalizePlate(raw)
  const newFormat = /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(plate)
  if (newFormat) {
    return `${plate.slice(0, 2)}-${plate.slice(2, 5)}-${plate.slice(5)}`
  }
  return plate
}

/** Hash déterministe d'une chaîne → nombre */
function strHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * Recherche un véhicule par plaque d'immatriculation.
 * Simule un appel API avec délai réaliste.
 */
export async function lookupPlate(rawPlate: string): Promise<PlateVehicleResult> {
  const plate = normalizePlate(rawPlate)

  if (!validatePlate(rawPlate)) {
    throw new Error('Format de plaque invalide. Exemple : AB-123-CD')
  }

  // Simule un appel réseau (800ms-1.5s)
  await new Promise(r => setTimeout(r, 800 + Math.random() * 700))

  // Sélection déterministe basée sur le hash de la plaque
  const idx = strHash(plate) % VEHICLE_DATABASE.length
  const result = { ...VEHICLE_DATABASE[idx], plate: formatPlate(rawPlate) }
  return result
}
