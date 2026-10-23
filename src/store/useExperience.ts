import { create } from 'zustand'
import type { PartId } from '../data/components'
import type { Language } from '../data/i18n'

export type OceanMode = 'normal' | 'elnino'
export type Panel = 'project' | 'sources' | 'calculator' | null

function initialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  try {
    return window.localStorage.getItem('exhibit-language') === 'hi' ? 'hi' : 'en'
  } catch {
    return 'en'
  }
}

type ExperienceState = {
  activeChapter: number
  oceanMode: OceanMode
  paused: boolean
  autoTour: boolean
  processPlaying: boolean
  motionDemo: boolean
  hideSideText: boolean
  explore: boolean
  cutaway: boolean
  exploded: boolean
  labels: boolean
  captions: boolean
  menuOpen: boolean
  selectedPart: PartId | null
  focusPart: PartId | null
  panel: Panel
  reducedMotion: boolean
  loaded: boolean
  language: Language
  voiceOn: boolean
  filterOpen: boolean
  filterLayer: number | null
  setActiveChapter: (index: number) => void
  setOceanMode: (mode: OceanMode) => void
  togglePaused: () => void
  setPaused: (paused: boolean) => void
  setAutoTour: (on: boolean) => void
  setProcessPlaying: (on: boolean) => void
  setMotionDemo: (on: boolean) => void
  setHideSideText: (on: boolean) => void
  toggleProcessPlaying: () => void
  toggleExplore: () => void
  setExplore: (on: boolean) => void
  toggleCutaway: () => void
  toggleExploded: () => void
  toggleLabels: () => void
  toggleCaptions: () => void
  setMenuOpen: (open: boolean) => void
  selectPart: (id: PartId | null) => void
  requestFocus: (id: PartId) => void
  clearFocus: () => void
  setPanel: (panel: Panel) => void
  setReducedMotion: (on: boolean) => void
  setLoaded: (on: boolean) => void
  setLanguage: (language: Language) => void
  toggleVoice: () => void
  setFilterOpen: (open: boolean) => void
  setFilterLayer: (index: number | null) => void
  resetExperience: () => void
}

const stopPlayback = {
  autoTour: false,
  processPlaying: false,
  paused: false,
} as const

export const useExperience = create<ExperienceState>((set) => ({
  activeChapter: 0,
  oceanMode: 'normal',
  paused: false,
  autoTour: false,
  processPlaying: false,
  motionDemo: false,
  hideSideText: false,
  explore: false,
  cutaway: false,
  exploded: false,
  labels: true,
  captions: true,
  menuOpen: false,
  selectedPart: null,
  focusPart: null,
  panel: null,
  reducedMotion: false,
  loaded: false,
  language: initialLanguage(),
  voiceOn: true,
  filterOpen: false,
  filterLayer: null,
  setActiveChapter: (activeChapter) =>
    set((state) => (state.activeChapter === activeChapter ? state : { activeChapter })),
  setOceanMode: (oceanMode) => set({ oceanMode }),
  togglePaused: () => set((state) => ({ paused: !state.paused, autoTour: false, processPlaying: false })),
  setPaused: (paused) => set({ paused }),
  setAutoTour: (autoTour) =>
    set((state) => ({
      autoTour,
      processPlaying: false,
      paused: false,
      menuOpen: false,
      panel: autoTour ? null : state.panel,
      explore: autoTour ? false : state.explore,
    })),
  setProcessPlaying: (processPlaying) =>
    set((state) => ({
      processPlaying,
      autoTour: false,
      paused: false,
      menuOpen: false,
      panel: processPlaying ? null : state.panel,
      explore: processPlaying ? false : state.explore,
    })),
  setMotionDemo: (motionDemo) => set({ motionDemo }),
  setHideSideText: (hideSideText) => set({ hideSideText }),
  toggleProcessPlaying: () =>
    set((state) => {
      const processPlaying = !state.processPlaying
      return {
        processPlaying,
        autoTour: false,
        paused: false,
        menuOpen: false,
        panel: processPlaying ? null : state.panel,
        explore: processPlaying ? false : state.explore,
      }
    }),
  toggleExplore: () =>
    set((state) => {
      const explore = !state.explore
      return {
        explore,
        ...stopPlayback,
        menuOpen: false,
        panel: explore ? null : state.panel,
      }
    }),
  setExplore: (explore) =>
    set({
      explore,
      ...(explore ? stopPlayback : {}),
      ...(explore ? { menuOpen: false, panel: null } : {}),
    }),
  toggleCutaway: () => set((state) => ({ cutaway: !state.cutaway })),
  toggleExploded: () => set((state) => ({ exploded: !state.exploded })),
  toggleLabels: () => set((state) => ({ labels: !state.labels })),
  toggleCaptions: () => set((state) => ({ captions: !state.captions })),
  setMenuOpen: (menuOpen) => set({ menuOpen, ...(menuOpen ? stopPlayback : {}) }),
  selectPart: (selectedPart) => set({ selectedPart }),
  requestFocus: (focusPart) =>
    set({
      focusPart,
      selectedPart: focusPart,
      explore: true,
      ...stopPlayback,
      menuOpen: false,
      panel: null,
    }),
  clearFocus: () => set({ focusPart: null }),
  setPanel: (panel) => set({ panel, ...(panel ? { menuOpen: false, ...stopPlayback } : {}) }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setLoaded: (loaded) => set({ loaded }),
  setLanguage: (language) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('exhibit-language', language)
      } catch {
        // Private browsing can block localStorage; the current session still works.
      }
    }
    set({ language })
  },
  toggleVoice: () => set((state) => ({ voiceOn: !state.voiceOn })),
  setFilterOpen: (filterOpen) => set({ filterOpen }),
  setFilterLayer: (filterLayer) => set({ filterLayer }),
  resetExperience: () =>
    set({
      activeChapter: 0,
      oceanMode: 'normal',
      paused: false,
      autoTour: false,
      processPlaying: false,
      motionDemo: false,
  hideSideText: false,
      explore: false,
      cutaway: false,
      exploded: false,
      labels: true,
      captions: true,
      menuOpen: false,
      selectedPart: null,
      focusPart: null,
      panel: null,
      filterOpen: false,
      filterLayer: null,
    }),
}))

/** True only when the visitor has explicitly asked a process to run. */
export function isMotionRunning() {
  const state = useExperience.getState()
  return !state.paused && (state.autoTour || state.processPlaying || state.motionDemo || state.explore)
}

/**
 * High-frequency values read by the render loop.
 * Keeping these outside React avoids re-rendering the entire experience on every scroll frame.
 */
export const scrollSignals = {
  chapter: 0,
  chapterFloat: 0,
  local: 0,
  global: 0,
  velocity: 0,
  viewportHeight: typeof window === 'undefined' ? 900 : window.innerHeight,
  sections: [] as HTMLElement[],
}

export const motionTime = {
  value: 0,
  rain: 0,
  seconds: 0,
}
