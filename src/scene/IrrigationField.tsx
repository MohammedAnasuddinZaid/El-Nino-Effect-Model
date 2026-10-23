import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { LAYOUT } from '../data/layout'
import { isMotionRunning, motionTime, useExperience } from '../store/useExperience'
import { Plaque, Plant, SceneLabel, damp } from './primitives'
import { getScenePlaque } from '../data/sceneLabels'

function Dripper({
  x,
  z,
  active,
  index,
}: {
  x: number
  z: number
  active: boolean
  index: number
}) {
  const drop = useRef<THREE.Mesh>(null)
  const ripple = useRef<THREE.Mesh>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const current = useRef(0)
  useFrame((_, dt) => {
    const running = isMotionRunning()
    current.current = damp(current.current, active && running ? 1 : 0, 3, Math.min(dt, 0.04))
    if (mat.current) mat.current.opacity = current.current * 0.9
    if (!running) return
    if (drop.current) {
      const t = (motionTime.value * 0.74 + index * 0.137) % 1
      drop.current.position.y = 1.0 - t * 0.18
      const scale = current.current * (0.55 + Math.sin(t * Math.PI) * 0.65)
      drop.current.scale.setScalar(scale)
      drop.current.visible = current.current > 0.02
    }
    if (ripple.current) {
      const t = (motionTime.value * 0.74 + index * 0.137 + 0.86) % 1
      ripple.current.scale.setScalar(0.1 + t * 0.7)
      const m = ripple.current.material as THREE.MeshBasicMaterial
      m.opacity = current.current * (1 - t) * 0.34
    }
  })
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.01, 0]}>
        <cylinderGeometry args={[0.025, 0.032, 0.09, 7]} />
        <meshStandardMaterial color="#253a35" roughness={0.6} />
      </mesh>
      <mesh ref={drop} position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.026, 8, 6]} />
        <meshBasicMaterial ref={mat} color="#73e5ff" transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
      <mesh ref={ripple} position={[0, 0.912, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.055, 20]} />
        <meshBasicMaterial color="#5fdcff" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

