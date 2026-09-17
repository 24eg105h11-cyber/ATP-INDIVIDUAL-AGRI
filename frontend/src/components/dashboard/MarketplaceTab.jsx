import React, { useState, useEffect } from 'react'
import { ShieldCheck, MapPin, Calendar, FileText, CheckCircle2, ShoppingCart } from 'lucide-react'

export default function MarketplaceTab({ onSelectContract }) {
  const [items, setItems] = useState([
    {
      id: 'prod_01',
      name: 'Organic Durum Wheat',
      category: 'Grains',
      grade: 'A+',
      qualityScore: 99.4,
      origin: 'Green Valley Farms, KS',
      farmer: 'John Farmer',
      quantity: '450 Metric Tons',
      pricePerTon: '$340',
      status: 'Verified & Available',
      harvestDate: '2026-08-28',
      moisture: '11.8%',
      pesticideFree: true
    },
    {
      id: 'prod_02',
      name: 'Arabica Coffee Beans',
      category: 'Specialty',
      grade: 'AAA',
      qualityScore: 98.9,
      origin: 'Highland Estate, Rift Valley',
      farmer: 'Samuel K.',
      quantity: '120 Metric Tons',
      pricePerTon: '$1,850',
      status: 'In Transit',
      harvestDate: '2026-09-02',
      moisture: '10.5%',
      pesticideFree: true
    },
    {
      id: 'prod_03',
      name: 'Hass Avocados',
      category: 'Fruits',
      grade: 'A',
      qualityScore: 96.8,
      origin: 'SunRidge Orchards',
      farmer: 'Maria Lopez',
      quantity: '85 Metric Tons',
      pricePerTon: '$1,200',
      status: 'Quality Passed',
      harvestDate: '2026-09-05',
      moisture: '68.0%',
      pesticideFree: true
    },
    {
      id: 'prod_04',
      name: 'Long-Staple Premium Cotton',
      category: 'Fiber',
      grade: 'AAA',
      qualityScore: 99.1,
      origin: 'Delta Cooperative',
      farmer: 'John Farmer',
      quantity: '300 Metric Tons',
      pricePerTon: '$890',
      status: 'Verified & Available',
      harvestDate: '2026-08-15',
      moisture: '7.2%',
      pesticideFree: true
    }
  ])

  useEffect(() => {
    fetch('/api/produce')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.produce?.length > 0) {
          setItems(data.produce)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
            Agricultural Produce Marketplace
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#a7f3d0', opacity: 0.8 }}>
            Direct farmer-to-buyer contracts with AI-verified quality certificates.
          </p>
        </div>
      </div>

      {/* Produce Cards Grid */}
      <div className="produce-grid">
        {items.map((prod) => (
          <div key={prod.id} className="produce-card">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="produce-grade-badge">
                  <ShieldCheck size={14} />
                  Grade {prod.grade} ({prod.qualityScore}%)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                  {prod.category}
                </span>
              </div>

              <h3 className="produce-title">{prod.name}</h3>

              <div className="produce-origin">
                <MapPin size={14} />
                <span>{prod.origin} &bull; {prod.farmer}</span>
              </div>
            </div>

            <div className="produce-spec-grid">
              <div className="spec-item">
                <span className="spec-lbl">Quantity</span>
                <span className="spec-val">{prod.quantity}</span>
              </div>
              <div className="spec-item">
                <span className="spec-lbl">Price / Ton</span>
                <span className="spec-val" style={{ color: '#34d399' }}>{prod.pricePerTon}</span>
              </div>
              <div className="spec-item">
                <span className="spec-lbl">Moisture</span>
                <span className="spec-val">{prod.moisture}</span>
              </div>
              <div className="spec-item">
                <span className="spec-lbl">Pesticide Free</span>
                <span className="spec-val" style={{ color: '#34d399' }}>
                  <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '3px' }} />
                  Verified
                </span>
              </div>
            </div>

            <button
              type="button"
              className="buy-contract-btn"
              onClick={() => onSelectContract(prod)}
            >
              <ShoppingCart size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Initiate Smart Contract
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
