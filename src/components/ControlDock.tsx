import { useEffect, useRef, useState } from 'react'
import { CHAPTERS } from '../data/chapters'
import { scrollToChapter } from '../lib/scroll'
import { useExperience } from '../store/useExperience'
import { Icon, type IconName } from './Icons'

type ControlDockProps = {
  onPrimaryAction: () => void
  onNext: () => void
  onPrev: () => void
  onReset: () => void
}

function ToolButton({
  icon,
  label,
  active,
  onClick,
  disabled,
}: {
  icon: IconName
  label: string
  active?: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      className={`tool-button ${active ? 'is-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      data-tooltip={label}
      disabled={disabled}
    >
      <Icon name={icon} size={17} />
    </button>
  )
}

export function ControlDock({ onPrimaryAction, onNext, onPrev, onReset }: ControlDockProps) {
  const activeChapter = useExperience((state) => state.activeChapter)
  const autoTour = useExperience((state) => state.autoTour)
  const paused = useExperience((state) => state.paused)
  const explore = useExperience((state) => state.explore)
  const cutaway = useExperience((state) => state.cutaway)
  const exploded = useExperience((state) => state.exploded)
  const labels = useExperience((state) => state.labels)
  const captions = useExperience((state) => state.captions)
  const toggleExplore = useExperience((state) => state.toggleExplore)
  const toggleCutaway = useExperience((state) => state.toggleCutaway)
  const toggleExploded = useExperience((state) => state.toggleExploded)
  const toggleLabels = useExperience((state) => state.toggleLabels)
  const toggleCaptions = useExperience((state) => state.toggleCaptions)
  const setExplore = useExperience((state) => state.setExplore)
  const clearFocus = useExperience((state) => state.clearFocus)

  const [toolsOpen, setToolsOpen] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)
  const chapter = CHAPTERS[activeChapter] ?? CHAPTERS[0]
  const atStart = activeChapter === 0
  const atEnd = activeChapter === CHAPTERS.length - 1
  const playbackLabel = autoTour && !paused ? 'Pause guided tour' : paused ? 'Resume motion' : 'Play guided tour'

  useEffect(() => {
    if (!toolsOpen) return
    const close = (event: PointerEvent) => {
      if (!toolsRef.current?.contains(event.target as Node)) setToolsOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setToolsOpen(false)
    }
    window.addEventListener('pointerdown', close)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', close)
      window.removeEventListener('keydown', onKey)
    }
  }, [toolsOpen])

  return (
    <div className="dock-wrap">
      <div className={`control-dock ${autoTour ? 'is-touring' : ''}`}>
        {autoTour && !paused && (
          <span key={`${activeChapter}-tour`} className="dock-tourline" aria-hidden="true" />
        )}

        <div className="dock-transport">
          <button
            type="button"
            className="transport-button"
            onClick={onPrev}
            disabled={atStart}
            aria-label="Previous chapter"
            data-tooltip="Previous chapter"
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <button
            type="button"
            className={`play-button ${autoTour && !paused ? 'is-playing' : ''}`}
            onClick={onPrimaryAction}
            aria-label={playbackLabel}
            data-tooltip={playbackLabel}
          >
            <span className="play-button__icon">
              <Icon name={autoTour && !paused ? 'pause' : 'play'} size={17} />
            </span>
            <span className="play-button__label">{autoTour && !paused ? 'Pause' : paused ? 'Resume' : 'Play'}</span>
          </button>
          <button
            type="button"
            className="transport-button"
            onClick={onNext}
            disabled={atEnd}
            aria-label="Next chapter"
            data-tooltip="Next chapter"
          >
            <Icon name="arrow-right" size={18} />
          </button>
        </div>

        <div className="dock-readout">
          <span className="dock-readout__index mono">
            {String(activeChapter).padStart(2, '0')} <span>/</span> {String(CHAPTERS.length - 1).padStart(2, '0')}
          </span>
          <span className="dock-readout__title">{chapter.title}</span>
          <span className="dock-readout__mode mono">
            <span className={`dock-readout__dot ${autoTour ? 'is-live' : ''}`} />
            {autoTour ? 'AUTO TOUR' : explore ? 'EXPLORE' : paused ? 'PAUSED' : 'LIVE'}
          </span>
        </div>

        <div className="dock-tools">
          <ToolButton
            icon="explore"
            label={explore ? 'Exit free exploration' : 'Explore freely'}
            active={explore}
            onClick={toggleExplore}
          />
          <ToolButton icon="cutaway" label="Cutaway view" active={cutaway} onClick={toggleCutaway} />
          <ToolButton icon="layers" label="Exploded view" active={exploded} onClick={toggleExploded} />
          <span className="dock-tools__divider" aria-hidden="true" />
          <div className="dock-tools__menu" ref={toolsRef}>
            <ToolButton
              icon="settings"
              label="View options"
              active={toolsOpen}
              onClick={() => setToolsOpen((open) => !open)}
            />
            {toolsOpen && (
              <div className="view-popover" role="group" aria-label="View options">
                <span className="view-popover__label mono">View options</span>
                <button type="button" role="switch" aria-checked={labels} className="popover-row" onClick={toggleLabels}>
                  <span>3D callouts</span>
                  <span className={`switch switch--small ${labels ? 'is-on' : ''}`} aria-hidden="true">
                    <span />
                  </span>
                </button>
                <button type="button" role="switch" aria-checked={captions} className="popover-row" onClick={toggleCaptions}>
                  <span>Chapter captions</span>
                  <span className={`switch switch--small ${captions ? 'is-on' : ''}`} aria-hidden="true">
                    <span />
                  </span>
                </button>
                <span className="view-popover__rule" />
                <button
                  type="button"
                  className="popover-action"
                  onClick={() => {
                    setExplore(false)
                    clearFocus()
                    setToolsOpen(false)
                  }}
                >
                  <Icon name="reset" size={14} />
                  Recentre camera
                </button>
                <button
                  type="button"
                  className="popover-action"
                  onClick={() => {
                    setToolsOpen(false)
                    onReset()
                  }}
                >
                  <Icon name="expand" size={14} />
                  Reset experience
                </button>
              </div>
            )}
          </div>
          <ToolButton icon="reset" label="Reset experience" onClick={onReset} />
        </div>
      </div>
      <div className="dock-caption">
        <span className="mono">{activeChapter === 0 ? 'SCROLL TO EXPLORE' : 'ARROW KEYS TO NAVIGATE'}</span>
        <span className="dock-caption__line" />
        <span className="mono">MOTION {paused ? 'PAUSED' : 'ACTIVE'}</span>
      </div>
    </div>
  )
}