function RootCutaway({ active }: { active: boolean }) {
  const selectPart = useExperience((s) => s.selectPart)
  const labelsOn = useExperience((s) => s.labels)
  const activeChapter = useExperience((s) => s.activeChapter)
  const wet = useRef<THREE.Mesh>(null)
  const activeRef = useRef(0)
  const rootColor = '#c6b08b'

  const roots = useMemo(() => {
    const lines: THREE.CatmullRomCurve3[] = []
    const baseY = 0.86
    const baseZ = 0.01
    const tips = [
      [-0.55, 0.24, 0.24],
      [-0.28, 0.17, 0.29],
      [0.0, 0.14, 0.25],
      [0.28, 0.19, 0.28],
      [0.55, 0.28, 0.23],
      [-0.4, 0.48, 0.27],
      [0.38, 0.45, 0.27],
      [0.12, 0.32, 0.31],
    ]
    tips.forEach((tip, i) => {
      const mid1 = [tip[0] * 0.25, baseY - 0.08, baseZ + 0.12]
      const mid2 = [tip[0] * 0.72, (baseY + tip[1]) / 2 + (i % 2 ? 0.02 : -0.02), (baseZ + tip[2]) / 2 + 0.08]
      lines.push(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, baseY, baseZ),
          new THREE.Vector3(...(mid1 as [number, number, number])),
          new THREE.Vector3(...(mid2 as [number, number, number])),
          new THREE.Vector3(tip[0], tip[1], tip[2]),
        ]),
      )
      const branchStart = new THREE.Vector3(tip[0] * 0.55, (baseY + tip[1]) / 2, (baseZ + tip[2]) / 2 + 0.06)
      lines.push(
        new THREE.CatmullRomCurve3([
          branchStart,
          new THREE.Vector3(tip[0] * 0.9 + 0.1, tip[1] + 0.1, tip[2] - 0.03),
          new THREE.Vector3(tip[0] + 0.2, tip[1] + 0.02, tip[2] - 0.06),
        ]),
      )
    })
    return lines.map((curve, i) => ({
      geometry: new THREE.TubeGeometry(curve, 16, i % 3 === 0 ? 0.012 : 0.007, 5, false),
    }))
  }, [])

  useFrame((_, dt) => {
    activeRef.current = damp(activeRef.current, active ? 1 : 0, 2.6, Math.min(dt, 0.04))
    if (wet.current) {
      wet.current.scale.setScalar(0.85 + activeRef.current * 0.15)
      const mat = wet.current.material as THREE.MeshPhysicalMaterial
      mat.opacity = 0.08 + activeRef.current * 0.16
      wet.current.position.y = 0.46 + Math.sin(motionTime.value * 0.8) * 0.012
    }
  })

  const onClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('roots')
  }
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }
  const onOut = () => {
    document.body.style.cursor = ''
  }

  return (
    <group
      position={[0, 0, 2.65]}
      onPointerDown={onClick}
      onPointerOver={onOver}
      onPointerOut={onOut}
    >
      <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.88, 0.56]} />
        <meshStandardMaterial color="#5d412f" roughness={0.97} />
      </mesh>
      {/* section layers on the cut face */}
      {[
        { y: 0.72, h: 0.28, color: '#6a482f' },
        { y: 0.45, h: 0.25, color: '#96673d' },
        { y: 0.2, h: 0.24, color: '#b08a5a' },
      ].map((layer, i) => (
        <mesh key={i} position={[0, layer.y, 0.287]}>
          <boxGeometry args={[4.18, layer.h, 0.012]} />
          <meshStandardMaterial color={layer.color} roughness={0.98} />
        </mesh>
      ))}
      {/* roots sit just behind the acrylic face */}
      {roots.map((root, i) => (
        <mesh key={i} geometry={root.geometry}>
          <meshStandardMaterial color={rootColor} roughness={0.8} />
        </mesh>
      ))}
      <mesh ref={wet} position={[0, 0.46, 0.24]}>
        <sphereGeometry args={[0.7, 20, 14]} />
        <meshPhysicalMaterial
          color="#2fbedb"
          transparent
          opacity={0.2}
          roughness={0.08}
          metalness={0}
          clearcoat={1}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* acrylic front */}
      <mesh position={[0, 0.44, 0.318]}>
        <planeGeometry args={[4.18, 0.86]} />
        <meshPhysicalMaterial
          color="#d8f7ff"
          transparent
          opacity={0.08}
          roughness={0.03}
          clearcoat={1}
          depthWrite={false}
        />
      </mesh>
      {/* display frame */}
      {[-2.13, 2.13].map((x) => (
        <mesh key={x} position={[x, 0.44, 0.33]}>
          <boxGeometry args={[0.035, 0.9, 0.04]} />
          <meshStandardMaterial color="#9a855f" metalness={0.38} roughness={0.5} />
        </mesh>
      ))}
      {[0.0, 0.88].map((y) => (
        <mesh key={y} position={[0, y, 0.33]}>
          <boxGeometry args={[4.26, 0.03, 0.04]} />
          <meshStandardMaterial color="#9a855f" metalness={0.38} roughness={0.5} />
        </mesh>
      ))}
      <SceneLabel position={[0.25, 0.46, 0.7]} tone="cool" labelKey="wettingBulb" visible={labelsOn && (activeChapter === 7 || activeChapter === 8)} />
      <SceneLabel position={[-2.6, 0.78, 0.45]} tone="neutral" labelKey="rootZone" visible={labelsOn && activeChapter === 7} />
    </group>
  )
}

