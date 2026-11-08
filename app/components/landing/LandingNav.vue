<script setup lang="ts">
import { ArrowRight, Menu, X } from '@lucide/vue'

const { price } = useBrand()
const open = ref(false)
const scrolled = ref(false)
const progress = ref(0)

const links = [
  { href: '#histoire', label: "L'histoire" },
  { href: '#document', label: 'Le document' },
  { href: '#comment', label: 'Comment ça marche' },
  { href: '#tarif', label: 'Tarif' },
  { href: '#questions', label: 'Questions' }
]

function onScroll() {
  const h = document.documentElement
  scrolled.value = h.scrollTop > 24
  progress.value = Math.min(1, h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))
}
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
watch(open, v => { document.documentElement.style.overflow = v ? 'hidden' : '' })
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-50 transition-all duration-300" :class="scrolled ? 'py-2' : 'py-4'">
    <div class="mx-auto max-w-[1240px] px-4 sm:px-6">
      <nav
        class="flex items-center gap-3 px-3 py-2 transition-all duration-300 sm:px-4"
        :class="scrolled ? 'glass rounded-[var(--radius-bubble)]' : 'border border-transparent'"
        aria-label="Navigation principale"
      >
        <a href="#top" class="flex items-center gap-2.5 rounded-lg pr-2" aria-label="Ton Media Kit, retour en haut">
          <img src="/brand/lab.png" alt="" class="h-9 w-auto" width="49" height="36">
          <span class="leading-none">
            <span class="block font-display text-[19px] font-bold tracking-[-.02em]">Ton Media Kit</span>
            <span class="mt-0.5 block text-[9.5px] font-bold uppercase tracking-[.16em] text-muted-strong">par Lys Sama</span>
          </span>
        </a>

        <ul class="ml-auto hidden items-center gap-1 lg:flex">
          <li v-for="l in links" :key="l.href">
            <a :href="l.href" class="rounded-full px-3 py-2 text-[14px] font-semibold text-ink/75 transition hover:bg-white/70 hover:text-ink">{{ l.label }}</a>
          </li>
        </ul>

        <a href="/acces" class="ml-auto hidden rounded-full px-3 py-2 text-[14px] font-semibold text-ink/75 transition hover:text-bordeaux sm:inline-flex lg:ml-2">Déjà cliente</a>
        <NuxtLink to="/commencer" class="btn btn-main hidden !min-h-11 !px-5 !text-[14px] sm:inline-flex">
          Créer mon media kit <ArrowRight :size="16" aria-hidden="true" />
        </NuxtLink>

        <button
          class="ml-auto grid size-11 cursor-pointer place-items-center rounded-full bg-white/70 sm:ml-1 lg:hidden"
          :aria-expanded="open" aria-controls="menu-mobile" :aria-label="open ? 'Fermer le menu' : 'Ouvrir le menu'"
          @click="open = !open"
        >
          <X v-if="open" :size="20" aria-hidden="true" /><Menu v-else :size="20" aria-hidden="true" />
        </button>
      </nav>
    </div>
    <div class="absolute inset-x-0 top-0 h-[3px] origin-left bg-bordeaux transition-transform duration-150" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />

    <Transition name="sheet">
      <div v-if="open" id="menu-mobile" class="fixed inset-0 top-0 z-[-1] bg-paper/95 px-6 pt-28 backdrop-blur-xl lg:hidden">
        <ul class="flex flex-col">
          <li v-for="(l, i) in links" :key="l.href" class="border-b hairline">
            <a :href="l.href" class="flex items-baseline gap-4 py-4 font-display text-[28px] font-bold" @click="open = false">
              <span class="font-display text-[15px] italic text-bordeaux">0{{ i + 1 }}</span>{{ l.label }}
            </a>
          </li>
        </ul>
        <div class="mt-8 flex flex-col gap-3">
          <NuxtLink to="/commencer" class="btn btn-main w-full" @click="open = false">Créer mon media kit · {{ fcfa(price) }}</NuxtLink>
          <a href="/acces" class="btn btn-ghost w-full">J'ai déjà payé, je reprends</a>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity .25s ease, transform .3s var(--ease-out-soft); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
