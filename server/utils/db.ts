import { createHash, randomBytes } from 'node:crypto'

export type Order = {
  id: string
  name: string
  email: string
  phone?: string
  currency?: 'xof' | 'eur'
  amount: number
  status: 'pending' | 'paid'
  transactionId?: string
  paymentId?: string
  token?: string
  createdAt: number
  paidAt?: number
}
export type Access = { token: string, orderId: string, name: string, email: string, createdAt: number, revoked?: boolean }
export type Draft = { state: Record<string, unknown>, at: number }

const db = () => useStorage('db')
export const newId = (bytes = 9) => randomBytes(bytes).toString('base64url')
export const emailKey = (email: string) => createHash('sha256').update(email.trim().toLowerCase()).digest('hex').slice(0, 32)

export const getOrder = (id: string) => db().getItem<Order>(`orders:${id}`)
export const saveOrder = (o: Order) => db().setItem(`orders:${o.id}`, o)

export const getAccess = async (token?: string | null) => {
  if (!token || !/^[\w-]{20,64}$/.test(token)) return null
  const a = await db().getItem<Access>(`access:${token}`)
  return a && !a.revoked ? a : null
}

/** Crée l'accès au studio pour une commande payée (une seule fois par commande). */
export async function grantAccess(order: Order, transactionId: string) {
  if (order.status === 'paid' && order.token) return { order, created: false }
  const token = newId(24)
  const access: Access = { token, orderId: order.id, name: order.name, email: order.email, createdAt: Date.now() }
  await db().setItem(`access:${token}`, access)
  await db().setItem(`tx:${transactionId}`, order.id)
  const k = `byemail:${emailKey(order.email)}`
  const list = (await db().getItem<string[]>(k)) || []
  await db().setItem(k, [...list, token])
  const paid: Order = { ...order, status: 'paid', transactionId, token, paidAt: Date.now() }
  await saveOrder(paid)
  return { order: paid, created: true }
}

export const txOwner = (transactionId: string) => db().getItem<string>(`tx:${transactionId}`)
export const tokensForEmail = async (email: string) => (await db().getItem<string[]>(`byemail:${emailKey(email)}`)) || []

export const getDraft = (token: string) => db().getItem<Draft>(`drafts:${token}`)
export const saveDraft = (token: string, d: Draft) => db().setItem(`drafts:${token}`, d)

/** Compteur simple par fenêtre de temps (anti-abus sur les envois d'email). */
export async function hit(key: string, max: number, windowMs: number) {
  const k = `rate:${key}`
  const now = Date.now()
  const cur = (await db().getItem<{ n: number, until: number }>(k)) || { n: 0, until: now + windowMs }
  const next = cur.until < now ? { n: 1, until: now + windowMs } : { n: cur.n + 1, until: cur.until }
  await db().setItem(k, next)
  return next.n <= max
}