function DryCracks({ visible }: { visible: boolean }) {
  const cracks = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: (Math.random() - 0.5) * 5.4,
        z: (Math.random() - 0.5) * 4.0,
        r: Math.random() * Math.PI,
        l: 0.12 + Math.random() * 0.34,
      })),
    [],
  )
  if (!visible) return null
  return (
    <group position={[0, 0.915, 0]}>
      {cracks.map((c, i) => (
        <mesh key={i} position={[c.x, 0, c.z]} rotation={[0, c.r, 0]}>
          <boxGeometry args={[c.l, 0.005, 0.014]} />
          <meshStandardMaterial color="#33261d" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

export default function IrrigationField() {
  const language = useExperience((s) => s.language)
  const plaque = getScenePlaque('irrigation', language)
  const activeChapter = useExperience((s) => s.activeChapter)
  const labelsOn = useExperience((s) => s.labels)
  const selectPart = useExperience((s) => s.selectPart)
  const motionDemo = useExperience((s) => s.motionDemo)
  const dry = activeChapter === 3 || activeChapter === 2
  const irrigating = activeChapter === 7 || activeChapter === 8 || motionDemo
  const plantZ = LAYOUT.field.rows
  const plantXs = [-2.45, -1.2, 0.05, 1.3, 2.55]

  const onFieldClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('irrigation')
  }
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }
  const onOut = () => {
    document.body.style.cursor = ''
  }

  return (
    <group position={LAYOUT.field.center}>
      <group onPointerDown={onFieldClick} onPointerOver={onOver} onPointerOut={onOut}>
        {/* raised bed */}
        <mesh position={[0, 0.45, 0]} receiveShadow castShadow>
          <boxGeometry args={[6.3, 0.86, 4.7]} />
          <meshStandardMaterial color="#59402d" roughness={0.95} />
        </mesh>
        <mesh position={[0, 0.885, 0]} receiveShadow>
          <boxGeometry args={[6.12, 0.06, 4.52]} />
          <meshStandardMaterial color={dry ? '#806546' : '#684b32'} roughness={1} />
        </mesh>
        {/* stone edge */}
        {[
          { pos: [0, 0.91, 2.3] as [number, number, number], size: [6.3, 0.13, 0.1] as [number, number, number] },
          { pos: [0, 0.91, -2.3] as [number, number, number], size: [6.3, 0.13, 0.1] as [number, number, number] },
          { pos: [3.1, 0.91, 0] as [number, number, number], size: [0.1, 0.13, 4.6] as [number, number, number] },
          { pos: [-3.1, 0.91, 0] as [number, number, number], size: [0.1, 0.13, 4.6] as [number, number, number] },
        ].map((edge, i) => (
          <mesh key={i} position={edge.pos} castShadow>
            <boxGeometry args={edge.size} />
            <meshStandardMaterial color="#b9a47f" roughness={0.9} />
          </mesh>
        ))}
        {/* dark gaps between the crop lanes */}
        {plantZ.map((z) => (
          <mesh key={z} position={[0, 0.9, z]} receiveShadow>
            <boxGeometry args={[5.8, 0.012, 0.62]} />
            <meshStandardMaterial color={dry ? '#8f7658' : '#4e3727'} roughness={1} />
          </mesh>
        ))}
        {/* mulch flecks */}
        {Array.from({ length: 30 }, (_, i) => (
          <mesh
            key={i}
            position={[((i * 47) % 100) / 100 * 5.4 - 2.7, 0.92, (((i * 31) % 100) / 100) * 4 - 2]}
            rotation={[0, (i % 7) * 0.7, 0]}
          >
            <boxGeometry args={[0.08, 0.01, 0.03]} />
            <meshStandardMaterial color={i % 3 === 0 ? '#9a7d55' : '#7f5d3c'} roughness={1} />
          </mesh>
        ))}
      </group>

      {/* crop plants */}
      {plantZ.map((z, row) =>
        plantXs.map((x, i) => (
          <Plant
            key={`${row}-${i}`}
            position={[x, 0.9, z]}
            scale={0.92 + ((row + i) % 3) * 0.05}
            dry={dry ? 1 : 0}
            variant={row + i}
          />
        )),
      )}

      {/* a dedicated plant above the root cutaway */}
      <Plant position={[0, 0.9, 2.65]} scale={1.03} dry={0} variant={2} />

      <group
        onPointerDown={(e) => {
          e.stopPropagation()
          selectPart('irrigation')
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = ''
        }}
      >
        {plantZ.map((z, row) =>
          plantXs.map((x, i) => (
            <Dripper
              key={`${row}-${i}`}
              x={x}
              z={z + 0.23}
              active={irrigating}
              index={row * 5 + i}
            />
          )),
        )}
        <Dripper x={0} z={2.65} active={irrigating} index={22} />
        <mesh position={[0, 1.04, 2.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.017, 0.017, 0.82, 6]} />
          <meshStandardMaterial color="#263b36" roughness={0.6} />
        </mesh>
      </group>

      <DryCracks visible={activeChapter === 3} />
      <RootCutaway active={irrigating} />

      <Plaque
        position={[2.65, 0.48, 2.36]}
        width={1.0}
        height={0.28}
        lines={plaque.lines}
        small={plaque.small}
      />

      {labelsOn && (activeChapter === 7 || activeChapter === 8) && (
        <>
          <SceneLabel position={[2.45, 1.35, 2.2]} tone="cool" labelKey="dripLaterals" />
          <SceneLabel position={[-2.9, 1.3, 1.0]} tone="neutral" labelKey="controlledDrops" />
        </>
      )}
    </group>
  )
}
