<script setup lang="ts">
import { ArrowRight, Check, ShieldCheck } from '@lucide/vue'

const { price } = useBrand()
const included = [
  'Le studio complet : 4 écrans, aperçu A4 en direct',
  'Ton media kit en PDF (1 ou 2 pages) et en JPG',
  'Liens WhatsApp, Instagram et réseaux cliquables',
  '5 dispositions, polices, couleurs, motifs et dégradés',
  'Tarifs en FCFA, conditions, portfolio, témoignages',
  'Le PDF envoyé par email, et un lien pour le modifier quand tu veux'
]
const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section id="tarif" ref="root" aria-labelledby="tarif-titre" class="relative py-24 sm:py-32">
    <div class="mx-auto max-w-[1240px] px-4 sm:px-6">
      <div class="grid items-center gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
        <div>
          <p data-reveal class="kicker">Le prix</p>
          <h2 id="tarif-titre" data-reveal="1" class="mt-5 font-display text-[clamp(34px,5vw,62px)] leading-[1.02] font-bold tracking-[-.03em] text-noir">
            Moins cher que <span class="italic text-bordeaux">la collaboration que tu rates.</span>
          </h2>
          <p data-reveal="2" class="mt-5 max-w-[32rem] text-[18px] leading-relaxed text-ink/75">
            Un seul paiement, pas d'abonnement. Tu paies par Mobile Money ou par carte, et tu accèdes au studio tout de suite.
          </p>
          <div data-reveal="3" class="mt-8 flex flex-wrap gap-2">
            <span v-for="m in ['MTN MoMo', 'Moov Money', 'Celtiis Cash', 'Carte bancaire']" :key="m" class="rounded-full border border-line bg-white/70 px-3.5 py-2 text-[13px] font-semibold">{{ m }}</span>
          </div>
        </div>

        <div data-reveal="1" class="relative">
          <div class="absolute -inset-3 -z-10 rotate-[-2deg] rounded-[var(--radius-bubble-lg)] bg-bordeaux/90" aria-hidden="true" />
          <div class="rounded-[var(--radius-bubble-lg)] bg-white p-6 shadow-[0_30px_70px_rgba(46,2,9,.22)] sm:p-9">
            <div class="flex flex-wrap items-baseline justify-between gap-4">
              <div>
                <p class="text-[11px] font-bold uppercase tracking-[.14em] text-muted-strong">Collab Kit · accès complet</p>
                <p class="mt-2 font-display text-[clamp(48px,6vw,72px)] leading-none font-bold tracking-[-.03em] text-noir">{{ fcfa(price).replace(' FCFA', '') }}<span class="ml-2 font-sans text-[18px] font-bold tracking-normal text-muted-strong">FCFA</span></p>
              </div>
              <span class="rounded-full bg-rose px-3 py-1.5 text-[12px] font-bold text-bordeaux">Paiement unique</span>
            </div>
            <ul class="mt-7 flex flex-col gap-3 border-t hairline pt-7">
              <li v-for="x in included" :key="x" class="flex gap-3 text-[15.5px] leading-snug">
                <span class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-bordeaux text-white"><Check :size="12" :stroke-width="3" aria-hidden="true" /></span>{{ x }}
              </li>
            </ul>
            <NuxtLink to="/commencer" class="btn btn-main group mt-8 w-full">
              Je crée mon media kit <ArrowRight :size="17" class="transition group-hover:translate-x-0.5" aria-hidden="true" />
            </NuxtLink>
            <p class="mt-4 flex items-center justify-center gap-2 text-[13px] text-muted-strong">
              <ShieldCheck :size="15" class="text-ok" aria-hidden="true" /> Paiement sécurisé par KKiaPay
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
