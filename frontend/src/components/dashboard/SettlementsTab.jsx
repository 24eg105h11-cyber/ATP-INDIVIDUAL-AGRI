import React, { useState } from 'react'
import { HandCoins, ShieldCheck, Download, ArrowUpRight, IndianRupee, CheckCircle2 } from 'lucide-react'

export default function SettlementsTab({ triggerToast }) {
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [escrowBalance, setEscrowBalance] = useState('₹1,28,25,000')

  const handleInstantPayout = () => {
    setPayoutLoading(true)
    setTimeout(() => {
      setPayoutLoading(false)
      setEscrowBalance('₹0')
      if (triggerToast) {
        triggerToast('Instant Payout Released! ₹1,28,25,000 transferred to Farmer bank account.')
      }
    }, 1200)
  }

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
            Escrow & Smart Settlements
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#a7f3d0', opacity: 0.8 }}>
            Automated multi-sig escrow, instant bank payouts, and audit trail ledger.
          </p>
        </div>
      </div>

      {/* Escrow Banner Widget */}
      <div
        style={{
          padding: '1.8rem 2.2rem',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(6, 46, 31, 0.8) 0%, rgba(4, 25, 17, 0.9) 100%)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Pending Escrow Release
          </span>
          <h1 style={{ margin: '0.2rem 0 0.4rem 0', fontSize: '2.5rem', fontWeight: 900, color: '#34d399' }}>
            {escrowBalance}
          </h1>
          <span style={{ fontSize: '0.82rem', color: '#a7f3d0', opacity: 0.85 }}>
            CTR-8841: 450 MT Organic Durum Wheat &bull; Quality Verification Passed
          </span>
        </div>

        <button
          type="button"
          className="banner-action-btn"
          onClick={handleInstantPayout}
          disabled={payoutLoading || escrowBalance === '₹0'}
          style={{ opacity: escrowBalance === '₹0' ? 0.5 : 1 }}
        >
          <HandCoins size={18} />
          <span>{payoutLoading ? 'Processing Payout...' : escrowBalance === '₹0' ? 'Payout Released' : 'Release Instant Payout'}</span>
        </button>
      </div>

      {/* Settlement Transactions Table */}
      <div
        style={{
          padding: '1.6rem',
          borderRadius: '22px',
          background: 'rgba(6, 26, 18, 0.6)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}
      >
        <h3 style={{ margin: '0 0 1.2rem 0', fontSize: '1.1rem', fontWeight: 800 }}>
          Recent Escrow Ledger Transactions
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(16,185,129,0.3)', color: '#94a3b8' }}>
                <th style={{ padding: '0.75rem' }}>Contract ID</th>
                <th style={{ padding: '0.75rem' }}>Item</th>
                <th style={{ padding: '0.75rem' }}>Buyer</th>
                <th style={{ padding: '0.75rem' }}>Seller</th>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'CTR-8841', item: 'Organic Durum Wheat', buyer: 'Global Buyer Inc.', seller: 'John Farmer', amount: '₹1,28,25,000', status: escrowBalance === '₹0' ? 'Settled' : 'In Escrow' },
                { id: 'CTR-8839', item: 'Arabica Coffee Beans', buyer: 'AgriCorp Roasters', seller: 'Samuel K.', amount: '₹1,86,00,000', status: 'Settled' },
                { id: 'CTR-8835', item: 'Hass Avocados', buyer: 'FreshMarket Co.', seller: 'Maria Lopez', amount: '₹83,30,000', status: 'Settled' }
              ].map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <td style={{ padding: '0.85rem', fontWeight: 700, color: '#34d399' }}>{row.id}</td>
                  <td style={{ padding: '0.85rem' }}>{row.item}</td>
                  <td style={{ padding: '0.85rem' }}>{row.buyer}</td>
                  <td style={{ padding: '0.85rem' }}>{row.seller}</td>
                  <td style={{ padding: '0.85rem', fontWeight: 700, color: '#fff' }}>{row.amount}</td>
                  <td style={{ padding: '0.85rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: row.status === 'Settled' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: row.status === 'Settled' ? '#34d399' : '#f59e0b'
                      }}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <button
                      type="button"
                      onClick={() => triggerToast && triggerToast(`Downloading invoice for ${row.id}`)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#a7f3d0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Download size={14} /> Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
