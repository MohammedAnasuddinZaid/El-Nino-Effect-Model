import { CHAPTERS } from '../data/chapters'
import { getUiCopy } from '../data/i18n'
import { scrollToChapter, scrollToTop } from '../lib/scroll'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'
import { InstallControl } from './InstallControl'

type TopBarProps = {
  onToggleVoice: () => void
}

export function TopBar({ onToggleVoice }: TopBarProps) {
  const setPanel = useExperience((state) => state.setPanel)
  const setMenuOpen = useExperience((state) => state.setMenuOpen)
  const activeChapter = useExperience((state) => state.activeChapter)
  const language = useExperience((state) => state.language)
  const setLanguage = useExperience((state) => state.setLanguage)
  const voiceOn = useExperience((state) => state.voiceOn)
  const hideSideText = useExperience((state) => state.hideSideText)
  const setHideSideText = useExperience((state) => state.setHideSideText)
  const copy = getUiCopy(language)
  const lastChapter = CHAPTERS.length - 1

  const goToStory = () => {
    const state = useExperience.getState()
    state.setAutoTour(false)
    state.setExplore(false)
    state.clearFocus()
    state.selectPart(null)
    scrollToChapter(1)
  }

  const openModel = () => {
    const state = useExperience.getState()
    state.setAutoTour(false)
    state.setProcessPlaying(false)
    state.setExplore(true)
    state.setPaused(false)
  }

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <button type="button" className="brand" onClick={() => scrollToTop()} aria-label={copy.brandAria}>
          <span className="brand__mark" aria-hidden="true">
            <Icon name="drop" size={21} />
          </span>
          <span className="brand__copy">
            <span className="brand__name">{copy.brandName}</span>
            <span className="brand__meta">{copy.brandMeta}</span>
          </span>
        </button>

        <nav className="topnav" aria-label={copy.navStory}>
          <button type="button" className="topnav__link" onClick={goToStory}>
            {copy.navStory}
          </button>
          <button type="button" className="topnav__link" onClick={openModel}>
            {copy.navInside}
          </button>
          <button type="button" className="topnav__link" onClick={() => setPanel('project')}>
            {copy.navProject}
          </button>
          <button type="button" className="topnav__link" onClick={() => setPanel('sources')}>
            {copy.navScience}
          </button>
        </nav>

        <div className="topbar__actions">
          <span className="live-status" aria-label={`${copy.modelLive}: Ahmadi Begum, Class 7B`}>
            <span className="live-status__pulse" />
            {copy.modelLive}
          </span>

          <div className="language-toggle" role="group" aria-label={copy.languageLabel}>
            <button
              type="button"
              className={language === 'en' ? 'is-active' : ''}
              onClick={() => setLanguage('en')}
              aria-pressed={language === 'en'}
              lang="en"
            >
              EN
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              className={language === 'hi' ? 'is-active' : ''}
              onClick={() => setLanguage('hi')}
              aria-pressed={language === 'hi'}
              lang="hi"
            >
              हिंदी
            </button>
          </div>

          <button
            type="button"
            className={`listen-button ${voiceOn ? 'is-on' : ''}`}
            onClick={onToggleVoice}
            aria-pressed={voiceOn}
            aria-label={voiceOn ? copy.muteVoice : copy.unmuteVoice}
            data-tooltip={voiceOn ? copy.voiceOn : copy.voiceOff}
          >
            <Icon name={voiceOn ? 'sound' : 'sound-off'} size={16} />
            <span className="listen-button__label">{voiceOn ? copy.voiceOn : copy.voiceOff}</span>
          </button>

          <InstallControl />

          <button
            type="button"
            className={`listen-button ${hideSideText ? 'is-on' : ''}`}
            onClick={() => setHideSideText(!hideSideText)}
            aria-pressed={hideSideText}
            aria-label={hideSideText ? copy.showSideText : copy.hideSideText}
            data-tooltip={hideSideText ? copy.showSideText : copy.hideSideText}
          >
            <Icon name="captions" size={16} />
          </button>

          <button
            type="button"
            className="chapters-button"
            onClick={() => setMenuOpen(true)}
            aria-label={`${copy.openChapters}. ${copy.chapterWord} ${activeChapter + 1} / ${CHAPTERS.length}.`}
          >
            <span className="chapters-button__index mono">
              {String(activeChapter).padStart(2, '0')} — {String(lastChapter).padStart(2, '0')}
            </span>
            <span className="chapters-button__label">{copy.chapters}</span>
            <Icon name="menu" size={16} />
          </button>
        </div>
      </div>
    </header>
  )
}
