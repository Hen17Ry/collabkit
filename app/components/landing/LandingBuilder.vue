<script setup lang="ts">
// Listes reprises de l'outil : la phrase de positionnement et les comparaisons de chiffres.
const rows = [
  { k: 'v', label: 'Je crée du contenu pour…', opts: ['inspirer', 'divertir', 'éduquer', 'faire découvrir', 'rassurer'] },
  { k: 'q', label: 'Pour qui', opts: ['les jeunes femmes', 'les étudiantes', 'les jeunes mamans', 'les entrepreneures', 'les familles'] },
  { k: 'e', label: 'Qui ont envie de…', opts: ["bien s'habiller", 'consommer local', "prendre soin d'elles", 'sortir et découvrir leur ville', 'monter leur business'] },
  { k: 'p', label: 'Mais qui ont un problème avec…', opts: ['le budget', 'le manque de temps', "le manque d'adresses fiables", 'la peur de se tromper', 'les arnaques en ligne'] }
] as const
const pick = reactive<Record<string, number>>({ v: 0, q: 0, e: 0, p: 0 })
const word = (k: string) => rows.find(r => r.k === k)!.opts[pick[k]]

const STATS = [
  { v: '1 400', l: 'vues par reel en moyenne', c: ['quand un grand compte ne touche que 5 à 10 % de son audience', '2 fois plus que la moyenne de mon secteur', 'sur une audience construite sans publicité'] },
  { v: '6,8 %', l: "taux d'engagement", c: ['2 à 3 fois la moyenne des comptes de ma taille', 'quand la moyenne du secteur est à 1 à 2 %'] },
  { v: '78 %', l: 'de mon audience au Bénin', c: ['des personnes qui peuvent réellement acheter chez vous', "une exposition utile pour une marque d'ici"] }
]
const stat = ref(0)
const cmp = ref(0)

const touched = ref(false)
function choose(k: string, i: number) { touched.value = true; pick[k] = i }
function chooseStat(i: number) { touched.value = true; stat.value = i; cmp.value = 0 }

const root = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval> | null = null
let io: IntersectionObserver | null = null
let visible = false
onBeforeUnmount(() => { io?.disconnect(); if (timer) clearInterval(timer) })
onMounted(() => {
  const { $reduceMotion } = useNuxtApp()
  if ($reduceMotion) return
  io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting }, { threshold: .3 })
  if (root.value) io.observe(root.value)
  const order = ['v', 'q', 'e', 'p']
  let n = 0
  timer = setInterval(() => {
    if (!visible || touched.value) return
    const k = order[n % 4]
    pick[k] = (pick[k] + 1) % rows.find(r => r.k === k)!.opts.length
    cmp.value = (cmp.value + 1) % STATS[stat.value].c.length
    n++
  }, 2200)
})
useReveal(root)
</script>

