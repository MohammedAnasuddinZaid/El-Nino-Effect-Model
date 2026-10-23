import type { Vec3 } from '../data/chapters'

export const LAYOUT = {
  base: {
    size: [32, 1.0, 16] as Vec3,
    center: [0, -0.5, 0] as Vec3,
  },
  ocean: {
    group: [-11.2, 0, 0.1] as Vec3,
    standHeight: 0.38,
    tank: [7.9, 2.6, 4.15] as Vec3,
    water: [7.35, 1.85, 3.72] as Vec3,
    waterCenter: [-11.2, 1.63, 0.1] as Vec3,
  },
  house: {
    group: [-2.9, 0, -0.8] as Vec3,
    width: 4.8,
    depth: 3.6,
    wallHeight: 3.15,
    roofY: 3.34,
    roofSize: [5.15, 0.24, 3.95] as Vec3,
    gutterZ: 1.27,
    gutterY: 3.28,
    downpipeX: -0.62,
    downpipeZ: 1.28,
  },
  filter: {
    group: [1.1, 0, 2.0] as Vec3,
    centerY: 1.38,
    height: 0.8,
    radius: 0.58,
    standHeight: 0.96,
  },
  tank: {
    group: [4.2, 0, 1.7] as Vec3,
    size: [2.55, 1.48, 2.15] as Vec3,
    baseY: 0.27,
    standHeight: 0.22,
    inletY: 0.94,
    outletY: 0.52,
  },
  pump: {
    group: [5.95, 0, 1.3] as Vec3,
  },
  field: {
    center: [11.1, 0, 0] as Vec3,
    width: 6.3,
    depth: 4.7,
    bedHeight: 0.88,
    topY: 0.9,
    rows: [-1.55, 0, 1.55] as number[],
    rowStartX: 8.65,
    rowEndX: 13.65,
    rowPlantCount: 5,
  },
  soilCutaway: {
    position: [11.1, 0.47, 2.65] as Vec3,
    size: [4.2, 0.8, 0.58] as Vec3,
  },
} as const

export const PIPE_ROUTES = {
  roofToGutter: [
    [-3.4, 3.5, 0.35],
    [-3.15, 3.45, 0.82],
    [-2.5, 3.38, 1.05],
    [-1.35, 3.33, 1.18],
    [-0.85, 3.3, 1.25],
  ] as Vec3[],
  gutterToFilter: [
    [-0.85, 3.28, 1.27],
    [-0.64, 3.28, 1.28],
    [-0.62, 2.85, 1.28],
    [-0.62, 2.12, 1.3],
    [-0.58, 1.84, 1.34],
    [-0.25, 1.78, 1.52],
    [0.35, 1.76, 1.78],
    [0.78, 1.77, 1.95],
    [1.1, 1.79, 2.0],
  ] as Vec3[],
  filterToTank: [
    [1.5, 0.99, 2.0],
    [1.9, 0.97, 1.96],
    [2.45, 0.95, 1.88],
    [2.8, 0.93, 1.78],
    [3.0, 0.92, 1.72],
  ] as Vec3[],
  tankToPump: [
    [5.5, 0.42, 1.92],
    [5.64, 0.42, 1.72],
    [5.76, 0.52, 1.48],
    [5.84, 0.58, 1.32],
  ] as Vec3[],
  pumpToField: [
    [6.16, 0.98, 1.28],
    [6.55, 1.01, 1.15],
    [7.0, 1.01, 1.0],
    [7.45, 1.0, 0.92],
    [7.75, 1.0, 0.85],
  ] as Vec3[],
  mainLine: [
    [7.75, 1.0, 0.85],
    [8.0, 1.01, 0.5],
    [8.3, 1.01, 0.18],
    [8.55, 1.01, 0.1],
  ] as Vec3[],
  manifold: [
    [8.55, 1.02, -2.15],
    [8.55, 1.02, 2.15],
  ] as Vec3[],
  laterals: [
    [
      [8.55, 1.03, -1.32],
      [10.2, 1.03, -1.32],
      [11.55, 1.03, -1.32],
      [13.7, 1.03, -1.32],
    ],
    [
      [8.55, 1.03, 0.23],
      [10.2, 1.03, 0.23],
      [11.55, 1.03, 0.23],
      [13.7, 1.03, 0.23],
    ],
    [
      [8.55, 1.03, 1.78],
      [10.2, 1.03, 1.78],
      [11.55, 1.03, 1.78],
      [13.7, 1.03, 1.78],
    ],
  ] as Vec3[][],
  rootBranch: [
    [11.1, 1.03, 1.78],
    [11.1, 1.03, 2.1],
    [11.1, 1.03, 2.55],
  ] as Vec3[],
  emitterXs: [9.05, 10.42, 11.79, 13.16] as const,
}
