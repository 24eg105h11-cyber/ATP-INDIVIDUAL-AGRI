import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import OverviewTab from './OverviewTab'
import MarketplaceTab from './MarketplaceTab'
import TraceabilityTab from './TraceabilityTab'
import SettlementsTab from './SettlementsTab'
import ShipmentsTab from './ShipmentsTab'
import NewBatchModal from './NewBatchModal'
import { LayoutDashboard, ShoppingBag, MapPin, HandCoins, Truck, Plus, Check } from 'lucide-react'
import './Dashboard.css'

export default function HomePage({ user, onLogout, onGoLanding }) {
  const [activeTab, setActiveTab] = useState('shipments')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedContractItem, setSelectedContractItem] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)
  const [stats, setStats] = useState({
    totalProduceTons: '1,420 MT',
    verifiedQualityRate: '99.4%',
    activeShipments: 18,
    escrowSettled: '₹3,54,00,000'
  })

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats)
        }
      })
      .catch(() => {})
  }, [])

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => {
      setToastMsg(null)
    }, 4000)
  }

  const handleOpenContractModal = (item) => {
    setSelectedContractItem(item)
    setModalOpen(true)
  }

  const handleSubmitBatch = (batchData) => {
    setModalOpen(false)
    setSelectedContractItem(null)
    triggerToast(`[Success] Registered batch: ${batchData.cropName} (${batchData.quantity})`)
  }

  return (
    <div className="dashboard-root">
      {/* Background Atmosphere */}
      <div className="dashboard-bg-gradient" />
      <div className="dashboard-grid-pattern" />

      {/* Top Navbar */}
      <Navbar user={user} onLogout={onLogout} onGoHome={onGoLanding} />

      {/* Main Content Layout */}
      <main className="dash-content-wrap">
        {/* Welcome Greeting Banner */}
        <div className="dash-welcome-banner">
          <div>
            <h1 className="welcome-title">
              Welcome back, {user?.name || 'Agri Trader'} 👋
            </h1>
            <p className="welcome-sub">
              Logged in as <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ') || 'User'}</strong> &bull; AgriTrade Platform Real-time Operating System
            </p>
          </div>

          <button
            type="button"
            className="banner-action-btn"
            onClick={() => {
              setSelectedContractItem(null)
              setModalOpen(true)
            }}
          >
            <Plus size={18} />
            <span>Add New Harvest Batch</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="dash-tabs-bar">
          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'shipments' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipments')}
          >
            <Truck size={16} />
            <span>My Shipments & QR</span>
          </button>

          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={16} />
            <span>Overview</span>
          </button>

          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            <ShoppingBag size={16} />
            <span>Marketplace</span>
          </button>

          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'traceability' ? 'active' : ''}`}
            onClick={() => setActiveTab('traceability')}
          >
            <MapPin size={16} />
            <span>Traceability</span>
          </button>

          <button
            type="button"
            className={`dash-tab-btn ${activeTab === 'settlements' ? 'active' : ''}`}
            onClick={() => setActiveTab('settlements')}
          >
            <HandCoins size={16} />
            <span>Escrow & Settlements</span>
          </button>
        </div>

        {/* Active Tab View Render */}
        {activeTab === 'shipments' && (
          <ShipmentsTab user={user} />
        )}

        {activeTab === 'overview' && (
          <OverviewTab
            user={user}
            stats={stats}
            onOpenNewBatch={() => setModalOpen(true)}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceTab onSelectContract={handleOpenContractModal} />
        )}

        {activeTab === 'traceability' && <TraceabilityTab />}

        {activeTab === 'settlements' && (
          <SettlementsTab triggerToast={triggerToast} />
        )}
      </main>

      {/* New Harvest Batch / Contract Modal */}
      {modalOpen && (
        <NewBatchModal
          defaultItem={selectedContractItem}
          onClose={() => setModalOpen(false)}
          onSubmitBatch={handleSubmitBatch}
        />
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            padding: '0.85rem 1.4rem',
            borderRadius: '14px',
            background: 'rgba(6, 26, 18, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            color: '#34d399',
            fontWeight: 700,
            fontSize: '0.88rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}
        >
          <Check size={18} />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  )
}
