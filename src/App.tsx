import { useCallback, useEffect, useRef, useState } from 'react'
import { CHAPTERS } from './data/chapters'
import { detectWebGL } from './lib/webgl'
import { getLenis, lockScroll, scrollToChapter, scrollToTop, unlockScroll } from './lib/scroll'
import { useScrollExperience } from './hooks/useScrollExperience'
import { useNarration } from './hooks/useNarration'
import { useExperience } from './store/useExperience'
import { ExperienceCanvas } from './components/ExperienceCanvas'
import { FallbackExhibit } from './components/FallbackExhibit'
import { Loader } from './components/Loader'
import { TopBar } from './components/TopBar'
import { StoryLayer } from './components/StoryLayer'
import { ProgressRail } from './components/ProgressRail'
import { ControlDock } from './components/ControlDock'
import { Inspector } from './components/Inspector'
import { ChapterMenu } from './components/ChapterMenu'
import { InfoPanel } from './components/InfoPanel'
import { HarvestCalculator } from './components/HarvestCalculator'
import { SceneErrorBoundary } from './components/SceneErrorBoundary'

const TOUR_INTERVAL = 18_000

export default function App() {
  const [webglAvailable, setWebglAvailable] = useState(() => detectWebGL())
  const [narrationOn, setNarrationOn] = useState(false)

  const activeChapter = useExperience((state) => state.activeChapter)
  const loaded = useExperience((state) => state.loaded)
  const paused = useExperience((state) => state.paused)
  const autoTour = useExperience((state) => state.autoTour)
  const menuOpen = useExperience((state) => state.menuOpen)
  const panel = useExperience((state) => state.panel)
  const selectedPart = useExperience((state) => state.selectedPart)
  const explore = useExperience((state) => state.explore)
  const setLoaded = useExperience((state) => state.setLoaded)
  const setReducedMotion = useExperience((state) => state.setReducedMotion)
  const setAutoTour = useExperience((state) => state.setAutoTour)
  const setPaused = useExperience((state) => state.setPaused)
  const setExplore = useExperience((state) => state.setExplore)
  const selectPart = useExperience((state) => state.selectPart)
  const clearFocus = useExperience((state) => state.clearFocus)
  const resetExperience = useExperience((state) => state.resetExperience)

  const chapter = CHAPTERS[activeChapter] ?? CHAPTERS[0]
  const lastChapter = CHAPTERS.length - 1
  const narration = useNarration({ text: chapter.narration, enabled: narrationOn })
  const previousChapter = useRef(activeChapter)

  useScrollExperience()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [setReducedMotion])

  useEffect(() => {
    const onContextLost = () => {
      setWebglAvailable(false)
      setLoaded(true)
    }
    window.addEventListener('exhibit:contextlost', onContextLost)
    return () => window.removeEventListener('exhibit:contextlost', onContextLost)
  }, [setLoaded])

  useEffect(() => {
    if (!webglAvailable) {
      setLoaded(true)
    }
  }, [setLoaded, webglAvailable])

  useEffect(() => {
    if (!loaded) {
      lockScroll()
    } else {
      unlockScroll()
    }
    return () => unlockScroll()
  }, [loaded])

  useEffect(() => {
    if (menuOpen || panel) {
      if (autoTour) setAutoTour(false)
    }
  }, [autoTour, menuOpen, panel, setAutoTour])

  useEffect(() => {
    if (!autoTour || paused) return
    const timeout = window.setTimeout(() => {
      const state = useExperience.getState()
      if (state.activeChapter >= lastChapter) {
        state.setAutoTour(false)
        return
      }
      scrollToChapter(state.activeChapter + 1)
    }, TOUR_INTERVAL)
    return () => window.clearTimeout(timeout)
  }, [activeChapter, autoTour, lastChapter, paused])

  useEffect(() => {
    if (!autoTour) return
    const stop = () => {
      if (useExperience.getState().autoTour) useExperience.getState().setAutoTour(false)
    }
    const stopOnKey = (event: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stop()
    }
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    window.addEventListener('keydown', stopOnKey)
    return () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
      window.removeEventListener('keydown', stopOnKey)
    }
  }, [autoTour])

  useEffect(() => {
    if (previousChapter.current === activeChapter) return
    previousChapter.current = activeChapter
    const state = useExperience.getState()
    if (state.focusPart) state.clearFocus()
    if (state.selectedPart) state.selectPart(null)
  }, [activeChapter])

  const handleReady = useCallback(() => {
    setLoaded(true)
  }, [setLoaded])

  const stopTour = useCallback(() => {
    const state = useExperience.getState()
    if (state.autoTour) state.setAutoTour(false)
  }, [])

  const navigate = useCallback(
    (index: number) => {
      stopTour()
      const state = useExperience.getState()
      if (state.explore) state.setExplore(false)
      if (state.focusPart) state.clearFocus()
      scrollToChapter(Math.max(0, Math.min(lastChapter, index)))
    },
    [lastChapter, stopTour],
  )

  const handleNext = useCallback(() => {
    const state = useExperience.getState()
    if (state.activeChapter < lastChapter) navigate(state.activeChapter + 1)
  }, [lastChapter, navigate])

  const handlePrev = useCallback(() => {
    const state = useExperience.getState()
    if (state.activeChapter > 0) navigate(state.activeChapter - 1)
  }, [navigate])

  const handleReplay = useCallback(() => {
    narration.stop()
    setNarrationOn(false)
    resetExperience()
    window.setTimeout(() => scrollToTop(true), 40)
    window.setTimeout(() => scrollToTop(false), 120)
  }, [narration, resetExperience])

  const startTour = useCallback(() => {
    const state = useExperience.getState()
    state.setExplore(false)
    state.clearFocus()
    state.selectPart(null)
    if (state.activeChapter >= lastChapter) {
      narration.stop()
      setNarrationOn(false)
      resetExperience()
      window.setTimeout(() => scrollToTop(true), 40)
      window.setTimeout(() => {
        scrollToTop(true)
        useExperience.getState().setAutoTour(true)
      }, 140)
      return
    }
    if (state.activeChapter === 0) {
      scrollToChapter(1)
    }
    state.setAutoTour(true)
    state.setPaused(false)
    state.setMenuOpen(false)
  }, [lastChapter, narration, resetExperience])

  const handlePrimaryAction = useCallback(() => {
    const state = useExperience.getState()
    if (state.autoTour) {
      state.setAutoTour(false)
      state.setPaused(true)
      return
    }
    if (state.paused) {
      if (state.activeChapter >= lastChapter) {
        startTour()
        return
      }
      state.setPaused(false)
      state.setAutoTour(true)
      return
    }
    startTour()
  }, [lastChapter, startTour])

  const handleReset = useCallback(() => {
    narration.stop()
    setNarrationOn(false)
    resetExperience()
    window.setTimeout(() => {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }, 40)
  }, [narration, resetExperience])

  const toggleNarration = useCallback(() => {
    if (narrationOn) {
      setNarrationOn(false)
      narration.stop()
    } else {
      setNarrationOn(true)
    }
  }, [narration, narrationOn])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const tag = target?.tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || target?.isContentEditable) return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key === 'Escape') {
        const state = useExperience.getState()
        if (state.selectedPart) {
          state.selectPart(null)
          state.clearFocus()
          return
        }
        if (state.menuOpen) {
          state.setMenuOpen(false)
          return
        }
        if (state.panel) {
          state.setPanel(null)
        }
        return
      }

      const state = useExperience.getState()
      if (state.menuOpen || state.panel) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        handleNext()
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        handlePrev()
      } else if (event.key === ' ' && tag !== 'button' && tag !== 'a') {
        event.preventDefault()
        handlePrimaryAction()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleNext, handlePrev, handlePrimaryAction])

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) return
      const state = useExperience.getState()
      if (state.autoTour) state.setAutoTour(false)
      if (window.speechSynthesis) window.speechSynthesis.cancel()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  return (
    <div
      className={`app ${selectedPart ? 'has-inspector' : ''} ${explore ? 'is-exploring' : ''} ${
        paused ? 'is-paused' : ''
      } ${webglAvailable ? '' : 'is-fallback'}`}
    >
      <div className={`canvas-stack ${webglAvailable ? '' : 'canvas-stack--fallback'}`}>
        {webglAvailable ? (
          <SceneErrorBoundary
            fallback={<FallbackExhibit />}
            onError={() => {
              setWebglAvailable(false)
              useExperience.getState().setLoaded(true)
            }}
          >
            <ExperienceCanvas onReady={handleReady} />
          </SceneErrorBoundary>
        ) : (
          <FallbackExhibit />
        )}
      </div>

      <div className="ambient-wash" aria-hidden="true" />
      <div className="page-frame" aria-hidden="true">
        <span className="page-frame__corner page-frame__corner--tl" />
        <span className="page-frame__corner page-frame__corner--tr" />
        <span className="page-frame__corner page-frame__corner--bl" />
        <span className="page-frame__corner page-frame__corner--br" />
      </div>
      <div className="film-grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <TopBar
        narrationSupported={narration.supported}
        narrationOn={narrationOn}
        speaking={narration.speaking}
        onToggleNarration={toggleNarration}
      />

      <StoryLayer
        narrationSupported={narration.supported}
        narrationOn={narrationOn}
        speaking={narration.speaking}
        onToggleNarration={toggleNarration}
        onStartTour={startTour}
        onReplay={handleReplay}
      />

      <ProgressRail />
      <ControlDock
        onPrimaryAction={handlePrimaryAction}
        onNext={handleNext}
        onPrev={handlePrev}
        onReset={handleReset}
      />
      <Inspector />
      <ChapterMenu onStartTour={startTour} onReplay={handleReplay} />
      <InfoPanel />
      <HarvestCalculator />
      <Loader />

      <main className="scroll-track" aria-label="Story scroll track">
        {CHAPTERS.map((item, index) => (
          <section
            key={item.id}
            id={`chapter-${item.id}`}
            data-chapter-index={index}
            className={`scroll-section ${index === 0 ? 'scroll-section--hero' : ''}`}
            aria-label={`Chapter ${item.number}: ${item.title}`}
          >
            <h2 className="sr-only">{item.title}</h2>
            <p className="sr-only">{item.body}</p>
          </section>
        ))}
      </main>

      <div className="sr-only" aria-live="polite">
        {chapter.number === '00' ? 'Opening chapter' : `Chapter ${chapter.number}`}: {chapter.title}
      </div>

      <button
        type="button"
        className={`explore-hint ${explore ? 'is-visible' : ''}`}
        onClick={() => {
          setExplore(false)
          clearFocus()
          selectPart(null)
        }}
        aria-hidden={!explore}
        tabIndex={explore ? 0 : -1}
      >
        <span className="explore-hint__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>
          <strong>Free exploration</strong>
          <em>Drag to orbit · scroll to zoom · inspect any part</em>
        </span>
        <span className="mono">EXIT</span>
      </button>
      <span className="sr-only">
        Use left and right arrow keys to move between chapters. Press space to play or pause the guided tour.
      </span>
    </div>
  )
}
