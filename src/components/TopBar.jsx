import React from 'react';
import { NotificationIcon, SearchIcon, KeyboardIcon } from './Icons';

const MODE_META = {
  chat:       { label: 'Brain Core',     color: '#ffffff', badge: 'badge-violet' },
  voice:      { label: 'Voice Mode',     color: '#ffffff', badge: 'badge-cyan'   },
  engines:    { label: 'AI Engines',     color: '#ffffff', badge: 'badge-amber'  },
  slides:     { label: 'Slides (Gamma)', color: '#ffffff', badge: 'badge-pink'   },
  memory:     { label: 'Memory Vault',   color: '#ffffff', badge: 'badge-emerald'},
  automation: { label: 'Async Jobs',     color: '#ffffff', badge: 'badge-blue'   },
  settings:   { label: 'Settings',       color: '#ffffff', badge: 'badge-slate'  },
};

export default function TopBar({ activeTab, notifications = 3, onNotificationClick, onSearchClick, showNotifs = false, notifData = [] }) {
  const meta = MODE_META[activeTab] || MODE_META.chat;

  return (
    <header className="topbar">
      {/* Breadcrumb */}
      <div className="topbar-left">
        <div className="breadcrumb">
          <span>NEURO</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>

        <span className={`badge ${meta.badge}`} style={{ fontSize: '0.68rem' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: meta.color, boxShadow: `0 0 5px ${meta.color}`, display: 'inline-block' }} />
          Active
        </span>
      </div>

      {/* Actions */}
      <div className="topbar-actions">
        {/* Search button */}
        <button
          onClick={onSearchClick}
          title="Search (⌘K)"
          style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#475569', padding: '4px 10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '5px', cursor: 'pointer' }}
        >
          <KeyboardIcon size={12} />
          <span>⌘K Search</span>
        </button>

        <button className="btn btn-ghost btn-icon-sm" onClick={onSearchClick} title="Search">
          <SearchIcon size={16} color="#64748b" />
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button className="btn btn-ghost btn-icon-sm" style={{ position: 'relative' }} onClick={onNotificationClick} title="Notifications">
            <NotificationIcon size={17} color="#64748b" />
            {notifications > 0 && (
              <span style={{
                position: 'absolute', top: '4px', right: '4px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#f43f5e',
                boxShadow: '0 0 5px rgba(244,63,94,0.6)',
                fontSize: '0'
              }} />
            )}
          </button>

          {/* Dropdown */}
          {showNotifs && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: '300px', background: '#0c1018',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px', overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(0,0,0,0.8), 0 0 15px rgba(255,255,255,0.06)', zIndex: 500
            }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: '0.78rem', fontWeight: '700', color: '#f1f5f9' }}>
                Notifications
              </div>
              {notifData.map(n => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '1rem', marginTop: '1px' }}>{n.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4' }}>{n.text}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>{n.time}</div>
                  </div>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 6px #ffffff', flexShrink: 0, marginTop: '5px' }} />
                </div>
              ))}
              <div style={{ padding: '8px 14px', textAlign: 'center', fontSize: '0.72rem', color: '#64748b', cursor: 'pointer' }}>
                Mark all as read
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: '#ffffff',
          boxShadow: '0 0 12px rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.75rem', fontWeight: '800', color: '#000000',
          cursor: 'pointer', flexShrink: 0
        }}>N</div>
      </div>
    </header>
  );
}
