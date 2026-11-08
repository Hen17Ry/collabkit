<script setup lang="ts">
/**
 * Réplique fidèle (page 1) du document produit par l'outil de Lys Sama.
 * Dessinée à la taille réelle d'une page A4 (794 × 1123 px) puis mise à l'échelle.
 */
type Layout = 'classic' | 'side' | 'clean' | 'magazine' | 'bande'
type Paper = 'white' | 'ivory' | 'dark'
type Font = 'sys' | 'ele' | 'aff' | 'dou'

const props = withDefaults(defineProps<{
  color?: string
  layout?: Layout
  paper?: Paper
  font?: Font
  focus?: string | null
  shadow?: boolean
}>(), { color: '#7A2E8E', layout: 'classic', paper: 'white', font: 'sys', focus: null, shadow: true })

const box = ref<HTMLElement | null>(null)
const scale = ref(0.4)
let ro: ResizeObserver | null = null
onMounted(() => {
  if (!box.value) return
  ro = new ResizeObserver(([e]) => { scale.value = e.contentRect.width / 794 })
  ro.observe(box.value)
})
onBeforeUnmount(() => ro?.disconnect())

const rgb = (h: string) => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16))
const hx = (a: number[]) => '#' + a.map(v => Math.round(v).toString(16).padStart(2, '0')).join('')
const mix = (a: number[], b: number[], w: number) => a.map((v, i) => v * (1 - w) + b[i] * w)
const lum = (a: number[]) => {
  const c = a.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4) })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}
const PAPERS = {
  white: { paper: '#ffffff', ptxt: '#1d1d1d', pmut: '#555555', psoft: '#F6F4F7', pline: '#ECE7EE', pdot: '#DDD7E0', base: [255, 255, 255] },
  ivory: { paper: '#FBF7F1', ptxt: '#221F1C', pmut: '#5A544E', psoft: '#F3EDE4', pline: '#E7DFD3', pdot: '#DDD3C5', base: [251, 247, 241] },
  dark: { paper: '#17171A', ptxt: '#F2F0F3', pmut: '#B7B2BC', psoft: '#232229', pline: '#34323B', pdot: '#3C3944', base: [23, 23, 26] }
}
const FONTS: Record<Font, [string, string]> = {
  sys: ['system-ui,-apple-system,"Segoe UI",Roboto,sans-serif', 'system-ui,-apple-system,"Segoe UI",Roboto,sans-serif'],
  ele: ['"Playfair Display",Georgia,serif', '"Inter Variable",Inter,system-ui,sans-serif'],
  aff: ['"Space Grotesk",system-ui,sans-serif', '"Inter Variable",Inter,system-ui,sans-serif'],
  dou: ['Lora,Georgia,serif', '"Nunito Sans",system-ui,sans-serif']
}

const vars = computed(() => {
  const c = rgb(props.color)
  const p = PAPERS[props.paper]
  const dark = props.paper === 'dark'
  return {
    '--main': props.color,
    '--on': lum(c) > 0.45 ? '#1a1a1a' : '#ffffff',
    '--paper': p.paper, '--ptxt': p.ptxt, '--pmut': p.pmut, '--psoft': p.psoft, '--pline': p.pline, '--pdot': p.pdot,
    '--light': hx(mix(c, p.base, dark ? 0.8 : 0.88)),
    '--ink': dark ? hx(mix(c, [255, 255, 255], 0.45)) : (lum(c) > 0.35 ? hx(mix(c, [0, 0, 0], 0.45)) : props.color),
    '--dark': dark ? hx(mix(c, [0, 0, 0], 0.3)) : hx(mix(c, [0, 0, 0], 0.6)),
    '--ft': FONTS[props.font][0],
    '--fb': FONTS[props.font][1],
    transform: `scale(${scale.value})`
  }
})

const dim = (id: string) => props.focus && props.focus !== id ? 'is-dim' : props.focus === id ? 'is-on' : ''

