import React from 'react';
import {
  NeuroLogo, BrainCoreIcon, VoiceIcon, EnginesIcon,
  SlidesIcon, MemoryIcon, AutomationIcon, SettingsIcon,
  NotificationIcon, KeyboardIcon
} from './Icons';

const NAV_ITEMS = [
  { id: 'chat',       label: 'Brain Core',    Icon: BrainCoreIcon,   color: '#ffffff', section: 'core' },
  { id: 'voice',      label: 'Voice Mode',    Icon: VoiceIcon,        color: '#ffffff', section: 'core' },
  { id: 'engines',    label: 'AI Engines',    Icon: EnginesIcon,      color: '#ffffff', section: 'tools' },
  { id: 'slides',     label: 'Slides (Gamma)',Icon: SlidesIcon,       color: '#ffffff', section: 'tools' },
  { id: 'memory',     label: 'Memory Vault',  Icon: MemoryIcon,       color: '#ffffff', section: 'tools' },
  { id: 'automation', label: 'Async Jobs',    Icon: AutomationIcon,   color: '#ffffff', section: 'tools' },
  { id: 'settings',   label: 'Settings',      Icon: SettingsIcon,     color: '#ffffff', section: 'system' },
];

const STATS = [
  { label: 'Sessions', value: '1,284', up: true },
  { label: 'Memories', value: '142',   up: true },
  { label: 'Engines',  value: '5',     neutral: true },
  { label: 'Latency',  value: '94ms',  up: false },
];

export default function Sidebar({ activeTab, setActiveTab, notifications = 3 }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <NeuroLogo size={30} />
        </div>
        <div className="logo-text">
          <h1>NEURO</h1>
          <p>Autonomous Brain Core v2.5</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Core */}
        <div className="nav-section-label">Core</div>
        {NAV_ITEMS.filter(i => i.section === 'core').map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item mode-${item.id} ${activeTab === item.id ? 'active' : ''}`}
          >
            <item.Icon size={18} color={activeTab === item.id ? item.color : '#475569'} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {activeTab === item.id && (
              <span className="nav-dot" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
            )}
          </button>
        ))}

        {/* Tools */}
        <div className="nav-section-label">Tools</div>
        {NAV_ITEMS.filter(i => i.section === 'tools').map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item mode-${item.id} ${activeTab === item.id ? 'active' : ''}`}
          >
            <item.Icon size={18} color={activeTab === item.id ? item.color : '#475569'} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {activeTab === item.id && (
              <span className="nav-dot" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
            )}
          </button>
        ))}

        {/* System */}
        <div className="nav-section-label">System</div>
        {NAV_ITEMS.filter(i => i.section === 'system').map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item mode-${item.id} ${activeTab === item.id ? 'active' : ''}`}
          >
            <item.Icon size={18} color={activeTab === item.id ? item.color : '#475569'} />
            <span style={{ flex: 1 }}>{item.label}</span>
            {activeTab === item.id && (
              <span className="nav-dot" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
            )}
          </button>
        ))}
      </nav>

      {/* Footer stats & status */}
      <div className="sidebar-footer">
        {/* Mini Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '6px 8px'
            }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', fontFamily: 'var(--font-display)', letterSpacing: '-0.04em', color: '#f1f5f9' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '0.62rem', color: '#475569', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="status-pill">
          <span className="pulse-dot" />
          All systems operational
        </div>
      </div>
    </aside>
  );
}
