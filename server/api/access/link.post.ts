import { z } from 'zod'

/** Renvoie le lien d'accès par email. Répond toujours pareil, pour ne pas révéler qui a acheté. */
export default defineEventHandler(async (event) => {
  const parsed = z.object({ email: z.email() }).safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 422, statusMessage: 'Adresse email invalide' })
  const email = parsed.data.email.trim().toLowerCase()

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'ip'
  if (!(await hit('link:' + emailKey(email), 3, 3600_000)) || !(await hit('linkip:' + ip, 12, 3600_000))) {
    throw createError({ statusCode: 429, statusMessage: 'Trop de demandes, réessaie dans une heure' })
  }

  const tokens = await tokensForEmail(email)
  for (const t of tokens.slice().reverse()) {
    const a = await getAccess(t)
    if (!a) continue
    const m = accessEmail(a.name, accessUrl(a.token))
    await sendMail({ to: a.email, ...m }).catch(e => console.error('[mail] lien', e))
    break
  }
  return { ok: true }
})
