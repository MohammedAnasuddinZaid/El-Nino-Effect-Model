export type Source = {
  id: string
  org: string
  title: string
  url: string
  use: string
  category: 'climate' | 'water' | 'irrigation' | 'safety'
}

export const SOURCES: Source[] = [
  {
    id: 'noaa-elnino',
    org: 'NOAA',
    title: 'Understanding El Niño',
    url: 'https://www.noaa.gov/understanding-el-nino',
    use: 'Ocean warming, trade-wind weakening and global weather influence.',
    category: 'climate',
  },
  {
    id: 'climate-gov-enso',
    org: 'NOAA Climate.gov',
    title: 'El Niño–Southern Oscillation (ENSO)',
    url: 'https://www.climate.gov/enso',
    use: 'The normal–El Niño–La Niña comparison and monitoring context.',
    category: 'climate',
  },
  {
    id: 'nasa-elnino',
    org: 'NASA Earth Science',
    title: 'El Niño',
    url: 'https://science.nasa.gov/earth/explore/el-nino/',
    use: 'Ocean–atmosphere interaction and visualizations of Pacific change.',
    category: 'climate',
  },
  {
    id: 'imd-faq',
    org: 'India Meteorological Department',
    title: 'Monsoon forecast FAQ',
    url: 'https://imdpune.gov.in/cmpg/lrf/FAQ.html',
    use: 'The probabilistic ENSO–monsoon relationship and other drivers.',
    category: 'climate',
  },
  {
    id: 'cgwb',
    org: 'Central Ground Water Board, India',
    title: 'Rainwater harvesting guidance',
    url: 'https://cgwb.gov.in/cgwbpnm/public/uploads/documents/1739866191814353122file.pdf',
    use: 'Roof catchments, gutters, downpipes, screens, first-flush and storage.',
    category: 'water',
  },
  {
    id: 'telangana',
    org: 'Government of Telangana',
    title: 'Rainwater harvesting',
    url: 'https://www.telangana.gov.in/rain-water-harvesting-2/',
    use: 'Practical rooftop harvesting, cleaning and overflow guidance.',
    category: 'water',
  },
  {
    id: 'jalshakti',
    org: 'Ministry of Jal Shakti, India',
    title: 'Department of Drinking Water and Sanitation',
    url: 'https://jalshakti-ddws.gov.in/',
    use: 'National water and sanitation context and public resources.',
    category: 'water',
  },
  {
    id: 'fao-drip',
    org: 'Food and Agriculture Organization',
    title: 'Chapter 6: Drip irrigation',
    url: 'https://www.fao.org/4/s8684e/s8684e07.htm',
    use: 'Emitter behaviour, filtration, clogging and irrigation design.',
    category: 'irrigation',
  },
  {
    id: 'who-water',
    org: 'World Health Organization',
    title: 'Drinking-water fact sheet',
    url: 'https://www.who.int/news-room/fact-sheets/detail/drinking-water',
    use: 'Why clear water and safe drinking water are not the same claim.',
    category: 'safety',
  },
]

