import { useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { LAYOUT } from '../data/layout'
import { isMotionRunning, scrollSignals, motionTime, useExperience } from '../store/useExperience'
import { Plaque, SceneLabel, damp, smoothstep } from './primitives'

function TankBubbles({ active }: { active: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const material = useRef<THREE.MeshBasicMaterial>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const seeds = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        x: (Math.random() - 0.5) * 1.9,
        z: (Math.random() - 0.5) * 1.5,
        y: 0.05 + Math.random() * 0.8,
        speed: 0.07 + Math.random() * 0.13,
        scale: 0.5 + Math.random() * 0.8,
      })),
    [],
  )
  const current = useRef(0)
  useFrame((_, dt) => {
    const running = isMotionRunning()
    current.current = damp(current.current, active && running ? 1 : 0, 2.5, Math.min(dt, 0.05))
    if (material.current) material.current.opacity = current.current * 0.5
    if (!mesh.current) return
    mesh.current.visible = current.current > 0.02
    if (!running) return
    for (let i = 0; i < seeds.length; i += 1) {
      const s = seeds[i]
      s.y += s.speed * Math.min(dt, 0.05)
      if (s.y > 1.22) s.y = 0.04
      dummy.position.set(s.x, 1.22 + s.y, s.z)
      dummy.scale.setScalar(s.scale)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    }
    mesh.current.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 18]} frustumCulled={false}>
      <sphereGeometry args={[0.014, 5, 5]} />
      <meshBasicMaterial ref={material} color="#94e8ff" transparent opacity={0} depthWrite={false} toneMapped={false} />
    </instancedMesh>
  )
}

