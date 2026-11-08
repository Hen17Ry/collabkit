/** Envoie le lien d'accès par email ; un échec d'envoi ne bloque jamais l'accès. */
export async function notifyAccess(order: Order) {
  try {
    const m = accessEmail(order.name, accessUrl(order.token!))
    await sendMail({ to: order.email, ...m })
  } catch (e) {
    console.error('[mail] accès', order.id, e)
  }
}
