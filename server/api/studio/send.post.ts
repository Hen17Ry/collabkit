/** Reçoit le PDF généré dans le studio et l'envoie par email à la personne. */
export default defineEventHandler(async (event) => {
  const a = await requireAccess(event)
  if (!(await hit('send:' + a.token, 10, 24 * 3600_000))) {
    throw createError({ statusCode: 429, statusMessage: 'Limite d\'envois atteinte pour aujourd\'hui' })
  }
  const pdf = await readRawBody(event, false)
  if (!pdf || pdf.length < 1000) throw createError({ statusCode: 422, statusMessage: 'PDF manquant' })
  if (pdf.length > 4_400_000) throw createError({ statusCode: 413, statusMessage: 'PDF trop lourd' })
  if (pdf.subarray(0, 5).toString() !== '%PDF-') throw createError({ statusCode: 422, statusMessage: 'Fichier non reconnu' })

  const raw = String(getHeader(event, 'x-filename') || 'media-kit.pdf')
  const filename = (raw.replace(/[^a-z0-9.-]/gi, '-').replace(/-+/g, '-').slice(0, 60) || 'media-kit') .replace(/(\.pdf)?$/i, '.pdf')

  const m = kitEmail(a.name, accessUrl(a.token), filename)
  await sendMail({ to: a.email, ...m, attachments: [{ filename, content: pdf }] })
  return { ok: true, email: a.email }
})
