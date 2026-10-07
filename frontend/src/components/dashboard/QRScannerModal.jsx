import React, { useEffect, useState, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, X, RefreshCw, AlertTriangle, ShieldCheck, Search, QrCode } from 'lucide-react'

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [scanResult, setScanResult] = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const [manualInput, setManualInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [scannerActive, setScannerActive] = useState(false)

  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      stopScanner()
      return
    }

    setScanResult(null)
    setCameraError(null)
    setIsProcessing(false)

    // Give DOM time to render reader div
    const timer = setTimeout(() => {
      startScanner()
    }, 300)

    return () => {
      clearTimeout(timer)
      stopScanner()
    }
  }, [isOpen])

  const startScanner = async () => {
    try {
      if (!document.getElementById('qr-reader-viewport')) return

      const html5QrCode = new Html5Qrcode('qr-reader-viewport')
      html5QrCodeRef.current = html5QrCode

      const config = { fps: 10, qrbox: { width: 220, height: 220 } }

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText) => {
          handleScannedCode(decodedText)
        },
        (errorMessage) => {
          // Ignore transient frame scan errors
        }
      )
      setScannerActive(true)
    } catch (err) {
      console.warn('Camera scan initialization failed or permission denied:', err)
      setCameraError('Camera unavailable or permission denied. You can enter shipment ID / token manually below.')
      setScannerActive(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current.clear()
      } catch (e) {
        console.warn('Error stopping scanner:', e)
      }
    }
    setScannerActive(false)
  }

  const handleScannedCode = async (codeText) => {
    if (isProcessing) return
    setIsProcessing(true)
    setScanResult(codeText)
    stopScanner()

    // Extract shipment token or ID from URL or raw text
    let targetId = codeText
    if (codeText.includes('/track/')) {
      targetId = codeText.split('/track/').pop()
    } else if (codeText.includes('shipmentId=')) {
      const match = codeText.match(/shipmentId=([^&]+)/)
      if (match) targetId = match[1]
    }

    try {
      const res = await fetch(`/api/shipments/${targetId}/track`)
      const data = await res.json()
      if (data.success) {
        setTimeout(() => {
          onScanSuccess(data.shipmentId || targetId)
          onClose()
        }, 800)
      } else {
        setCameraError(data.error || 'Shipment not found for scanned QR code.')
        setIsProcessing(false)
      }
    } catch (err) {
      setCameraError('Network error verifying scanned QR payload.')
      setIsProcessing(false)
    }
  }

  const handleManualSubmit = (e) => {
    e.preventDefault()
    if (!manualInput.trim()) return
    handleScannedCode(manualInput.trim())
  }

  if (!isOpen) return null

  return (
    <div
      className="qr-modal-backdrop"
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
        className="qr-scanner-card"
        style={{
          background: 'rgba(6, 26, 18, 0.95)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '24px',
          padding: '2rem',
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          color: '#ecfdf5',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.2)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Camera size={20} /> SCAN SHIPMENT QR
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewport Scanner Frame */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#020b07',
            border: '2px dashed rgba(16, 185, 129, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}
        >
          <div id="qr-reader-viewport" style={{ width: '100%', height: '100%' }} />

          {/* Scanner Overlay Graphics */}
          {scannerActive && !isProcessing && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  width: '180px',
                  height: '180px',
                  border: '2px solid #34d399',
                  borderRadius: '12px',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#34d399',
                    boxShadow: '0 0 12px #34d399',
                    animation: 'scanLine 2s infinite ease-in-out'
                  }}
                />
              </div>
            </div>
          )}

          {isProcessing && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(6, 26, 18, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399'
              }}
            >
              <RefreshCw size={36} className="animate-spin" style={{ marginBottom: '0.8rem' }} />
              <span style={{ fontWeight: 700 }}>Verifying QR Token...</span>
            </div>
          )}
        </div>

        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
          Point your camera at the shipment QR code to verify on AgriTrade.
        </p>

        {cameraError && (
          <div
            style={{
              padding: '0.8rem',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#f87171',
              fontSize: '0.82rem',
              marginBottom: '1rem',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem'
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Manual Fallback Input */}
        <form onSubmit={handleManualSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <input
            type="text"
            placeholder="Enter Shipment ID / Token (e.g. SHP-2026-00125)"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            style={{
              flex: 1,
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#fff',
              fontSize: '0.85rem'
            }}
          />
          <button
            type="submit"
            disabled={isProcessing || !manualInput.trim()}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              background: '#10b981',
              color: '#fff',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <Search size={16} />
            <span>Verify</span>
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.7rem',
            borderRadius: '10px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#9ca3af',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
