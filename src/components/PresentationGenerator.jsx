import React, { useState, useEffect } from 'react';
import { SlidesIcon, ZapIcon, ExportIcon, RefreshIcon, EyeIcon } from './Icons';

const TEMPLATES = [
  { id: 'pitch',    label: 'Pitch Deck',       emoji: '🚀', slides: 8,  color: '#f472b6' },
  { id: 'report',   label: 'Business Report',  emoji: '📊', slides: 6,  color: '#fbbf24' },
  { id: 'tutorial', label: 'Tutorial / How-To', emoji: '📖', slides: 5,  color: '#38bdf8' },
  { id: 'product',  label: 'Product Demo',     emoji: '💡', slides: 7,  color: '#a78bfa' },
  { id: 'research', label: 'Research Findings', emoji: '🔬', slides: 6, color: '#34d399' },
];

function generateMarkdown(topic, template) {
  const t = topic || 'Your Topic Here';
  const slides = {
    pitch: [
      `# ${t}\n## The Next-Gen AI Revolution`,
      `## Problem\n- Current tools are fragmented\n- Manual copy-paste between AI systems\n- No unified second brain`,
      `## Solution — NEURO\n- One AI brain that **thinks, routes, and acts**\n- Self-hosted, 100% private\n- Zero API keys required`,
      `## Architecture\n\`\`\`mermaid\ngraph TD\n  A[User] --> B[NEURO Core]\n  B --> C[Perplexica]\n  B --> D[Qwen Coder]\n  B --> E[Slidev]\n\`\`\``,
      `## Market Opportunity\n- $50B AI Assistant market by 2030\n- 90% of developers want private AI tools`,
      `## Roadmap\n1. Q1 — Local LLM routing ✅\n2. Q2 — Mobile voice UI\n3. Q3 — Plugin marketplace`,
      `## Team & Tech Stack\n- FastAPI · React · ChromaDB · Ollama\n- 100% open-source`,
      `## Thank You\n**github.com/your-org/neuro** · Zero API keys needed`,
    ],
    report: [
      `# ${t}\n### Executive Summary`,
      `## Key Findings\n- Finding 1: AI adoption up 340% YoY\n- Finding 2: Local inference achieves 95% accuracy`,
      `## Methodology\n- Quantitative survey (n=1,200)\n- Perplexica-augmented research`,
      `## Data Analysis\n| Metric | Q1 | Q2 | Change |\n|--------|----|----|--------|\n| Score  | 72 | 89 | +24%   |`,
      `## Conclusions\nSelf-hosted AI reduces costs by 78% vs. cloud APIs`,
      `## Recommendations\n1. Deploy Ollama + NEURO locally\n2. Migrate RAG to ChromaDB\n3. Automate workflows via n8n`,
    ],
    tutorial: [
      `# ${t}\n### Step-by-step guide`,
      `## Prerequisites\n- Node.js 18+\n- Python 3.11+\n- Ollama installed`,
      `## Step 1: Installation\n\`\`\`bash\ngit clone https://github.com/your-org/neuro\nnpm install && pip install -r requirements.txt\n\`\`\``,
      `## Step 2: Configuration\nSet \`OLLAMA_BASE_URL\` in \`.env\``,
      `## Step 3: Run\n\`\`\`bash\nnpm run dev\npython backend/main.py\n\`\`\``,
    ],
    product: [
      `# ${t}\n### Product Demo`,
      `## What is NEURO?\nYour private AI second brain — no cloud, no API keys`,
      `## Demo: Brain Core Chat\n→ Self-critique loop ensures high-quality responses`,
      `## Demo: AI Engines\n→ Smart routing to Perplexica, Qwen, Slidev, n8n`,
      `## Demo: Memory Vault\n→ ChromaDB vector store — remembers everything`,
      `## Demo: Automation\n→ n8n webhooks fire on every NEURO decision`,
      `## Get Started\n\`ollama pull qwen2.5\` · \`npm run dev\``,
    ],
    research: [
      `# ${t}`,
      `## Background\nContext and motivation for the research`,
      `## Research Questions\n1. How does local inference compare to cloud?\n2. What are the privacy trade-offs?`,
      `## Results\n| Model | Score | Speed |\n|-------|-------|-------|\n| Qwen 2.5 | 89.2 | 45ms |\n| LLaMA 3  | 87.1 | 38ms |`,
      `## Discussion\nLocal models achieve comparable accuracy with zero data leakage`,
      `## Conclusion\nSelf-hosted AI is production-ready as of 2025`,
    ],
  };

  const content = slides[template] || slides.pitch;
  return `---\ntheme: dark\nhighlighter: shiki\nlineNumbers: false\ndrawings:\n  persist: false\ntransition: slide-left\n---\n\n${content.join('\n\n---\n\n')}`;
}

