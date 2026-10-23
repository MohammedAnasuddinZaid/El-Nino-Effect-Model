import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { isMotionRunning, motionTime, useExperience } from '../store/useExperience'
import { COLORS, Plaque, RainSystem, SceneLabel } from './primitives'
import { getScenePlaque } from '../data/sceneLabels'
import { LAYOUT } from '../data/layout'

const roofWaterVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const roofWaterFragment = /* glsl */ `
  uniform float uTime;
  uniform float uActive;
  varying vec2 vUv;
  void main() {
    float lines = smoothstep(0.72, 1.0, sin((vUv.y * 23.0) - uTime * 1.2 + sin(vUv.x * 18.0) * 0.2) * 0.5 + 0.5);
    float edge = smoothstep(0.0, 0.08, vUv.x) * smoothstep(0.0, 0.08, 1.0 - vUv.x);
    float alpha = uActive * (0.1 + lines * 0.18) * edge;
    vec3 color = mix(vec3(0.18, 0.55, 0.72), vec3(0.6, 0.92, 1.0), lines);
    gl_FragColor = vec4(color, alpha);
  }
`

function RoofWater({ active }: { active: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const current = useRef(0)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uActive: { value: 0 } }), [])
  useFrame((_, dt) => {
    current.current = THREE.MathUtils.damp(
      current.current,
      active && isMotionRunning() ? 1 : 0,
      3,
      Math.min(dt, 0.05),
    )
    if (mat.current) {
      mat.current.uniforms.uTime.value = motionTime.value
      mat.current.uniforms.uActive.value = current.current
    }
  })
  return (
    <mesh position={[0, 3.48, 0.72]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.82, 2.5, 1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={roofWaterVertex}
        fragmentShader={roofWaterFragment}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function Window({
  position,
  rotation,
  width = 0.72,
  height = 0.8,
  lit = true,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  lit?: boolean
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.06]} />
        <meshStandardMaterial color="#33454d" roughness={0.54} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={lit ? '#f4d39a' : '#5d7d87'}
          emissive={lit ? '#f0b568' : '#19343e'}
          emissiveIntensity={lit ? 0.8 : 0.1}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[0.035, height, 0.02]} />
        <meshStandardMaterial color="#31434b" />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[width, 0.032, 0.02]} />
        <meshStandardMaterial color="#31434b" />
      </mesh>
    </group>
  )
}

