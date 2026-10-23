import { useMemo, useState } from 'react'
import { getDossierUi } from '../data/dossierContent'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'
import { Modal } from './Modal'

type FieldProps = {
  id: string
  label: string
  unit: string
  min: number
  max: number
  step: number
  value: number
  display: string
  onChange: (value: number) => void
}

function RangeField({ id, label, unit, min, max, step, value, display, onChange }: FieldProps) {
  const percentage = ((value - min) / (max - min)) * 100
  return (
    <label className="range-field" htmlFor={id}>
      <span className="range-field__top">
        <span className="range-field__label">{label}</span>
        <span className="range-field__value mono">
          {display}
          <span>{unit}</span>
        </span>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ '--range-fill': `${percentage}%` } as React.CSSProperties}
      />
      <span className="range-field__scale mono" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </span>
    </label>
  )
}

export function HarvestCalculator() {
  const panel = useExperience((state) => state.panel)
  const setPanel = useExperience((state) => state.setPanel)
  const language = useExperience((state) => state.language)
  const t = getDossierUi(language).calculator
  const open = panel === 'calculator'
  const [roofArea, setRoofArea] = useState(40)
  const [rainfall, setRainfall] = useState(50)
  const [runoff, setRunoff] = useState(0.8)
  const [tankCapacity, setTankCapacity] = useState(1500)

  const result = useMemo(() => {
    const gross = roofArea * rainfall
    const harvest = gross * runoff
    const stored = Math.min(harvest, tankCapacity)
    const overflow = Math.max(harvest - tankCapacity, 0)
    const fill = Math.min(100, (harvest / tankCapacity) * 100)
    return {
      gross: Math.round(gross),
      harvest: Math.round(harvest),
      stored: Math.round(stored),
      overflow: Math.round(overflow),
      fill,
    }
  }, [rainfall, roofArea, runoff, tankCapacity])

  const close = () => setPanel(null)

  return (
    <Modal open={open} onClose={close} label={t.label} className="calculator-modal">
      <header className="calculator-head">
        <span className="eyebrow">
          <span className="eyebrow__dot" />
          {t.eyebrow}
        </span>
        <h2>{t.heading}</h2>
        <p>{t.lede}</p>
      </header>

      <div className="calculator-grid">
        <div className="calculator-form">
          <div className="calculator-form__intro">
            <span className="mono">{t.inputs}</span>
            <span className="mono">{t.metric}</span>
          </div>
          <RangeField
            id="roof-area"
            label={t.roofArea}
            unit="m²"
            min={5}
            max={200}
            step={1}
            value={roofArea}
            display={String(roofArea)}
            onChange={setRoofArea}
          />
          <RangeField
            id="rainfall-depth"
            label={t.rainfall}
            unit="mm"
            min={5}
            max={300}
            step={5}
            value={rainfall}
            display={String(rainfall)}
            onChange={setRainfall}
          />
          <RangeField
            id="runoff-coefficient"
            label={t.runoff}
            unit="%"
            min={0.4}
            max={1}
            step={0.05}
            value={runoff}
            display={String(Math.round(runoff * 100))}
            onChange={setRunoff}
          />
          <RangeField
            id="tank-capacity"
            label={t.tankCapacity}
            unit="L"
            min={200}
            max={10000}
            step={100}
            value={tankCapacity}
            display={tankCapacity.toLocaleString('en-IN')}
            onChange={setTankCapacity}
          />

          <div className="calculator-formula">
            <span className="mono">{t.formulaLabel}</span>
            <p>
              {t.formulaLine}
              <br />
              <span>{t.formulaResult}</span>
            </p>
            <span className="mono calculator-formula__note">{t.formulaNote}</span>
          </div>
        </div>

        <div className="calculator-result">
          <div className="calculator-result__top">
            <span className="mono">{t.eventLabel}</span>
            <span className="status-chip">
              <span />
              {t.estimate}
            </span>
          </div>

          <div className="harvest-tank" aria-hidden="true">
            <div className="harvest-tank__cap" />
            <div className="harvest-tank__body">
              <div className="harvest-tank__water" style={{ height: `${Math.max(8, result.fill)}%` }}>
                <span className="harvest-tank__surface" />
              </div>
              <div className="harvest-tank__ticks">
                <span />
                <span />
                <span />
                <span />
              </div>
              <span className="harvest-tank__percent mono">{Math.round(result.fill)}%</span>
            </div>
            <span className="harvest-tank__label mono">
              {t.tank} <br /> {tankCapacity.toLocaleString('en-IN')} L
            </span>
          </div>

          <div className="harvest-total">
            <span className="mono">{t.harvestLabel}</span>
            <strong>
              {result.harvest.toLocaleString('en-IN')}
              <span>L</span>
            </strong>
            <p>{t.harvestNote}</p>
          </div>

          <div className="harvest-breakdown">
            <div>
              <span className="mono">{t.gross}</span>
              <strong>{result.gross.toLocaleString('en-IN')} L</strong>
            </div>
            <div>
              <span className="mono">{t.storable}</span>
              <strong>{result.stored.toLocaleString('en-IN')} L</strong>
            </div>
            <div className={result.overflow > 0 ? 'is-warm' : ''}>
              <span className="mono">{t.overflow}</span>
              <strong>{result.overflow.toLocaleString('en-IN')} L</strong>
            </div>
          </div>

          <div className="calculator-caution">
            <Icon name="info" size={15} />
            <p>{t.caution}</p>
          </div>

          <button type="button" className="text-link calculator-source" onClick={() => setPanel('sources')}>
            {t.sourcesLink}
            <Icon name="arrow-right" size={13} />
          </button>
        </div>
      </div>
    </Modal>
  )
}
