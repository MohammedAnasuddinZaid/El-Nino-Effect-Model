import type { Vec3 } from './chapters'

export type PartId =
  | 'ocean'
  | 'roof'
  | 'gutter'
  | 'downpipe'
  | 'filter'
  | 'tank'
  | 'pump'
  | 'irrigation'
  | 'roots'

export type PartInfo = {
  id: PartId
  index: string
  name: string
  shortName: string
  role: string
  description: string
  facts: { label: string; value: string }[]
  upstream: string
  downstream: string
  caution?: string
  focus: { position: Vec3; target: Vec3 }
}

export const PARTS: Record<PartId, PartInfo> = {
  ocean: {
    id: 'ocean',
    index: 'A',
    name: 'Pacific Ocean demonstration',
    shortName: 'Pacific tank',
    role: 'The climate engine',
    description:
      'A simplified cross-section of the tropical Pacific. Warm surface water, trade winds and upwelling are arranged to contrast normal conditions with El Niño. This is a conceptual exhibit, not a climate forecast.',
    facts: [
      { label: 'Normal', value: 'Warm pool west · upwelling east' },
      { label: 'El Niño', value: 'Trade winds weaken · warm water shifts east' },
      { label: 'Scale', value: 'Schematic' },
    ],
    upstream: 'Pacific Ocean',
    downstream: 'Rainfall variability over India',
    caution: 'A large-scale climate pattern cannot predict one village’s weather on its own.',
    focus: { position: [-8.2, 5.2, 9.4], target: [-11.2, 1.75, 0.1] },
  },
  roof: {
    id: 'roof',
    index: '01',
    name: 'Roof catchment',
    shortName: 'Roof',
    role: 'Catch the rainfall',
    description:
      'The roof is the first surface in the harvesting system. Its area and the amount of rain determine the theoretical volume that can be collected. A gentle fall helps water move toward the collection edge.',
    facts: [
      { label: 'Function', value: 'Catchment surface' },
      { label: 'Route', value: 'Roof → gutter' },
      { label: 'Drivers', value: 'Area × rainfall × runoff' },
    ],
    upstream: 'Rainfall',
    downstream: 'Gutter',
    caution: 'Only a portion of rainfall becomes usable runoff. Roof material and losses matter.',
    focus: { position: [-1.9, 5.9, 8.6], target: [-2.9, 3.25, 0.0] },
  },
  gutter: {
    id: 'gutter',
    index: '02',
    name: 'Collection gutter',
    shortName: 'Gutter',
    role: 'Guide the runoff',
    description:
      'The gutter captures water running from the roof and channels it toward the downpipe. A continuous fall and a clear channel help prevent standing water and overflow at the roof edge.',
    facts: [
      { label: 'Function', value: 'Horizontal collection' },
      { label: 'Route', value: 'Roof → downpipe' },
      { label: 'Watch for', value: 'Leaves and blockages' },
    ],
    upstream: 'Roof catchment',
    downstream: 'Downpipe',
    caution: 'Real systems often benefit from leaf screens or gutter guards.',
    focus: { position: [-0.5, 4.8, 7.2], target: [-2.0, 3.2, 1.2] },
  },
  downpipe: {
    id: 'downpipe',
    index: '03',
    name: 'Downpipe',
    shortName: 'Downpipe',
    role: 'Carry water down',
    description:
      'The downpipe uses gravity to move collected water to the filter. Its route, joints and fall must remain continuous so water does not leak or become trapped along the way.',
    facts: [
      { label: 'Function', value: 'Vertical conveyance' },
      { label: 'Route', value: 'Gutter → filter' },
      { label: 'Force', value: 'Gravity' },
    ],
    upstream: 'Collection gutter',
    downstream: 'Filter inlet',
    caution: 'A blockage here can back water up onto the roof.',
    focus: { position: [0.3, 4.4, 6.3], target: [-0.55, 2.65, 1.25] },
  },
  filter: {
    id: 'filter',
    index: '04',
    name: 'Filter canister',
    shortName: 'Filter',
    role: 'Remove debris and particles',
    description:
      'Water enters the top of the canister, moves through the filter media and leaves below. Larger debris is held near the surface while finer suspended particles can be trapped deeper in the bed.',
    facts: [
      { label: 'Removes', value: 'Leaves, grit, suspended particles' },
      { label: 'Does not assure', value: 'Microbiological safety' },
      { label: 'Needs', value: 'Cleaning and replacement' },
    ],
    upstream: 'Downpipe',
    downstream: 'Storage tank',
    caution: 'Clear water is not automatically safe to drink. Testing and suitable treatment are separate steps.',
    focus: { position: [3.95, 2.55, 5.65], target: [1.1, 1.35, 2.0] },
  },
  tank: {
    id: 'tank',
    index: '05',
    name: 'Storage tank',
    shortName: 'Tank',
    role: 'Keep water for later',
    description:
      'The tank holds filtered rainwater until it is needed. As water enters, the level rises. When the tank reaches capacity, an overflow route is needed in a real installation.',
    facts: [
      { label: 'Stores', value: 'Filtered rainwater' },
      { label: 'Controls', value: 'Capacity and water level' },
      { label: 'Use case', value: 'Garden and irrigation' },
    ],
    upstream: 'Filter canister',
    downstream: 'Irrigation supply line',
    caution: 'Storage is not unlimited. Capacity, overflow and water quality must be managed.',
    focus: { position: [6.9, 2.65, 5.5], target: [4.2, 0.95, 1.7] },
  },
  pump: {
    id: 'pump',
    index: '06',
    name: 'Model pump',
    shortName: 'Pump',
    role: 'Move water to the field',
    description:
      'A small pump is shown between the low storage tank and the raised drip-irrigated bed. In a real installation a pump may be used to create pressure, but gravity could supply some layouts if the tank is high enough. The physical model’s final arrangement should be confirmed.',
    facts: [
      { label: 'Purpose', value: 'Move water under pressure' },
      { label: 'In this model', value: 'DC pump assumed' },
      { label: 'Alternative', value: 'Gravity feed' },
    ],
    upstream: 'Storage tank',
    downstream: 'Irrigation main',
    caution: 'The pump is a digital interpretation of the materials list. Confirm the final physical model’s plumbing.',
    focus: { position: [8.3, 2.35, 5.3], target: [5.95, 0.55, 1.3] },
  },
  irrigation: {
    id: 'irrigation',
    index: '07',
    name: 'Drip irrigation line',
    shortName: 'Drip line',
    role: 'Deliver water slowly',
    description:
      'A main line carries stored water from the tank to the field. Thinner lateral tubes run beside the crops, and emitters release small amounts close to the plants.',
    facts: [
      { label: 'Delivery', value: 'Slow and local' },
      { label: 'Advantage', value: 'Less runoff and evaporation' },
      { label: 'Risk', value: 'Clogged emitters' },
    ],
    upstream: 'Storage tank',
    downstream: 'Root zone',
    caution: 'Filtration and maintenance are essential because small openings can clog.',
    focus: { position: [10.2, 3.0, 7.4], target: [10.5, 1.0, 0.8] },
  },
  roots: {
    id: 'roots',
    index: '08',
    name: 'Root-zone cutaway',
    shortName: 'Root zone',
    role: 'Use water where it matters',
    description:
      'The cutaway reveals the plant’s roots and a simplified wetting region. Water released near the roots enters the soil locally. The glowing wet bulb is an educational illustration, not a measured moisture map.',
    facts: [
      { label: 'Delivery point', value: 'Near plant roots' },
      { label: 'Reach', value: 'Depends on soil' },
      { label: 'Visual', value: 'Illustrative wetting bulb' },
    ],
    upstream: 'Drip emitters',
    downstream: 'Crop roots and soil',
    caution: 'Soil type and crop root depth affect how water actually spreads.',
    focus: { position: [12.5, 1.85, 6.0], target: [11.05, 0.48, 2.2] },
  },
}

