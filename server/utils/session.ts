import type { H3Event } from 'h3'

export const COOKIE = 'ck_access'

export function setAccessCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    maxAge: 60 * 60 * 24 * 400
  })
}

/** L'accès en cours : cookie posé par le lien magique ou après paiement. */
export async function currentAccess(event: H3Event) {
  return getAccess(getCookie(event, COOKIE))
}

export async function requireAccess(event: H3Event) {
  const a = await currentAccess(event)
  if (!a) throw createError({ statusCode: 401, statusMessage: 'Accès requis' })
  return a
}

export const accessUrl = (token: string) => `${useRuntimeConfig().public.siteUrl.replace(/\/$/, '')}/acces/${token}`
