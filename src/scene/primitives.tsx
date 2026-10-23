import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { motionTime, useExperience } from '../store/useExperience'

export const COLORS = {
  ink: '#07111f',
  navy: '#0f2042',
  ocean: '#1c75bc',
  aqua: '#66d9ff',
  mint: '#9be8dc',
  crimson: '#d9381e',
  ember: '#ff8a58',
  sun: '#f5c26b',
  sand: '#c8b48d',
  soil: '#5a3c2b',
  soilLight: '#8a6549',
  leaf: '#5b9b69',
  leafDeep: '#2f6b4f',
  cream: '#f2ecdf',
  fog: '#071522',
}

export function damp(current: number, target: number, lambda: number, delta: number) {
  return THREE.MathUtils.damp(current, target, lambda, delta)
}

export function smoothstep(t: number) {
  const x = THREE.MathUtils.clamp(t, 0, 1)
  return x * x * (3 - 2 * x)
}

export function useChapterLocal(chapter: number) {
  const ref = useRef(0)
  useFrame(() => {
    ref.current = 0
  })
  return ref
}

export function FlowPipe({
  points,
  radius = 0.08,
  color = COLORS.aqua,
  active = true,
  speed = 0.38,
  particles = 12,
  inner = true,
  delay = 0,
}: {
  points: [number, number, number][]
  radius?: number
  color?: string
  active?: boolean
  speed?: number
  particles?: number
  inner?: boolean
  delay?: number
}) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.4),
    [points],
  )
  const tubes = useMemo(
    () => ({
      outer: new THREE.TubeGeometry(curve, Math.max(24, points.length * 10), radius, 10, false),
      inner: new THREE.TubeGeometry(curve, Math.max(24, points.length * 10), radius * 0.56, 8, false),
    }),
    [curve, points.length, radius],
  )
  const drops = useRef<THREE.InstancedMesh>(null)
  const outerMat = useRef<THREE.MeshPhysicalMaterial>(null)
  const innerMat = useRef<THREE.MeshBasicMaterial>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const currentActive = useRef(active ? 1 : 0)
  const paused = useExperience((s) => s.paused)

  useEffect(() => {
    return () => {
      tubes.outer.dispose()
      tubes.inner.dispose()
    }
  }, [tubes])

  useFrame((_, dt) => {
    const target = active ? 1 : 0
    currentActive.current = damp(currentActive.current, target, 5, Math.min(dt, 0.05))
    if (outerMat.current) outerMat.current.opacity = 0.12 + currentActive.current * 0.2
    if (innerMat.current) innerMat.current.opacity = 0.08 + currentActive.current * 0.72

    if (!drops.current) return
    drops.current.visible = currentActive.current > 0.04
    for (let i = 0; i < particles; i += 1) {
      const t = (motionTime.value * speed + delay + i / particles) % 1
      const p = curve.getPointAt(t)
      const scale = currentActive.current * (0.75 + Math.sin((motionTime.value + i) * 5) * 0.18)
      dummy.position.copy(p)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      drops.current.setMatrixAt(i, dummy.matrix)
    }
    drops.current.instanceMatrix.needsUpdate = true
    const mat = drops.current.material as THREE.MeshBasicMaterial
    mat.opacity = currentActive.current * (paused ? 0.5 : 1)
  })

  return (
    <group>
      <mesh geometry={tubes.outer} castShadow={false}>
        <meshPhysicalMaterial
          ref={outerMat}
          color="#d8eef3"
          transparent
          opacity={0.17}
          roughness={0.08}
          metalness={0.04}
          clearcoat={1}
          clearcoatRoughness={0.1}
          depthWrite={false}
        />
      </mesh>
      {inner && (
        <mesh geometry={tubes.inner}>
          <meshBasicMaterial
            ref={innerMat}
            color={color}
            transparent
            opacity={0.2}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      )}
      <instancedMesh ref={drops} args={[undefined, undefined, particles]} frustumCulled={false}>
        <sphereGeometry args={[radius * 0.72, 6, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} depthWrite={false} />
      </instancedMesh>
    </group>
  )
}

