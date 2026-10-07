import React, { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { X, Download, ExternalLink, ShieldCheck, MapPin, Truck, Calendar, Sparkles } from 'lucide-react'

export default function QRViewModal({ shipment, isOpen, onClose, onTrack }) {
  const svgRef = useRef(null)

  if (!isOpen || !shipment) return null

  const trackingUrl = `${window.location.origin}/track/${shipment.qrToken || shipment.shipmentId}`

  const handleDownloadQR = () => {
    try {
      const svgElement = svgRef.current?.querySelector('svg')
      if (!svgElement) return

      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const URL = window.URL || window.webkitURL || window
      const blobURL = URL.createObjectURL(svgBlob)

      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 400
        canvas.height = 400
        const context = canvas.getContext('2d')

        // White background for clear scanning on paper/print
        context.fillStyle = '#FFFFFF'
        context.fillRect(0, 0, 400, 400)
        context.drawImage(image, 20, 20, 360, 360)

        const png = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = png
        downloadLink.download = `QR_${shipment.shipmentId}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
      image.src = blobURL
    } catch (e) {
      console.error('Download QR PNG error:', e)
    }
  }

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.82)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div
        className="modal-card"
        style={{
          background: 'rgba(6, 26, 18, 0.96)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '24px',
          padding: '2rem',
          maxWidth: '460px',
          width: '100%',
          color: '#ecfdf5',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(16, 185, 129, 0.2)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AgriTrade Smart Ledger QR
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* High Resolution Printable QR Badge */}
        <div
          ref={svgRef}
          style={{
            background: '#ffffff',
            padding: '1.2rem',
            borderRadius: '20px',
            display: 'inline-block',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            marginBottom: '1.2rem'
          }}
        >
          <QRCodeSVG value={trackingUrl} size={220} level="H" includeMargin={true} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: 0 }}>
          {shipment.shipmentId}
        </h3>
        <p style={{ margin: '0.2rem 0 1rem 0', color: '#34d399', fontWeight: 700, fontSize: '1.05rem' }}>
          {shipment.productName} ({shipment.quantity} {shipment.unit})
        </p>

        {/* Details Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '0.9rem',
            textAlign: 'left',
            fontSize: '0.84rem',
            color: '#d1fae5',
            marginBottom: '1.4rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem'
          }}
        >
          <div><strong>Route:</strong> {shipment.origin} → {shipment.destination}</div>
          <div><strong>Transporter:</strong> {shipment.transporter}</div>
          <div><strong>Current Status:</strong> <span style={{ color: '#34d399', fontWeight: 700 }}>{shipment.status}</span></div>
          <div><strong>Tracking URL:</strong> <code style={{ color: '#a7f3d0', fontSize: '0.75rem' }}>{trackingUrl}</code></div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button
            type="button"
            onClick={handleDownloadQR}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <Download size={16} />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose()
              onTrack(shipment.shipmentId)
            }}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <ExternalLink size={16} />
            <span>Track Live</span>
          </button>
        </div>
      </div>
    </div>
  )
}
