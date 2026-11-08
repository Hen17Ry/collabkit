import { z } from 'zod'

const Body = z.object({
  name: z.string().trim().min(2, 'Ton prénom, s\'il te plaît').max(60),
  email: z.email('Cette adresse email ne semble pas valide').max(120).transform(s => s.trim().toLowerCase()),
  phone: z.string().trim().max(24).optional().default('')
})

/** Crée une commande en attente : le montant vient du serveur, jamais du navigateur. */
export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'ip'
  if (!(await hit('order:' + ip, 20, 3600_000))) throw createError({ statusCode: 429, statusMessage: 'Trop de tentatives, réessaie plus tard' })
  const parsed = Body.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Formulaire incomplet', data: { issues: z.flattenError(parsed.error).fieldErrors } })
  }
  const amount = Number(useRuntimeConfig().public.priceFcfa) || 5000
  const order: Order = { id: newId(), ...parsed.data, amount, status: 'pending', createdAt: Date.now() }
  await saveOrder(order)
  return { orderId: order.id, amount }
})