export default function PresentationGenerator({ prefillTopic = '' }) {
  const [topic,    setTopic]    = useState(prefillTopic);
  const [template, setTemplate] = useState('pitch');
  const [markdown, setMarkdown] = useState('');
  const [preview,  setPreview]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  useEffect(() => { if (prefillTopic) { setTopic(prefillTopic); } }, [prefillTopic]);

  const generate = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setMarkdown(generateMarkdown(topic, template));
    setPreview(true);
    setLoading(false);
  };

  const copyMd = () => { navigator.clipboard.writeText(markdown); };

  const tmpl = TEMPLATES.find(t => t.id === template) || TEMPLATES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <div className="card-icon" style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)' }}>
              <SlidesIcon size={18} color="#f472b6" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: '700', color: '#f1f5f9' }}>Slides (Gamma / Slidev)</h2>
              <p style={{ fontSize: '0.75rem', color: '#475569' }}>AI-powered presentation generator — Markdown → beautiful 16:9 slides</p>
            </div>
          </div>
          {markdown && (
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setPreview(!preview)} className="btn btn-sm btn-ghost">
                <EyeIcon size={13} /> {preview ? 'Hide' : 'Preview'}
              </button>
              <button onClick={copyMd} className="btn btn-sm btn-ghost">
                <ExportIcon size={13} /> Copy MD
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid-2">
        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Template selector */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>Template</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '8px', cursor: 'pointer',
                    border: `1px solid ${template === t.id ? t.color + '55' : 'var(--border)'}`,
                    background: template === t.id ? `rgba(0,0,0,0.3)` : 'transparent',
                    color: template === t.id ? '#f1f5f9' : '#64748b',
                    fontSize: '0.82rem', fontWeight: '600', textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{t.emoji}</span>
                  <span style={{ flex: 1 }}>{t.label}</span>
                  <span style={{ fontSize: '0.68rem', color: t.color }}>{t.slides} slides</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div className="card">
            <div className="card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f1f5f9' }}>Topic / Prompt</span>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <textarea
                className="textarea"
                rows={4}
                placeholder="e.g. 'NEURO: The AI Second Brain for Modern Developers'"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
              <button onClick={generate} disabled={loading} className="btn btn-lg btn-pink" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #ec4899, #be185d)', color: '#fff' }}>
                {loading ? <><span className="spin-anim" style={{ display: 'inline-block', marginRight: '6px' }}>⟳</span>Generating…</> : <><SlidesIcon size={16} color="#fff" /> Generate Slides</>}
              </button>
            </div>
          </div>

          {/* How to run */}
          <div className="card" style={{ borderColor: 'rgba(236,72,153,0.2)', background: 'rgba(236,72,153,0.03)' }}>
            <div className="card-body">
              <p style={{ fontSize: '0.75rem', color: '#f472b6', fontWeight: '700', marginBottom: '8px' }}>Run Slidev locally</p>
              <pre className="code-block" style={{ fontSize: '0.72rem' }}>{`npm install -g @slidev/cli\ncat slides.md | slidev --open\n# → http://localhost:3030`}</pre>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header" style={{ background: 'rgba(236,72,153,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#f472b6' }}>{tmpl.emoji} {tmpl.label}</span>
              {markdown && <span className="badge badge-pink" style={{ fontSize: '0.62rem' }}>{tmpl.slides} slides generated</span>}
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '0' }}>
            {!markdown ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '10px' }}>
                <SlidesIcon size={40} color="#334155" />
                <p style={{ color: '#334155', fontSize: '0.82rem' }}>Generate slides to see Markdown preview</p>
              </div>
            ) : (
              <pre className="code-block" style={{
                margin: 0, borderRadius: 0, border: 'none',
                fontSize: '0.75rem', maxHeight: '480px', overflow: 'auto',
                padding: '16px', color: '#c4b5fd'
              }}>{markdown}</pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
