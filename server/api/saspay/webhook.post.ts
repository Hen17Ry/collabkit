/**
 * Webhook SasPay (à déclarer dans le tableau de bord SasPay > Webhooks, évènement transaction.success).
 * Filet de sécurité si la personne ferme la page avant le retour sur le site.
 * La notification ne dit pas à quelle commande elle correspond : on revérifie auprès de SasPay
 * les commandes en attente du même montant, et on n'ouvre que celles dont la session est payée.
 */
export default defineEventHandler(async (event) => {
  const raw = (await readRawBody(event, 'utf8')) || ''
  const ok = validSignature(raw, getHeader(event, 'x-webhook-timestamp'), getHeader(event, 'x-webhook-signature'))
  if (!ok) throw createError({ statusCode: 401, statusMessage: 'Signature invalide' })

  let body: any
  try { body = JSON.parse(raw) } catch { throw createError({ statusCode: 400, statusMessage: 'Corps invalide' }) }
  if (body?.event !== 'transaction.success') return { ok: true }

  const amount = Number(body?.data?.amount)
  let opened = 0
  for (const id of (await listPending()).slice(-30).reverse()) {
    const order = await getOrder(id)
    if (!order || order.status === 'paid' || !order.paymentId) { await removePending(id); continue }
    if (Number.isFinite(amount) && amount > 0 && amount < order.amount) continue
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
