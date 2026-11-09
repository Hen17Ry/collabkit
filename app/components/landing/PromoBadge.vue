<script setup lang="ts">
// Mention du prix de lancement, réutilisée partout où le prix apparaît.
withDefaults(defineProps<{ tone?: 'light' | 'dark' }>(), { tone: 'light' })
const { promo, promoEnd, normalPrice } = useBrand()
</script>

<template>
  <span
    v-if="promo"
    class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-bold leading-none"
    :class="tone === 'dark' ? 'bg-white/12 text-white' : 'bg-orange/12 text-[#A8430C]'"
  >
    <span class="relative flex size-2" aria-hidden="true">
      <span class="absolute inline-flex size-full animate-ping rounded-full bg-orange opacity-60 motion-reduce:hidden" />
      <span class="relative inline-flex size-2 rounded-full bg-orange" />
    </span>
    Prix de lancement jusqu'au {{ promoEnd }}<span class="hidden font-semibold opacity-80 sm:inline">· au lieu de {{ fcfa(normalPrice) }}</span>
  </span>
</template>
