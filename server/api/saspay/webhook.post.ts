/**
 * Webhook SasPay (tableau de bord SasPay > Webhooks, évènement transaction.success).
 * Filet de sécurité si la personne ferme la page avant le retour sur le site.
 * Carte : l'identifiant de la transaction est celui du paiement, on retrouve la commande directement.
 * Mobile Money : la notification ne cite pas la session, on revérifie auprès de SasPay
 * les commandes en attente du même montant, et on n'ouvre que celles qui sont payées.
 */
export default defineEventHandler(async (event) => {
  const raw = (await readRawBody(event, 'utf8')) || ''
  const ok = validSignature(raw, getHeader(event, 'x-webhook-timestamp'), getHeader(event, 'x-webhook-signature'))
  if (!ok) throw createError({ statusCode: 401, statusMessage: 'Signature invalide' })

  let body: any
  try { body = JSON.parse(raw) } catch { throw createError({ statusCode: 400, statusMessage: 'Corps invalide' }) }
  if (body?.event !== 'transaction.success') return { ok: true }

  const data = body.data || {}
  const amount = Number(data.amount)
  const currency = String(data.currency || '').toUpperCase()
  const direct = data.id ? await orderForPayment(String(data.id)) : null
  const pending = (await listPending()).slice(-30).reverse()
  const candidates = direct ? [direct] : pending

  let opened = 0
  for (const id of candidates) {
    const order = await getOrder(id)
    if (!order || order.status === 'paid' || !order.paymentId) { await removePending(id); continue }
    if (!direct) {
      if (order.method === 'card') continue
      if (currency && currency !== 'XOF') continue
      if (Number.isFinite(amount) && amount > 0 && amount < order.amount) continue
    }
    try {
      const r = await checkOrderPayment(order)
      if (r.state === 'failed') { await removePending(id); continue }
      if (r.state !== 'paid') continue
      const owner = await txOwner(r.transactionId!)
      if (owner && owner !== order.id) continue
      const { order: paid, created } = await grantAccess(order, r.transactionId!)
      if (created) { await notifyAccess(paid); opened++ }
    } catch (e: any) {
      console.error('[saspay] webhook', id, e?.data || e)
    }
  }
  return { ok: true, opened }
})
