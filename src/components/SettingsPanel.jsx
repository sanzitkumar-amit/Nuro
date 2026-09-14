import React, { useState } from 'react';
import { SettingsIcon, CheckIcon, ZapIcon } from './Icons';

const MODEL_OPTIONS = [
  { id: 'llama3',     label: 'LLaMA 3 8B',     provider: 'Ollama (Local)',  speed: 'Fast',  size: '4.7GB' },
  { id: 'qwen2.5',   label: 'Qwen 2.5 Coder',  provider: 'Ollama (Local)',  speed: 'Fast',  size: '4.1GB' },
  { id: 'mistral',   label: 'Mistral 7B',       provider: 'Ollama (Local)',  speed: 'Fast',  size: '4.1GB' },
  { id: 'deepseek',  label: 'DeepSeek Coder',   provider: 'Ollama (Local)',  speed: 'Medium',size: '3.8GB' },
  { id: 'gpt4free',  label: 'GPT4Free Proxy',   provider: 'GPT4Free (Free)',speed: 'Depends',size: '—'    },
];

const THEME_OPTS = ['Default Dark', 'Void Black', 'Deep Navy', 'Forest'];
const VOICE_OPTS = ['Piper (Fast)', 'Coqui TTS', 'Browser TTS'];

export default function SettingsPanel() {
  const [activeModel, setActiveModel] = useState('qwen2.5');
  const [ollamaUrl, setOllamaUrl]     = useState('http://127.0.0.1:11434');
  const [backendUrl, setBackendUrl]   = useState('http://127.0.0.1:8000');
  const [theme, setTheme]             = useState('Default Dark');
  const [ttsEngine, setTtsEngine]     = useState('Browser TTS');
  const [ragChunkSize, setRagChunkSize] = useState(512);
  const [autoExtract, setAutoExtract] = useState(true);
  const [saveStatus, setSaveStatus]   = useState('');

  const handleSave = () => {
    setSaveStatus('Saved');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleTestBackend = async () => {
    try {
      const r = await fetch(`${backendUrl}/health`);
      if (r.ok) alert('✅ FastAPI backend is online!');
      else alert('⚠️ Backend responded with an error.');
    } catch {
      alert('❌ Backend offline. Start it with: python backend/main.py');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon" style={{ background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)' }}>
              <SettingsIcon size={18} color="#94a3b8" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: '700', color: '#f1f5f9' }}>NEURO Settings</h2>
              <p style={{ fontSize: '0.75rem', color: '#475569' }}>Configure models, APIs, memory, and appearance</p>
            </div>
          </div>
          <button onClick={handleSave} className={`btn btn-sm ${saveStatus ? 'btn-green' : 'btn-violet'}`}>
            {saveStatus ? <><CheckIcon size={13} /> Saved!</> : 'Save Settings'}
          </button>
        </div>
      </div>

      <div className="grid-2">
        {/* Local LLM Model */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f1f5f9' }}>Local LLM Selection</span>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>No API Key Needed</span>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '4px' }}>
              Install via <a href="https://ollama.com" target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>Ollama</a> and run <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.72rem' }}>ollama pull {activeModel}</code>
            </p>
            {MODEL_OPTIONS.map(m => (
              <div
                key={m.id}
                onClick={() => setActiveModel(m.id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                  border: `1px solid ${activeModel === m.id ? 'rgba(139,92,246,0.5)' : 'var(--border)'}`,
                  background: activeModel === m.id ? 'rgba(139,92,246,0.1)' : 'transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#f1f5f9' }}>{m.label}</div>
                  <div style={{ fontSize: '0.68rem', color: '#475569' }}>{m.provider} · {m.size}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-slate" style={{ fontSize: '0.62rem' }}>{m.speed}</span>
                  {activeModel === m.id && <CheckIcon size={14} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* API Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f1f5f9' }}>Backend Endpoints</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>NEURO FastAPI Backend</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input className="input" value={backendUrl} onChange={e => setBackendUrl(e.target.value)} style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }} />
                  <button onClick={handleTestBackend} className="btn btn-sm btn-ghost">Test</button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>Local Ollama API</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input className="input" value={ollamaUrl} onChange={e => setOllamaUrl(e.target.value)} style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }} />
                  <button className="btn btn-sm btn-ghost">Test</button>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f1f5f9' }}>Appearance & Voice</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>UI Theme</label>
                <select className="select" value={theme} onChange={e => setTheme(e.target.value)} style={{ width: '140px', fontSize: '0.78rem' }}>
                  {THEME_OPTS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.78rem', color: '#94a3b8' }}>TTS Engine</label>
                <select className="select" value={ttsEngine} onChange={e => setTtsEngine(e.target.value)} style={{ width: '140px', fontSize: '0.78rem' }}>
                  {VOICE_OPTS.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Memory Config */}
      <div className="card">
        <div className="card-header">
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#f1f5f9' }}>Memory & RAG Configuration</span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>RAG Chunk Size (tokens)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="range" min="128" max="2048" step="128" value={ragChunkSize} onChange={e => setRagChunkSize(Number(e.target.value))} style={{ flex: 1 }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#c084fc', minWidth: '40px' }}>{ragChunkSize}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#f1f5f9' }}>Auto-Extract Facts</div>
                <div style={{ fontSize: '0.68rem', color: '#475569' }}>Save facts from every chat to vector store</div>
              </div>
              <button
                onClick={() => setAutoExtract(!autoExtract)}
                style={{
                  width: '40px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
                  background: autoExtract ? '#7c3aed' : '#1e293b',
                  position: 'relative', transition: 'background 0.2s ease'
                }}
              >
                <span style={{
                  position: 'absolute', top: '3px',
                  left: autoExtract ? '21px' : '3px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#fff', transition: 'left 0.2s ease'
                }} />
              </button>
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: '600', color: '#f1f5f9', marginBottom: '4px' }}>Vector Database</div>
              <div style={{ fontSize: '0.72rem', color: '#475569' }}>ChromaDB (local, persistent)</div>
              <code style={{ fontSize: '0.68rem', color: '#475569', fontFamily: 'var(--font-mono)' }}>~/.neuro/chroma_db/</code>
            </div>
          </div>
        </div>
      </div>

      {/* Setup Guide */}
      <div className="card" style={{ borderColor: 'rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.04)' }}>
        <div className="card-header">
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ZapIcon size={14} color="#34d399" /> Quick Setup Guide (No API Keys Required)
          </span>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', fontSize: '0.78rem' }}>
            {[
              { step: '1', title: 'Install Ollama', cmd: 'winget install Ollama.Ollama', note: 'or from ollama.com' },
              { step: '2', title: 'Pull a model', cmd: `ollama pull ${activeModel}`, note: 'No GPU required for 7B models' },
              { step: '3', title: 'Start NEURO backend', cmd: 'python backend/main.py', note: 'Runs at :8000' },
              { step: '4', title: 'Start frontend', cmd: 'npm run dev', note: 'Runs at :3000' },
            ].map(s => (
              <div key={s.step} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: '800', color: '#fff' }}>{s.step}</span>
                  <span style={{ fontWeight: '600', color: '#f1f5f9' }}>{s.title}</span>
                </div>
                <code style={{ fontSize: '0.72rem', color: '#34d399', fontFamily: 'var(--font-mono)', display: 'block', marginBottom: '2px' }}>{s.cmd}</code>
                <span style={{ color: '#475569' }}>{s.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
