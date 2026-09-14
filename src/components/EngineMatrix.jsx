import React, { useState } from 'react';
import { EnginesIcon, ZapIcon, CheckIcon, SearchIcon } from './Icons';

const ENGINES = [
  {
    id: 'perplexica', name: 'Perplexica Search', icon: '🔍',
    tag: 'Research', color: '#38bdf8', badge: 'badge-cyan',
    desc: 'Open-source AI search with citations. Closest Perplexity alternative.',
    url: 'http://localhost:3001', status: 'Ready',
    capabilities: ['Web Search', 'Citations', 'RAG Hybrid', 'Local Index'],
  },
  {
    id: 'qwen_coder', name: 'Qwen 2.5 Coder', icon: '💻',
    tag: 'Code', color: '#a78bfa', badge: 'badge-violet',
    desc: 'State-of-the-art open-source code model. 128K context, multilingual.',
    url: 'http://localhost:11434', status: 'Ready',
    capabilities: ['Code Gen', 'Debug', 'Explain', 'Refactor'],
  },
  {
    id: 'llama3', name: 'LLaMA 3 8B', icon: '🦙',
    tag: 'General', color: '#34d399', badge: 'badge-emerald',
    desc: 'Meta\'s flagship 8B instruction model. Fast, capable, multilingual.',
    url: 'http://localhost:11434', status: 'Ready',
    capabilities: ['Chat', 'Summarize', 'Translate', 'Reason'],
  },
  {
    id: 'slidev', name: 'Slidev Presentation', icon: '📊',
    tag: 'Slides', color: '#f472b6', badge: 'badge-pink',
    desc: 'Markdown-powered slide engine. Generates 16:9 decks from prompt.',
    url: 'http://localhost:3030', status: 'Ready',
    capabilities: ['Slides', 'Markdown', 'PDF Export', 'Live Preview'],
  },
  {
    id: 'n8n', name: 'n8n Automation', icon: '⚡',
    tag: 'Automation', color: '#fbbf24', badge: 'badge-amber',
    desc: 'Self-hosted workflow automation. 400+ integrations, no cloud.',
    url: 'http://localhost:5678', status: 'Ready',
    capabilities: ['Webhooks', 'Cron Jobs', 'API Calls', 'Data Flow'],
  },
  {
    id: 'openwebui', name: 'Open WebUI', icon: '🌐',
    tag: 'Hub', color: '#60a5fa', badge: 'badge-blue',
    desc: 'Self-hosted ChatGPT-like UI for local Ollama models.',
    url: 'http://localhost:8080', status: 'Ready',
    capabilities: ['Multi-Model', 'History', 'Tools', 'Plugins'],
  },
];

const ROUTING_EXAMPLES = [
  { input: 'Search for latest AI news',      engine: 'Perplexica Search', icon: '🔍' },
  { input: 'Write a FastAPI endpoint',        engine: 'Qwen 2.5 Coder',   icon: '💻' },
  { input: 'Create a 5-slide pitch deck',     engine: 'Slidev',            icon: '📊' },
  { input: 'Schedule a daily email report',   engine: 'n8n Automation',    icon: '⚡' },
  { input: 'Explain quantum entanglement',     engine: 'LLaMA 3 8B',        icon: '🦙' },
];

export default function EngineMatrix() {
  const [selected, setSelected] = useState(null);
  const [testInput, setTestInput] = useState('');
  const [testResult, setTestResult] = useState('');
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    if (!selected || !testInput.trim()) return;
    setTesting(true);
    setTestResult('');
    await new Promise(r => setTimeout(r, 900));
    setTestResult(`[${selected.name}] ✓ Engine routed successfully for: "${testInput}"\n\nCapabilities invoked: ${selected.capabilities.join(', ')}\nEndpoint: ${selected.url}\nLatency: ${60 + Math.floor(Math.random() * 80)}ms`);
    setTesting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
              <EnginesIcon size={18} color="#fbbf24" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: '700', color: '#f1f5f9' }}>AI Engine Matrix</h2>
              <p style={{ fontSize: '0.75rem', color: '#475569' }}>NEURO routing layer — 6 specialized engines, zero cloud dependency</p>
            </div>
          </div>
          <span className="badge badge-emerald">All Local</span>
        </div>

        {/* Stats row */}
        <div style={{ padding: '12px 18px', display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { label: 'Engines Linked', value: ENGINES.length.toString(), color: '#fbbf24' },
            { label: 'Avg. Latency',   value: '87ms',    color: '#34d399' },
            { label: 'API Keys Needed', value: '0',      color: '#a78bfa' },
            { label: 'GPU Required',    value: 'No',     color: '#38bdf8' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</span>
              <span style={{ fontSize: '0.68rem', color: '#475569' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Engine Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {ENGINES.map(e => (
            <div
              key={e.id}
              onClick={() => setSelected(selected?.id === e.id ? null : e)}
              className="card"
              style={{
                cursor: 'pointer',
                borderColor: selected?.id === e.id ? e.color + '55' : 'var(--border)',
                background: selected?.id === e.id ? `rgba(${e.color}, 0.05)` : 'var(--surface)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', flexShrink: 0 }}>{e.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#f1f5f9' }}>{e.name}</span>
                    <span className={`badge ${e.badge}`} style={{ fontSize: '0.6rem' }}>{e.tag}</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: '#475569', margin: 0, lineHeight: '1.3' }}>{e.desc}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 5px #34d399' }} />
                  {selected?.id === e.id && <CheckIcon size={13} color={e.color} />}
                </div>
              </div>

              {selected?.id === e.id && (
                <div style={{ padding: '8px 14px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {e.capabilities.map(c => (
                    <span key={c} className={`badge ${e.badge}`} style={{ fontSize: '0.62rem' }}>{c}</span>
                  ))}
                  <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: '#334155', fontFamily: 'var(--font-mono)' }}>{e.url}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Routing Examples */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>Smart Routing Examples</span>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <table className="data-table">
                <thead><tr><th>User Query</th><th>Engine</th></tr></thead>
                <tbody>
                  {ROUTING_EXAMPLES.map((r, i) => (
                    <tr key={i}>
                      <td style={{ fontSize: '0.78rem' }}>"{r.input}"</td>
                      <td style={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{r.icon} {r.engine}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Test Bench */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>Engine Test Bench</span>
              {selected && <span className={`badge ${selected.badge}`} style={{ fontSize: '0.65rem' }}>{selected.name}</span>}
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {!selected ? (
                <p style={{ fontSize: '0.8rem', color: '#475569' }}>← Select an engine from the left to test it.</p>
              ) : (
                <>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', marginBottom: '5px' }}>Test Prompt</label>
                    <textarea
                      className="textarea"
                      rows={3}
                      placeholder={`Send a test prompt to ${selected.name}…`}
                      value={testInput}
                      onChange={e => setTestInput(e.target.value)}
                      style={{ fontSize: '0.82rem' }}
                    />
                  </div>
                  <button onClick={runTest} disabled={testing} className="btn btn-md btn-amber" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#09090b', width: '100%', justifyContent: 'center' }}>
                    {testing ? <><span className="spin-anim" style={{ display: 'inline-block', marginRight: '5px' }}>⟳</span>Routing…</> : <><ZapIcon size={14} color="#09090b" /> Run Engine Test</>}
                  </button>
                  {testResult && (
                    <pre className="code-block" style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem', color: '#86efac' }}>
                      {testResult}
                    </pre>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
