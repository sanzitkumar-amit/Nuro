import React from 'react';
import { Eye, Brain, Compass, Zap, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

export default function ThinkingLoop({ loopSteps = [], currentStepIndex = 0, isThinking = false }) {
  if (!isThinking && (!loopSteps || loopSteps.length === 0)) return null;

  const defaultSteps = [
    {
      id: 'observe',
      title: 'Observe',
      icon: Eye,
      color: '#00f2fe',
      desc: 'Analyzing user context, intent & audio/text input payload.'
    },
    {
      id: 'think',
      title: 'Think & Recall',
      icon: Brain,
      color: '#00ff87',
      desc: 'Fetching vector embeddings from local ChromaDB store.'
    },
    {
      id: 'decide',
      title: 'Decide & Route',
      icon: Compass,
      color: '#f59e0b',
      desc: 'Orchestrating engine router (Perplexica, Qwen, Slidev, n8n).'
    },
    {
      id: 'act',
      title: 'Act & Synthesize',
      icon: Zap,
      color: '#34d399',
      desc: 'Executing sub-engine tool calls & synthesizing result.'
    },
    {
      id: 'reflexion',
      title: 'Self-Critique',
      icon: RefreshCw,
      color: '#00f2fe',
      desc: 'Evaluating response accuracy & local privacy bounds.'
    }
  ];

  const stepsToRender = loopSteps.length > 0 ? loopSteps : defaultSteps;

  return (
    <div
      className="glass-card"
      style={{
        padding: '0.85rem 1rem',
        marginBottom: '0.5rem',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        background: 'rgba(4, 8, 15, 0.95)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={15} color="#00f2fe" className={isThinking ? 'pulse-glow' : ''} />
          <h3 style={{ fontSize: '0.82rem', fontWeight: '700', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }} className="gradient-text">
            NEURO Autonomous Reasoning Loop
          </h3>
        </div>
        {isThinking && (
          <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
            <RefreshCw size={10} style={{ animation: 'spin 1.2s linear infinite' }} />
            Synaptic Loop Reasoning...
          </span>
        )}
      </div>

      {/* Steps Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        {stepsToRender.map((step, idx) => {
          const Icon = step.icon || Brain;
          const isDone = idx < currentStepIndex;
          const isActive = idx === currentStepIndex && isThinking;
          const isPending = idx > currentStepIndex;

          return (
            <div
              key={step.id || idx}
              style={{
                background: isActive
                  ? 'rgba(0, 242, 254, 0.15)'
                  : isDone
                  ? 'rgba(0, 255, 135, 0.08)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  isActive
                    ? 'rgba(0, 242, 254, 0.5)'
                    : isDone
                    ? 'rgba(0, 255, 135, 0.3)'
                    : 'rgba(255, 255, 255, 0.04)'
                }`,
                borderRadius: 'var(--radius-sm)',
                padding: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Icon size={13} color={isActive ? step.color || '#00f2fe' : isDone ? '#00ff87' : '#475569'} />
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: isActive ? '#ffffff' : isDone ? '#e2e8f0' : '#94a3b8' }}>
                    {step.title}
                  </span>
                </div>
                {isDone && <CheckCircle2 size={12} color="#00ff87" />}
                {isActive && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#00f2fe', boxShadow: '0 0 8px #00f2fe' }}></span>}
              </div>
              <p style={{ fontSize: '0.68rem', color: isPending ? 'var(--text-dim)' : 'var(--text-muted)', lineHeight: '1.25', margin: 0 }}>
                {step.detail || step.desc}
              </p>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
