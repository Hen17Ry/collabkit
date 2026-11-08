<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

const { brand, price, waHref } = useBrand()
const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" aria-labelledby="about-titre" class="relative py-24 sm:py-32">
    <div class="mx-auto max-w-[1240px] px-4 sm:px-6">
      <div class="grid gap-12 border-t hairline pt-16 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
        <div data-reveal>
          <img src="/brand/lys.png" alt="Lys Sama, création de contenu" class="h-24 w-auto" width="139" height="96" loading="lazy">
          <div class="mt-8 flex flex-wrap gap-2.5">
            <a :href="waHref('Bonjour Lys, j\'ai une question sur le media kit.')" target="_blank" rel="noopener" class="inline-flex min-h-11 items-center gap-2.5 rounded-[4px_99px_99px_99px] border border-line bg-white/75 py-2 pr-4 pl-2 text-[14px] font-bold transition hover:-translate-y-px hover:border-bordeaux">
              <img src="/brand/icons/wa.png" alt="" class="size-7 rounded-full" width="28" height="28" loading="lazy"> WhatsApp
            </a>
            <a :href="brand.ig" target="_blank" rel="noopener" class="inline-flex min-h-11 items-center gap-2.5 rounded-[4px_99px_99px_99px] border border-line bg-white/75 py-2 pr-4 pl-2 text-[14px] font-bold transition hover:-translate-y-px hover:border-bordeaux">
              <img src="/brand/icons/ig.png" alt="" class="size-7 rounded-full" width="28" height="28" loading="lazy"> Instagram
            </a>
          </div>
        </div>
        <div>
          <p data-reveal class="kicker">Derrière l'outil</p>
          <h2 id="about-titre" data-reveal="1" class="mt-5 font-display text-[clamp(30px,4.2vw,50px)] leading-[1.06] font-bold tracking-[-.025em] text-noir">
            Une initiative de <span class="italic text-bordeaux">{{ brand.nom }}</span>, pour celles et ceux qui commencent.
          </h2>
          <p data-reveal="2" class="mt-6 text-[17.5px] leading-relaxed text-ink/75">
            <b class="font-semibold text-ink">{{ brand.serie }}</b> est une série de vidéos qui apprend aux créateurs débutants à décrocher et à piloter leurs premières collaborations avec des marques.
            Cet outil en est le prolongement : il t'accompagne dans l'élaboration du premier document que réclamera une marque pour collaborer, ton media kit.
          </p>
          <p data-reveal="3" class="mt-4 text-[17.5px] leading-relaxed text-ink/75">
            Il a été pensé par Mélyssa K. COSSOU, plus connue en tant que <b class="font-semibold text-ink">{{ brand.nom }}</b> sur les réseaux sociaux, créatrice de contenu et stratège digitale basée à Cotonou,
            avec une mission : éclairer les créateur·rice·s de contenu sur tous les aspects de la création dont on ne leur parle jamais.
          </p>
        </div>
      </div>

      <!-- appel final -->
      <div data-reveal class="grain relative mt-24 overflow-hidden rounded-[var(--radius-bubble-lg)] bg-bordeaux px-6 py-14 text-white sm:px-14 sm:py-20">
        <div class="pointer-events-none absolute -right-24 -bottom-32 size-[420px] rounded-full bg-orange/30 blur-[90px]" aria-hidden="true" />
        <div class="relative grid items-end gap-10 lg:grid-cols-[1.3fr_.7fr]">
          <h2 class="font-display text-[clamp(34px,5.4vw,68px)] leading-[1] font-bold tracking-[-.03em]">
            La prochaine marque qui t'écrit, <span class="italic text-[#F4B9C6]">tu lui réponds le jour même.</span>
          </h2>
          <div class="flex flex-col gap-3 lg:items-end">
            <NuxtLink to="/commencer" class="btn group w-full bg-white text-bordeaux shadow-[0_14px_30px_rgba(0,0,0,.2)] hover:bg-rose sm:w-auto">
              Créer mon media kit<span class="hidden sm:inline"> · {{ fcfa(price) }}</span> <ArrowRight :size="17" class="transition group-hover:translate-x-0.5" aria-hidden="true" />
            </NuxtLink>
            <a href="/acces" class="text-[14px] font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline">J'ai déjà payé, je reprends mon media kit</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
