<script setup lang="ts">
const blocks = [
  { id: 'head', t: 'Qui tu es, en une phrase', d: "Ton nom, tes piliers, ta ville, et la phrase qui dit à une marque pourquoi toi. Elle se construit toute seule à partir de menus." },
  { id: 'aud', t: 'Qui te suit', d: "Âge, répartition, villes et pays principaux. La marque vérifie en trois secondes que ton audience, c'est sa clientèle." },
  { id: 'stats', t: 'Trois chiffres, avec leur contexte', d: "« 1 400 vues » ne dit rien tout seul. L'outil te propose la comparaison qui transforme une petite audience en argument." },
  { id: 'args', t: 'Pourquoi travailler avec toi', d: "Quatre arguments que tu peux tenir : une audience qui répond, locale, un contenu qui reste, une interlocutrice directe…" },
  { id: 'offer', t: 'Ce que tu vends, et à quel prix', d: 'Tes livrables et tes tarifs en FCFA, si tu veux les afficher. Sinon, une phrase propre du type « devis sous 24 h ».' },
  { id: 'proof', t: 'La preuve', d: "Un témoignage, une capture d'un contenu qui a marché, les marques qui t'ont déjà fait confiance." },
  { id: 'foot', t: 'Comment te joindre', d: 'WhatsApp, Instagram, ton délai de réponse. Dans le PDF, tout est cliquable : la marque t\'écrit en un geste.' }
]
const focus = ref<string | null>(null)
const root = ref<HTMLElement | null>(null)

useMotion(root, ({ gsap }) => {
  const items = gsap.utils.toArray<HTMLElement>('[data-block]')
  items.forEach((el) => {
    gsap.to({}, {
      scrollTrigger: {
        trigger: el, start: 'top 58%', end: 'bottom 58%',
        onToggle: (s: { isActive: boolean }) => { if (s.isActive) focus.value = el.dataset.block! }
      }
    })
  })
  gsap.to({}, { scrollTrigger: { trigger: '[data-blocks]', start: 'top 70%', end: 'bottom 30%', onLeave: () => (focus.value = null), onLeaveBack: () => (focus.value = null) } })
})
useReveal(root)
</script>

<template>
  <section id="document" ref="root" aria-labelledby="doc-titre" class="relative py-24 sm:py-32">
    <div class="mx-auto max-w-[1240px] px-4 sm:px-6">
      <div class="max-w-[46rem]">
        <p data-reveal class="kicker">Chapitre 3 · Le document</p>
        <h2 id="doc-titre" data-reveal="1" class="mt-5 font-display text-[clamp(34px,5vw,62px)] leading-[1.02] font-bold tracking-[-.03em] text-noir">
          Ce qu'une marque lit, <span class="italic text-bordeaux">dans l'ordre</span>.
        </h2>
        <p data-reveal="2" class="mt-5 text-[18px] leading-relaxed text-ink/75">
          Une page A4, parfois deux. Chaque bloc répond à une question précise que la marque se pose avant de te payer.
        </p>
      </div>

      <div class="mt-14 grid gap-10 lg:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] lg:gap-20">
        <div class="anat-sticky sticky top-[68px] z-10 -mx-4 self-start bg-paper px-4 pt-3 pb-4 lg:top-28 lg:mx-0 lg:bg-transparent lg:p-0">
          <div class="mx-auto w-[min(46vw,200px)] lg:w-full lg:max-w-[460px]">
            <KitMini :focus="focus" />
          </div>
        </div>

        <ol data-blocks class="relative flex flex-col">
          <li
            v-for="(b, i) in blocks" :key="b.id" :data-block="b.id"
            class="group flex cursor-default gap-5 border-t hairline py-7 transition-opacity duration-300 lg:py-10"
            :class="focus && focus !== b.id ? 'lg:opacity-40' : ''"
            @mouseenter="focus = b.id"
          >
            <span class="w-9 shrink-0 pt-1 font-display text-[19px] italic transition-colors" :class="focus === b.id ? 'text-bordeaux' : 'text-muted'">{{ String(i + 1).padStart(2, '0') }}</span>
            <div>
              <h3 class="font-display text-[24px] leading-tight font-bold tracking-[-.015em] sm:text-[28px]">{{ b.t }}</h3>
              <p class="mt-2 max-w-[34rem] text-[16.5px] leading-relaxed text-ink/75">{{ b.d }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* téléphone : le document reste en haut, le texte glisse dessous avec un fondu */
.anat-sticky::after { content: ""; position: absolute; left: 0; right: 0; top: 100%; height: 28px; background: linear-gradient(var(--color-paper), transparent); pointer-events: none; }
@media (min-width: 1024px) { .anat-sticky::after { display: none; } }
</style>
