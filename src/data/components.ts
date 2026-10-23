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
