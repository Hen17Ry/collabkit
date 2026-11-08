<script setup lang="ts">
const { brand, waHref } = useBrand()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t hairline pb-28 sm:pb-10">
    <div class="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 pt-10 sm:px-6 md:flex-row md:items-center">
      <div class="flex items-center gap-3">
        <img src="/brand/lab.png" alt="" class="h-11 w-auto" width="60" height="44" loading="lazy">
        <p class="text-[13.5px] leading-snug text-muted-strong">
          <b class="font-display text-[16px] text-ink">Collab Kit</b><br>
          Le prolongement de la série « {{ brand.serie }} » de {{ brand.nom }}.
        </p>
      </div>
      <nav class="flex flex-wrap gap-x-6 gap-y-2 text-[14px] font-semibold text-ink/75 md:ml-auto" aria-label="Pied de page">
        <a href="/acces" class="py-1 hover:text-bordeaux">Retrouver mon media kit</a>
        <a :href="waHref()" target="_blank" rel="noopener" class="py-1 hover:text-bordeaux">WhatsApp</a>
        <a :href="brand.ig" target="_blank" rel="noopener" class="py-1 hover:text-bordeaux">Instagram</a>
      </nav>
    </div>
    <p class="mx-auto mt-8 max-w-[1240px] px-4 text-[12px] text-muted-strong sm:px-6">© {{ year }} {{ brand.nom }} · Cotonou, Bénin</p>
  </footer>
</template>
