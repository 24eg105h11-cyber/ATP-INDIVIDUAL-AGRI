import React, { useEffect, useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm'
import * as THREE from 'three'

export default function VrmModel({ url = '/far.vrm', animationState = 'idle' }) {
  const groupRef = useRef()
  const [vrm, setVrm] = useState(null)
  const [fallbackScene, setFallbackScene] = useState(null)

  useEffect(() => {
    let isMounted = true
    const loader = new GLTFLoader()

    try {
      loader.register((parser) => new VRMLoaderPlugin(parser))
    } catch (e) {
      console.warn('VRMLoaderPlugin registration:', e)
    }

    loader.load(
      url,
      (gltf) => {
        if (!isMounted) return
        const vrmData = gltf.userData.vrm
        if (vrmData) {
          VRMUtils.removeUnnecessaryVertices(gltf.scene)
          VRMUtils.removeUnnecessaryJoints(gltf.scene)
          try {
            VRMUtils.rotateVRM0(vrmData)
          } catch (err) {
            console.info('VRM rotation check:', err)
          }

          // Traverse meshes for shadow and material quality
          vrmData.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              if (child.material) {
                child.material.side = THREE.DoubleSide
              }
            }
          })

          setVrm(vrmData)
        } else if (gltf.scene) {
          // Standard GLTF fallback parser if non-VRM GLTF
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })
          setFallbackScene(gltf.scene)
        }
      },
      undefined,
      (error) => {
        console.error('Error loading VRM model:', error)
      }
    )

    return () => {
      isMounted = false
    }
  }, [url])

  // 60FPS animation loop for bone movement, cursor head tracking, and spring physics
  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime()

    if (vrm) {
      // Update VRM spring bones physics & expressions
      vrm.update(delta)

      // 1. Natural Breathing Motion
      if (vrm.humanoid) {
        const spine = vrm.humanoid.getNormalizedBoneNode('spine')
        if (spine) {
          spine.rotation.x = Math.sin(t * 2.2) * 0.025
        }

        const head = vrm.humanoid.getNormalizedBoneNode('head')
        if (head) {
          const targetRotY = state.pointer.x * 0.35
          const targetRotX = -state.pointer.y * 0.2
          head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetRotY, delta * 5)
          head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetRotX, delta * 5)
        }

        // Arm gestures based on animationState
        const rightUpperArm = vrm.humanoid.getNormalizedBoneNode('rightUpperArm')
        const leftUpperArm = vrm.humanoid.getNormalizedBoneNode('leftUpperArm')

        if (rightUpperArm && leftUpperArm) {
          if (animationState === 'wave' || animationState === 'greeting') {
            rightUpperArm.rotation.z = -1.2 + Math.sin(t * 8) * 0.25
            rightUpperArm.rotation.x = 0.3
          } else if (animationState === 'happy') {
            rightUpperArm.rotation.z = -0.8 + Math.sin(t * 5) * 0.15
            leftUpperArm.rotation.z = 0.8 + Math.cos(t * 5) * 0.15
          } else {
            // Idle arm sway
            rightUpperArm.rotation.z = THREE.MathUtils.lerp(rightUpperArm.rotation.z, -0.2 + Math.sin(t * 1.5) * 0.04, delta * 3)
            leftUpperArm.rotation.z = THREE.MathUtils.lerp(leftUpperArm.rotation.z, 0.2 - Math.sin(t * 1.5) * 0.04, delta * 3)
          }
        }
      }

      // Facial Expression / Blendshape Preset Updates
      if (vrm.expressionManager) {
        if (animationState === 'happy') {
          vrm.expressionManager.setValue('happy', 1.0)
          vrm.expressionManager.setValue('relaxed', 0.5)
        } else if (animationState === 'surprised') {
          vrm.expressionManager.setValue('surprised', 1.0)
        } else if (animationState === 'talk') {
          vrm.expressionManager.setValue('aa', (Math.sin(t * 10) + 1) * 0.4)
        } else {
          vrm.expressionManager.setValue('happy', 0.2)
        }
        vrm.expressionManager.update()
      }
    } else if (groupRef.current) {
      // General float animation if fallback
      groupRef.current.position.y = Math.sin(t * 1.8) * 0.06 - 1.5
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.3, delta * 4)
    }
  })

  if (!vrm && !fallbackScene) {
    return null
  }

  const modelScene = vrm ? vrm.scene : fallbackScene

  return (
    <group ref={groupRef} position={[0, -1.65, 0]} scale={[1.4, 1.4, 1.4]}>
      <primitive object={modelScene} />
    </group>
  )
}
