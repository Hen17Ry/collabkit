<script setup lang="ts">
useSeoMeta({
  title: 'Ton Media Kit · Prêt en dix minutes, sans page blanche',
  ogTitle: 'Ton Media Kit · Prêt en dix minutes, sans page blanche',
  description: "Une marque t'écrit et te demande ton media kit ? Crée-le en dix minutes, sans page blanche. Un outil de Lys Sama, prolongement de la série Du Lab à la Collab.",
  ogDescription: "Le document qu'une marque te réclame, prêt à envoyer en PDF. Tarifs en FCFA, liens cliquables.",
  ogImage: '/brand/lab.png'
})
</script>

<template>
  <div>
    <a href="#histoire" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Aller au contenu</a>
    <LandingNav />
    <main>
      <LandingHero />
      <LandingDays />
      <LandingTurn />
      <LandingAnatomy />
      <LandingBuilder />
      <LandingStyle />
      <LandingSteps />
      <LandingOffer />
      <LandingFaq />
      <LandingAbout />
    </main>
    <LandingFooter />
    <StickyCta />
  </div>
</template>
