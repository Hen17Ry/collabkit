<script setup lang="ts">
import { CheckCheck } from '@lucide/vue'

export type ChatMsg = { from: 'brand' | 'me' | 'sep', text: string, time?: string }

const props = withDefaults(defineProps<{
  messages: ChatMsg[]
  visible?: number
  typing?: 'brand' | 'me' | null
  seen?: string
  compact?: boolean
}>(), { visible: 99, typing: null, seen: '', compact: false })

const shown = computed(() => props.messages.slice(0, props.visible))
const lastMe = computed(() => {
  let idx = -1
  shown.value.forEach((m, i) => { if (m.from === 'me') idx = i })
  return idx
})
</script>

<template>
  <div class="chat glass !bg-white/85 overflow-hidden rounded-[var(--radius-bubble-lg)]" :class="compact ? 'text-[13.5px]' : 'text-[14.5px]'">
    <div class="flex items-center gap-3 border-b hairline bg-white/70 px-4 py-3">
      <div class="grid size-10 shrink-0 place-items-center rounded-full bg-teal font-display text-[15px] font-bold italic text-white" aria-hidden="true">MA</div>
      <div class="min-w-0 leading-tight">
        <p class="truncate text-[14px] font-bold">Maison Adjo</p>
        <p class="truncate text-[12px] text-muted-strong">Boutique de prêt-à-porter · Cotonou</p>
      </div>
      <span class="ml-auto rounded-full bg-rose px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[.1em] text-bordeaux">Marque</span>
    </div>

    <ol class="flex flex-col gap-2 px-3.5 py-4 sm:px-4" :class="compact ? 'min-h-[260px]' : 'min-h-[330px]'" aria-live="polite">
      <TransitionGroup name="msg">
        <li v-for="(m, i) in shown" :key="i + m.text" :class="m.from === 'sep' ? 'self-center' : m.from === 'me' ? 'self-end' : 'self-start'" class="max-w-[85%]">
          <span v-if="m.from === 'sep'" class="my-2 inline-block rounded-full bg-ink/[.06] px-3 py-1 text-[11px] font-bold uppercase tracking-[.12em] text-muted-strong">{{ m.text }}</span>
          <template v-else>
            <p
              class="px-3.5 py-2.5 leading-snug shadow-[0_2px_10px_rgba(28,34,74,.06)]"
              :class="m.from === 'me'
                ? 'rounded-[18px_18px_4px_18px] bg-bordeaux text-white'
                : 'rounded-[4px_18px_18px_18px] bg-white text-ink'"
            >{{ m.text }}</p>
            <p v-if="m.from === 'me' && i === lastMe && seen" class="mt-1 flex items-center justify-end gap-1 text-[11px] font-semibold text-muted-strong">
              <CheckCheck :size="13" class="text-teal" aria-hidden="true" /> {{ seen }}
            </p>
          </template>
        </li>
      </TransitionGroup>
      <li v-if="typing" :class="typing === 'me' ? 'self-end' : 'self-start'" aria-label="En train d'écrire">
        <span class="typing inline-flex gap-1 px-4 py-3.5" :class="typing === 'me' ? 'rounded-[18px_18px_4px_18px] bg-bordeaux/90' : 'rounded-[4px_18px_18px_18px] bg-white'">
          <i /><i /><i />
        </span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.msg-enter-active { transition: opacity .4s ease, transform .5s var(--ease-spring); }
.msg-enter-from { opacity: 0; transform: translateY(10px) scale(.96); }
.typing i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; color: #b9b0b4; animation: dot 1.1s infinite ease-in-out; }
.bg-bordeaux\/90 i { color: #fff; }
.typing i:nth-child(2) { animation-delay: .15s; }
.typing i:nth-child(3) { animation-delay: .3s; }
@keyframes dot { 0%, 60%, 100% { transform: translateY(0); opacity: .5; } 30% { transform: translateY(-4px); opacity: 1; } }
</style>
