import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Cloud, FlowPipe, Plaque, SceneLabel, WindArrow } from './primitives'
import { LAYOUT } from '../data/layout'
import { getScenePlaque } from '../data/sceneLabels'
import { isMotionRunning, useExperience } from '../store/useExperience'
import { OceanSurface, OceanVolume } from './OceanWater'

function Drizzle({
  x,
  active,
  warm = false,
  count = 52,
}: {
  x: number
  active: boolean
  warm?: boolean
  count?: number
}) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 1.8,
        z: (Math.random() - 0.5) * 1.0,
        y: 2.45 + Math.random() * 1.1,
        speed: 0.6 + Math.random() * 0.5,
      })),
    [count],
  )
  const current = useRef(0)
  useFrame((_, dt) => {
    const running = isMotionRunning()
    current.current = THREE.MathUtils.damp(
      current.current,
      active && running ? 1 : 0,
      2.8,
      Math.min(dt, 0.05),
    )
    if (mat.current) mat.current.opacity = current.current * 0.55
    if (!mesh.current) return
    mesh.current.visible = current.current > 0.01
    if (!running) return
    for (let i = 0; i < count; i += 1) {
      const s = seeds[i]
      s.y -= s.speed * Math.min(dt, 0.05)
      if (s.y < 2.35) s.y = 3.55 + Math.random() * 0.35
      dummy.position.set(x + s.x, s.y, s.z)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[0.014, 4, 4]} />
      <meshBasicMaterial
        ref={mat}
        color={warm ? '#ffb27f' : '#b7ebff'}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

function OceanFrame() {
  const frameColor = '#334b58'
  const glass = (
    <mesh position={[0, 1.7, 0]} scale={[7.9, 2.6, 4.15]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        color="#a6dbe5"
        transparent
        opacity={0.065}
        roughness={0.04}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.03}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
  return (
    <>
      {glass}
      {[-3.95, 3.95].flatMap((x) =>
        [-2.07, 2.07].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 1.7, z]} castShadow>
            <boxGeometry args={[0.07, 2.68, 0.07]} />
            <meshStandardMaterial color={frameColor} metalness={0.65} roughness={0.4} />
          </mesh>
        )),
      )}
      {[
        [-3.95, 0],
        [3.95, 0],
      ].map(([x]) => (
        <mesh key={`top-${x}`} position={[x, 3.02, 0]}>
          <boxGeometry args={[0.07, 0.07, 4.15]} />
          <meshStandardMaterial color={frameColor} metalness={0.65} roughness={0.4} />
        </mesh>
      ))}
      {[-2.07, 2.07].map((z) => (
        <mesh key={`top-z-${z}`} position={[0, 3.02, z]}>
          <boxGeometry args={[7.95, 0.07, 0.07]} />
          <meshStandardMaterial color={frameColor} metalness={0.65} roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[7.9, 0.08, 4.15]} />
        <meshStandardMaterial color="#182b35" metalness={0.5} roughness={0.56} />
      </mesh>
    </>
  )
}

function OceanFloor() {
  return (
    <group>
      <mesh position={[0, 0.46, 0]} receiveShadow>
        <boxGeometry args={[7.35, 0.12, 3.72]} />
        <meshStandardMaterial color="#8c7454" roughness={0.96} />
      </mesh>
      {[
        [-2.6, 0.56, -0.8, 0.35],
        [-1.4, 0.51, 0.62, 0.22],
        [0.8, 0.55, -0.4, 0.3],
        [2.4, 0.53, 1.0, 0.25],
        [3.1, 0.5, -1.15, 0.17],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1.5, 0.5, 1]} castShadow>
          <dodecahedronGeometry args={[s, 0]} />
          <meshStandardMaterial color={i % 2 ? '#4b5a55' : '#5d6558'} roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

export default function OceanLab() {
  const language = useExperience((s) => s.language)
  const plaque = getScenePlaque('ocean', language)
  const activeChapter = useExperience((s) => s.activeChapter)
  const oceanMode = useExperience((s) => s.oceanMode)
  const selectPart = useExperience((s) => s.selectPart)
  const isElNino = oceanMode === 'elnino'
  const showLabels = activeChapter === 1
  const visible = activeChapter <= 2 || activeChapter === 8

  const warmX = isElNino ? 1.2 : -1.7
  const cloudOpacityNormal = isElNino ? 0.1 : 0.9
  const cloudOpacityWarm = isElNino ? 0.92 : 0.12

  return (
    <group
      position={LAYOUT.ocean.group}
      visible={visible}
      onPointerDown={(e) => {
        e.stopPropagation()
        selectPart('ocean')
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
      }}
    >
      {/* Exhibition stand */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
          <boxGeometry args={[8.55, 0.36, 4.72]} />
          <meshStandardMaterial color="#2a211b" roughness={0.64} metalness={0.12} />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[8.35, 0.06, 4.55]} />
          <meshStandardMaterial color="#b09a6d" metalness={0.4} roughness={0.48} />
        </mesh>
        <Plaque
          position={[0, 0.22, 2.378]}
          width={3.9}
          height={0.45}
          lines={plaque.lines}
          small={plaque.small}
        />
      </group>

      <OceanFrame />
      <OceanFloor />
      <OceanVolume mode={oceanMode} />
      <OceanSurface mode={oceanMode} />

      {/* Warm surface marker */}
      <group position={[warmX, 2.4, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.44, 0.5, 32]} />
          <meshBasicMaterial color="#ffb07c" transparent opacity={0.85} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Surface wind arrows */}
      <WindArrow start={[3.1, 3.38, -1.3]} end={[-2.9, 3.38, -1.3]} active={!isElNino} color="#d9f7ff" curved={0.12} />
      <WindArrow start={[3.1, 3.42, -0.45]} end={[-2.9, 3.42, -0.45]} active={!isElNino} color="#d9f7ff" curved={0.13} />
      <WindArrow start={[3.1, 3.36, 0.4]} end={[-2.9, 3.36, 0.4]} active={!isElNino} color="#d9f7ff" curved={0.11} />
      <WindArrow start={[3.1, 3.42, 1.25]} end={[-2.9, 3.42, 1.25]} active={!isElNino} color="#d9f7ff" curved={0.14} />

      <WindArrow start={[-1.0, 3.62, -0.65]} end={[1.75, 3.62, -0.65]} active={isElNino} color="#ffb183" curved={0.1} />
      <WindArrow start={[-1.0, 3.52, 0.65]} end={[1.45, 3.52, 0.65]} active={isElNino} color="#ffb183" curved={0.1} />

      {/* Upwelling, strongest in normal conditions */}
      <WindArrow start={[3.35, 0.75, 1.32]} end={[3.35, 1.65, 1.32]} active={!isElNino} color="#8ce7df" thickness={0.018} />
      <WindArrow start={[3.35, 0.75, 1.32]} end={[3.35, 1.2, 1.32]} active={isElNino} color="#8ce7df" thickness={0.014} />

      {/* Atmospheric response */}
      <WindArrow start={[-3.0, 4.45, -0.2]} end={[3.0, 4.45, -0.2]} active color="#95b9cf" curved={0.7} thickness={0.014} />

      {/* Clouds */}
      <group>
        <Cloud position={[-2.15, 4.15, 0]} scale={0.72} opacity={cloudOpacityNormal} />
        <Cloud position={[1.35, 4.05, 0.1]} scale={0.9} opacity={cloudOpacityWarm} warm />
        <Drizzle x={-2.15} active={cloudOpacityNormal > 0.5} />
        <Drizzle x={1.35} active={cloudOpacityWarm > 0.5} warm />
      </group>

      {/* Region labels engraved on glass */}
      <mesh position={[-3.92, 2.69, -2.05]}>
        <boxGeometry args={[0.01, 0.18, 0.03]} />
        <meshBasicMaterial color="#d9f7ff" />
      </mesh>

      {showLabels && (
        <>
          <SceneLabel position={[0.1, 3.95, -1.4]} tone={isElNino ? 'warm' : 'cool'} labelKey={isElNino ? 'tradeWindsWeaken' : 'tradeWinds'} />
          <SceneLabel position={[3.1, 1.0, 1.9]} tone="cool" labelKey="upwelling" />
        </>
      )}

      {/* Drizzle and surface highlight */}
      <mesh position={[warmX, 2.325, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color={isElNino ? '#ff8a58' : '#ffb07c'} transparent opacity={0.18} depthWrite={false} toneMapped={false} />
      </mesh>

      <FlowPipe
        points={[
          [3.55, 2.78, -1.72],
          [3.9, 2.78, -1.45],
          [3.9, 2.78, 1.55],
        ]}
        radius={0.015}
        active={false}
        particles={5}
      />
    </group>
  )
}
