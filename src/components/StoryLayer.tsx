import { AnimatePresence, motion } from 'motion/react'
import type { Chapter } from '../data/chapters'
import { CHAPTERS } from '../data/chapters'
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
  narrationSupported: boolean
  narrationOn: boolean
  speaking: boolean
  onToggleNarration: () => void
  onStartTour: () => void
  onReplay: () => void
}

function SourceTrail({ chapterId }: { chapterId: string }) {
  const setPanel = useExperience((state) => state.setPanel)
  const keys = CHAPTER_SOURCE_KEYS[chapterId] ?? []
  const orgs = keys
    .map((key) => SOURCES.find((source) => source.id === key)?.org)
    .filter(Boolean)
    .slice(0, 3)
  if (!orgs.length) return null
  return (
    <button type="button" className="source-trail" onClick={() => setPanel('sources')}>
      <span className="source-trail__label mono">Source trail</span>
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
  return (
    <div className="ocean-toggle" role="group" aria-label="Pacific Ocean state">
      <span className="ocean-toggle__label mono">Pacific state</span>
      <div className="segmented-control">
        <button
          type="button"
          className={oceanMode === 'normal' ? 'is-active' : ''}
          onClick={() => setOceanMode('normal')}
          aria-pressed={oceanMode === 'normal'}
        >
          <span className="segmented-control__dot segmented-control__dot--cool" />
          Normal
        </button>
        <button
          type="button"
          className={oceanMode === 'elnino' ? 'is-active is-warm' : ''}
          onClick={() => setOceanMode('elnino')}
          aria-pressed={oceanMode === 'elnino'}
        >
          <span className="segmented-control__dot segmented-control__dot--warm" />
          El Niño
        </button>
      </div>
    </div>
  )
}

function ChapterInteraction({ chapter, onReplay }: { chapter: Chapter; onReplay: () => void }) {
  const cutaway = useExperience((state) => state.cutaway)
  const toggleCutaway = useExperience((state) => state.toggleCutaway)
  const setPanel = useExperience((state) => state.setPanel)
  const setExplore = useExperience((state) => state.setExplore)
  const selectPart = useExperience((state) => state.selectPart)

  if (chapter.id === 'pacific') return <OceanToggle />
  if (chapter.id === 'filtration') {
    return (
      <button
        type="button"
        className={`inline-action ${cutaway ? 'is-active' : ''}`}
        onClick={toggleCutaway}
        aria-pressed={cutaway}
      >
        <Icon name="cutaway" size={17} />
        <span>{cutaway ? 'Close cutaway view' : 'Open cutaway view'}</span>
        <Icon name="arrow-right" size={14} />
      </button>
    )
  }
  if (chapter.id === 'storage') {
    return (
      <button type="button" className="inline-action" onClick={() => setPanel('calculator')}>
        <Icon name="drop" size={17} />
        <span>Estimate a rooftop harvest</span>
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
          }}
        >
          <Icon name={chapter.id === 'drip' ? 'layers' : 'cutaway'} size={17} />
          <span>{chapter.id === 'drip' ? 'Inspect the root zone' : 'Inspect the catchment'}</span>
          <Icon name="arrow-right" size={14} />
        </button>
      </div>
    )
  }
  if (chapter.id === 'whole-system') {
    return (
      <div className="finale-actions">
        <button type="button" className="button button--primary" onClick={onReplay}>
          <Icon name="reset" size={15} />
          Replay the story
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => {
            setExplore(true)
            scrollToChapter(CHAPTERS.length - 1)
          }}
        >
          <Icon name="explore" size={16} />
          Explore freely
        </button>
      </div>
    )
  }
  return null
}

