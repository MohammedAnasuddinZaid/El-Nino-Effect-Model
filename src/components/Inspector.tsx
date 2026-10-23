import { AnimatePresence, motion } from 'motion/react'
import { PARTS, PART_LIST, type PartId } from '../data/components'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'

export function Inspector() {
  const selectedPart = useExperience((state) => state.selectedPart)
  const focusPart = useExperience((state) => state.focusPart)
  const explore = useExperience((state) => state.explore)
  const selectPart = useExperience((state) => state.selectPart)
  const requestFocus = useExperience((state) => state.requestFocus)
  const clearFocus = useExperience((state) => state.clearFocus)
  const setExplore = useExperience((state) => state.setExplore)

  const part = selectedPart ? PARTS[selectedPart] : null
  const partIndex = part ? PART_LIST.findIndex((item) => item.id === part.id) : -1

  const close = () => {
    const hadFocus = Boolean(focusPart)
    selectPart(null)
    clearFocus()
    if (hadFocus) setExplore(false)
  }

  const choosePart = (id: PartId) => {
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
          aria-label={`Component details: ${part.name}`}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 22 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inspector__head">
            <span className="mono inspector__eyebrow">Component inspect</span>
            <button type="button" className="icon-button inspector__close" onClick={close} aria-label="Close inspector">
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
              <span className="mono">Upstream</span>
              <strong>{part.upstream}</strong>
            </div>
            <span className="inspector__flow-arrow" aria-hidden="true">
              <Icon name="arrow-right" size={15} />
            </span>
            <div>
              <span className="mono">Downstream</span>
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
              {focusPart === part.id ? 'Camera focused' : 'Focus camera'}
            </button>
            <button
              type="button"
              className={`button button--ghost ${explore ? 'is-on' : ''}`}
              onClick={() => setExplore(!explore)}
            >
              <Icon name="explore" size={16} />
              {explore ? 'Stop exploring' : 'Free explore'}
            </button>
          </div>

          <div className="inspector__foot">
            <span className="mono">
              Part {String(partIndex + 1).padStart(2, '0')} / {String(PART_LIST.length).padStart(2, '0')}
            </span>
            <div className="inspector__pager">
              <button
                type="button"
                className="icon-button"
                onClick={previous}
                disabled={partIndex <= 0}
                aria-label="Previous component"
              >
                <Icon name="arrow-left" size={15} />
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={next}
                disabled={partIndex >= PART_LIST.length - 1}
                aria-label="Next component"
              >
                <Icon name="arrow-right" size={15} />
              </button>
            </div>
          </div>
          <p className="inspector__hint mono">
            <span className={`inspector__hint-dot ${explore ? 'is-live' : ''}`} />
            {explore ? 'DRAG THE MODEL TO ORBIT' : 'FOCUS THE CAMERA TO ORBIT'}
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
