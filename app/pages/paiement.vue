<script setup lang="ts">
import { LoaderCircle, CircleX, Clock, ArrowRight } from '@lucide/vue'

// Retour de la page de paiement Moneroo : on vérifie le paiement puis on ouvre le studio.
useSeoMeta({ title: 'Paiement · Ton Media Kit', robots: 'noindex' })

const route = useRoute()
const { waHref } = useBrand()
const orderId = String(route.query.commande || '')
const paymentId = String(route.query.paymentId || '')

const state = ref<'checking' | 'pending' | 'failed' | 'error'>('checking')
const error = ref('')
let tries = 0
let timer: ReturnType<typeof setTimeout> | null = null

async function check() {
  if (!orderId) { state.value = 'error'; error.value = 'Lien de paiement incomplet.'; return }
  try {
    const r = await $fetch<{ status: 'paid' | 'pending' | 'failed' }>('/api/orders/confirm', {
      method: 'POST', body: { orderId, ...(paymentId ? { paymentId } : {}) }
    })
    if (r.status === 'paid') { window.location.replace('/studio'); return }
    if (r.status === 'failed') { state.value = 'failed'; return }
    // paiement pas encore confirmé par l'opérateur : on revérifie pendant environ 3 minutes
    state.value = tries < 2 ? 'checking' : 'pending'
    if (tries++ < 45) timer = setTimeout(check, 4000)
  } catch (e: any) {
    state.value = 'error'
    error.value = String(e?.data?.statusMessage || 'Vérification impossible pour le moment').replace(/[.!?]?$/, '.')
  }
}

onMounted(check)
onBeforeUnmount(() => { if (timer) clearTimeout(timer) })

function retry() { tries = 0; state.value = 'checking'; check() }
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="mx-auto flex w-full max-w-[1180px] items-center gap-3 px-4 py-5 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2.5 rounded-lg" aria-label="Retour à l'accueil">
        <img src="/brand/lab.png" alt="" class="h-9 w-auto" width="49" height="36">
        <span class="font-display text-[19px] font-bold">Ton Media Kit</span>
      </NuxtLink>
    </header>

    <main class="mx-auto flex w-full max-w-[560px] flex-1 flex-col justify-center px-4 pb-20 sm:px-6">
      <div class="glass rounded-[var(--radius-bubble-lg)] p-7 text-center sm:p-10" role="status" aria-live="polite">
        <template v-if="state === 'checking'">
          <span class="mx-auto grid size-16 place-items-center rounded-full bg-rose text-bordeaux"><LoaderCircle :size="28" class="animate-spin" aria-hidden="true" /></span>
          <h1 class="mt-6 font-display text-[32px] leading-tight font-bold">On vérifie ton paiement…</h1>
          <p class="mt-3 text-[16.5px] leading-relaxed text-ink/75">Quelques secondes, ton studio s'ouvre juste après.</p>
        </template>

        <template v-else-if="state === 'pending'">
          <span class="mx-auto grid size-16 place-items-center rounded-full bg-orange/15 text-orange"><Clock :size="28" aria-hidden="true" /></span>
          <h1 class="mt-6 font-display text-[32px] leading-tight font-bold">Paiement en attente</h1>
          <p class="mt-3 text-[16.5px] leading-relaxed text-ink/75">
            Si tu paies par Mobile Money, valide la demande sur ton téléphone. Cette page se met à jour toute seule.
            Tu recevras aussi ton lien d'accès par email dès que le paiement est confirmé.
          </p>
          <p class="mt-5 flex items-center justify-center gap-2 text-[14px] font-semibold text-muted-strong">
            <LoaderCircle :size="16" class="animate-spin" aria-hidden="true" /> Vérification en cours
          </p>
        </template>

        <template v-else-if="state === 'failed'">
          <span class="mx-auto grid size-16 place-items-center rounded-full bg-err/10 text-err"><CircleX :size="30" aria-hidden="true" /></span>
          <h1 class="mt-6 font-display text-[32px] leading-tight font-bold">Le paiement n'a pas abouti</h1>
          <p class="mt-3 text-[16.5px] leading-relaxed text-ink/75">Rien n'a été débité. Tu peux réessayer, avec le même moyen de paiement ou un autre.</p>
          <NuxtLink to="/commencer" class="btn btn-main mt-8 w-full">Réessayer le paiement <ArrowRight :size="17" aria-hidden="true" /></NuxtLink>
        </template>

        <template v-else>
          <span class="mx-auto grid size-16 place-items-center rounded-full bg-err/10 text-err"><CircleX :size="30" aria-hidden="true" /></span>
          <h1 class="mt-6 font-display text-[32px] leading-tight font-bold">Petit souci de vérification</h1>
          <p class="mt-3 text-[16.5px] leading-relaxed text-ink/75">{{ error }} Si tu as été débitée, ton paiement n'est pas perdu : ton accès arrivera aussi par email.</p>
          <button class="btn btn-main mt-8 w-full" @click="retry">Vérifier à nouveau</button>
        </template>

        <a :href="waHref('Bonjour, j\'ai un souci avec mon paiement Ton Media Kit.')" target="_blank" rel="noopener" class="mt-6 inline-block text-[14px] font-semibold text-bordeaux underline-offset-4 hover:underline">
          Besoin d'aide ? Écris-nous sur WhatsApp
        </a>
      </div>
    </main>
  </div>
</template>
