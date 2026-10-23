import { AnimatePresence, motion } from 'motion/react'
import { useCallback } from 'react'
import type { Chapter } from '../data/chapters'
import { CHAPTERS, getChapterCopy } from '../data/chapters'
import { getUiCopy } from '../data/i18n'
import { SOURCES } from '../data/siteContent'
import { scrollToChapter } from '../lib/scroll'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'

const CHAPTER_SOURCE_KEYS: Record<string, string[]> = {
  'every-drop': ['noaa-elnino', 'cgwb', 'fao-drip'],
  pacific: ['noaa-elnino', 'climate-gov-enso', 'nasa-elnino'],
  monsoon: ['imd-faq', 'noaa-elnino'],
  scarcity: ['imd-faq'],
  'catch-rain': ['cgwb', 'telangana'],
  filtration: ['cgwb', 'who-water'],
  storage: ['cgwb', 'telangana'],
  drip: ['fao-drip'],
  'whole-system': ['fao-drip', 'noaa-elnino', 'cgwb'],
}

type StoryLayerProps = {
  onStartTour: () => void
  onReplay: () => void
  onToggleStep: () => void
  onExplore: () => void
}

function SourceTrail({ chapterId }: { chapterId: string }) {
  const setPanel = useExperience((state) => state.setPanel)
  const language = useExperience((state) => state.language)
  const copy = getUiCopy(language)
  const keys = CHAPTER_SOURCE_KEYS[chapterId] ?? []
  const orgs = keys
    .map((key) => SOURCES.find((source) => source.id === key)?.org)
    .filter(Boolean)
    .slice(0, 3)
  if (!orgs.length) return null
  return (
    <button type="button" className="source-trail" onClick={() => setPanel('sources')}>
      <span className="source-trail__label mono">{copy.sourceTrail}</span>
      <span className="source-trail__orgs">{orgs.join(' · ')}</span>
      <Icon name="arrow-right" size={13} />
    </button>
  )
}

function Caption({ chapter }: { chapter: Chapter }) {
  const captions = useExperience((state) => state.captions)
  if (!captions) return null
  return (
    <div className="caption-strip" aria-live="polite">
      <span className="caption-strip__cc mono">CC</span>
      <p>{chapter.caption}</p>
    </div>
  )
}

function OceanToggle() {
  const oceanMode = useExperience((state) => state.oceanMode)
  const setOceanMode = useExperience((state) => state.setOceanMode)
  const language = useExperience((state) => state.language)
  const copy = getUiCopy(language)
  return (
    <div className="ocean-toggle" role="group" aria-label={copy.oceanState}>
      <span className="ocean-toggle__label mono">{copy.oceanState}</span>
      <div className="segmented-control">
        <button
          type="button"
          className={oceanMode === 'normal' ? 'is-active' : ''}
          onClick={() => setOceanMode('normal')}
          aria-pressed={oceanMode === 'normal'}
        >
          <span className="segmented-control__dot segmented-control__dot--cool" />
          {copy.normal}
        </button>
        <button
          type="button"
          className={oceanMode === 'elnino' ? 'is-active is-warm' : ''}
          onClick={() => setOceanMode('elnino')}
          aria-pressed={oceanMode === 'elnino'}
        >
          <span className="segmented-control__dot segmented-control__dot--warm" />
          {copy.elNino}
        </button>
      </div>
    </div>
  )
}

function StepPlay({ onToggleStep }: { onToggleStep: () => void }) {
  const processPlaying = useExperience((state) => state.processPlaying)
  const language = useExperience((state) => state.language)
  const copy = getUiCopy(language)
  return (
    <button
      type="button"
      className={`chapter-step ${processPlaying ? 'is-playing' : ''}`}
      onClick={onToggleStep}
      aria-pressed={processPlaying}
    >
      <span className="chapter-step__icon">
        <Icon name={processPlaying ? 'pause' : 'play'} size={14} />
      </span>
      <span className="chapter-step__copy">
        <strong>{processPlaying ? copy.pauseStep : copy.presentStep}</strong>
        <em>{processPlaying ? copy.stepPlaying : copy.stepNote}</em>
      </span>
      <span className={`chapter-step__wave ${processPlaying ? 'is-active' : ''}`} aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  )
}

