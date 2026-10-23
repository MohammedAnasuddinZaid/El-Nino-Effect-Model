import { CHAPTERS } from '../data/chapters'
import { scrollToChapter, scrollToTop } from '../lib/scroll'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'

type TopBarProps = {
  narrationSupported: boolean
  narrationOn: boolean
  speaking: boolean
  onToggleNarration: () => void
}

export function TopBar({ narrationSupported, narrationOn, speaking, onToggleNarration }: TopBarProps) {
  const setPanel = useExperience((state) => state.setPanel)
  const setMenuOpen = useExperience((state) => state.setMenuOpen)
  const activeChapter = useExperience((state) => state.activeChapter)
  const lastChapter = CHAPTERS.length - 1

  const openStory = () => {
    const state = useExperience.getState()
    state.setAutoTour(false)
    state.setExplore(false)
    state.clearFocus()
    scrollToChapter(1)
  }

  const openModel = () => {
    const state = useExperience.getState()
    state.setAutoTour(false)
    state.setExplore(false)
    state.clearFocus()
    scrollToChapter(lastChapter)
    window.setTimeout(() => {
      if (useExperience.getState().activeChapter === lastChapter) {
        useExperience.getState().setExplore(true)
      }
    }, 1750)
  }

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <button
          type="button"
          className="brand"
          onClick={() => scrollToTop()}
          aria-label="Every Drop Has a Story — go to the beginning"
        >
          <span className="brand__mark" aria-hidden="true">
            <Icon name="drop" size={22} />
          </span>
          <span className="brand__copy">
            <span className="brand__name">Every drop</span>
            <span className="brand__meta">A 3D science exhibit</span>
          </span>
        </button>

        <nav className="topnav" aria-label="Primary navigation">
          <button type="button" className="topnav__link" onClick={openStory}>
            The story
          </button>
          <button type="button" className="topnav__link" onClick={openModel}>
            Inside the model
          </button>
          <button type="button" className="topnav__link" onClick={() => setPanel('project')}>
            The project
          </button>
          <button type="button" className="topnav__link" onClick={() => setPanel('sources')}>
            Science
          </button>
        </nav>

        <div className="topbar__actions">
          <span className="live-status" aria-label="Interactive model is running">
            <span className="live-status__pulse" />
            Model live
          </span>
          {narrationSupported && (
            <button
              type="button"
              className={`listen-button ${narrationOn ? 'is-on' : ''}`}
              onClick={onToggleNarration}
              aria-pressed={narrationOn}
              aria-label={narrationOn ? 'Stop narration' : 'Listen to the story'}
            >
              <Icon name={narrationOn ? 'sound' : 'sound-off'} size={16} />
              <span>{narrationOn ? (speaking ? 'Narrating' : 'Narration') : 'Listen'}</span>
              <span className={`listen-waves ${speaking ? 'is-speaking' : ''}`} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          )}
          <button
            type="button"
            className="chapters-button"
            onClick={() => setMenuOpen(true)}
            aria-label={`Open chapter menu. Currently chapter ${activeChapter + 1} of ${CHAPTERS.length}.`}
          >
            <span className="chapters-button__index mono">
              {String(activeChapter).padStart(2, '0')} — {String(lastChapter).padStart(2, '0')}
            </span>
            <span className="chapters-button__label">Chapters</span>
            <Icon name="menu" size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
