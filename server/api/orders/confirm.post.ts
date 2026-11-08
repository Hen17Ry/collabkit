import { z } from 'zod'

const Body = z.object({ orderId: z.string().min(6).max(40), transactionId: z.string().min(3).max(80) })

/**
 * Appelé par la page de paiement quand KKiaPay signale un succès.
 * On revérifie la transaction auprès de KKiaPay avant d'ouvrir l'accès.
 */
export default defineEventHandler(async (event) => {
  const parsed = Body.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 422, statusMessage: 'Requête invalide' })
  const { orderId, transactionId } = parsed.data

  const order = await getOrder(orderId)
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Commande introuvable' })

  if (order.status === 'paid') {
    if (order.transactionId !== transactionId || !order.token) throw createError({ statusCode: 409, statusMessage: 'Commande déjà réglée' })
    setAccessCookie(event, order.token)
    return { ok: true }
  }

  const owner = await txOwner(transactionId)
  if (owner && owner !== orderId) throw createError({ statusCode: 409, statusMessage: 'Transaction déjà utilisée' })

  const skip = (fakePaymentAllowed() && transactionId.startsWith('dev-')) || trustWidgetInSandbox()
  if (trustWidgetInSandbox()) console.warn('[kkiapay] mode test sans clé privée : transaction non revérifiée', transactionId)
  if (!skip) {
    if (!canVerify()) throw createError({ statusCode: 503, statusMessage: 'Paiement en cours de configuration' })
    let tx
    try { tx = await verifyTransaction(transactionId) } catch (e) {
      console.error('[kkiapay] vérification', e)
      throw createError({ statusCode: 502, statusMessage: 'Vérification du paiement impossible pour le moment' })
    }
    if (tx.status !== 'SUCCESS') throw createError({ statusCode: 402, statusMessage: 'Paiement non confirmé' })
    if (Number(tx.amount) < order.amount) throw createError({ statusCode: 402, statusMessage: 'Montant insuffisant' })
  }

  const { order: paid, created } = await grantAccess(order, transactionId)
  setAccessCookie(event, paid.token!)
  if (created) await notifyAccess(paid)
  return { ok: true }
})