const stats = [
  ['1 400', 'vues par reel en moyenne', 'quand un grand compte ne touche que 5 à 10 % de son audience'],
  ['4,2 %', "taux d'enregistrement", '2 à 3 fois plus que mes autres contenus'],
  ['78 %', 'de mon audience au Bénin', 'des personnes qui peuvent réellement acheter chez vous']
]
const args = [
  ['Une audience qui répond', "Mes abonnées commentent et m'écrivent, pas seulement des likes."],
  ['Une audience locale', "Une exposition utile pour une marque d'ici, pas des vues à l'étranger."],
  ['Un contenu qui reste', 'Mes contenus sont enregistrés et revus, pas oubliés en 24 h.'],
  ['Une interlocutrice directe', 'Je réponds moi-même et je tiens mes délais.']
]
const livr = ['1 Reel avec mise en scène du produit', '3 stories avec lien', '1 carrousel « comment le porter »', '1 série de retouches incluse']
const prices = [['Story', '10 000 FCFA'], ['Reel Instagram', '50 000 FCFA'], ['Post ou carrousel', '35 000 FCFA'], ['Pack campagne', '120 000 FCFA']]
</script>

<template>
  <div ref="box" class="kitbox" :class="{ 'no-shadow': !shadow }" aria-hidden="true">
    <div class="kit" :data-l="layout" :style="vars">
      <div class="sheet">
        <div class="k-head" :class="dim('head')">
          <div class="k-photo"><span>L</span></div>
          <div class="k-htext">
            <p class="k-name">Lys</p>
            <p class="k-piliers">Mode • Lifestyle • Culture</p>
            <p class="k-role">Créatrice de contenu mode · Cotonou</p>
            <p class="k-pos">Je crée du contenu pour inspirer les jeunes femmes qui ont envie de bien s'habiller, mais qui ont un problème avec le budget.</p>
          </div>
          <div class="k-sidecontact">
            <span>+229 00 00 00 00</span><span>@ton_compte</span><span>Réponse sous 48 h</span>
          </div>
        </div>

        <div class="s-body">
          <div class="k-aud" :class="dim('aud')">Les jeunes femmes qui ont envie de bien s'habiller, mais qui ont un problème avec le budget.</div>
          <div class="k-demog" :class="dim('aud')">
            <div><b>Âge :</b> 18-30 ans</div><div><b>Audience :</b> 70 % de femmes</div>
            <div><b>Villes :</b> Cotonou, Porto-Novo, Parakou</div><div><b>Pays :</b> Bénin, Togo, Côte d'Ivoire</div>
          </div>

          <div :class="dim('stats')">
            <p class="k-title">En chiffres</p>
            <div class="k-stats">
              <div v-for="s in stats" :key="s[0]" class="k-stat">
                <div class="k-val">{{ s[0] }}</div>
                <div class="k-lab">{{ s[1] }}</div>
                <div class="k-cmp">{{ s[2] }}</div>
              </div>
            </div>
          </div>

          <div :class="dim('args')">
            <p class="k-title">Pourquoi travailler avec moi</p>
            <div class="k-args">
              <div v-for="(a, i) in args" :key="a[0]" class="k-arg">
                <div class="k-num">{{ i + 1 }}</div>
                <div><b>{{ a[0] }}</b><span>{{ a[1] }}</span></div>
              </div>
            </div>
          </div>

          <div class="k-two">
            <div :class="dim('offer')">
              <p class="k-title">Ce que je propose</p>
              <ul class="k-list"><li v-for="l in livr" :key="l">{{ l }}</li></ul>
              <p class="k-title" style="margin-top:13px">Tarifs</p>
              <ul class="k-price"><li v-for="p in prices" :key="p[0]"><span>{{ p[0] }}</span><b>À partir de {{ p[1] }}</b></li></ul>
              <p class="k-tarif">Grille complète envoyée après un échange sur votre objectif.</p>
            </div>
            <div :class="dim('proof')">
              <p class="k-title">Ils l'ont vu</p>
              <p class="k-quote">« Elle a fait vivre notre pagne mieux que nos propres photos. Les clientes venaient avec la vidéo. »</p>
              <p class="k-author">Couturière (gifting)</p>
              <p class="k-title" style="margin-top:12px">Ils m'ont fait confiance</p>
              <ul class="k-list"><li>Maison Adjo</li><li>Atelier Zéphyr</li><li>Le Comptoir Bleu</li></ul>
            </div>
          </div>
        </div>

        <div class="k-foot" :class="dim('foot')">
          <span>+229 00 00 00 00</span><span>@ton_compte</span><span>Réponse sous 48 h</span><span class="k-pagenum">1 / 2</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kitbox { position: relative; width: 100%; aspect-ratio: 794 / 1123; border-radius: 1.1% / .8%; overflow: hidden;
  box-shadow: 0 2px 4px rgba(46, 2, 9, .06), 0 24px 60px rgba(46, 2, 9, .16); background: #fff; }
.kitbox.no-shadow { box-shadow: none; }
.kit { width: 794px; height: 1123px; position: absolute; top: 0; left: 0; transform-origin: top left; }
.sheet { width: 794px; height: 1123px; background: var(--paper); color: var(--ptxt); display: flex; flex-direction: column; overflow: hidden; font-family: var(--fb); transition: background .35s; }
.sheet * { transition: background-color .35s, color .35s, border-color .35s, opacity .35s, filter .35s; }
p { margin: 0; }
.s-body { flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column; gap: 16px; padding: 23px 52px 0; }
.k-head { background-color: var(--main); color: var(--on); padding: 30px 52px; display: flex; gap: 24px; align-items: center; flex: none; }
.k-photo { width: 126px; height: 126px; border-radius: 50%; border: 5px solid #fff; flex: none; background: var(--light); display: grid; place-items: center; }
.k-photo span { font: 700 54px/1 "Playfair Display", Georgia, serif; font-style: italic; color: var(--main); }
.k-name { font-size: 42px; font-weight: 800; line-height: 1; letter-spacing: -1px; font-family: var(--ft); }
.k-piliers { font-size: 13.5px; margin-top: 7px; opacity: .82; letter-spacing: .3px; }
.k-role { font-size: 15px; margin: 6px 0 11px; opacity: .9; letter-spacing: .6px; text-transform: uppercase; font-weight: 600; }
.k-pos { font-size: 15px; font-style: italic; line-height: 1.32; opacity: .96; }
.k-sidecontact { display: none; }
.k-aud { background: var(--light); border-left: 6px solid var(--main); padding: 13px 18px; font-size: 16px; line-height: 1.38; border-radius: 0 12px 12px 0; }
.k-demog { display: flex; gap: 9px; flex-wrap: wrap; margin-top: -4px; }
.k-demog div { font-size: 12px; background: var(--psoft); border: 1px solid var(--pline); border-radius: 9px; padding: 5px 9px; }
.k-title { font-size: 11.5px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--ink); margin: 0 0 9px; font-family: var(--ft); }
.k-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 13px; }
.k-stat { border: 2px solid var(--light); border-radius: 13px; padding: 11px; }
.k-val { font-size: 30px; font-weight: 800; color: var(--ink); line-height: 1; font-family: var(--ft); }
.k-lab { font-size: 13px; font-weight: 700; margin: 6px 0 4px; }
.k-cmp { font-size: 12px; color: var(--pmut); line-height: 1.35; }
.k-args { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; }
.k-arg { display: flex; gap: 11px; }
.k-num { width: 27px; height: 27px; border-radius: 50%; background: var(--main); color: var(--on); font-weight: 800; font-size: 13.5px; display: flex; align-items: center; justify-content: center; flex: none; }
.k-arg b { display: block; font-size: 14px; }
.k-arg span { font-size: 12.5px; color: var(--pmut); line-height: 1.35; }
.k-two { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; align-items: start; }
.k-list { margin: 0; padding-left: 18px; font-size: 14px; line-height: 1.5; list-style: disc; }
.k-price { margin: 0; padding: 0; list-style: none; font-size: 14px; line-height: 1.6; }
.k-price li { display: flex; justify-content: space-between; gap: 10px; border-bottom: 1px dotted var(--pdot); }
.k-price b { color: var(--ink); }
.k-tarif { font-size: 12.5px; color: var(--pmut); font-style: italic; margin-top: 7px; }
.k-quote { font-size: 13.5px; font-style: italic; line-height: 1.4; margin-bottom: 3px; }
.k-author { font-size: 12.5px; font-weight: 700; color: var(--ink); }
.k-foot { background: var(--dark); color: #fff; padding: 17px 52px; display: flex; justify-content: space-between; gap: 8px; font-size: 14px; flex: none; margin-top: 16px; }
.k-pagenum { opacity: .6; font-size: 12px; }

/* mise en avant d'un bloc (section « anatomie ») */
.is-dim { opacity: .22; filter: saturate(.4); }
.is-on { position: relative; }

/* latéral */
.kit[data-l=side] .sheet { display: grid; grid-template-columns: 232px 1fr; grid-template-rows: 1fr auto; }
.kit[data-l=side] .k-head { grid-column: 1; grid-row: 1 / 3; flex-direction: column; align-items: flex-start; justify-content: flex-start; padding: 36px 24px; gap: 14px; }
.kit[data-l=side] .s-body { grid-column: 2; grid-row: 1; padding: 30px 34px 0; }
.kit[data-l=side] .k-foot { grid-column: 2; grid-row: 2; padding: 12px 34px; font-size: 12.5px; justify-content: flex-end; background: var(--paper); color: var(--pmut); }
.kit[data-l=side] .k-foot > span:not(.k-pagenum) { display: none; }
.kit[data-l=side] .k-photo { width: 128px; height: 128px; }
.kit[data-l=side] .k-name { font-size: 33px; }
.kit[data-l=side] .k-pos { font-size: 14px; }
.kit[data-l=side] .k-role { font-size: 13px; margin: 5px 0 9px; }
.kit[data-l=side] .k-sidecontact { display: flex; flex-direction: column; gap: 8px; font-size: 12.5px; margin-top: auto; }
.kit[data-l=side] .k-two { grid-template-columns: 1fr; gap: 14px; }
.kit[data-l=side] .k-val { font-size: 25px; }
.kit[data-l=side] .k-cmp { font-size: 11px; }
.kit[data-l=side] .k-arg span { font-size: 11.5px; }

/* épuré */
.kit[data-l=clean] .k-head { background: var(--paper); color: var(--ptxt); border-bottom: 3px solid var(--main); }
.kit[data-l=clean] .k-photo { border-color: var(--light); }
.kit[data-l=clean] .k-name, .kit[data-l=clean] .k-role { color: var(--ink); }
.kit[data-l=clean] .k-piliers, .kit[data-l=clean] .k-pos { opacity: 1; color: var(--pmut); }
.kit[data-l=clean] .k-foot { background: var(--light); color: var(--ink); }
.kit[data-l=clean] .k-aud { background: var(--paper); border: 1px solid var(--pline); border-left: 6px solid var(--main); }

/* magazine */
.kit[data-l=magazine] .k-head { background: var(--paper); color: var(--ptxt); padding: 0; gap: 0; align-items: stretch; }
.kit[data-l=magazine] .k-photo { width: 192px; height: 202px; border-radius: 0; border: 0; }
.kit[data-l=magazine] .k-htext { padding: 24px 52px 20px 30px; align-self: center; }
.kit[data-l=magazine] .k-name { font-size: 46px; color: var(--ink); }
.kit[data-l=magazine] .k-role { color: var(--ink); opacity: 1; }
.kit[data-l=magazine] .k-piliers, .kit[data-l=magazine] .k-pos { color: var(--pmut); opacity: 1; }
.kit[data-l=magazine] .s-body { padding-top: 22px; border-top: 4px solid var(--main); }

/* compacte */
.kit[data-l=bande] .k-head { padding: 16px 52px; gap: 16px; }
.kit[data-l=bande] .k-photo { width: 62px; height: 62px; border-width: 3px; }
.kit[data-l=bande] .k-photo span { font-size: 28px; }
.kit[data-l=bande] .k-name { font-size: 25px; letter-spacing: -.4px; }
.kit[data-l=bande] .k-piliers { display: none; }
.kit[data-l=bande] .k-role { font-size: 12px; margin: 3px 0 5px; }
.kit[data-l=bande] .k-pos { font-size: 13px; }
</style>
