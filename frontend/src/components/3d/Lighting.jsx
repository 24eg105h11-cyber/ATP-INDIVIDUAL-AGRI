import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'

export default function Lighting() {
  const spotLightRef = useRef()
  const rimLightRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (spotLightRef.current) {
      spotLightRef.current.position.x = Math.sin(t * 0.5) * 1.5
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 2 + Math.sin(t * 2) * 0.5
    }
  })

  return (
    <>
      {/* Soft Dark Ambient Base */}
      <ambientLight intensity={0.4} color="#064e3b" />

      {/* Main Directional Key Light */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={1.8}
        color="#f8faf6"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Atmospheric Emerald Spotlight Focused on Character */}
      <spotLight
        ref={spotLightRef}
        position={[0, 5, 3]}
        angle={0.6}
        penumbra={0.8}
        intensity={3.5}
        color="#10b981"
        castShadow
      />

      {/* Amber Backlight / Rim Light */}
      <pointLight
        ref={rimLightRef}
        position={[0, 2, -3]}
        intensity={2.5}
        color="#f59e0b"
        distance={8}
      />

      {/* Secondary Cyan Rim Fill Light */}
      <pointLight position={[-3, 1, 2]} intensity={1.2} color="#06b6d4" distance={6} />

      {/* Soft Ground Contact Shadows */}
      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.7}
        scale={6}
        blur={2.5}
        far={4}
        color="#042719"
      />
    </>
  )
}