export const PROJECT = {
  title: 'El Niño and Water Conservation',
  subtitle: 'Rainwater Harvesting and Drip Irrigation for Sustainable Agriculture',
  student: 'Ahmadi Begum',
  className: 'Class 7 · Section B',
  aim:
    'To demonstrate the basic concept of El Niño and explain how rainwater harvesting and drip irrigation can help conserve water and support agriculture when rainfall is insufficient or irregular.',
  objectives: [
    'Understand El Niño and its influence on weather patterns.',
    'Connect rainfall, agriculture and water availability.',
    'Explain why rainwater harvesting matters.',
    'Demonstrate rooftop collection, filtration and storage.',
    'Demonstrate the working principle of drip irrigation.',
    'Show how efficient water management helps during dry periods.',
    'Create awareness about water conservation and sustainable agriculture.',
  ],
  methodology: [
    'Build a strong exhibition base and divide it into the Pacific, house, storage and agriculture zones.',
    'Create a labelled Pacific cross-section with warm surface water, trade-wind arrows and atmospheric circulation.',
    'Build a house with a flat collection roof, gutter and downpipe.',
    'Guide the downpipe through a filter and into a storage tank.',
    'Connect the tank through a low-voltage DC pump to an irrigation main line and thinner drip tubes.',
    'Place drip emitters near the roots of model crops.',
    'Demonstrate rainfall, collection, filtration, storage and drop-by-drop irrigation.',
  ],
  outcomes: [
    'A clear, visual explanation of El Niño as a natural climate pattern.',
    'A working demonstration of rooftop collection, filtration and storage.',
    'A connected demonstration of water delivery near plant roots.',
    'A practical understanding of why storage and efficient irrigation matter.',
  ],
  applications: [
    'Rooftop harvesting in homes, schools and other buildings.',
    'Garden and landscape irrigation using stored rainwater.',
    'Efficient watering of vegetables, fruit plants and other crops.',
    'Water planning in areas with irregular rainfall.',
    'Climate and water-conservation awareness programmes.',
  ],
  conclusion:
    'El Niño cannot be prevented, but its possible effects on water availability can be managed through planning and careful water use. Rainwater harvesting captures available rainfall, while drip irrigation delivers stored water efficiently. Together they demonstrate a practical route from climate understanding to local action.',
  socialMessage:
    'Every Drop Counts: Harvest Rainwater, Save Water, and Support Sustainable Agriculture.',
  limitations: [
    'The digital Pacific cross-section is a simplified educational visual, not a forecast or climate simulation.',
    'The digital filter layers are illustrative and should be matched to the actual physical filter media.',
    'The wetting bulb and root cutaway are educational visualizations, not measured soil-moisture data.',
    'The digital model shows a low-voltage DC pump between the tank and field as a documented interpretation of the supplied materials list; the physical build could also be gravity-fed.',
    'The harvest calculator produces an estimate. It is not a live measurement.',
  ],
  openQuestions: [
    'What are the final dimensions and positions of the base, house, filter, tank and pipe runs?',
    'Does the final physical build use the DC pump as modelled, or a gravity-fed line?',
    'What filter media and layer order are used in the physical filter?',
    'Does the physical model include a first-flush diverter, mesh screen or overflow pipe?',
    'Are the final plants real, artificial, or a mixture?',
  ],
}

export type FAQItem = { q: string; a: string; group: string }

export const FAQ: FAQItem[] = [
  {
    group: 'El Niño',
    q: 'What is El Niño?',
    a: 'El Niño is a natural climate pattern associated with unusually warm surface waters in the central and eastern tropical Pacific Ocean. It can influence weather and rainfall patterns around the world.',
  },
  {
    group: 'El Niño',
    q: 'How does El Niño affect India?',
    a: 'El Niño can weaken the Indian summer monsoon and increase the risk of below-normal rainfall. It does not cause drought every time, and other climate influences matter.',
  },
  {
    group: 'El Niño',
    q: 'What causes El Niño?',
    a: 'El Niño develops when ocean temperatures and the usual atmospheric circulation over the tropical Pacific change. Trade winds often weaken, allowing warm surface water to shift eastward.',
  },
  {
    group: 'El Niño',
    q: 'Is El Niño the same as global warming?',
    a: 'No. El Niño is a natural climate pattern that varies over months. Global warming is the long-term increase in Earth’s average temperature, driven mainly by human activities.',
  },
  {
    group: 'Rainwater',
    q: 'What is rainwater harvesting?',
    a: 'It is the process of collecting and storing rainwater for later use. A rooftop system normally includes a catchment, gutters, pipes, a filter and storage.',
  },
  {
    group: 'Rainwater',
    q: 'What does the filter do?',
    a: 'It removes leaves, grit and suspended debris. It improves clarity but does not automatically make the water safe to drink. Drinking use requires suitable treatment and testing.',
  },
  {
    group: 'Rainwater',
    q: 'Why is storage needed?',
    a: 'Storage holds collected water so it can be used after the rain stops. The amount available is limited by tank capacity, previous rainfall and how much water has already been used.',
  },
  {
    group: 'Irrigation',
    q: 'How does drip irrigation save water?',
    a: 'It delivers water slowly near the plant roots in controlled amounts. This can reduce losses from runoff and evaporation compared with some other irrigation methods.',
  },
  {
    group: 'Irrigation',
    q: 'What are the disadvantages of drip irrigation?',
    a: 'Installation can cost more, and tiny emitters can block if the water is not filtered and the system is not maintained.',
  },
  {
    group: 'Our model',
    q: 'Explain how your model works.',
    a: 'First, I explain El Niño and its possible influence on rainfall. Then water poured onto the roof flows through the gutter and downpipe, passes through the filter and enters the storage tank. Finally, the stored water reaches the plants drop by drop through the drip tubes.',
  },
  {
    group: 'Our model',
    q: 'What is the main message?',
    a: 'We cannot control natural climate phenomena, but we can prepare for water shortages by harvesting rainwater, reducing waste and adopting efficient irrigation.',
  },
  {
    group: 'Just checking',
    q: 'Can we prevent El Niño?',
    a: 'No. El Niño is a natural climate phenomenon. We can prepare for possible water shortages through good water management and conservation.',
  },
]
