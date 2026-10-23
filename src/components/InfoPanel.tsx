import { useEffect, useState } from 'react'
import { FAQ, PROJECT, SOURCES } from '../data/siteContent'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'
import { Modal } from './Modal'

const CATEGORY_LABELS = {
  climate: 'Climate science',
  water: 'Rainwater & water',
  irrigation: 'Irrigation',
  safety: 'Water safety',
} as const

const CATEGORY_ORDER = ['climate', 'water', 'irrigation', 'safety'] as const

type DossierTab = 'overview' | 'method' | 'notes' | 'faq'

function ProjectDossier({ onSources }: { onSources: () => void }) {
  const [tab, setTab] = useState<DossierTab>('overview')
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <>
      <header className="dossier-head">
        <div className="dossier-head__top">
          <span className="eyebrow">
            <span className="eyebrow__dot" />
            Project dossier · Science exhibition
          </span>
          <span className="mono dossier-head__year">2026 / Class 7B</span>
        </div>
        <h2>{PROJECT.title}</h2>
        <p className="dossier-head__subtitle">{PROJECT.subtitle}</p>
        <div className="dossier-head__meta">
          <div>
            <span className="mono">Student</span>
            <strong>{PROJECT.student}</strong>
          </div>
          <div>
            <span className="mono">Class</span>
            <strong>{PROJECT.className}</strong>
          </div>
          <div>
            <span className="mono">Format</span>
            <strong>Interactive 3D model</strong>
          </div>
        </div>
      </header>

      <nav className="dossier-tabs" role="tablist" aria-label="Project dossier sections">
        {(
          [
            ['overview', 'Overview'],
            ['method', 'Method'],
            ['notes', 'Model notes'],
            ['faq', 'Questions & answers'],
          ] as [DossierTab, string][]
        ).map(([id, label]) => (
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
              <span className="section-label mono">01 / Aim</span>
              <p className="dossier-lead">{PROJECT.aim}</p>
            </section>

            <section className="dossier-section">
              <span className="section-label mono">02 / The idea</span>
              <h3>Climate is uncertain. Water planning need not be.</h3>
              <p>
                El Niño is a natural pattern, not a controllable event. It can tilt the odds of rainfall one way or
                another, but it cannot decide a single village’s weather. The practical response is to prepare: catch
                rain when it arrives, store it safely, and deliver it where it grows food.
              </p>
              <p>
                This exhibit connects a simplified Pacific cross-section to a rooftop catchment, a filter and tank, and
                a drip-irrigated crop bed. Each stage is built to be explored — not simply watched.
              </p>
            </section>

            <section className="dossier-section dossier-section--quote">
              <span className="section-label mono">03 / Conclusion</span>
              <blockquote>{PROJECT.conclusion}</blockquote>
              <p className="dossier-message">{PROJECT.socialMessage}</p>
            </section>

            <section className="dossier-section">
              <span className="section-label mono">04 / Objectives</span>
              <ul className="numbered-list">
                {PROJECT.objectives.map((objective, index) => (
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
              <span className="section-label mono">Build method</span>
              <h3>From model base to working water route.</h3>
              <ol className="method-list">
                {PROJECT.methodology.map((step, index) => (
                  <li key={step}>
                    <span className="method-list__index mono">{String(index + 1).padStart(2, '0')}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section className="dossier-section">
              <span className="section-label mono">Outcomes</span>
              <ul className="plain-list">
                {PROJECT.outcomes.map((outcome) => (
                  <li key={outcome}>
                    <Icon name="check" size={14} />
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>
            <section className="dossier-section">
              <span className="section-label mono">Applications</span>
              <ul className="plain-list">
                {PROJECT.applications.map((application) => (
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
              <span className="section-label mono">What the digital model does — and does not — claim</span>
              <h3>Clarity with limits.</h3>
              <div className="caution-grid">
                {PROJECT.limitations.map((limitation, index) => (
                  <div key={limitation} className="caution-item">
                    <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                    <p>{limitation}</p>
                  </div>
                ))}
              </div>
            </section>
            <section className="dossier-section">
              <span className="section-label mono">To verify against the physical build</span>
              <h3>Open model notes</h3>
              <ul className="plain-list plain-list--muted">
                {PROJECT.openQuestions.map((question) => (
                  <li key={question}>
                    <span className="plain-list__dot" />
                    {question}
                  </li>
                ))}
              </ul>
            </section>
            <section className="dossier-section dossier-section--accent">
              <span className="section-label mono">Design note</span>
              <h3>The pump is an interpretation.</h3>
              <p>
                The digital scene shows a low DC pump between the storage tank and the raised field, based on the
                supplied materials list. The final physical arrangement could be gravity-fed or pumped. This is a
                modelling choice, clearly labelled in the component inspector.
              </p>
              <p>
                Filter media, the wetting bulb and the Pacific cross-section are educational visualizations. They are
                built to explain processes — not to simulate measurements.
              </p>
            </section>
          </div>
        )}

        {tab === 'faq' && (
          <div className="dossier-grid" role="tabpanel" id="dossier-panel-faq" aria-labelledby="dossier-tab-faq">
            <section className="dossier-section dossier-section--wide">
              <span className="section-label mono">Visitor questions</span>
              <h3>Ask the exhibit.</h3>
              <div className="faq-list">
                {FAQ.map((item, index) => {
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
          Open the source library
        </button>
        <span className="mono">Ahmadi Begum · Class 7B · 2026</span>
      </footer>
    </>
  )
}

function SourcesPanel({ onProject }: { onProject: () => void }) {
  return (
    <>
      <header className="dossier-head">
        <div className="dossier-head__top">
          <span className="eyebrow">
            <span className="eyebrow__dot eyebrow__dot--warm" />
            Evidence & method
          </span>
          <span className="mono dossier-head__year">09 sources</span>
        </div>
        <h2>The science behind the story.</h2>
        <p className="dossier-head__subtitle">
          The exhibit simplifies complex Earth systems. These sources anchor the explanations; the limitations below
          mark where the digital model stops and the physical model begins.
        </p>
      </header>

      <div className="dossier-body">
        <div className="method-principles">
          <div>
            <span className="mono">01</span>
            <h3>Odds, not guarantees</h3>
            <p>El Niño is described as a shift in the probability of rainfall patterns — never as a guaranteed drought.</p>
          </div>
          <div>
            <span className="mono">02</span>
            <h3>Clarity, not purity</h3>
            <p>A visual filter is not a drinking-water treatment system. Safety needs testing and appropriate treatment.</p>
          </div>
          <div>
            <span className="mono">03</span>
            <h3>Models explain</h3>
            <p>Digital cutaways and the wetting bulb are illustrative teaching tools, not measured data.</p>
          </div>
        </div>

        <div className="source-groups">
          {CATEGORY_ORDER.map((category) => {
            const sources = SOURCES.filter((source) => source.category === category)
            if (!sources.length) return null
            return (
              <section className="source-group" key={category}>
                <div className="source-group__head">
                  <span className="section-label mono">{CATEGORY_LABELS[category]}</span>
                  <span className="mono source-group__count">{String(sources.length).padStart(2, '0')}</span>
                </div>
                <div className="source-list">
                  {sources.map((source, index) => (
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
            <h3>On interpretation</h3>
            <p>
              This is a student science exhibit, not a research paper or a forecast. The digital ocean is a
              schematic; the filter media and soil cutaway are educational visualizations; the harvest calculator is
              an estimate based on user inputs. The physical model’s final filter layers, pump arrangement and
              catchment details should be recorded once the build is complete.
            </p>
          </div>
        </section>
      </div>

      <footer className="dossier-footer">
        <button type="button" className="button button--ghost" onClick={onProject}>
          <Icon name="book" size={15} />
          Open the project dossier
        </button>
        <span className="mono">Compiled for the Class 7B exhibition · 2026</span>
      </footer>
    </>
  )
}

export function InfoPanel() {
  const panel = useExperience((state) => state.panel)
  const setPanel = useExperience((state) => state.setPanel)
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
      label={isSources ? 'Source library' : 'Project dossier'}
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
