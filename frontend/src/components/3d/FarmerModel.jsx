import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Error Boundary for catching 3D Model loading errors
 */
class GLTFErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.info('Custom GLB mascot model missing. Rendering original 3D Ari mascot.', error?.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

/**
 * GLTF/GLB Model Loader Component
 */
function GLTFModel({ url, animationState = 'idle' }) {
  const group = useRef()
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    }
  }, [scene])

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const actionName = Object.keys(actions).find((key) =>
        key.toLowerCase().includes(animationState.toLowerCase())
      ) || Object.keys(actions)[0]

      if (actions[actionName]) {
        Object.values(actions).forEach((action) => action.fadeOut(0.3))
        actions[actionName].reset().fadeIn(0.3).play()
      }
    }
  }, [animationState, actions])

  return <primitive ref={group} object={scene} scale={[1.8, 1.8, 1.8]} position={[0, -1.8, 0]} />
}

/**
 * Original Procedural 3D Mascot: ARI (AgriTrade Assistant)
 * Young, friendly male agritech assistant with tousled brown hair, warm smiling expression,
 * green & cream hoodie, dark cargo pants, outdoor boots, tablet & presentation gesture.
 */
function ProceduralAri({ animationState = 'idle' }) {
  const headGroupRef = useRef()
  const leftArmGroupRef = useRef()
  const rightArmGroupRef = useRef()
  const chestRef = useRef()
  const tabletGlowRef = useRef()
  const thinkingSparkleRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // 1. Natural Breathing & Chest Oscillation
    if (chestRef.current) {
      const breath = Math.sin(t * 2.2)
      chestRef.current.scale.y = 1 + breath * 0.012
    }

    // 2. Head Subtle Idle Movements
    if (headGroupRef.current) {
      headGroupRef.current.rotation.y = Math.sin(t * 0.8) * 0.05
      headGroupRef.current.rotation.z = Math.cos(t * 0.6) * 0.02
    }

    // 3. Tablet Light Pulse
    if (tabletGlowRef.current) {
      tabletGlowRef.current.intensity = 1.6 + Math.sin(t * 3.5) * 0.5
    }

    // 4. Animation State Driven Rig Controls
    if (leftArmGroupRef.current) {
      switch (animationState) {
        case 'wave': {
          const waveAngle = Math.sin(t * 8) * 0.35
          leftArmGroupRef.current.rotation.x = -1.2
          leftArmGroupRef.current.rotation.z = -0.4 + waveAngle
          leftArmGroupRef.current.rotation.y = 0.3
          break
        }
        case 'point': {
          leftArmGroupRef.current.rotation.x = -1.35
          leftArmGroupRef.current.rotation.z = -0.95
          leftArmGroupRef.current.rotation.y = -0.3
          break
        }
        case 'happy': {
          const bounce = Math.sin(t * 10) * 0.15
          leftArmGroupRef.current.rotation.x = -1.3 + bounce
          leftArmGroupRef.current.rotation.z = -0.6
          break
        }
        case 'thinking': {
          leftArmGroupRef.current.rotation.x = -1.55
          leftArmGroupRef.current.rotation.z = -0.25
          leftArmGroupRef.current.rotation.y = 0.7
          if (headGroupRef.current) {
            headGroupRef.current.rotation.z = 0.12
          }
          if (thinkingSparkleRef.current) {
            thinkingSparkleRef.current.rotation.y = t * 2
          }
          break
        }
        case 'talk': {
          const talkGesture = Math.sin(t * 5) * 0.1
          leftArmGroupRef.current.rotation.x = -0.75 + talkGesture
          leftArmGroupRef.current.rotation.z = -0.4 + talkGesture * 0.5
          leftArmGroupRef.current.rotation.y = 0.25
          if (headGroupRef.current) {
            headGroupRef.current.rotation.y = Math.sin(t * 4) * 0.06
          }
          break
        }
        case 'idle':
        default: {
          const subtleMotion = Math.sin(t * 1.5) * 0.04
          leftArmGroupRef.current.rotation.x = -0.4 + subtleMotion
          leftArmGroupRef.current.rotation.z = -0.35 + subtleMotion * 0.5
          leftArmGroupRef.current.rotation.y = 0.2
          break
        }
      }
    }
  })

  return (
    <group position={[0, -0.65, 0]}>
      {/* --- TOUSLED NATURAL BROWN HAIR --- */}
      <group position={[0, 1.35, 0]}>
        {/* Main Hair Volume */}
        <mesh position={[0, 0.32, -0.04]} castShadow>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color="#4a2e1b" roughness={0.7} />
        </mesh>
        {/* Tousled Front Bangs / Locks */}
        <mesh position={[-0.14, 0.4, 0.22]} rotation={[0.2, 0.2, -0.4]} castShadow>
          <coneGeometry args={[0.14, 0.32, 16]} />
          <meshStandardMaterial color="#3b2314" roughness={0.6} />
        </mesh>
        <mesh position={[0.08, 0.42, 0.24]} rotation={[0.15, -0.3, 0.3]} castShadow>
          <coneGeometry args={[0.16, 0.35, 16]} />
          <meshStandardMaterial color="#543520" roughness={0.6} />
        </mesh>
        <mesh position={[-0.04, 0.46, 0.18]} rotation={[0.3, 0, 0]} castShadow>
          <coneGeometry args={[0.13, 0.28, 16]} />
          <meshStandardMaterial color="#4a2e1b" roughness={0.6} />
        </mesh>
        <mesh position={[0.2, 0.36, 0.18]} rotation={[0.1, -0.4, 0.4]} castShadow>
          <coneGeometry args={[0.13, 0.3, 16]} />
          <meshStandardMaterial color="#3b2314" roughness={0.6} />
        </mesh>
      </group>

      {/* --- HEAD & FRIENDLY FACIAL EXPRESSION --- */}
      <group ref={headGroupRef} position={[0, 1.25, 0]}>
        {/* Friendly Face Base */}
        <mesh castShadow>
          <sphereGeometry args={[0.39, 32, 32]} />
          <meshStandardMaterial color="#f3c498" roughness={0.5} />
        </mesh>

        {/* Rosy Cheeks */}
        <mesh position={[-0.22, -0.05, 0.31]}>
          <sphereGeometry args={[0.065, 16, 16]} scale={[1, 0.6, 0.4]} />
          <meshStandardMaterial color="#f4a261" roughness={0.8} opacity={0.6} transparent />
        </mesh>
        <mesh position={[0.22, -0.05, 0.31]}>
          <sphereGeometry args={[0.065, 16, 16]} scale={[1, 0.6, 0.4]} />
          <meshStandardMaterial color="#f4a261" roughness={0.8} opacity={0.6} transparent />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.4, 0.02, 0]} rotation={[0, 0, -0.15]}>
          <sphereGeometry args={[0.085, 16, 16]} scale={[0.6, 1.2, 0.8]} />
          <meshStandardMaterial color="#ebb485" />
        </mesh>
        <mesh position={[0.4, 0.02, 0]} rotation={[0, 0, 0.15]}>
          <sphereGeometry args={[0.085, 16, 16]} scale={[0.6, 1.2, 0.8]} />
          <meshStandardMaterial color="#ebb485" />
        </mesh>

        {/* Friendly Cute Eyes */}
        <group position={[0, 0.06, 0.33]}>
          {/* Left Eye Sclera */}
          <mesh position={[-0.13, 0, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} scale={[1, 0.9, 0.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          {/* Left Iris */}
          <mesh position={[-0.13, 0, 0.032]}>
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial color="#16a34a" roughness={0.2} />
          </mesh>
          {/* Left Pupil */}
          <mesh position={[-0.13, 0, 0.055]}>
            <sphereGeometry args={[0.024, 16, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Left Eye Sparkle Reflection */}
          <mesh position={[-0.11, 0.02, 0.07]}>
            <sphereGeometry args={[0.009, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
          </mesh>

          {/* Right Eye Sclera */}
          <mesh position={[0.13, 0, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} scale={[1, 0.9, 0.5]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
          {/* Right Iris */}
          <mesh position={[0.13, 0, 0.032]}>
            <sphereGeometry args={[0.042, 16, 16]} />
            <meshStandardMaterial color="#16a34a" roughness={0.2} />
          </mesh>
          {/* Right Pupil */}
          <mesh position={[0.13, 0, 0.055]}>
            <sphereGeometry args={[0.024, 16, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* Right Eye Sparkle Reflection */}
          <mesh position={[0.15, 0.02, 0.07]}>
            <sphereGeometry args={[0.009, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
          </mesh>

          {/* Friendly Eyebrows */}
          <mesh position={[-0.13, 0.085, 0]} rotation={[0, 0, 0.08]}>
            <boxGeometry args={[0.13, 0.022, 0.035]} />
            <meshStandardMaterial color="#3b2314" />
          </mesh>
          <mesh position={[0.13, 0.085, 0]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[0.13, 0.022, 0.035]} />
            <meshStandardMaterial color="#3b2314" />
          </mesh>
        </group>

        {/* WARMLY CURVED SMILE (Facing upwards ∪) */}
        <mesh position={[0, -0.12, 0.35]} rotation={[-0.2, 0, Math.PI]}>
          <torusGeometry args={[0.075, 0.014, 16, 16, Math.PI * 0.8]} />
          <meshStandardMaterial color="#8a4b38" />
        </mesh>
      </group>

      {/* --- NECK --- */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.16, 0.18, 16]} />
        <meshStandardMaterial color="#f3c498" />
      </mesh>

      {/* --- GREEN & CREAM AGRITRADE HOODIE --- */}
      <group ref={chestRef} position={[0, 0.15, 0]}>
        {/* Main Green Hoodie Torso */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.44, 0.5, 0.8, 32]} />
          <meshStandardMaterial color="#22c55e" roughness={0.4} metalness={0.1} />
        </mesh>

        {/* Cream Front Inner Panel */}
        <mesh position={[0, 0.22, 0.2]} castShadow>
          <boxGeometry args={[0.28, 0.78, 0.09]} />
          <meshStandardMaterial color="#f5f5dc" roughness={0.6} />
        </mesh>

        {/* Cream Drawstrings */}
        <mesh position={[-0.06, 0.25, 0.26]}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.06, 0.25, 0.26]}>
          <cylinderGeometry args={[0.008, 0.008, 0.3, 8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Hood Collar */}
        <mesh position={[0, 0.6, -0.14]} rotation={[-0.3, 0, 0]} castShadow>
          <torusGeometry args={[0.26, 0.07, 16, 32, Math.PI * 1.2]} />
          <meshStandardMaterial color="#f5f5dc" roughness={0.6} />
        </mesh>

        {/* AgriTrade Leaf Branding Emblem on Left Chest */}
        <group position={[-0.16, 0.42, 0.26]} rotation={[0, 0.2, 0]}>
          <mesh>
            <cylinderGeometry args={[0.06, 0.06, 0.015, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#15803d" emissive="#22c55e" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <coneGeometry args={[0.03, 0.065, 16]} rotation={[0, 0, 0.5]} />
            <meshStandardMaterial color="#84cc16" emissive="#84cc16" emissiveIntensity={0.8} />
          </mesh>
        </group>
      </group>

      {/* --- RIGHT ARM HOLDING TABLET --- */}
      <group ref={rightArmGroupRef} position={[0.4, 0.55, 0]}>
        {/* Right Sleeve */}
        <mesh position={[0.08, -0.22, 0.1]} rotation={[0.45, -0.2, -0.3]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.52, 16]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0.08, -0.42, 0.3]} rotation={[1.1, -0.1, -0.2]} castShadow>
          <cylinderGeometry args={[0.1, 0.08, 0.48, 16]} />
          <meshStandardMaterial color="#f5f5dc" />
        </mesh>

        {/* Right Hand */}
        <mesh position={[0.06, -0.55, 0.5]}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshStandardMaterial color="#f3c498" />
        </mesh>

        {/* AgriTrade Smart Tablet */}
        <group position={[0.06, -0.5, 0.6]} rotation={[-0.45, 0.15, -0.1]}>
          <mesh castShadow>
            <boxGeometry args={[0.52, 0.36, 0.03]} />
            <meshStandardMaterial color="#18181b" metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[0.46, 0.3]} />
            <meshStandardMaterial color="#064e3b" emissive="#22c55e" emissiveIntensity={1.3} />
          </mesh>
          <pointLight ref={tabletGlowRef} color="#22c55e" distance={2} decay={2} position={[0, 0.1, 0.15]} />
        </group>
      </group>

      {/* --- LEFT ARM (WELCOMING / PRESENTATION GESTURE) --- */}
      <group ref={leftArmGroupRef} position={[-0.4, 0.55, 0]}>
        <mesh position={[-0.08, -0.2, 0.08]} rotation={[0.2, 0.1, 0.3]} castShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.5, 16]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
        <mesh position={[-0.16, -0.4, 0.2]} rotation={[0.5, 0.2, 0.4]} castShadow>
          <cylinderGeometry args={[0.1, 0.08, 0.45, 16]} />
          <meshStandardMaterial color="#f5f5dc" />
        </mesh>
        <mesh position={[-0.22, -0.54, 0.32]} rotation={[0.3, 0.4, 0]}>
          <boxGeometry args={[0.12, 0.14, 0.045]} />
          <meshStandardMaterial color="#f3c498" />
        </mesh>
      </group>

      {/* --- DARK CARGO PANTS --- */}
      <group position={[0, -0.68, 0]}>
        <mesh position={[-0.2, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.17, 0.7, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.7} />
        </mesh>
        <mesh position={[-0.35, 0.08, 0.02]}>
          <boxGeometry args={[0.07, 0.22, 0.16]} />
          <meshStandardMaterial color="#27272a" roughness={0.8} />
        </mesh>

        <mesh position={[0.2, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.17, 0.7, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.7} />
        </mesh>
        <mesh position={[0.35, 0.08, 0.02]}>
          <boxGeometry args={[0.07, 0.22, 0.16]} />
          <meshStandardMaterial color="#27272a" roughness={0.8} />
        </mesh>
      </group>

      {/* --- BROWN OUTDOOR BOOTS --- */}
      <group position={[0, -1.06, 0]}>
        <mesh position={[-0.2, -0.05, 0.06]} castShadow>
          <boxGeometry args={[0.23, 0.2, 0.42]} />
          <meshStandardMaterial color="#523d29" roughness={0.85} />
        </mesh>
        <mesh position={[0.2, -0.05, 0.06]} castShadow>
          <boxGeometry args={[0.23, 0.2, 0.42]} />
          <meshStandardMaterial color="#523d29" roughness={0.85} />
        </mesh>
      </group>

      {/* --- THINKING SPARKLE --- */}
      {animationState === 'thinking' && (
        <group ref={thinkingSparkleRef} position={[-0.45, 1.85, 0]}>
          <mesh position={[0, 0, 0]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial color="#84cc16" emissive="#84cc16" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.2, 0.2, 0.1]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.8} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/**
 * Main 3D Ari Mascot Component
 */
export default function FarmerModel({
  customModelPath = '/models/agritrade-mascot.glb',
  animationState = 'idle'
}) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()

    const bounceMultiplier = animationState === 'happy' ? 0.18 : 0.05
    const speedMultiplier = animationState === 'happy' ? 4 : 1.6
    groupRef.current.position.y = Math.sin(t * speedMultiplier) * bounceMultiplier

    const targetRotY = state.pointer.x * 0.3
    const targetRotX = -state.pointer.y * 0.1

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, delta * 4)
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <GLTFErrorBoundary fallback={<ProceduralAri animationState={animationState} />}>
        <React.Suspense fallback={<ProceduralAri animationState={animationState} />}>
          <GLTFModel url={customModelPath} animationState={animationState} />
        </React.Suspense>
      </GLTFErrorBoundary>
    </group>
  )
}