export default function House() {
  const language = useExperience((s) => s.language)
  const plaque = getScenePlaque('house', language)
  const activeChapter = useExperience((s) => s.activeChapter)
  const labelsOn = useExperience((s) => s.labels)
  const selectedPart = useExperience((s) => s.selectedPart)
  const selectPart = useExperience((s) => s.selectPart)
  const exploded = useExperience((s) => s.exploded)
  const roofGroup = useRef<THREE.Group>(null)
  const motionDemo = useExperience((s) => s.motionDemo)
  const rainOn = activeChapter === 4 || motionDemo || selectedPart === 'roof' || selectedPart === 'gutter' || selectedPart === 'downpipe' || selectedPart === 'ocean'
  const stormLight = activeChapter >= 3 && activeChapter <= 5
  const flowOn = activeChapter === 4 || activeChapter === 5 || activeChapter === 6 || activeChapter === 8 || motionDemo
  const showLabels = labelsOn && (activeChapter === 4 || activeChapter === 5)
  const roofSelected = selectedPart === 'roof'
  const gutterSelected = selectedPart === 'gutter'
  const downpipeSelected = selectedPart === 'downpipe'
  const roofColor = roofSelected ? '#466170' : '#30434b'

  useFrame((_, dt) => {
    if (!roofGroup.current) return
    const target = LAYOUT.house.roofY + (exploded ? 0.82 : 0)
    roofGroup.current.position.y = THREE.MathUtils.damp(roofGroup.current.position.y, target, 3.2, Math.min(dt, 0.05))
  })

  const hover = (name: 'roof' | 'gutter' | 'downpipe') => ({
    onPointerDown: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      selectPart(name)
    },
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation()
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      document.body.style.cursor = ''
    },
  })

  return (
    <group position={LAYOUT.house.group}>
      {/* Foundation + walls */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow {...hover('roof')}>
        <boxGeometry args={[5.0, 0.2, 3.8]} />
        <meshStandardMaterial color="#897f6e" roughness={0.87} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow receiveShadow {...hover('roof')}>
        <boxGeometry args={[4.56, 3.0, 3.3]} />
        <meshStandardMaterial color="#e8dfd0" roughness={0.83} />
      </mesh>
      <mesh position={[0, 1.04, 1.66]} castShadow>
        <boxGeometry args={[4.7, 0.16, 0.1]} />
        <meshStandardMaterial color="#c6bca9" roughness={0.85} />
      </mesh>

      {/* Door */}
      <group position={[-0.7, 0.9, 1.68]}>
        <mesh>
          <boxGeometry args={[1.05, 1.75, 0.12]} />
          <meshStandardMaterial color="#21454e" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.02, 0.075]}>
          <boxGeometry args={[0.82, 1.55, 0.04]} />
          <meshStandardMaterial color="#17343c" roughness={0.62} />
        </mesh>
        <mesh position={[0.23, 0, 0.12]}>
          <sphereGeometry args={[0.045, 12, 8]} />
          <meshStandardMaterial color="#d9b77a" metalness={0.75} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.44, 0.06]}>
          <planeGeometry args={[0.5, 0.34]} />
          <meshStandardMaterial color="#9fb7b3" roughness={0.35} metalness={0.2} />
        </mesh>
      </group>

      <Window position={[1.1, 1.75, 1.68]} />
      <Window position={[2.29, 1.85, 0.45]} rotation={[0, Math.PI / 2, 0]} width={0.7} />
      <Window position={[-2.29, 1.85, -0.2]} rotation={[0, -Math.PI / 2, 0]} width={0.78} />

      {/* Door step */}
      <mesh position={[-0.7, 0.11, 2.0]} castShadow>
        <boxGeometry args={[1.5, 0.2, 0.7]} />
        <meshStandardMaterial color="#b2a58e" roughness={0.9} />
      </mesh>

      {/* Flat roof with a gentle crown */}
      <group
        {...hover('roof')}
        ref={roofGroup}
        position={[0, LAYOUT.house.roofY, 0]}
      >
        <mesh castShadow receiveShadow>
          <boxGeometry args={[5.15, 0.24, 3.95]} />
          <meshStandardMaterial color={roofColor} roughness={0.74} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[4.92, 0.035, 3.7]} />
          <meshStandardMaterial color={roofSelected ? '#7c9aaa' : '#455c65'} roughness={0.52} metalness={0.18} />
        </mesh>
        {/* subtle roof seams */}
        {[-1.6, -0.8, 0, 0.8, 1.6].map((x) => (
          <mesh key={x} position={[x, 0.155, 0]}>
            <boxGeometry args={[0.018, 0.014, 3.66]} />
            <meshStandardMaterial color="#657980" roughness={0.6} />
          </mesh>
        ))}
        {/* low parapet along the sides and back, open at the gutter */}
        <mesh position={[0, 0.18, -1.93]}>
          <boxGeometry args={[5.15, 0.16, 0.12]} />
          <meshStandardMaterial color="#2b3b42" roughness={0.7} />
        </mesh>
        <mesh position={[-2.53, 0.18, 0]}>
          <boxGeometry args={[0.12, 0.16, 3.95]} />
          <meshStandardMaterial color="#2b3b42" roughness={0.7} />
        </mesh>
        <mesh position={[2.53, 0.18, 0]}>
          <boxGeometry args={[0.12, 0.16, 3.95]} />
          <meshStandardMaterial color="#2b3b42" roughness={0.7} />
        </mesh>
        <RoofWater active={activeChapter === 4 || activeChapter === 5 || motionDemo} />
      </group>

      {/* Gutter trough */}
      <group position={[0, 3.28, 2.07]} {...hover('gutter')}>
        <mesh castShadow>
          <boxGeometry args={[5.05, 0.08, 0.36]} />
          <meshStandardMaterial
            color={gutterSelected ? '#d1fbff' : '#8ca5a8'}
            metalness={0.72}
            roughness={0.31}
            emissive={gutterSelected ? '#1c75bc' : '#000000'}
            emissiveIntensity={gutterSelected ? 0.25 : 0}
          />
        </mesh>
        {[-0.18, 0.18].map((z) => (
          <mesh key={z} position={[0, 0.13, z]} castShadow>
            <boxGeometry args={[5.05, 0.23, 0.055]} />
            <meshStandardMaterial color="#657f84" metalness={0.7} roughness={0.34} />
          </mesh>
        ))}
        {[-2.55, 2.55].map((x) => (
          <mesh key={x} position={[x, 0.1, 0]}>
            <boxGeometry args={[0.055, 0.22, 0.36]} />
            <meshStandardMaterial color="#657f84" metalness={0.7} roughness={0.34} />
          </mesh>
        ))}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.92, 0.27]} />
          <meshPhysicalMaterial
            color="#39a8d0"
            transparent
            opacity={flowOn ? 0.62 : 0.08}
            roughness={0.1}
            metalness={0}
            clearcoat={1}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Downpipe visual is part of the connected pipe system. Its brackets are here. */}
      <group position={[LAYOUT.house.downpipeX - LAYOUT.house.group[0], 2.56, LAYOUT.house.downpipeZ - LAYOUT.house.group[2]]}>
        {[0.12, 0.65].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <boxGeometry args={[0.28, 0.045, 0.12]} />
            <meshStandardMaterial color="#53686c" metalness={0.55} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Landscaping and detail */}
      <group position={[0, 0.02, 0]}>
        {[
          [-2.95, 0, 0.45, 0.35],
          [2.9, 0, 1.0, 0.28],
          [2.7, 0, -1.7, 0.38],
          [-2.8, 0, -1.85, 0.32],
        ].map(([x, , z, s], i) => (
          <group key={i} position={[x, 0.1, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.035, 0.05, 0.65, 6]} />
              <meshStandardMaterial color="#735943" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.55, 0]} castShadow>
              <icosahedronGeometry args={[s, 0]} />
              <meshStandardMaterial color={i % 2 ? '#548a61' : '#456f53'} roughness={0.9} flatShading />
            </mesh>
          </group>
        ))}
      </group>

      <Plaque
        position={[0.85, 0.42, 1.74]}
        width={1.15}
        height={0.32}
        lines={plaque.lines}
      />

      <RainSystem center={[-2.9, 3.56, -0.8]} area={[6.4, 5.2]} height={5.4} count={260} active={rainOn} floor={3.52} />
      {stormLight && (
        <pointLight position={[0, 3.2, 5]} color="#a6d8ff" intensity={0.7} distance={8} decay={2} castShadow={false} />
      )}

      {showLabels && (
        <>
          <SceneLabel position={[0, 4.08, 0.3]} tone="cool" labelKey="roofCatchment" />
          <SceneLabel position={[1.45, 3.62, 2.28]} tone="cool" labelKey="gutter" />
          <SceneLabel position={[2.55, 2.15, 2.25]} tone="neutral" labelKey="downpipe" />
        </>
      )}
    </group>
  )
}
