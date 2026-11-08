export default defineEventHandler(async (event) => {
  const a = await currentAccess(event)
  return a ? { ok: true, name: a.name } : { ok: false }
})
