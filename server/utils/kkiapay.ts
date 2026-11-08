// Vérification côté serveur d'une transaction KKiaPay (même appel que le SDK officiel Node).
type Tx = { status?: string, amount?: number, transactionId?: string, state?: unknown, client?: { email?: string } }

export async function verifyTransaction(transactionId: string): Promise<Tx> {
  const c = useRuntimeConfig()
  const base = c.public.kkiapaySandbox ? 'https://api-sandbox.kkiapay.me' : 'https://api.kkiapay.me'
  return await $fetch<Tx>(`${base}/api/v1/transactions/status`, {
    method: 'POST',
    headers: {
      'x-api-key': c.public.kkiapayPublicKey,
      'x-secret-key': c.kkiapaySecretKey,
      'x-private-key': c.kkiapayPrivateKey
    },
    body: { transactionId },
    retry: 1,
    timeout: 15000
  })
}

/** Paiement simulé autorisé : uniquement en développement et si demandé explicitement. */
export const fakePaymentAllowed = () => import.meta.dev && !!useRuntimeConfig().public.fakePayment
