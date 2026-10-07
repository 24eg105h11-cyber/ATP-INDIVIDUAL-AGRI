import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import VrmModel from './VrmModel'

/**
 * Clean 3D Loading Indicator Spinner for VRM Model
 */
function VrmLoadingSpinner() {
  const ringRef = useRef()
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.getElapsedTime() * 3
      ringRef.current.rotation.x = state.clock.getElapsedTime() * 1.5
    }
  })

  return (
    <group ref={ringRef} position={[0, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.5, 0.04, 16, 32]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} wireframe />
      </mesh>
    </group>
  )
}

/**
 * Simple Error Boundary for VRM 3D Model
 */
class VRMErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.warn('VRM Model Loading Notice:', error?.message)
  }

  render() {
    if (this.state.hasError) {
      return <VrmLoadingSpinner />
    }
    return this.props.children
  }
}

/**
 * Main 3D VRM Mascot Component (far.vrm)
 */
export default function FarmerModel({
  customModelPath = '/far.vrm',
  animationState = 'idle'
}) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    const bounceMultiplier = animationState === 'happy' ? 0.12 : 0.04
    const speedMultiplier = animationState === 'happy' ? 4 : 1.6
    groupRef.current.position.y = Math.sin(t * speedMultiplier) * bounceMultiplier

    const targetRotY = state.pointer.x * 0.25
    const targetRotX = -state.pointer.y * 0.1

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 4)
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <VRMErrorBoundary>
        <React.Suspense fallback={<VrmLoadingSpinner />}>
          <VrmModel url={customModelPath} animationState={animationState} />
        </React.Suspense>
      </VRMErrorBoundary>
    </group>
  )
}
