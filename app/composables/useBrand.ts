export function useBrand() {
  const c = useRuntimeConfig().public
  const price = Number(c.priceFcfa) || 2500
  const waHref = (msg?: string) => {
    const v = String(c.brand.wa || '').trim()
    if (!v) return ''
    if (/^https?:/i.test(v)) return v
    return 'https://wa.me/' + v.replace(/[^\d]/g, '') + (msg ? '?text=' + encodeURIComponent(msg) : '')
  }
  return { brand: c.brand, price, waHref }
}
