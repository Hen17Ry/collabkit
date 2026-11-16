import { pricing } from '~~/shared/pricing'
import { z } from 'zod'

const Body = z.object({
  name: z.string().trim().min(2, 'Ton prénom, s\'il te plaît').max(60),
  email: z.email('Cette adresse email ne semble pas valide').max(120).transform(s => s.trim().toLowerCase()),
  phone: z.string().trim().max(24).optional().default(''),
  method: z.enum(['momo', 'card']).optional().default('momo')
}).refine(b => b.method !== 'card' || b.phone.replace(/\D/g, '').length >= 8, { path: ['phone'], message: 'Ton numéro est demandé pour payer par carte' })

/**
 * Crée la commande puis le paiement SasPay et renvoie l'adresse de la page de paiement :
 * Mobile Money en FCFA (session hébergée), ou carte bancaire en dollars US.
 * Le montant vient du serveur, jamais du navigateur.
 */
export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'ip'
  if (!(await hit('order:' + ip, 20, 3600_000))) throw createError({ statusCode: 429, statusMessage: 'Trop de tentatives, réessaie plus tard' })
  const parsed = Body.safeParse(await readBody(event))
  if (!parsed.success) {
    const issues = z.flattenError(parsed.error).fieldErrors
    throw createError({ statusCode: 422, statusMessage: issues.phone?.[0] || 'Formulaire incomplet', data: { issues } })
  }
  const p = pricing(useRuntimeConfig().public)
  const card = parsed.data.method === 'card'
  const order: Order = {
    id: newId(), ...parsed.data,
    currency: card ? 'USD' : 'XOF',
    amount: card ? p.usd : p.amount,
    status: 'pending', createdAt: Date.now()
  }
  await saveOrder(order)

  if (fakePaymentAllowed()) return { orderId: order.id, fake: true }

  const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  const returnUrl = `${site}/paiement?commande=${order.id}`
  let pay: { paymentId: string, checkoutUrl: string }
  try {
    if (card) {
      pay = await createCardPayment({ orderId: order.id, usd: p.usd, name: order.name, email: order.email, phone: intlPhone(order.phone), returnUrl })
    } else {
      const s = await createCheckout({ orderId: order.id, amount: p.amount, name: order.name, email: order.email, phone: intlPhone(order.phone) || undefined, returnUrl })
      pay = { paymentId: s.sessionId, checkoutUrl: s.checkoutUrl }
    }
  } catch (e: any) {
    if (e?.statusCode === 503) throw e
    console.error('[saspay] démarrage du paiement', order.method, e?.data || e)
    throw createError({ statusCode: 502, statusMessage: 'Le paiement n\'a pas pu démarrer. Réessaie dans un instant.' })
  }
  await saveOrder({ ...order, paymentId: pay.paymentId })
  await linkPayment(pay.paymentId, order.id)
  await addPending(order.id)
  return { orderId: order.id, checkoutUrl: pay.checkoutUrl }
})
