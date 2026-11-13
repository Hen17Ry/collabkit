/**
 * Prix du media kit : un prix normal et un prix de lancement limité dans le temps.
 * Le site affiche le prix en FCFA ; le paiement est facturé en dollars US (Moneroo),
 * et Moneroo convertit pour les paiements Mobile Money en FCFA.
 * Partagé entre le site et le serveur : c'est le serveur qui fixe le montant payé.
 */
export const EUR_RATE = 655.957 // parité fixe 1 € = 655,957 FCFA

export type PricingConfig = {
  priceFcfa: number | string, promoPriceFcfa?: number | string,
  priceUsd?: number | string, promoPriceUsd?: number | string,
  promoUntil?: string
}
export type Pricing = { amount: number, normal: number, usd: number, normalUsd: number, promo: boolean, until: Date | null }

export function pricing(c: PricingConfig, now = Date.now()): Pricing {
  const normal = Number(c.priceFcfa) || 5000
  const normalUsd = Number(c.priceUsd) || 9
  const promoPrice = Number(c.promoPriceFcfa) || 0
  const promoUsd = Number(c.promoPriceUsd) || 0
  const until = c.promoUntil ? new Date(c.promoUntil) : null
  const promo = !!promoPrice && !!promoUsd && promoPrice < normal && !!until && !Number.isNaN(until.getTime()) && now < until.getTime()
  return {
    amount: promo ? promoPrice : normal,
    normal,
    usd: promo ? promoUsd : normalUsd,
    normalUsd,
    promo,
    until: promo ? until : null
  }
}

/** Équivalent en euros, au centime près. */
export const toEur = (fcfa: number) => Math.round((fcfa / EUR_RATE) * 100) / 100
