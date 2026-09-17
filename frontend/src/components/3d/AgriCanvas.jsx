import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import FarmerModel from './FarmerModel'
import Lighting from './Lighting'
import Particles from './Particles'

export default function AgriCanvas({ animationState = 'idle' }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className="agri-canvas-container"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicking HTML buttons underneath
        zIndex: 1
      }}
    >
      <Canvas
        camera={{
          position: [0, 0.3, isMobile ? 6.2 : 4.8],
          fov: 45,
          near: 0.1,
          far: 100
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: true
        }}
        dpr={[1, 2]}
        style={{ pointerEvents: 'auto' }}
      >
        {/* Dark Agricultural Atmospheric Fog */}
        <fog attach="fog" args={['#030806', 6, 22]} />

        {/* 3D Lighting Setup */}
        <Lighting />

        {/* Subtle 3D Ambient Particles */}
        <Particles />

        {/* 3D Ari Mascot Model positioned on RIGHT side of hero screen on desktop */}
        <group position={[isMobile ? 0 : 1.35, isMobile ? -0.4 : -0.15, 0]}>
          <FarmerModel animationState={animationState} />
        </group>

        {/* Subtle Constrained OrbitControls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 3}
          maxAzimuthAngle={Math.PI / 5}
          minAzimuthAngle={-Math.PI / 5}
          rotateSpeed={0.4}
        />
      </Canvas>
    </div>
  )
}


