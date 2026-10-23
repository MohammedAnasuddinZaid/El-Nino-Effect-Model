import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { PIPE_ROUTES } from '../data/layout'
import { FlowPipe, SceneLabel } from './primitives'
import { motionTime, useExperience } from '../store/useExperience'

function Valve({
  position,
  rotation = 0,
  selected,
  onClick,
}: {
  position: [number, number, number]
  rotation?: number
  selected: boolean
  onClick: (e: ThreeEvent<PointerEvent>) => void
}) {
  const handle = useRef<THREE.Group>(null)
  useFrame(() => {
    if (handle.current) handle.current.rotation.y = Math.sin(motionTime.value * 0.35) * 0.1
  })
  return (
    <group position={position} rotation={[0, rotation, 0]} onPointerDown={onClick}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.18, 12]} />
        <meshStandardMaterial color="#9dbaa4" metalness={0.55} roughness={0.34} />
      </mesh>
      <group ref={handle}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.14, 0]}>
          <torusGeometry args={[0.16, 0.025, 8, 24]} />
          <meshStandardMaterial color={selected ? '#8df4ff' : '#ddbd82'} metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <boxGeometry args={[0.035, 0.035, 0.3]} />
          <meshStandardMaterial color={selected ? '#8df4ff' : '#ddbd82'} metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

export default function Connections() {
  const activeChapter = useExperience((s) => s.activeChapter)
  const selectPart = useExperience((s) => s.selectPart)
  const labelsOn = useExperience((s) => s.labels)
  const collected = activeChapter === 4 || activeChapter === 5 || activeChapter === 6 || activeChapter === 8
  const irrigating = activeChapter === 7 || activeChapter === 8
  const showLabels = labelsOn && activeChapter === 8

  const mainPath = useMemo(
    () => [...PIPE_ROUTES.pumpToField, ...PIPE_ROUTES.mainLine.slice(1)],
    [],
  )
  const manifoldPath = PIPE_ROUTES.manifold

  const onClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('irrigation')
  }
  const onGutter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('gutter')
  }
  const onDownpipe = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('downpipe')
  }
  const onTank = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('tank')
  }
  const onFilter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('filter')
  }

  return (
    <group>
      {/* downpipe and filter feed */}
      <group onPointerDown={onDownpipe} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
        <FlowPipe points={PIPE_ROUTES.gutterToFilter} radius={0.095} active={collected} speed={0.52} particles={16} color="#65dcff" />
      </group>

      {/* filter to tank */}
      <group onPointerDown={onFilter} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
        <FlowPipe points={PIPE_ROUTES.filterToTank} radius={0.078} active={activeChapter === 5 || activeChapter === 6 || activeChapter === 8} speed={0.46} particles={10} color="#61d6fb" />
      </group>

      {/* tank to pump */}
      <group onPointerDown={onTank} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
        <FlowPipe points={PIPE_ROUTES.tankToPump} radius={0.078} active={irrigating} speed={0.54} particles={9} color="#58d4fb" />
      </group>

      {/* pump to field manifold */}
      <group onPointerDown={onClick} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
        <FlowPipe points={mainPath} radius={0.066} active={irrigating} speed={0.55} particles={14} color="#5ad6ff" />
        <FlowPipe points={manifoldPath} radius={0.052} active={irrigating} speed={0.48} particles={12} color="#5ad6ff" />
      </group>

      {/* field laterals */}
      <group onPointerDown={onClick} onPointerOver={() => (document.body.style.cursor = 'pointer')} onPointerOut={() => (document.body.style.cursor = '')}>
        {PIPE_ROUTES.laterals.map((lateral, i) => (
          <FlowPipe
            key={i}
            points={lateral}
            radius={0.038}
            active={irrigating}
            speed={0.42 + i * 0.025}
            particles={10}
            color="#5ce2ff"
            delay={i * 0.12}
          />
        ))}
        <FlowPipe points={PIPE_ROUTES.rootBranch} radius={0.028} active={irrigating} speed={0.4} particles={5} color="#60e7ff" delay={0.2} />
      </group>

      {/* a short gutter water connection */}
      <group onPointerDown={onGutter}>
        <FlowPipe points={PIPE_ROUTES.roofToGutter} radius={0.02} active={activeChapter === 4 || activeChapter === 5} speed={0.7} particles={10} color="#93edff" />
      </group>

      {/* fittings */}
      {[
        [1.1, 1.79, 2.0],
        [1.1, 0.99, 2.0],
        [3.0, 0.92, 1.72],
        [5.63, 1.0, 1.33],
        [8.55, 1.03, 1.78],
        [8.55, 1.03, 0.23],
        [8.55, 1.03, -1.32],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <cylinderGeometry args={[0.085, 0.085, 0.055, 12]} />
          <meshStandardMaterial color="#8aa6a6" metalness={0.55} roughness={0.38} />
        </mesh>
      ))}

      <Valve position={[8.55, 0.92, 0.45]} selected={irrigating} onClick={onClick} />
      <Valve position={[7.78, 0.82, 0.83]} selected={irrigating} onClick={onClick} rotation={0.35} />

      {showLabels && (
        <>
          <SceneLabel position={[1.7, 1.36, 2.25]} tone="neutral">
            Filter → tank
          </SceneLabel>
          <SceneLabel position={[6.15, 0.95, 1.7]} tone="cool">
            Irrigation main
          </SceneLabel>
          <SceneLabel position={[10.0, 1.25, 1.7]} tone="cool">
            Drip tubes
          </SceneLabel>
        </>
      )}
    </group>
  )
}