function ChapterInteraction({ chapter, onReplay, onExplore }: { chapter: Chapter; onReplay: () => void; onExplore: () => void }) {
  const cutaway = useExperience((state) => state.cutaway)
  const toggleCutaway = useExperience((state) => state.toggleCutaway)
  const setPanel = useExperience((state) => state.setPanel)
  const setFilterOpen = useExperience((state) => state.setFilterOpen)
  const requestFocus = useExperience((state) => state.requestFocus)
  const selectPart = useExperience((state) => state.selectPart)
  const language = useExperience((state) => state.language)
  const copy = getUiCopy(language)

  const openFilter = () => {
    setFilterOpen(true)
    requestFocus('filter')
  }

  if (chapter.id === 'pacific') return <OceanToggle />
  if (chapter.id === 'filtration') {
    return (
      <div className="chapter-inline-group">
        <button
          type="button"
          className="inline-action inline-action--strong"
          onClick={openFilter}
        >
          <Icon name="layers" size={17} />
          <span>{copy.filterOpen}</span>
          <Icon name="arrow-right" size={14} />
        </button>
        <button
          type="button"
          className={`inline-action ${cutaway ? 'is-active' : ''}`}
          onClick={toggleCutaway}
          aria-pressed={cutaway}
        >
          <Icon name="cutaway" size={17} />
          <span>{cutaway ? copy.closeCutaway : copy.openCutaway}</span>
        </button>
      </div>
    )
  }
  if (chapter.id === 'storage') {
    return (
      <button type="button" className="inline-action" onClick={() => setPanel('calculator')}>
        <Icon name="drop" size={17} />
        <span>{copy.estimateHarvest}</span>
        <Icon name="arrow-right" size={14} />
      </button>
    )
  }
  if (chapter.id === 'catch-rain' || chapter.id === 'drip') {
    return (
      <div className="inline-action-row">
        <button
          type="button"
          className="inline-action"
          onClick={() => {
            selectPart(chapter.id === 'drip' ? 'roots' : 'roof')
            requestFocus(chapter.id === 'drip' ? 'roots' : 'roof')
          }}
        >
          <Icon name={chapter.id === 'drip' ? 'layers' : 'cutaway'} size={17} />
          <span>{chapter.id === 'drip' ? copy.inspectRoot : copy.inspectCatchment}</span>
          <Icon name="arrow-right" size={14} />
        </button>
      </div>
    )
  }
  if (chapter.id === 'whole-system') {
    return (
      <div className="finale-actions">
        <button type="button" className="button button--primary" onClick={onReplay}>
          <Icon name="play" size={15} />
          {copy.replayStory}
        </button>
        <button type="button" className="button button--ghost" onClick={onExplore}>
          <Icon name="explore" size={16} />
          {copy.exploreFreely}
        </button>
      </div>
    )
  }
  return null
}

