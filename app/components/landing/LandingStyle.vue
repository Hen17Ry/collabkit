<script setup lang="ts">
// Options reprises de l'étape « Finitions » de l'outil.
const COLORS = ['#7A2E8E', '#C0392B', '#1F6F5C', '#1D4E89', '#D9822B', '#222222', '#6D071A']
const LAYOUTS = [
  { v: 'classic', l: 'Classique' }, { v: 'side', l: 'Latéral' }, { v: 'clean', l: 'Épuré' },
  { v: 'magazine', l: 'Magazine' }, { v: 'bande', l: 'Compacte' }
] as const
const PAPERS = [{ v: 'white', l: 'Blanc', c: '#ffffff' }, { v: 'ivory', l: 'Ivoire', c: '#FBF7F1' }, { v: 'dark', l: 'Sombre', c: '#17171A' }] as const
const FONTS = [
  { v: 'sys', l: 'Moderne', f: 'system-ui, sans-serif' }, { v: 'ele', l: 'Élégant', f: '"Playfair Display", serif' },
  { v: 'aff', l: 'Affirmé', f: '"Space Grotesk", sans-serif' }, { v: 'dou', l: 'Doux', f: 'Lora, serif' }
] as const

const color = ref(COLORS[0])
const layout = ref<typeof LAYOUTS[number]['v']>('classic')
const paper = ref<typeof PAPERS[number]['v']>('white')
const font = ref<typeof FONTS[number]['v']>('sys')

const root = ref<HTMLElement | null>(null)
useReveal(root)
</script>

<template>
  <section ref="root" aria-labelledby="style-titre" class="relative overflow-hidden py-24 sm:py-32">
    <div class="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-transparent via-rose/60 to-transparent" aria-hidden="true" />
    <div class="relative mx-auto grid grid-cols-1 max-w-[1240px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:gap-20">
      <div class="order-2 lg:order-1">
        <div class="mx-auto w-full max-w-[430px]">
          <div class="relative">
            <div class="absolute inset-4 -z-10 translate-x-6 translate-y-6 rounded-lg bg-white/60 shadow-xl" aria-hidden="true" />
            <KitMini :color="color" :layout="layout" :paper="paper" :font="font" />
          </div>
        </div>
      </div>

      <div class="order-1 lg:order-2">
        <p data-reveal class="kicker">Chapitre 5 · Ton style</p>
        <h2 id="style-titre" data-reveal="1" class="mt-5 font-display text-[clamp(34px,5vw,62px)] leading-[1.02] font-bold tracking-[-.03em] text-noir">
          Il te ressemble,<br><span class="italic text-bordeaux">pas à un modèle.</span>
        </h2>
        <p data-reveal="2" class="mt-5 max-w-[32rem] text-[18px] leading-relaxed text-ink/75">
          Essaie ici. Dans l'outil, tu as aussi la forme et la bordure de la photo, les motifs, les dégradés, la densité… et la couleur exacte de ta marque.
        </p>

        <div data-reveal="3" class="glass mt-9 flex flex-col gap-6 rounded-[var(--radius-bubble-lg)] p-5 sm:p-7">
          <fieldset>
            <legend class="label">Ta couleur</legend>
            <div class="flex flex-wrap gap-2.5">
              <button
                v-for="c in COLORS" :key="c" type="button" :aria-label="'Couleur ' + c" :aria-pressed="color === c"
                class="grid size-11 cursor-pointer place-items-center rounded-full transition duration-200 hover:scale-105"
                :class="color === c ? 'ring-2 ring-offset-2 ring-ink' : ''" :style="{ background: c }"
                @click="color = c"
              />
            </div>
          </fieldset>
          <fieldset>
            <legend class="label">Disposition</legend>
            <div class="grid grid-cols-3 gap-2 sm:grid-cols-5">
              <button
                v-for="l in LAYOUTS" :key="l.v" type="button" :aria-pressed="layout === l.v"
                class="flex min-h-11 cursor-pointer flex-col items-center gap-1.5 rounded-2xl border bg-white px-2 py-2.5 text-[12.5px] font-semibold transition"
                :class="layout === l.v ? 'border-bordeaux text-bordeaux shadow-[0_0_0_3px_rgba(109,7,26,.1)]' : 'border-line hover:border-bordeaux/40'"
                @click="layout = l.v"
              >
                <span class="relative block h-9 w-7 overflow-hidden rounded-[3px] border border-line bg-white" aria-hidden="true">
                  <i v-if="l.v === 'classic'" class="absolute inset-x-0 top-0 h-3" :style="{ background: color }" />
                  <i v-if="l.v === 'side'" class="absolute inset-y-0 left-0 w-2.5" :style="{ background: color }" />
                  <i v-if="l.v === 'clean'" class="absolute inset-x-0 top-3 h-[2px]" :style="{ background: color }" />
                  <template v-if="l.v === 'magazine'"><i class="absolute top-0 left-0 h-3.5 w-3" :style="{ background: color }" /><i class="absolute inset-x-0 top-4 h-[2px]" :style="{ background: color }" /></template>
                  <i v-if="l.v === 'bande'" class="absolute inset-x-0 top-0 h-1.5" :style="{ background: color }" />
                  <u class="absolute right-1 left-1 top-[18px] h-[2px] bg-line" /><u class="absolute right-1 left-1 top-[24px] h-[2px] bg-line" />
                </span>
                {{ l.l }}
              </button>
            </div>
          </fieldset>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <fieldset>
              <legend class="label">Fond du document</legend>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="p in PAPERS" :key="p.v" type="button" :aria-pressed="paper === p.v"
                  class="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border bg-white px-3.5 text-[13.5px] font-semibold transition"
                  :class="paper === p.v ? 'border-bordeaux text-bordeaux' : 'border-line hover:border-bordeaux/40'"
                  @click="paper = p.v"
                ><i class="size-3.5 rounded-full border border-ink/20" :style="{ background: p.c }" aria-hidden="true" />{{ p.l }}</button>
              </div>
            </fieldset>
            <fieldset>
              <legend class="label">Police</legend>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="f in FONTS" :key="f.v" type="button" :aria-pressed="font === f.v"
                  class="min-h-10 cursor-pointer rounded-full border bg-white px-3.5 text-[14px] font-semibold transition"
                  :class="font === f.v ? 'border-bordeaux text-bordeaux' : 'border-line hover:border-bordeaux/40'" :style="{ fontFamily: f.f }"
                  @click="font = f.v"
                >{{ f.l }}</button>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