export function WindArrow({
  start,
  end,
  color = '#cfefff',
  active = true,
  curved = 0,
  thickness = 0.025,
}: {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  active?: boolean
  curved?: number
  thickness?: number
}) {
  const startV = useMemo(() => new THREE.Vector3(...start), [start])
  const endV = useMemo(() => new THREE.Vector3(...end), [end])
  const mid = useMemo(() => startV.clone().add(endV).multiplyScalar(0.5).add(new THREE.Vector3(0, curved, 0)), [startV, endV, curved])
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3([startV, mid, endV], false, 'catmullrom', 0.2),
    [startV, mid, endV],
  )
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 24, thickness, 6, false), [curve, thickness])
  const arrow = useRef<THREE.Group>(null)
  const mat = useRef<THREE.MeshBasicMaterial>(null)
  const current = useRef(active ? 1 : 0)
  useFrame((_, dt) => {
    current.current = damp(current.current, active ? 1 : 0, 4, Math.min(dt, 0.05))
    if (arrow.current) {
      arrow.current.visible = current.current > 0.02
      arrow.current.position.y = Math.sin(motionTime.value * 1.4) * 0.015
      arrow.current.scale.setScalar(0.88 + current.current * 0.12)
    }
    if (mat.current) mat.current.opacity = current.current * 0.8
  })
  useEffect(() => () => tube.dispose(), [tube])

  const direction = useMemo(() => endV.clone().sub(mid).normalize(), [endV, mid])
  const quat = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction),
    [direction],
  )

  return (
    <group ref={arrow}>
      <mesh geometry={tube}>
        <meshBasicMaterial ref={mat} color={color} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      <mesh position={end} quaternion={quat}>
        <coneGeometry args={[0.105, 0.31, 10]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function Cloud({
  position,
  scale = 1,
  opacity = 0.86,
  warm = false,
  animate = true,
}: {
  position: [number, number, number]
  scale?: number
  opacity?: number
  warm?: boolean
  animate?: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const puffs = useMemo(
    () =>
      [
        [-0.75, 0, 0, 0.45],
        [-0.35, 0.18, 0.04, 0.62],
        [0.12, 0.28, -0.05, 0.72],
        [0.62, 0.1, 0.03, 0.5],
        [0.95, -0.02, 0, 0.35],
        [0.18, -0.08, 0.3, 0.5],
        [-0.25, -0.06, -0.28, 0.48],
      ] as const,
    [],
  )
  useFrame(() => {
    if (group.current && animate) {
      group.current.position.y = position[1] + Math.sin(motionTime.value * 0.45 + position[0]) * 0.05
    }
  })
  return (
    <group ref={group} position={position} scale={scale}>
      {puffs.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={[1.25, 0.9, 1]}>
          <sphereGeometry args={[s, 14, 10]} />
          <meshStandardMaterial
            color={warm ? '#ffd7c5' : '#d8e9f2'}
            emissive={warm ? '#6b1c12' : '#1b4658'}
            emissiveIntensity={warm ? 0.08 : 0.09}
            roughness={0.86}
            transparent
            opacity={opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  )
}

export function RainSystem({
  center,
  area = [6, 6],
  count = 280,
  active = false,
  height = 6,
  floor = 0.25,
  tone = 'cool',
}: {
  center: [number, number, number]
  area?: [number, number]
  count?: number
  active?: boolean
  height?: number
  floor?: number
  tone?: 'cool' | 'warm'
}) {
  const drops = useRef<THREE.InstancedMesh>(null)
  const material = useRef<THREE.MeshBasicMaterial>(null)
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * area[0],
        z: (Math.random() - 0.5) * area[1],
        y: Math.random() * height,
        speed: 4.2 + Math.random() * 3.2,
        len: 0.5 + Math.random() * 0.5,
      })),
    [area, count, height],
  )
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const current = useRef(0)
  const paused = useExperience((s) => s.paused)

  useFrame((_, dt) => {
    current.current = damp(current.current, active ? 1 : 0, 3.5, Math.min(dt, 0.05))
    if (material.current) {
      material.current.opacity = current.current * 0.68
      material.current.color.set(tone === 'warm' ? '#ffd3a3' : '#8ddcff')
    }
    if (!drops.current) return
    drops.current.visible = current.current > 0.025
    if (paused) return
    const step = Math.min(dt, 0.05)
    for (let i = 0; i < count; i += 1) {
      const d = seeds[i]
      d.y -= d.speed * step
      if (d.y < floor - center[1]) {
        d.y = height + Math.random() * 3
        d.x = (Math.random() - 0.5) * area[0]
        d.z = (Math.random() - 0.5) * area[1]
      }
      dummy.position.set(center[0] + d.x, center[1] + d.y, center[2] + d.z)
      dummy.scale.set(1, d.len, 1)
      dummy.updateMatrix()
      drops.current.setMatrixAt(i, dummy.matrix)
    }
    drops.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={drops} args={[undefined, undefined, count]} frustumCulled={false}>
      <cylinderGeometry args={[0.007, 0.011, 0.6, 4]} />
      <meshBasicMaterial
        ref={material}
        color="#8ddcff"
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

export function SceneLabel({
  position,
  children,
  tone = 'cool',
  className = '',
  visible = true,
  onClick,
}: {
  position: [number, number, number]
  children: React.ReactNode
  tone?: 'cool' | 'warm' | 'neutral'
  className?: string
  visible?: boolean
  onClick?: () => void
}) {
  return (
    <Html
      position={position}
      center
      zIndexRange={[22, 0]}
      style={{
        pointerEvents: onClick ? 'auto' : 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity .5s ease',
      }}
      className={`scene-label-wrap ${className}`}
    >
      <button
        type="button"
        className={`scene-label scene-label--${tone}`}
        onClick={onClick}
        tabIndex={onClick ? 0 : -1}
        aria-hidden={!visible}
      >
        <span className="scene-label__dot" />
        {children}
      </button>
    </Html>
  )
}

export function Plaque({
  position,
  rotation,
  width = 4.2,
  height = 0.72,
  lines,
  small,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  lines: [string, string]
  small?: string
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    const ratio = 3
    canvas.width = 1024 * ratio
    canvas.height = Math.round(1024 * ratio * (height / width))
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#6d5738')
    grad.addColorStop(0.38, '#d1b47b')
    grad.addColorStop(0.5, '#f4e1b1')
    grad.addColorStop(0.65, '#ba9a5f')
    grad.addColorStop(1, '#5c492f')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = 'rgba(255,255,255,.4)'
    ctx.lineWidth = 3
    ctx.strokeRect(28, 28, canvas.width - 56, canvas.height - 56)
    ctx.fillStyle = '#201c17'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.font = `600 ${Math.round(canvas.height * 0.25)}px Inter, sans-serif`
    ctx.fillText(lines[0].toUpperCase(), canvas.width / 2, canvas.height * 0.42)
    ctx.font = `500 ${Math.round(canvas.height * 0.15)}px Inter, sans-serif`
    ctx.fillStyle = 'rgba(32,28,23,.72)'
    ctx.fillText(lines[1], canvas.width / 2, canvas.height * 0.67)
    if (small) {
      ctx.font = `500 ${Math.round(canvas.height * 0.1)}px JetBrains Mono, monospace`
      ctx.fillText(small, canvas.width / 2, canvas.height * 0.84)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    return tex
  }, [lines, small, width, height])

  useEffect(() => () => texture?.dispose(), [texture])

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      {texture ? <meshStandardMaterial map={texture} roughness={0.38} metalness={0.36} /> : <meshStandardMaterial color="#b7985b" />}
    </mesh>
  )
}

export function SectionStrip({
  label,
  position,
  color,
}: {
  label: string
  position: [number, number, number]
  color: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.4, 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <Html center transform distanceFactor={14} position={[0, 0.035, 0]}>
        <span className="section-strip">{label}</span>
      </Html>
    </group>
  )
}

export function useTextureCanvas(text: string, color = '#000') {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.clearRect(0, 0, 512, 128)
    ctx.fillStyle = color
    ctx.font = '600 44px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, 256, 64)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [text, color])
  useEffect(() => () => texture?.dispose(), [texture])
  return texture
}

export function LeafGeometry() {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0, 0)
    shape.bezierCurveTo(0.15, 0.12, 0.17, 0.45, 0, 0.68)
    shape.bezierCurveTo(-0.17, 0.45, -0.15, 0.12, 0, 0)
    const geo = new THREE.ShapeGeometry(shape, 8)
    geo.translate(0, -0.2, 0)
    return geo
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}

export function Plant({
  position,
  scale = 1,
  dry = 0,
  variant = 0,
}: {
  position: [number, number, number]
  scale?: number
  dry?: number
  variant?: number
}) {
  const stemColor = dry > 0.5 ? '#8b8062' : '#5b8e5d'
  const leafColor = dry > 0.5 ? '#a39975' : variant % 2 === 0 ? '#5c9f66' : '#4e8d5f'
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.024, 0.034, 0.68, 6]} />
        <meshStandardMaterial color={stemColor} roughness={0.8} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2 + 0.3
        const height = 0.32 + i * 0.07
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.12, height, Math.sin(angle) * 0.12]}
            rotation={[0.15, angle, 0.7 + (i % 2) * 0.18]}
            scale={[0.65 + (i % 3) * 0.1, 0.7 + (i % 2) * 0.14, 0.65]}
            castShadow
          >
            <sphereGeometry args={[0.22, 8, 6]} />
            <meshStandardMaterial color={leafColor} roughness={0.72} side={THREE.DoubleSide} />
          </mesh>
        )
      })}
      <mesh position={[0, 0.64, 0]} castShadow>
        <sphereGeometry args={[0.095, 7, 5]} />
        <meshStandardMaterial color={dry > 0.5 ? '#7b725a' : variant % 2 === 0 ? '#cf5b35' : '#d7a13c'} roughness={0.48} />
      </mesh>
    </group>
  )
}

export function MonoLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`mono ${className}`}>{children}</span>
}

export function ModelTag({ children, color = '#8bdcff' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="model-tag" style={{ borderColor: `${color}55`, color }}>
      <span className="model-tag__dot" style={{ background: color }} />
      {children}
    </span>
  )
}

export { RoundedBox, Billboard }
