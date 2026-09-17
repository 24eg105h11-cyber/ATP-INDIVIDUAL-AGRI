import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { ShieldCheck, ShoppingCart, Truck, FileCode2, HandCoins } from 'lucide-react'

const FEATURES = [
  {
    id: 'quality',
    title: 'Quality',
    subtitle: '99.4% AI Grade Score',
    icon: ShieldCheck,
    position: [-2.6, 1.2, 0.5],
    color: '#10b981'
  },
  {
    id: 'procurement',
    title: 'Procurement',
    subtitle: 'Direct Farmer Contracts',
    icon: ShoppingCart,
    position: [2.6, 1.4, 0.2],
    color: '#06b6d4'
  },
  {
    id: 'logistics',
    title: 'Logistics',
    subtitle: 'IoT Cold-Chain Fleet',
    icon: Truck,
    position: [-2.8, -0.6, 0.8],
    color: '#f59e0b'
  },
  {
    id: 'traceability',
    title: 'Traceability',
    subtitle: 'Immutable Provenance',
    icon: FileCode2,
    position: [2.7, -0.5, 0.6],
    color: '#8b5cf6'
  },
  {
    id: 'settlements',
    title: 'Settlements',
    subtitle: 'Instant Smart Payouts',
    icon: HandCoins,
    position: [0, -1.8, 1.2],
    color: '#ec4899'
  }
]

export default function FeatureNodes() {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    groupRef.current.position.y = Math.sin(t * 1.2) * 0.05
  })

  return (
    <group ref={groupRef}>
      {FEATURES.map((feat) => {
        const IconComponent = feat.icon
        return (
          <group key={feat.id} position={feat.position}>
            {/* 3D Glowing Node Marker */}
            <mesh>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial
                color={feat.color}
                emissive={feat.color}
                emissiveIntensity={2}
              />
            </mesh>

            {/* Orbiting Ring */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <torusGeometry args={[0.12, 0.006, 16, 32]} />
              <meshStandardMaterial color={feat.color} opacity={0.6} transparent />
            </mesh>

            {/* Html Glass Badge Anchor */}
            <Html distanceFactor={10} zIndexRange={[100, 0]} center>
              <div
                className="3d-feature-badge"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.5rem 0.9rem',
                  background: 'rgba(6, 26, 18, 0.75)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${feat.color}55`,
                  boxShadow: `0 8px 24px -6px ${feat.color}33`,
                  borderRadius: '12px',
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  userSelect: 'none'
                }}
              >
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    background: `${feat.color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: feat.color,
                    border: `1px solid ${feat.color}44`
                  }}
                >
                  <IconComponent size={16} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.02em' }}>
                    {feat.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: 'rgba(255, 255, 255, 0.65)' }}>
                    {feat.subtitle}
                  </span>
                </div>
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}
