/**
 * Prix du media kit : un prix normal et un prix de lancement limité dans le temps.
 * Partagé entre le site et le serveur : c'est le serveur qui fixe le montant payé.
 */
export const EUR_RATE = 655.957 // parité fixe 1 € = 655,957 FCFA

export type PricingConfig = { priceFcfa: number | string, promoPriceFcfa?: number | string, promoUntil?: string }
export type Pricing = { amount: number, normal: number, promo: boolean, until: Date | null }

export function pricing(c: PricingConfig, now = Date.now()): Pricing {
  const normal = Number(c.priceFcfa) || 5000
  const promoPrice = Number(c.promoPriceFcfa) || 0
  const until = c.promoUntil ? new Date(c.promoUntil) : null
  const promo = !!promoPrice && promoPrice < normal && !!until && !Number.isNaN(until.getTime()) && now < until.getTime()
  return { amount: promo ? promoPrice : normal, normal, promo, until: promo ? until : null }
}

/** Équivalent en euros, au centime près. */
export const toEur = (fcfa: number) => Math.round((fcfa / EUR_RATE) * 100) / 100
