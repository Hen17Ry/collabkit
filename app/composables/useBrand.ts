import { pricing, toEur } from '~~/shared/pricing'

export function useBrand() {
  const c = useRuntimeConfig().public
  const p = pricing(c)
  const waHref = (msg?: string) => {
    const v = String(c.brand.wa || '').trim()
    if (!v) return ''
    if (/^https?:/i.test(v)) return v
    return 'https://wa.me/' + v.replace(/[^\d]/g, '') + (msg ? '?text=' + encodeURIComponent(msg) : '')
  }
  // « jusqu'au 1er janvier » : la veille de la fin de l'offre, à l'heure de Cotonou
  const promoEnd = p.until
    ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Africa/Porto-Novo' })
        .format(p.until).replace(/^1 /, '1er ')
    : ''
  return {
    brand: c.brand,
    price: p.amount,
    normalPrice: p.normal,
    promo: p.promo,
    promoEnd,
    priceEur: toEur(p.amount),
    waHref
  }
}
