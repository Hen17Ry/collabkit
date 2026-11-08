<script setup lang="ts">
import { ArrowRight } from '@lucide/vue'

// Barre d'action en bas d'écran sur téléphone, après le premier écran.
const { price } = useBrand()
const show = ref(false)
function onScroll() {
  const y = window.scrollY
  const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 520
  show.value = y > window.innerHeight * .8 && !nearEnd
}
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="bar">
    <div v-if="show" class="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:hidden">
      <div class="glass flex items-center gap-3 rounded-[var(--radius-bubble)] p-2.5 pl-4">
        <p class="text-[13px] leading-tight"><b class="block font-display text-[16px]">{{ fcfa(price) }}</b><span class="text-muted-strong">paiement unique</span></p>
        <NuxtLink to="/commencer" class="btn btn-main ml-auto !min-h-12 !px-5">Créer le mien <ArrowRight :size="16" aria-hidden="true" /></NuxtLink>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.bar-enter-active, .bar-leave-active { transition: transform .35s var(--ease-out-soft), opacity .25s; }
.bar-enter-from, .bar-leave-to { transform: translateY(110%); opacity: 0; }
</style>