<template>
  <section id="comment" ref="root" aria-labelledby="builder-titre" class="relative py-24 sm:py-32">
    <div class="mx-auto max-w-[1240px] px-4 sm:px-6">
      <div class="grid items-end gap-6 lg:grid-cols-2">
        <div>
          <p data-reveal class="kicker">Chapitre 4 · La méthode</p>
          <h2 id="builder-titre" data-reveal="1" class="mt-5 font-display text-[clamp(34px,5vw,62px)] leading-[1.02] font-bold tracking-[-.03em] text-noir">
            Tu choisis.<br><span class="italic text-bordeaux">L'outil écrit.</span>
          </h2>
        </div>
        <p data-reveal="2" class="max-w-[30rem] text-[18px] leading-relaxed text-ink/75 lg:justify-self-end">
          Tu n'as presque rien à rédiger. Touche les mots ci-dessous : c'est exactement comme ça que se construit ta phrase de positionnement.
        </p>
      </div>

      <div class="mt-14 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <!-- phrase de positionnement -->
        <div data-reveal class="glass rounded-[var(--radius-bubble-lg)] p-5 sm:p-8">
          <div class="flex flex-col gap-5">
            <div v-for="r in rows" :key="r.k">
              <p class="label" :id="'row-' + r.k">{{ r.label }}</p>
              <div class="flex flex-wrap gap-2" role="radiogroup" :aria-labelledby="'row-' + r.k">
                <button
                  v-for="(o, i) in r.opts" :key="o" type="button" role="radio" :aria-checked="pick[r.k] === i"
                  class="min-h-10 cursor-pointer rounded-full border px-4 text-[14.5px] font-semibold transition duration-200"
                  :class="pick[r.k] === i ? 'border-bordeaux bg-bordeaux text-white shadow-[0_6px_16px_rgba(109,7,26,.25)]' : 'border-line bg-white text-ink hover:border-bordeaux/50'"
                  @click="choose(r.k, i)"
                >{{ o }}</button>
              </div>
            </div>
          </div>
          <div class="mt-8 rounded-[var(--radius-bubble)] border-l-[6px] border-bordeaux bg-rose px-5 py-5 sm:px-6">
            <p class="text-[11px] font-bold uppercase tracking-[.14em] text-bordeaux">La phrase obtenue</p>
            <p class="mt-2 font-display text-[clamp(20px,2.4vw,28px)] leading-snug italic text-noir" aria-live="polite">
              Je crée du contenu pour{{ ' ' }}<Transition name="swap" mode="out-in"><b :key="word('v')" class="not-italic text-bordeaux">{{ word('v') }}</b></Transition>{{ ' ' }}<Transition name="swap" mode="out-in"><b :key="word('q')" class="not-italic text-bordeaux">{{ word('q') }}</b></Transition>{{ ' ' }}qui ont envie de{{ ' ' }}<Transition name="swap" mode="out-in"><b :key="word('e')" class="not-italic text-bordeaux">{{ word('e') }}</b></Transition>, mais qui ont un problème avec{{ ' ' }}<Transition name="swap" mode="out-in"><b :key="word('p')" class="not-italic text-bordeaux">{{ word('p') }}</b></Transition>.
            </p>
          </div>
        </div>

        <!-- chiffres + comparaison -->
        <div data-reveal="1" class="flex flex-col rounded-[var(--radius-bubble-lg)] bg-noir p-5 text-white sm:p-8">
          <p class="text-[11px] font-bold uppercase tracking-[.14em] text-white/60">Tes chiffres, avec leur contexte</p>
          <div class="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Exemples de chiffres">
            <button
              v-for="(s, i) in STATS" :key="s.l" type="button" role="tab" :aria-selected="stat === i"
              class="min-h-10 cursor-pointer rounded-full border px-3.5 text-[13px] font-semibold transition"
              :class="stat === i ? 'border-white bg-white text-noir' : 'border-white/20 text-white/80 hover:border-white/50'"
              @click="chooseStat(i)"
            >{{ s.l }}</button>
          </div>
          <div class="mt-auto pt-10">
            <Transition name="swap" mode="out-in">
              <p :key="stat" class="font-display text-[clamp(56px,7vw,88px)] leading-none font-bold tracking-[-.03em]">{{ STATS[stat].v }}</p>
            </Transition>
            <p class="mt-2 text-[17px] font-semibold">{{ STATS[stat].l }}</p>
            <div class="mt-5 border-t border-white/15 pt-5">
              <p class="text-[11px] font-bold uppercase tracking-[.14em] text-orange">L'outil te propose</p>
              <Transition name="swap" mode="out-in">
                <p :key="stat + '-' + cmp" class="mt-2 text-[16px] leading-relaxed text-white/85" aria-live="polite">{{ STATS[stat].c[cmp % STATS[stat].c.length] }}</p>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.swap-enter-active, .swap-leave-active { transition: opacity .22s ease, transform .3s var(--ease-out-soft); display: inline-block; }
.swap-enter-from { opacity: 0; transform: translateY(8px); }
.swap-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
