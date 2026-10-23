import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { LAYOUT } from '../data/layout'
import { motionTime, useExperience } from '../store/useExperience'
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
  y,
  height,
  color,
  roughness = 0.92,
  offset,
}: {
  y: number
  height: number
  color: string
  roughness?: number
  offset: number
}) {
  const ref = useRef<THREE.Group>(null)
  const exploded = useExperience((s) => s.exploded)
  useFrame((_, dt) => {
    if (ref.current) {
      const target = y + (exploded ? offset : 0)
      ref.current.position.y = damp(ref.current.position.y, target, 5, Math.min(dt, 0.04))
    }
  })
  return (
    <group ref={ref} position={[0, y, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.505, 0.505, height, 40]} />
        <meshStandardMaterial color={color} roughness={roughness} metalness={0.02} />
      </mesh>
      <mesh position={[0, height / 2 + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.508, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.08} roughness={0.75} />
      </mesh>
    </group>
  )
}

function FilterDrops({ active }: { active: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        x: (Math.random() - 0.5) * 0.58,
        z: (Math.random() - 0.5) * 0.58,
        y: 2.52 + Math.random() * 0.52,
        speed: 0.11 + Math.random() * 0.17,
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
  const selected = useExperience((s) => s.selectedPart === 'filter')
  const selectPart = useExperience((s) => s.selectPart)
  const active = activeChapter >= 4 && activeChapter <= 8
  const showLabels = labelsOn && activeChapter === 5
  const canisterRef = useRef<THREE.Group>(null)
  const baseOffset = LAYOUT.filter.centerY - 2.8

  useFrame((_, dt) => {
    if (canisterRef.current) {
      const target = baseOffset + (exploded ? 0.55 : 0)
      canisterRef.current.position.y = damp(canisterRef.current.position.y, target, 4, Math.min(dt, 0.04))
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

  const media = [
    { y: 2.47, h: 0.12, color: '#756b5c', offset: -0.4, roughness: 0.98 },
    { y: 2.6, h: 0.12, color: '#b9a98d', offset: 0.05, roughness: 0.94 },
    { y: 2.73, h: 0.11, color: '#343a38', offset: 0.48, roughness: 0.8 },
    { y: 2.86, h: 0.14, color: '#d8bd91', offset: 0.94, roughness: 0.9 },
  ]

  return (
    <group
      position={LAYOUT.filter.group}
      onPointerDown={onClick}
      onPointerOver={onOver}
      onPointerOut={onOut}
    >
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
        {/* housing */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.585, 0.585, 0.8, 40, 1, true]} />
          <meshPhysicalMaterial
            color="#d6f0f0"
            transparent
            opacity={cutaway ? 0.1 : 0.17}
            roughness={0.05}
            metalness={0.02}
            clearcoat={1}
            clearcoatRoughness={0.06}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* media */}
        <group position={[0, 0, 0]}>
          {media.map((m, i) => (
            <MediaLayer key={i} y={m.y} height={m.h} color={m.color} roughness={m.roughness} offset={m.offset} />
          ))}
          {/* fine top screen */}
          <mesh position={[0, 3.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.06, 0.55, 40]} />
            <meshStandardMaterial color="#8da3a1" roughness={0.5} metalness={0.3} transparent opacity={0.65} />
          </mesh>
        </group>

        {/* water above the bed */}
        <mesh position={[0, 3.09, 0]}>
          <cylinderGeometry args={[0.522, 0.522, 0.09, 32]} />
          <meshPhysicalMaterial color="#43b8d9" transparent opacity={0.26} roughness={0.08} clearcoat={1} depthWrite={false} />
        </mesh>

        {/* rims and bands */}
        {[2.4, 3.2].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <torusGeometry args={[0.59, 0.025, 8, 40]} />
            <meshStandardMaterial color={selected ? '#8cecff' : '#657a7d'} metalness={0.7} roughness={0.28} />
          </mesh>
        ))}
        {[2.54, 2.69, 2.84].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <torusGeometry args={[0.592, 0.007, 5, 40]} />
            <meshBasicMaterial color="#9db4b1" transparent opacity={0.33} />
          </mesh>
        ))}

        {/* top cap and inlet */}
        <mesh position={[0, 3.23, 0]} castShadow>
          <cylinderGeometry args={[0.62, 0.57, 0.08, 40]} />
          <meshStandardMaterial color={selected ? '#537f87' : '#394e53'} metalness={0.55} roughness={0.4} />
        </mesh>
        <mesh position={[0, 3.33, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 0.18, 16]} />
          <meshStandardMaterial color="#5f787d" metalness={0.65} roughness={0.3} />
        </mesh>
        <mesh position={[0.6, 2.48, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.19, 14]} />
          <meshStandardMaterial color="#5f787d" metalness={0.65} roughness={0.3} />
        </mesh>

        {/* debris captured at the surface */}
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

        <FilterDrops active={activeChapter === 5 || activeChapter === 4} />
      </group>

      <SceneLabel position={[0.1, 2.22, 0.47]} tone="neutral" visible={showLabels}>
        Multi-stage filter
      </SceneLabel>
      <SceneLabel position={[-0.95, 1.36, 0.35]} tone="warm" visible={showLabels}>
        Media layers · illustrative
      </SceneLabel>
    </group>
  )
}
