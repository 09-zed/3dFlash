import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Proxy serverless — Recherche par plaque d'immatriculation FR
 *
 * Priorité des providers (définie par les variables d'environnement) :
 *   1. AUTO_WAYS_TOKEN   → app.auto-ways.net  (essai gratuit sur auto-ways.net)
 *   2. RAPIDAPI_KEY      → RapidAPI (plan gratuit sur rapidapi.com)
 *   3. PLATE_API_TOKEN   → apiplaqueimmatriculation.com (payant, 39€/mois)
 *   4. fallback mock     → données simulées côté frontend
 */

// ─── Format plaque ──────────────────────────────────────────────────────────

function toApiFormat(raw: string): string {
  const n = raw.toUpperCase().replace(/[\s\-.]/g, '')
  return /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(n)
    ? `${n.slice(0, 2)}-${n.slice(2, 5)}-${n.slice(5)}`
    : n
}

// ─── Provider : auto-ways.net ───────────────────────────────────────────────

async function fetchAutoWays(plate: string, token: string) {
  const url = new URL('https://app.auto-ways.net/api/v1/fr')
  url.searchParams.set('plaque', plate)
  url.searchParams.set('token', token)
  url.searchParams.set('country', 'fr')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })
  return { res, json: await res.json().catch(() => null) }
}

// ─── Provider : RapidAPI ────────────────────────────────────────────────────
// Inscription gratuite → rapidapi.com/api-plaque-immatriculation-siv
// Host RapidAPI : api-plaque-immatriculation-siv.p.rapidapi.com

async function fetchRapidAPI(plate: string, key: string) {
  const host = process.env.RAPIDAPI_HOST || 'api-plaque-immatriculation-siv.p.rapidapi.com'
  const url = new URL(`https://${host}/`)
  url.searchParams.set('immatriculation', plate)
  url.searchParams.set('pays', 'FR')

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'X-RapidAPI-Key': key,
      'X-RapidAPI-Host': host,
    },
  })
  return { res, json: await res.json().catch(() => null) }
}

// ─── Provider : apiplaqueimmatriculation.com ────────────────────────────────

async function fetchApiPlaque(plate: string, token: string) {
  const url = new URL('https://api.apiplaqueimmatriculation.com/plaque')
  url.searchParams.set('immatriculation', plate)
  url.searchParams.set('token', token)
  url.searchParams.set('pays', 'FR')

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { Accept: 'application/json' },
  })
  return { res, json: await res.json().catch(() => null) }
}

// ─── Handler principal ──────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const raw = (req.query.plate as string | undefined) ?? ''
  if (!raw) return res.status(400).json({ error: 'Paramètre "plate" manquant' })

  const plate = toApiFormat(raw)

  try {
    // ── 1. auto-ways.net ──────────────────────────────────────────────────
    if (process.env.AUTO_WAYS_TOKEN) {
      const { res: r, json } = await fetchAutoWays(plate, process.env.AUTO_WAYS_TOKEN)
      if (r.ok && json && !json.error) {
        // Normalise le format vers { data: {...} } attendu par le frontend
        const data = json.data ?? json
        return res.status(200).json({ data })
      }
    }

    // ── 2. RapidAPI ───────────────────────────────────────────────────────
    if (process.env.RAPIDAPI_KEY) {
      const { res: r, json } = await fetchRapidAPI(plate, process.env.RAPIDAPI_KEY)
      if (r.ok && json && !json.message?.toLowerCase().includes('error')) {
        const data = json.data ?? json
        return res.status(200).json({ data })
      }
    }

    // ── 3. apiplaqueimmatriculation.com ───────────────────────────────────
    if (process.env.PLATE_API_TOKEN) {
      const { res: r, json } = await fetchApiPlaque(plate, process.env.PLATE_API_TOKEN)
      if (r.ok && json) {
        return res.status(200).json(json)
      }
    }

    // ── Aucun provider configuré → fallback mock frontend ─────────────────
    return res.status(200).json({ fallback: true, plate })

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    return res.status(200).json({ fallback: true, error: msg, plate })
  }
}
