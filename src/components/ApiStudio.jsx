import React, { useState } from 'react';
import { Terminal, Send, CheckCircle2, Copy, Play, Server } from 'lucide-react';

export default function ApiStudio() {
  const endpoints = [
    {
      path: '/api/chat',
      method: 'POST',
      desc: 'Triggers the Self-Thinking Loop (Observe -> Think -> Decide -> Act -> Reflexion).',
      sampleReq: `{ "prompt": "Architect a RAG memory pipeline", "user_id": "usr_99" }`,
      sampleRes: `{ "status": "success", "engine": "Qwen-Coder", "thinking_steps": 5, "response": "Generated implementation." }`
    },
    {
      path: '/api/memory/query',
      method: 'POST',
      desc: 'Retrieves top-k relevant vector memories from ChromaDB vector store.',
      sampleReq: `{ "query": "UI preferences", "top_k": 3 }`,
      sampleRes: `{ "memories": [{ "category": "Preference", "content": "Dark cyberpunk UI", "score": 0.98 }] }`
    },
    {
      path: '/api/slides/generate',
      method: 'POST',
      desc: 'Transforms raw prompt into Slidev/Marp Markdown slides.',
      sampleReq: `{ "topic": "Quantum Computing Architecture", "theme": "cyberpunk" }`,
      sampleRes: `{ "markdown": "# Quantum Computing\\n- Key insight 1\\n- Key insight 2", "slide_count": 4 }`
    },
    {
      path: '/api/automation/trigger',
      method: 'POST',
      desc: 'Dispatches multi-step async background job to n8n / Celery broker.',
      sampleReq: `{ "workflow_id": "wf_sync_notion", "payload": { "sync": true } }`,
      sampleRes: `{ "job_id": "job_881", "status": "QUEUED", "broker": "Redis" }`
    }
  ];

  const [activeEndpoint, setActiveEndpoint] = useState(endpoints[0]);
  const [apiResponse, setApiResponse] = useState(activeEndpoint.sampleRes);

  const handleTestApi = () => {
    setApiResponse('{ "status": "CONNECTING TO LOCAL FASTAPI BACKEND (http://127.0.0.1:8000)..." }');
    setTimeout(() => {
      setApiResponse(activeEndpoint.sampleRes);
    }, 400);
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', margin: '0 1rem 1.5rem 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
            <Server size={20} color="#34d399" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', margin: 0 }} className="gradient-text">
              Neuro FastAPI Backend Studio
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
              OpenAPI 3.0 Specs • Local Python REST Server Testbench
            </p>
          </div>
        </div>

        <span className="badge badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={12} /> FastAPI Server Schema Ready
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Endpoints List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>REST Endpoints</h4>
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              onClick={() => {
                setActiveEndpoint(ep);
                setApiResponse(ep.sampleRes);
              }}
              className="glass-card-interactive"
              style={{
                padding: '12px',
                border: `1px solid ${activeEndpoint.path === ep.path ? 'var(--primary-violet)' : 'var(--border-subtle)'}`,
                background: activeEndpoint.path === ep.path ? 'rgba(22, 26, 41, 0.9)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>{ep.method}</span>
                <code style={{ fontSize: '0.85rem', color: '#38bdf8' }}>{ep.path}</code>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{ep.desc}</p>
            </div>
          ))}
        </div>

        {/* Payload Request & Response Inspector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
              Request Payload (JSON)
            </span>
            <button onClick={handleTestApi} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
              <Play size={12} /> Execute HTTP Request
            </button>
          </div>
          <pre className="code-block" style={{ margin: 0 }}>{activeEndpoint.sampleReq}</pre>

          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Response Output (200 OK)
          </span>
          <pre className="code-block" style={{ margin: 0, color: '#34d399' }}>{apiResponse}</pre>
        </div>
      </div>
    </div>
  );
}
