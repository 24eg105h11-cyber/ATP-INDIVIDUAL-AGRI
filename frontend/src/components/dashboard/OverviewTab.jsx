import React from 'react'
import {
  Boxes,
  ShieldCheck,
  Truck,
  HandCoins,
  CheckCircle2,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react'

export default function OverviewTab({ user, stats, onOpenNewBatch }) {
  return (
    <div>
      {/* 4 Stat Widgets */}
      <div className="stats-grid-4">
        <div className="stat-card-widget">
          <div className="card-top-row">
            <span className="card-label">Total Produce Volume</span>
            <div className="card-icon-box">
              <Boxes size={20} />
            </div>
          </div>
          <span className="card-val">{stats?.totalProduceTons || '1,420 MT'}</span>
          <span className="card-subtext">
            <TrendingUp size={14} /> +12.4% vs last month
          </span>
        </div>

        <div className="stat-card-widget">
          <div className="card-top-row">
            <span className="card-label">Quality Assurance</span>
            <div className="card-icon-box">
              <ShieldCheck size={20} />
            </div>
          </div>
          <span className="card-val">{stats?.verifiedQualityRate || '99.4%'}</span>
          <span className="card-subtext">
            <CheckCircle2 size={14} /> AI Grade Verified
          </span>
        </div>

        <div className="stat-card-widget">
          <div className="card-top-row">
            <span className="card-label">Active Shipments</span>
            <div className="card-icon-box">
              <Truck size={20} />
            </div>
          </div>
          <span className="card-val">{stats?.activeShipments || '18'}</span>
          <span className="card-subtext">
            <MapPin size={14} /> IoT Cold-Chain Monitored
          </span>
        </div>

        <div className="stat-card-widget">
          <div className="card-top-row">
            <span className="card-label">Total Escrow Settled</span>
            <div className="card-icon-box">
              <HandCoins size={20} />
            </div>
          </div>
          <span className="card-val">{stats?.escrowSettled || '₹3,54,00,000'}</span>
          <span className="card-subtext">
            <Clock size={14} /> &lt; 2 Sec Automated Payouts
          </span>
        </div>
      </div>

      {/* Live Supply Chain Transit Tracker */}
      <div className="timeline-card-wrap">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
              Live Supply Chain Provenance Tracker
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#a7f3d0', opacity: 0.8 }}>
              Batch #LOT-9842: Organic Durum Wheat (450 MT) &bull; Green Valley Farms ➔ Port Terminal
            </p>
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.3rem 0.75rem',
              borderRadius: '999px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}
          >
            ● IN TRANSIT
          </span>
        </div>

        <div className="timeline-steps-row">
          <div className="t-step done">
            <div className="t-circle">
              <CheckCircle2 size={20} />
            </div>
            <span className="t-label">1. Harvested</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Aug 28</span>
          </div>

          <div className="t-step done">
            <div className="t-circle">
              <CheckCircle2 size={20} />
            </div>
            <span className="t-label">2. Collection</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Aug 30</span>
          </div>

          <div className="t-step done">
            <div className="t-circle">
              <CheckCircle2 size={20} />
            </div>
            <span className="t-label">3. AI Grade (A+)</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Sep 02</span>
          </div>

          <div className="t-step active">
            <div className="t-circle">
              <Truck size={22} />
            </div>
            <span className="t-label">4. IoT Logistics</span>
            <span style={{ fontSize: '0.7rem', color: '#34d399' }}>Temp: 4.2°C</span>
          </div>

          <div className="t-step">
            <div className="t-circle">
              <HandCoins size={20} />
            </div>
            <span className="t-label">5. Buyer Payout</span>
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Pending</span>
          </div>
        </div>
      </div>

      {/* Recent Platform Activity Feed */}
      <div
        style={{
          padding: '1.6rem',
          borderRadius: '22px',
          background: 'rgba(6, 26, 18, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}
      >
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800 }}>
          Recent Activity Feed
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {[
            { text: 'Smart contract CTR-8841 executed for 450 MT Organic Durum Wheat.', time: '10 mins ago', type: 'contract' },
            { text: 'AI Inspection report generated: Batch #LOT-9842 scored 99.4% Grade A+.', time: '35 mins ago', type: 'quality' },
            { text: 'IoT Telemetry Alert: Cold-chain Fleet #142 temperature stabilized at 4.0°C.', time: '1 hour ago', type: 'logistics' },
            { text: 'Escrow Payout of ₹1,28,25,000 released to John Farmer.', time: '2 hours ago', type: 'payout' }
          ].map((act, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'rgba(4, 18, 10, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{act.text}</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', minWidth: '90px', textAlign: 'right' }}>
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
