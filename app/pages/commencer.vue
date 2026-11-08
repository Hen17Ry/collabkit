<script setup lang="ts">
import { ArrowLeft, Check, Lock, ShieldCheck, LoaderCircle } from '@lucide/vue'

useSeoMeta({ title: 'Créer mon media kit · Collab Kit', robots: 'noindex' })

const cfg = useRuntimeConfig().public
const { price } = useBrand()

const form = reactive({ name: '', email: '', phone: '' })
const errors = reactive<Record<string, string>>({})
const state = ref<'idle' | 'creating' | 'paying' | 'verifying' | 'done'>('idle')
const message = ref('')
const pending = ref<{ orderId: string, transactionId: string } | null>(null)

const busy = computed(() => state.value !== 'idle')
const label = computed(() => ({
  idle: `Payer ${fcfa(price)}`,
  creating: 'Préparation…',
  paying: 'Paiement en cours…',
  verifying: 'Vérification du paiement…',
  done: 'Ouverture de ton studio…'
})[state.value])

function validate() {
  errors.name = form.name.trim().length < 2 ? 'Ton prénom, s\'il te plaît.' : ''
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()) ? '' : 'Cette adresse email ne semble pas valide.'
  errors.phone = form.phone && form.phone.replace(/\D/g, '').length < 8 ? 'Numéro incomplet.' : ''
  return !errors.name && !errors.email && !errors.phone
}

async function confirm(orderId: string, transactionId: string) {
  state.value = 'verifying'
  pending.value = { orderId, transactionId }
  try {
    await $fetch('/api/orders/confirm', { method: 'POST', body: { orderId, transactionId } })
    state.value = 'done'
    sessionStorage.removeItem('ck_pending')
    window.location.href = '/studio'
  } catch (e: any) {
    state.value = 'idle'
    sessionStorage.setItem('ck_pending', JSON.stringify({ orderId, transactionId }))
    message.value = (e?.data?.statusMessage || e?.statusMessage || 'Vérification impossible')
      + '. Ton paiement n\'est pas perdu : réessaie la vérification, ou écris-nous sur WhatsApp.'
  }
}

async function pay() {
  message.value = ''
  if (!validate()) {
    nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    return
  }
  state.value = 'creating'
  let order: { orderId: string, amount: number }
  try {
    order = await $fetch('/api/orders', { method: 'POST', body: { ...form } })
  } catch (e: any) {
    state.value = 'idle'
    message.value = e?.data?.statusMessage || 'Impossible de préparer la commande. Vérifie ta connexion.'
    return
  }

  if (cfg.fakePayment) return confirm(order.orderId, 'dev-' + order.orderId)

  if (!cfg.kkiapayPublicKey) {
    state.value = 'idle'
    message.value = 'Le paiement n\'est pas encore configuré sur ce site.'
    return
  }

  state.value = 'paying'
  const k = await import('kkiapay')
  k.removeKkiapayListener('success')
  k.removeKkiapayListener('failed')
  k.addSuccessListener((r: { transactionId: string }) => confirm(order.orderId, r.transactionId))
  k.addFailedListener(() => { state.value = 'idle'; message.value = 'Le paiement n\'a pas abouti. Tu peux réessayer.' })
  k.addKkiapayCloseListener(() => { if (state.value === 'paying') state.value = 'idle' })
  k.openKkiapayWidget({
    amount: order.amount,
    key: cfg.kkiapayPublicKey,
    sandbox: !!cfg.kkiapaySandbox,
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.replace(/\D/g, '') || undefined,
    reason: 'Collab Kit · media kit',
    data: JSON.stringify({ orderId: order.orderId })
  })
}

onMounted(() => {
  try {
    const p = JSON.parse(sessionStorage.getItem('ck_pending') || 'null')
    if (p?.orderId && p?.transactionId) {
      pending.value = p
      message.value = 'Un paiement attend encore sa vérification.'
    }
  } catch {}
})
onBeforeUnmount(async () => {
  if (!import.meta.client) return
  const k = await import('kkiapay').catch(() => null)
  k?.removeKkiapayListener('success')
  k?.removeKkiapayListener('failed')
})

const steps = ['Tes infos', 'Paiement', 'Ton studio']
const current = computed(() => state.value === 'idle' || state.value === 'creating' ? 0 : state.value === 'paying' ? 1 : 2)
const included = ['Le studio complet, 4 écrans', 'PDF A4 et JPG, liens cliquables', 'Envoi par email', 'Modifications illimitées']
</script>

