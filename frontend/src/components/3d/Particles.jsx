import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Custom Floating Agricultural Data Spores
 */
function FloatingSpores({ count = 80 }) {
  const pointsRef = useRef()

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sca = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
      sca[i] = Math.random() * 0.08 + 0.02
    }
    return [pos, sca]
  }, [count])

  useFrame((state) => {
    if (!pointsRef.current) return
    const t = state.clock.getElapsedTime()
    pointsRef.current.rotation.y = t * 0.03
    pointsRef.current.position.y = Math.sin(t * 0.5) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color="#34d399"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function Particles() {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Large Ambient Green Sparkles */}
      <Sparkles
        count={120}
        scale={[12, 10, 8]}
        size={3}
        speed={0.4}
        color="#10b981"
        opacity={0.65}
      />

      {/* 2. Golden Seed Pollen Sparkles */}
      <Sparkles
        count={50}
        scale={[10, 8, 6]}
        size={4}
        speed={0.3}
        color="#f59e0b"
        opacity={0.5}
      />

      {/* 3. Custom Floating Spores */}
      <FloatingSpores count={60} />
    </group>
  )
}
