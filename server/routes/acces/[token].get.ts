/** Lien magique reçu par email : ouvre la session puis renvoie vers le studio. */
export default defineEventHandler(async (event) => {
  const a = await getAccess(getRouterParam(event, 'token'))
  if (!a) return sendRedirect(event, '/acces?lien=invalide', 302)
  setAccessCookie(event, a.token)
  return sendRedirect(event, '/studio', 302)
})
