import type { Language } from './i18n'

export type FilterLayer = {
  id: string
  index: string
  name: Record<Language, string>
  shortName: Record<Language, string>
  job: Record<Language, string>
  caution: Record<Language, string>
  color: string
  height: number
  y: number
  explodedOffset: number
}

/**
 * Illustrative six-stage gravity filter for the digital exhibit.
 * Real rainwater filters vary widely; the physical model should always be checked
 * before using this diagram for construction or drinking-water decisions.
 */
export const FILTER_LAYERS: FilterLayer[] = [
  {
    id: 'screen',
    index: '01',
    name: { en: 'Leaf screen', hi: 'पत्ते रोकने वाली जाली' },
    shortName: { en: 'Leaf screen', hi: 'जाली' },
    job: {
      en: 'Stops leaves, twigs and large debris before they enter the canister. Clean it often so water can flow.',
      hi: 'कैनिस्टर में जाने से पहले पत्ते, टहनियाँ और बड़ा कचरा रोकती है। इसे समय-समय पर साफ़ करते रहें ताकि पानी बहता रहे।',
    },
    caution: {
      en: 'A screen only catches big pieces. It does not clean the water.',
      hi: 'जाली सिर्फ बड़े टुकड़े रोकती है। पानी साफ़ नहीं करती।',
    },
    color: '#8e9d98',
    height: 0.035,
    y: 3.035,
    explodedOffset: 0.9,
  },
  {
    id: 'gravel',
    index: '02',
    name: { en: 'Gravel bed', hi: 'कंकड़ की परत' },
    shortName: { en: 'Gravel', hi: 'कंकड़' },
    job: {
      en: 'Spreads the water across the filter and catches grit and larger bits that slip past the screen.',
      hi: 'पानी को पूरे फ़िल्टर में फैलाती है और जाली से निकल गए कंकड़ व बड़े टुकड़े रोकती है।',
    },
    caution: {
      en: 'Gravel is a physical barrier, not a disinfectant.',
      hi: 'कंकड़ सिर्फ रोकता है, कीटाणु नहीं मारता।',
    },
    color: '#756b5c',
    height: 0.11,
    y: 2.91,
    explodedOffset: 0.54,
  },
  {
    id: 'coarse-sand',
    index: '03',
    name: { en: 'Coarse sand', hi: 'मोटी रेत' },
    shortName: { en: 'Coarse sand', hi: 'मोटी रेत' },
    job: {
      en: 'Traps smaller mud and suspended pieces. The gaps are still fairly open, so water can move through.',
      hi: 'छोटी मिट्टी और पानी में तैरते टुकड़ों को रोकती है। रेत के बीच जगह बनी रहती है, इसलिए पानी आगे बढ़ता है।',
    },
    caution: {
      en: 'Dirty sand can stop working. It needs cleaning or replacing.',
      hi: 'गंदी रेत काम करना बंद कर सकती है। उसे साफ़ या बदलना पड़ता है।',
    },
    color: '#b9a98d',
    height: 0.11,
    y: 2.79,
    explodedOffset: 0.27,
  },
  {
    id: 'charcoal',
    index: '04',
    name: { en: 'Activated charcoal', hi: 'सक्रिय कोयला' },
    shortName: { en: 'Charcoal', hi: 'कोयला' },
    job: {
      en: 'Can reduce colour, taste and some odour. It is often used to make water more pleasant, not to make it safe.',
      hi: 'रंग, स्वाद और कुछ गंध कम कर सकता है। इसका इस्तेमाल पानी को बेहतर बनाने के लिए होता है, सुरक्षित बनाने के लिए नहीं।',
    },
    caution: {
      en: 'Charcoal is not a disinfectant. It does not guarantee safe drinking water.',
      hi: 'कोयला कीटाणु नहीं मारता। पीने का पानी सुरक्षित होने की गारंटी नहीं देता।',
    },
    color: '#343a38',
    height: 0.1,
    y: 2.67,
    explodedOffset: 0,
  },
  {
    id: 'fine-sand',
    index: '05',
    name: { en: 'Fine sand', hi: 'बारीक रेत' },
    shortName: { en: 'Fine sand', hi: 'बारीक रेत' },
    job: {
      en: 'Catches very small mud particles. The water looks clearer after this layer, but it may still contain germs.',
      hi: 'बहुत छोटे मिट्टी के कण रोकती है। इसके बाद पानी साफ़ दिखता है, पर उसमें कीटाणु अभी भी हो सकते हैं।',
    },
    caution: {
      en: 'Clear-looking water is not proof that it is safe to drink.',
      hi: 'पानी साफ़ दिखे, इसका मतलब पीने लायक सुरक्षित है — ऐसा नहीं।',
    },
    color: '#d8bd91',
    height: 0.12,
    y: 2.54,
    explodedOffset: -0.3,
  },
  {
    id: 'outlet',
    index: '06',
    name: { en: 'Outlet gravel & mesh', hi: 'आउटलेट कंकड़ और जाली' },
    shortName: { en: 'Outlet', hi: 'आउटलेट' },
    job: {
      en: 'Holds the sand in place and lets the clearer water leave the canister. Keep the outlet clean so water does not back up.',
      hi: 'रेत को अपनी जगह रोकता है और साफ़ पानी को बाहर जाने देता है। आउटलेट साफ़ रखें ताकि पानी रुके नहीं।',
    },
    caution: {
      en: 'The outlet water still needs proper treatment and testing before drinking.',
      hi: 'बाहर निकले पानी को पीने से पहले सही उपचार और जाँच की ज़रूरत है।',
    },
    color: '#6f7f76',
    height: 0.08,
    y: 2.43,
    explodedOffset: -0.54,
  },
]
