import { createHmac, timingSafeEqual } from 'node:crypto'

// API Moneroo : https://docs.moneroo.io — la même clé secrète sert en sandbox et en production
// (c'est la clé qui détermine l'environnement).
const API = () => useRuntimeConfig().monerooApiBase || 'https://api.moneroo.io/v1'

type MonerooPayment = {
  id: string
  status: 'success' | 'pending' | 'failed' | 'cancelled' | 'initiated' | string
  amount: number
  currency?: { code?: string }
  metadata?: Record<string, string>
  environment?: 'sandbox' | 'live'
}

function headers() {
  const key = useRuntimeConfig().monerooSecretKey
  if (!key) throw createError({ statusCode: 503, statusMessage: 'Paiement en cours de configuration' })
  return { Authorization: `Bearer ${key}`, Accept: 'application/json', 'Content-Type': 'application/json' }
}

export const monerooReady = () => !!useRuntimeConfig().monerooSecretKey

/** Montant envoyé à Moneroo, dans l'unité attendue par l'API. */
export const toApiAmount = (usd: number) => useRuntimeConfig().monerooMinorUnits ? Math.round(usd * 100) : Math.round(usd)

/** Crée le paiement (facturé en dollars US) et renvoie l'adresse de la page de paiement Moneroo. */
export async function initializePayment(p: {
  orderId: string, usd: number, name: string, email: string, phone?: string, returnUrl: string
}) {
  const [first, ...rest] = p.name.trim().split(/\s+/)
  const body: Record<string, unknown> = {
    amount: toApiAmount(p.usd),
    currency: 'USD',
    description: 'Ton Media Kit · accès complet',
    return_url: p.returnUrl,
    customer: {
      email: p.email,
      first_name: first || p.name,
      last_name: rest.join(' ') || first || p.name,
      ...(p.phone ? { phone: p.phone } : {})
    },
    metadata: { order_id: p.orderId }
  }
  const res = await $fetch<{ data: { id: string, checkout_url: string } }>(`${API()}/payments/initialize`, {
    method: 'POST', headers: headers(), body, timeout: 15000
  })
  return { paymentId: res.data.id, checkoutUrl: res.data.checkout_url }
}

/** Revérifie un paiement directement auprès de Moneroo. */
export async function verifyPayment(paymentId: string) {
  const res = await $fetch<{ data: MonerooPayment }>(`${API()}/payments/${encodeURIComponent(paymentId)}/verify`, {
    headers: headers(), retry: 1, timeout: 15000
  })
  return res.data
}

/**
 * Un paiement ouvre l'accès s'il est réussi, pour la bonne commande et au bon montant :
 * en dollars (montant facturé), ou en FCFA si Moneroo renvoie le montant converti.
 */
export function paymentMatches(p: MonerooPayment, order: Order) {
  if (p.status !== 'success') return false
  if (p.metadata?.order_id && p.metadata.order_id !== order.id) return false
  const code = (p.currency?.code || '').toUpperCase()
  const ok = (code === 'USD' && Number(p.amount) >= (order.chargeAmount ?? toApiAmount(order.amount)))
    || (code === 'XOF' && Number(p.amount) >= (order.amountFcfa ?? 0) && !!order.amountFcfa)
  if (!ok) console.warn('[moneroo] montant ou devise inattendus', { order: order.id, code, amount: p.amount })
  return ok
}

/** Signature des webhooks : HMAC-SHA256 du corps brut avec le secret, en hexadécimal. */
export function validSignature(raw: string, signature: string | undefined) {
  const secret = useRuntimeConfig().monerooWebhookSecret
  if (!secret || !signature) return false
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature.trim().toLowerCase())
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Paiement simulé autorisé : uniquement en développement et si demandé explicitement. */
export const fakePaymentAllowed = () => import.meta.dev && !!useRuntimeConfig().public.fakePayment
