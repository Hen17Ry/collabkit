<script setup lang="ts">
import { ArrowLeft, ArrowRight, MailCheck, LoaderCircle } from '@lucide/vue'

useSeoMeta({ title: 'Retrouver mon media kit · Ton Media Kit', robots: 'noindex' })

const route = useRoute()
const { data: session } = await useFetch<{ ok: boolean, name?: string }>('/api/session', { key: 'session' })

const email = ref('')
const error = ref('')
const sent = ref(false)
const loading = ref(false)
const invalidLink = computed(() => route.query.lien === 'invalide')

async function send() {
  error.value = ''
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { error.value = 'Cette adresse email ne semble pas valide.'; return }
  loading.value = true
  try {
    await $fetch('/api/access/link', { method: 'POST', body: { email: email.value.trim() } })
    sent.value = true
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Envoi impossible pour le moment.'
  } finally { loading.value = false }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="mx-auto flex w-full max-w-[1180px] items-center gap-3 px-4 py-5 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2.5 rounded-lg" aria-label="Retour à l'accueil">
        <img src="/brand/lab.png" alt="" class="h-9 w-auto" width="49" height="36">
        <span class="font-display text-[19px] font-bold">Ton Media Kit</span>
      </NuxtLink>
      <NuxtLink to="/" class="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold text-ink/70 hover:text-ink">
        <ArrowLeft :size="16" aria-hidden="true" /> Accueil
      </NuxtLink>
    </header>

    <main class="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-4 pb-20 sm:px-6">
      <div v-if="session?.ok" class="glass rounded-[var(--radius-bubble-lg)] p-7 sm:p-10">
        <p class="kicker">Bon retour</p>
        <h1 class="mt-4 font-display text-[clamp(32px,6vw,46px)] leading-[1.05] font-bold tracking-[-.03em]">
          {{ session.name }}, <span class="italic text-bordeaux">ton studio est là.</span>
        </h1>
        <p class="mt-4 text-[16.5px] leading-relaxed text-ink/75">Ton media kit t'attend tel que tu l'as laissé.</p>
        <a href="/studio" class="btn btn-main mt-8 w-full">Ouvrir mon studio <ArrowRight :size="17" aria-hidden="true" /></a>
      </div>

      <div v-else class="glass rounded-[var(--radius-bubble-lg)] p-7 sm:p-10">
        <template v-if="!sent">
          <p class="kicker">Déjà cliente</p>
          <h1 class="mt-4 font-display text-[clamp(32px,6vw,46px)] leading-[1.05] font-bold tracking-[-.03em]">
            Retrouve <span class="italic text-bordeaux">ton media kit.</span>
          </h1>
          <p v-if="invalidLink" role="alert" class="mt-5 rounded-2xl bg-err/[.06] px-4 py-3 text-[14.5px] text-err">Ce lien n'est plus valide. Demande-en un nouveau ci-dessous.</p>
          <p class="mt-4 text-[16.5px] leading-relaxed text-ink/75">
            Entre l'adresse utilisée lors du paiement : on t'envoie ton lien personnel pour ouvrir ton studio sur cet appareil.
          </p>
          <form class="mt-7 flex flex-col gap-4" novalidate @submit.prevent="send">
            <div>
              <label for="a-email" class="label">Ton email</label>
              <input id="a-email" v-model="email" class="field" type="email" inputmode="email" autocomplete="email" :aria-invalid="!!error" aria-describedby="a-err">
              <p v-if="error" id="a-err" class="mt-1.5 text-[13.5px] font-semibold text-err">{{ error }}</p>
            </div>
            <button class="btn btn-main w-full" :disabled="loading" :aria-busy="loading">
              <LoaderCircle v-if="loading" :size="18" class="animate-spin" aria-hidden="true" /> Recevoir mon lien
            </button>
          </form>
          <p class="mt-6 text-center text-[14px] text-muted-strong">Pas encore de media kit ? <NuxtLink to="/commencer" class="font-bold text-bordeaux underline-offset-4 hover:underline">Je commence</NuxtLink></p>
        </template>
        <div v-else class="text-center" role="status">
          <span class="mx-auto grid size-16 place-items-center rounded-full bg-bordeaux text-white shadow-[0_10px_26px_rgba(109,7,26,.35)]"><MailCheck :size="28" aria-hidden="true" /></span>
          <h1 class="mt-6 font-display text-[34px] leading-tight font-bold">Regarde ta boîte mail.</h1>
          <p class="mt-3 text-[16.5px] leading-relaxed text-ink/75">
            Si une commande existe pour <b>{{ email }}</b>, ton lien vient de partir. Pense à vérifier les spams.
          </p>
          <button class="mt-6 cursor-pointer text-[14px] font-bold text-bordeaux underline-offset-4 hover:underline" @click="sent = false">Utiliser une autre adresse</button>
        </div>
      </div>
    </main>
  </div>
</template>
