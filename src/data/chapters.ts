export type Vec3 = [number, number, number]

export type CameraPose = {
  position: Vec3
  target: Vec3
}

export type CameraPath = {
  start: CameraPose
  end: CameraPose
}

export type Chapter = {
  id: string
  number: string
  kicker: string
  title: string
  titleLead?: string
  titleAccent?: string
  body: string
  note?: string
  narration: string
  caption: string
  align: 'left' | 'right' | 'center'
  camera: CameraPath
  metrics: { label: string; value: string; tone?: 'warm' | 'cool' | 'neutral' }[]
  interaction?: 'ocean' | 'cutaway' | 'calculator' | 'replay'
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'every-drop',
    number: '00',
    kicker: 'A science-fair field study · Class 7B',
    title: 'Every drop has a story.',
    body:
      'From a warming Pacific Ocean to a single drop at a plant’s root. This is a working, three-dimensional study of El Niño, rooftop rainwater harvesting and drip irrigation — built to show how we can prepare for an uncertain monsoon.',
    note: 'A model by Ahmadi Begum · Guided by the science of water, not the promise of certainty.',
    narration:
      'Every drop has a story. It can begin thousands of kilometres away in the Pacific Ocean, arrive on a rooftop during the monsoon, and end at the root of a growing plant. This exhibit follows that story through a working model of El Niño, rainwater harvesting and drip irrigation.',
    caption: 'Water connects climate, homes and food. Scroll to follow the whole journey.',
    align: 'left',
    camera: {
      start: { position: [15, 10.5, 26], target: [-1, 2.0, 0] },
      end: { position: [10, 8.2, 20], target: [-2.4, 2.0, 0] },
    },
    metrics: [
      { label: 'Systems', value: '03', tone: 'cool' },
      { label: 'Journey', value: '1 drop', tone: 'neutral' },
      { label: 'Idea', value: 'Conserve', tone: 'warm' },
    ],
  },
  {
    id: 'pacific',
    number: '01',
    kicker: 'The Pacific engine',
    title: 'When the Pacific changes.',
    body:
      'El Niño is a natural climate pattern in which surface waters across the central and eastern tropical Pacific become unusually warm. The trade winds weaken, warm water shifts east, and the atmosphere responds.',
    note: 'This is a simplified cross-section of a planetary-scale process — not a forecast and not a full climate simulation.',
    narration:
      'El Niño begins in the Pacific Ocean. Normally, trade winds push warm surface water towards the west. During El Niño, those winds weaken and warm water spreads eastwards. The ocean and atmosphere are connected, so rainfall and circulation can change far beyond the Pacific.',
    caption: 'Normal: warm water pools in the west. El Niño: the warm pool shifts east.',
    align: 'right',
    camera: {
      start: { position: [-6.8, 5.5, 12.5], target: [-11.2, 1.65, 0] },
      end: { position: [-10.2, 4.0, 8.6], target: [-11.4, 1.45, 0] },
    },
    metrics: [
      { label: 'Trade winds', value: 'Weaken', tone: 'warm' },
      { label: 'Warm pool', value: 'Eastward', tone: 'warm' },
      { label: 'Pattern', value: 'Natural', tone: 'neutral' },
    ],
    interaction: 'ocean',
  },
  {
    id: 'monsoon',
    number: '02',
    kicker: 'The Indian monsoon',
    title: 'A tilt in the odds — not a promise of drought.',
    body:
      'El Niño can make a weaker Indian summer monsoon more likely, but it is not the only influence. The Indian Ocean Dipole, regional circulation and other factors matter too. A warmer Pacific is a signal to plan, not a guarantee of failure.',
    note: 'The link is probabilistic. Not every El Niño year brings below-normal monsoon rainfall to every part of India.',
    narration:
      'India’s summer monsoon is influenced by many things, including El Niño. El Niño can raise the chance of weaker monsoon rainfall, but it does not decide the outcome on its own. That uncertainty is precisely why storing water and using it carefully is so valuable.',
    caption: 'Climate is a set of shifting odds. Water security is how we prepare for them.',
    align: 'left',
    camera: {
      start: { position: [0.8, 8.2, 19.5], target: [-2.4, 2.0, 0.2] },
      end: { position: [-0.8, 6.7, 16.2], target: [-3.4, 2.0, 0.4] },
    },
    metrics: [
      { label: 'Monsoon', value: 'Linked', tone: 'warm' },
      { label: 'Other drivers', value: 'Present', tone: 'cool' },
      { label: 'Certainty', value: 'Never 100%', tone: 'neutral' },
    ],
  },
  {
    id: 'scarcity',
    number: '03',
    kicker: 'The water gap',
    title: 'When rain doesn’t arrive on time.',
    body:
      'Irregular or insufficient rainfall can leave soil dry, tanks low and crops stressed. The answer is not to try to control the ocean. It is to capture the rain that does arrive and use every available litre with care.',
    note: 'The dry field is an illustration of water stress — not a claim that any particular drought was caused by El Niño alone.',
    narration:
      'When rain is late or scarce, the effects reach the soil, the stored water and the crops. We cannot switch the monsoon on. But we can make the water we receive go further, beginning with the next rainfall.',
    caption: 'Water stress is a local experience of a much larger climate pattern.',
    align: 'right',
    camera: {
      start: { position: [9.6, 6.4, 14.5], target: [8.4, 1.2, 1.2] },
      end: { position: [8.3, 5.0, 12.2], target: [9.4, 1.0, 1.5] },
    },
    metrics: [
      { label: 'Soil', value: 'Dry', tone: 'warm' },
      { label: 'Storage', value: 'Low', tone: 'warm' },
      { label: 'Response', value: 'Adapt', tone: 'cool' },
    ],
  },
  {
    id: 'catch-rain',
    number: '04',
    kicker: 'Rooftop harvesting',
    title: 'The roof becomes a watershed.',
    body:
      'Rain hits the roof and gathers along its collection edge. The gutter catches the runoff; the downpipe carries it down toward the filter. A bigger roof can catch more rain — but only if the water is guided, cleaned and stored.',
    note: 'This exhibit shows the model’s catchment route. First-flush diversion and inlet screens are common in real installations but are not added here unless confirmed in the physical model.',
    narration:
      'The model house turns a roof into a catchment. Rain runs to the gutter and down the downpipe. Every bend has a purpose: to move water into the filter without losing it along the way.',
    caption: 'Rain → roof → gutter → downpipe → filter.',
    align: 'left',
    camera: {
      start: { position: [0.8, 6.0, 12.2], target: [-1.9, 2.35, 0.7] },
      end: { position: [0.2, 4.6, 9.4], target: [-0.6, 2.2, 1.1] },
    },
    metrics: [
      { label: 'Catchment', value: 'Roof', tone: 'cool' },
      { label: 'Gutter', value: 'Collect', tone: 'cool' },
      { label: 'Downpipe', value: 'Gravity', tone: 'neutral' },
    ],
  },
  {
    id: 'filtration',
    number: '05',
    kicker: 'Filtration',
    title: 'Clearer water is not automatically safe water.',
    body:
      'The filter traps leaves, grit and suspended particles. It improves the physical quality of the water, but a simple filter does not remove every microorganism or dissolved contaminant. Harvested rainwater needs suitable treatment and testing before drinking.',
    note: 'The filter layers in this digital exhibit are illustrative. Match the layers to the real filter media in the finished physical model.',
    narration:
      'Water enters the filter and moves through the media. Larger debris is caught near the surface while finer particles are trapped deeper inside. The water looks clearer as it leaves — but clear water is not automatically safe to drink.',
    caption: 'A filter improves clarity. Drinking-water safety needs treatment and testing.',
    align: 'right',
    camera: {
      start: { position: [3.8, 4.8, 12.4], target: [1.15, 1.55, 1.7] },
      end: { position: [3.1, 3.9, 10.6], target: [1.2, 1.4, 1.85] },
    },
    metrics: [
      { label: 'Debris', value: 'Trapped', tone: 'warm' },
      { label: 'Suspended solids', value: 'Reduced', tone: 'cool' },
      { label: 'Drinking safe', value: 'Not assured', tone: 'warm' },
    ],
    interaction: 'cutaway',
  },
  {
    id: 'storage',
    number: '06',
    kicker: 'Storage',
    title: 'Bank the rain for a dry day.',
    body:
      'A storage tank turns a short shower into a reserve for the next dry spell. Its useful capacity is finite: once it is full, extra water must go somewhere safe. What you store today is water you do not need to draw tomorrow.',
    note: 'Harvest estimates depend on roof area, rainfall depth, runoff conditions, first-flush losses and tank capacity. Try the calculator — it is an estimate, not a measurement.',
    narration:
      'The collected water rises inside the storage tank. A tank cannot hold an infinite supply, but even a modest reserve can carry a garden or a small crop through a short dry period. Storage is preparation made visible.',
    caption: 'Store what falls, so the next dry day has a reserve.',
    align: 'left',
    camera: {
      start: { position: [8.8, 5.0, 11.6], target: [4.1, 1.1, 1.6] },
      end: { position: [7.9, 4.2, 10.0], target: [4.2, 0.95, 1.65] },
    },
    metrics: [
      { label: 'Tank level', value: 'Rising', tone: 'cool' },
      { label: 'Capacity', value: 'Finite', tone: 'neutral' },
      { label: 'Overflow', value: 'Plan', tone: 'warm' },
    ],
    interaction: 'calculator',
  },
  {
    id: 'drip',
    number: '07',
    kicker: 'Drip irrigation',
    title: 'Deliver water to the root, not the whole field.',
    body:
      'Drip tubes release water slowly through emitters placed near plant roots. The soil absorbs it where roots can use it, and less is lost to runoff or evaporation. Real savings depend on soil, crop, climate and maintenance.',
    note: 'The wetting bulb and root system are an educational cutaway. Filtration matters: small emitters can clog if the water or maintenance is poor.',
    narration:
      'From the tank, water enters the main irrigation line and then the thinner drip tubes. It leaves through small emitters, drop by drop, close to the roots. This is water delivered with intention — measured and placed where growth happens.',
    caption: 'Slow, local, controlled. Drip irrigation stretches stored water.',
    align: 'right',
    camera: {
      start: { position: [15.4, 5.8, 13.4], target: [10.6, 0.95, 1.2] },
      end: { position: [14.0, 4.6, 11.4], target: [10.7, 0.72, 1.5] },
    },
    metrics: [
      { label: 'Delivery', value: 'Drop by drop', tone: 'cool' },
      { label: 'Target', value: 'Root zone', tone: 'cool' },
      { label: 'Maintenance', value: 'Essential', tone: 'warm' },
    ],
  },
  {
    id: 'whole-system',
    number: '08',
    kicker: 'The complete model',
    title: 'One connected system. One shared resource.',
    body:
      'El Niño shows us that rainfall is variable. Rainwater harvesting captures what arrives; drip irrigation stretches what is captured. Preparedness turns climate uncertainty into a plan for homes, schools and farms.',
    note: 'Every Drop Counts: Harvest Rainwater, Save Water, and Support Sustainable Agriculture.',
    narration:
      'The complete model brings the story together. The ocean shows us the problem, the roof and tank show us how to collect, and the drip lines show us how to use water carefully. We cannot control the climate, but we can manage the water we have.',
    caption: 'Harvest what falls. Store what is needed. Deliver it with care.',
    align: 'left',
    camera: {
      start: { position: [0, 10.5, 34], target: [0, 1.5, 0] },
      end: { position: [0.8, 12.5, 38], target: [0, 1.15, 0] },
    },
    metrics: [
      { label: 'El Niño', value: 'Understand', tone: 'warm' },
      { label: 'Rain', value: 'Capture', tone: 'cool' },
      { label: 'Water', value: 'Conserve', tone: 'cool' },
    ],
    interaction: 'replay',
  },
]

export const TOTAL_CHAPTERS = CHAPTERS.length