<template>
  <div class="min-h-dvh">
    <header class="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-5 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2.5 rounded-lg" aria-label="Retour à l'accueil">
        <img src="/brand/lab.png" alt="" class="h-9 w-auto" width="49" height="36">
        <span class="font-display text-[19px] font-bold">Collab Kit</span>
      </NuxtLink>
      <NuxtLink to="/" class="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold text-ink/70 hover:text-ink">
        <ArrowLeft :size="16" aria-hidden="true" /> Retour
      </NuxtLink>
    </header>

    <main class="mx-auto grid max-w-[1180px] gap-10 px-4 pt-4 pb-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:pt-10">
      <section aria-labelledby="pay-titre">
        <ol class="flex gap-2" aria-label="Étapes">
          <li v-for="(s, i) in steps" :key="s" class="flex-1" :aria-current="i === current ? 'step' : undefined">
            <span class="block h-[3px] rounded-full transition-colors duration-500" :class="i <= current ? 'bg-bordeaux' : 'bg-ink/10'" />
            <span class="mt-2.5 flex items-baseline gap-1.5 text-[11px] font-bold uppercase tracking-[.1em]" :class="i <= current ? 'text-ink' : 'text-muted-strong'">
              <b class="font-display text-[15px] normal-case italic text-bordeaux">{{ i + 1 }}</b>{{ s }}
            </span>
          </li>
        </ol>

        <h1 id="pay-titre" class="mt-10 font-display text-[clamp(34px,5vw,56px)] leading-[1.02] font-bold tracking-[-.03em] text-noir">
          Encore une minute, <span class="italic text-bordeaux">et tu commences.</span>
        </h1>
        <p class="mt-4 max-w-[34rem] text-[17px] leading-relaxed text-ink/75">
          Ton accès et ton media kit arrivent à cette adresse. Garde-la sous la main : c'est ta clé pour revenir le modifier.
        </p>

        <form class="glass mt-8 flex flex-col gap-5 rounded-[var(--radius-bubble-lg)] p-5 sm:p-8" novalidate @submit.prevent="pay">
          <div>
            <label for="f-name" class="label">Ton prénom</label>
            <input id="f-name" v-model="form.name" class="field" autocomplete="given-name" maxlength="60" :aria-invalid="!!errors.name" aria-describedby="e-name" :disabled="busy" @blur="errors.name && validate()">
            <p v-if="errors.name" id="e-name" class="mt-1.5 text-[13.5px] font-semibold text-err">{{ errors.name }}</p>
          </div>
          <div>
            <label for="f-email" class="label">Ton email</label>
            <input id="f-email" v-model="form.email" class="field" type="email" inputmode="email" autocomplete="email" maxlength="120" :aria-invalid="!!errors.email" aria-describedby="h-email e-email" :disabled="busy" @blur="errors.email && validate()">
            <p id="h-email" class="mt-1.5 text-[13.5px] text-muted-strong">On t'y envoie ton lien d'accès, puis ton media kit en PDF.</p>
            <p v-if="errors.email" id="e-email" class="mt-1 text-[13.5px] font-semibold text-err">{{ errors.email }}</p>
          </div>
          <div>
            <label for="f-phone" class="label">Ton numéro Mobile Money <span class="font-semibold normal-case tracking-normal text-muted">(facultatif)</span></label>
            <input id="f-phone" v-model="form.phone" class="field" type="tel" inputmode="tel" autocomplete="tel" placeholder="+229 01 00 00 00 00" maxlength="24" :aria-invalid="!!errors.phone" aria-describedby="h-phone e-phone" :disabled="busy">
            <p id="h-phone" class="mt-1.5 text-[13.5px] text-muted-strong">Pour pré-remplir le paiement.</p>
            <p v-if="errors.phone" id="e-phone" class="mt-1 text-[13.5px] font-semibold text-err">{{ errors.phone }}</p>
          </div>

          <div v-if="message" role="alert" class="rounded-2xl border border-err/20 bg-err/[.06] px-4 py-3 text-[14.5px] leading-snug text-err">
            {{ message }}
            <button v-if="pending && state === 'idle'" type="button" class="mt-2 block cursor-pointer font-bold underline underline-offset-4" @click="confirm(pending.orderId, pending.transactionId)">
              Réessayer la vérification
            </button>
          </div>

          <button type="submit" class="btn btn-main mt-1 w-full !min-h-14 !text-[16px]" :disabled="busy" :aria-busy="busy">
            <LoaderCircle v-if="busy" :size="18" class="animate-spin" aria-hidden="true" />
            <Lock v-else :size="16" aria-hidden="true" />
            {{ label }}
          </button>
          <p class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[13px] text-muted-strong">
            <ShieldCheck :size="15" class="text-ok" aria-hidden="true" /> Paiement sécurisé par KKiaPay · Mobile Money ou carte
          </p>
          <p v-if="cfg.fakePayment" class="rounded-xl bg-orange/10 px-3 py-2 text-center text-[12.5px] font-semibold text-orange">Mode test : le paiement est simulé.</p>
        </form>
      </section>

      <aside class="lg:pt-24" aria-label="Récapitulatif">
        <div class="glass relative overflow-hidden rounded-[var(--radius-bubble-lg)] p-6 sm:p-8 lg:sticky lg:top-8">
          <div class="flex items-start gap-5">
            <div class="w-[96px] shrink-0 rotate-[-4deg]"><KitMini color="#6D071A" /></div>
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[.14em] text-muted-strong">Ta commande</p>
              <p class="mt-1 font-display text-[22px] leading-tight font-bold">Collab Kit · accès complet</p>
              <p class="mt-1 text-[13.5px] text-muted-strong">par {{ cfg.brand.nom }}</p>
            </div>
          </div>
          <ul class="mt-6 flex flex-col gap-2.5 border-t hairline pt-6">
            <li v-for="x in included" :key="x" class="flex items-center gap-3 text-[15px]">
              <span class="grid size-5 shrink-0 place-items-center rounded-full bg-bordeaux text-white"><Check :size="12" :stroke-width="3" aria-hidden="true" /></span>{{ x }}
            </li>
          </ul>
          <div class="mt-6 flex items-baseline justify-between border-t hairline pt-5">
            <span class="text-[15px] font-semibold">Total</span>
            <span class="font-display text-[30px] font-bold">{{ fcfa(price) }}</span>
          </div>
          <p class="mt-1 text-right text-[12.5px] text-muted-strong">Paiement unique, sans abonnement</p>
        </div>
      </aside>
    </main>
  </div>
</template>
