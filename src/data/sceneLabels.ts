import type { Language } from './i18n'

/**
 * Short labels that float on the 3D model. Kept tiny on purpose so the
 * callouts stay readable at small sizes and in both languages.
 */
export const SCENE_LABELS = {
  filterToTank: { en: 'Filter → tank', hi: 'फ़िल्टर → टंकी' },
  irrigationMain: { en: 'Irrigation main', hi: 'मुख्य सिंचाई लाइन' },
  dripTubes: { en: 'Drip tubes', hi: 'ड्रिप नलियाँ' },
  roofCatchment: { en: 'Roof catchment', hi: 'छत का जलग्रहण' },
  gutter: { en: 'Gutter', hi: 'नाली' },
  downpipe: { en: 'Downpipe', hi: 'पाइप' },
  wettingBulb: { en: 'Wetting bulb · illustrative', hi: 'गीला हिस्सा · उदाहरण' },
  rootZone: { en: 'Root-zone cutaway', hi: 'जड़ क्षेत्र का कटा दृश्य' },
  dripLaterals: { en: 'Drip laterals', hi: 'ड्रिप लाइनें' },
  controlledDrops: { en: 'Controlled drops', hi: 'नियंत्रित बूँदें' },
  tradeWinds: { en: 'Trade winds', hi: 'व्यापारिक हवाएँ' },
  tradeWindsWeaken: { en: 'Trade winds weaken', hi: 'व्यापारिक हवाएँ कमज़ोर' },
  upwelling: { en: 'Upwelling', hi: 'ऊपर उठता पानी' },
  modelPump: { en: 'Model pump', hi: 'मॉडल पंप' },
  waterLevel: { en: 'Water level rises', hi: 'पानी का स्तर बढ़ता है' },
  outletToCrops: { en: 'Outlet to crops', hi: 'फ़सलों की ओर आउटलेट' },
} as const

export type SceneLabelKey = keyof typeof SCENE_LABELS

export function getSceneLabel(key: SceneLabelKey, language: Language) {
  return SCENE_LABELS[key][language]
}

/**
 * Engraved brass plaques set into the model base. The text is baked into a
 * canvas texture, so it is stored as plain strings and only rebuilt when the
 * wording or language actually changes.
 */
export const SCENE_PLAQUES = {
  base: {
    en: {
      lines: ['Every Drop Has a Story', 'El Niño · Rainwater Harvesting · Drip Irrigation'] as [string, string],
      small: 'AHMADI BEGUM · CLASS 7B',
    },
    hi: {
      lines: ['हर बूँद की एक कहानी है', 'एल नीनो · वर्षा जल संचयन · ड्रिप सिंचाई'] as [string, string],
      small: 'अहमदी बेगम · कक्षा 7बी',
    },
  },
  ocean: {
    en: {
      lines: ['Pacific Ocean', 'normal / El Niño cross-section'] as [string, string],
      small: 'A · CLIMATE ENGINE',
    },
    hi: {
      lines: ['प्रशांत महासागर', 'सामान्य / एल नीनो कटा दृश्य'] as [string, string],
      small: 'अ · जलवायु इंजन',
    },
  },
  storage: {
    en: {
      lines: ['Rainwater reserve', 'store for dry days'] as [string, string],
      small: '05 · STORAGE',
    },
    hi: {
      lines: ['वर्षा जल भंडार', 'सूखे दिनों के लिए जमा'] as [string, string],
      small: '05 · भंडारण',
    },
  },
  irrigation: {
    en: {
      lines: ['Demo plot', 'drip irrigation'] as [string, string],
      small: '07 · ROOT ZONE',
    },
    hi: {
      lines: ['नमूना खेत', 'ड्रिप सिंचाई'] as [string, string],
      small: '07 · जड़ क्षेत्र',
    },
  },
  house: {
    en: { lines: ['Model home', 'rainwater catchment'] as [string, string] },
    hi: { lines: ['नमूना घर', 'वर्षा जल जलग्रहण'] as [string, string] },
  },
} as const

export type ScenePlaqueKey = keyof typeof SCENE_PLAQUES

export function getScenePlaque<K extends ScenePlaqueKey>(
  key: K,
  language: Language,
): (typeof SCENE_PLAQUES)[K][Language] {
  return SCENE_PLAQUES[key][language]
}