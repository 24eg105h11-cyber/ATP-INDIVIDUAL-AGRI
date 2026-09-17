import React, { useState } from 'react'
import { Sprout, Search, Bell, LogOut, ChevronDown, UserCheck, Shield } from 'lucide-react'

export default function Navbar({ user, onLogout, onGoHome }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const roleColors = {
    admin: '#8b5cf6',
    farmer: '#10b981',
    collection_manager: '#f97316',
    inspector: '#0284c7',
    buyer: '#ec4899',
    logistics: '#14b8a6'
  }

  const roleColor = roleColors[user?.role] || '#10b981'

  return (
    <nav className="dash-navbar">
      {/* Brand Logo */}
      <div className="dash-brand" onClick={onGoHome}>
        <div className="dash-brand-icon">
          <Sprout size={22} />
        </div>
        <span className="dash-brand-name">AgriTrade</span>
      </div>

      {/* Global Search Bar */}
      <div className="dash-search-bar">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search produce batches, contracts, IoT nodes..."
        />
      </div>

      {/* Right Navigation & Profile */}
      <div className="dash-nav-right">
        {/* Role Badge */}
        <div
          className="role-badge-pill"
          style={{
            borderColor: `${roleColor}55`,
            color: roleColor,
            background: `${roleColor}18`
          }}
        >
          <Shield size={14} />
          <span>{user?.role?.replace('_', ' ') || 'User'}</span>
        </div>

        {/* Notifications Icon */}
        <div
          style={{
            position: 'relative',
            cursor: 'pointer',
            padding: '0.4rem',
            color: '#a7f3d0'
          }}
        >
          <Bell size={20} />
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981'
            }}
          />
        </div>

        {/* User Profile Menu */}
        <div className="user-profile-menu">
          <button
            type="button"
            className="user-avatar-btn"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>
              {user?.name || 'Agri User'}
            </span>
            <ChevronDown size={14} />
          </button>

          {menuOpen && (
            <div className="user-dropdown">
              <div className="dropdown-user-info">
                <div className="dropdown-name">{user?.name || 'Authenticated User'}</div>
                <div className="dropdown-email">{user?.email || 'user@agritrade.com'}</div>
              </div>

              <button
                type="button"
                className="dropdown-item-btn"
                onClick={onLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
