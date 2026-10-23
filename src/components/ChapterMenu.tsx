import { CHAPTERS, getChapterCopy } from '../data/chapters'
import { getUiCopy } from '../data/i18n'
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
  const language = useExperience((state) => state.language)
  const copy = getUiCopy(language)

  const close = () => setMenuOpen(false)
  const goTo = (index: number) => {
    close()
    window.setTimeout(() => {
      const state = useExperience.getState()
      state.setAutoTour(false)
      state.setProcessPlaying(false)
      state.setExplore(false)
      state.clearFocus()
      scrollToChapter(index)
    }, 90)
  }

  return (
    <Modal open={open} onClose={close} label={copy.chapterIndex} className="chapters-modal">
      <div className="chapters-modal__grid">
        <div className="chapters-modal__main">
          <div className="eyebrow">
            <span className="eyebrow__dot" />
            {copy.exhibitionIndex} · {CHAPTERS.length} {copy.chapters}
          </div>
          <div className="chapters-modal__heading">
            <h2>{copy.followJourney}</h2>
            <p>{copy.journeyLede}</p>
          </div>

          <div className="chapter-index" role="list">
            {CHAPTERS.map((rawChapter, index) => {
              const chapter = getChapterCopy(rawChapter, language)
              return (
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
                    {index === activeChapter ? <span className="chapter-index__current">{copy.nowShowing}</span> : null}
                    <Icon name="arrow-right" size={17} />
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <aside className="chapters-modal__aside">
          <div className="aside-card aside-card--feature">
            <span className="mono aside-card__label">{copy.guidedExperience}</span>
            <div className="aside-card__icon" aria-hidden="true">
              <Icon name="play" size={18} />
            </div>
            <h3>{copy.letStoryPlay}</h3>
            <p>{copy.guidedBody}</p>
            <button
              type="button"
              className="button button--primary button--full"
              onClick={() => {
                close()
                window.setTimeout(onStartTour, 120)
              }}
            >
              <Icon name="play" size={15} />
              {copy.playGuided}
            </button>
            <span className="aside-card__note mono">{copy.perChapterNote}</span>
          </div>

          <div className="aside-card">
            <span className="mono aside-card__label">{copy.readingComfort}</span>
            <button type="button" role="switch" aria-checked={labels} className="setting-row" onClick={toggleLabels}>
              <span>
                <span className="setting-row__title">{copy.sceneLabels}</span>
                <span className="setting-row__hint">{copy.sceneLabelsHint}</span>
              </span>
              <span className={`switch ${labels ? 'is-on' : ''}`} aria-hidden="true">
                <span />
              </span>
            </button>
            <button type="button" role="switch" aria-checked={captions} className="setting-row" onClick={toggleCaptions}>
              <span>
                <span className="setting-row__title">{copy.captions}</span>
                <span className="setting-row__hint">{copy.captionsHint}</span>
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
              {copy.projectDossier}
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
              {copy.sourcesMethod}
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
              {copy.replayBeginning}
            </button>
          </div>

          <p className="chapters-modal__credit mono">
            {copy.credit}
            <br />
            {copy.creditProject}
          </p>
        </aside>
      </div>
    </Modal>
  )
}
