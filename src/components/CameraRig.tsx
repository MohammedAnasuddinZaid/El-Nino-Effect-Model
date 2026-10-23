import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { CHAPTERS } from '../data/chapters'
import { PARTS } from '../data/components'
import { isMotionRunning, motionTime, scrollSignals, useExperience } from '../store/useExperience'

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

type Flight = {
  fromPosition: THREE.Vector3
  fromTarget: THREE.Vector3
  toPosition: THREE.Vector3
  toTarget: THREE.Vector3
  elapsed: number
  duration: number
}

export function CameraRig() {
  const { camera, size } = useThree()
  const controls = useRef<OrbitControlsImpl>(null)
  const explore = useExperience((state) => state.explore)
  const focusPart = useExperience((state) => state.focusPart)
  const reducedMotion = useExperience((state) => state.reducedMotion)
  const paused = useExperience((state) => state.paused)

  const lookTarget = useRef(new THREE.Vector3(...CHAPTERS[0].camera.start.target))
  const flight = useRef<Flight | null>(null)
  const lastViewShift = useRef(0)
  const lastViewShiftY = useRef(0)
  const lastChapter = useRef(-1)
  const drift = useRef(0)

  const desiredPosition = useRef(new THREE.Vector3())
  const desiredTarget = useRef(new THREE.Vector3())
  const scratchA = useRef(new THREE.Vector3())
  const scratchB = useRef(new THREE.Vector3())

  useEffect(() => {
    const perspective = camera as THREE.PerspectiveCamera
    const narrow = size.width < 820
    perspective.fov = narrow ? 43 : 34
    perspective.near = 0.08
    perspective.far = 180
    perspective.updateProjectionMatrix()
    if (explore) perspective.clearViewOffset()
  }, [camera, explore, size.width])

  useEffect(() => {
    if (!focusPart) return
    const part = PARTS[focusPart]
    const toPosition = new THREE.Vector3(...part.focus.position)
    const toTarget = new THREE.Vector3(...part.focus.target)
    if (size.width < 820) {
      toPosition.sub(toTarget).multiplyScalar(1.35).add(toTarget)
    }
    flight.current = {
      fromPosition: camera.position.clone(),
      fromTarget: lookTarget.current.clone(),
      toPosition,
      toTarget,
      elapsed: 0,
      duration: reducedMotion ? 0.01 : 1.45,
    }
    if (controls.current) controls.current.enabled = false
  }, [camera, focusPart, reducedMotion, size.width])

  useEffect(() => {
    if (explore) {
      if (controls.current) {
        controls.current.target.copy(lookTarget.current)
        controls.current.enabled = !flight.current
        if (!flight.current) controls.current.update()
      }
    } else {
      const perspective = camera as THREE.PerspectiveCamera
      perspective.clearViewOffset()
      lastViewShift.current = 0
      lastViewShiftY.current = 0
      if (controls.current) {
        controls.current.enabled = size.width >= 900
        if (controls.current.target) lookTarget.current.copy(controls.current.target)
      }
      flight.current = null
    }
  }, [camera, explore, size.width])

  useEffect(() => {
    const onContextMenu = () => {
      if (useExperience.getState().explore) useExperience.getState().toggleExplore()
    }
    window.addEventListener('contextmenu', onContextMenu)
    return () => window.removeEventListener('contextmenu', onContextMenu)
  }, [])

  useEffect(() => {
    if (!import.meta.env.DEV) return
    ;(window as unknown as { __exhibitCamera?: unknown }).__exhibitCamera = {
      camera,
      getPose: () => ({
        position: camera.position.toArray(),
        target: lookTarget.current.toArray(),
      }),
      getSignals: () => ({
        chapter: scrollSignals.chapter,
        local: scrollSignals.local,
      }),
      snap: (index = scrollSignals.chapter, local = scrollSignals.local) => {
        const chapter = CHAPTERS[Math.max(0, Math.min(CHAPTERS.length - 1, index))]
        const t = Math.max(0, Math.min(1, local))
        camera.position.set(
          THREE.MathUtils.lerp(chapter.camera.start.position[0], chapter.camera.end.position[0], t),
          THREE.MathUtils.lerp(chapter.camera.start.position[1], chapter.camera.end.position[1], t),
          THREE.MathUtils.lerp(chapter.camera.start.position[2], chapter.camera.end.position[2], t),
        )
        lookTarget.current.set(
          THREE.MathUtils.lerp(chapter.camera.start.target[0], chapter.camera.end.target[0], t),
          THREE.MathUtils.lerp(chapter.camera.start.target[1], chapter.camera.end.target[1], t),
          THREE.MathUtils.lerp(chapter.camera.start.target[2], chapter.camera.end.target[2], t),
        )
        camera.lookAt(lookTarget.current)
      },
    }
    return () => {
      delete (window as unknown as { __exhibitCamera?: unknown }).__exhibitCamera
    }
  }, [camera])

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)

    if (explore) {
      const control = controls.current
      if (flight.current) {
        const current = flight.current
        current.elapsed += delta
        const progress = Math.min(1, current.elapsed / current.duration)
        const eased = easeInOutCubic(progress)
        camera.position.lerpVectors(current.fromPosition, current.toPosition, eased)
        lookTarget.current.lerpVectors(current.fromTarget, current.toTarget, eased)
        camera.lookAt(lookTarget.current)
        if (control) {
          control.enabled = false
          control.target.copy(lookTarget.current)
        }
        if (progress >= 1) {
          if (control) {
            control.target.copy(current.toTarget)
            control.enabled = true
            control.update()
          }
          flight.current = null
        }
      } else if (control) {
        control.enabled = true
        control.update()
      }
      return
    }

    const chapterIndex = Math.min(CHAPTERS.length - 1, scrollSignals.chapter)
    const chapter = CHAPTERS[chapterIndex]
    const local = Math.min(1, Math.max(0, scrollSignals.local))
    const narrowFactor = size.width < 820 ? 1.2 : 1
    const startPosition = scratchA.current.set(...chapter.camera.start.position)
    const endPosition = scratchB.current.set(...chapter.camera.end.position)
    desiredPosition.current.lerpVectors(startPosition, endPosition, local)
    desiredTarget.current.set(
      THREE.MathUtils.lerp(chapter.camera.start.target[0], chapter.camera.end.target[0], local),
      THREE.MathUtils.lerp(chapter.camera.start.target[1], chapter.camera.end.target[1], local),
      THREE.MathUtils.lerp(chapter.camera.start.target[2], chapter.camera.end.target[2], local),
    )

    if (narrowFactor !== 1) {
      desiredPosition.current.sub(desiredTarget.current).multiplyScalar(narrowFactor).add(desiredTarget.current)
    }

    const canDrift = isMotionRunning() && !reducedMotion
    if (canDrift) {
      drift.current += delta
      const breath = motionTime.value * 0.16
      desiredPosition.current.x += Math.sin(breath + chapterIndex * 0.7) * 0.1
      desiredPosition.current.y += Math.cos(breath * 0.84 + 0.6) * 0.065
      desiredPosition.current.z += Math.sin(breath * 0.67 + 1.2) * 0.07
      desiredTarget.current.x += Math.sin(breath * 0.8 + 0.4) * 0.035
      desiredTarget.current.y += Math.cos(breath * 0.65) * 0.02
    }

    const lambda = reducedMotion ? 14 : 3.1
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPosition.current.x, lambda, delta)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPosition.current.y, lambda, delta)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPosition.current.z, lambda, delta)
    lookTarget.current.x = THREE.MathUtils.damp(lookTarget.current.x, desiredTarget.current.x, lambda, delta)
    lookTarget.current.y = THREE.MathUtils.damp(lookTarget.current.y, desiredTarget.current.y, lambda, delta)
    lookTarget.current.z = THREE.MathUtils.damp(lookTarget.current.z, desiredTarget.current.z, lambda, delta)
    camera.lookAt(lookTarget.current)

    const perspective = camera as THREE.PerspectiveCamera
    let desiredShift = 0
    let desiredShiftY = 0
    if (size.width >= 900) {
      // Keep the diorama just right of the editorial text column.
      desiredShift = -size.width * 0.06
      desiredShiftY = size.height * 0.02
    } else {
      // On phones the story sits below the model: lift the diorama into the clear upper view.
      desiredShiftY = size.height * 0.18
    }
    lastViewShift.current = THREE.MathUtils.damp(lastViewShift.current, desiredShift, 3, delta)
    lastViewShiftY.current = THREE.MathUtils.damp(lastViewShiftY.current, desiredShiftY, 3, delta)
    if (Math.abs(lastViewShift.current) > 0.25 || Math.abs(lastViewShiftY.current) > 0.25) {
      perspective.setViewOffset(
        size.width,
        size.height,
        lastViewShift.current,
        lastViewShiftY.current,
        size.width,
        size.height,
      )
    } else if (lastViewShift.current !== 0 || lastViewShiftY.current !== 0) {
      lastViewShift.current = 0
      lastViewShiftY.current = 0
      perspective.clearViewOffset()
    }

    if (lastChapter.current !== chapterIndex) {
      lastChapter.current = chapterIndex
      // Camera transitions are damped; the chapter change only refreshes the pose.
      if (useExperience.getState().paused && useExperience.getState().activeChapter !== chapterIndex) {
        useExperience.getState().setActiveChapter(chapterIndex)
      }
    }
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enabled={explore || size.width >= 900}
      enableDamping
      dampingFactor={0.075}
      rotateSpeed={0.55}
      zoomSpeed={0.75}
      panSpeed={0.5}
      enablePan={false}
      enableZoom={explore}
      minDistance={2.4}
      maxDistance={48}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.475}
      target={[0, 1.4, 0]}
      onStart={() => {
        if (size.width < 900) return
        const state = useExperience.getState()
        if (!state.explore) {
          state.setExplore(true)
          state.setAutoTour(false)
          state.setPaused(false)
        }
      }}
    />
  )
}
