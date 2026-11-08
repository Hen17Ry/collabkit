/** Sauvegarde du brouillon : le media kit suit la personne d'un appareil à l'autre. */
export default defineEventHandler(async (event) => {
  const a = await requireAccess(event)
  const len = Number(getHeader(event, 'content-length') || 0)
  if (len > 4_500_000) throw createError({ statusCode: 413, statusMessage: 'Brouillon trop lourd' })
  const body = await readBody<{ state?: Record<string, unknown>, at?: number }>(event)
  if (!body?.state || typeof body.state !== 'object') throw createError({ statusCode: 422, statusMessage: 'Brouillon invalide' })
  const at = Number(body.at) || Date.now()
  const cur = await getDraft(a.token)
  if (cur && cur.at > at) return { ok: true, at: cur.at, stale: true }
  await saveDraft(a.token, { state: body.state, at })
  return { ok: true, at }
})
