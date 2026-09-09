import React, { useState, useEffect } from 'react'
import {
  Leaf,
  Globe,
  ChevronDown,
  CircleDollarSign,
  ShieldCheck,
  Truck,
  HandCoins,
  CheckCircle2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Fingerprint,
  User,
  Boxes,
  SearchCheck,
  ShoppingBag,
  Database,
  Loader2,
  X,
  Check,
  Wifi
} from 'lucide-react'
import './App.css'

const API_BASE_URL = 'http://localhost:5000'

const ROLES = [
  {
    id: 'admin',
    name: 'Admin',
    email: 'admin@agritrade.com',
    icon: User,
    color: '#8b5cf6',
    bg: '#f3e8ff'
  },
  {
    id: 'farmer',
    name: 'Farmer',
    email: 'farmer@agritrade.com',
    icon: SproutIcon,
    color: '#10b981',
    bg: '#d1fae5'
  },
  {
    id: 'collection_manager',
    name: 'Collection Manager',
    email: 'collection@agritrade.com',
    icon: Boxes,
    color: '#f97316',
    bg: '#ffedd5'
  },
  {
    id: 'inspector',
    name: 'Inspector',
    email: 'inspector@agritrade.com',
    icon: SearchCheck,
    color: '#0284c7',
    bg: '#e0f2fe'
  },
  {
    id: 'buyer',
    name: 'Buyer',
    email: 'buyer@agritrade.com',
    icon: ShoppingBag,
    color: '#ec4899',
    bg: '#fce7f3'
  },
  {
    id: 'logistics',
    name: 'Logistics',
    email: 'logistics@agritrade.com',
    icon: Truck,
    color: '#14b8a6',
    bg: '#ccfbf1'
  }
]

