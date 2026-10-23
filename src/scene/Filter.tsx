import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { LAYOUT } from '../data/layout'
import { FILTER_LAYERS, type FilterLayer } from '../data/filterLayers'
import { getUiCopy } from '../data/i18n'
import { useExperience } from '../store/useExperience'
import { SceneLabel, damp } from './primitives'

function Rod({
  from,
  to,
  radius = 0.028,
  color = '#4d5b5f',
}: {
  from: [number, number, number]
  to: [number, number, number]
  radius?: number
  color?: string
}) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = b.clone().sub(a)
    const length = dir.length()
    const mid = a.clone().add(b).multiplyScalar(0.5)
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
    return { position: mid, quaternion, length }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[radius, radius, length, 7]} />
      <meshStandardMaterial color={color} metalness={0.62} roughness={0.38} />
    </mesh>
  )
}

function MediaLayer({
  layer,
  index,
  open,
  exploded,
  highlighted,
  onSelect,
  label,
  showLabel,
}: {
  layer: FilterLayer
  index: number
  open: boolean
  exploded: boolean
  highlighted: boolean
  onSelect: () => void
  label: string
  showLabel: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  const glow = useRef<THREE.Mesh>(null)
  useFrame((_, dt) => {
    if (!ref.current) return
    const openOffset = open ? layer.explodedOffset : 0
    const explodedOffset = exploded ? layer.explodedOffset * 0.42 : 0
    const target = layer.y + openOffset + explodedOffset
    ref.current.position.y = damp(ref.current.position.y, target, 5, Math.min(dt, 0.04))
    if (glow.current) {
      glow.current.rotation.z += dt * 0.24
      const mat = glow.current.material as THREE.MeshBasicMaterial
      mat.opacity = damp(mat.opacity, highlighted ? 0.7 : 0, 4, Math.min(dt, 0.04))
    }
  })

  return (
    <group
      ref={ref}
      position={[0, layer.y, 0]}
      onPointerDown={(event: ThreeEvent<PointerEvent>) => {
        event.stopPropagation()
        onSelect()
      }}
      onPointerOver={(event) => {
        event.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = ''
      }}
    >
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.505, 0.505, layer.height, 40]} />
        <meshStandardMaterial
          color={layer.color}
          roughness={index === 3 ? 0.78 : 0.92}
          metalness={index === 0 || index === 3 ? 0.14 : 0.02}
          emissive={highlighted ? layer.color : '#000000'}
          emissiveIntensity={highlighted ? 0.45 : 0}
        />
      </mesh>
      <mesh position={[0, layer.height / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.34, 0.508, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.08} roughness={0.75} />
      </mesh>
      {highlighted && (
        <mesh ref={glow} rotation={[-Math.PI / 2, 0, 0]} position={[0, layer.height / 2 + 0.015, 0]}>
          <ringGeometry args={[0.525, 0.56, 48]} />
          <meshBasicMaterial color="#ffedd7" transparent opacity={0.65} depthWrite={false} toneMapped={false} />
        </mesh>
      )}
      <SceneLabel position={[0.78, 0, 0.05]} tone={index === 3 ? 'warm' : 'neutral'} visible={showLabel} onClick={onSelect}>
        {label}
      </SceneLabel>
    </group>
  )
}

function FilterDrops({ active }: { active: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        x: (Math.random() - 0.5) * 0.58,
        z: (Math.random() - 0.5) * 0.58,
        y: 2.52 + Math.random() * 0.54,
        speed: 0.1 + Math.random() * 0.16,
        warm: i % 4 === 0,
      })),
    [],
  )
  const current = useRef(0)
  useFrame((_, dt) => {
    current.current = damp(current.current, active ? 1 : 0, 3.8, Math.min(dt, 0.04))
    if (mat.current) mat.current.opacity = current.current * 0.78
    if (!mesh.current) return
    mesh.current.visible = current.current > 0.015
    for (let i = 0; i < seeds.length; i += 1) {
      const s = seeds[i]
      s.y += s.speed * Math.min(dt, 0.04)
      if (s.y > 3.12) s.y = 2.44
      dummy.position.set(s.x, s.y, s.z + 0.34)
      dummy.scale.setScalar(s.warm ? 0.9 : 0.7)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, seeds.length]} frustumCulled={false}>
      <sphereGeometry args={[0.018, 5, 5]} />
      <meshBasicMaterial ref={mat} color="#6ddcff" transparent opacity={0} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  )
}

