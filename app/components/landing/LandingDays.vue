<script setup lang="ts">
import type { ChatMsg } from './ChatThread.vue'

const base: ChatMsg[] = [
  { from: 'brand', text: 'Bonjour ! On adore ton contenu, surtout tes looks à petit budget.' },
  { from: 'brand', text: 'On lance une collection de pagnes en décembre. Ça te dirait de collaborer ?' },
  { from: 'brand', text: 'Tu peux nous envoyer ton media kit et tes tarifs ?' },
  { from: 'me', text: 'Avec plaisir ! Je vous l\'envoie très vite.' }
]
const final: ChatMsg[] = [
  ...base,
  { from: 'sep', text: 'Trois jours plus tard' },
  { from: 'brand', text: 'Merci pour ton retour ! Finalement, nous partons avec une autre créatrice pour cette campagne. Belle continuation à toi.' }
]

const days = [
  { n: 'Jour 1', t: 'Tu ouvres Canva.', d: 'Page blanche. Tu cherches un modèle de media kit, aucun ne te ressemble. Tu te dis que tu le finiras ce soir.', seen: 'Vu hier' },
  { n: 'Jour 2', t: 'Les questions arrivent.', d: "Quels chiffres mettre quand on n'a pas cent mille abonnés ? Combien demander pour un reel ? Trop, et tu la fais fuir. Pas assez, et tu travailles pour rien.", seen: 'Vu il y a 2 jours' },
  { n: 'Jour 3', t: "Elle a écrit à quelqu'un d'autre.", d: "Pas parce que l'autre créatrice avait plus de talent. Parce qu'elle avait un document prêt à envoyer.", seen: 'Vu il y a 3 jours' }
]

const day = ref(0)
const story = ref<HTMLElement | null>(null)
const list = ref<HTMLElement | null>(null)
useMotion(story, ({ gsap }) => {
  const { $ScrollTrigger } = useNuxtApp()
  ;($ScrollTrigger as any).create({
    trigger: story.value,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (s: { progress: number }) => { day.value = Math.min(2, Math.floor(s.progress * 3.2)) }
  })
  gsap.from('[data-days-head]', { opacity: 0, y: 20, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: story.value, start: 'top 70%' } })
})
useReveal(list)
</script>

<template>
  <section id="histoire" aria-labelledby="histoire-titre" class="relative">
    <h2 id="histoire-titre" class="sr-only">Trois jours passent</h2>

    <!-- Ordinateur : récit qui avance au défilement -->
    <div ref="story" class="relative hidden h-[300vh] lg:block motion-reduce:hidden">
      <div class="sticky top-0 flex h-dvh items-center">
        <div class="mx-auto grid w-full max-w-[1240px] grid-cols-[1.1fr_.9fr] items-center gap-20 px-6">
          <div>
            <p data-days-head class="kicker">Chapitre 1 · Trois jours passent</p>
            <ol class="mt-8 flex gap-3" aria-hidden="true">
              <li v-for="(d, i) in days" :key="d.n" class="flex-1">
                <span class="block h-[3px] rounded-full transition-colors duration-500" :class="i <= day ? 'bg-bordeaux' : 'bg-ink/10'" />
                <span class="mt-3 block font-display text-[15px] italic transition-colors duration-500" :class="i === day ? 'text-bordeaux' : 'text-muted'">{{ d.n }}</span>
              </li>
            </ol>
            <div class="relative mt-10 min-h-[290px]">
              <Transition name="day" mode="out-in">
                <div :key="day">
                  <p class="font-display text-[clamp(64px,8vw,120px)] leading-none font-bold tracking-[-.04em] text-bordeaux/10" aria-hidden="true">{{ String(day + 1).padStart(2, '0') }}</p>
                  <h3 class="-mt-10 font-display text-[clamp(36px,4.4vw,58px)] leading-[1.02] font-bold tracking-[-.03em] text-noir">{{ days[day].t }}</h3>
                  <p class="mt-5 max-w-[30rem] text-[18px] leading-relaxed text-ink/75">{{ days[day].d }}</p>
                </div>
              </Transition>
            </div>
          </div>
          <div class="mx-auto w-full max-w-[420px]">
            <ChatThread :messages="day === 2 ? final : base" :seen="days[day].seen" compact />
          </div>
        </div>
      </div>
    </div>

    <!-- Téléphone, ou animations réduites : le récit en cartes -->
    <div ref="list" class="mx-auto max-w-[1240px] px-4 py-20 sm:px-6 lg:hidden motion-reduce:block">
      <p data-reveal class="kicker">Chapitre 1 · Trois jours passent</p>
      <ol class="mt-8 flex flex-col gap-4">
        <li v-for="(d, i) in days" :key="d.n" :data-reveal="i" class="glass rounded-[var(--radius-bubble-lg)] p-6">
          <p class="font-display text-[15px] italic text-bordeaux">{{ d.n }}</p>
          <h3 class="mt-1 font-display text-[28px] leading-tight font-bold tracking-[-.02em]">{{ d.t }}</h3>
          <p class="mt-2 text-[16px] leading-relaxed text-ink/75">{{ d.d }}</p>
        </li>
      </ol>
      <div data-reveal class="mx-auto mt-8 max-w-[420px]">
        <ChatThread :messages="final" seen="Vu il y a 3 jours" compact />
      </div>
    </div>
  </section>
</template>

<style scoped>
.day-enter-active, .day-leave-active { transition: opacity .35s ease, transform .45s var(--ease-out-soft); }
.day-enter-from { opacity: 0; transform: translateY(24px); }
.day-leave-to { opacity: 0; transform: translateY(-16px); }
</style>
