<script setup lang="ts">
const phrase = "Ce n'est pas un problème de talent. Tu as un problème de document."
const words = phrase.split(' ')
const key = new Set(['talent.', 'document.'])

const root = ref<HTMLElement | null>(null)
useMotion(root, ({ gsap, reduce }) => {
  if (reduce) return
  gsap.fromTo('[data-w]', { opacity: .14 }, {
    opacity: 1, stagger: .08, ease: 'none',
    scrollTrigger: { trigger: '[data-phrase]', start: 'top 78%', end: 'bottom 45%', scrub: .6 }
  })
  gsap.from('[data-after]', { opacity: 0, y: 24, duration: .8, stagger: .12, ease: 'power3.out', scrollTrigger: { trigger: '[data-after]', start: 'top 85%' } })
})
</script>

<template>
  <section ref="root" aria-labelledby="tournant" class="grain relative overflow-hidden bg-bordeaux-deep py-28 text-white sm:py-36">
    <div class="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-bordeaux/60 blur-[120px]" aria-hidden="true" />
    <div class="relative mx-auto max-w-[1100px] px-4 sm:px-6">
      <p class="kicker !text-rose/80">Chapitre 2 · Le vrai problème</p>
      <h2 id="tournant" data-phrase class="mt-8 font-display text-[clamp(36px,6.4vw,82px)] leading-[1.03] font-bold tracking-[-.035em]">
        <template v-for="(w, i) in words" :key="i"><span data-w :class="key.has(w) ? 'italic text-[#F4B9C6]' : ''">{{ w }}</span>{{ ' ' }}</template>
      </h2>
      <div class="mt-14 grid gap-10 border-t border-white/15 pt-10 md:grid-cols-2">
        <p data-after class="text-[18px] leading-relaxed text-white/80">
          Une marque ne dit pas oui à une créatrice qu'elle ne sait pas présenter. Le media kit, c'est ce qu'elle transfère en interne,
          ce qu'elle compare, ce qui justifie le budget. Sans lui, la conversation s'arrête toute seule.
        </p>
        <p data-after class="text-[18px] leading-relaxed text-white/80">
          Donc ici, tu viens et <b class="font-semibold text-white">tu ne pars pas d'une page blanche</b>, même quand tu n'y connais a priori rien.
          Tu choisis dans des listes, l'outil rédige les phrases et met tout en page au format A4.
        </p>
      </div>
    </div>
  </section>
</template>
