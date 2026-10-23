import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { CHAPTERS } from '../data/chapters'
import type { PartId } from '../data/components'
import { motionTime, scrollSignals, useExperience } from '../store/useExperience'
import Base from '../scene/Base'
import OceanLab from '../scene/OceanLab'
import House from '../scene/House'
import Filter from '../scene/Filter'
import StorageTank from '../scene/StorageTank'
import Pump from '../scene/Pump'
import IrrigationField from '../scene/IrrigationField'
import Connections from '../scene/Connections'
import { CameraRig } from './CameraRig'

function TimeDriver() {
  useFrame((_, rawDelta) => {
    if (useExperience.getState().paused) return
    const delta = Math.min(rawDelta, 0.05)
    motionTime.value += delta
    motionTime.rain += delta
    motionTime.seconds += delta
  }, -10)
  return null
}

function SceneReady({ onReady }: { onReady: () => void }) {
  const frames = useRef(0)
  useFrame(() => {
    if (frames.current < 4) {
      frames.current += 1
      if (frames.current === 4) onReady()
    }
  })
  return null
}

function Atmosphere() {
  return (
    <group>
      <mesh position={[0, 10, -26]} renderOrder={-10}>
        <planeGeometry args={[120, 64]} />
        <shaderMaterial
          vertexShader={/* glsl */ `
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={/* glsl */ `
            varying vec2 vUv;
            float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
            void main() {
              vec2 p = vUv - 0.5;
              float distanceFromCenter = length(p * vec2(1.0, 1.65));
              vec3 top = vec3(0.012, 0.032, 0.047);
              vec3 bottom = vec3(0.006, 0.014, 0.022);
              vec3 color = mix(bottom, top, vUv.y);
              float leftGlow = exp(-length((vUv - vec2(0.18, 0.46)) * vec2(1.1, 2.3)) * 4.5);
              float rightGlow = exp(-length((vUv - vec2(0.82, 0.4)) * vec2(1.4, 2.6)) * 5.6);
              color += leftGlow * vec3(0.015, 0.095, 0.115);
              color += rightGlow * vec3(0.10, 0.032, 0.012);
              color += smoothstep(0.42, 0.0, distanceFromCenter) * vec3(0.01, 0.028, 0.032);
              float grain = hash(gl_FragCoord.xy) - 0.5;
              gl_FragColor = vec4(color + grain * 0.005, 1.0);
            }
          `}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function Lighting() {
  const activeChapter = useExperience((state) => state.activeChapter)
  const oceanMode = useExperience((state) => state.oceanMode)
  const key = useRef<THREE.DirectionalLight>(null)
  const fill = useRef<THREE.DirectionalLight>(null)
  const warmth = useRef<THREE.PointLight>(null)
  const oceanLight = useRef<THREE.PointLight>(null)
  const fieldLight = useRef<THREE.PointLight>(null)

  const base = useMemo(
    () => ({
      key: 2.35,
      fill: 1.15,
      warmth: 16,
      ocean: 10,
      field: 6,
    }),
    [],
  )

  useFrame((_, dt) => {
    const delta = Math.min(dt, 0.05)
    const oceanScene = activeChapter <= 2 || activeChapter === 8
    const dryScene = activeChapter === 3
    const stormScene = activeChapter === 4 || activeChapter === 5
    const fieldScene = activeChapter === 6 || activeChapter === 7 || activeChapter === 8
    if (key.current) {
      key.current.intensity = THREE.MathUtils.damp(
        key.current.intensity,
        stormScene ? base.key * 0.55 : dryScene ? base.key * 1.08 : base.key,
        2,
        delta,
      )
    }
    if (fill.current) {
      fill.current.intensity = THREE.MathUtils.damp(
        fill.current.intensity,
        oceanScene ? base.fill * 1.35 : base.fill,
        2,
        delta,
      )
    }
    if (warmth.current) {
      const warmTarget = oceanMode === 'elnino' ? base.warmth * 1.5 : dryScene ? base.warmth * 1.35 : base.warmth * 0.65
      warmth.current.intensity = THREE.MathUtils.damp(warmth.current.intensity, warmTarget, 1.6, delta)
    }
    if (oceanLight.current) {
      oceanLight.current.intensity = THREE.MathUtils.damp(
        oceanLight.current.intensity,
        oceanScene ? base.ocean : base.ocean * 0.25,
        1.8,
        delta,
      )
    }
    if (fieldLight.current) {
      fieldLight.current.intensity = THREE.MathUtils.damp(
        fieldLight.current.intensity,
        fieldScene ? base.field : base.field * 0.45,
        1.8,
        delta,
      )
    }
  })

  return (
    <>
      <ambientLight intensity={0.32} color="#91adba" />
      <hemisphereLight args={['#b7e4f2', '#190f09', 0.72]} />
      <directionalLight
        ref={key}
        position={[10, 17, 12]}
        intensity={base.key}
        color="#ffe7c8"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
      />
      <directionalLight ref={fill} position={[-14, 10, -9]} intensity={base.fill} color="#4b9cba" />
      <directionalLight position={[5, 5, -14]} intensity={0.55} color="#ff9d72" />
      <pointLight ref={warmth} position={[9.5, 3.4, 4.8]} intensity={base.warmth} distance={22} decay={2} color="#ffbc8c" />
      <pointLight ref={oceanLight} position={[-10.6, 3.4, 3.4]} intensity={base.ocean} distance={15} decay={2} color="#5ed8ff" />
      <pointLight ref={fieldLight} position={[11, 3.0, 3.3]} intensity={base.field} distance={12} decay={2} color="#cee9a8" />
      <pointLight position={[-4.5, 1.5, 4.9]} intensity={2.2} distance={9} decay={2} color="#ffcf9a" />
      <spotLight
        position={[1, 12, 7]}
        angle={0.58}
        penumbra={0.95}
        intensity={2.4}
        distance={35}
        decay={2}
        color="#d9edf1"
      />
    </>
  )
}

const BEACONS: Record<PartId, { position: [number, number, number]; radius: number }> = {
  ocean: { position: [-11.2, 3.18, 0.1], radius: 3.65 },
  roof: { position: [-2.9, 3.76, -0.8], radius: 2.72 },
  gutter: { position: [-2.9, 3.52, 1.28], radius: 2.2 },
  downpipe: { position: [-0.62, 1.9, 1.28], radius: 0.82 },
  filter: { position: [1.1, 1.5, 2.0], radius: 1.12 },
  tank: { position: [4.2, 1.0, 1.7], radius: 1.9 },
  pump: { position: [5.95, 0.68, 1.3], radius: 0.9 },
  irrigation: { position: [10.7, 1.15, 0.2], radius: 3.65 },
  roots: { position: [11.1, 0.94, 2.65], radius: 2.45 },
}

function SelectionBeacon() {
  const selectedPart = useExperience((state) => state.selectedPart)
  const focusPart = useExperience((state) => state.focusPart)
  const group = useRef<THREE.Group>(null)
  const rings = useRef<THREE.Mesh[]>([])
  const activePart = focusPart ?? selectedPart
  const beacon = activePart ? BEACONS[activePart] : null

  useFrame((_, dt) => {
    if (!group.current) return
    const isSelected = Boolean(activePart)
    group.current.visible = isSelected
    if (!isSelected) return
    const pulse = 1 + Math.sin(motionTime.value * 2.2) * 0.025
    group.current.scale.setScalar(pulse)
    group.current.rotation.y += dt * 0.18
    rings.current.forEach((ring, index) => {
      if (!ring) return
      const mat = ring.material as THREE.MeshBasicMaterial
      mat.opacity = 0.45 - index * 0.12 + Math.sin(motionTime.value * 2 + index) * 0.08
    })
  })

  if (!beacon) return null

  return (
    <group ref={group} visible={false} position={beacon.position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[beacon.radius * 0.92, beacon.radius, 64]} />
        <meshBasicMaterial color="#8eeaff" transparent opacity={0.42} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh
        ref={(node) => {
          if (node) rings.current[0] = node
        }}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={1.12}
      >
        <ringGeometry args={[beacon.radius * 0.74, beacon.radius * 0.76, 64]} />
        <meshBasicMaterial color="#f4f9f7" transparent opacity={0.26} depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * (beacon.radius + 0.14), 0.02, Math.sin(angle) * (beacon.radius + 0.14)]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.2, 0.012, 0.016]} />
            <meshBasicMaterial color="#c9f7ff" transparent opacity={0.72} depthWrite={false} toneMapped={false} />
          </mesh>
        )
      })}
    </group>
  )
}

function SceneContents({ onReady }: { onReady: () => void }) {
  return (
    <>
      <TimeDriver />
      <SceneReady onReady={onReady} />
      <fogExp2 attach="fog" args={['#06121b', 0.017]} />
      <Atmosphere />
      <Lighting />
      <CameraRig />
      <Base />
      <OceanLab />
      <House />
      <Filter />
      <StorageTank />
      <Pump />
      <IrrigationField />
      <Connections />
      <SelectionBeacon />
      <EffectComposer multisampling={2} enableNormalPass={false}>
        <Bloom intensity={0.32} luminanceThreshold={0.78} luminanceSmoothing={0.2} mipmapBlur radius={0.72} />
        <Vignette eskil={false} offset={0.17} darkness={0.58} />
      </EffectComposer>
    </>
  )
}

function CanvasEvents() {
  const gl = useThree((state) => state.gl)
  useEffect(() => {
    const canvas = gl.domElement
    const onLost = (event: Event) => {
      event.preventDefault()
      window.dispatchEvent(new CustomEvent('exhibit:contextlost'))
    }
    canvas.addEventListener('webglcontextlost', onLost)
    return () => canvas.removeEventListener('webglcontextlost', onLost)
  }, [gl])
  return null
}

export function ExperienceCanvas({ onReady }: { onReady: () => void }) {
  const setLoaded = useExperience((state) => state.setLoaded)
  const selectPart = useExperience((state) => state.selectPart)

  useEffect(() => {
    const failSafe = window.setTimeout(() => setLoaded(true), 8500)
    return () => window.clearTimeout(failSafe)
  }, [setLoaded])

  return (
    <div className="canvas-shell" aria-hidden="true">
      <Canvas
        dpr={[1, Math.min(1.8, typeof window === 'undefined' ? 1.5 : window.devicePixelRatio)]}
        camera={{ position: CHAPTERS[0].camera.start.position, fov: 34, near: 0.08, far: 180 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        shadows="percentage"
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#040c13', 1)
          scene.background = new THREE.Color('#040c13')
        }}
        onPointerMissed={() => selectPart(null)}
      >
        <Suspense fallback={null}>
          <SceneContents onReady={onReady} />
          <CanvasEvents />
        </Suspense>
      </Canvas>
    </div>
  )
}
