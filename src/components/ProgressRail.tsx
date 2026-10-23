import { useEffect, useRef } from 'react'
import { CHAPTERS } from '../data/chapters'
import { scrollSignals, useExperience } from '../store/useExperience'
import { scrollToChapter } from '../lib/scroll'

export function ProgressRail() {
  const activeChapter = useExperience((state) => state.activeChapter)
  const fillRef = useRef<HTMLSpanElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)

  const goToChapter = (index: number) => {
    const state = useExperience.getState()
    state.setAutoTour(false)
    state.setExplore(false)
    state.clearFocus()
    scrollToChapter(index)
  }

  useEffect(() => {
    let frame = 0
    const update = () => {
      const progress = scrollSignals.global
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${progress})`
      if (percentRef.current) percentRef.current.textContent = String(Math.round(progress * 100)).padStart(2, '0')
      frame = requestAnimationFrame(update)
    }
    frame = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <>
      <nav className="chapter-rail" aria-label="Chapter progress">
        <span className="chapter-rail__caption mono">Index</span>
        <div className="chapter-rail__list">
          <span className="chapter-rail__track" aria-hidden="true">
            <span ref={fillRef} className="chapter-rail__fill" />
          </span>
          {CHAPTERS.map((chapter, index) => (
            <button
              key={chapter.id}
              type="button"
              className={`chapter-rail__item ${index === activeChapter ? 'is-active' : ''}`}
              onClick={() => goToChapter(index)}
              aria-label={`Chapter ${chapter.number}: ${chapter.title}`}
              aria-current={index === activeChapter ? 'step' : undefined}
            >
              <span className="chapter-rail__number mono">{chapter.number}</span>
              <span className="chapter-rail__dot" aria-hidden="true" />
              <span className="chapter-rail__title">{chapter.title}</span>
            </button>
          ))}
        </div>
        <div className="chapter-rail__readout mono">
          <span ref={percentRef}>00</span>
          <span className="chapter-rail__readout-divider">/</span>
          <span>100</span>
        </div>
      </nav>

      <div className="mobile-progress" aria-hidden="true">
        <span className="mobile-progress__fill" />
        <div className="mobile-progress__ticks">
          {CHAPTERS.map((chapter, index) => (
            <span key={chapter.id} className={index === activeChapter ? 'is-active' : ''} />
          ))}
        </div>
      </div>
    </>
  )
}
