import { createHmac, timingSafeEqual } from 'node:crypto'
import type { Order } from './db'

// API SasPay : https://docs.saspay.me — clé sk_test_… pour tester, sk_live_… en production.
const API = () => (useRuntimeConfig().saspayApiBase || 'https://api.saspay.me/api/v1').replace(/\/$/, '')

type Session = {
  id: string
  status?: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED' | string
  amount?: string
  currency?: string
  metadata?: Record<string, unknown>
  checkout_url?: string
}
type SessionStatus = { id: string, status?: string, transaction_id?: string | null, transaction_status?: string | null }

function headers() {
  const key = useRuntimeConfig().saspaySecretKey
  if (!key) throw createError({ statusCode: 503, statusMessage: 'Paiement en cours de configuration' })
  return { Authorization: `Bearer ${key}`, Accept: 'application/json', 'Content-Type': 'application/json' }
}

// toutes les réponses SasPay sont enveloppées : { success, data, code }
const unwrap = <T>(r: any): T => (r && typeof r === 'object' && 'data' in r ? r.data : r) as T

/** Crée une session de paiement hébergée et renvoie son adresse. */
export async function createCheckout(p: { orderId: string, amount: number, name: string, email: string, phone?: string, returnUrl: string }) {
  const res = await $fetch(`${API()}/checkout-sessions/`, {
    method: 'POST',
    headers: headers(),
    timeout: 15000,
    body: {
      amount: p.amount.toFixed(2),
      currency: 'XOF',
      description: 'Ton Media Kit · accès complet',
      customer_email: p.email,
      customer_name: p.name,
      ...(p.phone ? { customer_phone: p.phone } : {}),
      return_url: p.returnUrl,
      metadata: { order_id: p.orderId }
    }
  })
  const s = unwrap<Session>(res)
  if (!s?.id || !s.checkout_url) throw createError({ statusCode: 502, statusMessage: 'Réponse SasPay inattendue' })
  return { sessionId: s.id, checkoutUrl: s.checkout_url }
}

export const getSession = async (id: string) =>
  unwrap<Session>(await $fetch(`${API()}/checkout-sessions/${encodeURIComponent(id)}/`, { headers: headers(), retry: 1, timeout: 15000 }))

export const getSessionStatus = async (id: string) =>
  unwrap<SessionStatus>(await $fetch(`${API()}/checkout-sessions/${encodeURIComponent(id)}/status/`, { headers: headers(), retry: 1, timeout: 15000 }))

/**
 * État d'une commande côté SasPay : « paid » seulement si la session est payée,
 * la transaction réussie, en FCFA, au bon montant et pour la bonne commande.
 */
export async function checkOrderPayment(order: Order): Promise<{ state: 'paid' | 'pending' | 'failed', transactionId?: string }> {
  if (!order.paymentId) return { state: 'failed' }
  const st = await getSessionStatus(order.paymentId)
  const status = String(st.status || '').toUpperCase()
  if (status === 'EXPIRED' || status === 'CANCELLED') return { state: 'failed' }
  if (status !== 'PAID') return { state: 'pending' }
  const tx = String(st.transaction_status || 'SUCCESS').toUpperCase()
  if (tx === 'FAILED' || tx === 'CANCELLED') return { state: 'failed' }
  if (tx !== 'SUCCESS') return { state: 'pending' }

  const s = await getSession(order.paymentId)
  const meta = s.metadata?.order_id
  const ok = (s.currency || 'XOF').toUpperCase() === 'XOF'
    && Number(s.amount) >= order.amount
    && (!meta || meta === order.id)
  if (!ok) {
    console.warn('[saspay] session payée mais non conforme', { order: order.id, amount: s.amount, currency: s.currency, meta })
    return { state: 'failed' }
  }
  return { state: 'paid', transactionId: st.transaction_id || order.paymentId }
}

/** Signature des webhooks : HMAC-SHA256 (hex) de « horodatage.corps brut », avec 5 minutes de tolérance. */
export function validSignature(raw: string, timestamp?: string, signature?: string) {
  const secret = useRuntimeConfig().saspayWebhookSecret
  if (!secret || !timestamp || !signature) return false
  const ts = Number(timestamp)
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false
  const expected = createHmac('sha256', secret).update(`${timestamp}.${raw}`).digest('hex')
  const a = Buffer.from(expected)
  const b = Buffer.from(signature.trim().toLowerCase())
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Paiement simulé autorisé : uniquement en développement et si demandé explicitement. */
export const fakePaymentAllowed = () => import.meta.dev && !!useRuntimeConfig().public.fakePayment
