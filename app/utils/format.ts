// espaces insécables : « 5 000 FCFA » ne se coupe jamais en fin de ligne
export const fcfa = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(n).replace(/ /g, ' ') + ' FCFA'

export const eur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n).replace(/ /g, ' ') + ' €'

export const usd = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n).replace(/ /g, ' ') + ' $'
