import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// Layout
import Sidebar from './components/Sidebar';
import TopBar  from './components/TopBar';

// Page components
import ChatInterface         from './components/ChatInterface';
import VoiceMode             from './components/VoiceMode';
import EngineMatrix          from './components/EngineMatrix';
import PresentationGenerator from './components/PresentationGenerator';
import MemoryVault           from './components/MemoryVault';
import AutomationQueue       from './components/AutomationQueue';
import SettingsPanel         from './components/SettingsPanel';

/* ── Floating particles background across entire app ── */
function FloatingParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
    }));

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.pulse += 0.015;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // Draw subtle connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${0.04 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

const VERSION = '2.5.0';

const NOTIFICATIONS = [
  { id: 1, icon: '🧠', text: 'Memory Vault synced — 142 memories indexed', time: '2m ago', color: '#34d399' },
  { id: 2, icon: '⚡', text: 'Automation job #4821 completed successfully', time: '8m ago', color: '#60a5fa' },
  { id: 3, icon: '🎤', text: 'Voice Mode ready — Browser APIs active', time: '15m ago', color: '#38bdf8' },
];

const SEARCH_TABS = [
  { id: 'chat',       label: 'Brain Core',     emoji: '🧠' },
  { id: 'voice',      label: 'Voice Mode',     emoji: '🎤' },
  { id: 'engines',    label: 'AI Engines',     emoji: '⚡' },
  { id: 'slides',     label: 'Slides',         emoji: '🎨' },
  { id: 'memory',     label: 'Memory Vault',   emoji: '🗄️' },
  { id: 'automation', label: 'Async Jobs',     emoji: '🔁' },
  { id: 'settings',   label: 'Settings',       emoji: '⚙️' },
];

export default function App() {
  const [activeTab, setActiveTab]         = useState('chat');
  const [notifications]                   = useState(3);
  const [slidesTopic, setSlidesTopic]     = useState('');
  const [showSearch, setShowSearch]       = useState(false);
  const [showNotifs, setShowNotifs]       = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(s => !s);
      }
      if (e.key === 'Escape') { setShowSearch(false); setShowNotifs(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filteredTabs = SEARCH_TABS.filter(t =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGenerateSlides = (topic) => {
    setSlidesTopic(topic || '');
    setActiveTab('slides');
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface onOpenVoice={() => setActiveTab('voice')} onGenerateSlides={handleGenerateSlides} />;
      case 'voice':
        return <VoiceMode />;
      case 'engines':
        return <EngineMatrix />;
      case 'slides':
        return <PresentationGenerator prefillTopic={slidesTopic} />;
      case 'memory':
        return <MemoryVault />;
      case 'automation':
        return <AutomationQueue />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <ChatInterface onOpenVoice={() => setActiveTab('voice')} onGenerateSlides={handleGenerateSlides} />;
    }
  };

  return (
    <div className="app-shell" onClick={() => setShowNotifs(false)}>
      {/* ── Global animated particles background ── */}
      <FloatingParticles />

      {/* ── Left Sidebar ── */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
      />

      {/* ── Right: topbar + page + statusbar ── */}
      <div className="main-content">
        <TopBar
          activeTab={activeTab}
          notifications={NOTIFICATIONS.length}
          onSearchClick={() => setShowSearch(true)}
          onNotificationClick={(e) => { e.stopPropagation(); setShowNotifs(s => !s); }}
          showNotifs={showNotifs}
          notifData={NOTIFICATIONS}
        />

        <div className="page-area" key={activeTab}>
          {renderPage()}
        </div>

        {/* Status bar */}
        <div className="status-bar">
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="status-bar-item">
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              <span>NEURO v{VERSION}</span>
            </div>
            <div className="status-bar-item">
              <span>Mode: <span style={{ color: '#64748b' }}>{activeTab}</span></span>
            </div>
            <div className="status-bar-item">
              <span>Backend: <span style={{ color: '#475569' }}>localhost:8000</span></span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="status-bar-item">
              <span>UTC {new Date().toISOString().slice(11, 16)}</span>
            </div>
            <div className="status-bar-item" style={{ color: '#475569', cursor: 'pointer' }} onClick={() => setShowSearch(true)}>
              ⌘K Search
            </div>
          </div>
        </div>
      </div>

      {/* ── Global Search Modal ── */}
      {showSearch && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '120px', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowSearch(false)}
        >
          <div
            style={{ width: '480px', background: '#0c1018', border: '1px solid rgba(255,255,255,0.22)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.08)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1rem' }}>🔍</span>
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', color: '#f1f5f9', fontFamily: 'var(--font-body)' }}
              />
              <kbd style={{ fontSize: '0.65rem', color: '#64748b', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px' }}>ESC</kbd>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {filteredTabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setActiveTab(t.id); setShowSearch(false); setSearchQuery(''); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#cbd5e1', fontSize: '0.88rem', textAlign: 'left', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '1.1rem', width: '24px', textAlign: 'center' }}>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
              {filteredTabs.length === 0 && <div style={{ padding: '20px', textAlign: 'center', color: '#475569', fontSize: '0.82rem' }}>No results found</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
