import React, { useState, useEffect } from 'react'
import {
  Package,
  Truck,
  QrCode,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  RefreshCw,
  Sparkles,
  Layers,
  ChevronRight,
  Camera
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import CreateShipmentModal from './CreateShipmentModal'
import QRViewModal from './QRViewModal'
import QRScannerModal from './QRScannerModal'
import ShipmentTrackingView from './ShipmentTrackingView'
import FarmerGuideWidget from '../ui/FarmerGuideWidget'

export default function ShipmentsTab({ user }) {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState('grid') // 'grid' or 'qr_library'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [sortOrder, setSortOrder] = useState('newest')
  
  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [scannerModalOpen, setScannerModalOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [trackingShipmentId, setTrackingShipmentId] = useState(null)
  
  // VRoid Guide state
  const [guideState, setGuideState] = useState('shipment_view')

  const fetchShipments = async () => {
    setLoading(true)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
    try {
      const res = await fetch(`${API_BASE_URL}/api/shipments/farmer/${user?.id || '2'}`)
      const data = await res.json()
      if (data.success && data.shipments && data.shipments.length > 0) {
        setShipments(data.shipments)
        setLoading(false)
        return
      }
    } catch (err) {
      console.warn('Failed to fetch shipments from API, initializing local seed state:', err)
    }

    // Default Seed Fallback if API offline or returning empty
    setShipments([
      {
        _id: 'shp_001',
        shipmentId: 'SHP-2026-00125',
        farmerId: '2',
        farmerName: user?.name || 'John Farmer',
        productName: 'Organic Durum Wheat',
        quantity: 500,
        unit: 'Metric Tons',
        origin: 'Hyderabad, TS',
        destination: 'Mumbai, MH',
        transporter: 'AgriExpress Logistics',
        expectedDelivery: new Date('2026-10-12'),
        status: 'In Transit',
        qrToken: 'qr_token_shp_2026_00125',
        trackingHistory: [
          { status: 'Created', location: 'Hyderabad Farm', description: 'Harvest batch registered & QR generated.', timestamp: new Date('2026-10-01T08:30:00Z') },
          { status: 'Picked Up', location: 'Hyderabad Central Logistics Hub', description: 'Produce loaded onto GPS-monitored refrigerated vehicle.', timestamp: new Date('2026-10-02T10:15:00Z') },
          { status: 'In Transit', location: 'Solapur NH-65 Checkpoint', description: 'IoT sensor reporting optimal moisture and 18°C cargo temp.', timestamp: new Date('2026-10-04T14:45:00Z') }
        ],
        createdAt: new Date('2026-10-01T08:30:00Z'),
        updatedAt: new Date('2026-10-04T14:45:00Z')
      },
      {
        _id: 'shp_002',
        shipmentId: 'SHP-2026-00126',
        farmerId: '2',
        farmerName: user?.name || 'John Farmer',
        productName: 'Arabica Coffee Beans',
        quantity: 120,
        unit: 'Metric Tons',
        origin: 'Coorg, KA',
        destination: 'Bengaluru Port, KA',
        transporter: 'SouthAgri Freight',
        expectedDelivery: new Date('2026-10-09'),
        status: 'Picked Up',
        qrToken: 'qr_token_shp_2026_00126',
        trackingHistory: [
          { status: 'Created', location: 'Highland Estate, Coorg', description: 'Sacks sealed and AAA grade verification attached.', timestamp: new Date('2026-10-03T09:00:00Z') },
          { status: 'Picked Up', location: 'Coorg Collection Depot', description: 'Transporter scanned QR and assumed chain of custody.', timestamp: new Date('2026-10-04T11:20:00Z') }
        ],
        createdAt: new Date('2026-10-03T09:00:00Z'),
        updatedAt: new Date('2026-10-04T11:20:00Z')
      }
    ])
    setLoading(false)
  }

  useEffect(() => {
    fetchShipments()
  }, [user])

  const handleCreatedShipment = (newShipment) => {
    setShipments(prev => [newShipment, ...prev])
    setGuideState('verify_success')
  }

  const handleOpenTracking = (shpId) => {
    setTrackingShipmentId(shpId)
    setGuideState('in_transit')
  }

  const handleScanSuccess = (shpId) => {
    setTrackingShipmentId(shpId)
    setGuideState('verify_success')
  }

  // Filter & Sort Logic
  const filteredShipments = shipments
    .filter(s => {
      const matchSearch =
        s.shipmentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.transporter.toLowerCase().includes(searchQuery.toLowerCase())

      const matchStatus = selectedStatus === 'All' || s.status === selectedStatus

      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortOrder === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sortOrder === 'quantity') return b.quantity - a.quantity
      return 0
    })

  // Dashboard Summary Counters
  const totalShipments = shipments.length
  const activeCount = shipments.filter(s => s.status !== 'Delivered').length
  const inTransitCount = shipments.filter(s => s.status === 'In Transit').length
  const deliveredCount = shipments.filter(s => s.status === 'Delivered').length
  const pendingCount = shipments.filter(s => s.status === 'Created' || s.status === 'Picked Up').length

  if (trackingShipmentId) {
    return (
      <ShipmentTrackingView
        shipmentId={trackingShipmentId}
        onBack={() => {
          setTrackingShipmentId(null)
          setGuideState('shipment_view')
        }}
      />
    )
  }

  return (
    <div className="shipments-tab-root" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <FarmerGuideWidget guideState={guideState} />

      {/* Top Controls & Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.8rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ecfdf5', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Truck size={26} color="#34d399" /> Shipment Ledger & QR Portal
          </h2>
          <p style={{ margin: '0.3rem 0 0 0', color: '#9ca3af', fontSize: '0.9rem' }}>
            Track produce batches, generate QR codes & monitor supply chain telemetry
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              setScannerModalOpen(true)
              setGuideState('scan_qr')
            }}
            style={{
              padding: '0.65rem 1.2rem',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s ease'
            }}
          >
            <Camera size={18} />
            <span>Scan QR Code</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setCreateModalOpen(true)
              setGuideState('create_shipment')
            }}
            style={{
              padding: '0.65rem 1.4rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              color: '#fff',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
            }}
          >
            <Plus size={18} />
            <span>Create Shipment</span>
          </button>
        </div>
      </div>

      {/* 5 Summary Counters Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ background: 'rgba(6, 26, 18, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '1.1rem', backdropFilter: 'blur(12px)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Total Shipments</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>{totalShipments}</div>
        </div>

        <div style={{ background: 'rgba(6, 26, 18, 0.8)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '16px', padding: '1.1rem', backdropFilter: 'blur(12px)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase' }}>Active Shipments</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa', marginTop: '0.2rem' }}>{activeCount}</div>
        </div>

        <div style={{ background: 'rgba(6, 26, 18, 0.8)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '16px', padding: '1.1rem', backdropFilter: 'blur(12px)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fcd34d', textTransform: 'uppercase' }}>In Transit</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '0.2rem' }}>{inTransitCount}</div>
        </div>

        <div style={{ background: 'rgba(6, 26, 18, 0.8)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '16px', padding: '1.1rem', backdropFilter: 'blur(12px)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a7f3d0', textTransform: 'uppercase' }}>Delivered</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginTop: '0.2rem' }}>{deliveredCount}</div>
        </div>

        <div style={{ background: 'rgba(6, 26, 18, 0.8)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '16px', padding: '1.1rem', backdropFilter: 'blur(12px)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d8b4fe', textTransform: 'uppercase' }}>Pending Pickup</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc', marginTop: '0.2rem' }}>{pendingCount}</div>
        </div>
      </div>

      {/* Sub-Tab Switcher & Filter Bar */}
      <div style={{ background: 'rgba(6, 26, 18, 0.85)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '18px', padding: '1.2rem', marginBottom: '1.8rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          {/* Sub Tab Buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.3)', padding: '4px', borderRadius: '12px' }}>
            <button
              type="button"
              onClick={() => setActiveSubTab('grid')}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'grid' ? '#10b981' : 'transparent',
                color: activeSubTab === 'grid' ? '#fff' : '#9ca3af',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Package size={16} />
              <span>My Shipments</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('qr_library')}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                background: activeSubTab === 'qr_library' ? '#10b981' : 'transparent',
                color: activeSubTab === 'qr_library' ? '#fff' : '#9ca3af',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <QrCode size={16} />
              <span>QR Library ({totalShipments})</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <input
                type="text"
                placeholder="Search shipment ID, product, route..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.8rem 0.55rem 2.2rem', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}
              />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: '0.55rem 0.9rem', background: '#03100a', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}
            >
              <option value="All">All Statuses</option>
              <option value="Created">Created</option>
              <option value="Picked Up">Picked Up</option>
              <option value="In Transit">In Transit</option>
              <option value="At Distribution Center">At Distribution Center</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ padding: '0.55rem 0.9rem', background: '#03100a', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', color: '#fff', fontSize: '0.85rem' }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="quantity">Sort: Highest Quantity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Views */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#34d399' }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 1rem auto' }} />
          <p>Loading Shipments Ledger...</p>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3.5rem', background: 'rgba(6, 26, 18, 0.5)', border: '1px border-dashed rgba(16, 185, 129, 0.3)', borderRadius: '20px', color: '#9ca3af' }}>
          <Package size={48} style={{ margin: '0 auto 1rem auto', color: '#10b981' }} />
          <h3>No Shipments Found</h3>
          <p>No shipment matches your current filter or query criteria.</p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedStatus('All'); setCreateModalOpen(true); }}
            style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
          >
            Create New Shipment
          </button>
        </div>
      ) : activeSubTab === 'grid' ? (
        /* MY SHIPMENTS CARDS GRID */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.4rem'
          }}
        >
          {filteredShipments.map((shp) => {
            const trackingUrl = `${window.location.origin}/track/${shp.qrToken || shp.shipmentId}`

            return (
              <div
                key={shp.shipmentId}
                className="shipment-card"
                style={{
                  background: 'rgba(6, 26, 18, 0.85)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '20px',
                  padding: '1.4rem',
                  backdropFilter: 'blur(12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div>
                  {/* Top Card Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'block' }}>
                        {shp.shipmentId}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                        Created: {new Date(shp.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span
                      style={{
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        background: shp.status === 'Delivered' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(59, 130, 246, 0.25)',
                        border: `1px solid ${shp.status === 'Delivered' ? '#10b981' : '#3b82f6'}`,
                        color: shp.status === 'Delivered' ? '#34d399' : '#60a5fa'
                      }}
                    >
                      {shp.status}
                    </span>
                  </div>

                  {/* Product & Route Info */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                    <div
                      onClick={() => { setSelectedShipment(shp); setQrModalOpen(true); }}
                      style={{ background: '#fff', padding: '6px', borderRadius: '10px', cursor: 'pointer', flexShrink: 0 }}
                      title="Click to view QR"
                    >
                      <QRCodeSVG value={trackingUrl} size={64} />
                    </div>

                    <div>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ecfdf5', display: 'block' }}>
                        {shp.productName}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700 }}>
                        {shp.quantity} {shp.unit}
                      </span>
                      <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '0.2rem' }}>
                        📍 {shp.origin} → {shp.destination}
                      </div>
                    </div>
                  </div>

                  {/* Transporter & Expected Date */}
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: '10px', fontSize: '0.8rem', color: '#d1fae5', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div>🚚 <strong>Transporter:</strong> {shp.transporter}</div>
                    <div>📅 <strong>Expected:</strong> {new Date(shp.expectedDelivery).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => { setSelectedShipment(shp); setQrModalOpen(true); }}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <QrCode size={14} /> View QR
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTracking(shp.shipmentId)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: '#10b981',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Truck size={14} /> Track Live
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* QR LIBRARY VIEW */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.4rem'
          }}
        >
          {filteredShipments.map((shp) => {
            const trackingUrl = `${window.location.origin}/track/${shp.qrToken || shp.shipmentId}`

            return (
              <div
                key={shp.shipmentId}
                className="qr-library-card"
                style={{
                  background: 'rgba(6, 26, 18, 0.9)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* High Resolution QR display */}
                <div
                  onClick={() => { setSelectedShipment(shp); setQrModalOpen(true); }}
                  style={{
                    background: '#ffffff',
                    padding: '0.9rem',
                    borderRadius: '16px',
                    marginBottom: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                  }}
                  title="Click to view full QR card"
                >
                  <QRCodeSVG value={trackingUrl} size={150} level="M" />
                </div>

                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                  {shp.shipmentId}
                </span>

                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', margin: '0.2rem 0' }}>
                  {shp.productName} ({shp.quantity} {shp.unit})
                </span>

                <span style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.6rem' }}>
                  {shp.origin} → {shp.destination}
                </span>

                <span
                  style={{
                    padding: '0.25rem 0.7rem',
                    borderRadius: '9999px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    background: shp.status === 'Delivered' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(59, 130, 246, 0.25)',
                    border: `1px solid ${shp.status === 'Delivered' ? '#10b981' : '#3b82f6'}`,
                    color: shp.status === 'Delivered' ? '#34d399' : '#60a5fa',
                    marginBottom: '1.2rem'
                  }}
                >
                  Status: {shp.status}
                </span>

                {/* Library Buttons */}
                <div style={{ display: 'flex', gap: '0.6rem', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => { setSelectedShipment(shp); setQrModalOpen(true); }}
                    style={{
                      flex: 1,
                      padding: '0.55rem',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Eye size={14} /> View QR
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenTracking(shp.shipmentId)}
                    style={{
                      flex: 1,
                      padding: '0.55rem',
                      borderRadius: '8px',
                      background: '#10b981',
                      border: 'none',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Truck size={14} /> Track
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Render Modals */}
      <CreateShipmentModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleCreatedShipment}
        user={user}
      />

      <QRScannerModal
        isOpen={scannerModalOpen}
        onClose={() => setScannerModalOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      <QRViewModal
        shipment={selectedShipment}
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        onTrack={handleOpenTracking}
      />
    </div>
  )
}
