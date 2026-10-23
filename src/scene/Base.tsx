import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { Plaque } from './primitives'
import { motionTime, useExperience } from '../store/useExperience'

const floorVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const floorFragment = /* glsl */ `
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p);
    float glow = smoothstep(0.5, 0.06, d) * 0.5 + smoothstep(0.3, 0.02, d) * 0.16;
    float ring = smoothstep(0.002, 0.0, abs(d - 0.28)) * 0.14 + smoothstep(0.002, 0.0, abs(d - 0.34)) * 0.08;
    vec3 color = vec3(0.02, 0.08, 0.13) + glow * vec3(0.03, 0.14, 0.19) + ring * vec3(0.18, 0.45, 0.52);
    float alpha = smoothstep(0.5, 0.16, d) * 0.95;
    gl_FragColor = vec4(color, alpha);
  }
`

const terrainVertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`
const terrainFragment = /* glsl */ `
  varying vec3 vWorld;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  void main() {
    float n = noise(vWorld.xz * 0.48) * 0.6 + noise(vWorld.xz * 1.8) * 0.25;
    vec3 dark = vec3(0.033, 0.085, 0.10);
    vec3 light = vec3(0.09, 0.15, 0.145);
    vec3 warm = vec3(0.20, 0.16, 0.105);
    float warmZone = smoothstep(-6.0, 2.0, vWorld.x) * (1.0 - smoothstep(9.0, 15.0, vWorld.x));
    vec3 color = mix(dark, light, n);
    color = mix(color, warm, warmZone * 0.22 * (0.55 + n * 0.45));
    float line = smoothstep(0.025, 0.0, abs(fract((vWorld.x + 16.0) / 4.0) - 0.5));
    color += line * 0.008;
    gl_FragColor = vec4(color, 1.0);
  }
`

function Motes() {
  const count = 120
  const points = useRef<THREE.Points>(null)
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 34
      positions[i * 3 + 1] = Math.random() * 10 - 1
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [])
  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.y = motionTime.value * 0.006
      if (useExperience.getState().paused) return
      const array = points.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < count; i += 1) {
        array[i * 3 + 1] += 0.075 * Math.min(delta, 0.05)
        if (array[i * 3 + 1] > 9) array[i * 3 + 1] = -1
      }
      points.current.geometry.attributes.position.needsUpdate = true
    }
  })
  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        color="#8dd8ef"
        size={0.032}
        transparent
        opacity={0.22}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function GroundDetails() {
  return (
    <group>
      {/* stepping stones */}
      {[
        [-0.3, 2.7, 0.62],
        [1.8, 2.95, 0.5],
        [3.2, 2.65, 0.42],
        [5.6, 2.3, 0.38],
        [7.0, 1.9, 0.32],
      ].map(([x, z, s], i) => (
        <mesh key={i} position={[x, 0.035, z]} rotation={[-Math.PI / 2, 0, i * 0.3]} receiveShadow>
          <circleGeometry args={[s, 8]} />
          <meshStandardMaterial color="#a49376" roughness={0.94} />
        </mesh>
      ))}
      {/* shrubs and stones around the edge */}
      {[
        [-6.9, 2.8, 0.4],
        [-6.5, -2.9, 0.3],
        [15.2, -2.4, 0.45],
        [6.2, -3.4, 0.32],
        [1.1, 4.2, 0.28],
      ].map(([x, z, s], i) => (
        <group key={i} position={[x, 0.1, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.06, 0.66, 6]} />
            <meshStandardMaterial color="#6a4e36" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.58, 0]} scale={[1, 0.7, 1]} castShadow>
            <icosahedronGeometry args={[s, 1]} />
            <meshStandardMaterial color={i % 2 ? '#456d55' : '#537c5c'} roughness={0.88} flatShading />
          </mesh>
        </group>
      ))}
      {/* field connecting walkway */}
      <mesh position={[7.15, 0.03, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.2, 1.4]} />
        <meshStandardMaterial color="#9b8c70" roughness={0.96} />
      </mesh>
      {/* shallow drainage line along the front edge */}
      <mesh position={[0, 0.015, 6.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[29, 0.1]} />
        <meshBasicMaterial color="#3f7180" transparent opacity={0.28} />
      </mesh>
    </group>
  )
}

export default function Base() {
  return (
    <group>
      {/* floating exhibition floor */}
      <mesh position={[0, -1.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[90, 90]} />
        <shaderMaterial vertexShader={floorVertex} fragmentShader={floorFragment} transparent depthWrite={false} />
      </mesh>

      <Motes />

      {/* plinth */}
      <group>
        <mesh position={[0, -0.52, 0]} receiveShadow castShadow>
          <boxGeometry args={[32, 1.0, 16]} />
          <meshStandardMaterial color="#1b1713" roughness={0.62} metalness={0.12} />
        </mesh>
        <mesh position={[0, -0.01, 0]} receiveShadow>
          <boxGeometry args={[31.7, 0.08, 15.7]} />
          <shaderMaterial vertexShader={terrainVertex} fragmentShader={terrainFragment} />
        </mesh>
        {/* brass lip */}
        {[
          [0, 0.025, 7.95, 31.8, 0.035, 0.07],
          [0, 0.025, -7.95, 31.8, 0.035, 0.07],
          [15.9, 0.025, 0, 0.07, 0.035, 15.8],
          [-15.9, 0.025, 0, 0.07, 0.035, 15.8],
        ].map(([x, y, z, sx, sy, sz], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[sx, sy, sz]} />
            <meshStandardMaterial color="#b39a65" metalness={0.72} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, -0.52, 8.005]} receiveShadow>
          <boxGeometry args={[31.8, 0.9, 0.04]} />
          <meshStandardMaterial color="#201b15" roughness={0.52} />
        </mesh>
        <Plaque
          position={[0, -0.47, 8.04]}
          width={7.4}
          height={0.76}
          lines={['Every Drop Has a Story', 'El Niño · Rainwater Harvesting · Drip Irrigation']}
          small="AHMADI BEGUM · CLASS 7B"
        />
      </group>

      <GroundDetails />
      <ContactShadows position={[0, 0.045, 0]} opacity={0.25} scale={34} blur={2.8} far={3.5} resolution={512} color="#000000" />
    </group>
  )
}
