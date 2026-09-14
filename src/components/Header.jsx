import React from 'react';
import { Brain, Cpu, Database, Activity, Sparkles, Radio, ShieldCheck } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, memoryCount = 42, activeEnginesCount = 5 }) {
  // Theme color mapper
  const modeColors = {
    chat: { name: 'Brain Core', color: '#c084fc', badge: 'badge-purple' },
    voice: { name: 'Voice Mode', color: '#00f2fe', badge: 'badge-cyan' },
    engines: { name: 'AI Engines', color: '#fbbf24', badge: 'badge-amber' },
    presentation: { name: 'Slides (Gamma)', color: '#ec4899', badge: 'badge-pink' },
    memory: { name: 'RAG Memory', color: '#00ff87', badge: 'badge-green' },
    automation: { name: 'Async Jobs', color: '#60a5fa', badge: 'badge-blue' },
    api: { name: 'FastAPI Studio', color: '#00f2fe', badge: 'badge-cyan' }
  };

  const currentMode = modeColors[activeTab] || modeColors.chat;

  return (
    <header
      className="glass-card"
      style={{
        borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        margin: '0 1rem 1rem 1rem',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        borderColor: `rgba(${
          activeTab === 'chat'
            ? '168, 85, 247'
            : activeTab === 'voice'
            ? '0, 242, 254'
            : activeTab === 'engines'
            ? '245, 158, 11'
            : activeTab === 'presentation'
            ? '236, 72, 153'
            : activeTab === 'memory'
            ? '0, 255, 135'
            : '59, 130, 246'
        }, 0.3)`
      }}
    >
      {/* Brand & NEURO Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background:
              activeTab === 'chat'
                ? 'linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)'
                : activeTab === 'voice'
                ? 'linear-gradient(135deg, #00f2fe 0%, #0284c7 100%)'
                : activeTab === 'engines'
                ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
                : activeTab === 'presentation'
                ? 'linear-gradient(135deg, #f43f5e 0%, #be185d 100%)'
                : activeTab === 'memory'
                ? 'linear-gradient(135deg, #00ff87 0%, #059669 100%)'
                : 'linear-gradient(135deg, #60a5fa 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 20px ${currentMode.color}`
          }}
        >
          <Brain size={24} color={['voice', 'engines', 'memory'].includes(activeTab) ? '#04060a' : '#ffffff'} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1
              style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0 }}
              className={`gradient-text-${
                activeTab === 'chat'
                  ? 'purple'
                  : activeTab === 'voice'
                  ? 'cyan'
                  : activeTab === 'engines'
                  ? 'amber'
                  : activeTab === 'presentation'
                  ? 'pink'
                  : activeTab === 'memory'
                  ? 'green'
                  : 'blue'
              }`}
            >
              NEURO
            </h1>
            <span className={`badge ${currentMode.badge}`} style={{ fontSize: '0.62rem' }}>
              {currentMode.name} Mode
            </span>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={11} color={currentMode.color} /> Autonomous Private Second Brain
          </p>
        </div>
      </div>

      {/* Dynamic Multi-Color Navigation Tabs */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(4, 6, 10, 0.9)',
          padding: '4px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <button className={`nav-tab tab-chat ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>
          <Brain size={15} /> Brain Core
        </button>
        <button className={`nav-tab tab-voice ${activeTab === 'voice' ? 'active' : ''}`} onClick={() => setActiveTab('voice')}>
          <Radio size={15} /> Voice Mode
        </button>
        <button className={`nav-tab tab-engines ${activeTab === 'engines' ? 'active' : ''}`} onClick={() => setActiveTab('engines')}>
          <Cpu size={15} /> AI Engines
        </button>
        <button className={`nav-tab tab-presentation ${activeTab === 'presentation' ? 'active' : ''}`} onClick={() => setActiveTab('presentation')}>
          <Sparkles size={15} /> Slides (Gamma)
        </button>
        <button className={`nav-tab tab-memory ${activeTab === 'memory' ? 'active' : ''}`} onClick={() => setActiveTab('memory')}>
          <Database size={15} /> RAG Memory
        </button>
        <button className={`nav-tab tab-automation ${activeTab === 'automation' ? 'active' : ''}`} onClick={() => setActiveTab('automation')}>
          <Activity size={15} /> Async Jobs
        </button>
      </nav>

      {/* System Status Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
        <div className={`badge ${currentMode.badge}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: currentMode.color, boxShadow: `0 0 8px ${currentMode.color}` }}></span>
          {activeEnginesCount} Engines Active
        </div>
        <div className="badge badge-purple">
          <Database size={11} /> {memoryCount} Vector Memories
        </div>
      </div>
    </header>
  );
}
