import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Volume2, VolumeX, MessageSquare, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react'
import VrmModel from '../3d/VrmModel'

export default function FarmerGuideWidget({ guideState = 'idle', customMessage = '', onActionClick }) {
  const [minimized, setMinimized] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [dialogue, setDialogue] = useState("Let's check your shipment.")
  const [animState, setAnimState] = useState('idle')

  // Dialogue matrix based on shipment workflow states
  useEffect(() => {
    if (customMessage) {
      setDialogue(customMessage)
    } else {
      switch (guideState) {
        case 'shipment_view':
          setDialogue("Welcome to your shipment portal! Let's check your shipments.")
          setAnimState('greeting')
          break
        case 'scan_qr':
          setDialogue("Point your camera at the shipment QR code to verify cargo identity!")
          setAnimState('wave')
          break
        case 'verifying':
          setDialogue("Validating QR token with backend ledger...")
          setAnimState('talk')
          break
        case 'verify_success':
          setDialogue("Great! I found your shipment.")
          setAnimState('happy')
          break
        case 'in_transit':
          setDialogue("Your shipment is currently in transit across the supply route.")
          setAnimState('talk')
          break
        case 'delivered':
          setDialogue("Hooray! Your shipment has been delivered successfully!")
          setAnimState('happy')
          break
        case 'create_shipment':
          setDialogue("Fill in the harvest details to generate a tamper-proof QR code.")
          setAnimState('greeting')
          break
        default:
          setDialogue("Hi! I'm your AgriTrade logistics assistant.")
          setAnimState('idle')
          break
      }
    }

    if (voiceEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const msgText = customMessage || dialogue
      const utterance = new SpeechSynthesisUtterance(msgText)
      utterance.rate = 1.05
      utterance.pitch = 1.1
      window.speechSynthesis.speak(utterance)
    }
  }, [guideState, customMessage, voiceEnabled])

  return (
    <div
      className="farmer-guide-container"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 990,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.6rem',
        pointerEvents: 'none'
      }}
    >
      {/* Speech Bubble */}
      {!minimized && (
        <div
          className="farmer-speech-bubble"
          style={{
            pointerEvents: 'auto',
            background: 'rgba(6, 26, 18, 0.92)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '16px 16px 2px 16px',
            padding: '0.85rem 1.1rem',
            maxWidth: '300px',
            color: '#ecfdf5',
            fontSize: '0.88rem',
            lineHeight: '1.45',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.2)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeInUp 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={13} /> Ari - AgriTrade Guide
            </span>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? 'Mute Voice' : 'Enable Speech Voice'}
                style={{
                  background: 'none',
                  border: 'none',
                  color: voiceEnabled ? '#34d399' : '#6b7280',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                {voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
              </button>
              <button
                type="button"
                onClick={() => setMinimized(true)}
                title="Minimize Guide"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <Minimize2 size={15} />
              </button>
            </div>
          </div>
          <p style={{ margin: 0, fontWeight: 500 }}>"{dialogue}"</p>
        </div>
      )}

      {/* 3D Canvas Box + Control Capsule */}
      <div
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          width: minimized ? '60px' : '160px',
          height: minimized ? '60px' : '200px',
          borderRadius: minimized ? '50%' : '18px',
          overflow: 'hidden',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(6, 26, 18, 0.9) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {minimized ? (
          <button
            type="button"
            onClick={() => setMinimized(false)}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title="Expand VRoid Farmer Guide"
          >
            <Maximize2 size={24} />
          </button>
        ) : (
          <Canvas camera={{ position: [0, 0, 2.5], fov: 42 }}>
            <ambientLight intensity={1.2} />
            <directionalLight position={[2, 3, 2]} intensity={1.5} />
            <pointLight position={[-2, 1, -1]} intensity={0.5} color="#34d399" />
            <VrmModel url="/models/agritrade-farmer.vrm" animationState={animState} />
          </Canvas>
        )}
      </div>
    </div>
  )
}
