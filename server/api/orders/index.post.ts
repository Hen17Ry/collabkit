import { pricing } from '~~/shared/pricing'
import { z } from 'zod'

const Body = z.object({
  name: z.string().trim().min(2, 'Ton prénom, s\'il te plaît').max(60),
  email: z.email('Cette adresse email ne semble pas valide').max(120).transform(s => s.trim().toLowerCase()),
  phone: z.string().trim().max(24).optional().default('')
})

/**
 * Crée la commande puis la session de paiement SasPay (en FCFA), et renvoie l'adresse de paiement.
 * Le montant vient du serveur, jamais du navigateur.
 */
export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'ip'
  if (!(await hit('order:' + ip, 20, 3600_000))) throw createError({ statusCode: 429, statusMessage: 'Trop de tentatives, réessaie plus tard' })
  const parsed = Body.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Formulaire incomplet', data: { issues: z.flattenError(parsed.error).fieldErrors } })
  }
  const p = pricing(useRuntimeConfig().public)
  const order: Order = {
    id: newId(), ...parsed.data, amount: p.amount,
    status: 'pending', createdAt: Date.now()
  }
  await saveOrder(order)

  if (fakePaymentAllowed()) return { orderId: order.id, fake: true }

  const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, '')
  let pay
  try {
    pay = await createCheckout({
      orderId: order.id,
      amount: p.amount,
      name: order.name,
      email: order.email,
      phone: order.phone?.replace(/[^\d+]/g, '') || undefined,
      returnUrl: `${site}/paiement?commande=${order.id}`
    })
  } catch (e: any) {
    if (e?.statusCode === 503) throw e
    console.error('[saspay] création de session', e?.data || e)
    throw createError({ statusCode: 502, statusMessage: 'Le paiement n\'a pas pu démarrer. Réessaie dans un instant.' })
  }
  await saveOrder({ ...order, paymentId: pay.sessionId })
  await addPending(order.id)
  return { orderId: order.id, checkoutUrl: pay.checkoutUrl }
})
