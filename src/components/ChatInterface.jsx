import React, { useState, useEffect, useRef } from 'react';
import { SendIcon, SearchIcon, SlidesIcon, ZapIcon, RefreshIcon, CheckIcon, EyeIcon, CalendarIcon } from './Icons';

// 80 Custom Q&A Dataset
const CUSTOM_QNA = {
  // Greetings (1–20)
  "hi": "hello",
  "hlw": "hey",
  "hey": "hi there",
  "hello": "hi",
  "yo": "sup",
  "sup": "not much",
  "good morning": "morning",
  "good night": "sweet dreams",
  "bye": "see you",
  "cya": "take care",
  "gn": "night",
  "gm": "morning",
  "howdy": "hey partner",
  "namaste": "namaste",
  "salam": "walaikum salam",
  "hola": "hi",
  "bonjour": "hello",
  "hi bro": "hey bro",
  "hi sis": "hey sis",
  "hi dude": "yo dude",

  // Casual Chat (21–40)
  "how r u": "I’m good",
  "how are you": "fine",
  "how is going": "Everything is going great! How can I help you today?",
  "how is going on": "All good here! What are we working on today?",
  "how it going": "Going smoothly! What's on your mind?",
  "how going": "Everything's great!",
  "how are you doing": "Doing awesome! How can I assist you?",
  "what’s up": "nothing much",
  "what's up": "nothing much",
  "whats up": "nothing much",
  "wru": "at home",
  "wyd": "just chilling",
  "hbu": "I’m okay",
  "how’s life": "going well",
  "how's life": "going well",
  "hows life": "going well",
  "how’s it going": "all good",
  "how's it going": "all good",
  "hows it going": "all good",
  "what’s new": "not much",
  "what's new": "not much",
  "whats new": "not much",
  "long time": "yeah, been a while",
  "miss u": "miss you too",
  "love u": "love you too",
  "brb": "ok",
  "ttyl": "sure",
  "lol": "haha",
  "lmao": "😂",
  "omg": "wow",
  "idk": "same",
  "ok": "cool",
  "k": "fine",

  // Short Responses (41–60)
  "yes": "yeah",
  "no": "nope",
  "maybe": "could be",
  "sure": "alright",
  "alright": "okay",
  "cool": "nice",
  "nice": "cool",
  "wow": "amazing",
  "great": "awesome",
  "awesome": "fantastic",
  "fantastic": "superb",
  "amazing": "wow",
  "good": "fine",
  "bad": "sad",
  "sad": "cheer up",
  "happy": "glad",
  "tired": "rest well",
  "bored": "let’s chat",
  "hungry": "grab food",
  "thirsty": "drink water",

  // Emojis & Slang (61–80)
  "😂": "lol",
  "😢": "don’t cry",
  "😍": "love it",
  "😎": "cool",
  "🤔": "thinking",
  "😴": "sleep well",
  "💀": "dead funny",
  "💯": "true",
  "🔥": "awesome",
  "👌": "perfect",
  "gg": "good game",
  "wp": "well played",
  "ty": "welcome",
  "thx": "np",
  "np": "anytime",
  "idc": "same",
  "btw": "by the way",
  "omg lol": "haha wow",
  "rofl": "😂",
  "bruh": "dude"
};

const THINKING_STEPS = [
  { id: 'observe',   title: 'Analyze',      desc: 'Tokenizing intent' },
  { id: 'think',     title: 'Synapses',     desc: 'Retrieving neural memory' },
  { id: 'decide',    title: 'Route',        desc: 'Selecting task model' },
  { id: 'act',       title: 'Synthesize',   desc: 'Generating solution' },
  { id: 'reflexion', title: 'Verify',       desc: 'Validating response' },
];

// Interactive Neural Particles Canvas
function NeuralBackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = [];
    const count = 36;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;
      const H = canvas.height;

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;
        if (p1.x < 0 || p1.x > W) p1.vx *= -1;
        if (p1.y < 0 || p1.y > H) p1.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.18 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.75;
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
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.6,
        zIndex: 0
      }}
    />
  );
}