function ChapterPanel({
  chapter,
  index,
  onReplay,
  onToggleStep,
  onExplore,
}: {
  chapter: Chapter
  index: number
  onReplay: () => void
  onToggleStep: () => void
  onExplore: () => void
}) {
  const setPanel = useExperience((state) => state.setPanel)
  const requestFocus = useExperience((state) => state.requestFocus)
  const language = useExperience((state) => state.language)
  const copy = getUiCopy(language)
  const interactionPart =
    chapter.id === 'pacific'
      ? 'ocean'
      : chapter.id === 'storage'
        ? 'tank'
        : chapter.id === 'filtration'
          ? 'filter'
          : chapter.id === 'drip'
            ? 'roots'
            : chapter.id === 'catch-rain'
              ? 'roof'
              : chapter.id === 'whole-system'
                ? 'ocean'
                : null

  return (
    <article
      className={`chapter-panel chapter-panel--${chapter.align} chapter-panel--${chapter.id} ${
        chapter.id === 'whole-system' ? 'chapter-panel--finale' : ''
      }`}
    >
      <div className="chapter-panel__rail" aria-hidden="true">
        <span className="chapter-panel__rail-index mono">{chapter.number}</span>
        <span className="chapter-panel__rail-line" />
        <span className="chapter-panel__rail-total mono">08</span>
      </div>

      <div className="chapter-panel__content">
        <div className="chapter-panel__head">
          <span className="kicker">
            <span className="kicker__dot" />
            {chapter.kicker}
          </span>
          <div className="chapter-panel__status mono">
            <span>{copy.chapterWord} {chapter.number}</span>
            <span className="chapter-panel__status-pulse" />
            <span>{chapter.interaction === 'calculator' ? copy.interactive : copy.live}</span>
          </div>
        </div>

        <h2 className="chapter-title">{chapter.title}</h2>
        <p className="chapter-body">{chapter.body}</p>

        {chapter.note && (
          <div className="chapter-note">
            <Icon name="info" size={15} />
            <p>{chapter.note}</p>
          </div>
        )}

        <dl className="chapter-metrics">
          {chapter.metrics.map((metric) => (
            <div key={metric.label} className={`chapter-metric chapter-metric--${metric.tone ?? 'neutral'}`}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>

        <StepPlay onToggleStep={onToggleStep} />
        <ChapterInteraction chapter={chapter} onReplay={onReplay} onExplore={onExplore} />

        <div className="chapter-panel__foot">
          {interactionPart ? (
            <button type="button" className="quiet-action" onClick={() => requestFocus(interactionPart)}>
              <Icon name="expand" size={14} />
              {copy.focusModel}
            </button>
          ) : (
            <button type="button" className="quiet-action" onClick={() => setPanel('sources')}>
              <Icon name="book" size={14} />
              {copy.readScience}
            </button>
          )}
          <span className="chapter-panel__count mono">
            {String(index + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}
          </span>
        </div>

        <SourceTrail chapterId={chapter.id} />
        <Caption chapter={chapter} />
      </div>
    </article>
  )
}

function Hero({ onStartTour, onExplore }: { onStartTour: () => void; onExplore: () => void }) {
  const setPanel = useExperience((state) => state.setPanel)
  const language = useExperience((state) => state.language)
  const copy = getUiCopy(language)

  return (
    <section className="hero-panel" aria-labelledby="hero-title">
      <div className="hero-panel__eyebrow">
        <span className="eyebrow">
          <span className="eyebrow__dot" />
          {copy.heroEyebrow}
        </span>
        <span className="hero-panel__eyebrow-divider" />
        <span className="mono hero-panel__year">{copy.heroYear}</span>
      </div>

      <p className="hero-kicker">Ahmadi Begum · Class 7B</p>
      <h1 id="hero-title" className="hero-title">
        <span>{copy.heroTitleTop}</span>
        <span className="hero-title__accent">{copy.heroTitleAccent}</span>
      </h1>

      <p className="hero-lede">
        {copy.heroLedeA} <span>{copy.heroLedeHighlight}</span> {copy.heroLedeB}
      </p>

      <div className="hero-actions">
        <button type="button" className="button button--primary button--large" onClick={onStartTour}>
          <Icon name="play" size={15} />
          {copy.heroPresent}
        </button>
        <button type="button" className="button button--soft" onClick={onExplore}>
          <Icon name="explore" size={16} />
          {copy.heroExplore}
        </button>
        <button type="button" className="button button--text" onClick={() => setPanel('project')}>
          <Icon name="book" size={14} />
          {copy.heroAbout}
        </button>
      </div>

      <div className="hero-meta">
        <div className="hero-meta__item">
          <span className="mono">{copy.heroExhibitLabel}</span>
          <strong>{copy.heroExhibitValue}</strong>
        </div>
        <div className="hero-meta__item">
          <span className="mono">{copy.heroModelLabel}</span>
          <strong>{copy.heroModelValue}</strong>
        </div>
        <div className="hero-meta__item">
          <span className="mono">{copy.heroApproachLabel}</span>
          <strong>{copy.heroApproachValue}</strong>
        </div>
      </div>

      <div className="hero-foot">
        <button type="button" className="scroll-cue" onClick={() => scrollToChapter(1)}>
          <span className="scroll-cue__line">
            <span />
          </span>
          <span>{copy.heroScroll}</span>
        </button>
        <div className="hero-foot__right">
          <span className="hero-credit">{copy.heroSourceLabel}</span>
          <strong className="hero-credit__name">{copy.heroSourceValue}</strong>
        </div>
      </div>
    </section>
  )
}

export function StoryLayer({ onStartTour, onReplay, onToggleStep, onExplore }: StoryLayerProps) {
  const activeChapter = useExperience((state) => state.activeChapter)
  const explore = useExperience((state) => state.explore)
  const selectedPart = useExperience((state) => state.selectedPart)
  const language = useExperience((state) => state.language)
  const copy = getUiCopy(language)
  const rawChapter = CHAPTERS[activeChapter] ?? CHAPTERS[0]
  const chapter = getChapterCopy(rawChapter, language)
  const isHero = activeChapter === 0
  const headerLabel = isHero ? copy.opening : `${copy.chapterWord} ${chapter.number}`

  const scrollDown = useCallback(() => scrollToChapter(1), [])

  return (
    <div className="story-layer" inert={explore || Boolean(selectedPart)}>
      <div className="story-layer__meta" aria-hidden="true">
        <span>{headerLabel}</span>
        <span className="story-layer__meta-line" />
        <span>{copy.storyMetaLeft}</span>
      </div>

      <div className="story-stage">
        <AnimatePresence mode="wait" initial={false}>
          {isHero ? (
            <motion.div
              key="hero"
              className="story-transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Hero onStartTour={onStartTour} onExplore={onExplore} />
            </motion.div>
          ) : (
            <motion.div
              key={chapter.id}
              className="story-transition"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            >
              <ChapterPanel
                chapter={chapter}
                index={activeChapter}
                onReplay={onReplay}
                onToggleStep={onToggleStep}
                onExplore={onExplore}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="story-layer__announcement sr-only" aria-live="polite">
        {isHero
          ? `${copy.opening}: ${copy.heroTitleTop} ${copy.heroTitleAccent}`
          : `${copy.chapterWord} ${chapter.number}: ${chapter.title}`}
      </div>
      <button type="button" className="story-scroll-cue" onClick={scrollDown} aria-label={copy.heroScroll}>
        <Icon name="arrow-down" size={14} />
      </button>
    </div>
  )
}
