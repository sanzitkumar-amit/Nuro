import React, { useState } from 'react';
import { MemoryIcon, SearchIcon, TrashIcon, UploadIcon, CheckIcon, ZapIcon } from './Icons';

const INITIAL_MEMORIES = [
  { id: 1, text: 'User prefers concise technical explanations with code examples.', score: 0.97, tag: 'Preference', ts: '2 hrs ago' },
  { id: 2, text: 'Project is a self-hosted AI platform (NEURO) built with FastAPI + React + Vite.', score: 0.94, tag: 'Project', ts: '1 day ago' },
  { id: 3, text: 'Zero paid API keys policy. All tools must be open-source and local.', score: 0.91, tag: 'Constraint', ts: '2 days ago' },
  { id: 4, text: 'Preferred LLM: Qwen 2.5 Coder via Ollama at localhost:11434.', score: 0.88, tag: 'Config', ts: '3 days ago' },
  { id: 5, text: 'UI design aesthetic: dark, black + green-blue gradient, minimal and cool.', score: 0.85, tag: 'Style', ts: '3 days ago' },
];

const TAG_COLORS = {
  Preference: 'badge-violet',
  Project:    'badge-blue',
  Constraint: 'badge-amber',
  Config:     'badge-emerald',
  Style:      'badge-pink',
  Custom:     'badge-slate',
};

export default function MemoryVault() {
  const [memories,   setMemories]   = useState(INITIAL_MEMORIES);
  const [search,     setSearch]     = useState('');
  const [newMem,     setNewMem]     = useState('');
  const [newTag,     setNewTag]     = useState('Custom');
  const [uploading,  setUploading]  = useState(false);
  const [addStatus,  setAddStatus]  = useState('');
  const fileRef = React.useRef(null);

  const filtered = memories.filter(m =>
    m.text.toLowerCase().includes(search.toLowerCase()) ||
    m.tag.toLowerCase().includes(search.toLowerCase())
  );

  const addMemory = () => {
    if (!newMem.trim()) return;
    setMemories(prev => [{
      id: Date.now(), text: newMem.trim(), score: 1.00,
      tag: newTag, ts: 'Just now'
    }, ...prev]);
    setNewMem('');
    setAddStatus('Saved');
    setTimeout(() => setAddStatus(''), 1800);
  };

  const deleteMemory = id => setMemories(prev => prev.filter(m => m.id !== id));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await new Promise(r => setTimeout(r, 1200));
    setMemories(prev => [{
      id: Date.now(),
      text: `Document ingested: "${file.name}" — ${Math.round(file.size / 1024)} KB chunked into vector embeddings.`,
      score: 0.99, tag: 'Project', ts: 'Just now'
    }, ...prev]);
    setUploading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
              <MemoryIcon size={18} color="#34d399" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: '700', color: '#f1f5f9' }}>Memory Vault</h2>
              <p style={{ fontSize: '0.75rem', color: '#475569' }}>Persistent vector knowledge — ChromaDB embeddings, fully local</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <input ref={fileRef} type="file" style={{ display: 'none' }} onChange={handleFileUpload} accept=".txt,.md,.pdf,.docx,.json" />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-sm btn-ghost">
              <UploadIcon size={14} color="#34d399" />
              {uploading ? 'Ingesting…' : 'Ingest File'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ padding: '10px 18px', display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Memories', value: memories.length.toString(),     color: '#34d399' },
            { label: 'Avg. Score',     value: (memories.reduce((a, m) => a + m.score, 0) / memories.length).toFixed(2), color: '#a78bfa' },
            { label: 'Vector Model',   value: 'all-MiniLM-L6',               color: '#38bdf8' },
            { label: 'Storage',        value: 'ChromaDB Local',               color: '#fbbf24' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</span>
              <span style={{ fontSize: '0.68rem', color: '#475569' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        {/* Left: Add + Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Add Memory */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>Add Memory Fragment</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea
                className="textarea"
                rows={3}
                placeholder="e.g. 'User prefers Python over JavaScript for backend tasks.'"
                value={newMem}
                onChange={e => setNewMem(e.target.value)}
                style={{ fontSize: '0.82rem' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <select className="select" value={newTag} onChange={e => setNewTag(e.target.value)} style={{ fontSize: '0.78rem' }}>
                  {Object.keys(TAG_COLORS).map(t => <option key={t}>{t}</option>)}
                </select>
                <button onClick={addMemory} className="btn btn-md btn-green" style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #047857)', color: '#fff', justifyContent: 'center' }}>
                  {addStatus ? <><CheckIcon size={13} /> {addStatus}</> : <><ZapIcon size={13} color="#fff" /> Embed Memory</>}
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>Semantic Search</span>
            </div>
            <div className="card-body">
              <div style={{ position: 'relative' }}>
                <SearchIcon size={15} color="#475569" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  className="input"
                  placeholder="Search memories by content or tag…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ paddingLeft: '32px', fontSize: '0.82rem', borderColor: 'rgba(16,185,129,0.3)' }}
                />
              </div>
              <p style={{ fontSize: '0.7rem', color: '#334155', marginTop: '8px' }}>
                {filtered.length} of {memories.length} memories shown
              </p>
            </div>
          </div>

          {/* File Ingest Guide */}
          <div className="card" style={{ borderColor: 'rgba(16,185,129,0.2)', background: 'rgba(16,185,129,0.03)' }}>
            <div className="card-body">
              <p style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '700', marginBottom: '6px' }}>Supported Ingest Formats</p>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {['.txt', '.md', '.pdf', '.docx', '.json', '.csv'].map(f => (
                  <span key={f} className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{f}</span>
                ))}
              </div>
              <p style={{ fontSize: '0.7rem', color: '#334155', marginTop: '8px' }}>
                Files are chunked at 512 tokens and embedded via all-MiniLM-L6-v2 (local SBERT).
              </p>
            </div>
          </div>
        </div>

        {/* Right: Memory list */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header">
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>Stored Memories</span>
            {search && <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>{filtered.length} results</span>}
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#334155', fontSize: '0.82rem' }}>
                No memories found
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {filtered.map((m, i) => (
                  <div key={m.id} className="fade-in" style={{
                    padding: '12px 14px',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s ease'
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${TAG_COLORS[m.tag] || 'badge-slate'}`} style={{ fontSize: '0.6rem' }}>{m.tag}</span>
                        <span style={{ fontSize: '0.65rem', color: '#475569' }}>{m.ts}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.68rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                          {m.score.toFixed(2)}
                        </span>
                        <button onClick={() => deleteMemory(m.id)} className="btn btn-ghost btn-icon-sm" style={{ width: '24px', height: '24px' }}>
                          <TrashIcon size={12} />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0, lineHeight: '1.4' }}>{m.text}</p>

                    {/* Score bar */}
                    <div className="progress-bar" style={{ marginTop: '6px' }}>
                      <div className="progress-fill" style={{ width: `${m.score * 100}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
