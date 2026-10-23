import { create } from 'zustand'
import type { PartId } from '../data/components'

export type OceanMode = 'normal' | 'elnino'
export type Panel = 'project' | 'sources' | 'calculator' | null

type ExperienceState = {
  activeChapter: number
  oceanMode: OceanMode
  paused: boolean
  autoTour: boolean
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
  setActiveChapter: (index: number) => void
  setOceanMode: (mode: OceanMode) => void
  togglePaused: () => void
  setPaused: (paused: boolean) => void
  setAutoTour: (on: boolean) => void
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
  resetExperience: () => void
}

export const useExperience = create<ExperienceState>((set) => ({
  activeChapter: 0,
  oceanMode: 'normal',
  paused: false,
  autoTour: false,
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
  setActiveChapter: (activeChapter) =>
    set((state) => (state.activeChapter === activeChapter ? state : { activeChapter })),
  setOceanMode: (oceanMode) => set({ oceanMode }),
  togglePaused: () => set((state) => ({ paused: !state.paused, autoTour: false })),
  setPaused: (paused) => set({ paused }),
  setAutoTour: (autoTour) => set({ autoTour, paused: false, menuOpen: false }),
  toggleExplore: () =>
    set((state) => ({ explore: !state.explore, autoTour: false, paused: state.explore ? state.paused : false })),
  setExplore: (explore) => set({ explore, autoTour: false }),
  toggleCutaway: () => set((state) => ({ cutaway: !state.cutaway })),
  toggleExploded: () => set((state) => ({ exploded: !state.exploded })),
  toggleLabels: () => set((state) => ({ labels: !state.labels })),
  toggleCaptions: () => set((state) => ({ captions: !state.captions })),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  selectPart: (selectedPart) => set({ selectedPart }),
  requestFocus: (focusPart) => set({ focusPart, selectedPart: focusPart, explore: true, autoTour: false, paused: false }),
  clearFocus: () => set({ focusPart: null }),
  setPanel: (panel) => set({ panel }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setLoaded: (loaded) => set({ loaded }),
  resetExperience: () =>
    set({
      activeChapter: 0,
      oceanMode: 'normal',
      paused: false,
      autoTour: false,
      explore: false,
      cutaway: false,
      exploded: false,
      labels: true,
      captions: true,
      menuOpen: false,
      selectedPart: null,
      focusPart: null,
      panel: null,
    }),
}))

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