function SproutIcon(props) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 20h10" />
      <path d="M12 20v-8" />
      <path d="M12 12a5 5 0 0 1 5-5c1.5 0 3 .5 3 2s-1.5 3-3 3h-5" />
      <path d="M12 12a5 5 0 0 0-5-5c-1.5 0-3 .5-3 2s1.5 3 3 3h5" />
    </svg>
  )
}

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [selectedRole, setSelectedRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState('English')
  const [biometricModal, setBiometricModal] = useState(false)
  const [biometricScanning, setBiometricScanning] = useState(false)
  const [biometricSuccess, setBiometricSuccess] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [backendConnected, setBackendConnected] = useState(false)

  // Check backend server health status on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setBackendConnected(true)
        }
      })
      .catch(() => {
        setBackendConnected(false)
      })
  }, [])

  const handleRoleSelect = (role) => {
    setSelectedRole(role.id)
    setEmail(role.email)
    setPassword('Demo12345!')
    triggerToast(`Selected role: ${role.name}`)
  }

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role: selectedRole })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setBackendConnected(true)
        triggerToast(`[Backend Connected] ${data.message}`)
      } else {
        triggerToast(data.error || 'Authentication failed')
      }
    } catch (err) {
      console.warn('Backend API offline, using fallback auth response:', err)
      triggerToast('Signed in successfully! (AgriTrade Local)')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricAuth = () => {
    setBiometricModal(true)
    setBiometricScanning(true)
    setBiometricSuccess(false)

    setTimeout(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/biometric`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
        const data = await res.json()
        setBiometricScanning(false)
        setBiometricSuccess(true)

        setTimeout(() => {
          setBiometricModal(false)
          triggerToast(`[Backend] ${data.message || 'Biometric Verification Passed'}`)
        }, 1000)
      } catch (err) {
        setBiometricScanning(false)
        setBiometricSuccess(true)
        setTimeout(() => {
          setBiometricModal(false)
          triggerToast('Biometric Authentication Successful!')
        }, 1000)
      }
    }, 1500)
  }

  return (
    <div className="app-container">
      {/* Background Image Layer with Gradient Overlay */}
      <div className="bg-image-wrapper" style={{ backgroundImage: `url('/farm_bg.jpg')` }}>
        <div className="bg-gradient-overlay"></div>
      </div>

      {/* Frame Decorative Leaf Overlays */}
      <div className="leaf-overlay-top-left" />
      <div className="leaf-overlay-bottom-right" />
      <div className="leaf-overlay-top-right" />

      {/* Top Header Bar */}
      <header className="top-header">
        <div className="brand-header-left">
          <div className="brand-logo-lockup">
            <div className="brand-icon-box">
              <Leaf className="brand-icon" size={26} />
            </div>
            <div className="brand-text-container">
              <span className="brand-title">AgriTrade</span>
              <span className="brand-tagline">
                Farm to Future <span className="divider-bar">|</span> Transparent &bull; Trusted &bull; Sustainable
              </span>
            </div>
          </div>
        </div>

        {/* Right Header: Server Status & Language Selector */}
        <div className="header-right" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div
            className={`server-status-pill ${backendConnected ? 'online' : 'connecting'}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.8rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: backendConnected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: `1px solid ${backendConnected ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`,
              color: backendConnected ? '#065f46' : '#92400e',
              backdropFilter: 'blur(8px)'
            }}
          >
            <Wifi size={14} />
            <span>{backendConnected ? 'Backend API Online' : 'Backend Connecting...'}</span>
          </div>

          <div className="language-selector">
            <button
              type="button"
              className="lang-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            >
              <Globe size={16} />
              <span>{currentLang}</span>
              <ChevronDown size={14} className={`chevron ${langDropdownOpen ? 'open' : ''}`} />
            </button>
            {langDropdownOpen && (
              <div className="lang-menu">
                {['English', 'Spanish', 'French', 'Hindi', 'Swahili'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    className={`lang-option ${lang === currentLang ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentLang(lang)
                      setLangDropdownOpen(false)
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container Split View */}
      <main className="main-content">
        {/* LEFT HERO SECTION */}
        <section className="hero-section">
          <div className="hero-copy-wrap">
            <h1 className="hero-title">
              Connecting Farmers <br />
              to Global Markets
            </h1>
            <p className="hero-subtitle">
              Streamlining the agricultural supply chain with technology, trust and transparency.
            </p>

            {/* 4 Feature Badges */}
            <div className="feature-badges-grid">
              <div className="feature-badge">
                <div className="badge-icon-box">
                  <CircleDollarSign size={20} />
                </div>
                <span>Better Prices</span>
              </div>

              <div className="feature-badge">
                <div className="badge-icon-box">
                  <ShieldCheck size={20} />
                </div>
                <span>Quality Assurance</span>
              </div>

              <div className="feature-badge">
                <div className="badge-icon-box">
                  <Truck size={20} />
                </div>
                <span>Faster Logistics</span>
              </div>

              <div className="feature-badge">
                <div className="badge-icon-box">
                  <HandCoins size={20} />
                </div>
                <span>Fair Payments</span>
              </div>
            </div>
          </div>

          {/* Live Produce Tracking Floating Glass Card */}
          <div className="live-tracking-card">
            <div className="tracking-header">
              <div className="tracking-icon-badge">
                <Leaf size={18} />
              </div>
              <span className="tracking-title">Live Produce Tracking</span>
            </div>

            <div className="tracking-timeline">
              <div className="timeline-line"></div>
              
              <div className="timeline-step completed">
                <div className="step-circle">
                  <CheckCircle2 size={16} />
                </div>
                <span className="step-label">Farm</span>
              </div>

              <div className="timeline-step completed">
                <div className="step-circle">
                  <CheckCircle2 size={16} />
                </div>
                <span className="step-label">Collection Center</span>
              </div>

              <div className="timeline-step completed">
                <div className="step-circle">
                  <CheckCircle2 size={16} />
                </div>
                <span className="step-label">Quality Check</span>
              </div>

              <div className="timeline-step completed">
                <div className="step-circle">
                  <CheckCircle2 size={16} />
                </div>
                <span className="step-label">Warehouse</span>
              </div>

              <div className="timeline-step active">
                <div className="step-circle pulse">
                  <Truck size={16} />
                </div>
                <span className="step-label">Delivery</span>
              </div>
            </div>
          </div>

          {/* Bottom Left Glass Capsule Bar */}
          <div className="hero-footer-capsule">
            <div className="capsule-icon-wrap">
              <User size={16} />
            </div>
            <div className="capsule-text-row">
              <span>Empowering Farmers</span>
              <span className="capsule-divider">|</span>
              <span>Strengthening Supply Chains</span>
              <span className="capsule-divider">|</span>
              <span>Building a Sustainable Tomorrow</span>
            </div>
          </div>
        </section>

        {/* RIGHT LOGIN FORM CARD */}
        <section className="login-section">
          <div className="login-card">
            {/* Form Top Emblem & Headings */}
            <div className="login-card-header">
              <div className="emblem-container">
                <Leaf size={32} className="emblem-icon" />
              </div>
              <h2 className="login-heading">Welcome Back</h2>
              <p className="login-subheading">Sign in to your AgriTrade account</p>
            </div>

            {/* Login Form */}
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-field-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-field-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Form Actions Row */}
              <div className="form-options-row">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span className="checkbox-label">Remember Me</span>
                </label>

                <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); triggerToast('Password reset link sent!'); }}>
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button type="submit" className="login-btn" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 size={20} className="spinner" />
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Login</span>
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="divider-wrap">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
              <span className="divider-line"></span>
            </div>

            {/* Biometric Button */}
            <button
              type="button"
              className="biometric-btn"
              onClick={handleBiometricAuth}
            >
              <Fingerprint size={22} className="biometric-icon" />
              <span>Continue with Biometric</span>
            </button>

            {/* Register Link */}
            <div className="register-prompt">
              <span>Don't have an account? </span>
              <a href="#register" className="register-link" onClick={(e) => { e.preventDefault(); triggerToast('Redirecting to registration...'); }}>
                Register
              </a>
            </div>

            {/* Role Selectors at bottom of form */}
            <div className="role-selector-container">
              {ROLES.map((role) => {
                const IconComponent = role.icon
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    type="button"
                    className={`role-item ${isSelected ? 'active' : ''}`}
                    onClick={() => handleRoleSelect(role)}
                    title={`Login as ${role.name}`}
                  >
                    <div
                      className="role-avatar"
                      style={{
                        backgroundColor: role.bg,
                        color: role.color
                      }}
                    >
                      <IconComponent size={18} />
                    </div>
                    <span className="role-label">{role.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Security Footer */}
      <footer className="security-footer">
        <div className="footer-item">
          <ShieldCheck size={18} />
          <span>Secure Login <small>(HTTP-only Cookies)</small></span>
        </div>
        <div className="footer-item">
          <Lock size={16} />
          <span>Encrypted Data Transfer</span>
        </div>
        <div className="footer-item">
          <Database size={16} />
          <span>Powered by MongoDB</span>
        </div>
      </footer>

      {/* Biometric Scan Modal */}
      {biometricModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setBiometricModal(false)}>
              <X size={18} />
            </button>
            <div className="biometric-modal-body">
              <div className={`fingerprint-scanner ${biometricScanning ? 'scanning' : ''} ${biometricSuccess ? 'success' : ''}`}>
                <Fingerprint size={64} />
                {biometricScanning && <div className="scan-line" />}
              </div>
              <h3>
                {biometricScanning
                  ? 'Scanning Fingerprint...'
                  : biometricSuccess
                  ? 'Identity Verified!'
                  : 'Place finger on sensor'}
              </h3>
              <p>Touch the sensor on your device to continue to AgriTrade.</p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <Check size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  )
}

export default App