function ThinkingLoop({ stepIndex, active }) {
  if (!active && stepIndex === 0) return null;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      marginBottom: '14px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.12)',
      padding: '12px 14px',
      borderRadius: '12px',
      boxShadow: '0 0 20px rgba(255,255,255,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#ffffff', boxShadow: '0 0 12px #ffffff',
            display: 'inline-block', animation: active ? 'pulse 0.9s infinite' : 'none'
          }} />
          <span style={{ fontSize: '0.74rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#ffffff' }}>
            Neural Synapse Pipeline
          </span>
        </div>
        {active && (
          <span className="badge" style={{
            background: '#ffffff', color: '#000000',
            fontWeight: '700', fontSize: '0.65rem',
            padding: '3px 8px', borderRadius: '6px',
            boxShadow: '0 0 14px rgba(255,255,255,0.6)'
          }}>
            <span className="spin-anim" style={{ display: 'inline-block', marginRight: '4px' }}>⟳</span>
            Processing…
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
        {THINKING_STEPS.map((step, idx) => {
          const done   = idx < stepIndex;
          const current = idx === stepIndex && active;
          const pending = idx > stepIndex;
          return (
            <div
              key={step.id}
              style={{
                borderRadius: '8px',
                padding: '8px 10px',
                background: current ? 'rgba(255,255,255,0.12)' : done ? 'rgba(255,255,255,0.04)' : '#070a10',
                border: `1px solid ${current ? 'rgba(255,255,255,0.5)' : done ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: current ? '0 0 18px rgba(255,255,255,0.25)' : 'none',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: current ? '#ffffff' : done ? '#cbd5e1' : '#475569' }}>
                  {step.title}
                </span>
                {done && <CheckIcon size={11} color="#ffffff" />}
                {current && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 10px #ffffff' }} />}
              </div>
              <p style={{ fontSize: '0.62rem', color: pending ? '#334155' : '#8892b0', margin: 0, lineHeight: '1.2' }}>
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// Cute Animated Brain Emoji — pops in when NEURO responds
function CuteBrainEmoji({ size = 36 }) {
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    setPopped(false);
    const t = requestAnimationFrame(() => setPopped(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <span
      className={`cute-brain-container ${popped ? 'brain-pop-anim' : ''}`}
      style={{ width: size + 6, height: size + 6, display: 'inline-flex', verticalAlign: 'middle' }}
      title="NEURO"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        className="cute-brain-body"
      >
        <defs>
          <radialGradient id="coreG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
            <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0"/>
          </radialGradient>
          <filter id="cGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feComposite in="SourceGraphic" in2="b" operator="over"/>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx="20" cy="20" r="17" stroke="#ffffff" strokeWidth="0.6" fill="none" opacity="0.15" />
        {/* Inner ring */}
        <circle cx="20" cy="20" r="10" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.2" />

        {/* Glowing core */}
        <circle cx="20" cy="20" r="7" fill="url(#coreG)" filter="url(#cGlow)" />
        <circle cx="20" cy="20" r="3.5" fill="#ffffff" opacity="0.9" filter="url(#cGlow)" />
        <circle cx="20" cy="20" r="1.8" fill="#ffffff" />

        {/* Neural connection lines */}
        <line x1="20" y1="20" x2="8"  y2="10" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
        <line x1="20" y1="20" x2="32" y2="10" stroke="#ffffff" strokeWidth="0.5" opacity="0.3" />
        <line x1="20" y1="20" x2="34" y2="26" stroke="#ffffff" strokeWidth="0.5" opacity="0.25" />
        <line x1="20" y1="20" x2="6"  y2="28" stroke="#ffffff" strokeWidth="0.5" opacity="0.25" />
        <line x1="20" y1="20" x2="20" y2="4"  stroke="#ffffff" strokeWidth="0.5" opacity="0.2" />
        <line x1="20" y1="20" x2="20" y2="36" stroke="#ffffff" strokeWidth="0.5" opacity="0.2" />

        {/* Outer nodes */}
        <g className="brain-sparkles">
          <circle cx="8"  cy="10" r="1.8" fill="#ffffff" opacity="0.7" filter="url(#cGlow)" />
          <circle cx="32" cy="10" r="1.8" fill="#ffffff" opacity="0.7" filter="url(#cGlow)" />
          <circle cx="34" cy="26" r="1.5" fill="#ffffff" opacity="0.5" />
          <circle cx="6"  cy="28" r="1.5" fill="#ffffff" opacity="0.5" />
          <circle cx="20" cy="4"  r="1.2" fill="#ffffff" opacity="0.4" />
          <circle cx="20" cy="36" r="1.2" fill="#ffffff" opacity="0.35" />
        </g>
      </svg>
    </span>
  );
}

// Clean Markdown & Text Renderer Component
function FormattedMessage({ text }) {
  if (!text) return null;

  const lines = text.split('\n');

  // Helper to format inline markdown (bold, code, links) and remove stray asterisks
  const formatInline = (str) => {
    if (!str) return '';
    const parts = [];
    const regex = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
    let lastIdx = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIdx) {
        const plain = str.substring(lastIdx, match.index).replace(/\*\*/g, '');
        if (plain) parts.push(plain);
      }
      if (match[2]) {
        // Bold
        parts.push(
          <strong key={match.index} style={{ color: '#ffffff', fontWeight: '700' }}>
            {match[2].replace(/\*\*/g, '')}
          </strong>
        );
      } else if (match[3]) {
        // Code
        parts.push(
          <code
            key={match.index}
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              color: '#38bdf8',
              padding: '2px 6px',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.85em'
            }}
          >
            {match[3]}
          </code>
        );
      }
      lastIdx = regex.lastIndex;
    }

    if (lastIdx < str.length) {
      const remaining = str.substring(lastIdx).replace(/\*\*/g, '');
      if (remaining) parts.push(remaining);
    }

    return parts.length > 0 ? parts : str.replace(/\*\*/g, '');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} style={{ height: '8px' }} />;
        }

        // Horizontal divider
        if (/^---|\*\*\*|___$/.test(trimmed)) {
          return <hr key={idx} style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.15)', margin: '10px 0' }} />;
        }

        // Headers
        if (trimmed.startsWith('### ')) {
          return (
            <div key={idx} style={{ fontWeight: '700', fontSize: '0.96rem', color: '#ffffff', marginTop: '6px', marginBottom: '2px' }}>
              {formatInline(trimmed.slice(4))}
            </div>
          );
        }
        if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
          const headerText = trimmed.replace(/^#+\s*/, '');
          return (
            <div key={idx} style={{ fontWeight: '800', fontSize: '1.05rem', color: '#ffffff', marginTop: '8px', marginBottom: '4px' }}>
              {formatInline(headerText)}
            </div>
          );
        }

        // Bullet / Checklist items
        if (/^[•\-\*]\s+/.test(trimmed)) {
          const itemText = trimmed.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingLeft: '4px' }}>
              <span style={{ color: '#ffffff', opacity: 0.8, fontSize: '0.9rem', lineHeight: '1.5' }}>•</span>
              <span style={{ flex: 1, lineHeight: '1.55' }}>{formatInline(itemText)}</span>
            </div>
          );
        }

        // Numbered list
        const numMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingLeft: '4px' }}>
              <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.85rem', minWidth: '18px' }}>{numMatch[1]}</span>
              <span style={{ flex: 1, lineHeight: '1.55' }}>{formatInline(numMatch[2])}</span>
            </div>
          );
        }

        return (
          <div key={idx} style={{ lineHeight: '1.55' }}>
            {formatInline(line)}
          </div>
        );
      })}
    </div>
  );
}

function generatePersonalizedSchedule(tasksInput) {
  const cleanText = tasksInput.replace(/^(daily overview|dayli overview|overview|schedule|routine|here are my tasks|my tasks for today are|today tasks|today:?)\s*[:\-]?\s*/i, '').trim();
  
  const rawLines = cleanText.split(/[\n;]|(?=\d+[\.\)])|(?=[•\-\*]\s+)/).map(s => s.trim()).filter(Boolean);
  let items = [];
  for (const l of rawLines) {
    const cleaned = l.replace(/^\d+[\.\)]\s*/, '').replace(/^[•\-\*]\s*/, '').trim();
    if (cleaned.length >= 2 && !/^(today|task|tasks|my tasks|i have|schedule|overview)$/i.test(cleaned)) {
      items.push(cleaned);
    }
  }
  if (items.length === 0) {
    items = cleanText.split(',').map(s => s.trim()).filter(s => s.length >= 2);
  }
  if (items.length === 0) {
    items = [cleanText || 'Core system engineering & daily focus goals'];
  }

  let schedule = `📋 **Your Personalized Daily Schedule & Action Plan**\n\n🎯 **Target Tasks for Today:**\n`;
  items.forEach((item, idx) => {
    schedule += `• ${idx + 1}. ${item}\n`;
  });

  schedule += `\n⏳ **Optimized Time Blocks:**\n`;
  if (items.length === 1) {
    schedule += `• **Morning (09:00 - 12:30)**: Deep Work — ${items[0]} (Core Focus)\n`;
    schedule += `• **Midday (12:30 - 13:30)**: Lunch & Cognitive Break\n`;
    schedule += `• **Afternoon (13:30 - 17:00)**: Execution — ${items[0]} (Refinement & Testing)\n`;
    schedule += `• **Evening (17:00 - 19:30)**: Review, Wrap-up & Memory Sync\n`;
  } else {
    const mid = Math.ceil(items.length / 2);
    const morningTasks = items.slice(0, mid);
    const afternoonTasks = items.slice(mid);

    schedule += `• **Morning (09:00 - 12:30)**: Deep Work Block\n`;
    morningTasks.forEach(t => {
      schedule += `  - Priority: ${t}\n`;
    });
    schedule += `• **Midday (12:30 - 13:30)**: Lunch & Mental Recharge\n`;
    schedule += `• **Afternoon (13:30 - 17:30)**: Collaboration & Execution Block\n`;
    afternoonTasks.forEach(t => {
      schedule += `  - Target: ${t}\n`;
    });
    schedule += `• **Evening (18:00 - 20:00)**: Daily Review, Vault Sync & Wind Down\n`;
  }

  schedule += `\n⚡ **Daily Neural Strategy:**\n`;
  schedule += `• Tackle the hardest task during your morning focus window.\n`;
  schedule += `• Use 45-minute sprint cycles with 5-minute pauses.\n`;
  schedule += `• Sync completed items to your Memory Vault at the end of the day.`;

  return schedule;
}

const QUICK_PROMPTS = [
  { label: 'Create Presentation', query: 'Create a 4-slide presentation on System Architecture', Icon: SlidesIcon },
  { label: 'Search Knowledge', query: 'Search knowledge base for system documentation', Icon: SearchIcon },
  { label: 'Code Task', query: 'Write a Python task queue function', Icon: ZapIcon },
  { label: 'Daily Overview', query: 'Daily Overview', Icon: CalendarIcon },
];

export default function ChatInterface({ onOpenVoice, onGenerateSlides }) {
  const [input, setInput]                     = useState('');
  const [isAwaitingDailyTasks, setIsAwaitingDailyTasks] = useState(false);
  const [messages, setMessages]               = useState([{
    id: 'init', sender: 'neuro',
    text: `🧠 I'm your Second Brain. Share your thoughts, ideas, or questions and let's work through them together.`,
    ts: 'Just now'
  }]);
  const [isThinking, setIsThinking]           = useState(false);
  const [stepIdx,    setStepIdx]              = useState(0);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking]);

  const textareaRef = useRef(null);

  const send = async (customText) => {
    let textToUse = typeof customText === 'string' ? customText : input;
    const query = textToUse.trim();
    if (!query) return;

    setMessages(prev => [...prev, {
      id: `u${Date.now()}`, sender: 'user', text: query,
      ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    
    if (typeof customText !== 'string') {
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
    setIsThinking(true);
    setStepIdx(0);

    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step < 5) setStepIdx(step);
    }, 320);

    const lower = query.toLowerCase().replace("’", "'").trim();

    // Check if user is asking for daily overview without task details
    const isDailyOverviewRequest = /^(daily overview|dayli overview|overview|schedule|routine|plan my day)$/.test(lower) || (
      /daily overview|dayli overview|my schedule|plan my day/.test(lower) && query.length < 35
    );

    // Try backend API
    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query, user_id: 'default' })
      });
      if (res.ok) {
        const data = await res.json();
        clearInterval(timer);
        setStepIdx(4);
        setTimeout(() => {
          setIsThinking(false);
          if (isDailyOverviewRequest) {
            setIsAwaitingDailyTasks(true);
          } else {
            setIsAwaitingDailyTasks(false);
          }
          setMessages(prev => [...prev, {
            id: `n${Date.now()}`, sender: 'neuro',
            text: data.final_response,
            ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }, 180);
        return;
      }
    } catch (_) {}

    // Fallback smart calculation & matcher
    setTimeout(() => {
      clearInterval(timer);
      setStepIdx(4);
      setIsThinking(false);

      let answer = '';

      // Check bad words / profanity
      const profanities = ["fuck", "sex", "xxx", "madarchod", "madarchord", "bkl", "mkc"];
      if (profanities.some(w => new RegExp(`\\b${w}\\b`).test(lower)) || lower.includes("xxx")) {
        answer = "⚠️ [RED ALERT] dont use such kind of bad word";
      }

      // Interactive Daily Overview Flow
      if (isDailyOverviewRequest) {
        setIsAwaitingDailyTasks(true);
        answer = `📋 **Let's build your personalized Daily Overview!**\n\nPlease tell me what tasks, goals, or meetings you have planned for today (e.g., 10:00 AM team standup, finish backend API, gym at 6:00 PM, study React).\n\nSend your list, and I'll generate a personalized schedule & time-block breakdown for you.`;
      } else if (isAwaitingDailyTasks || (/^(my tasks|tasks|today|here are|i have to|i need to|schedule:)/.test(lower) && query.length > 8)) {
        setIsAwaitingDailyTasks(false);
        answer = generatePersonalizedSchedule(query);
      }

      // Check 80 QNA dataset
      if (!answer) {
        if (CUSTOM_QNA[lower]) {
          answer = CUSTOM_QNA[lower];
        } else if (CUSTOM_QNA[query]) {
          answer = CUSTOM_QNA[query];
        }
      }

      // Self-introduction & Team Information
      if (!answer && /tell about your self|tell about yourself|tell me about yourself|tell me about your self|about yourself|about your self|about you|who are you|introduce yourself|who created you|who made you|who developed you|team|creator|mentor/.test(lower)) {
        answer = `🧠 NEURO — Autonomous AI Assistant & Second Brain\n\nWhat I Can Do:\n• Voice & Text Interaction: Instant Q&A, math calculations, and conversational responses.\n• Code Generation & Debugging: Writing and optimizing Python, JavaScript/React, and API backends.\n• Knowledge & Research: Concept explanation, memory retrieval, and indexing.\n• Slide & Presentation Builder: Generating interactive 16:9 presentations.\n• Daily Planning: Daily briefings, schedule breakdowns, and focus tracking.\n\n---\n\n👥 Project Leadership & Team\n\n👤 Lead\n• Name: Sanzit Kumar Shil (Amit)\n• Sid: 2025826075\n• Email: 2025826075.sanzit@ug.sharda.ac.in\n• Phone: 7364015499\n\n👥 Co-Lead\n• Name: Prottoy Sarker\n• Sid: 2025821534\n• Email: 2025821534.prottoy@ug.sharda.ac.in\n• Phone: 7477387628\n\n🎓 Mentor (Cyber Security)\n• Name: Dr. Avinash Kumar\n• Email: avinash.kumar@sharda.ac.in\n• Phone: +91 96251 31621\n• Domain Expertise: Cyber Security`;
      }

      // Tech Stack / Engineering part
      if (!answer && /tech part|technology|tech stack|engineering part|how are you built|what language|engimear/.test(lower)) {
        answer = `⚙️ ENGINEERING ARCHITECTURE\n\n🧠 Backend (Brain)\n• Language: Python\n• Framework: FastAPI\n• Server: Uvicorn (ASGI server)\n• AI Engine: Ollama (local LLM runner)\n• Memory: ChromaDB (vector database)\n• Embeddings: Sentence-Transformers\n\n🎨 Frontend (Face)\n• Language: JavaScript (JSX) + HTML\n• Framework: React.js\n• Build Tool: Vite (fast bundler/dev server)\n• Styling: Vanilla CSS (custom glassmorphic UI)\n\n✨ Animations (Life)\n• Tech: CSS Keyframes + SVG\n• Trigger: React toggles CSS classes for smooth GPU animations\n\n💻 Local Hosting (Private)\n• Ollama: Runs LLM locally (port 11434)\n• Backend: FastAPI via Uvicorn (port 8000)\n• Frontend: Vite dev server (port 5173)\n\n🔄 Flow: Browser → React → FastAPI → Ollama → Response back`;
      }

      // Daily overview with tasks in prompt
      if (!answer && /daily overview|dayli overview|overview|schedule|routine/.test(lower)) {
        answer = generatePersonalizedSchedule(query);
      }

      // Math
      if (!answer) {
        const mathMatch = query.match(/([\d\.\s\+\-\*\/\^\(\)\%]+)/);
        if (/[\+\-\*\/\^\%]/.test(query) && mathMatch) {
          try {
            const expr = mathMatch[1].trim().replace(/\^/g, '**');
            if (/^[\d\.\s\+\-\*\/\(\)\%]+$/.test(expr)) {
              // eslint-disable-next-line no-eval
              const val = Function('"use strict";return (' + expr + ')')();
              if (typeof val === 'number' && !isNaN(val)) {
                const displayVal = Number.isInteger(val) ? val : Number(val.toFixed(4));
                answer = `The result is ${displayVal}.`;
              }
            }
          } catch (_) {}
        }
      }

      if (!answer) {
        if (/time|current time|what time/.test(lower)) {
          answer = `Current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
        } else if (/date|today|what day/.test(lower)) {
          answer = `Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
        } else if (/slide|presentation|gamma|deck/.test(lower)) {
          if (onGenerateSlides) onGenerateSlides(query);
          answer = `Generated presentation for: "${query}". Switch to Slides tab to view.`;
        } else if (/reverse.*string/.test(lower)) {
          answer = "In Python: `text[::-1]`. In JavaScript: `text.split('').reverse().join('')`.";
        } else if (/how.*going|how.*doing|how.*you/.test(lower)) {
          answer = "Everything is running smoothly! How can I assist you today?";
        } else {
          answer = `I am ready to assist with "${query}"!\n\n*(Note: To get dynamic AI generation for any prompt, make sure the NEURO Python backend server is running on port 8000).*`;
        }
      }

      setMessages(prev => [...prev, {
        id: `n${Date.now()}`, sender: 'neuro',
        text: answer,
        ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', position: 'relative' }}>
      
      {/* Thinking Loop */}
      <ThinkingLoop stepIndex={stepIdx} active={isThinking} />

      {/* Messages Viewport with Animated Neural Particle Field */}
      <div className="card" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        minHeight: 0,
        background: 'radial-gradient(ellipse at top, #0b0f17 0%, #05070a 100%)',
        border: '1px solid rgba(255,255,255,0.16)',
        borderRadius: '16px',
        boxShadow: '0 0 35px rgba(0,0,0,0.8), inset 0 0 25px rgba(255,255,255,0.02)',
        position: 'relative'
      }}>
        {/* Ambient Neural Particle Canvas */}
        <NeuralBackgroundCanvas />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map(msg => (
            <div key={msg.id} className="fade-in"
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: msg.sender === 'user' ? '75%' : '90%',
                width: msg.sender === 'neuro' ? '100%' : 'auto'
              }}
            >
              {msg.sender === 'neuro' ? (
                <div style={{
                  background: msg.text.includes('[RED ALERT]') ? 'rgba(185, 28, 28, 0.15)' : 'rgba(14, 18, 26, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: msg.text.includes('[RED ALERT]') ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(255,255,255,0.22)',
                  borderRadius: '14px',
                  borderTopLeftRadius: '4px',
                  padding: '16px 18px',
                  boxShadow: msg.text.includes('[RED ALERT]') ? '0 0 25px rgba(239, 68, 68, 0.25), 0 8px 30px rgba(0, 0, 0, 0.6)' : '0 0 25px rgba(255,255,255,0.06), 0 8px 30px rgba(0,0,0,0.6)',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {msg.text.includes('[RED ALERT]') ? (
                        <span style={{ fontSize: '1.2rem', filter: 'drop-shadow(0 0 8px #ef4444)' }}>⚠️</span>
                      ) : (
                        msg.id !== 'init' && <CuteBrainEmoji size={30} />
                      )}
                      {msg.id === 'init' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff', boxShadow: '0 0 8px #ffffff' }} />}
                      <span style={{ 
                        fontSize: '0.72rem', 
                        fontWeight: '800', 
                        color: msg.text.includes('[RED ALERT]') ? '#f87171' : '#ffffff', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.06em',
                        textShadow: msg.text.includes('[RED ALERT]') ? '0 0 8px rgba(239, 68, 68, 0.5)' : 'none'
                      }}>
                        {msg.text.includes('[RED ALERT]') ? 'SECURITY SHIELD' : 'NEURO'}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{msg.ts}</span>
                  </div>

                  <div style={{ 
                    fontSize: '0.92rem', 
                    color: msg.text.includes('[RED ALERT]') ? '#fecaca' : '#f8fafc', 
                    lineHeight: '1.65',
                    fontWeight: msg.text.includes('[RED ALERT]') ? '600' : 'normal' 
                  }}>
                    <FormattedMessage text={msg.text.replace(/⚠️\s*\[RED\s*ALERT\]\s*/gi, '')} />
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  borderRadius: '14px',
                  borderBottomRightRadius: '4px',
                  padding: '12px 16px',
                  boxShadow: '0 0 20px rgba(255,255,255,0.12), 0 6px 20px rgba(0,0,0,0.4)'
                }}>
                  <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginBottom: '4px', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <span>You</span><span>·</span><span>{msg.ts}</span>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#ffffff', margin: 0, lineHeight: '1.5', fontWeight: '500' }}>{msg.text}</p>
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>

      {/* Quick Action Chips with Glowing Accents */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {QUICK_PROMPTS.map(p => (
          <button
            key={p.label}
            onClick={() => send(p.query)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: '9999px',
              background: 'rgba(255,255,255,0.04)',
              color: '#e2e8f0',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(255,255,255,0.3)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
              e.currentTarget.style.color = '#e2e8f0';
            }}
          >
            <p.Icon size={14} color="#ffffff" />
            {p.label}
          </button>
        ))}
      </div>

      {/* Glowing High-Tech Input Bar */}
      <div style={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        padding: '8px 10px',
        background: '#070a10',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.25)',
        boxShadow: '0 0 30px rgba(0,0,0,0.9), 0 0 18px rgba(255,255,255,0.08)'
      }}>
        <button
          onClick={onOpenVoice}
          className="btn btn-ghost btn-icon-md"
          title="Voice Interface"
          style={{
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(255,255,255,0.1)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="7.5" y="2" width="5" height="10" rx="2.5" stroke="#ffffff" strokeWidth="1.5" fill="none"/>
            <path d="M4 10c0 3.314 2.686 6 6 6s6-2.686 6-6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <line x1="10" y1="16" x2="10" y2="19" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          className="input"
          placeholder="Share your thoughts... (Shift+Enter for newline, Enter or Ctrl+Enter to send)"
          value={input}
          onChange={e => {
            setInput(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              if (e.shiftKey) {
                // allow newline
                return;
              }
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          style={{
            flex: 1,
            fontSize: '0.92rem',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            color: '#ffffff',
            resize: 'none',
            paddingTop: '3px',
            fontFamily: 'inherit',
            maxHeight: '150px'
          }}
        />

        <button
          onClick={() => send()}
          style={{
            background: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '0.84rem',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 20px rgba(255,255,255,0.4)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 28px rgba(255,255,255,0.7)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.4)'}
        >
          <SendIcon size={14} color="#000000" /> Send
        </button>
      </div>
    </div>
  );
}

