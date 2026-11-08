<script setup lang="ts">
import { Mail, FileText, Link2 } from '@lucide/vue'

// Titres et descriptions des quatre écrans, repris de l'outil.
const steps = [
  { t: 'Qui tu es', d: 'Ton nom, ce que tu fais, et la phrase qui dit à une marque pourquoi toi.', icon: 'M8 6h48v52H8z|c32,26,9|M16 50c3.6-7.6 9.2-11.4 16-11.4S44.4 42.4 48 50|M8 16h48' },
  { t: 'Ton audience', d: 'Qui te suit, et les trois chiffres qui transforment une petite audience en argument.', icon: 'c24,24,14|c40,40,14|M6 58h52|M14 50v-6M26 50v-12M38 50v-4' },
  { t: 'Ton offre', d: 'Ce que tu vends, à quel prix, et la preuve que ça marche.', icon: 'M34 6H14a4 4 0 0 0-4 4v20l24 24 20-20L34 6z|c22,18,3.4|M12 56h28' },
  { t: 'Les finitions', d: 'Les blocs en plus, la page 2 et le style du document.', icon: 'M12 16h40M12 32h40M12 48h40|c24,16,5|c40,32,5|c20,48,5' }
]
const parts = (s: string) => s.split('|').map(p => p.startsWith('c') ? { c: p.slice(1).split(',').map(Number) } : { d: p })

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" aria-labelledby="steps-titre" class="relative py-24 sm:py-32">
    <div class="mx-auto max-w-[1240px] px-4 sm:px-6">
      <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p data-reveal class="kicker">En pratique</p>
          <h2 id="steps-titre" data-reveal="1" class="mt-5 font-display text-[clamp(34px,5vw,62px)] leading-[1.02] font-bold tracking-[-.03em] text-noir">
            Quatre écrans. <span class="italic text-bordeaux">Dix minutes.</span>
          </h2>
        </div>
        <p data-reveal="2" class="max-w-[28rem] text-[18px] leading-relaxed text-ink/75">
          L'aperçu A4 se met à jour à chaque choix. Tout est enregistré au fur et à mesure : tu peux t'arrêter et revenir.
        </p>
      </div>

      <ol class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="(s, i) in steps" :key="s.t" :data-reveal="i"
          class="group glass relative flex flex-col overflow-hidden rounded-[var(--radius-bubble-lg)] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(46,2,9,.12)]"
        >
          <div class="flex items-start justify-between">
            <span class="font-display text-[44px] leading-none font-bold italic text-bordeaux/90">{{ i + 1 }}</span>
            <svg viewBox="0 0 64 64" class="size-14 text-bordeaux transition duration-500 group-hover:rotate-[-4deg]" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <template v-for="(p, k) in parts(s.icon)" :key="k">
                <circle v-if="p.c" :cx="p.c[0]" :cy="p.c[1]" :r="p.c[2]" />
                <path v-else :d="p.d" />
              </template>
            </svg>
          </div>
          <h3 class="mt-8 font-display text-[24px] leading-tight font-bold">{{ s.t }}</h3>
          <p class="mt-2 text-[15.5px] leading-relaxed text-ink/70">{{ s.d }}</p>
        </li>
      </ol>

      <div data-reveal class="mt-4 grid gap-4 rounded-[var(--radius-bubble-lg)] bg-noir p-6 text-white sm:grid-cols-3 sm:p-8">
        <div class="flex items-start gap-4">
          <FileText :size="22" class="mt-0.5 shrink-0 text-orange" aria-hidden="true" />
          <p><b class="block text-[16px]">Un PDF A4 prêt à envoyer</b><span class="text-[14.5px] text-white/70">Une ou deux pages, plus une version JPG pour les stories.</span></p>
        </div>
        <div class="flex items-start gap-4">
          <Link2 :size="22" class="mt-0.5 shrink-0 text-orange" aria-hidden="true" />
          <p><b class="block text-[16px]">Des liens qui marchent</b><span class="text-[14.5px] text-white/70">WhatsApp, Instagram, tes réseaux : cliquables dans le fichier.</span></p>
        </div>
        <div class="flex items-start gap-4">
          <Mail :size="22" class="mt-0.5 shrink-0 text-orange" aria-hidden="true" />
          <p><b class="block text-[16px]">Envoyé dans ta boîte mail</b><span class="text-[14.5px] text-white/70">Tu le retrouves quand une marque te le demande, même dans six mois.</span></p>
        </div>
      </div>
    </div>
  </section>
</template>
