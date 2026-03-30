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

  const plate = (req.query.plate as string | undefined)?.toUpperCase().replace(/[\s\-.]/g, '')

  if (!plate) {
    return res.status(400).json({ error: 'Paramètre "plate" manquant' })
  }

  const token = process.env.PLATE_API_TOKEN || 'TokenDemo2026B'

  try {
    const url = new URL('https://api.apiplaqueimmatriculation.com/plaque')
    url.searchParams.set('immatriculation', plate)
    url.searchParams.set('token', token)
    url.searchParams.set('pays', 'FR')

    const upstream = await fetch(url.toString(), {
      method: 'POST',
      headers: { Accept: 'application/json' },
    })

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Erreur API: ${upstream.status}` })
    }

    const json = await upstream.json()
    return res.status(200).json(json)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue'
    return res.status(502).json({ error: msg })
  }
}
