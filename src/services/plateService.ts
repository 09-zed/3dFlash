/**
 * Service de recherche par plaque d'immatriculation française.
 * Appelle /api/plate (fonction serverless Vercel) → apiplaqueimmatriculation.com
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
  co2?: string
  power?: string
}

// ─── Normalisation / validation ────────────────────────────────────────────

export function normalizePlate(raw: string): string {
  return raw.toUpperCase().replace(/[\s\-\.]/g, '')
}

export function validatePlate(raw: string): boolean {
  const p = normalizePlate(raw)
  const newFmt = /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(p)      // AB-123-CD
  const oldFmt = /^\d{1,4}[A-Z]{2,3}\d{2}$/.test(p)      // 1234AB75
  return newFmt || oldFmt
}

export function formatPlate(raw: string): string {
  const p = normalizePlate(raw)
  if (/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(p)) {
    return `${p.slice(0, 2)}-${p.slice(2, 5)}-${p.slice(5)}`
  }
  return p
}

// ─── Mapping marque API → makeId interne ───────────────────────────────────

const MAKE_MAP: Record<string, string> = {
  RENAULT: 'renault',
  PEUGEOT: 'peugeot',
  'CITROËN': 'citroen',
  CITROEN: 'citroen',
  VOLKSWAGEN: 'volkswagen',
  VW: 'volkswagen',
  TOYOTA: 'toyota',
  BMW: 'bmw',
  MERCEDES: 'mercedes',
  'MERCEDES-BENZ': 'mercedes',
  FORD: 'ford',
  OPEL: 'opel',
  AUDI: 'audi',
  FIAT: 'fiat',
  SEAT: 'seat',
  SKODA: 'volkswagen',
  NISSAN: 'renault',
  DACIA: 'renault',
}

// ─── Mapping modèle API → modelId interne (correspondance partielle) ────────

const MODEL_MAP: Array<{ keywords: string[]; makeId: string; modelId: string }> = [
  { keywords: ['CLIO IV', 'CLIO 4'], makeId: 'renault', modelId: 'clio4' },
  { keywords: ['CLIO V', 'CLIO 5', 'CLIO'], makeId: 'renault', modelId: 'clio5' },
  { keywords: ['MEGANE III', 'MEGANE 3', 'MÉGANE III', 'MÉGANE 3'], makeId: 'renault', modelId: 'megane3' },
  { keywords: ['MEGANE IV', 'MEGANE 4', 'MÉGANE IV', 'MÉGANE 4', 'MEGANE', 'MÉGANE'], makeId: 'renault', modelId: 'megane4' },
  { keywords: ['SCENIC', 'SCÉNIC'], makeId: 'renault', modelId: 'scenic3' },
  { keywords: ['CAPTUR'], makeId: 'renault', modelId: 'captur' },
  { keywords: ['KADJAR'], makeId: 'renault', modelId: 'kadjar' },
  { keywords: ['DUSTER'], makeId: 'renault', modelId: 'duster' },
  { keywords: ['208'], makeId: 'peugeot', modelId: '208-2' },
  { keywords: ['308'], makeId: 'peugeot', modelId: '308-1' },
  { keywords: ['3008'], makeId: 'peugeot', modelId: '3008' },
  { keywords: ['5008'], makeId: 'peugeot', modelId: '5008' },
  { keywords: ['2008'], makeId: 'peugeot', modelId: '2008' },
  { keywords: ['C3'], makeId: 'citroen', modelId: 'c3-3' },
  { keywords: ['C4'], makeId: 'citroen', modelId: 'c4-2' },
  { keywords: ['C5 AIRCROSS', 'C5AIRCROSS'], makeId: 'citroen', modelId: 'c5air' },
  { keywords: ['BERLINGO'], makeId: 'citroen', modelId: 'berlingo' },
  { keywords: ['GOLF VIII', 'GOLF 8'], makeId: 'volkswagen', modelId: 'golf8' },
  { keywords: ['GOLF VII', 'GOLF 7', 'GOLF'], makeId: 'volkswagen', modelId: 'golf7' },
  { keywords: ['POLO'], makeId: 'volkswagen', modelId: 'polo6' },
  { keywords: ['PASSAT'], makeId: 'volkswagen', modelId: 'passat' },
  { keywords: ['TIGUAN'], makeId: 'volkswagen', modelId: 'tiguan' },
  { keywords: ['TOUAREG'], makeId: 'volkswagen', modelId: 'touareg' },
  { keywords: ['YARIS IV', 'YARIS 4'], makeId: 'toyota', modelId: 'yaris4' },
  { keywords: ['YARIS'], makeId: 'toyota', modelId: 'yaris3' },
  { keywords: ['COROLLA'], makeId: 'toyota', modelId: 'corolla' },
  { keywords: ['RAV4', 'RAV-4'], makeId: 'toyota', modelId: 'rav4' },
  { keywords: ['SERIE 1', 'SÉRIE 1', 'SERIES 1'], makeId: 'bmw', modelId: 'serie1f40' },
  { keywords: ['SERIE 3', 'SÉRIE 3', 'SERIES 3'], makeId: 'bmw', modelId: 'serie3g20' },
  { keywords: ['SERIE 5', 'SÉRIE 5', 'SERIES 5'], makeId: 'bmw', modelId: 'serie5g30' },
  { keywords: ['X1'], makeId: 'bmw', modelId: 'x1f48' },
  { keywords: ['CLASSE A', 'CLASS A', 'KLASSE A'], makeId: 'mercedes', modelId: 'classa177' },
  { keywords: ['CLASSE C', 'CLASS C', 'KLASSE C'], makeId: 'mercedes', modelId: 'classc205' },
  { keywords: ['CLASSE E', 'CLASS E', 'KLASSE E'], makeId: 'mercedes', modelId: 'classe206' },
  { keywords: ['FIESTA'], makeId: 'ford', modelId: 'fiesta7' },
  { keywords: ['FOCUS'], makeId: 'ford', modelId: 'focus4' },
  { keywords: ['KUGA'], makeId: 'ford', modelId: 'kuga3' },
  { keywords: ['CORSA'], makeId: 'opel', modelId: 'corsa5' },
  { keywords: ['ASTRA'], makeId: 'opel', modelId: 'astra6' },
  { keywords: ['MOKKA'], makeId: 'opel', modelId: 'mokka2' },
  { keywords: ['A3'], makeId: 'audi', modelId: 'a3-8y' },
  { keywords: ['A4'], makeId: 'audi', modelId: 'a4-b9' },
  { keywords: ['Q3'], makeId: 'audi', modelId: 'q3-f3' },
  { keywords: ['PANDA'], makeId: 'fiat', modelId: 'panda4' },
  { keywords: ['500'], makeId: 'fiat', modelId: '500-3' },
  { keywords: ['IBIZA'], makeId: 'seat', modelId: 'ibiza5' },
  { keywords: ['LEON', 'LÉON'], makeId: 'seat', modelId: 'leon4' },
]

function findMakeId(marque: string): string {
  const key = marque.toUpperCase().trim()
  return MAKE_MAP[key] ?? key.toLowerCase().replace(/[^a-z]/g, '')
}

function findModelId(modele: string, makeId: string): string {
  const upper = modele.toUpperCase().trim()
  const candidates = MODEL_MAP.filter(m => m.makeId === makeId)
  for (const entry of candidates) {
    if (entry.keywords.some(kw => upper.includes(kw))) {
      return entry.modelId
    }
  }
  // fallback: premier modèle de la marque
  return candidates[0]?.modelId ?? makeId
}

// ─── Mapping carburant API → libellé lisible ────────────────────────────────

function parseFuel(energie: string): string {
  const map: Record<string, string> = {
    DIESEL: 'Diesel',
    ESSENCE: 'Essence',
    ES: 'Essence',
    GO: 'Diesel',
    ELECTRIQUE: 'Électrique',
    EL: 'Électrique',
    HYBRIDE: 'Hybride',
    HY: 'Hybride',
    'HYBRIDE ELECTRIQUE': 'Hybride',
    GNV: 'Gaz naturel',
    GPL: 'GPL',
    GP: 'GPL',
    H2: 'Hydrogène',
  }
  const key = (energie ?? '').toUpperCase().trim()
  return map[key] ?? energie ?? 'N/C'
}

// ─── Fallback mock (quand l'API réelle est indisponible / token démo limité) ──

const MOCK_VEHICLES: Omit<PlateVehicleResult, 'plate'>[] = [
  { make: 'Renault',        makeId: 'renault',    model: 'Clio V',          modelId: 'clio5',      year: 2021, fuel: 'Essence',    engine: '1.0 TCe 100',         bodyType: 'Voiture particulière' },
  { make: 'Peugeot',        makeId: 'peugeot',    model: '208',             modelId: '208-2',      year: 2020, fuel: 'Essence',    engine: '1.2 PureTech 100',    bodyType: 'Voiture particulière' },
  { make: 'Citroën',        makeId: 'citroen',    model: 'C3 III',          modelId: 'c3-3',       year: 2019, fuel: 'Diesel',     engine: '1.5 BlueHDi 100',     bodyType: 'Voiture particulière' },
  { make: 'Volkswagen',     makeId: 'volkswagen', model: 'Golf VIII',       modelId: 'golf8',      year: 2022, fuel: 'Essence',    engine: '1.5 TSI 130',         bodyType: 'Voiture particulière' },
  { make: 'Toyota',         makeId: 'toyota',     model: 'Yaris IV',        modelId: 'yaris4',     year: 2021, fuel: 'Hybride',    engine: '1.5 Hybrid 116 ch',   bodyType: 'Voiture particulière' },
  { make: 'BMW',            makeId: 'bmw',        model: 'Série 3',         modelId: 'serie3g20',  year: 2020, fuel: 'Diesel',     engine: '2.0d 190 ch',         bodyType: 'Voiture particulière' },
  { make: 'Mercedes-Benz',  makeId: 'mercedes',   model: 'Classe A',        modelId: 'classa177',  year: 2019, fuel: 'Essence',    engine: '1.3 AMG Line 163 ch', bodyType: 'Voiture particulière' },
  { make: 'Ford',           makeId: 'ford',       model: 'Focus IV',        modelId: 'focus4',     year: 2018, fuel: 'Essence',    engine: '1.0 EcoBoost 125 ch', bodyType: 'Voiture particulière' },
  { make: 'Audi',           makeId: 'audi',       model: 'A3',              modelId: 'a3-8y',      year: 2021, fuel: 'Essence',    engine: '1.5 TFSI 150 ch',     bodyType: 'Voiture particulière' },
  { make: 'Renault',        makeId: 'renault',    model: 'Captur',          modelId: 'captur',     year: 2020, fuel: 'Essence',    engine: '1.3 TCe 130 ch',      bodyType: 'SUV' },
  { make: 'Peugeot',        makeId: 'peugeot',    model: '3008',            modelId: '3008',       year: 2021, fuel: 'Hybride',    engine: '1.6 Hybrid 225 ch',   bodyType: 'SUV' },
  { make: 'Fiat',           makeId: 'fiat',       model: '500',             modelId: '500-3',      year: 2021, fuel: 'Électrique', engine: 'Moteur électrique 118 ch', bodyType: 'Citadine' },
]

function strHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function mockLookup(rawPlate: string): PlateVehicleResult {
  const normalized = normalizePlate(rawPlate)
  const vehicle = MOCK_VEHICLES[strHash(normalized) % MOCK_VEHICLES.length]
  return { ...vehicle, plate: formatPlate(rawPlate) }
}

// ─── Parsing d'une réponse API réelle ──────────────────────────────────────

function parseApiResponse(d: Record<string, string>, rawPlate: string): PlateVehicleResult {
  const marque = (d.marque ?? '').toUpperCase()
  const modele = d.modele ?? ''
  const makeId = findMakeId(marque)
  const modelId = findModelId(modele, makeId)

  let year = new Date().getFullYear()
  if (d.date1erCir_us) {
    const y = parseInt(d.date1erCir_us.slice(0, 4), 10)
    if (!isNaN(y)) year = y
  } else if (d.date1erCir_fr) {
    const parts = d.date1erCir_fr.split('-')
    if (parts.length === 3) {
      const y = parseInt(parts[2], 10)
      if (!isNaN(y)) year = y
    }
  }

  const fuel = parseFuel(d.energieNGC ?? d.energie ?? '')
  const power = d.puisFiscReelCH ? `${d.puisFiscReelCH} ch` : d.puisFisc ? `${d.puisFisc} CV` : ''
  const engine = [power, d.cylindree ? `${d.cylindree} cm³` : ''].filter(Boolean).join(' · ') || fuel

  const bodyMap: Record<string, string> = { VP: 'Voiture particulière', CAM: 'Camionnette', VU: 'Véhicule utilitaire', MOTO: 'Moto' }
  const bodyType = bodyMap[d.genreVCGNGC ?? ''] ?? d.carrosserieCG ?? 'Voiture'

  return {
    plate: formatPlate(rawPlate),
    make: marque.charAt(0) + marque.slice(1).toLowerCase(),
    makeId,
    model: modele.charAt(0).toUpperCase() + modele.slice(1).toLowerCase(),
    modelId,
    year,
    fuel,
    engine,
    bodyType,
    co2: d.co2 ? `${d.co2} g/km` : undefined,
    power,
  }
}

// ─── Lookup principal ──────────────────────────────────────────────────────

export async function lookupPlate(rawPlate: string): Promise<PlateVehicleResult> {
  if (!validatePlate(rawPlate)) {
    throw new Error('Format de plaque invalide. Exemple : AB-123-CD')
  }

  const normalized = normalizePlate(rawPlate)

  try {
    const res = await fetch(`/api/plate?plate=${encodeURIComponent(normalized)}`, {
      method: 'POST',
    })

    const json = await res.json().catch(() => null) as {
      data?: Record<string, string>
      error?: string
      fallback?: boolean
    } | null

    // Succès API réelle
    if (res.ok && json?.data && !json.data.erreur) {
      return parseApiResponse(json.data, rawPlate)
    }

    // L'API demande un token payant ou a échoué → fallback mock
    if (json?.fallback || !res.ok) {
      return mockLookup(rawPlate)
    }

    // Erreur dans les données (ex: plaque inconnue)
    const errMsg = json?.data?.erreur || json?.error
    if (errMsg) throw new Error(errMsg)

  } catch (err) {
    // Si c'est une erreur réseau (ex: dev local sans /api/), on fallback
    if (err instanceof TypeError && err.message.includes('fetch')) {
      return mockLookup(rawPlate)
    }
    throw err
  }

  // Dernier recours
  return mockLookup(rawPlate)
}
