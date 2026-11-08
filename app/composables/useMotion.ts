import type { Ref } from 'vue'
import type { gsap as GSAP } from 'gsap'

/**
 * Lance des animations GSAP limitées à un élément racine,
 * nettoyées automatiquement quand le composant disparaît.
 */
export function useMotion(root: Ref<HTMLElement | null>, setup: (ctx: { gsap: typeof GSAP, reduce: boolean, q: (s: string) => Element[] }) => void) {
  let ctx: ReturnType<typeof GSAP.context> | null = null
  onMounted(() => {
    const { $gsap, $reduceMotion } = useNuxtApp()
    const gsap = $gsap as typeof GSAP
    if (!root.value) return
    ctx = gsap.context(() => {
      setup({ gsap, reduce: $reduceMotion as boolean, q: gsap.utils.selector(root.value!) as any })
    }, root.value)
  })
  onBeforeUnmount(() => ctx?.revert())
}

/** Fait apparaître en douceur tous les [data-reveal] d'une section, en cascade. */
export function useReveal(root: Ref<HTMLElement | null>) {
  useMotion(root, ({ gsap, reduce }) => {
    if (reduce) return
    const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
    items.forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: .7,
        delay: Number(el.dataset.reveal || 0) * .08,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      })
    })
  })
}
