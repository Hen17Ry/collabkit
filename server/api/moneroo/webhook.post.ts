/**
 * Webhook Moneroo : ouvre l'accès même si la cliente a fermé la page avant le retour sur le site.
 * À déclarer dans Moneroo > Développeurs > Webhooks, avec le même secret que NUXT_MONEROO_WEBHOOK_SECRET.
 */
export default defineEventHandler(async (event) => {
  const raw = (await readRawBody(event, 'utf8')) || ''
  if (!validSignature(raw, getHeader(event, 'x-moneroo-signature'))) {
    throw createError({ statusCode: 403, statusMessage: 'Signature invalide' })
  }

  let body: { event?: string, data?: { id?: string } } = {}
  try { body = JSON.parse(raw) } catch { return { ok: true } }
  if (body.event !== 'payment.success' || !body.data?.id) return { ok: true }

  // le webhook ne contient pas tout : on relit le paiement auprès de Moneroo
  const p = await verifyPayment(body.data.id).catch(() => null)
  const orderId = p?.metadata?.order_id
  const order = orderId ? await getOrder(orderId) : null
  if (!p || !order || order.status === 'paid' || !paymentMatches(p, order)) return { ok: true }

  const owner = await txOwner(p.id)
  if (owner && owner !== order.id) return { ok: true }

  const { order: paid, created } = await grantAccess(order, p.id)
  if (created) await notifyAccess(paid)
  return { ok: true }
})
