import React, { useState, useEffect, useRef } from 'react';
import { AutomationIcon, ZapIcon, CheckIcon, RefreshIcon, TrashIcon, PlusIcon } from './Icons';

const STATUS_COLORS = {
  running:  { badge: 'badge-cyan',   dot: '#38bdf8' },
  done:     { badge: 'badge-emerald', dot: '#34d399' },
  pending:  { badge: 'badge-amber',  dot: '#fbbf24' },
  failed:   { badge: 'badge-red',    dot: '#f87171' },
};

const INITIAL_JOBS = [
  { id: 1, name: 'Daily RAG Sync',           trigger: 'Cron: 00:00 UTC',  engine: 'ChromaDB',         status: 'done',    runs: 14, lastRun: '6h ago',  progress: 100 },
  { id: 2, name: 'Auto-Summarize Inbox',     trigger: 'Webhook: /inbox',  engine: 'LLaMA 3 8B',       status: 'pending', runs: 0,  lastRun: 'Never',   progress: 0   },
  { id: 3, name: 'Research Digest',           trigger: 'Cron: Mon 08:00', engine: 'Perplexica',        status: 'done',    runs: 4,  lastRun: '3d ago',  progress: 100 },
  { id: 4, name: 'Code Review Webhook',      trigger: 'Webhook: /pr',     engine: 'Qwen 2.5 Coder',   status: 'running', runs: 2,  lastRun: '2min ago',progress: 60  },
  { id: 5, name: 'Slide Auto-Regeneration', trigger: 'File: /slides/',   engine: 'Slidev',            status: 'pending', runs: 0,  lastRun: 'Never',   progress: 0   },
];

const TEMPLATES = [
  { id: 'rag_sync',   name: 'Daily RAG Sync',           trigger: 'Cron: 00:00 UTC',  engine: 'ChromaDB' },
  { id: 'inbox',      name: 'Auto-Summarize Inbox',     trigger: 'Webhook: /inbox',  engine: 'LLaMA 3 8B' },
  { id: 'research',   name: 'Research Digest',           trigger: 'Cron: Mon 08:00', engine: 'Perplexica' },
  { id: 'code',       name: 'PR Code Review',            trigger: 'Webhook: /pr',     engine: 'Qwen 2.5 Coder' },
];

