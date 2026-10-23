import { useExperience } from '../store/useExperience'
import { Icon } from './Icons'

export function FallbackExhibit() {
  const activeChapter = useExperience((state) => state.activeChapter)
  const setPanel = useExperience((state) => state.setPanel)

  return (
    <div className="fallback-exhibit">
      <div className="fallback-exhibit__visual">
        <svg viewBox="0 0 1200 640" role="img" aria-label="Schematic of the El Niño, rainwater harvesting and drip irrigation model">
          <defs>
            <linearGradient id="fb-ocean" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2b9fc8" />
              <stop offset="1" stopColor="#0b3454" />
            </linearGradient>
            <linearGradient id="fb-tank" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5ed6f6" />
              <stop offset="1" stopColor="#1c75bc" />
            </linearGradient>
            <linearGradient id="fb-ground" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#0c1c26" />
              <stop offset="0.55" stopColor="#18251f" />
              <stop offset="1" stopColor="#342519" />
            </linearGradient>
            <radialGradient id="fb-glow" cx="50%" cy="50%">
              <stop offset="0" stopColor="#2db6d9" stopOpacity=".32" />
              <stop offset="1" stopColor="#2db6d9" stopOpacity="0" />
            </radialGradient>
            <filter id="fb-blur">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <rect width="1200" height="640" fill="#061019" />
          <ellipse cx="330" cy="310" rx="280" ry="220" fill="url(#fb-glow)" />
          <ellipse cx="920" cy="340" rx="260" ry="180" fill="#c0673640" filter="url(#fb-blur)" />

          <g opacity=".22" stroke="#a7d9e5">
            {Array.from({ length: 13 }, (_, i) => (
              <line key={`v${i}`} x1={i * 100} y1="80" x2={i * 100} y2="560" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`h${i}`} x1="40" y1={80 + i * 96} x2="1160" y2={80 + i * 96} />
            ))}
          </g>

          <rect x="42" y="480" width="1120" height="60" rx="8" fill="#1b1712" stroke="#9b8257" strokeOpacity=".45" />
          <rect x="60" y="442" width="1082" height="38" rx="6" fill="url(#fb-ground)" />

          <g>
            <rect x="90" y="285" width="360" height="155" rx="8" fill="#071e2b" stroke="#7dbccd" strokeOpacity=".35" />
            <rect x="105" y="310" width="330" height="115" rx="4" fill="url(#fb-ocean)" opacity=".9" />
            <path d="M105 326c40-12 70 13 120 1s100 12 180-4" fill="none" stroke="#a5e9f8" strokeWidth="2" opacity=".5" />
            <path d="M135 350c50 18 110-18 160 0s80-14 120 4" fill="none" stroke="#ffc59a" strokeWidth="2" opacity=".55" />
            <path d="M185 278v-40M275 268v-36M365 280v-38" stroke="#e3f8ff" strokeWidth="1.5" markerEnd="url(#arrow)" opacity=".65" />
            <text x="115" y="465" fill="#8ca7b0" fontFamily="monospace" fontSize="11">A · PACIFIC CROSS-SECTION</text>
          </g>

          <g>
            <path d="M520 355v-90l65-30 65 30v90" fill="#272b2a" stroke="#b7a88f" strokeWidth="2" />
            <path d="M505 265h160l-22-18H527Z" fill="#40575f" />
            <rect x="550" y="305" width="22" height="50" fill="#f0cc91" opacity=".65" />
            <rect x="600" y="300" width="32" height="26" fill="#f0cc91" opacity=".55" />
            <path d="M505 265h160" stroke="#91b1bb" strokeWidth="3" />
            <path d="M661 265v95" stroke="#98d6e4" strokeWidth="3" />
            <text x="520" y="465" fill="#8ca7b0" fontFamily="monospace" fontSize="11">B · ROOF CATCHMENT</text>
          </g>

          <g>
            <rect x="700" y="385" width="55" height="53" rx="5" fill="#18343d" stroke="#88bcc4" strokeOpacity=".5" />
            <rect x="708" y="400" width="40" height="30" fill="#4bc0db" opacity=".5" />
            <rect x="710" y="440" width="78" height="10" rx="3" fill="#263d42" />
            <text x="700" y="465" fill="#8ca7b0" fontFamily="monospace" fontSize="11">C · FILTER</text>
          </g>

          <g>
            <rect x="800" y="350" width="105" height="95" rx="7" fill="#102a30" stroke="#8abfc6" strokeOpacity=".55" />
            <rect x="808" y="382" width="89" height="55" fill="url(#fb-tank)" opacity=".58" />
            <path d="M800 350h105" stroke="#9acbd0" strokeWidth="2" />
            <text x="800" y="465" fill="#8ca7b0" fontFamily="monospace" fontSize="11">D · STORAGE</text>
          </g>

          <g>
            <path d="M905 400h78" stroke="#76d7e8" strokeWidth="3" />
            <path d="M985 402h55l18 22M1090 396h50" stroke="#76d7e8" strokeWidth="2" opacity=".8" />
            {[1008, 1040, 1072, 1104].map((x) => (
              <g key={x}>
                <path d={`M${x} 436v18`} stroke="#b5a17d" strokeWidth="2" />
                <circle cx={x} cy="430" r="11" fill="#56855a" opacity=".9" />
              </g>
            ))}
            <text x="985" y="465" fill="#8ca7b0" fontFamily="monospace" fontSize="11">E · DRIP FIELD</text>
          </g>

          <g fontFamily="monospace" fontSize="10" fill="#8ca7b0">
            <text x="60" y="96">STATIC SCHEMATIC MODE</text>
            <text x="60" y="116">WEBGL UNAVAILABLE · STORY REMAINS ACTIVE</text>
            <text x="880" y="96" fill="#a9d9e4">CHAPTER {String(activeChapter).padStart(2, '0')}</text>
          </g>
        </svg>
      </div>
      <div className="fallback-exhibit__note">
        <span className="fallback-exhibit__icon">
          <Icon name="info" size={17} />
        </span>
        <div>
          <strong>The interactive 3D model could not start in this browser.</strong>
          <p>
            A schematic view is shown instead. Every chapter, worksheet and source remains available. For the full
            experience, use a browser with WebGL enabled.
          </p>
        </div>
        <button type="button" className="text-link" onClick={() => setPanel('project')}>
          Project notes
          <Icon name="arrow-right" size={13} />
        </button>
      </div>
    </div>
  )
}
