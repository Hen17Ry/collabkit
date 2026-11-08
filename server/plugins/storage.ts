import upstashDriver from 'unstorage/drivers/upstash'

/**
 * En production, les commandes, accès et brouillons vont dans Upstash Redis.
 * Accepte les noms de variables posés par Upstash (UPSTASH_REDIS_REST_*)
 * ou par l'intégration Vercel (KV_REST_API_*).
 */
export default defineNitroPlugin(() => {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) {
    if (!import.meta.dev) console.warn('[stockage] Upstash non configuré : les commandes ne seront pas conservées.')
    return
  }
  const storage = useStorage()
  storage.unmount('db', false) // retrait immédiat, sans attendre, pour remonter juste après
  storage.mount('db', upstashDriver({ url, token, base: 'tmk' }))
})
