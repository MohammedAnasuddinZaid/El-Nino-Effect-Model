import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useExperience } from '../store/useExperience'

export function Loader() {
  const loaded = useExperience((state) => state.loaded)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!loaded) return
    const timeout = window.setTimeout(() => setVisible(false), 680)
    return () => window.clearTimeout(timeout)
  }, [loaded])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
        >
          <div className="loading-screen__grid" aria-hidden="true" />
          <div className="loading-screen__top mono">
            <span>Every Drop Has a Story</span>
            <span>Class 7B · 2026</span>
          </div>
          <div className="loading-screen__center">
            <div className="loading-mark" aria-hidden="true">
              <span className="loading-mark__ring loading-mark__ring--one" />
              <span className="loading-mark__ring loading-mark__ring--two" />
              <svg viewBox="0 0 48 56" width="30" height="36" fill="none">
                <path
                  d="M24 3c7 9.7 14 17.9 14 26a14 14 0 0 1-28 0C10 20.9 17 12.7 24 3Z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                />
                <path d="M17.5 30.5a6.5 6.5 0 0 0 6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
            </div>
            <span className="loading-screen__title">Preparing the exhibit</span>
            <span className="loading-screen__sub mono">Building the 3D water model</span>
            <div className="loading-line">
              <motion.span
                initial={{ scaleX: 0.08 }}
                animate={{ scaleX: loaded ? 1 : 0.82 }}
                transition={{ duration: loaded ? 0.38 : 2.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
          <div className="loading-screen__foot mono">
            <span>Ahmadi Begum</span>
            <span>El Niño · Rainwater Harvesting · Drip Irrigation</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
