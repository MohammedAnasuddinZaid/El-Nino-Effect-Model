import { useEffect } from 'react'
import { CHAPTERS } from '../data/chapters'
import { initSmoothScroll, getLenis } from '../lib/scroll'
import { scrollSignals, useExperience } from '../store/useExperience'

type SectionMetric = {
  top: number
  height: number
  activation: number
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

export function useScrollExperience() {
  const setActiveChapter = useExperience((state) => state.setActiveChapter)
  const reducedMotion = useExperience((state) => state.reducedMotion)

  useEffect(() => {
    const lenis = initSmoothScroll(reducedMotion)
    let metrics: SectionMetric[] = []
    let lastScroll = window.scrollY
    let frame = 0

    const measure = () => {
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter-index]'))
      scrollSignals.sections = sections
      const height = window.innerHeight
      scrollSignals.viewportHeight = height
      metrics = sections.map((section, index) => {
        const top = section.offsetTop
        return {
          top,
          height: section.offsetHeight,
          activation: index === 0 ? 0 : top - height * 0.55,
        }
      })
    }

    const update = () => {
      frame = 0
      const y = window.scrollY
      const height = window.innerHeight
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - height)
      let active = 0
      for (let i = 0; i < metrics.length; i += 1) {
        if (y + 2 >= metrics[i].activation) active = i
      }

      const current = metrics[active]
      const next = metrics[active + 1]
      const start = current?.activation ?? 0
      const end = active >= CHAPTERS.length - 1 ? maxScroll : (next?.activation ?? maxScroll)
      const local = clamp((y - start) / Math.max(1, end - start))

      scrollSignals.chapter = active
      scrollSignals.chapterFloat = active + local
      scrollSignals.local = local
      scrollSignals.global = clamp(y / maxScroll)
      scrollSignals.velocity = y - lastScroll
      scrollSignals.viewportHeight = height
      lastScroll = y

      const state = useExperience.getState()
      if (state.activeChapter !== active) {
        state.setActiveChapter(active)
      }
      if (state.autoTour && scrollSignals.velocity !== 0) {
        // Auto-tour scrolling is programmatic; user input is handled separately.
      }
      document.documentElement.style.setProperty('--scroll-progress', scrollSignals.global.toFixed(4))
    }

    const requestUpdate = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    const onResize = () => {
      measure()
      requestUpdate()
    }

    measure()
    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', onResize)
    window.visualViewport?.addEventListener('resize', onResize)
    const observer = new ResizeObserver(onResize)
    observer.observe(document.body)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
      observer.disconnect()
      if (getLenis() === lenis) {
        // The instance is intentionally kept alive across HMR remounts.
      }
    }
  }, [reducedMotion, setActiveChapter])
}
