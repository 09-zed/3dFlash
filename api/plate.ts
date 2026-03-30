import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Proxy serverless Vercel — Recherche par plaque d'immatriculation FR
 * Source : apiplaqueimmatriculation.com
 *
 * Env : PLATE_API_TOKEN  (optionnel — utilise le token démo sinon)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const raw = (req.query.plate as string | undefined)?.toUpperCase().replace(/[\s\-.]/g, '') ?? ''

  if (!raw) {
    return res.status(400).json({ error: 'Paramètre "plate" manquant' })
  }

  // L'API attend le format avec tirets : AB-123-CD
  const formatted = /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(raw)
    ? `${raw.slice(0, 2)}-${raw.slice(2, 5)}-${raw.slice(5)}`
    : raw

  const token = process.env.PLATE_API_TOKEN || 'TokenDemo2026B'

  try {
    const url = new URL('https://api.apiplaqueimmatriculation.com/plaque')
    url.searchParams.set('immatriculation', formatted)
    url.searchParams.set('token', token)
    url.searchParams.set('pays', 'FR')

    const upstream = await fetch(url.toString(), {
      method: 'POST',
      headers: { Accept: 'application/json' },
    })

    // Si l'API répond, on retourne la réponse même si c'est une erreur
    // (le frontend gère le fallback mock dans ce cas)
    const json = await upstream.json().catch(() => null)

    if (!upstream.ok || !json) {
      return res.status(upstream.status).json({
        error: `Erreur API: ${upstream.status}`,
        fallback: true,
        plate: formatted,
      })
    }

    return res.status(200).json(json)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    return res.status(502).json({ error: msg, fallback: true, plate: formatted })
  }
}
