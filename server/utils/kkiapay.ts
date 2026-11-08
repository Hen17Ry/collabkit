// Vérification côté serveur d'une transaction KKiaPay (même appel que le SDK officiel Node).
type Tx = { status?: string, amount?: number, transactionId?: string, state?: unknown, client?: { email?: string } }

export async function verifyTransaction(transactionId: string): Promise<Tx> {
  const c = useRuntimeConfig()
  const base = c.public.kkiapaySandbox ? 'https://api-sandbox.kkiapay.me' : 'https://api.kkiapay.me'
  const headers: Record<string, string> = {
    'x-api-key': c.public.kkiapayPublicKey,
    'x-private-key': c.kkiapayPrivateKey
  }
  if (c.kkiapaySecretKey) headers['x-secret-key'] = c.kkiapaySecretKey
  return await $fetch<Tx>(`${base}/api/v1/transactions/status`, {
    method: 'POST', headers, body: { transactionId }, retry: 1, timeout: 15000
  })
}

/** La vérification serveur n'est possible qu'avec la clé privée. */
export const canVerify = () => !!useRuntimeConfig().kkiapayPrivateKey

/**
 * Mode test sans clé privée (compte KKiaPay pas encore activé) :
 * on se fie au retour du widget. Jamais en production réelle (sandbox = false).
 */
export const trustWidgetInSandbox = () => !!useRuntimeConfig().public.kkiapaySandbox && !canVerify()

/** Paiement simulé autorisé : uniquement en développement et si demandé explicitement. */
export const fakePaymentAllowed = () => import.meta.dev && !!useRuntimeConfig().public.fakePayment
