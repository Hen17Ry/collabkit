<script setup lang="ts">
import { ArrowRight, ArrowDown } from '@lucide/vue'
import type { ChatMsg } from './ChatThread.vue'

const { price } = useBrand()

const messages: ChatMsg[] = [
  { from: 'brand', text: 'Bonjour ! On adore ton contenu, surtout tes looks à petit budget.' },
  { from: 'brand', text: 'On lance une collection de pagnes en décembre. Ça te dirait de collaborer ?' },
  { from: 'brand', text: 'Tu peux nous envoyer ton media kit et tes tarifs ?' },
  { from: 'me', text: 'Avec plaisir ! Je vous l\'envoie très vite.' }
]
const visible = ref(0)
const typing = ref<'brand' | 'me' | null>(null)
const seen = ref('')

const root = ref<HTMLElement | null>(null)
useMotion(root, ({ gsap, reduce }) => {
  if (reduce) { visible.value = 4; seen.value = 'Vu'; return }
  const tl = gsap.timeline({ delay: .35 })
  tl.from('[data-h]', { y: 26, opacity: 0, duration: .8, stagger: .09, ease: 'power3.out' })
    .from('[data-chat]', { y: 40, opacity: 0, rotate: 2, duration: 1, ease: 'power3.out' }, '-=.6')
  const seq: Array<[number, () => void]> = [
    [700, () => (typing.value = 'brand')], [1500, () => { typing.value = null; visible.value = 1 }],
    [2000, () => (typing.value = 'brand')], [2900, () => { typing.value = null; visible.value = 2 }],
    [3400, () => (typing.value = 'brand')], [4200, () => { typing.value = null; visible.value = 3 }],
    [5000, () => (typing.value = 'me')], [6100, () => { typing.value = null; visible.value = 4 }],
    [7000, () => (seen.value = 'Vu')]
  ]
  seq.forEach(([t, fn]) => gsap.delayedCall(t / 1000 + .9, fn))
})
</script>

<template>
  <section id="top" ref="root" class="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:pb-24">
    <div class="mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
      <div class="min-w-0">
        <p data-h class="kicker flex items-center gap-3">
          <span class="h-px w-8 bg-bordeaux" aria-hidden="true" /> Le media kit, sans la page blanche
        </p>
        <h1 data-h class="mt-5 font-display text-[clamp(40px,7.2vw,84px)] leading-[.98] font-bold tracking-[-.035em] text-noir">
          Une marque t'écrit.<br>
          Elle veut ton <span class="relative whitespace-nowrap italic text-bordeaux">media kit<svg class="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 14" fill="none" preserveAspectRatio="none" aria-hidden="true"><path d="M3 10C60 3 150 2 297 8" stroke="#E8631A" stroke-width="4" stroke-linecap="round" pathLength="1" class="underline-draw" /></svg></span>.
        </h1>
        <p data-h class="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-ink/80 sm:text-[18px]">
          <span class="float-left mt-1 mr-3 font-display text-[64px] leading-[.8] font-bold text-bordeaux" aria-hidden="true">E</span><span class="sr-only">E</span>lle est intéressée, elle est polie, et elle finit par : « tu peux nous envoyer tes tarifs ? »
          Tu réponds que tu l'envoies très vite. Et là, tout se joue.
        </p>
        <div data-h class="mt-9 flex flex-col gap-3 sm:flex-row">
          <NuxtLink to="/commencer" class="btn btn-main group">
            Créer mon media kit
            <span class="rounded-full bg-white/15 px-2.5 py-0.5 text-[13px]">{{ fcfa(price) }}</span>
            <ArrowRight :size="17" class="transition group-hover:translate-x-0.5" aria-hidden="true" />
          </NuxtLink>
          <a href="#histoire" class="btn btn-ghost">La suite de l'histoire <ArrowDown :size="16" aria-hidden="true" /></a>
        </div>
        <div data-h class="mt-5"><PromoBadge /></div>
        <p data-h class="mt-4 text-[11px] font-semibold uppercase tracking-[.14em] text-muted-strong">
          4 écrans · une dizaine de minutes · PDF et JPG · tarifs en FCFA
        </p>
      </div>

      <div class="relative mx-auto w-full max-w-[440px] lg:mr-0">
        <div class="pointer-events-none absolute -top-10 -right-6 hidden w-[46%] rotate-[8deg] opacity-90 sm:block" aria-hidden="true">
          <KitMini color="#6D071A" />
        </div>
        <div data-chat class="relative">
          <ChatThread :messages="messages" :visible="visible" :typing="typing" :seen="seen" />
          <div class="glass absolute -bottom-6 -left-4 flex items-center gap-2.5 rounded-[var(--radius-bubble)] px-4 py-3 sm:-left-10">
            <span class="grid size-8 place-items-center rounded-full bg-orange/15 font-display text-[15px] font-bold italic text-orange">?</span>
            <span class="text-[13px] leading-tight"><b class="block">Et maintenant,</b>tu envoies quoi ?</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.underline-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1.1s 1.4s var(--ease-out-soft) forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }
@media (prefers-reduced-motion: reduce) { .underline-draw { stroke-dashoffset: 0; animation: none; } }
</style>
