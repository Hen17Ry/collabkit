<script setup lang="ts">
import { Plus } from '@lucide/vue'

const { price, priceEur, promo, promoEnd, normalPrice } = useBrand()
const qa = [
  { q: "Je n'ai pas beaucoup d'abonnés. Ça vaut le coup ?", a: "Oui, c'est même pour toi que l'outil a été pensé. Une marque locale cherche une audience qui répond et qui peut acheter chez elle. L'outil t'aide à montrer tes chiffres avec la comparaison qui les rend parlants : taux d'engagement, part de ton audience au Bénin, enregistrements…" },
  { q: 'Combien de temps ça prend ?', a: "Une dizaine de minutes pour une première version : quatre écrans, presque tout se choisit dans des listes. Tout est enregistré au fur et à mesure, tu peux t'arrêter et reprendre plus tard." },
  { q: 'Je reçois quoi exactement ?', a: "Un media kit au format A4 en PDF (une ou deux pages) avec les liens cliquables, et une version JPG. On te l'envoie par email, et tu peux aussi le télécharger directement depuis le studio." },
  { q: 'Je peux le modifier après ?', a: "Oui, autant de fois que tu veux. Après le paiement, tu reçois par email un lien personnel vers ton studio. De nouveaux chiffres, une nouvelle collab, un nouveau tarif : tu mets à jour et tu renvoies." },
  { q: 'Comment je paie ?', a: `Par Mobile Money (MTN, Moov, Celtiis) ou par carte bancaire, via KKiaPay. C'est un paiement unique de ${fcfa(price)}, sans abonnement${promo ? ` (prix de lancement jusqu'au ${promoEnd}, ${fcfa(normalPrice)} ensuite)` : ''}.` },
  { q: "J'habite hors de la zone FCFA. Je peux payer en euros ?", a: `Oui. Choisis « En euros » au moment de payer et règle avec ta carte Visa ou Mastercard : ta banque te débite ${eur(priceEur)}, l'équivalent exact de ${fcfa(price)} (le franc CFA a une parité fixe avec l'euro). Selon ta banque, de petits frais de paiement à l'étranger peuvent s'ajouter.` },
  { q: 'Je ne sais pas quoi mettre dans mes tarifs.', a: "Les tarifs sont facultatifs. L'outil te propose des fourchettes en FCFA pour chaque format, ou une phrase comme « Grille complète envoyée après un échange sur votre objectif »." },
  { q: 'Ça marche sur téléphone ?', a: "Oui, l'outil est conçu d'abord pour le téléphone. L'aperçu de ta page A4 reste accessible en un geste." }
]
const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section id="questions" ref="root" aria-labelledby="faq-titre" class="relative py-24 sm:py-32">
    <div class="mx-auto grid grid-cols-1 max-w-[1240px] gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
      <div>
        <p data-reveal class="kicker">Questions</p>
        <h2 id="faq-titre" data-reveal="1" class="mt-5 font-display text-[clamp(34px,5vw,62px)] leading-[1.02] font-bold tracking-[-.03em] text-noir">
          Ce qu'on <span class="italic text-bordeaux">nous demande</span> souvent.
        </h2>
      </div>
      <div data-reveal="1" class="flex flex-col border-t hairline">
        <details v-for="(x, i) in qa" :key="i" class="group border-b hairline" :open="i === 0">
          <summary class="flex min-h-16 cursor-pointer list-none items-center gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
            <span class="font-display text-[15px] italic text-bordeaux">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="flex-1 text-[17.5px] font-semibold leading-snug sm:text-[19px]">{{ x.q }}</span>
            <span class="grid size-9 shrink-0 place-items-center rounded-full border border-line bg-white transition duration-300 group-open:rotate-45 group-open:border-bordeaux group-open:bg-bordeaux group-open:text-white">
              <Plus :size="17" aria-hidden="true" />
            </span>
          </summary>
          <p class="pb-6 pl-10 text-[16px] leading-relaxed text-ink/75">{{ x.a }}</p>
        </details>
      </div>
    </div>
  </section>
</template>
