import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduce) document.documentElement.classList.add('js-motion')
  return { provide: { gsap, ScrollTrigger, reduceMotion: reduce } }
})
