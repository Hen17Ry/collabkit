import { z } from 'zod'

const Body = z.object({ orderId: z.string().min(6).max(40), paymentId: z.string().min(3).max(80).optional() })

/**
 * Appelé au retour de la page de paiement Moneroo.
 * On revérifie le paiement auprès de Moneroo avant d'ouvrir l'accès.
 */
export default defineEventHandler(async (event) => {
  const parsed = Body.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 422, statusMessage: 'Requête invalide' })
  const { orderId } = parsed.data

  const order = await getOrder(orderId)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Commande introuvable' })

  if (order.status === 'paid' && order.token) {
    setAccessCookie(event, order.token)
    return { status: 'paid' }
  }

  // en développement, paiement simulé
  if (fakePaymentAllowed() && !order.paymentId) {
    const { order: paid, created } = await grantAccess(order, 'dev-' + order.id)
    setAccessCookie(event, paid.token!)
    if (created) await notifyAccess(paid)
    return { status: 'paid' }
  }

  // l'identifiant de paiement de la commande fait foi (celui de l'adresse de retour n'est qu'un indice)
  const paymentId = order.paymentId || parsed.data.paymentId
  if (!paymentId) throw createError({ statusCode: 409, statusMessage: 'Aucun paiement pour cette commande' })

  let p
  try { p = await verifyPayment(paymentId) } catch (e: any) {
    console.error('[moneroo] vérification', e?.data || e)
    throw createError({ statusCode: 502, statusMessage: 'Vérification du paiement impossible pour le moment' })
  }

  if (p.status === 'pending' || p.status === 'initiated') return { status: 'pending' }
  if (!paymentMatches(p, order)) return { status: 'failed' }

  const owner = await txOwner(p.id)
  if (owner && owner !== order.id) throw createError({ statusCode: 409, statusMessage: 'Paiement déjà utilisé' })

  const { order: paid, created } = await grantAccess(order, p.id)
  setAccessCookie(event, paid.token!)
  if (created) await notifyAccess(paid)
  return { status: 'paid' }
})
