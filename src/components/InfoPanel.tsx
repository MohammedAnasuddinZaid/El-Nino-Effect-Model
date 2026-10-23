import { useEffect, useState } from 'react'
import {
  getDossierUi,
  getFaqCopy,
  getProjectCopy,
  getSourceLibrary,
  type Source,
} from '../data/dossierContent'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'
import { Modal } from './Modal'

const CATEGORY_ORDER = ['climate', 'water', 'irrigation', 'safety'] as const

type DossierTab = 'overview' | 'method' | 'notes' | 'faq'

function ProjectDossier({ onSources }: { onSources: () => void }) {
  const language = useExperience((state) => state.language)
  const ui = getDossierUi(language)
  const project = getProjectCopy(language)
  const faq = getFaqCopy(language)
  const [tab, setTab] = useState<DossierTab>('overview')
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <header className="dossier-head">
        <div className="dossier-head__top">
          <span className="eyebrow">
            <span className="eyebrow__dot" />
            {ui.eyebrow}
          </span>
          <span className="mono dossier-head__year">{ui.year}</span>
        </div>
        <h2>{project.title}</h2>
        <p className="dossier-head__subtitle">{project.subtitle}</p>
        <div className="dossier-head__meta">
          <div>
            <span className="mono">{ui.student}</span>
            <strong>{project.student}</strong>
          </div>
          <div>
            <span className="mono">{ui.klass}</span>
            <strong>{project.className}</strong>
          </div>
          <div>
            <span className="mono">{ui.format}</span>
            <strong>{ui.formatValue}</strong>
          </div>
        </div>
      </header>

      <nav className="dossier-tabs" role="tablist" aria-label={ui.tabsAria}>
        {ui.tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`dossier-tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`dossier-panel-${id}`}
            className={tab === id ? 'is-active' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="dossier-body">
        {tab === 'overview' && (
          <div className="dossier-grid" role="tabpanel" id="dossier-panel-overview" aria-labelledby="dossier-tab-overview">
            <section className="dossier-section dossier-section--lead">
              <span className="section-label mono">{ui.secAim}</span>
              <p className="dossier-lead">{project.aim}</p>
            </section>

            <section className="dossier-section">
              <span className="section-label mono">{ui.secIdea}</span>
              <h3>{ui.ideaHeading}</h3>
              <p>{ui.ideaP1}</p>
              <p>{ui.ideaP2}</p>
            </section>

            <section className="dossier-section dossier-section--quote">
              <span className="section-label mono">{ui.secConclusion}</span>
              <blockquote>{project.conclusion}</blockquote>
              <p className="dossier-message">{project.socialMessage}</p>
            </section>

            <section className="dossier-section">
              <span className="section-label mono">{ui.secObjectives}</span>
              <ul className="numbered-list">
                {project.objectives.map((objective, index) => (
                  <li key={objective}>
                    <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                    <p>{objective}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {tab === 'method' && (
          <div className="dossier-grid" role="tabpanel" id="dossier-panel-method" aria-labelledby="dossier-tab-method">
            <section className="dossier-section dossier-section--wide">
              <span className="section-label mono">{ui.secBuildMethod}</span>
              <h3>{ui.methodHeading}</h3>
              <ol className="method-list">
                {project.methodology.map((step, index) => (
                  <li key={step}>
                    <span className="method-list__index mono">{String(index + 1).padStart(2, '0')}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section className="dossier-section">
              <span className="section-label mono">{ui.secOutcomes}</span>
              <ul className="plain-list">
                {project.outcomes.map((outcome) => (
                  <li key={outcome}>
                    <Icon name="check" size={14} />
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>
            <section className="dossier-section">
              <span className="section-label mono">{ui.secApplications}</span>
              <ul className="plain-list">
                {project.applications.map((application) => (
                  <li key={application}>
                    <span className="plain-list__dot" />
                    {application}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {tab === 'notes' && (
          <div className="dossier-grid" role="tabpanel" id="dossier-panel-notes" aria-labelledby="dossier-tab-notes">
            <section className="dossier-section dossier-section--wide">
              <span className="section-label mono">{ui.secClaims}</span>
              <h3>{ui.claimsHeading}</h3>
              <div className="caution-grid">
                {project.limitations.map((limitation, index) => (
                  <div key={limitation} className="caution-item">
                    <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                    <p>{limitation}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="dossier-section">
              <span className="section-label mono">{ui.secVerify}</span>
              <h3>{ui.verifyHeading}</h3>
              <ul className="plain-list plain-list--muted">
                {project.openQuestions.map((question) => (
                  <li key={question}>
                    <span className="plain-list__dot" />
                    {question}
                  </li>
                ))}
              </ul>
            </section>
            <section className="dossier-section dossier-section--accent">
              <span className="section-label mono">{ui.secDesignNote}</span>
              <h3>{ui.designHeading}</h3>
              <p>{ui.designP1}</p>
              <p>{ui.designP2}</p>
            </section>
          </div>
        )}

        {tab === 'faq' && (
          <div className="dossier-grid" role="tabpanel" id="dossier-panel-faq" aria-labelledby="dossier-tab-faq">
            <section className="dossier-section dossier-section--wide">
              <span className="section-label mono">{ui.secVisitorQ}</span>
              <h3>{ui.faqHeading}</h3>
              <div className="faq-list">
                {faq.map((item, index) => {
                  const isOpen = openFaq === index
                  return (
                    <div key={item.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                      <button
                        type="button"
                        className="faq-item__question"
                        aria-expanded={isOpen}
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      >
                        <span>
                          <span className="mono faq-item__group">{item.group}</span>
                          {item.q}
                        </span>
                        <Icon name="plus" size={16} />
                      </button>
                      <div className="faq-item__answer" aria-hidden={!isOpen}>
                        <p>{item.a}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        )}
      </div>

      <footer className="dossier-footer">
        <button type="button" className="button button--ghost" onClick={onSources}>
          <Icon name="book" size={15} />
          {ui.openSources}
        </button>
        <span className="mono">{project.student} · {project.className} · 2026</span>
      </footer>
    </>
  )
}

function SourcesPanel({ onProject }: { onProject: () => void }) {
  const language = useExperience((state) => state.language)
  const ui = getDossierUi(language)
  const sources = getSourceLibrary(language)
  const groups: Record<(typeof CATEGORY_ORDER)[number], Source[]> = {
    climate: [],
    water: [],
    irrigation: [],
    safety: [],
  }
  sources.forEach((source) => groups[source.category].push(source))

  return (
    <>
      <header className="dossier-head">
        <div className="dossier-head__top">
          <span className="eyebrow">
            <span className="eyebrow__dot eyebrow__dot--warm" />
            {ui.sourcesEyebrow}
          </span>
          <span className="mono dossier-head__year">{ui.sourcesCount}</span>
        </div>
        <h2>{ui.sourcesHeading}</h2>
        <p className="dossier-head__subtitle">{ui.sourcesLede}</p>
      </header>

      <div className="dossier-body">
        <div className="method-principles">
          {ui.principles.map((principle) => (
            <div key={principle.index}>
              <span className="mono">{principle.index}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </div>
          ))}
        </div>

        <div className="source-groups">
          {CATEGORY_ORDER.map((category) => {
            const list = groups[category]
            if (!list.length) return null
            return (
              <section className="source-group" key={category}>
                <div className="source-group__head">
                  <span className="section-label mono">{ui.categories[category]}</span>
                  <span className="mono source-group__count">{String(list.length).padStart(2, '0')}</span>
                </div>
                <div className="source-list">
                  {list.map((source, index) => (
                    <a
                      key={source.id}
                      className="source-card"
                      href={source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span className="source-card__index mono">
                        {String(CATEGORY_ORDER.indexOf(category) + 1)}.{index + 1}
                      </span>
                      <div className="source-card__body">
                        <span className="source-card__org mono">{source.org}</span>
                        <h3>{source.title}</h3>
                        <p>{source.use}</p>
                      </div>
                      <span className="source-card__arrow" aria-hidden="true">
                        <Icon name="arrow-right" size={16} />
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <section className="sources-note">
          <Icon name="info" size={17} />
          <div>
            <h3>{ui.sourceNoteHeading}</h3>
            <p>{ui.sourceNoteText}</p>
          </div>
        </section>
      </div>

      <footer className="dossier-footer">
        <button type="button" className="button button--ghost" onClick={onProject}>
          <Icon name="book" size={15} />
          {ui.openProject}
        </button>
        <span className="mono">{ui.sourcesFoot}</span>
      </footer>
    </>
  )
}

export function InfoPanel() {
  const panel = useExperience((state) => state.panel)
  const setPanel = useExperience((state) => state.setPanel)
  const language = useExperience((state) => state.language)
  const ui = getDossierUi(language)
  const open = panel === 'project' || panel === 'sources'
  const isSources = panel === 'sources'

  useEffect(() => {
    if (open) {
      // Reset any nested state when the panel changes via a child link.
    }
  }, [open, panel])

  return (
    <Modal
      open={open}
      onClose={() => setPanel(null)}
      label={isSources ? ui.sourcesPanel : ui.projectPanel}
      className="dossier-modal"
    >
      {isSources ? (
        <SourcesPanel onProject={() => setPanel('project')} />
      ) : (
        <ProjectDossier onSources={() => setPanel('sources')} />
      )}
    </Modal>
  )
}