function TankSurfaceMaterial() {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  useFrame(() => {
    if (mat.current) mat.current.uniforms.uTime.value = motionTime.value
  })
  return (
    <shaderMaterial
      ref={mat}
      uniforms={uniforms}
      transparent
      depthWrite={false}
      vertexShader={/* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z += sin(p.x * 26.0 + uTime * 1.4) * 0.008 + cos(p.y * 24.0 - uTime * 1.1) * 0.006;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `}
      fragmentShader={/* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float rings = sin(length(vUv - vec2(0.5)) * 52.0 - uTime * 2.2) * 0.5 + 0.5;
          float glint = smoothstep(0.92, 1.0, sin(vUv.x * 95.0 + uTime * 1.8) * cos(vUv.y * 55.0));
          vec3 color = mix(vec3(0.13, 0.56, 0.75), vec3(0.62, 0.94, 1.0), glint * 0.7);
          color += rings * 0.012;
          gl_FragColor = vec4(color, 0.72);
        }
      `}
    />
  )
}

export default function StorageTank() {
  const selectPart = useExperience((s) => s.selectPart)
  const activeChapter = useExperience((s) => s.activeChapter)
  const labelsOn = useExperience((s) => s.labels)
  const cutaway = useExperience((s) => s.cutaway)
  const exploded = useExperience((s) => s.exploded)
  const selected = useExperience((s) => s.selectedPart === 'tank')
  const water = useRef<THREE.Mesh>(null)
  const surface = useRef<THREE.Mesh>(null)
  const levelRef = useRef(0.16)
  const lid = useRef<THREE.Group>(null)
  const marker = useRef<THREE.Mesh>(null)

  const fillHeight = 1.34
  const base = 1.2

  useFrame((_, dt) => {
    const chapter = useExperience.getState().activeChapter
    const local = scrollSignals.local
    let target = 0.16
    if (chapter <= 2) target = 0.2
    if (chapter === 3) target = 0.04
    if (chapter === 4) target = 0.08 + 0.1 * smoothstep(local)
    if (chapter === 5) target = 0.18 + 0.09 * smoothstep(local)
    if (chapter === 6) target = 0.27 + 0.63 * smoothstep(local)
    if (chapter === 7) target = 0.88 - 0.28 * smoothstep(Math.min(1, local * 1.25))
    if (chapter === 8) target = 0.58
    levelRef.current = damp(levelRef.current, THREE.MathUtils.clamp(target, 0.03, 0.94), 1.8, Math.min(dt, 0.04))
    if (water.current) {
      const level = levelRef.current
      water.current.scale.set(2.36, fillHeight * level, 1.94)
      water.current.position.y = base + (fillHeight * level) / 2
      if (surface.current) {
        surface.current.position.y = base + fillHeight * level + 0.002
      }
      if (marker.current) {
        marker.current.position.y = base + fillHeight * level + 0.02
      }
    }
    if (lid.current) {
      lid.current.position.y = damp(lid.current.position.y, exploded ? 0.65 : 0, 4, Math.min(dt, 0.04))
    }
  })

  const liquidActive = activeChapter === 6 || activeChapter === 7 || activeChapter === 8

  const onClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    selectPart('tank')
  }
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }
  const onOut = () => {
    document.body.style.cursor = ''
  }

  return (
    <group position={LAYOUT.tank.group} onPointerDown={onClick} onPointerOver={onOver} onPointerOut={onOut}>
      {/* low plinth */}
      <group>
        <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
          <boxGeometry args={[2.78, 0.22, 2.38]} />
          <meshStandardMaterial color="#3f5053" metalness={0.55} roughness={0.46} />
        </mesh>
        <mesh position={[0, 0.24, 0]} receiveShadow>
          <boxGeometry args={[2.66, 0.05, 2.26]} />
          <meshStandardMaterial color="#6f8281" metalness={0.4} roughness={0.42} />
        </mesh>
        {[-1.18, 1.18].map((x) =>
          [-0.95, 0.95].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.04, z]}>
              <boxGeometry args={[0.28, 0.08, 0.28]} />
              <meshStandardMaterial color="#a18352" metalness={0.75} roughness={0.25} />
            </mesh>
          )),
        )}
      </group>

      {/* tank body, shifted down to sit on the low plinth */}
      <group position={[0, -0.87, 0]}>
        <mesh position={[0, 1.88, 0]}>
          <boxGeometry args={[2.55, 1.48, 2.15]} />
          <meshPhysicalMaterial
            color="#c8ecf0"
            transparent
            opacity={cutaway ? 0.05 : 0.1}
            roughness={0.04}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.04}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* metal frame */}
        {[-1.27, 1.27].flatMap((x) =>
          [-1.07, 1.07].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 1.88, z]}>
              <boxGeometry args={[0.06, 1.5, 0.06]} />
              <meshStandardMaterial color={selected ? '#7edcf0' : '#63787a'} metalness={0.7} roughness={0.33} />
            </mesh>
          )),
        )}
        {[
          [1.88, 2.62, 0],
          [1.88, 1.14, 0],
        ].map(([, y], i) => (
          <group key={i}>
            <mesh position={[0, y, 1.07]}>
              <boxGeometry args={[2.55, 0.06, 0.06]} />
              <meshStandardMaterial color="#63787a" metalness={0.7} roughness={0.33} />
            </mesh>
            <mesh position={[0, y, -1.07]}>
              <boxGeometry args={[2.55, 0.06, 0.06]} />
              <meshStandardMaterial color="#63787a" metalness={0.7} roughness={0.33} />
            </mesh>
            <mesh position={[1.27, y, 0]}>
              <boxGeometry args={[0.06, 0.06, 2.15]} />
              <meshStandardMaterial color="#63787a" metalness={0.7} roughness={0.33} />
            </mesh>
            <mesh position={[-1.27, y, 0]}>
              <boxGeometry args={[0.06, 0.06, 2.15]} />
              <meshStandardMaterial color="#63787a" metalness={0.7} roughness={0.33} />
            </mesh>
          </group>
        ))}

        {/* water volume */}
        <mesh ref={water} position={[0, base + 0.2, 0]} scale={[2.36, 0.3, 1.94]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#1c75bc"
            emissive="#0d4b75"
            emissiveIntensity={0.16}
            transparent
            opacity={0.67}
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={surface} position={[0, base + 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.36, 1.94, 24, 18]} />
          <TankSurfaceMaterial />
        </mesh>
        <mesh ref={marker} position={[0, base + 0.24, 1.08]}>
          <boxGeometry args={[2.25, 0.012, 0.012]} />
          <meshBasicMaterial color="#87efff" transparent opacity={0.8} toneMapped={false} />
        </mesh>

        {/* level ticks */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <mesh key={t} position={[1.3, 1.25 + t * 1.25, 1.08]}>
            <boxGeometry args={[0.09, 0.012, 0.01]} />
            <meshBasicMaterial color="white" transparent opacity={0.38} />
          </mesh>
        ))}

      {/* lid lifts in exploded view */}
      <group ref={lid} position={[0, 0, 0]}>
        <mesh position={[0, 2.67, 0]} castShadow>
          <boxGeometry args={[2.62, 0.12, 2.22]} />
          <meshStandardMaterial color="#394d50" metalness={0.55} roughness={0.42} />
        </mesh>
        <mesh position={[-0.45, 2.75, 0.1]} castShadow>
          <cylinderGeometry args={[0.14, 0.17, 0.2, 16]} />
          <meshStandardMaterial color="#607778" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* outlet tap */}
      <group position={[1.29, 1.28, 0.22]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.38, 12]} />
          <meshStandardMaterial color="#ae8c55" metalness={0.78} roughness={0.22} />
        </mesh>
        <mesh position={[0.19, 0, 0]}>
          <torusGeometry args={[0.1, 0.025, 8, 20]} />
          <meshStandardMaterial color="#ae8c55" metalness={0.78} roughness={0.22} />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, 0.45]}>
          <boxGeometry args={[0.06, 0.34, 0.05]} />
          <meshStandardMaterial color="#7a3026" metalness={0.45} roughness={0.43} />
        </mesh>
      </group>

      <TankBubbles active={liquidActive} />
      </group>

      <Plaque
        position={[0, 0.16, 1.205]}
        width={1.95}
        height={0.28}
        lines={['Rainwater reserve', 'store for dry days']}
        small="05 · STORAGE"
      />

      <SceneLabel
        position={[-0.1, 2.02, 0.6]}
        tone="cool"
        visible={labelsOn && activeChapter === 6}
      >
        Water level rises
      </SceneLabel>
      <SceneLabel
        position={[1.56, 0.56, 0.45]}
        tone="neutral"
        visible={labelsOn && activeChapter === 7}
      >
        Outlet to crops
      </SceneLabel>
    </group>
  )
}
