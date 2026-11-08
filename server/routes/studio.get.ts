/**
 * Le studio (l'outil de Lys Sama) n'est servi qu'aux personnes qui ont payé.
 * Il reçoit au chargement le prénom, l'email et le dernier brouillon enregistré.
 */
export default defineEventHandler(async (event) => {
  const a = await currentAccess(event)
  if (!a) return sendRedirect(event, '/acces', 302)

  const html = await useStorage('assets:studio').getItem<string>('studio.html')
  if (!html) throw createError({ statusCode: 500, statusMessage: 'Studio introuvable' })

  const draft = await getDraft(a.token)
  const boot = { name: a.name, email: a.email, draft: draft?.state || null, draftAt: draft?.at || 0 }
  const json = JSON.stringify(boot).replace(/</g, '\\u003c')

  setHeaders(event, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    'x-robots-tag': 'noindex'
  })
  return String(html).replace('/*@CK_BOOT*/null', json)
})
