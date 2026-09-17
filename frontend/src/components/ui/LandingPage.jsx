import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Truck,
  HandCoins,
  ShoppingCart,
  Sparkles,
  HelpCircle,
  Bot,
  X,
  Send,
  MessageSquare,
  Building2,
  ChevronRight,
  Info,
  Volume2,
  VolumeX
} from 'lucide-react'
import Ari2DCharacter from './Ari2DCharacter'
import './LandingPage.css'

export default function LandingPage({ onEnterLogin }) {
  const [hoverTarget, setHoverTarget] = useState(null)
  const [animState, setAnimState] = useState('idle')
  const [isTalking, setIsTalking] = useState(false)
  const [showSpeechBubble, setShowSpeechBubble] = useState(false)
  const [speechText, setSpeechText] = useState(
    "Hi! I'm Ari, your AgriTrade assistant. Let's grow smarter together."
  )
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false)
  const [userQuery, setUserQuery] = useState('')
  const [aiResponse, setAiResponse] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [produceList, setProduceList] = useState([])
  const [contractList, setContractList] = useState([])
  const [scrolled, setScrolled] = useState(false)
  const [showModelTooltip, setShowModelTooltip] = useState(false)

  // Browser SpeechSynthesis API Text-to-Speech helper
  const speakText = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 1.1
    utterance.onstart = () => setIsTalking(true)
    utterance.onend = () => setIsTalking(false)
    utterance.onerror = () => setIsTalking(false)
    window.speechSynthesis.speak(utterance)
  }

  // Initial Entrance Sequence
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimState('wave')
    }, 400)

    const timer2 = setTimeout(() => {
      setShowSpeechBubble(true)
      speakText("Hi! I'm Ari, your AgriTrade assistant. Let's grow smarter together.")
    }, 1000)

    const timer3 = setTimeout(() => {
      setAnimState('idle')
    }, 2800)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [voiceEnabled])

  // Navbar scroll blur effect listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch produce & contracts for Ari's quick actions
  useEffect(() => {
    fetch('/api/produce')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.produce) {
          setProduceList(data.produce)
        }
      })
      .catch(() => {})

    fetch('/api/contracts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.contracts) {
          setContractList(data.contracts)
        }
      })
      .catch(() => {})
  }, [])

  // Hover Interaction Triggers
  const handleButtonHover = (targetName, message) => {
    setHoverTarget(targetName)
    if (message) {
      setSpeechText(message)
      speakText(message)
    }
  }

  const handleButtonLeave = () => {
    setHoverTarget(null)
  }

  // Action Click Triggers
  const handleExploreMarketplace = () => {
    setAnimState('point')
    const msg = "Great! Let's explore the marketplace."
    setSpeechText(msg)
    speakText(msg)
    setTimeout(() => {
      onEnterLogin()
    }, 900)
  }

  const handleLoginClick = (roleType) => {
    setAnimState('happy')
    const msg = `Welcome! Opening secure ${roleType || 'AgriTrade'} login portal...`
    setSpeechText(msg)
    speakText(msg)
    setTimeout(() => {
      onEnterLogin()
    }, 800)
  }

  const handleHowItWorks = () => {
    setAnimState('talk')
    const msg = 'AgriTrade connects farmers & companies with AI quality scoring, smart contracts, and escrow payouts!'
    setSpeechText(msg)
    speakText(msg)
    setTimeout(() => {
      setIsAiPanelOpen(true)
    }, 600)
  }

  const triggerAskAriAction = (actionKey) => {
    setAiLoading(true)
    setAnimState('thinking')

    setTimeout(() => {
      setAnimState('talk')
      setAiLoading(false)

      let resText = ''
      switch (actionKey) {
        case 'products':
          resText = "Here are our top verified crop batches available on AgriTrade right now!"
          setSpeechText(resText)
          speakText(resText)
          setAiResponse({
            title: 'Verified Agricultural Produce',
            type: 'produce',
            items: produceList.length > 0 ? produceList : [
              { name: 'Organic Durum Wheat', grade: 'A+', origin: 'Green Valley', pricePerTon: '$340' },
              { name: 'Arabica Coffee Beans', grade: 'AAA', origin: 'Rift Valley', pricePerTon: '$1,850' },
              { name: 'Hass Avocados', grade: 'A', origin: 'SunRidge Orchards', pricePerTon: '$1,200' }
            ]
          })
          break

        case 'companies':
          resText = "Here are verified corporate procurement buyers actively trading on AgriTrade!"
          setSpeechText(resText)
          speakText(resText)
          setAiResponse({
            title: 'Corporate Procurement Partners',
            type: 'contracts',
            items: contractList.length > 0 ? contractList : [
              { buyer: 'Global Buyer Inc.', item: 'Durum Wheat', value: '$153,000', status: 'In Escrow' },
              { buyer: 'AgriCorp Roasters', item: 'Arabica Coffee', value: '$222,000', status: 'Settled' }
            ]
          })
          break

        case 'sell':
          resText = "Selling your produce is easy! Register your harvest batch to get AI Quality Scores & direct contracts."
          setSpeechText(resText)
          speakText(resText)
          setAiResponse({
            title: 'Sell Your Produce Direct',
            type: 'text',
            text: 'Farmers on AgriTrade get up to 24% higher profit margins by cutting out intermediaries. Quality grading is done via computer vision AI with instant escrow payouts upon delivery!'
          })
          break

        case 'how_it_works':
          resText = "Let me explain how AgriTrade streamlines the entire farm-to-company trade flow."
          setSpeechText(resText)
          speakText(resText)
          setAiResponse({
            title: 'How AgriTrade Works',
            type: 'text',
            text: '1. Farmers list harvested crops with IoT telemetry.\n2. AI inspects & grades produce quality (99.4% precision).\n3. Buyers execute smart escrow contracts.\n4. Logistics fleet delivers with real-time temperature tracking.\n5. Automated digital payouts are settled instantly.'
          })
          break

        default:
          setSpeechText("I am ready to help you with market prices, contracts, and crop logistics.")
          break
      }

      setTimeout(() => {
        setAnimState('idle')
      }, 4000)
    }, 1200)
  }

  const handleCustomSubmit = (e) => {
    e.preventDefault()
    if (!userQuery.trim()) return

    setAiLoading(true)
    setAnimState('thinking')
    const query = userQuery
    setUserQuery('')

    setTimeout(() => {
      setAnimState('talk')
      setAiLoading(false)
      const resText = `Regarding "${query}": AgriTrade guarantees verified pricing, direct trading, and escrow protection.`
      setSpeechText(resText)
      speakText(resText)
      setAiResponse({
        title: `AI Recommendation: "${query}"`,
        type: 'text',
        text: `AgriTrade's neural engine analyzes real-time spot market prices, soil conditions, and buyer demands to ensure optimal contract terms. Click below to enter the marketplace!`
      })
      setTimeout(() => {
        setAnimState('idle')
      }, 4000)
    }, 1400)
  }

  const featurePills = [
    { title: 'AI Quality Score', icon: ShieldCheck, desc: '99.4% Precision' },
    { title: 'Direct Contracts', icon: ShoppingCart, desc: 'Zero Intermediaries' },
    { title: 'IoT Logistics Fleet', icon: Truck, desc: 'Temp Monitored' },
    { title: 'Instant Payouts', icon: HandCoins, desc: '< 2 Sec Settlement' }
  ]

  return (
    <div className="landing-container">
      {/* Dynamic Animated Background */}
      <div className="animated-bg-radial" />
      <div className="animated-grid-overlay" />

      {/* Main UI Overlay Container */}
      <div className="landing-ui-layer">
        {/* Sticky Glassmorphic Navbar */}
        <motion.header
          className={`sticky-navbar ${scrolled ? 'navbar-scrolled' : ''}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="navbar-left">
            <div className="brand-logo-glow">
              <Sprout size={22} className="sprout-icon" />
            </div>
            <span className="brand-title-text">AgriTrade</span>
            <span className="brand-badge-pill">AI Platform</span>
          </div>

          <nav className="navbar-links desktop-only">
            <a
              href="#marketplace"
              onMouseEnter={() => handleButtonHover('marketplace', "Let's find the right products for you.")}
              onMouseLeave={handleButtonLeave}
              onClick={(e) => { e.preventDefault(); handleExploreMarketplace(); }}
            >
              Marketplace
            </a>
            <a
              href="#how-it-works"
              onMouseEnter={() => handleButtonHover('how_it_works', "Let me explain how AgriTrade works!")}
              onMouseLeave={handleButtonLeave}
              onClick={(e) => { e.preventDefault(); handleHowItWorks(); }}
            >
              How It Works
            </a>
            <a
              href="#ask-ari"
              onMouseEnter={() => handleButtonHover('ask_ari', "Ask me anything about crop prices & contracts.")}
              onMouseLeave={handleButtonLeave}
              onClick={(e) => { e.preventDefault(); setIsAiPanelOpen(true); }}
            >
              Ask Ari
            </a>
          </nav>

          <div className="navbar-actions">
            {/* 2D Layered Asset Chip */}
            <div
              className="glb-info-chip"
              onClick={() => setShowModelTooltip(!showModelTooltip)}
              title="2D Mascot Layer Location"
            >
              <div className="glow-dot" />
              <span className="chip-text">Ari 2D Character</span>
              <HelpCircle size={14} className="help-icon" />

              {showModelTooltip && (
                <div className="glb-tooltip-card">
                  <p className="tooltip-title">📦 2D Mascot Layer Location:</p>
                  <code>/public/character/ (body.png, head.png...)</code>
                  <p className="tooltip-sub">(Active: Mouse Lerp Tracking & Vector SVG Fallback)</p>
                </div>
              )}
            </div>

            <button
              className="nav-btn-farmer"
              onMouseEnter={() => handleButtonHover('sell', "Ready to reach more buyers?")}
              onMouseLeave={handleButtonLeave}
              onClick={() => handleLoginClick('Farmer')}
              title="Farmer Portal Access"
            >
              <Sprout size={16} />
              <span>Farmer Login</span>
            </button>

            <button
              className="nav-btn-company"
              onMouseEnter={() => handleButtonHover('company', "Let's find the right agricultural opportunities.")}
              onMouseLeave={handleButtonLeave}
              onClick={() => handleLoginClick('Company')}
              title="Company Procurement Access"
            >
              <Building2 size={16} />
              <span>Company Login</span>
            </button>
          </div>
        </motion.header>

        {/* Hero Section Container */}
        <section className="hero-main-container">
          {/* LEFT 60%: Copy & CTAs */}
          <div className="hero-left-content">
            {/* Small Top Badge */}
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Sparkles size={14} className="badge-sparkle-icon" />
              <span>AI-POWERED AGRICULTURE MARKETPLACE</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="hero-main-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Grow smarter. <br />
              <span className="gradient-text-green">Trade better.</span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              className="hero-supporting-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Connect farmers directly with companies, discover better opportunities, and build a smarter agricultural marketplace.
            </motion.p>

            {/* Action Buttons Group */}
            <motion.div
              className="hero-actions-group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <button
                className="btn-primary-explore"
                onMouseEnter={() => handleButtonHover('marketplace', "Let's find the right products for you.")}
                onMouseLeave={handleButtonLeave}
                onClick={handleExploreMarketplace}
              >
                <span>Explore Marketplace</span>
                <ArrowRight size={18} />
              </button>

              <button
                className="btn-secondary-how"
                onMouseEnter={() => handleButtonHover('how_it_works', "Let me explain how AgriTrade works!")}
                onMouseLeave={handleButtonLeave}
                onClick={handleHowItWorks}
              >
                <span>How It Works</span>
              </button>

              <button
                className="btn-ask-ari-hero"
                onMouseEnter={() => handleButtonHover('ask_ari', "Ask me anything about crop prices & contracts.")}
                onMouseLeave={handleButtonLeave}
                onClick={() => setIsAiPanelOpen(true)}
              >
                <Bot size={18} className="ari-icon-btn" />
                <span>Ask Ari</span>
              </button>
            </motion.div>
          </div>

          {/* RIGHT 40%: 2D Character Mascot & Speech Bubble */}
          <div className="hero-right-character-zone">
            {/* Ambient Green Glow Backdrop */}
            <div className="character-soft-green-glow" />

            {/* Interactive 2D Ari Mascot */}
            <Ari2DCharacter
              hoverTarget={hoverTarget}
              actionState={animState}
              isTalking={isTalking}
            />

            {/* Floating Glassmorphism Speech Card */}
            <AnimatePresence>
              {showSpeechBubble && (
                <motion.div
                  className="speech-bubble-glass-card"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
                >
                  <div className="speech-card-header">
                    <div className="speech-avatar-badge">
                      <Bot size={16} />
                    </div>
                    <div className="speech-title-container">
                      <span className="speech-agent-name">ARI · AGRITRADE ASSISTANT</span>
                      <div className="speech-active-indicator">
                        <span className="glowing-pulse-dot" />
                        <span className="active-status-text">Online & Tracking</span>
                      </div>
                    </div>

                    {/* Text-to-Speech Voice Toggle Button */}
                    <button
                      className="voice-toggle-btn"
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      title={voiceEnabled ? 'Mute Ari Voice' : 'Enable Ari Voice (Text-to-Speech)'}
                    >
                      {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </button>
                  </div>

                  <p className="speech-message-content">"{speechText}"</p>

                  <button
                    className="speech-card-ask-btn"
                    onClick={() => setIsAiPanelOpen(true)}
                  >
                    <span>Ask Ari a Question</span>
                    <ChevronRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Footer Feature Pills Bar */}
        <motion.footer
          className="hero-footer-bar"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="feature-pills-row">
            {featurePills.map((pill, idx) => {
              const IconComponent = pill.icon
              return (
                <div key={idx} className="feature-pill-item">
                  <div className="pill-icon-box">
                    <IconComponent size={16} />
                  </div>
                  <div className="pill-text-column">
                    <span className="pill-title">{pill.title}</span>
                    <span className="pill-desc">{pill.desc}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.footer>
      </div>

      {/* Interactive "Ask Ari" Assistant Panel / Slide-Over Drawer */}
      <AnimatePresence>
        {isAiPanelOpen && (
          <div className="ai-modal-backdrop" onClick={() => setIsAiPanelOpen(false)}>
            <motion.div
              className="ai-panel-glass-card"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel Header */}
              <div className="ai-panel-header">
                <div className="panel-title-lockup">
                  <div className="panel-ari-avatar">
                    <Bot size={22} />
                  </div>
                  <div>
                    <h3 className="panel-heading">Ask Ari • AgriTrade AI Mentor</h3>
                    <p className="panel-subheading">Intelligent agritech marketplace assistant</p>
                  </div>
                </div>

                <button
                  className="panel-close-btn"
                  onClick={() => setIsAiPanelOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick Actions Suggestions */}
              <div className="ai-quick-actions-section">
                <span className="section-label">Suggested Quick Actions:</span>
                <div className="quick-action-buttons-grid">
                  <button
                    className="quick-action-chip"
                    onClick={() => triggerAskAriAction('products')}
                  >
                    <ShoppingCart size={14} />
                    <span>[ Find Products ]</span>
                  </button>

                  <button
                    className="quick-action-chip"
                    onClick={() => triggerAskAriAction('companies')}
                  >
                    <Building2 size={14} />
                    <span>[ Find Companies ]</span>
                  </button>

                  <button
                    className="quick-action-chip"
                    onClick={() => triggerAskAriAction('sell')}
                  >
                    <Sprout size={14} />
                    <span>[ Sell My Produce ]</span>
                  </button>

                  <button
                    className="quick-action-chip"
                    onClick={() => triggerAskAriAction('how_it_works')}
                  >
                    <Info size={14} />
                    <span>[ How AgriTrade Works ]</span>
                  </button>
                </div>
              </div>

              {/* AI Response Display Window */}
              <div className="ai-response-body">
                {aiLoading ? (
                  <div className="ai-loading-state">
                    <div className="ai-pulse-spinner" />
                    <span>Ari is thinking & analyzing market data...</span>
                  </div>
                ) : aiResponse ? (
                  <div className="ai-response-card">
                    <h4 className="response-title">{aiResponse.title}</h4>

                    {aiResponse.type === 'produce' && (
                      <div className="response-items-list">
                        {aiResponse.items.map((item, idx) => (
                          <div key={idx} className="mini-item-row">
                            <div>
                              <strong>{item.name}</strong>
                              <span className="sub-detail"> Grade: {item.grade} &bull; {item.origin}</span>
                            </div>
                            <span className="price-tag">{item.pricePerTon || '$340'}/Ton</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {aiResponse.type === 'contracts' && (
                      <div className="response-items-list">
                        {aiResponse.items.map((item, idx) => (
                          <div key={idx} className="mini-item-row">
                            <div>
                              <strong>{item.buyer}</strong>
                              <span className="sub-detail"> Item: {item.item || item.itemBought}</span>
                            </div>
                            <span className="status-badge">{item.status || 'Active'}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {aiResponse.type === 'text' && (
                      <p className="response-text-content">{aiResponse.text}</p>
                    )}

                    <button
                      className="enter-marketplace-action-btn"
                      onClick={handleExploreMarketplace}
                    >
                      <span>Explore Full Marketplace Now</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="ai-placeholder-state">
                    <MessageSquare size={32} className="placeholder-icon" />
                    <p>Select a quick action above or type a question to chat with Ari!</p>
                  </div>
                )}
              </div>

              {/* Custom Input Form */}
              <form className="ai-input-form" onSubmit={handleCustomSubmit}>
                <input
                  type="text"
                  placeholder="Ask Ari anything about crop prices, trading, or logistics..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                />
                <button type="submit" className="send-btn" disabled={!userQuery.trim()}>
                  <Send size={16} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}


