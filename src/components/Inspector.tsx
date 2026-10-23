import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PART_LIST, PART_NARRATION, type PartId } from '../data/components'
import { FILTER_LAYERS } from '../data/filterLayers'
import { getUiCopy } from '../data/i18n'
import { getPartInfo } from '../data/partCopy'
import { useExperience } from '../store/useExperience'
import { useNarration } from '../hooks/useNarration'
import { Icon } from './Icons'

export function Inspector() {
  const selectedPart = useExperience((state) => state.selectedPart)
  const focusPart = useExperience((state) => state.focusPart)
  const explore = useExperience((state) => state.explore)
  const language = useExperience((state) => state.language)
  const filterOpen = useExperience((state) => state.filterOpen)
  const filterLayer = useExperience((state) => state.filterLayer)
  const selectPart = useExperience((state) => state.selectPart)
  const requestFocus = useExperience((state) => state.requestFocus)
  const clearFocus = useExperience((state) => state.clearFocus)
  const setExplore = useExperience((state) => state.setExplore)
  const setFilterOpen = useExperience((state) => state.setFilterOpen)
  const setFilterLayer = useExperience((state) => state.setFilterLayer)
  const voiceOn = useExperience((state) => state.voiceOn)
  const motionDemo = useExperience((state) => state.motionDemo)
  const setMotionDemo = useExperience((state) => state.setMotionDemo)
  const oceanMode = useExperience((state) => state.oceanMode)
  const setOceanMode = useExperience((state) => state.setOceanMode)
  const copy = getUiCopy(language)

  const part = selectedPart ? getPartInfo(selectedPart, language) : null
  const partIndex = part ? PART_LIST.findIndex((item) => item.id === part.id) : -1
  const selectedLayer = filterLayer != null ? FILTER_LAYERS[filterLayer] : null

  const [explain, setExplain] = useState(false)
  const partNarration = part ? PART_NARRATION[part.id as PartId][language] : ''
  const narration = useNarration({
    src: part ? `/audio/${language}/part-${part.id}.mp3` : undefined,
    fallbackText: partNarration,
    language,
    enabled: explain && voiceOn,
    onEnd: () => setExplain(false),
  })

  useEffect(() => {
    setExplain(false)
  }, [selectedPart])

  const close = () => {
    const hadFocus = Boolean(focusPart)
    selectPart(null)
    clearFocus()
    setFilterOpen(false)
    setFilterLayer(null)
    if (hadFocus) setExplore(false)
  }

  const choosePart = (id: PartId) => {
    setFilterOpen(false)
    setFilterLayer(null)
    requestFocus(id)
  }

  const previous = () => {
    if (partIndex <= 0) return
    choosePart(PART_LIST[partIndex - 1].id)
  }
  const next = () => {
    if (partIndex < 0 || partIndex >= PART_LIST.length - 1) return
    choosePart(PART_LIST[partIndex + 1].id)
  }

  return (
    <AnimatePresence>
      {part && (
        <motion.aside
          className="inspector"
          aria-label={`${copy.inspectorEyebrow}: ${part.name}`}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 22 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inspector__head">
            <span className="mono inspector__eyebrow">{copy.inspectorEyebrow}</span>
            <button type="button" className="icon-button inspector__close" onClick={close} aria-label={copy.inspectorClose}>
              <Icon name="close" size={17} />
            </button>
          </div>

          <div className="inspector__identity">
            <span className="inspector__badge mono">{part.index}</span>
            <div>
              <span className="kicker kicker--small">{part.role}</span>
              <h2>{part.name}</h2>
            </div>
          </div>

          <p className="inspector__description">{part.description}</p>

          {part.id === 'filter' && (
            <section className={`filter-inspector ${filterOpen ? 'is-open' : ''}`} aria-label={copy.filterInside}>
              <div className="filter-inspector__head">
                <div>
                  <span className="mono filter-inspector__label">{copy.filterIllustrative}</span>
                  <h3>{copy.filterInside}</h3>
                </div>
                <button
                  type="button"
                  className={`filter-open-button ${filterOpen ? 'is-open' : ''}`}
                  onClick={() => {
                    setFilterOpen(!filterOpen)
                    if (!filterOpen) setFilterLayer(filterLayer ?? 3)
                  }}
                  aria-pressed={filterOpen}
                >
                  <Icon name={filterOpen ? 'close' : 'layers'} size={14} />
                  {filterOpen ? copy.filterClose : copy.filterOpen}
                </button>
              </div>

              <p className="filter-inspector__hint">
                {filterOpen ? copy.filterChooseLayer : copy.filterOpenHint}
              </p>

              {filterOpen && (
                <div className="filter-layer-list" role="list">
                  {FILTER_LAYERS.map((layer, index) => (
                    <button
                      key={layer.id}
                      type="button"
                      role="listitem"
                      className={`filter-layer ${filterLayer === index ? 'is-active' : ''}`}
                      onClick={() => setFilterLayer(index)}
                      aria-pressed={filterLayer === index}
                    >
                      <span className="filter-layer__index mono">{layer.index}</span>
                      <span className="filter-layer__name">{layer.name[language]}</span>
                      <span className="filter-layer__swatch" style={{ background: layer.color }} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}

              {filterOpen && selectedLayer && (
                <div className="filter-layer-detail">
                  <span className="mono filter-layer-detail__eyebrow">
                    {selectedLayer.index} / {copy.filterLayers}
                  </span>
                  <h4>{selectedLayer.name[language]}</h4>
                  <p>{selectedLayer.job[language]}</p>
                  <p className="filter-layer-detail__caution">
                    <Icon name="info" size={13} />
                    {selectedLayer.caution[language]}
                  </p>
                </div>
              )}

              <div className="filter-inspector__safety">
                <span className="mono">{copy.filterSafety}</span>
                <p>{copy.filterNote}</p>
              </div>
            </section>
          )}

          <dl className="inspector__facts">
            {part.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="mono">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>

          <div className="inspector__flow">
            <div>
              <span className="mono">{copy.upstream}</span>
              <strong>{part.upstream}</strong>
            </div>
            <span className="inspector__flow-arrow" aria-hidden="true">
              <Icon name="arrow-right" size={15} />
            </span>
            <div>
              <span className="mono">{copy.downstream}</span>
              <strong>{part.downstream}</strong>
            </div>
          </div>

          {part.caution && (
            <div className="inspector__caution">
              <Icon name="info" size={15} />
              <p>{part.caution}</p>
            </div>
          )}

          <div className="inspector__actions">
            <button
              type="button"
              className={`button button--primary ${focusPart === part.id ? 'is-focused' : ''}`}
              onClick={() => requestFocus(part.id)}
            >
              <Icon name={focusPart === part.id ? 'check' : 'expand'} size={15} />
              {focusPart === part.id ? copy.cameraFocused : copy.focusCamera}
            </button>
            <button
              type="button"
              className={`button button--ghost ${explore ? 'is-on' : ''}`}
              onClick={() => setExplore(!explore)}
            >
              <Icon name="explore" size={16} />
              {explore ? copy.stopExploring : copy.freeExplore}
            </button>
            <button
              type="button"
              className={`button button--ghost ${explain ? 'is-on' : ''}`}
              onClick={() => {
                if (!voiceOn) return
                setExplain((v) => !v)
              }}
              aria-pressed={explain}
            >
              <Icon name={explain ? 'pause' : 'play'} size={15} />
              {explain ? copy.stopExplaining : copy.explainPart}
            </button>
            <button
              type="button"
              className={`button button--ghost ${motionDemo ? 'is-on' : ''}`}
              onClick={() => setMotionDemo(!motionDemo)}
              aria-pressed={motionDemo}
            >
              <Icon name="sparkle" size={15} />
              {motionDemo ? copy.hideMotion : copy.showMotion}
            </button>
            {part.id === 'ocean' && (
              <button
                type="button"
                className={`button button--ghost ${oceanMode === 'elnino' ? 'is-on' : ''}`}
                onClick={() => setOceanMode(oceanMode === 'elnino' ? 'normal' : 'elnino')}
              >
                <Icon name="sun" size={15} />
                {oceanMode === 'elnino' ? copy.showNormal : copy.showElNino}
              </button>
            )}
          </div>

          <div className="inspector__foot">
            <span className="mono">
              {copy.partWord} {String(partIndex + 1).padStart(2, '0')} / {String(PART_LIST.length).padStart(2, '0')}
            </span>
            <div className="inspector__pager">
              <button
                type="button"
                className="icon-button"
                onClick={previous}
                disabled={partIndex <= 0}
                aria-label={copy.previousComponent}
              >
                <Icon name="arrow-left" size={15} />
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={next}
                disabled={partIndex >= PART_LIST.length - 1}
                aria-label={copy.nextComponent}
              >
                <Icon name="arrow-right" size={15} />
              </button>
            </div>
          </div>
          <p className="inspector__hint mono">
            <span className={`inspector__hint-dot ${explore ? 'is-live' : ''}`} />
            {explore ? copy.dragOrbit : copy.focusOrbit}
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
