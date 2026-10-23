import { useMemo } from 'react'
import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'
import { Modal } from './Modal'
import { useState } from 'react'

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
    <Modal open={open} onClose={close} label="Rooftop harvest estimator" className="calculator-modal">
      <header className="calculator-head">
        <span className="eyebrow">
          <span className="eyebrow__dot" />
          Interactive planning tool
        </span>
        <h2>A harvest estimate.</h2>
        <p>
          Use one rainfall event to see how roof area, runoff and tank size shape what you can keep. This is a
          simplified estimate — not a measurement or a guarantee.
        </p>
      </header>

      <div className="calculator-grid">
        <div className="calculator-form">
          <div className="calculator-form__intro">
            <span className="mono">Your inputs</span>
            <span className="mono">Metric</span>
          </div>
          <RangeField
            id="roof-area"
            label="Catchment area"
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
            label="Rainfall depth"
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
            label="Runoff coefficient"
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
            label="Storage capacity"
            unit="L"
            min={200}
            max={10000}
            step={100}
            value={tankCapacity}
            display={tankCapacity.toLocaleString('en-IN')}
            onChange={setTankCapacity}
          />

          <div className="calculator-formula">
            <span className="mono">Estimate formula</span>
            <p>
              Area × rainfall × runoff coefficient
              <br />
              <span>= harvest potential (litres)</span>
            </p>
            <span className="mono calculator-formula__note">
              1 mm of rain on 1 m² ≈ 1 litre before losses
            </span>
          </div>
        </div>

        <div className="calculator-result">
          <div className="calculator-result__top">
            <span className="mono">For this rain event</span>
            <span className="status-chip">
              <span />
              Estimate
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
              Tank <br /> {tankCapacity.toLocaleString('en-IN')} L
            </span>
          </div>

          <div className="harvest-total">
            <span className="mono">Estimated harvest</span>
            <strong>
              {result.harvest.toLocaleString('en-IN')}
              <span>L</span>
            </strong>
            <p>Before first-flush diversion, evaporation, leakage and filtration losses.</p>
          </div>

          <div className="harvest-breakdown">
            <div>
              <span className="mono">Gross rainfall on roof</span>
              <strong>{result.gross.toLocaleString('en-IN')} L</strong>
            </div>
            <div>
              <span className="mono">Can be stored</span>
              <strong>{result.stored.toLocaleString('en-IN')} L</strong>
            </div>
            <div className={result.overflow > 0 ? 'is-warm' : ''}>
              <span className="mono">Potential overflow</span>
              <strong>{result.overflow.toLocaleString('en-IN')} L</strong>
            </div>
          </div>

          <div className="calculator-caution">
            <Icon name="info" size={15} />
            <p>
              A full tank stops storing. Real systems need first-flush diversion, screening, a safe overflow and
              maintenance. Rainwater intended for drinking needs suitable treatment and testing.
            </p>
          </div>

          <button type="button" className="text-link calculator-source" onClick={() => setPanel('sources')}>
            Read the harvesting sources
            <Icon name="arrow-right" size={13} />
          </button>
        </div>
      </div>
    </Modal>
  )
}
