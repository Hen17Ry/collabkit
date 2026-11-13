<script setup lang="ts">
import { ArrowLeft, Check, Lock, ShieldCheck, LoaderCircle, Smartphone, CreditCard } from '@lucide/vue'

useSeoMeta({ title: 'Créer mon media kit · Ton Media Kit', robots: 'noindex' })

const cfg = useRuntimeConfig().public
const { price, normalPrice, priceUsd, normalPriceUsd, promo, promoEnd } = useBrand()

const form = reactive({ name: '', email: '', phone: '' })
const errors = reactive<Record<string, string>>({})
const state = ref<'idle' | 'creating' | 'redirecting'>('idle')
const route = useRoute()
const message = ref(route.query.paiement === 'echec' ? 'Le paiement n\'a pas abouti. Tu peux réessayer, rien n\'a été débité.' : '')

const busy = computed(() => state.value !== 'idle')
const label = computed(() => ({
  idle: `Payer ${usd(priceUsd)}`,
  creating: 'Préparation…',
  redirecting: 'Ouverture du paiement…'
})[state.value])

function validate() {
  errors.name = form.name.trim().length < 2 ? 'Ton prénom, s\'il te plaît.' : ''
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()) ? '' : 'Cette adresse email ne semble pas valide.'
  errors.phone = form.phone && form.phone.replace(/\D/g, '').length < 8 ? 'Numéro incomplet.' : ''
  return !errors.name && !errors.email && !errors.phone
}

/** Crée la commande, puis envoie vers la page de paiement sécurisée Moneroo. */
async function pay() {
  message.value = ''
  if (!validate()) {
    nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    return
  }
  state.value = 'creating'
  try {
    const order = await $fetch<{ orderId: string, checkoutUrl?: string, fake?: boolean }>('/api/orders', {
      method: 'POST',
      body: { ...form }
    })
    state.value = 'redirecting'
    // au retour (ou en mode test), la page /paiement vérifie le paiement et ouvre le studio
    window.location.href = order.checkoutUrl || `/paiement?commande=${order.orderId}`
  } catch (e: any) {
    state.value = 'idle'
    message.value = e?.data?.statusMessage || 'Impossible de préparer le paiement. Vérifie ta connexion.'
  }
}

const steps = ['Tes infos', 'Paiement', 'Ton studio']
const current = computed(() => state.value === 'redirecting' ? 1 : 0)
const included = ['Le studio complet, 4 écrans', 'PDF A4 et JPG, liens cliquables', 'Envoi par email', 'Modifications illimitées']
</script>

<template>
  <div class="min-h-dvh">
    <header class="mx-auto flex max-w-[1180px] items-center gap-3 px-4 py-5 sm:px-6">
      <NuxtLink to="/" class="flex items-center gap-2.5 rounded-lg" aria-label="Retour à l'accueil">
        <img src="/brand/lab.png" alt="" class="h-9 w-auto" width="49" height="36">
        <span class="font-display text-[19px] font-bold">Ton Media Kit</span>
      </NuxtLink>
      <NuxtLink to="/" class="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold text-ink/70 hover:text-ink">
        <ArrowLeft :size="16" aria-hidden="true" /> Retour
      </NuxtLink>
    </header>

    <main class="mx-auto grid grid-cols-1 max-w-[1180px] gap-10 px-4 pt-4 pb-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:gap-16 lg:pt-10">
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
          <div class="rounded-2xl border border-line bg-white px-4 py-3.5">
            <p class="label !mb-2.5">Tu paies comme tu veux</p>
            <ul class="flex flex-col gap-2.5 text-[14.5px] leading-snug">
              <li class="flex items-start gap-3">
                <span class="grid size-8 shrink-0 place-items-center rounded-full bg-rose text-bordeaux"><Smartphone :size="16" aria-hidden="true" /></span>
                <span><b>Mobile Money</b> (MTN, Moov, Orange, Wave…) : l'équivalent en FCFA est débité, environ {{ fcfa(price) }}.</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="grid size-8 shrink-0 place-items-center rounded-full bg-rose text-bordeaux"><CreditCard :size="16" aria-hidden="true" /></span>
                <span><b>Carte bancaire</b>, depuis n'importe quel pays : ta banque convertit dans ta devise (euros, FCFA…).</span>
              </li>
            </ul>
            <p class="mt-3 border-t hairline pt-3 text-[13px] text-muted-strong">Montant facturé : <b class="text-ink">{{ usd(priceUsd) }}</b> (dollars US). Le moyen de paiement se choisit sur la page suivante.</p>
          </div>
          <div>
            <label for="f-phone" class="label">Ton numéro Mobile Money <span class="font-semibold normal-case tracking-normal text-muted">(facultatif)</span></label>
            <input id="f-phone" v-model="form.phone" class="field" type="tel" inputmode="tel" autocomplete="tel" placeholder="+229 01 00 00 00 00" maxlength="24" :aria-invalid="!!errors.phone" aria-describedby="h-phone e-phone" :disabled="busy">
            <p id="h-phone" class="mt-1.5 text-[13.5px] text-muted-strong">Pour pré-remplir le paiement.</p>
            <p v-if="errors.phone" id="e-phone" class="mt-1 text-[13.5px] font-semibold text-err">{{ errors.phone }}</p>
          </div>

          <div v-if="message" role="alert" class="rounded-2xl border border-err/20 bg-err/[.06] px-4 py-3 text-[14.5px] leading-snug text-err">
            {{ message }}
          </div>

          <button type="submit" class="btn btn-main mt-1 w-full !min-h-14 !text-[16px]" :disabled="busy" :aria-busy="busy">
            <LoaderCircle v-if="busy" :size="18" class="animate-spin" aria-hidden="true" />
            <Lock v-else :size="16" aria-hidden="true" />
            {{ label }}
          </button>
          <p class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[13px] text-muted-strong">
            <ShieldCheck :size="15" class="text-ok" aria-hidden="true" /> Paiement sécurisé par Moneroo · Mobile Money ou carte
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
              <p class="mt-1 font-display text-[22px] leading-tight font-bold">Ton Media Kit · accès complet</p>
              <p class="mt-1 text-[13.5px] text-muted-strong">par {{ cfg.brand.nom }}</p>
            </div>
          </div>
          <ul class="mt-6 flex flex-col gap-2.5 border-t hairline pt-6">
            <li v-for="x in included" :key="x" class="flex items-center gap-3 text-[15px]">
              <span class="grid size-5 shrink-0 place-items-center rounded-full bg-bordeaux text-white"><Check :size="12" :stroke-width="3" aria-hidden="true" /></span>{{ x }}
            </li>
          </ul>
          <div class="mt-6 flex items-baseline justify-between gap-3 border-t hairline pt-5">
            <span class="text-[15px] font-semibold">Total</span>
            <span class="text-right">
              <s v-if="promo" class="mr-2 text-[15px] font-semibold text-muted-strong">{{ usd(normalPriceUsd) }}</s>
              <span class="font-display text-[30px] font-bold">{{ usd(priceUsd) }}</span>
            </span>
          </div>
          <p class="mt-1 text-right text-[12.5px] text-muted-strong">
            soit environ {{ fcfa(price) }} · paiement unique, sans abonnement
          </p>
          <p v-if="promo" class="mt-4 rounded-2xl bg-orange/10 px-4 py-3 text-[13.5px] leading-snug text-[#8A3709]">
            <b>Prix de lancement</b> jusqu'au {{ promoEnd }}, au lieu de {{ fcfa(normalPrice) }}.
          </p>
        </div>
      </aside>
    </main>
  </div>
</template>
