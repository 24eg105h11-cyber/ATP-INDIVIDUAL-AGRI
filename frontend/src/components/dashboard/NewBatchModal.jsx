import React, { useState } from 'react'
import { X, Sprout, Plus, ShieldCheck } from 'lucide-react'

export default function NewBatchModal({ onClose, onSubmitBatch, defaultItem }) {
  const [cropName, setCropName] = useState(defaultItem?.name || 'Organic Durum Wheat')
  const [quantity, setQuantity] = useState(defaultItem?.quantity || '450 Metric Tons')
  const [origin, setOrigin] = useState(defaultItem?.origin || 'Green Valley Farms, KS')
  const [price, setPrice] = useState(defaultItem?.pricePerTon || '₹28,500')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmitBatch({ cropName, quantity, origin, price })
  }

  return (
    <div className="dash-modal-backdrop">
      <div className="dash-modal-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}
            >
              <Sprout size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              {defaultItem ? 'Initiate Smart Contract' : 'Add New Harvest Batch'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a7f3d0' }}>
              Produce Item Name
            </label>
            <input
              type="text"
              required
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                background: 'rgba(4, 18, 10, 0.7)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#fff',
                marginTop: '0.3rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a7f3d0' }}>
              Quantity (Metric Tons)
            </label>
            <input
              type="text"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                background: 'rgba(4, 18, 10, 0.7)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#fff',
                marginTop: '0.3rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a7f3d0' }}>
              Origin Farm / Location
            </label>
            <input
              type="text"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                background: 'rgba(4, 18, 10, 0.7)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#fff',
                marginTop: '0.3rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a7f3d0' }}>
              Target Price / Metric Ton
            </label>
            <input
              type="text"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '0.7rem 0.9rem',
                borderRadius: '10px',
                background: 'rgba(4, 18, 10, 0.7)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#fff',
                marginTop: '0.3rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div
            style={{
              padding: '0.8rem',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.78rem',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <ShieldCheck size={16} />
            <span>Smart contract multi-sig escrow lock will auto-execute upon AI inspection clearance.</span>
          </div>

          <button
            type="submit"
            style={{
              padding: '0.85rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
            }}
          >
            {defaultItem ? 'Confirm Contract Escrow' : 'Register Harvest Batch'}
          </button>
        </form>
      </div>
    </div>
  )
}
