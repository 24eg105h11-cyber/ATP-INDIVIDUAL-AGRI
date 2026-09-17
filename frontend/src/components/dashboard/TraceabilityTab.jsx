import React from 'react'
import { Cpu, ShieldCheck, MapPin, QrCode, Thermometer, Droplets, Battery, Lock } from 'lucide-react'

export default function TraceabilityTab() {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
          IoT Cold-Chain & Traceability Provenance
        </h2>
        <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#a7f3d0', opacity: 0.8 }}>
          Real-time IoT telemetry, temperature monitoring, and immutable batch provenance.
        </p>
      </div>

      {/* Telemetry Grid */}
      <div className="stats-grid-4" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card-widget">
          <div className="card-top-row">
            <span className="card-label">Cargo Temperature</span>
            <div className="card-icon-box">
              <Thermometer size={20} />
            </div>
          </div>
          <span className="card-val" style={{ color: '#34d399' }}>4.2 °C</span>
          <span className="card-subtext">● Optimal Range (2°C - 6°C)</span>
        </div>

        <div className="stat-card-widget">
          <div className="card-top-row">
            <span className="card-label">Relative Humidity</span>
            <div className="card-icon-box">
              <Droplets size={20} />
            </div>
          </div>
          <span className="card-val">62 %</span>
          <span className="card-subtext">● Target Moisture Maintained</span>
        </div>

        <div className="stat-card-widget">
          <div className="card-top-row">
            <span className="card-label">IoT Telemetry Node</span>
            <div className="card-icon-box">
              <Cpu size={20} />
            </div>
          </div>
          <span className="card-val">NODE-884</span>
          <span className="card-subtext">
            <Battery size={14} /> Battery: 94% &bull; Signal: 5G
          </span>
        </div>

        <div className="stat-card-widget">
          <div className="card-top-row">
            <span className="card-label">Blockchain Record</span>
            <div className="card-icon-box">
              <Lock size={20} />
            </div>
          </div>
          <span className="card-val" style={{ fontSize: '1.1rem', color: '#a7f3d0' }}>
            0x8F4A...92B1
          </span>
          <span className="card-subtext">Verified Immutable Audit</span>
        </div>
      </div>

      {/* Interactive Traceability Box */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Left Provenance Details */}
        <div
          style={{
            padding: '1.6rem',
            borderRadius: '22px',
            background: 'rgba(6, 26, 18, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
            <ShieldCheck size={24} style={{ color: '#10b981' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
              Batch Provenance Certificate
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#94a3b8' }}>Batch ID</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>LOT-9842</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#94a3b8' }}>Origin GPS</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>38.8951° N, 97.8924° W</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#94a3b8' }}>Harvest Date</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>August 28, 2026</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem' }}>
              <span style={{ color: '#94a3b8' }}>Inspector Officer</span>
              <span style={{ fontWeight: 700, color: '#34d399' }}>David Inspector (Cert #8821)</span>
            </div>
          </div>
        </div>

        {/* Right QR Scanner Simulation */}
        <div
          style={{
            padding: '1.6rem',
            borderRadius: '22px',
            background: 'rgba(6, 26, 18, 0.6)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              padding: '1.2rem',
              borderRadius: '18px',
              background: '#ffffff',
              color: '#040d08',
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)'
            }}
          >
            <QrCode size={120} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
              Scan QR for Consumer Provenance
            </h4>
            <p style={{ margin: '0.3rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              End consumers scan this code on retail packaging to view full farm-to-table origin transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
