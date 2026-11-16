import { z } from 'zod'

const Body = z.object({ orderId: z.string().min(6).max(40) })

/**
 * Appelé au retour de la page de paiement SasPay (et en boucle tant que le paiement n'est pas confirmé).
 * On revérifie la session auprès de SasPay avant d'ouvrir l'accès.
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

  if (!order.paymentId) throw createError({ statusCode: 409, statusMessage: 'Aucun paiement pour cette commande' })

  let r
  try { r = await checkOrderPayment(order) } catch (e: any) {
    console.error('[saspay] vérification', e?.data || e)
    throw createError({ statusCode: 502, statusMessage: 'Vérification du paiement impossible pour le moment' })
  }
  if (r.state !== 'paid') return { status: r.state }

  const tx = r.transactionId!
  const owner = await txOwner(tx)
  if (owner && owner !== order.id) throw createError({ statusCode: 409, statusMessage: 'Paiement déjà utilisé' })

  const { order: paid, created } = await grantAccess(order, tx)
  setAccessCookie(event, paid.token!)
  if (created) await notifyAccess(paid)
  return { status: 'paid' }
})
