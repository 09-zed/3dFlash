/**
 * Service de recherche par plaque d'immatriculation française.
 * Appelle /api/plate (fonction serverless Vercel).
 *
 * Si aucune API n'est configurée côté serveur, on lève une erreur
 * que le frontend intercepte pour proposer la saisie manuelle.
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

// ─── Validation / normalisation ────────────────────────────────────────────

export function normalizePlate(raw: string): string {
  return raw.toUpperCase().replace(/[\s\-\.]/g, '')
}

export function validatePlate(raw: string): boolean {
  const p = normalizePlate(raw)
  const newFmt = /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(p)   // AB-123-CD (SIV depuis 2009)
  const oldFmt = /^\d{1,4}[A-Z]{2,3}\d{2}$/.test(p)   // 1234AB75  (ancienne)
  return newFmt || oldFmt
}

export function formatPlate(raw: string): string {
  const p = normalizePlate(raw)
  if (/^[A-Z]{2}\d{3}[A-Z]{2}$/.test(p)) {
    return `${p.slice(0, 2)}-${p.slice(2, 5)}-${p.slice(5)}`
  }
  return p
}

// ─── Mapping marque → makeId ───────────────────────────────────────────────

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

// ─── Mapping modèle → modelId ──────────────────────────────────────────────

const MODEL_MAP: Array<{ keywords: string[]; makeId: string; modelId: string }> = [
  { keywords: ['CLIO IV', 'CLIO 4'],                               makeId: 'renault',    modelId: 'clio4' },
  { keywords: ['CLIO V', 'CLIO 5', 'CLIO'],                       makeId: 'renault',    modelId: 'clio5' },
  { keywords: ['MEGANE III', 'MEGANE 3', 'MÉGANE III', 'MÉGANE 3'], makeId: 'renault', modelId: 'megane3' },
  { keywords: ['MEGANE IV', 'MEGANE 4', 'MÉGANE IV', 'MÉGANE 4', 'MEGANE', 'MÉGANE'], makeId: 'renault', modelId: 'megane4' },
  { keywords: ['SCENIC', 'SCÉNIC'],                                makeId: 'renault',    modelId: 'scenic3' },
  { keywords: ['CAPTUR'],                                          makeId: 'renault',    modelId: 'captur' },
  { keywords: ['KADJAR'],                                          makeId: 'renault',    modelId: 'kadjar' },
  { keywords: ['DUSTER'],                                          makeId: 'renault',    modelId: 'duster' },
  { keywords: ['208'],                                             makeId: 'peugeot',    modelId: '208-2' },
  { keywords: ['308'],                                             makeId: 'peugeot',    modelId: '308-1' },
  { keywords: ['3008'],                                            makeId: 'peugeot',    modelId: '3008' },
  { keywords: ['5008'],                                            makeId: 'peugeot',    modelId: '5008' },
  { keywords: ['2008'],                                            makeId: 'peugeot',    modelId: '2008' },
  { keywords: ['C3'],                                              makeId: 'citroen',    modelId: 'c3-3' },
  { keywords: ['C4'],                                              makeId: 'citroen',    modelId: 'c4-2' },
  { keywords: ['C5 AIRCROSS', 'C5AIRCROSS'],                       makeId: 'citroen',    modelId: 'c5air' },
  { keywords: ['BERLINGO'],                                        makeId: 'citroen',    modelId: 'berlingo' },
  { keywords: ['GOLF VIII', 'GOLF 8'],                             makeId: 'volkswagen', modelId: 'golf8' },
  { keywords: ['GOLF VII', 'GOLF 7', 'GOLF'],                      makeId: 'volkswagen', modelId: 'golf7' },
  { keywords: ['POLO'],                                            makeId: 'volkswagen', modelId: 'polo6' },
  { keywords: ['PASSAT'],                                          makeId: 'volkswagen', modelId: 'passat' },
  { keywords: ['TIGUAN'],                                          makeId: 'volkswagen', modelId: 'tiguan' },
  { keywords: ['TOUAREG'],                                         makeId: 'volkswagen', modelId: 'touareg' },
  { keywords: ['YARIS IV', 'YARIS 4'],                             makeId: 'toyota',     modelId: 'yaris4' },
  { keywords: ['YARIS'],                                           makeId: 'toyota',     modelId: 'yaris3' },
  { keywords: ['COROLLA'],                                         makeId: 'toyota',     modelId: 'corolla' },
  { keywords: ['RAV4', 'RAV-4'],                                   makeId: 'toyota',     modelId: 'rav4' },
  { keywords: ['SERIE 1', 'SÉRIE 1', 'SERIES 1'],                  makeId: 'bmw',        modelId: 'serie1f40' },
  { keywords: ['SERIE 3', 'SÉRIE 3', 'SERIES 3'],                  makeId: 'bmw',        modelId: 'serie3g20' },
  { keywords: ['SERIE 5', 'SÉRIE 5', 'SERIES 5'],                  makeId: 'bmw',        modelId: 'serie5g30' },
  { keywords: ['X1'],                                              makeId: 'bmw',        modelId: 'x1f48' },
  { keywords: ['CLASSE A', 'CLASS A', 'KLASSE A'],                 makeId: 'mercedes',   modelId: 'classa177' },
  { keywords: ['CLASSE C', 'CLASS C', 'KLASSE C'],                 makeId: 'mercedes',   modelId: 'classc205' },
  { keywords: ['CLASSE E', 'CLASS E', 'KLASSE E'],                 makeId: 'mercedes',   modelId: 'classe206' },
  { keywords: ['FIESTA'],                                          makeId: 'ford',       modelId: 'fiesta7' },
  { keywords: ['FOCUS'],                                           makeId: 'ford',       modelId: 'focus4' },
  { keywords: ['KUGA'],                                            makeId: 'ford',       modelId: 'kuga3' },
  { keywords: ['CORSA'],                                           makeId: 'opel',       modelId: 'corsa5' },
  { keywords: ['ASTRA'],                                           makeId: 'opel',       modelId: 'astra6' },
  { keywords: ['MOKKA'],                                           makeId: 'opel',       modelId: 'mokka2' },
  { keywords: ['A3'],                                              makeId: 'audi',       modelId: 'a3-8y' },
  { keywords: ['A4'],                                              makeId: 'audi',       modelId: 'a4-b9' },
  { keywords: ['Q3'],                                              makeId: 'audi',       modelId: 'q3-f3' },
  { keywords: ['PANDA'],                                           makeId: 'fiat',       modelId: 'panda4' },
  { keywords: ['500'],                                             makeId: 'fiat',       modelId: '500-3' },
  { keywords: ['IBIZA'],                                           makeId: 'seat',       modelId: 'ibiza5' },
  { keywords: ['LEON', 'LÉON'],                                    makeId: 'seat',       modelId: 'leon4' },
]

function findMakeId(marque: string): string {
  const key = marque.toUpperCase().trim()
  return MAKE_MAP[key] ?? key.toLowerCase().replace(/[^a-z]/g, '')
}

function findModelId(modele: string, makeId: string): string {
  const upper = modele.toUpperCase().trim()
  const candidates = MODEL_MAP.filter(m => m.makeId === makeId)
  for (const entry of candidates) {
    if (entry.keywords.some(kw => upper.includes(kw))) return entry.modelId
  }
  return candidates[0]?.modelId ?? makeId
}

// ─── Parsing carburant ─────────────────────────────────────────────────────

function parseFuel(energie: string): string {
  const map: Record<string, string> = {
    DIESEL: 'Diesel', ESSENCE: 'Essence', ES: 'Essence', GO: 'Diesel',
    ELECTRIQUE: 'Électrique', EL: 'Électrique',
    HYBRIDE: 'Hybride', HY: 'Hybride', 'HYBRIDE ELECTRIQUE': 'Hybride',
    GNV: 'Gaz naturel', GPL: 'GPL', GP: 'GPL', H2: 'Hydrogène',
  }
  const key = (energie ?? '').toUpperCase().trim()
  return map[key] ?? energie ?? 'N/C'
}

// ─── Parsing d'une réponse API réelle ──────────────────────────────────────

function parseApiResponse(d: Record<string, string>, rawPlate: string): PlateVehicleResult {
  const marque = (d.marque ?? d.Marque ?? '').toUpperCase()
  const modele = d.modele ?? d.Modele ?? d.model ?? ''
  const makeId = findMakeId(marque)
  const modelId = findModelId(modele, makeId)

  let year = new Date().getFullYear()
  const dateStr = d.date1erCir_us ?? d.date1erCir ?? d.dateMEC ?? ''
  if (dateStr) {
    const y = parseInt(dateStr.slice(0, 4), 10)
    if (!isNaN(y) && y > 1970) year = y
  } else if (d.date1erCir_fr) {
    const parts = d.date1erCir_fr.split('-')
    if (parts.length === 3) {
      const y = parseInt(parts[2], 10)
      if (!isNaN(y)) year = y
    }
  }

  const fuel = parseFuel(d.energieNGC ?? d.energie ?? d.Energie ?? '')
  const power = d.puisFiscReelCH ? `${d.puisFiscReelCH} ch` : d.puisFisc ? `${d.puisFisc} CV` : ''
  const engine = [power, d.cylindree ? `${d.cylindree} cm³` : ''].filter(Boolean).join(' · ') || fuel

  const bodyMap: Record<string, string> = { VP: 'Voiture', CAM: 'Camionnette', VU: 'Utilitaire', MOTO: 'Moto' }
  const bodyType = bodyMap[d.genreVCGNGC ?? ''] ?? d.carrosserieCG ?? 'Voiture'

  const cap = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s

  return {
    plate: formatPlate(rawPlate),
    make: cap(marque) || 'Inconnue',
    makeId,
    model: cap(modele) || 'Inconnu',
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

  let json: {
    data?: Record<string, string>
    error?: string
    fallback?: boolean
    message?: string
  } | null = null

  try {
    const res = await fetch(`/api/plate?plate=${encodeURIComponent(normalized)}`, {
      method: 'POST',
    })

    json = await res.json().catch(() => null)

    // Fallback explicite → aucune API configurée → lève erreur propre
    if (json?.fallback) {
      throw new Error(
        'Identification automatique non disponible.\nUtilisez la saisie manuelle pour sélectionner votre véhicule.'
      )
    }

    // Succès avec données réelles
    if (res.ok && json?.data && !json.data.erreur) {
      return parseApiResponse(json.data, rawPlate)
    }

    // Erreur dans les données API (plaque inconnue, etc.)
    const errMsg = json?.data?.erreur ?? json?.error
    if (errMsg) throw new Error(errMsg)

  } catch (err) {
    // Erreur réseau (ex: dev local sans /api/)
    if (err instanceof TypeError && err.message.includes('fetch')) {
      throw new Error(
        'Identification automatique non disponible.\nUtilisez la saisie manuelle pour sélectionner votre véhicule.'
      )
    }
    throw err
  }

  // Si on est ici → réponse inattendue
  throw new Error(
    'Identification impossible pour cette plaque.\nUtilisez la saisie manuelle.'
  )
}
