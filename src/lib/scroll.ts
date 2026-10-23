import Lenis from 'lenis'

let lenis: Lenis | null = null
let animationFrame = 0

export function initSmoothScroll(reducedMotion = false) {
  if (typeof window === 'undefined' || lenis) return lenis

  lenis = new Lenis({
    duration: reducedMotion ? 0.2 : 1.15,
    lerp: reducedMotion ? 1 : 0.085,
    smoothWheel: !reducedMotion,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
    syncTouch: false,
    autoRaf: false,
  })

  const raf = (time: number) => {
    lenis?.raf(time)
    animationFrame = requestAnimationFrame(raf)
  }
  animationFrame = requestAnimationFrame(raf)
  return lenis
}

export function getLenis() {
  return lenis
}

export function destroySmoothScroll() {
  cancelAnimationFrame(animationFrame)
  lenis?.destroy()
  lenis = null
}

export function getChapterScrollTarget(index: number) {
  if (typeof window === 'undefined') return 0
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-index]'))
  const section = sections[index]
  if (!section) return 0
  if (index === 0) return 0
  const anchor = section.offsetTop - window.innerHeight * 0.55
  return Math.max(0, anchor + 2)
}

export function scrollToY(y: number, immediate = false, duration = 1.55) {
  if (typeof window === 'undefined') return
  if (lenis) {
    lenis.scrollTo(y, {
      duration,
      immediate,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    })
    return
  }
  window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
}

export function scrollToChapter(index: number, immediate = false) {
  scrollToY(getChapterScrollTarget(index), immediate)
}

export function scrollToTop(immediate = false) {
  scrollToY(0, immediate)
}

export function lockScroll() {
  lenis?.stop()
  document.documentElement.classList.add('scroll-locked')
}

export function unlockScroll() {
  lenis?.start()
  document.documentElement.classList.remove('scroll-locked')
}

export function scrollToSection(selector: string) {
  const element = document.querySelector(selector)
  if (!element) return
  const top = (element as HTMLElement).offsetTop - 28
  scrollToY(top, false, 1.4)
}
