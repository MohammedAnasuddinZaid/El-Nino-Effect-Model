import { CHAPTERS } from '../data/chapters'
import { scrollToChapter, scrollToTop } from '../lib/scroll'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'
import { Modal } from './Modal'

type ChapterMenuProps = {
  onStartTour: () => void
  onReplay: () => void
}

export function ChapterMenu({ onStartTour, onReplay }: ChapterMenuProps) {
  const open = useExperience((state) => state.menuOpen)
  const setMenuOpen = useExperience((state) => state.setMenuOpen)
  const activeChapter = useExperience((state) => state.activeChapter)
  const labels = useExperience((state) => state.labels)
  const captions = useExperience((state) => state.captions)
  const toggleLabels = useExperience((state) => state.toggleLabels)
  const toggleCaptions = useExperience((state) => state.toggleCaptions)
  const setPanel = useExperience((state) => state.setPanel)

  const close = () => setMenuOpen(false)
  const goTo = (index: number) => {
    close()
    window.setTimeout(() => {
      const state = useExperience.getState()
      state.setAutoTour(false)
      state.setExplore(false)
      state.clearFocus()
      scrollToChapter(index)
    }, 90)
  }

  return (
    <Modal open={open} onClose={close} label="Chapter index" className="chapters-modal">
      <div className="chapters-modal__grid">
        <div className="chapters-modal__main">
          <div className="eyebrow">
            <span className="eyebrow__dot" />
            Exhibition index · {CHAPTERS.length} chapters
          </div>
          <div className="chapters-modal__heading">
            <h2>Follow the whole journey.</h2>
            <p>From a warmer Pacific to a single drop at a root. Choose a chapter, or let the guided tour move for you.</p>
          </div>

          <div className="chapter-index" role="list">
            {CHAPTERS.map((chapter, index) => (
              <button
                key={chapter.id}
                type="button"
                role="listitem"
                className={`chapter-index__item ${index === activeChapter ? 'is-active' : ''}`}
                onClick={() => goTo(index)}
                aria-current={index === activeChapter ? 'step' : undefined}
              >
                <span className="chapter-index__number mono">{chapter.number}</span>
                <span className="chapter-index__body">
                  <span className="chapter-index__kicker">{chapter.kicker}</span>
                  <span className="chapter-index__title">{chapter.title}</span>
                </span>
                <span className="chapter-index__meta">
                  {index === activeChapter ? <span className="chapter-index__current">Now showing</span> : null}
                  <Icon name="arrow-right" size={17} />
                </span>
              </button>
            ))}
          </div>
        </div>

        <aside className="chapters-modal__aside">
          <div className="aside-card aside-card--feature">
            <span className="mono aside-card__label">Guided experience</span>
            <div className="aside-card__icon">
              <Icon name="sparkle" size={22} />
            </div>
            <h3>Let the story play.</h3>
            <p>Auto-advance through all nine chapters. Your narration, captions and camera follow along.</p>
            <button
              type="button"
              className="button button--primary button--full"
              onClick={() => {
                close()
                window.setTimeout(onStartTour, 120)
              }}
            >
              <Icon name="play" size={15} />
              Play guided tour
            </button>
            <span className="aside-card__note mono">≈ 18 seconds per chapter</span>
          </div>

          <div className="aside-card">
            <span className="mono aside-card__label">Reading comfort</span>
            <button
              type="button"
              role="switch"
              aria-checked={labels}
              className="setting-row"
              onClick={toggleLabels}
            >
              <span>
                <span className="setting-row__title">Scene labels</span>
                <span className="setting-row__hint">Technical callouts in 3D</span>
              </span>
              <span className={`switch ${labels ? 'is-on' : ''}`} aria-hidden="true">
                <span />
              </span>
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={captions}
              className="setting-row"
              onClick={toggleCaptions}
            >
              <span>
                <span className="setting-row__title">Captions</span>
                <span className="setting-row__hint">Key line for every chapter</span>
              </span>
              <span className={`switch ${captions ? 'is-on' : ''}`} aria-hidden="true">
                <span />
              </span>
            </button>
          </div>

          <div className="chapters-modal__small-links">
            <button
              type="button"
              className="text-link"
              onClick={() => {
                close()
                window.setTimeout(() => setPanel('project'), 80)
              }}
            >
              <Icon name="book" size={15} />
              Project dossier
            </button>
            <button
              type="button"
              className="text-link"
              onClick={() => {
                close()
                window.setTimeout(() => setPanel('sources'), 80)
              }}
            >
              <Icon name="info" size={15} />
              Sources & method
            </button>
            <button
              type="button"
              className="text-link"
              onClick={() => {
                close()
                window.setTimeout(() => {
                  onReplay()
                  scrollToTop(false)
                }, 100)
              }}
            >
              <Icon name="reset" size={15} />
              Replay from the beginning
            </button>
          </div>

          <p className="chapters-modal__credit mono">
            Ahmadi Begum · Class 7B
            <br />
            El Niño & Water Conservation
          </p>
        </aside>
      </div>
    </Modal>
  )
}