function JobRow({ job, onDelete, onRun }) {
  const sc = STATUS_COLORS[job.status] || STATUS_COLORS.pending;
  return (
    <tr className="fade-in">
      <td>
        <div style={{ fontWeight: '600', color: '#f1f5f9', fontSize: '0.82rem' }}>{job.name}</div>
        <div style={{ fontSize: '0.68rem', color: '#475569' }}>{job.trigger}</div>
      </td>
      <td><span className="badge badge-blue" style={{ fontSize: '0.62rem' }}>{job.engine}</span></td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot, boxShadow: `0 0 5px ${sc.dot}`, flexShrink: 0 }} />
          <span className={`badge ${sc.badge}`} style={{ fontSize: '0.62rem' }}>{job.status}</span>
        </div>
      </td>
      <td>
        {job.status === 'running' ? (
          <div style={{ width: '80px' }}>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${job.progress}%`, background: 'linear-gradient(90deg, #06b6d4, #38bdf8)' }} />
            </div>
            <div style={{ fontSize: '0.62rem', color: '#475569', marginTop: '2px' }}>{job.progress}%</div>
          </div>
        ) : (
          <span style={{ fontSize: '0.72rem', color: '#475569' }}>{job.lastRun}</span>
        )}
      </td>
      <td style={{ fontSize: '0.72rem', color: '#64748b' }}>{job.runs}x</td>
      <td>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button onClick={() => onRun(job.id)} className="btn btn-sm btn-ghost" style={{ fontSize: '0.68rem', padding: '4px 8px' }}>
            <ZapIcon size={11} /> Run
          </button>
          <button onClick={() => onDelete(job.id)} className="btn btn-sm btn-danger" style={{ padding: '4px 6px' }}>
            <TrashIcon size={11} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AutomationQueue() {
  const [jobs,     setJobs]     = useState(INITIAL_JOBS);
  const [showNew,  setShowNew]  = useState(false);
  const [newName,  setNewName]  = useState('');
  const [newTrig,  setNewTrig]  = useState('Cron: 00:00 UTC');
  const [newEng,   setNewEng]   = useState('LLaMA 3 8B');
  const tickRef = useRef(null);

  // Simulate running job progress
  useEffect(() => {
    tickRef.current = setInterval(() => {
      setJobs(prev => prev.map(j => {
        if (j.status === 'running' && j.progress < 100) return { ...j, progress: Math.min(j.progress + 3, 100) };
        if (j.status === 'running' && j.progress >= 100) return { ...j, status: 'done', runs: j.runs + 1, lastRun: 'Just now' };
        return j;
      }));
    }, 500);
    return () => clearInterval(tickRef.current);
  }, []);

  const addJob = () => {
    if (!newName.trim()) return;
    setJobs(prev => [...prev, {
      id: Date.now(), name: newName, trigger: newTrig,
      engine: newEng, status: 'pending', runs: 0, lastRun: 'Never', progress: 0
    }]);
    setNewName(''); setShowNew(false);
  };

  const deleteJob = id => setJobs(prev => prev.filter(j => j.id !== id));

  const runJob = id => setJobs(prev => prev.map(j =>
    j.id === id ? { ...j, status: 'running', progress: 0 } : j
  ));

  const stats = {
    running: jobs.filter(j => j.status === 'running').length,
    done:    jobs.filter(j => j.status === 'done').length,
    pending: jobs.filter(j => j.status === 'pending').length,
    total:   jobs.length,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
              <AutomationIcon size={18} color="#60a5fa" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: '700', color: '#f1f5f9' }}>Async Job Queue</h2>
              <p style={{ fontSize: '0.75rem', color: '#475569' }}>n8n + NEURO workflow automation — scheduled and webhook-triggered tasks</p>
            </div>
          </div>
          <button onClick={() => setShowNew(!showNew)} className="btn btn-sm btn-blue" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}>
            <PlusIcon size={13} color="#fff" /> New Job
          </button>
        </div>

        {/* Stats */}
        <div style={{ padding: '10px 18px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Total Jobs',    value: stats.total.toString(),   color: '#f1f5f9' },
            { label: 'Running',       value: stats.running.toString(), color: '#38bdf8' },
            { label: 'Completed',     value: stats.done.toString(),    color: '#34d399' },
            { label: 'Pending',       value: stats.pending.toString(), color: '#fbbf24' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</span>
              <span style={{ fontSize: '0.68rem', color: '#475569' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New Job Form */}
      {showNew && (
        <div className="card fade-in" style={{ borderColor: 'rgba(59,130,246,0.3)' }}>
          <div className="card-header">
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>Create Automation Job</span>
          </div>
          <div className="card-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'flex-end' }}>
            <div>
              <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Job Name</label>
              <input className="input" placeholder="e.g. Daily Email Summary" value={newName} onChange={e => setNewName(e.target.value)} style={{ fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Trigger</label>
              <input className="input" placeholder="Cron: 08:00 UTC" value={newTrig} onChange={e => setNewTrig(e.target.value)} style={{ fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.68rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>Engine</label>
              <select className="select" value={newEng} onChange={e => setNewEng(e.target.value)} style={{ width: '100%', fontSize: '0.8rem' }}>
                {['LLaMA 3 8B', 'Qwen 2.5 Coder', 'Perplexica', 'ChromaDB', 'Slidev'].map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <button onClick={addJob} className="btn btn-md btn-blue" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff' }}>
              <CheckIcon size={13} /> Create
            </button>
          </div>

          {/* Quick Templates */}
          <div style={{ padding: '0 18px 14px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.68rem', color: '#475569', alignSelf: 'center' }}>Quick templates:</span>
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => { setNewName(t.name); setNewTrig(t.trigger); setNewEng(t.engine); }}
                className="chip" style={{ color: '#60a5fa', borderColor: 'rgba(59,130,246,0.3)', fontSize: '0.68rem', background: 'transparent' }}>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Jobs Table */}
      <div className="card">
        <div style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Engine</th>
                <th>Status</th>
                <th>Progress / Last Run</th>
                <th>Runs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <JobRow key={job.id} job={job} onDelete={deleteJob} onRun={runJob} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* n8n integration note */}
      <div className="card" style={{ borderColor: 'rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.03)' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AutomationIcon size={22} color="#60a5fa" />
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: '600', color: '#60a5fa' }}>Connect n8n for full workflow automation</p>
              <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>
                Run n8n locally at <code style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>localhost:5678</code> · 400+ integrations · No cloud required
              </p>
            </div>
            <a href="https://n8n.io" target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', fontSize: '0.78rem', color: '#60a5fa', textDecoration: 'none' }}>
              n8n.io →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
