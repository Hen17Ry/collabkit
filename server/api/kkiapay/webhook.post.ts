/**
 * Webhook KKiaPay : rattrape les paiements dont la page a été fermée avant la confirmation.
 * À déclarer dans KKiaPay > Webhooks, avec le même secret que NUXT_KKIAPAY_WEBHOOK_SECRET.
 */
export default defineEventHandler(async (event) => {
  const secret = useRuntimeConfig().kkiapayWebhookSecret
  if (!secret || getHeader(event, 'x-kkiapay-secret') !== secret) {
    throw createError({ statusCode: 401, statusMessage: 'Signature invalide' })
  }
  const body = await readBody<{ transactionId?: string, isPaymentSucces?: boolean, event?: string, stateData?: unknown }>(event)
  if (!body?.transactionId || body.event !== 'transaction.success' || !body.isPaymentSucces) return { ok: true }

  let orderId = ''
  const sd = body.stateData
  if (typeof sd === 'string') { try { orderId = JSON.parse(sd).orderId } catch { orderId = sd } }
  else if (sd && typeof sd === 'object') orderId = String((sd as Record<string, unknown>).orderId || '')

  const order = orderId ? await getOrder(orderId) : null
  if (!order || order.status === 'paid') return { ok: true }

  const owner = await txOwner(body.transactionId)
  if (owner && owner !== order.id) return { ok: true }

  const tx = await verifyTransaction(body.transactionId).catch(() => null)
  if (!tx || tx.status !== 'SUCCESS' || Number(tx.amount) < order.amount) return { ok: true }

  const { order: paid, created } = await grantAccess(order, body.transactionId)
  if (created) await notifyAccess(paid)
  return { ok: true }
})
