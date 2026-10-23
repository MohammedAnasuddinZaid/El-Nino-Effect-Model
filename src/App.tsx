import { useCallback, useEffect, useRef, useState } from 'react'
import { CHAPTERS, getChapterCopy } from './data/chapters'
import { chapterAudioPath, getUiCopy } from './data/i18n'
import { detectWebGL } from './lib/webgl'
import { getLenis, lockScroll, scrollToChapter, scrollToTop, unlockScroll } from './lib/scroll'
import { useScrollExperience } from './hooks/useScrollExperience'
import { preloadNarration, useNarration } from './hooks/useNarration'
import { scrollSignals, useExperience } from './store/useExperience'
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

const TOUR_SILENT_INTERVAL = 16_000
const TOUR_SAFETY_LIMIT = 50_000

let audioPrimer: HTMLAudioElement | null = null
function primeAudio() {
  if (typeof window === 'undefined') return
  try {
    if (!audioPrimer) {
      audioPrimer = new Audio(
        'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
      )
      audioPrimer.volume = 0.01
    }
    audioPrimer.currentTime = 0
    void audioPrimer.play().catch(() => {})
  } catch {
    // The narration hook falls back to speech synthesis.
  }
}

export default function App() {
  const [webglAvailable, setWebglAvailable] = useState(() => detectWebGL())

  const activeChapter = useExperience((state) => state.activeChapter)
  const loaded = useExperience((state) => state.loaded)
  const paused = useExperience((state) => state.paused)
  const autoTour = useExperience((state) => state.autoTour)
  const processPlaying = useExperience((state) => state.processPlaying)
  const menuOpen = useExperience((state) => state.menuOpen)
  const panel = useExperience((state) => state.panel)
  const selectedPart = useExperience((state) => state.selectedPart)
  const explore = useExperience((state) => state.explore)
  const language = useExperience((state) => state.language)
  const voiceOn = useExperience((state) => state.voiceOn)
  const hideSideText = useExperience((state) => state.hideSideText)
  const setLoaded = useExperience((state) => state.setLoaded)
  const setReducedMotion = useExperience((state) => state.setReducedMotion)
  const setAutoTour = useExperience((state) => state.setAutoTour)
  const resetExperience = useExperience((state) => state.resetExperience)
  const toggleVoice = useExperience((state) => state.toggleVoice)

  const rawChapter = CHAPTERS[activeChapter] ?? CHAPTERS[0]
  const chapter = getChapterCopy(rawChapter, language)
  const copy = getUiCopy(language)
  const lastChapter = CHAPTERS.length - 1
  const previousChapter = useRef(activeChapter)

  useScrollExperience()

  const handleNarrationEnd = useCallback(() => {
    const state = useExperience.getState()
    if (state.autoTour) {
      if (state.activeChapter >= lastChapter) {
        state.setAutoTour(false)
        state.setPaused(false)
        return
      }
      const next = state.activeChapter + 1
      // Jump the document, then let the camera damp into the next pose.
      // This keeps the chapter change clean instead of scrolling through every
      // intermediate scroll position while the voice is already moving on.
      state.setActiveChapter(next)
      scrollSignals.chapter = next
      scrollSignals.local = 0
      scrollToChapter(next, true)
      return
    }
    if (state.processPlaying) state.setProcessPlaying(false)
  }, [lastChapter])

  const narration = useNarration({
    src: chapterAudioPath(language, activeChapter),
    preloadSrc: chapterAudioPath(language, Math.min(activeChapter + 1, lastChapter)),
    fallbackText: chapter.narration,
    language,
    enabled: voiceOn && (autoTour || processPlaying),
    onEnd: handleNarrationEnd,
  })

  // Warm the first chapters quietly while the visitor reads the opening screen.
  useEffect(() => {
    if (!loaded) return
    preloadNarration(chapterAudioPath(language, 1))
    preloadNarration(chapterAudioPath(language, 2))
  }, [language, loaded])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [setReducedMotion])

  useEffect(() => {
    document.documentElement.lang = language
    document.title =
      language === 'hi'
        ? 'हर बूँद की एक कहानी · अहमदी बेगम · कक्षा 7बी'
        : 'Every Drop Has a Story · Ahmadi Begum · Class 7B'
  }, [language])

  useEffect(() => {
    const onContextLost = () => {
      setWebglAvailable(false)
      setLoaded(true)
    }
    window.addEventListener('exhibit:contextlost', onContextLost)
    return () => window.removeEventListener('exhibit:contextlost', onContextLost)
  }, [setLoaded])

  useEffect(() => {
    if (!webglAvailable) setLoaded(true)
  }, [setLoaded, webglAvailable])

  // A locked page means the model, not the story, owns the wheel and touch input.
  useEffect(() => {
    if (!loaded || explore) lockScroll()
    else unlockScroll()
    return () => unlockScroll()
  }, [loaded, explore])

  useEffect(() => {
    if (!explore) return
    const state = useExperience.getState()
    if (state.autoTour) state.setAutoTour(false)
    if (state.processPlaying) state.setProcessPlaying(false)
    state.setPaused(false)
    narration.stop()
  }, [explore, narration])

  useEffect(() => {
    if (!autoTour) return
    if (voiceOn) return
    if (paused) return
    const timeout = window.setTimeout(() => {
      handleNarrationEnd()
    }, TOUR_SILENT_INTERVAL)
    return () => window.clearTimeout(timeout)
  }, [activeChapter, autoTour, handleNarrationEnd, paused, voiceOn])

  // Safety net if an audio file is missing or speech synthesis stalls.
  useEffect(() => {
    if (!autoTour && !processPlaying) return
    const timeout = window.setTimeout(() => {
      const state = useExperience.getState()
      if (!state.autoTour && !state.processPlaying) return
      if (state.autoTour) handleNarrationEnd()
      else state.setProcessPlaying(false)
    }, TOUR_SAFETY_LIMIT)
    return () => window.clearTimeout(timeout)
  }, [activeChapter, autoTour, handleNarrationEnd, processPlaying])

  useEffect(() => {
    if (menuOpen || panel) {
      if (autoTour) setAutoTour(false)
      if (processPlaying) useExperience.getState().setProcessPlaying(false)
    }
  }, [autoTour, menuOpen, panel, processPlaying, setAutoTour])

  useEffect(() => {
    if (!autoTour && !processPlaying) return
    const stop = () => {
      const state = useExperience.getState()
      if (state.explore) return
      if (state.autoTour) state.setAutoTour(false)
      if (state.processPlaying) state.setProcessPlaying(false)
      state.setPaused(false)
    }
    const stopOnKey = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) return
      const target = event.target as HTMLElement | null
      if (target?.tagName.toLowerCase() === 'input' || target?.isContentEditable) return
      stop()
    }
    window.addEventListener('keydown', stopOnKey)
    return () => {
      window.removeEventListener('keydown', stopOnKey)
    }
  }, [autoTour, processPlaying])

  // Auto-open the filter while the filtration chapter is being presented.
  useEffect(() => {
    const presenting = autoTour || processPlaying
    if (!presenting) return
    const state = useExperience.getState()
    if (activeChapter === 5) state.setFilterOpen(true)
    else state.setFilterOpen(false)
  }, [activeChapter, autoTour, processPlaying])

  useEffect(() => {
    if (previousChapter.current === activeChapter) return
    previousChapter.current = activeChapter
    const state = useExperience.getState()
    if (state.focusPart) state.clearFocus()
    if (state.selectedPart) state.selectPart(null)
    if (state.filterOpen) state.setFilterOpen(false)
  }, [activeChapter])

  const handleReady = useCallback(() => {
    setLoaded(true)
  }, [setLoaded])

  const stopPlayback = useCallback(() => {
    const state = useExperience.getState()
    if (state.autoTour) state.setAutoTour(false)
    if (state.processPlaying) state.setProcessPlaying(false)
    state.setPaused(false)
  }, [])

  const navigate = useCallback(
    (index: number) => {
      stopPlayback()
      const state = useExperience.getState()
      if (state.explore) state.setExplore(false)
      if (state.focusPart) state.clearFocus()
      if (state.selectedPart) state.selectPart(null)
      scrollToChapter(Math.max(0, Math.min(lastChapter, index)))
    },
    [lastChapter, stopPlayback],
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
    stopPlayback()
    resetExperience()
    window.setTimeout(() => scrollToTop(false), 60)
  }, [narration, resetExperience, stopPlayback])

  const startTour = useCallback(() => {
    primeAudio()
    const state = useExperience.getState()
    state.setMenuOpen(false)
    state.setExplore(false)
    state.clearFocus()
    state.selectPart(null)
    state.setFilterOpen(false)

    if (state.activeChapter >= lastChapter) {
      resetExperience()
      const fresh = useExperience.getState()
      scrollSignals.chapter = 1
      scrollSignals.local = 0
      scrollToChapter(1, true)
      fresh.setActiveChapter(1)
      fresh.setAutoTour(true)
      fresh.setPaused(false)
      return
    }

    const target = state.activeChapter === 0 ? 1 : state.activeChapter
    if (state.activeChapter === 0) {
      scrollSignals.chapter = 1
      scrollSignals.local = 0
      scrollToChapter(1, true)
      state.setActiveChapter(1)
    }
    state.setAutoTour(true)
    state.setPaused(false)
  }, [lastChapter, resetExperience])

  const handlePrimaryAction = useCallback(() => {
    primeAudio()
    const state = useExperience.getState()
    if (state.autoTour) {
      state.setAutoTour(false)
      state.setPaused(true)
      return
    }
    if (state.processPlaying) {
      state.setProcessPlaying(false)
      state.setPaused(true)
      return
    }
    if (state.paused) {
      state.setPaused(false)
      startTour()
      return
    }
    startTour()
  }, [startTour])

  const handleToggleStep = useCallback(() => {
    primeAudio()
    const state = useExperience.getState()
    if (state.processPlaying) {
      state.setProcessPlaying(false)
      state.setPaused(true)
      return
    }
    if (state.autoTour) state.setAutoTour(false)
    state.clearFocus()
    state.selectPart(null)
    state.setExplore(false)
    state.setPaused(false)
    state.setProcessPlaying(true)
  }, [])

  const handleExplore = useCallback(() => {
    stopPlayback()
    const state = useExperience.getState()
    state.clearFocus()
    state.selectPart(null)
    state.setFilterOpen(false)
    state.setExplore(true)
    state.setPaused(false)
  }, [stopPlayback])

  const handleReset = useCallback(() => {
    narration.stop()
    stopPlayback()
    resetExperience()
    window.setTimeout(() => {
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    }, 40)
  }, [narration, resetExperience, stopPlayback])

  const handleToggleVoice = useCallback(() => {
    primeAudio()
    toggleVoice()
  }, [toggleVoice])

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
          if (state.explore) state.setExplore(false)
          return
        }
        if (state.explore) {
          state.setExplore(false)
          return
        }
        if (state.menuOpen) {
          state.setMenuOpen(false)
          return
        }
        if (state.panel) state.setPanel(null)
        return
      }

      const state = useExperience.getState()
      if (state.menuOpen || state.panel || state.explore) return
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
      if (state.processPlaying) state.setProcessPlaying(false)
      if (window.speechSynthesis) window.speechSynthesis.cancel()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  return (
    <div
      className={`app ${selectedPart ? 'has-inspector' : ''} ${explore ? 'is-exploring' : ''} ${
        paused ? 'is-paused' : ''
      } ${autoTour ? 'is-presenting' : ''} ${processPlaying ? 'is-step-playing' : ''} ${
        webglAvailable ? '' : 'is-fallback'
      } ${hideSideText ? 'is-text-hidden' : ''}`}
      data-language={language}
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

      <TopBar onToggleVoice={handleToggleVoice} />

      <StoryLayer
        onStartTour={startTour}
        onReplay={handleReplay}
        onToggleStep={handleToggleStep}
        onExplore={handleExplore}
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

      <main className="scroll-track" aria-label={copy.brandName}>
        {CHAPTERS.map((item, index) => {
          const localized = getChapterCopy(item, language)
          return (
            <section
              key={item.id}
              id={`chapter-${item.id}`}
              data-chapter-index={index}
              className={`scroll-section ${index === 0 ? 'scroll-section--hero' : ''}`}
              aria-label={`${copy.chapterWord} ${localized.number}: ${localized.title}`}
            >
              <h2 className="sr-only">{localized.title}</h2>
              <p className="sr-only">{localized.body}</p>
            </section>
          )
        })}
      </main>

      <div className="sr-only" aria-live="polite">
        {chapter.number === '00' ? copy.opening : `${copy.chapterWord} ${chapter.number}`}: {chapter.title}
      </div>

      <button
        type="button"
        className={`explore-hint ${explore ? 'is-visible' : ''}`}
        onClick={handleExplore}
        aria-hidden={!explore}
        tabIndex={explore ? 0 : -1}
      >
        <span className="explore-hint__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>
          <strong>{copy.freeExploration}</strong>
          <em>{copy.freeExplorationHint}</em>
        </span>
        <span className="mono">{copy.exit}</span>
      </button>
      <span className="sr-only">{copy.keyboardHint}</span>
    </div>
  )
}
