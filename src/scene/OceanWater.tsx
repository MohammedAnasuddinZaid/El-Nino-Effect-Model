import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { motionTime, useExperience } from '../store/useExperience'

const volumeVertex = /* glsl */ `
  varying vec3 vLocal;
  varying vec3 vWorld;
  void main() {
    vLocal = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorld = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`

const volumeFragment = /* glsl */ `
  uniform float uTime;
  uniform float uMode;
  varying vec3 vLocal;
  varying vec3 vWorld;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  void main() {
    float x = vLocal.x + 0.5;
    float y = vLocal.y + 0.5;
    float z = vLocal.z + 0.5;

    float warmCenter = mix(0.22, 0.77, uMode);
    float warmWidth = mix(0.28, 0.46, uMode);
    float warmPool = 1.0 - smoothstep(0.02, warmWidth, abs(x - warmCenter));
    float depthFade = smoothstep(0.05, 0.82, y);
    float surfaceOnly = mix(0.22, 0.92, smoothstep(0.16, 0.72, y));
    float warm = warmPool * surfaceOnly;

    vec3 deep = vec3(0.012, 0.086, 0.145);
    vec3 mid = vec3(0.025, 0.237, 0.325);
    vec3 shallow = vec3(0.075, 0.46, 0.62);
    vec3 base = mix(deep, mid, smoothstep(0.0, 0.6, y));
    base = mix(base, shallow, smoothstep(0.48, 0.98, y) * 0.5);

    vec3 warmColor = mix(vec3(0.76, 0.12, 0.06), vec3(1.0, 0.52, 0.25), smoothstep(0.35, 0.95, y));
    base = mix(base, warmColor, warm * mix(0.7, 0.92, uMode));

    float thermoclineY = 0.47 + sin(x * 12.0 + uTime * 0.5) * 0.012 + (noise(vec2(x * 4.0, z * 3.0)) - 0.5) * 0.018;
    float thermocline = smoothstep(0.025, 0.0, abs(y - thermoclineY));
    base += vec3(0.04, 0.17, 0.19) * thermocline * 0.5;

    float wobble = sin(x * 38.0 + uTime * 1.1) * 0.5 + 0.5;
    float line = smoothstep(0.47, 0.5, fract(y * 18.0 - uTime * 0.08 + wobble * 0.06));
    base += line * 0.008;

    float edge = smoothstep(0.0, 0.08, min(min(x, 1.0 - x), min(z, 1.0 - z)));
    float alpha = 0.86 * mix(1.0, edge, 0.35);
    gl_FragColor = vec4(base, alpha);
  }
`

export function OceanVolume({
  visible = true,
  mode,
}: {
  visible?: boolean
  mode: 'normal' | 'elnino'
}) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const currentMode = useRef(mode === 'elnino' ? 1 : 0)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMode: { value: 0 },
    }),
    [],
  )

  useFrame((_, dt) => {
    currentMode.current = THREE.MathUtils.damp(
      currentMode.current,
      mode === 'elnino' ? 1 : 0,
      3,
      Math.min(dt, 0.05),
    )
    if (material.current) {
      const u = material.current.uniforms
      u.uTime.value = motionTime.value
      u.uMode.value = currentMode.current
    }
  })

  return (
    <mesh position={[0, 1.38, 0]} scale={[7.35, 1.85, 3.72]} visible={visible}>
      <boxGeometry args={[1, 1, 1, 16, 12, 8]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={volumeVertex}
        fragmentShader={volumeFragment}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

const surfaceVertex = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 25.0 + uTime * 1.3) * 0.012
               + cos(pos.y * 30.0 - uTime * 1.0) * 0.008
               + sin((pos.x + pos.y) * 41.0 + uTime * 0.7) * 0.005;
    pos.z += wave;
    vWave = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const surfaceFragment = /* glsl */ `
  uniform float uTime;
  uniform float uMode;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    vec3 cool = vec3(0.22, 0.67, 0.82);
    vec3 warm = vec3(1.0, 0.53, 0.29);
    float warmBand = smoothstep(0.25, 0.85, vUv.x) * uMode;
    float normalBand = (1.0 - smoothstep(0.15, 0.7, vUv.x)) * (1.0 - uMode);
    vec3 color = mix(cool, warm, clamp(warmBand + normalBand * 0.55, 0.0, 1.0));
    float shimmer = pow(max(0.0, sin(vUv.x * 160.0 + uTime * 2.0) * cos(vUv.y * 110.0 - uTime)), 10.0);
    color += vec3(shimmer * 0.35);
    float highlight = smoothstep(0.05, 0.0, abs(vWave));
    color += highlight * 0.12;
    gl_FragColor = vec4(color, 0.72);
  }
`

export function OceanSurface({ mode }: { mode: 'normal' | 'elnino' }) {
  const material = useRef<THREE.ShaderMaterial>(null)
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uMode: { value: 0 } }), [])
  const current = useRef(mode === 'elnino' ? 1 : 0)

  useFrame((_, dt) => {
    current.current = THREE.MathUtils.damp(current.current, mode === 'elnino' ? 1 : 0, 3, Math.min(dt, 0.05))
    if (material.current) {
      material.current.uniforms.uTime.value = motionTime.value
      material.current.uniforms.uMode.value = current.current
    }
  })

  return (
    <mesh position={[0, 2.31, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[7.35, 3.72, 72, 42]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={surfaceVertex}
        fragmentShader={surfaceFragment}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