function ChapterPanel({ chapter, index, onReplay }: { chapter: Chapter; index: number; onReplay: () => void }) {
  const setPanel = useExperience((state) => state.setPanel)
  const requestFocus = useExperience((state) => state.requestFocus)
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
    <article className={`chapter-panel chapter-panel--${chapter.align} ${chapter.id === 'whole-system' ? 'chapter-panel--finale' : ''}`}>
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
            <span>Chapter {chapter.number}</span>
            <span className="chapter-panel__status-pulse" />
            <span>{chapter.interaction === 'calculator' ? 'Interactive' : 'Live'}</span>
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

        <ChapterInteraction chapter={chapter} onReplay={onReplay} />

        <div className="chapter-panel__foot">
          {interactionPart ? (
            <button type="button" className="quiet-action" onClick={() => requestFocus(interactionPart)}>
              <Icon name="expand" size={14} />
              Focus the model
            </button>
          ) : (
            <button type="button" className="quiet-action" onClick={() => setPanel('sources')}>
              <Icon name="book" size={14} />
              Read the science
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

function Hero({
  narrationSupported,
  narrationOn,
  speaking,
  onToggleNarration,
  onStartTour,
}: Pick<StoryLayerProps, 'narrationSupported' | 'narrationOn' | 'speaking' | 'onToggleNarration' | 'onStartTour'>) {
  const setPanel = useExperience((state) => state.setPanel)

  return (
    <section className="hero-panel" aria-labelledby="hero-title">
      <div className="hero-panel__eyebrow">
        <span className="eyebrow">
          <span className="eyebrow__dot" />
          Class 7B · Science exhibition
        </span>
        <span className="hero-panel__eyebrow-divider" />
        <span className="mono hero-panel__year">Ahmadi Begum · 2026</span>
      </div>

      <h1 id="hero-title" className="hero-title">
        <span>Every drop</span>
        <span className="hero-title__accent">
          has a <em>story.</em>
        </span>
      </h1>

      <p className="hero-lede">
        From a warming Pacific to a single drop at a plant’s root. A working, three-dimensional study of
        <span> El Niño, rainwater harvesting and drip irrigation</span> — built to show how we prepare for an uncertain monsoon.
      </p>

      <div className="hero-actions">
        <button type="button" className="button button--primary button--large" onClick={() => scrollToChapter(1)}>
          Begin the journey
          <Icon name="arrow-down" size={17} className="button__arrow" />
        </button>
        {narrationSupported && (
          <button
            type="button"
            className={`button button--soft ${narrationOn ? 'is-on' : ''}`}
            onClick={onToggleNarration}
            aria-pressed={narrationOn}
          >
            <Icon name={speaking ? 'sound' : 'sound-off'} size={16} />
            {narrationOn ? (speaking ? 'Narrating' : 'Narration on') : 'Listen to the intro'}
          </button>
        )}
        <button type="button" className="button button--text" onClick={onStartTour}>
          <Icon name="play" size={14} />
          Play the guided tour
        </button>
      </div>

      <div className="hero-meta">
        <div className="hero-meta__item">
          <span className="mono">Exhibit</span>
          <strong>El Niño & Water Conservation</strong>
        </div>
        <div className="hero-meta__item">
          <span className="mono">Model</span>
          <strong>Rainwater harvesting · Drip irrigation</strong>
        </div>
        <div className="hero-meta__item">
          <span className="mono">Approach</span>
          <strong>Understand · Capture · Conserve</strong>
        </div>
      </div>

      <div className="hero-foot">
        <button type="button" className="scroll-cue" onClick={() => scrollToChapter(1)}>
          <span className="scroll-cue__line">
            <span />
          </span>
          <span>Scroll to follow the drop</span>
        </button>
        <div className="hero-foot__right">
          <button type="button" className="text-link" onClick={() => setPanel('project')}>
            About the project
            <Icon name="arrow-right" size={13} />
          </button>
          <span className="hero-foot__code mono">26°N · 82°E / 7B</span>
        </div>
      </div>
    </section>
  )
}

export function StoryLayer(props: StoryLayerProps) {
  const activeChapter = useExperience((state) => state.activeChapter)
  const chapter = CHAPTERS[activeChapter] ?? CHAPTERS[0]
  const isHero = activeChapter === 0
  const headerLabel = isHero ? 'Opening' : `Chapter ${chapter.number}`

  return (
    <div className="story-layer">
      <div className="story-layer__meta" aria-hidden="true">
        <span>{headerLabel}</span>
        <span className="story-layer__meta-line" />
        <span>El Niño / Water</span>
      </div>

      <div className="story-stage">
        <AnimatePresence mode="wait" initial={false}>
          {isHero ? (
            <motion.div
              key="hero"
              className="story-transition"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <Hero {...props} />
            </motion.div>
          ) : (
            <motion.div
              key={chapter.id}
              className="story-transition"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <ChapterPanel chapter={chapter} index={activeChapter} onReplay={props.onReplay} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="story-layer__announcement sr-only" aria-live="polite">
        {isHero ? 'Opening: Every drop has a story.' : `Chapter ${chapter.number}: ${chapter.title}`}
      </div>
    </div>
  )
}