export const PART_LIST = Object.values(PARTS)

export const PART_NARRATION: Record<PartId, { en: string; hi: string }> = {
  ocean: {
    en: 'This is a small model of the tropical Pacific Ocean. Normally, trade winds push warm water to the west. During El Niño, the winds weaken and warm water moves east. That can change rainfall far away, including over India. But El Niño does not always cause a drought.',
    hi: 'यह प्रशांत महासागर का छोटा मॉडल है। आम तौर पर हवाएँ गर्म पानी पश्चिम की ओर धकेलती हैं। एल नीनो में हवाएँ कमज़ोर हो जाती हैं और गर्म पानी पूर्व की ओर चला जाता है। इससे दूर के इलाकों में बारिश बदल सकती है, भारत में भी। लेकिन एल नीनो हमेशा सूखा नहीं लाता।',
  },
  roof: {
    en: 'The roof is the first surface in the harvesting system. Its area and the amount of rain decide how much water can be collected. A gentle fall helps water move toward the collection edge. Only part of the rainfall becomes usable runoff.',
    hi: 'छत जल संचयन का पहला हिस्सा है। छत का क्षेत्रफल और बारिश की मात्रा तय करते हैं कि कितना पानी इकट्ठा हो सकता है। हल्की बारिश पानी को नाली की ओर ले जाती है। बारिश का सिर्फ एक हिस्सा ही इस्तेमाल लायक पानी बनता है।',
  },
  gutter: {
    en: 'The gutter captures water running from the roof and channels it toward the downpipe. A continuous fall and a clear channel help prevent standing water and overflow at the roof edge. Real systems often use leaf screens.',
    hi: 'नाली छत से बहने वाला पानी पकड़ती है और उसे डाउनपाइप की ओर ले जाती है। सही ढलान और साफ़ नाली से पानी जमता नहीं और छत से नहीं बहता। असली नालियों में पत्ते रोकने के लिए जाली होती है।',
  },
  downpipe: {
    en: 'The downpipe uses gravity to move collected water to the filter. Its route, joints and fall must stay continuous so water does not leak or get trapped. A blockage here can back water up onto the roof.',
    hi: 'डाउनपाइप गुरुत्वाकर्षण से पानी को फ़िल्टर तक ले जाता है। इसका रास्ता, जोड़ और ढलान लगातार बने रहने चाहिए ताकि पानी न रिसे और न फँसे। यहाँ रुकावट से पानी छत पर वापस आ सकता है।',
  },
  filter: {
    en: 'Water enters the top of the canister, moves through the filter media and leaves below. Larger debris is held near the surface while finer particles are trapped deeper. Clear water is not automatically safe to drink. Testing and treatment are separate steps.',
    hi: 'पानी कैनिस्टर में ऊपर से आता है, फ़िल्टर की परतों से होकर नीचे निकलता है। बड़ा कचरा ऊपर रुकता है और बारीक कण गहराई में। साफ़ दिखने वाला पानी अपने आप पीने लायक नहीं होता। जाँच और उपचार अलग चरण हैं।',
  },
  tank: {
    en: 'The tank holds filtered rainwater until it is needed. As water enters, the level rises. Storage is not unlimited, so capacity, overflow and water quality must be managed.',
    hi: 'टंकी साफ किया हुआ वर्षा जल रखती है जब तक उसकी ज़रूरत न हो। पानी आने पर स्तर बढ़ता है। भंडार असीमित नहीं है, इसलिए क्षमता, ओवरफ्लो और पानी की गुणवत्ता का ध्यान रखना ज़रूरी है।',
  },
  pump: {
    en: 'A small pump moves water from the low storage tank to the raised drip-irrigated bed. In a real installation a pump may create pressure, but gravity could supply some layouts if the tank is high enough.',
    hi: 'छोटा पंप पानी को निचली टंकी से ऊँचे ड्रिप बेड तक ले जाता है। असली व्यवस्था में पंप दबाव बनाता है, लेकिन अगर टंकी ऊँचाई पर हो तो गुरुत्वाकर्षण भी काम कर सकता है।',
  },
  irrigation: {
    en: 'A main line carries stored water to the field. Thinner lateral tubes run beside the crops, and emitters release small amounts close to the plants. This means less runoff and evaporation, but emitters can clog.',
    hi: 'मुख्य पाइप पानी को खेत तक ले जाता है। पतली नलियाँ फसल के पास चलती हैं और छोटे छेद पौधों के पास पानी छोड़ते हैं। इससे कम बर्बादी और वाष्पीकरण होता है, लेकिन छेद बंद हो सकते हैं।',
  },
  roots: {
    en: 'The cutaway reveals the plant roots and a simplified wetting region. Water released near the roots enters the soil locally. The glowing wet bulb is an educational illustration, not a measured moisture map.',
    hi: 'कटा हुआ दृश्य पौधे की जड़ें और एक सरल गीला हिस्सा दिखाता है। जड़ के पास छोड़ा गया पानी मिट्टी में स्थानीय रूप से जाता है। चमकता गीला हिस्सा शैक्षिक चित्र है, मापा हुआ नमी नक्शा नहीं।',
  },
}
