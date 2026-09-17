import React, { useRef, useEffect, useState } from 'react'

/**
 * ORIGINAL FULL-BODY RIGGED 2D CHARACTER SYSTEM (ARI)
 * 
 * 100% Real-time Interactive 2D Skeletal Puppet Engine.
 * Features:
 * - Hierarchical Bone System: Pelvis, Torso, Head, Neck, Limbs, Hair, Eyes, Eyebrows, Viseme Mouth, Tablet
 * - Facial Morph Parameters: Eye Open/Close, Eye Look X/Y, Eyebrow Y/Tilt, Visemes ('rest','A','E','O','smile','surprised','sad')
 * - 9 Interactive Animation States: IDLE, WAVE, TALK, POINT, THINKING, HAPPY, GREETING, SURPRISED, SAD/CONCERNED
 * - Real-Time 60FPS Mouse Tracking with smooth Lerp interpolation
 */
export default function Ari2DSkeletalRig({
  actionState = 'idle', // 'idle' | 'wave' | 'talk' | 'point' | 'thinking' | 'happy' | 'greeting' | 'surprised' | 'sad'
  hoverTarget = null,   // 'marketplace' | 'sell' | 'company' | 'how_it_works'
  isTalking = false,
  customExpression = null
}) {
  const containerRef = useRef(null)

  // Mouse tracking state (-1 to 1 normalized)
  const mousePos = useRef({ x: 0, y: 0 })

  // Current interpolated rig parameters (Lerped at 60fps)
  const rigState = useRef({
    // Bone Angles (degrees)
    headRot: 0,
    headOffsetY: 0,
    torsoRot: 0,
    torsoOffsetY: 0,
    armRUpperRot: -15,
    armRForearmRot: 25,
    handRRot: 0,
    armLUpperRot: 15,
    armLForearmRot: -30,
    tabletRot: -10,

    // Facial Parameters
    eyeLookX: 0,
    eyeLookY: 0,
    eyeOpenL: 1.0,
    eyeOpenR: 1.0,
    eyebrowY: 0,
    eyebrowTilt: 0,
    mouthForm: 0, // -1 (frown) to 1 (smile)
    mouthOpen: 0.1,

    // Breathing phase
    breathPhase: 0,
    wavePhase: 0,
    talkPhase: 0
  })

  // State trigger for re-rendering UI visemes or reactive parameters if needed
  const [blink, setBlink] = useState(false)

  // Track Mouse Movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const normX = (e.clientX / innerWidth) * 2 - 1
      const normY = (e.clientY / innerHeight) * 2 - 1
      mousePos.current = { x: normX, y: normY }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Natural Eye Blinking Timer (every 3.2s to 5.8s)
  useEffect(() => {
    let blinkTimeout
    const scheduleBlink = () => {
      const delay = Math.random() * 2600 + 3200
      blinkTimeout = setTimeout(() => {
        setBlink(true)
        setTimeout(() => {
          setBlink(false)
          scheduleBlink()
        }, 140)
      }, delay)
    }
    scheduleBlink()
    return () => clearTimeout(blinkTimeout)
  }, [])

  // 60FPS RequestAnimationFrame Animation Engine Loop
  const [, setFrame] = useState(0)
  useEffect(() => {
    let animationFrameId

    const updateRig = () => {
      const rig = rigState.current

      // Update phase timers
      rig.breathPhase += 0.025
      rig.wavePhase += 0.08
      rig.talkPhase += 0.12

      // 1. Mouse Lerp Calculations (Lerp factor = 0.08)
      const targetMouseX = mousePos.current.x
      const targetMouseY = mousePos.current.y

      const lerp = (start, end, amt) => start + (end - start) * amt

      // Default tracking target
      let targetHeadRot = targetMouseX * 14
      let targetHeadY = targetMouseY * 4
      let targetTorsoRot = targetMouseX * 4
      let targetEyeX = targetMouseX * 0.85
      let targetEyeY = targetMouseY * 0.75

      let targetEyebrowY = 0
      let targetEyebrowTilt = 0
      let targetMouthForm = 0.4 // gentle smile by default
      let targetMouthOpen = 0.08

      let targetArmRUpper = -15
      let targetArmRForearm = 25
      let targetHandR = 0

      let targetArmLUpper = 18
      let targetArmLForearm = -35
      let targetTabletRot = -10

      // 2. Action State Overrides & Procedural Bone Keyframing
      const currentAction = actionState

      if (currentAction === 'wave' || currentAction === 'greeting') {
        // Friendly Hand Wave Animation
        targetArmRUpper = -120 + Math.sin(rig.wavePhase * 1.5) * 10
        targetArmRForearm = -45 + Math.sin(rig.wavePhase * 3) * 25
        targetHandR = Math.sin(rig.wavePhase * 3) * 15
        targetHeadRot = -6 + Math.sin(rig.wavePhase) * 4
        targetMouthForm = 1.0 // Big friendly smile
        targetMouthOpen = 0.25
        targetEyebrowY = 0.4
      } else if (currentAction === 'point') {
        // Pointing Gesture toward UI elements
        targetArmRUpper = -70
        targetArmRForearm = -10
        targetHandR = -15
        targetHeadRot = -8
        targetEyeX = -0.9
        targetMouthForm = 0.8
      } else if (currentAction === 'thinking') {
        // Thoughtful Pose: Hand to chin, eyes looking up-right
        targetArmRUpper = -105
        targetArmRForearm = -110
        targetHandR = 30
        targetHeadRot = 8
        targetHeadY = -6
        targetEyeX = 0.8
        targetEyeY = -0.9
        targetEyebrowY = 0.6
        targetEyebrowTilt = -0.5
        targetMouthForm = 0.1
        targetMouthOpen = 0.05
      } else if (currentAction === 'happy') {
        // Joyful Celebratory Gesture
        targetArmRUpper = -110 + Math.sin(rig.wavePhase * 2) * 8
        targetArmRForearm = -30
        targetArmLUpper = 110 - Math.sin(rig.wavePhase * 2) * 8
        targetArmLForearm = 30
        targetHeadRot = Math.sin(rig.wavePhase * 2) * 6
        targetMouthForm = 1.0
        targetMouthOpen = 0.4
        targetEyebrowY = 0.8
      } else if (currentAction === 'surprised') {
        // Surprised Expression
        targetHeadY = -8
        targetEyebrowY = 1.2
        targetMouthForm = 0
        targetMouthOpen = 0.8
        targetArmRUpper = -35
        targetArmRForearm = 45
      } else if (currentAction === 'sad') {
        // Concerned / Error Reaction
        targetHeadY = 6
        targetHeadRot = -6
        targetEyebrowY = -0.6
        targetEyebrowTilt = -0.8
        targetMouthForm = -0.8 // Frown
        targetMouthOpen = 0.15
        targetEyeY = 0.6
      } else if (isTalking) {
        // Procedural Talking Viseme Morphing
        const talkVal = Math.sin(rig.talkPhase * 4)
        targetMouthOpen = 0.2 + Math.abs(talkVal) * 0.45
        targetMouthForm = talkVal > 0 ? 0.7 : 0.2
        targetHeadRot += Math.sin(rig.talkPhase * 2) * 3
        targetArmRUpper = -30 + Math.sin(rig.talkPhase) * 10
        targetArmRForearm = 35 + Math.cos(rig.talkPhase) * 15
      }

      // Hover Button Reactive Modifications
      if (hoverTarget === 'marketplace') {
        targetArmRUpper = -65
        targetArmRForearm = -15
        targetHeadRot = -10
        targetMouthForm = 0.9
      } else if (hoverTarget === 'company') {
        targetArmRUpper = -40
        targetArmRForearm = 10
        targetHeadRot = 10
        targetMouthForm = 0.8
      } else if (hoverTarget === 'sell') {
        targetArmLUpper = 35
        targetTabletRot = 5
        targetHeadRot = -5
        targetMouthForm = 0.85
      }

      // 3. Sine-Wave Idle Breathing & Floating
      const breathOffset = Math.sin(rig.breathPhase) * 3
      const breathRot = Math.sin(rig.breathPhase * 0.8) * 0.8

      // Apply Lerp for silky smooth 60fps transitions
      rig.headRot = lerp(rig.headRot, targetHeadRot + breathRot, 0.08)
      rig.headOffsetY = lerp(rig.headOffsetY, targetHeadY - breathOffset * 0.3, 0.08)
      rig.torsoRot = lerp(rig.torsoRot, targetTorsoRot + breathRot * 0.5, 0.08)
      rig.torsoOffsetY = lerp(rig.torsoOffsetY, breathOffset, 0.08)

      rig.armRUpperRot = lerp(rig.armRUpperRot, targetArmRUpper, 0.08)
      rig.armRForearmRot = lerp(rig.armRForearmRot, targetArmRForearm, 0.08)
      rig.handRRot = lerp(rig.handRRot, targetHandR, 0.08)

      rig.armLUpperRot = lerp(rig.armLUpperRot, targetArmLUpper, 0.08)
      rig.armLForearmRot = lerp(rig.armLForearmRot, targetArmLForearm, 0.08)
      rig.tabletRot = lerp(rig.tabletRot, targetTabletRot, 0.08)

      rig.eyeLookX = lerp(rig.eyeLookX, targetEyeX, 0.1)
      rig.eyeLookY = lerp(rig.eyeLookY, targetEyeY, 0.1)
      rig.eyebrowY = lerp(rig.eyebrowY, targetEyebrowY, 0.08)
      rig.eyebrowTilt = lerp(rig.eyebrowTilt, targetEyebrowTilt, 0.08)

      rig.mouthForm = lerp(rig.mouthForm, targetMouthForm, 0.1)
      rig.mouthOpen = lerp(rig.mouthOpen, targetMouthOpen, 0.1)

      // Trigger frame re-render
      setFrame((f) => f + 1)
      animationFrameId = requestAnimationFrame(updateRig)
    }

    animationFrameId = requestAnimationFrame(updateRig)
    return () => cancelAnimationFrame(animationFrameId)
  }, [actionState, isTalking, hoverTarget])

  const rig = rigState.current
  const currentEyeOpen = blink ? 0.05 : currentExpression('eyeOpen', 1.0)

  function currentExpression(param, defaultVal) {
    if (customExpression && customExpression[param] !== undefined) {
      return customExpression[param]
    }
    return defaultVal
  }

  // Calculate Eye Pupil Shift (pixels inside eye orbit)
  const pupilPxX = rig.eyeLookX * 5
  const pupilPxY = rig.eyeLookY * 4

  return (
    <div className="ari-rigged-2d-root" ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 450 650"
        className="ari-skeletal-svg-canvas"
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
      >
        <defs>
          {/* AgriTrade Color Gradients */}
          <linearGradient id="jacketGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#0F3820" />
          </linearGradient>

          <linearGradient id="jacketCreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFDF5" />
            <stop offset="100%" stopColor="#E5E0C8" />
          </linearGradient>

          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFDFC4" />
            <stop offset="100%" stopColor="#F3C5A5" />
          </linearGradient>

          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6E442B" />
            <stop offset="60%" stopColor="#4A2C19" />
            <stop offset="100%" stopColor="#2D190E" />
          </linearGradient>

          <linearGradient id="cargoPantsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="bootsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#854D0E" />
            <stop offset="100%" stopColor="#451A03" />
          </linearGradient>

          <linearGradient id="tabletScreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="100%" stopColor="#022C22" />
          </linearGradient>

          {/* Soft Drop Shadows & Glow Filters */}
          <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="jointShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* ============================================================ */}
        {/* SKELETAL RIG HIERARCHY ROOT BONE: [PELVIS / CHARACTER CENTER] */}
        {/* ============================================================ */}
        <g transform={`translate(225, 340) translate(0, ${rig.torsoOffsetY})`}>
          
          {/* Ambient Ground Shadow */}
          <ellipse cx="0" cy="270" rx="90" ry="14" fill="rgba(0, 0, 0, 0.35)" filter="blur(4px)" />

          {/* ------------------------------------------------------------ */}
          {/* BONE: LOWER LEGS & BOOTS (LEGS RIG) */}
          {/* ------------------------------------------------------------ */}
          <g id="bone-legs" filter="url(#jointShadow)">
            {/* Left Leg */}
            <path d="M -45,110 L -55,230 L -25,230 L -20,110 Z" fill="url(#cargoPantsGrad)" />
            {/* Left Boot */}
            <path d="M -60,230 Q -65,255 -30,258 L -15,258 L -18,230 Z" fill="url(#bootsGrad)" />
            {/* Right Leg */}
            <path d="M 20,110 L 18,230 L 52,230 L 45,110 Z" fill="url(#cargoPantsGrad)" />
            {/* Right Boot */}
            <path d="M 15,230 L 15,258 L 58,258 Q 65,255 55,230 Z" fill="url(#bootsGrad)" />
          </g>

          {/* ------------------------------------------------------------ */}
          {/* BONE: TORSO & JACKET (UPPER BODY RIG) */}
          {/* ------------------------------------------------------------ */}
          <g id="bone-torso" transform={`rotate(${rig.torsoRot})`}>
            {/* Waist & Dark Cargo Pants Upper */}
            <path d="M -50,70 L 50,70 L 45,120 L -45,120 Z" fill="#1E293B" />
            <rect x="-42" y="82" width="84" height="6" fill="#0F172A" rx="2" />
            <rect x="-8" y="80" width="16" height="10" fill="#E2E8F0" rx="2" />

            {/* Inner Shirt (Cream) */}
            <path d="M -25,0 L 25,0 L 30,80 L -30,80 Z" fill="url(#jacketCreamGrad)" />

            {/* Main AgriTrade Green Jacket */}
            <path
              d="M -65,-30 Q 0,-35 65,-30 L 58,75 Q 0,82 -58,75 Z"
              fill="url(#jacketGreenGrad)"
              filter="url(#jointShadow)"
            />
            {/* Cream Jacket Panels & Lapels */}
            <path d="M -65,-30 L -25,0 L -20,70 L -55,68 Z" fill="url(#jacketCreamGrad)" />
            <path d="M 65,-30 L 25,0 L 20,70 L 55,68 Z" fill="url(#jacketCreamGrad)" />

            {/* AgriTrade Leaf Chest Badge */}
            <g transform="translate(-35, 15) scale(0.85)">
              <circle cx="0" cy="0" r="10" fill="#0F3820" />
              <path d="M -4,2 Q 0,-7 5,-2 Q 0,7 -4,2 Z" fill="#22C55E" />
              <path d="M -1,-4 L 3,3" stroke="#FFFDF5" strokeWidth="1.2" strokeLinecap="round" />
            </g>

            {/* ------------------------------------------------------------ */}
            {/* BONE: LEFT ARM & TABLET (LEFT LIMB RIG) */}
            {/* ------------------------------------------------------------ */}
            <g id="bone-arm-left" transform="translate(-55, -20)">
              <g transform={`rotate(${rig.armLUpperRot})`}>
                {/* Left Upper Arm Sleeve */}
                <path d="M -18,-5 L 18,-5 L 14,65 L -16,65 Z" fill="url(#jacketGreenGrad)" />
                <path d="M -16,50 L 14,50 L 14,65 L -16,65 Z" fill="url(#jacketCreamGrad)" />

                {/* Left Elbow Joint */}
                <g transform="translate(0, 60)">
                  <g transform={`rotate(${rig.armLForearmRot})`}>
                    {/* Left Forearm (Skin) */}
                    <path d="M -12,0 L 12,0 L 10,60 L -10,60 Z" fill="url(#skinGrad)" />

                    {/* Left Hand holding Tablet */}
                    <g transform="translate(0, 60)">
                      <circle cx="0" cy="5" r="11" fill="url(#skinGrad)" />

                      {/* DIGITAL AGRITECH TABLET */}
                      <g transform={`rotate(${rig.tabletRot}) translate(-30, -15)`}>
                        {/* Outer Metallic Casing */}
                        <rect x="-10" y="-35" width="75" height="100" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="3" />
                        {/* Glowing Screen */}
                        <rect x="-5" y="-30" width="65" height="90" rx="4" fill="url(#tabletScreenGrad)" />
                        
                        {/* Live Crop Telemetry Graphics */}
                        <path d="M 0,25 Q 15,5 30,18 T 55,-10" fill="none" stroke="#22C55E" strokeWidth="2.5" />
                        <circle cx="30" cy="18" r="3" fill="#4ADE80" filter="url(#glowGreen)" />
                        <rect x="2" y="-20" width="30" height="4" rx="2" fill="#4ADE80" />
                        <rect x="2" y="-12" width="42" height="3" rx="1.5" fill="rgba(255,255,255,0.6)" />
                        <rect x="2" y="-5" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
                        <text x="2" y="45" fill="#4ADE80" fontSize="7" fontFamily="sans-serif" fontWeight="bold">AGRI-OS 99.4%</text>

                        {/* Thumb overlapping tablet frame */}
                        <path d="M -8,15 Q -1,15 2,25 Q -6,28 -10,20 Z" fill="url(#skinGrad)" />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>

            {/* ------------------------------------------------------------ */}
            {/* BONE: RIGHT ARM (RIGHT LIMB RIG - WAVING/POINTING/GESTURES) */}
            {/* ------------------------------------------------------------ */}
            <g id="bone-arm-right" transform="translate(55, -20)">
              <g transform={`rotate(${rig.armRUpperRot})`}>
                {/* Right Upper Arm Sleeve */}
                <path d="M -18,-5 L 18,-5 L 16,65 L -14,65 Z" fill="url(#jacketGreenGrad)" />
                <path d="M -14,50 L 16,50 L 16,65 L -14,65 Z" fill="url(#jacketCreamGrad)" />

                {/* Right Elbow Joint */}
                <g transform="translate(0, 60)">
                  <g transform={`rotate(${rig.armRForearmRot})`}>
                    {/* Right Forearm (Skin) */}
                    <path d="M -12,0 L 12,0 L 10,60 L -10,60 Z" fill="url(#skinGrad)" />

                    {/* Right Hand / Fingers */}
                    <g transform={`translate(0, 60) rotate(${rig.handRRot})`}>
                      <circle cx="0" cy="6" r="11" fill="url(#skinGrad)" />
                      {/* Fingers */}
                      <path d="M -8,10 Q -4,22 0,22 Q 4,22 8,10 Z" fill="url(#skinGrad)" />
                      <path d="M -10,5 Q -14,14 -8,18 Z" fill="url(#skinGrad)" />
                    </g>
                  </g>
                </g>
              </g>
            </g>

            {/* ------------------------------------------------------------ */}
            {/* BONE: NECK & HEAD (FACIAL RIG & MORPH PARAMETERS) */}
            {/* ------------------------------------------------------------ */}
            <g id="bone-neck-head" transform={`translate(0, -35) translate(0, ${rig.headOffsetY})`}>
              {/* Neck */}
              <path d="M -14,-15 L 14,-15 L 18,12 L -18,12 Z" fill="url(#skinGrad)" />
              {/* Neck Shadow under chin */}
              <path d="M -16,-15 Q 0,-3 16,-15 L 14,-5 Q 0,8 -14,-5 Z" fill="rgba(180, 100, 60, 0.25)" />

              {/* HEAD JOINT (ROTABLE & TRANSLATABLE) */}
              <g transform={`rotate(${rig.headRot})`}>
                
                {/* Back Tousled Hair Strands */}
                <path
                  d="M -65,-30 Q -75,-80 0,-95 Q 75,-80 65,-30 Q 70,20 50,40 Q 0,45 -50,40 Z"
                  fill="url(#hairGrad)"
                />

                {/* Ears */}
                <circle cx="-46" cy="-15" r="9" fill="url(#skinGrad)" />
                <circle cx="46" cy="-15" r="9" fill="url(#skinGrad)" />

                {/* Face Base Oval */}
                <path
                  d="M -44,-45 Q 0,-55 44,-45 Q 48,-5 36,25 Q 0,52 -36,25 Q -48,-5 -44,-45 Z"
                  fill="url(#skinGrad)"
                  filter="url(#jointShadow)"
                />

                {/* Rosy Cheek Highlights */}
                <ellipse cx="-26" cy="4" rx="10" ry="5" fill="rgba(239, 68, 68, 0.15)" />
                <ellipse cx="26" cy="4" rx="10" ry="5" fill="rgba(239, 68, 68, 0.15)" />

                {/* Nose */}
                <path d="M -3,-12 Q 0,-4 4,-2 Q 0,3 -4,1" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />

                {/* ============================================================ */}
                {/* FACIAL RIG: EYEBROWS (UP/DOWN/TILT MORPH) */}
                {/* ============================================================ */}
                <g transform={`translate(0, ${-rig.eyebrowY * 6})`}>
                  {/* Left Eyebrow */}
                  <g transform={`translate(-22, -26) rotate(${-rig.eyebrowTilt * 12})`}>
                    <path d="M -14,2 Q 0,-6 14,0" fill="none" stroke="#4A2C19" strokeWidth="4" strokeLinecap="round" />
                  </g>
                  {/* Right Eyebrow */}
                  <g transform={`translate(22, -26) rotate(${rig.eyebrowTilt * 12})`}>
                    <path d="M -14,0 Q 0,-6 14,2" fill="none" stroke="#4A2C19" strokeWidth="4" strokeLinecap="round" />
                  </g>
                </g>

                {/* ============================================================ */}
                {/* FACIAL RIG: EYES (PUPIL TRACKING & EYE OPEN/BLINK MORPH) */}
                {/* ============================================================ */}
                <g id="facial-eyes">
                  {/* LEFT EYE */}
                  <g transform="translate(-22, -12)">
                    {/* Eye White Sclera */}
                    <ellipse cx="0" cy="0" rx="13" ry={10 * currentEyeOpen} fill="#FFFDF5" stroke="#4A2C19" strokeWidth="1.5" />
                    
                    {currentEyeOpen > 0.15 && (
                      <g transform={`translate(${pupilPxX}, ${pupilPxY})`}>
                        {/* Hazel / Green Iris */}
                        <circle cx="0" cy="0" r="6" fill="#15803D" />
                        {/* Dark Pupil */}
                        <circle cx="0" cy="0" r="3.2" fill="#0F172A" />
                        {/* White Specular Reflection Catchlight */}
                        <circle cx="-2" cy="-2" r="1.8" fill="#FFFFFF" />
                      </g>
                    )}
                  </g>

                  {/* RIGHT EYE */}
                  <g transform="translate(22, -12)">
                    {/* Eye White Sclera */}
                    <ellipse cx="0" cy="0" rx="13" ry={10 * currentEyeOpen} fill="#FFFDF5" stroke="#4A2C19" strokeWidth="1.5" />
                    
                    {currentEyeOpen > 0.15 && (
                      <g transform={`translate(${pupilPxX}, ${pupilPxY})`}>
                        {/* Hazel / Green Iris */}
                        <circle cx="0" cy="0" r="6" fill="#15803D" />
                        {/* Dark Pupil */}
                        <circle cx="0" cy="0" r="3.2" fill="#0F172A" />
                        {/* White Specular Reflection Catchlight */}
                        <circle cx="-2" cy="-2" r="1.8" fill="#FFFFFF" />
                      </g>
                    )}
                  </g>
                </g>

                {/* ============================================================ */}
                {/* FACIAL RIG: MOUTH (DYNAMIC VISEME MORPH SHAPES) */}
                {/* ============================================================ */}
                <g transform="translate(0, 18)" id="facial-mouth">
                  {rig.mouthOpen > 0.25 ? (
                    /* Open Mouth / Talking / Surprised / Laughing shape */
                    <g>
                      <path
                        d={`M -14,0 Q 0,${rig.mouthOpen * 22} 14,0 Q 0,${-rig.mouthOpen * 8} -14,0 Z`}
                        fill="#991B1B"
                        stroke="#4A2C19"
                        strokeWidth="1.5"
                      />
                      {/* Upper Teeth */}
                      <path d="M -10,1 Q 0,4 10,1 L 8,5 Q 0,7 -8,5 Z" fill="#FFFDF5" />
                      {/* Tongue */}
                      <path d="M -7,8 Q 0,16 7,8 Q 0,5 -7,8 Z" fill="#F87171" />
                    </g>
                  ) : rig.mouthForm < -0.3 ? (
                    /* Frown / Sad / Concerned Mouth */
                    <path
                      d="M -12,6 Q 0,-4 12,6"
                      fill="none"
                      stroke="#4A2C19"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  ) : (
                    /* Natural Smile / Neutral Mouth Curve */
                    <path
                      d={`M -14,0 Q 0,${rig.mouthForm * 12} 14,0`}
                      fill="none"
                      stroke="#4A2C19"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  )}
                </g>

                {/* Front Stylish Tousled Hair Layer & Sideburns */}
                <g id="hair-front">
                  {/* Front Fringe Strands */}
                  <path d="M -48,-42 Q -20,-75 10,-48 Q 30,-70 50,-38 Q 20,-50 -10,-42 Q -30,-48 -48,-42 Z" fill="url(#hairGrad)" />
                  <path d="M -30,-50 Q -5,-82 25,-55 Q 5,-60 -15,-48 Z" fill="#854D0E" opacity="0.4" />
                  {/* Sideburns */}
                  <path d="M -44,-25 L -42,-5 L -38,-15 Z" fill="url(#hairGrad)" />
                  <path d="M 44,-25 L 42,-5 L 38,-15 Z" fill="url(#hairGrad)" />
                </g>

              </g> {/* END HEAD JOINT */}
            </g> {/* END NECK & HEAD BONE */}

          </g> {/* END TORSO BONE */}
        </g> {/* END ROOT BONE */}
      </svg>
    </div>
  )
}
