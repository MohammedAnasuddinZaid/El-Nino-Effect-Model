import { useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { LAYOUT } from '../data/layout'
import { isMotionRunning, useExperience } from '../store/useExperience'
import { SceneLabel } from './primitives'

export default function Pump() {
  const activeChapter = useExperience((s) => s.activeChapter)
  const labelsOn = useExperience((s) => s.labels)
  const selectPart = useExperience((s) => s.selectPart)
  const impeller = useRef<THREE.Group>(null)
  const active = activeChapter === 7 || activeChapter === 8

  useFrame((_, dt) => {
    if (impeller.current && isMotionRunning()) {
      impeller.current.rotation.z += dt * (active ? 10 : 0.25)
    }
  })

  const onClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('pump')
  }
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }
  const onOut = () => {
    document.body.style.cursor = ''
  }

  return (
    <group position={LAYOUT.pump.group} onPointerDown={onClick} onPointerOver={onOver} onPointerOut={onOut}>
      {/* base */}
      <mesh position={[0, 0.11, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.22, 0.78]} />
        <meshStandardMaterial color="#26363a" roughness={0.56} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <boxGeometry args={[0.68, 0.04, 0.62]} />
        <meshStandardMaterial color="#91a6a5" roughness={0.38} metalness={0.55} />
      </mesh>

      {/* clear pump housing */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.53, 28]} />
        <meshPhysicalMaterial
          color="#bfeaf2"
          transparent
          opacity={0.23}
          roughness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.06}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <group ref={impeller} position={[0, 0.58, 0]}>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.15, Math.sin(angle) * 0.15, 0.02]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.19, 0.06, 0.05]} />
              <meshStandardMaterial color={active ? '#ceb277' : '#7b8b8b'} metalness={0.7} roughness={0.28} />
            </mesh>
          )
        })}
        <mesh>
          <cylinderGeometry args={[0.085, 0.085, 0.16, 16]} />
          <meshStandardMaterial color="#ae8c55" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      <mesh position={[0, 0.58, 0.28]}>
        <cylinderGeometry args={[0.09, 0.09, 0.15, 16]} />
        <meshStandardMaterial color="#5d777a" metalness={0.68} roughness={0.3} />
      </mesh>
      <mesh position={[0.31, 0.58, 0]}>
        <boxGeometry args={[0.15, 0.16, 0.2]} />
        <meshStandardMaterial color="#445a5d" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.87, 0]}>
        <cylinderGeometry args={[0.22, 0.3, 0.1, 24]} />
        <meshStandardMaterial color="#394d50" metalness={0.55} roughness={0.4} />
      </mesh>

      {/* status light */}
      <mesh position={[0.35, 0.33, 0.33]}>
        <sphereGeometry args={[0.035, 10, 8]} />
        <meshBasicMaterial color={active ? '#7ff0c6' : '#47605c'} toneMapped={false} />
      </mesh>

      <SceneLabel
        position={[1.0, 1.25, 0.6]}
        tone="neutral"
        labelKey="modelPump"
        visible={labelsOn && (activeChapter === 7 || activeChapter === 8)}
      />
    </group>
  )
}
