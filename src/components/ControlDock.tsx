import { useEffect, useRef, useState } from 'react'
import { CHAPTERS, getChapterCopy } from '../data/chapters'
import { getUiCopy } from '../data/i18n'
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
  const processPlaying = useExperience((state) => state.processPlaying)
  const paused = useExperience((state) => state.paused)
  const explore = useExperience((state) => state.explore)
  const cutaway = useExperience((state) => state.cutaway)
  const exploded = useExperience((state) => state.exploded)
  const labels = useExperience((state) => state.labels)
  const captions = useExperience((state) => state.captions)
  const language = useExperience((state) => state.language)
  const toggleExplore = useExperience((state) => state.toggleExplore)
  const toggleCutaway = useExperience((state) => state.toggleCutaway)
  const toggleExploded = useExperience((state) => state.toggleExploded)
  const toggleLabels = useExperience((state) => state.toggleLabels)
  const toggleCaptions = useExperience((state) => state.toggleCaptions)
  const setFilterOpen = useExperience((state) => state.setFilterOpen)
  const clearFocus = useExperience((state) => state.clearFocus)
  const selectPart = useExperience((state) => state.selectPart)

  const [toolsOpen, setToolsOpen] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)
  const copy = getUiCopy(language)
  const chapter = getChapterCopy(CHAPTERS[activeChapter] ?? CHAPTERS[0], language)
  const atStart = activeChapter === 0
  const atEnd = activeChapter === CHAPTERS.length - 1
  const playing = autoTour || processPlaying
  const playbackLabel = playing ? copy.pauseTour : paused ? copy.resumeTour : copy.playTour
  const readoutMode = autoTour
    ? copy.autoTour
    : processPlaying
      ? copy.stepMode
      : explore
        ? copy.exploreMode
        : paused
          ? copy.pausedMode
          : copy.liveMode

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

  const recentre = () => {
    useExperience.getState().setExplore(false)
    clearFocus()
    selectPart(null)
    setFilterOpen(false)
    setToolsOpen(false)
  }

  return (
    <div className="dock-wrap">
      <div className={`control-dock ${autoTour ? 'is-touring' : ''} ${processPlaying ? 'is-stepping' : ''}`}>
        {(autoTour || processPlaying) && (
          <span key={`${activeChapter}-${autoTour ? 'tour' : 'step'}`} className="dock-tourline" aria-hidden="true" />
        )}

        <div className="dock-transport">
          <button
            type="button"
            className="transport-button"
            onClick={onPrev}
            disabled={atStart}
            aria-label={copy.previousChapter}
            data-tooltip={copy.previousChapter}
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <button
            type="button"
            className={`play-button ${playing ? 'is-playing' : ''}`}
            onClick={onPrimaryAction}
            aria-label={playbackLabel}
            data-tooltip={playbackLabel}
          >
            <span className="play-button__icon">
              <Icon name={playing ? 'pause' : 'play'} size={17} />
            </span>
            <span className="play-button__label">
              {playing ? copy.pause : paused ? copy.resume : copy.present}
            </span>
          </button>
          <button
            type="button"
            className="transport-button"
            onClick={onNext}
            disabled={atEnd}
            aria-label={copy.nextChapter}
            data-tooltip={copy.nextChapter}
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
            <span className={`dock-readout__dot ${playing ? 'is-live' : ''}`} />
            {readoutMode}
          </span>
        </div>

        <div className="dock-tools">
          <ToolButton
            icon="explore"
            label={explore ? copy.exitExplore : copy.explore}
            active={explore}
            onClick={toggleExplore}
          />
          <ToolButton icon="cutaway" label={copy.cutaway} active={cutaway} onClick={toggleCutaway} />
          <ToolButton icon="layers" label={copy.exploded} active={exploded} onClick={toggleExploded} />
          <span className="dock-tools__divider" aria-hidden="true" />
          <div className="dock-tools__menu" ref={toolsRef}>
            <ToolButton
              icon="settings"
              label={copy.viewOptions}
              active={toolsOpen}
              onClick={() => setToolsOpen((open) => !open)}
            />
            {toolsOpen && (
              <div className="view-popover" role="group" aria-label={copy.viewOptions}>
                <span className="view-popover__label mono">{copy.viewOptions}</span>
                <button type="button" role="switch" aria-checked={labels} className="popover-row" onClick={toggleLabels}>
                  <span>{copy.callouts}</span>
                  <span className={`switch switch--small ${labels ? 'is-on' : ''}`} aria-hidden="true">
                    <span />
                  </span>
                </button>
                <button type="button" role="switch" aria-checked={captions} className="popover-row" onClick={toggleCaptions}>
                  <span>{copy.chapterCaptions}</span>
                  <span className={`switch switch--small ${captions ? 'is-on' : ''}`} aria-hidden="true">
                    <span />
                  </span>
                </button>
                <span className="view-popover__rule" />
                <button type="button" className="popover-action" onClick={recentre}>
                  <Icon name="explore" size={14} />
                  {copy.recentre}
                </button>
                <button
                  type="button"
                  className="popover-action"
                  onClick={() => {
                    setToolsOpen(false)
                    onReset()
                  }}
                >
                  <Icon name="reset" size={14} />
                  {copy.resetExperience}
                </button>
              </div>
            )}
          </div>
          <ToolButton icon="reset" label={copy.resetExperience} onClick={onReset} />
        </div>
      </div>
    </div>
  )
}