export default function Filter() {
  const activeChapter = useExperience((s) => s.activeChapter)
  const labelsOn = useExperience((s) => s.labels)
  const cutaway = useExperience((s) => s.cutaway)
  const exploded = useExperience((s) => s.exploded)
  const filterOpen = useExperience((s) => s.filterOpen)
  const filterLayer = useExperience((s) => s.filterLayer)
  const selected = useExperience((s) => s.selectedPart === 'filter')
  const selectPart = useExperience((s) => s.selectPart)
  const setFilterOpen = useExperience((s) => s.setFilterOpen)
  const setFilterLayer = useExperience((s) => s.setFilterLayer)
  const autoTour = useExperience((s) => s.autoTour)
  const processPlaying = useExperience((s) => s.processPlaying)
  const paused = useExperience((s) => s.paused)
  const language = useExperience((s) => s.language)
  const copy = getUiCopy(language)
  const active = activeChapter >= 4 && activeChapter <= 8
  const showMainLabels = labelsOn && (activeChapter === 4 || activeChapter === 5 || activeChapter === 6)
  const playback = (autoTour || processPlaying) && !paused
  const canisterRef = useRef<THREE.Group>(null)
  const topRef = useRef<THREE.Group>(null)
  const bottomRef = useRef<THREE.Group>(null)
  const housingRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const waterRef = useRef<THREE.MeshPhysicalMaterial>(null)
  const debrisRef = useRef<THREE.Group>(null)
  const baseOffset = LAYOUT.filter.centerY - 2.8

  useFrame((_, dt) => {
    const step = Math.min(dt, 0.04)
    if (canisterRef.current) {
      const target = baseOffset + (exploded ? 0.55 : 0)
      canisterRef.current.position.y = damp(canisterRef.current.position.y, target, 4, step)
    }
    if (topRef.current) {
      topRef.current.position.y = damp(topRef.current.position.y, filterOpen ? 0.72 : 0, 5, step)
    }
    if (bottomRef.current) {
      bottomRef.current.position.y = damp(bottomRef.current.position.y, filterOpen ? -0.38 : 0, 5, step)
    }
    if (housingRef.current) {
      housingRef.current.opacity = damp(
        housingRef.current.opacity,
        filterOpen ? 0.025 : cutaway ? 0.09 : 0.17,
        5,
        step,
      )
    }
    if (waterRef.current) {
      waterRef.current.opacity = damp(waterRef.current.opacity, filterOpen ? 0 : 0.26, 4, step)
    }
    if (debrisRef.current) {
      const s = damp(debrisRef.current.scale.x, filterOpen ? 0.001 : 1, 4, step)
      debrisRef.current.scale.setScalar(s)
    }
  })

  const onClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('filter')
  }
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }
  const onOut = () => {
    document.body.style.cursor = ''
  }

  const selectLayer = (index: number) => {
    selectPart('filter')
    setFilterOpen(true)
    setFilterLayer(index)
  }

  return (
    <group position={LAYOUT.filter.group} onPointerDown={onClick} onPointerOver={onOver} onPointerOut={onOut}>
      {/* stand */}
      <group>
        {[-0.48, 0.48].map((x) =>
          [-0.36, 0.36].map((z) => (
            <Rod
              key={`${x}-${z}`}
              from={[x * 1.22, 0.06, z * 1.22]}
              to={[x * 0.9, LAYOUT.filter.standHeight, z * 0.9]}
              color="#59686a"
            />
          )),
        )}
        <mesh position={[0, LAYOUT.filter.standHeight, 0]} castShadow>
          <cylinderGeometry args={[0.68, 0.68, 0.07, 32]} />
          <meshStandardMaterial color="#3e5054" metalness={0.6} roughness={0.44} />
        </mesh>
        <mesh position={[0, LAYOUT.filter.standHeight - 0.06, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.05, 24]} />
          <meshStandardMaterial color="#182b32" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.14, 0]} castShadow>
          <cylinderGeometry args={[0.78, 0.82, 0.14, 32]} />
          <meshStandardMaterial color="#3e5054" metalness={0.6} roughness={0.44} />
        </mesh>
      </group>

      <group ref={canisterRef} position={[0, baseOffset, 0]}>
        {/* outer housing fades away when the canister is opened */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.585, 0.585, 0.8, 40, 1, true]} />
          <meshPhysicalMaterial
            ref={housingRef}
            color="#d6f0f0"
            transparent
            opacity={0.17}
            roughness={0.05}
            metalness={0.02}
            clearcoat={1}
            clearcoatRoughness={0.06}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* the six filter layers, top to bottom */}
        <group>
          {FILTER_LAYERS.map((layer, index) => (
            <MediaLayer
              key={layer.id}
              layer={layer}
              index={index}
              open={filterOpen}
              exploded={exploded}
              highlighted={filterOpen && filterLayer === index}
              onSelect={() => selectLayer(index)}
              label={layer.shortName[language]}
              showLabel={filterOpen && labelsOn}
            />
          ))}
        </group>

        {/* water above the bed */}
        <mesh position={[0, 3.09, 0]}>
          <cylinderGeometry args={[0.522, 0.522, 0.09, 32]} />
          <meshPhysicalMaterial
            ref={waterRef}
            color="#43b8d9"
            transparent
            opacity={0.26}
            roughness={0.08}
            clearcoat={1}
            depthWrite={false}
          />
        </mesh>

        {/* rims and bands */}
        <group ref={topRef}>
          <mesh position={[0, 3.2, 0]}>
            <torusGeometry args={[0.59, 0.025, 8, 40]} />
            <meshStandardMaterial color={selected ? '#ffedd7' : '#657a7d'} metalness={0.7} roughness={0.28} />
          </mesh>
          <mesh position={[0, 3.23, 0]} castShadow>
            <cylinderGeometry args={[0.62, 0.57, 0.08, 40]} />
            <meshStandardMaterial color={selected ? '#8f735c' : '#394e53'} metalness={0.55} roughness={0.4} />
          </mesh>
          <mesh position={[0, 3.33, 0]}>
            <cylinderGeometry args={[0.14, 0.18, 0.18, 16]} />
            <meshStandardMaterial color="#5f787d" metalness={0.65} roughness={0.3} />
          </mesh>
        </group>

        <group ref={bottomRef}>
          <mesh position={[0, 2.4, 0]}>
            <torusGeometry args={[0.59, 0.025, 8, 40]} />
            <meshStandardMaterial color={selected ? '#ffedd7' : '#657a7d'} metalness={0.7} roughness={0.28} />
          </mesh>
          <mesh position={[0, 2.34, 0]} castShadow>
            <cylinderGeometry args={[0.57, 0.62, 0.08, 40]} />
            <meshStandardMaterial color="#394e53" metalness={0.55} roughness={0.4} />
          </mesh>
          <mesh position={[0.0, 2.24, 0]}>
            <cylinderGeometry args={[0.1, 0.13, 0.16, 14]} />
            <meshStandardMaterial color="#5f787d" metalness={0.65} roughness={0.3} />
          </mesh>
        </group>

        {/* thin separation bands remain as a visual memory of the assembled canister */}
        {[2.54, 2.69, 2.84].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <torusGeometry args={[0.592, 0.007, 5, 40]} />
            <meshBasicMaterial color="#9db4b1" transparent opacity={filterOpen ? 0.06 : 0.33} />
          </mesh>
        ))}

        {/* debris caught at the surface */}
        <group ref={debrisRef}>
          {[
            [-0.17, 3.055, 0.1, 0.035],
            [0.12, 3.06, -0.04, 0.024],
            [0.24, 3.05, 0.18, 0.028],
            [-0.04, 3.06, 0.22, 0.02],
          ].map(([x, y, z, s], i) => (
            <mesh key={i} position={[x, y, z]} scale={s * 18}>
              <dodecahedronGeometry args={[0.04, 0]} />
              <meshStandardMaterial color={i % 2 ? '#6b4a2f' : '#3b4932'} roughness={1} />
            </mesh>
          ))}
        </group>

        <FilterDrops active={filterOpen || (playback && active)} />
      </group>

      <SceneLabel
        position={[0.1, 1.98, 0.38]}
        tone="neutral"
        visible={showMainLabels && !filterOpen}
        onClick={() => selectPart('filter')}
      >
        {copy.filterLayers}
      </SceneLabel>
      <SceneLabel
        position={[-0.94, 1.22, 0.3]}
        tone="warm"
        visible={showMainLabels && !filterOpen}
        onClick={() => selectLayer(3)}
      >
        {copy.filterIllustrative}
      </SceneLabel>
    </group>
  )
}
