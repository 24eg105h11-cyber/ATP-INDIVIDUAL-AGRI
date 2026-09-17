import React, { useState } from 'react'
import Ari2DSkeletalRig from './Ari2DSkeletalRig'
import { Sparkles, Activity, Layers } from 'lucide-react'

/**
 * ORIGINAL FULL-BODY RIGGED 2D CHARACTER COMPONENT (ARI)
 * 
 * Renders the custom hierarchical SVG/Canvas 2D Skeletal Puppet Rig.
 * Controls 9 interactive animation states, facial parameter morphs,
 * 60fps real-time mouse tracking, and quick state testing toolbar.
 */
export default function Ari2DCharacter({
  hoverTarget = null,
  actionState = 'idle',
  isTalking = false,
  customExpression = null
}) {
  const [activeStateOverride, setActiveStateOverride] = useState(null)
  const [showRigInspector, setShowRigInspector] = useState(false)

  const effectiveState = activeStateOverride || actionState

  const animationList = [
    { id: 'idle', label: '1. IDLE' },
    { id: 'wave', label: '2. WAVE' },
    { id: 'talk', label: '3. TALK' },
    { id: 'point', label: '4. POINT' },
    { id: 'thinking', label: '5. THINKING' },
    { id: 'happy', label: '6. HAPPY' },
    { id: 'greeting', label: '7. GREETING' },
    { id: 'surprised', label: '8. SURPRISED' },
    { id: 'sad', label: '9. CONCERNED' }
  ]

  return (
    <div className="ari-rig-2d-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Interactive Rig Animation Inspector Button */}
      <div className="rig-inspector-controls">
        <button
          className="rig-toggle-btn"
          onClick={() => setShowRigInspector(!showRigInspector)}
          title="Open Interactive 2D Skeletal Animation Inspector"
        >
          <Layers size={14} />
          <span>2D Rig Animation Toolbar ({effectiveState.toUpperCase()})</span>
        </button>

        {showRigInspector && (
          <div className="rig-inspector-panel">
            <div className="inspector-header">
              <Activity size={14} className="icon-pulse" />
              <span>Skeletal 2D State Controls:</span>
            </div>
            <div className="inspector-chips-grid">
              {animationList.map((item) => (
                <button
                  key={item.id}
                  className={`rig-state-chip ${effectiveState === item.id ? 'active' : ''}`}
                  onClick={() => setActiveStateOverride(item.id)}
                >
                  {item.label}
                </button>
              ))}
              <button
                className="rig-state-chip reset-chip"
                onClick={() => setActiveStateOverride(null)}
              >
                Auto (React Controlled)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2D Skeletal Rig Engine */}
      <Ari2DSkeletalRig
        actionState={effectiveState}
        hoverTarget={hoverTarget}
        isTalking={isTalking}
        customExpression={customExpression}
      />
    </div>
  )
}
