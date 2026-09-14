import React, { useState, useRef, useEffect } from 'react';
import { VoiceIcon } from './Icons';

// Neural Node Emoji — pops in when voice NEURO responds
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
          <radialGradient id="vcoreG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95"/>
            <stop offset="50%" stopColor="#e0e7ff" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0"/>
          </radialGradient>
          <filter id="vcGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feComposite in="SourceGraphic" in2="b" operator="over"/>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle cx="20" cy="20" r="17" stroke="#ffffff" strokeWidth="0.6" fill="none" opacity="0.15" />
        {/* Inner ring */}
        <circle cx="20" cy="20" r="10" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.2" />

        {/* Glowing core */}
        <circle cx="20" cy="20" r="7" fill="url(#vcoreG)" filter="url(#vcGlow)" />
        <circle cx="20" cy="20" r="3.5" fill="#ffffff" opacity="0.9" filter="url(#vcGlow)" />
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
          <circle cx="8"  cy="10" r="1.8" fill="#ffffff" opacity="0.7" filter="url(#vcGlow)" />
          <circle cx="32" cy="10" r="1.8" fill="#ffffff" opacity="0.7" filter="url(#vcGlow)" />
          <circle cx="34" cy="26" r="1.5" fill="#ffffff" opacity="0.5" />
          <circle cx="6"  cy="28" r="1.5" fill="#ffffff" opacity="0.5" />
          <circle cx="20" cy="4"  r="1.2" fill="#ffffff" opacity="0.4" />
          <circle cx="20" cy="36" r="1.2" fill="#ffffff" opacity="0.35" />
        </g>
      </svg>
    </span>
  );
}

function GlowingCanvasVisualizer({ isActive, isSpeaking }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    let t = 0;
    const bars = 48;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Dark background with subtle grid line
      ctx.fillStyle = '#06080d';
      ctx.fillRect(0, 0, W, H);

      // Center baseline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      ctx.lineTo(W, H / 2);
      ctx.stroke();

      const activeState = isActive || isSpeaking;

      // Draw Glowing Sine Wave
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = activeState ? '#ffffff' : 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = activeState ? 2.5 : 1.2;
      ctx.shadowBlur = activeState ? 16 : 4;
      ctx.shadowColor = '#ffffff';

      for (let x = 0; x < W; x++) {
        const freq = activeState ? 0.035 : 0.015;
        const speed = activeState ? 0.08 : 0.02;
        const amp = activeState 
          ? (Math.sin(x * 0.02 + t * 0.05) * 0.35 + 0.65) * (H * 0.28) * (0.8 + Math.sin(t * speed) * 0.2)
          : (H * 0.08);

        const y = H / 2 + Math.sin(x * freq + t * speed) * amp * Math.sin((x / W) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // Draw Equalizer Bars with glow
      const barW = (W / bars) * 0.65;
      const gap = (W / bars) * 0.35;

      for (let i = 0; i < bars; i++) {
        const x = i * (barW + gap) + gap / 2;
        const normalizedCenter = Math.sin((i / bars) * Math.PI);
        
        let barHeight;
        if (activeState) {
          const wave1 = Math.sin(t * 0.09 + i * 0.22);
          const wave2 = Math.cos(t * 0.06 - i * 0.18);
          barHeight = Math.max(6, (wave1 * 0.5 + wave2 * 0.5 + 1) * (H * 0.35) * normalizedCenter);
        } else {
          barHeight = Math.max(4, (Math.sin(t * 0.03 + i * 0.15) * 0.5 + 0.5) * (H * 0.12) * normalizedCenter);
        }

        ctx.save();
        ctx.fillStyle = activeState ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
        ctx.shadowBlur = activeState ? 12 : 2;
        ctx.shadowColor = '#ffffff';

        // Top bar
        ctx.fillRect(x, H / 2 - barHeight, barW, barHeight - 1);
        // Bottom mirror bar
        ctx.fillRect(x, H / 2 + 1, barW, barHeight - 1);
        ctx.restore();
      }

      t++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [isActive, isSpeaking]);

  return (
    <div style={{
      width: '100%',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: isActive || isSpeaking ? '0 0 25px rgba(255,255,255,0.2), inset 0 0 20px rgba(255,255,255,0.05)' : '0 0 10px rgba(0,0,0,0.5)'
    }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '110px', display: 'block' }} />
    </div>
  );
}

export default function VoiceMode() {
  const [isRecording, setIsRecording]   = useState(false);
  const [isSpeaking,  setIsSpeaking]    = useState(false);
  const [transcript,  setTranscript]    = useState('');
  const [history,     setHistory]       = useState([]);
  const [interimText, setInterimText]   = useState('');
  const [isLoading,   setIsLoading]     = useState(false);
  const [lastReply,   setLastReply]     = useState('');
  const recognizerRef = useRef(null);

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    u.onstart = () => setIsSpeaking(true);
    u.onend   = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const stripEmojis = (str) => {
    if (!str) return '';
    return str
      // Remove all emoji / pictographic / symbol Unicode ranges
      .replace(
        /[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{2300}-\u{23FF}]|[\u{2B00}-\u{2BFF}]|[\u{FE00}-\u{FEFF}]|[\u{1F1E0}-\u{1F1FF}]|\u200D|\uFE0F|\u20E3/gu,
        ''
      )
      // Clean up any double spaces left behind
      .replace(/  +/g, ' ')
      .trim();
  };

  const formatForSpeech = (raw) => {
    if (!raw) return '';
    let txt = raw;

    // 1. Remove RED ALERT prefix
    txt = txt.replace(/⚠️\s*\[RED\s*ALERT\]\s*/gi, '');

    // 2. Strip all emojis
    txt = stripEmojis(txt);

    // 3. Remove code blocks entirely (``` ... ```)
    txt = txt.replace(/```[\s\S]*?```/g, '');

    // 4. Remove inline code backticks — keep the inner text
    txt = txt.replace(/`([^`]*)`/g, '$1');

    // 5. Strip blockquote markers (> at start of line)
    txt = txt.replace(/^>\s*/gm, '');

    // 6. Strip markdown headers — keep the heading text
    txt = txt.replace(/^#{1,6}\s*(.*)/gm, '$1');

    // 7. Strip bold (**text** or __text__) — keep inner text
    txt = txt.replace(/\*\*(.*?)\*\*/g, '$1');
    txt = txt.replace(/__(.*?)__/g, '$1');

    // 8. Strip italic (*text* or _text_) — keep inner text
    txt = txt.replace(/\*(.*?)\*/g, '$1');
    txt = txt.replace(/_(.*?)_/g, '$1');

    // 9. Strip bullet list markers (-, *, +) — keep item text
    txt = txt.replace(/^\s*[-*+]\s+/gm, '');

    // 10. Strip numbered list markers (1. 2. etc.) — keep item text
    txt = txt.replace(/^\s*\d+\.\s+/gm, '');

    // 11. Strip markdown links [text](url) — keep link text only
    txt = txt.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // 12. Strip bare URLs
    txt = txt.replace(/https?:\/\/\S+/g, '');

    // 13. Strip leftover special characters: |, ~, ^, =, <, >
    txt = txt.replace(/[|~^=<>]/g, '');

    // 14. Strip stray asterisks, underscores, hashes, backticks
    txt = txt.replace(/[*_#`]/g, '');

    // 15. Replace multiple newlines with a sentence pause
    txt = txt.replace(/\n{2,}/g, '. ');

    // 16. Replace single newlines with a space
    txt = txt.replace(/\n/g, ' ');

    // 17. Collapse multiple spaces
    txt = txt.replace(/  +/g, ' ');

    // 18. Fix double punctuation from collapsing (e.g. ".. " or ". .")
    txt = txt.replace(/([.!?])\s*\.\s*/g, '$1 ');

    return txt.trim();
  };

  const getLocalReply = (text) => {
    const clean = text.trim();
    const lower = clean.toLowerCase().replace("’", "'");

    const customQna = {
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
      "how r u": "I'm good",
      "how are you": "fine",
      "what's up": "nothing much",
      "whats up": "nothing much",
      "wru": "at home",
      "wyd": "just chilling",
      "hbu": "I'm okay",
      "how's life": "going well",
      "hows life": "going well",
      "how's it going": "all good",
      "hows it going": "all good",
      "what's new": "not much",
      "whats new": "not much",
      "long time": "yeah, been a while",
      "miss u": "miss you too",
      "love u": "love you too",
      "brb": "ok",
      "ttyl": "sure",
      "lol": "haha",
      "lmao": "laughing out loud",
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
      "bored": "let's chat",
      "hungry": "grab food",
      "thirsty": "drink water",

      // Emojis & Slang (61–80)
      "😂": "lol",
      "😢": "don't cry",
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
      "thx": "no problem",
      "np": "anytime",
      "idc": "same",
      "btw": "by the way",
      "omg lol": "haha wow",
      "rofl": "laughing out loud",
      "bruh": "dude"
    };

    // Check bad words / profanity
    const profanities = ["fuck", "sex", "xxx", "madarchod", "madarchord", "bkl", "mkc"];
    if (profanities.some(w => new RegExp(`\\b${w}\\b`).test(lower)) || lower.includes("xxx")) {
      return "⚠️ [RED ALERT] dont use such kind of bad word";
    }

    if (customQna[lower]) return customQna[lower];
    if (customQna[clean]) return customQna[clean];

    // 1. Math calculation
    const mathMatch = clean.match(/([\d\.\s\+\-\*\/\^\(\)\%]+)/);
    if (/[\+\-\*\/\^\%]/.test(clean) && mathMatch) {
      try {
        const expr = mathMatch[1].trim().replace(/\^/g, '**');
        if (/^[\d\.\s\+\-\*\/\(\)\%]+$/.test(expr)) {
          // eslint-disable-next-line no-eval
          const val = Function('"use strict";return (' + expr + ')')();
          if (typeof val === 'number' && !isNaN(val)) {
            const displayVal = Number.isInteger(val) ? val : Number(val.toFixed(4));
            return `The result is ${displayVal}.`;
          }
        }
      } catch (_) {}
    }

    // 2. Date & Time
    if (/time|what time|current time|clock|what is the time/.test(lower)) {
      return `The current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
    }
    if (/date|today|day is it|what day/.test(lower)) {
      return `Today is ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;
    }

    // 3. Factual knowledge base
    const facts = {
      'capital of france': 'The capital of France is Paris.',
      'capital of usa': 'The capital of the United States is Washington, D.C.',
      'capital of united states': 'The capital of the United States is Washington, D.C.',
      'capital of uk': 'The capital of the United Kingdom is London.',
      'capital of england': 'The capital of England is London.',
      'capital of germany': 'The capital of Germany is Berlin.',
      'capital of japan': 'The capital of Japan is Tokyo.',
      'capital of india': 'The capital of India is New Delhi.',
      'capital of canada': 'The capital of Canada is Ottawa.',
      'capital of australia': 'The capital of Australia is Canberra.',
      'capital of china': 'The capital of China is Beijing.',
      'capital of russia': 'The capital of Russia is Moscow.',
      'capital of italy': 'The capital of Italy is Rome.',
      'capital of spain': 'The capital of Spain is Madrid.',
      'speed of light': 'The speed of light in a vacuum is approximately 299,792,458 meters per second.',
      'largest planet': 'Jupiter is the largest planet in our Solar System.',
      'who created python': 'Python was created by Guido van Rossum and released in 1991.',
      'who created javascript': 'JavaScript was created by Brendan Eich in 1995.',
      'who created linux': 'Linux was created by Linus Torvalds in 1991.',
      'what is html': 'HTML is the standard markup language used to structure documents and pages on the web.',
      'what is css': 'CSS is the stylesheet language used to design and style web pages.',
      'what is react': 'React is a popular JavaScript library created by Meta for building component-based user interfaces.',
      'what is python': 'Python is a high-level, versatile programming language known for readability and clean syntax.',
      'what is ai': 'Artificial Intelligence is the simulation of human intelligence by computer algorithms and models.'
    };

    for (const [k, v] of Object.entries(facts)) {
      if (lower.includes(k)) return v;
    }

    // 4. About Yourself & Team Information
    if (/tell about your self|tell about yourself|tell me about yourself|tell me about your self|about yourself|about your self|about you|who are you|introduce yourself|who created you|who made you|who developed you|team|creator|mentor/.test(lower)) {
      return "I am NEURO, an autonomous AI assistant and second brain. I assist with voice conversations, coding, research, daily planning, and slide generation. The project lead is Sanzit Kumar Shil (Amit), co-lead is Prottoy Sarker, and mentor is Dr. Avinash Kumar specializing in Cyber Security.";
    }

    // 4.5 Tech Stack
    if (/tech part|technology|tech stack|engineering part|how are you built|what language|engimear/.test(lower)) {
      return "My engineering architecture is divided into a backend brain and a frontend face. For my backend brain, I am built with Python and FastAPI, running on a Uvicorn server. My AI engine is powered by Ollama running locally, and I use ChromaDB with Sentence-Transformers for my vector memory. For my frontend face, I am built using React, JavaScript, and HTML, bundled with Vite. My design uses vanilla CSS for a custom glassmorphic UI, and my animations are powered by CSS keyframes and SVGs. When you talk to me, the flow goes from your browser, through React to FastAPI, into Ollama, and back to you.";
    }

    // 5. Code requests
    if (lower.includes('reverse') && lower.includes('string')) {
      return 'To reverse a string in Python, use text[::-1]. In JavaScript, use text.split("").reverse().join("").';
    }
    if (lower.includes('palindrome')) {
      return 'A palindrome reads the same backwards as forwards, such as "racecar" or "level".';
    }
    if (lower.includes('fibonacci')) {
      return 'The Fibonacci sequence is 0, 1, 1, 2, 3, 5, 8, 13, 21. Each number is the sum of the previous two.';
    }

    // 6. System
    if (/joke/.test(lower)) {
      return 'Why do programmers prefer dark mode? Because light attracts bugs!';
    }
    if (/how.*going|how.*doing|how.*you/.test(lower)) {
      return 'Everything is going great! How can I help you today?';
    }

    return `I am ready to assist with "${clean}".`;
  };

  const sendToBackend = async (text) => {
    setIsLoading(true);
    setLastReply('');
    try {
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, user_id: 'voice_user' })
      });
      if (!res.ok) throw new Error('not ok');
      const data = await res.json();
      const reply = data.final_response || data.reply || getLocalReply(text);
      const cleanReply = formatForSpeech(reply);
      setLastReply(cleanReply);
      speak(cleanReply);
      setHistory(h => [{ text, reply: cleanReply, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...h]);
    } catch (_) {
      const fallback = formatForSpeech(getLocalReply(text));
      setLastReply(fallback);
      speak(fallback);
      setHistory(h => [{ text, reply: fallback, ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...h]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = () => {
    setTranscript('');
    setLastReply('');
    setIsRecording(true);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Browser does not support SpeechRecognition. Use Chrome or Edge.');
      setIsRecording(false);
      return;
    }

    const r = new SpeechRecognition();
    r.continuous      = true;
    r.interimResults  = true;
    r.lang            = 'en-US';
    recognizerRef.current = r;

    r.onresult = e => {
      let final = '', interim = '';
      for (const res of e.results) {
        if (res.isFinal) final += res[0].transcript + ' ';
        else interim += res[0].transcript;
      }
      if (final) setTranscript(prev => prev + final);
      setInterimText(interim);
    };
    r.onerror = () => setIsRecording(false);
    r.onend   = () => { setIsRecording(false); setInterimText(''); };
    r.start();
  };

  const stopRecording = () => {
    recognizerRef.current?.stop();
    setIsRecording(false);
    setInterimText('');
    const finalText = (transcript + interimText).trim();
    if (finalText) sendToBackend(finalText);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '820px', margin: '0 auto', width: '100%' }}>

      {/* Main Glowing Visualizer Card */}
      <div className="card glow-breath" style={{
        background: '#070a10',
        border: '1px solid rgba(255,255,255,0.22)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', padding: '28px 24px' }}>
          
          {/* Dynamic Spectrum / Waveform Visualizer */}
          <GlowingCanvasVisualizer isActive={isRecording} isSpeaking={isSpeaking} />

          {/* Equalizer Visualizer Bars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '24px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <span
                key={n}
                style={{
                  width: '3px',
                  borderRadius: '2px',
                  background: '#ffffff',
                  boxShadow: (isRecording || isSpeaking) ? '0 0 8px #ffffff' : 'none',
                  animation: (isRecording || isSpeaking) ? `barBounce ${0.4 + (n % 4) * 0.15}s infinite ease-in-out` : 'none',
                  height: (isRecording || isSpeaking) ? '100%' : '20%',
                  opacity: (isRecording || isSpeaking) ? 0.9 : 0.25,
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>

          {/* Status Text & Glowing Beacon */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ffffff',
                boxShadow: (isRecording || isSpeaking) ? '0 0 12px #ffffff, 0 0 24px #ffffff' : '0 0 4px rgba(255,255,255,0.4)',
                animation: (isRecording || isSpeaking) ? 'pulse 1s infinite' : 'none'
              }} />
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: '700',
                color: '#ffffff',
                textShadow: (isRecording || isSpeaking) ? '0 0 14px rgba(255,255,255,0.8)' : 'none',
                letterSpacing: '-0.02em'
              }}>
                {isRecording ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Voice Interface'}
              </div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#8892b0' }}>
              {isRecording ? 'Tap mic to process' : 'Tap mic to speak'}
            </p>
          </div>

          {/* Interactive Mic Button with Glowing Ripple Rings */}
          <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Ambient Pulse Ripple 1 */}
            {isRecording && (
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.8)',
                boxShadow: '0 0 20px rgba(255,255,255,0.6)',
                animation: 'rippleOut 1.8s infinite ease-out'
              }} />
            )}

            {/* Ambient Pulse Ripple 2 */}
            {isRecording && (
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.5)',
                animation: 'rippleOut 1.8s infinite ease-out 0.6s'
              }} />
            )}

            {/* Main Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
              style={{
                position: 'relative',
                zIndex: 2,
                width: '80px', height: '80px', borderRadius: '50%',
                border: `2px solid ${isRecording ? '#ffffff' : 'rgba(255,255,255,0.3)'}`,
                background: isRecording ? '#ffffff' : '#0d111a',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: isRecording
                  ? '0 0 35px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4)'
                  : '0 0 15px rgba(255,255,255,0.1), inset 0 0 10px rgba(255,255,255,0.05)',
                transition: 'all 0.25s ease'
              }}
            >
              <VoiceIcon size={32} color={isRecording ? '#000000' : '#ffffff'} />
            </button>
          </div>

          {/* Live Transcript Display */}
          {(transcript || interimText) && (
            <div style={{
              width: '100%', padding: '14px 18px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '10px', background: '#000000',
              boxShadow: '0 0 20px rgba(255,255,255,0.15)',
              fontSize: '0.92rem', color: '#ffffff', minHeight: '48px',
              lineHeight: '1.55'
            }}>
              <span style={{ fontWeight: '500' }}>{transcript}</span>
              <span style={{ color: '#888888', fontStyle: 'italic' }}>{interimText}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', fontSize: '0.88rem', textShadow: '0 0 8px #ffffff' }}>
              <svg style={{ animation: 'spin 0.8s linear infinite', display: 'inline-block', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 12a9 9 0 1 1-9-9" />
              </svg>
              Processing...
            </div>
          )}

          {/* AI Response Card with High-Glow Accents */}
          {lastReply && !isLoading && (
            <div style={{
              width: '100%', padding: '16px 20px',
              border: lastReply.includes('[RED ALERT]') ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(255,255,255,0.35)',
              borderRadius: '12px',
              background: lastReply.includes('[RED ALERT]') ? 'rgba(185, 28, 28, 0.15)' : '#0f141f',
              boxShadow: lastReply.includes('[RED ALERT]') ? '0 0 25px rgba(239, 68, 68, 0.25), 0 8px 30px rgba(0,0,0,0.6)' : '0 0 25px rgba(255,255,255,0.18)',
              fontSize: '0.92rem', color: '#ffffff', lineHeight: '1.6',
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                {lastReply.includes('[RED ALERT]') ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 6px #ef4444)', flexShrink: 0 }}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                ) : (
                  <CuteBrainEmoji size={32} />
                )}
                <span style={{
                  fontSize: '0.72rem',
                  color: lastReply.includes('[RED ALERT]') ? '#f87171' : '#ffffff',
                  textShadow: lastReply.includes('[RED ALERT]') ? '0 0 8px rgba(239, 68, 68, 0.6)' : '0 0 6px rgba(255,255,255,0.6)',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}>
                  {lastReply.includes('[RED ALERT]') ? 'SYSTEM WARNING' : 'NEURO Response'}
                </span>
              </div>
              <div style={{ color: lastReply.includes('[RED ALERT]') ? '#fecaca' : '#f1f5f9', fontWeight: lastReply.includes('[RED ALERT]') ? '600' : 'normal' }}>
                {lastReply.replace(/⚠️\s*\[RED\s*ALERT\]\s*/gi, '')}
              </div>
              <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => speak(lastReply)} 
                  style={{
                    background: '#ffffff',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '7px 16px',
                    fontSize: '0.78rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(255,255,255,0.4)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#000" style={{ marginRight: '5px', verticalAlign: 'middle' }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#000" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                  Replay
                </button>
                {isSpeaking && (
                  <button 
                    onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }} 
                    style={{
                      background: '#ff4757',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 16px',
                      fontSize: '0.78rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      boxShadow: '0 0 16px rgba(255,71,87,0.4)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: '5px', verticalAlign: 'middle' }}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    Stop
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="card" style={{ background: '#070a10', border: '1px solid rgba(255,255,255,0.14)', borderRadius: '12px' }}>
          <div className="card-header" style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              History
            </span>
          </div>
          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {history.map((h, i) => (
              <div key={i} style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '4px' }}>You: {h.text}</div>
                {h.reply && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.86rem', color: '#ffffff', marginBottom: '6px', textShadow: '0 0 4px rgba(255,255,255,0.2)' }}><CuteBrainEmoji size={26} /><span style={{ flex: 1 }}>{h.reply}</span></div>}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.65rem', color: '#555555' }}>{h.ts}</span>
                  {h.reply && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => speak(h.reply)} 
                        style={{
                          background: 'transparent',
                          color: '#ffffff',
                          border: '1px solid rgba(255,255,255,0.25)',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          boxShadow: '0 0 8px rgba(255,255,255,0.15)'
                        }}
                      >
                         <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff" style={{ marginRight: '4px', verticalAlign: 'middle' }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
                         Replay
                      </button>
                      {isSpeaking && (
                        <button 
                          onClick={() => { window.speechSynthesis.cancel(); setIsSpeaking(false); }} 
                          style={{
                            background: 'transparent',
                            color: '#ff4757',
                            border: '1px solid rgba(255,71,87,0.4)',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '0.7rem',
                            cursor: 'pointer',
                            boxShadow: '0 0 8px rgba(255,71,87,0.15)'
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="#ff4757" style={{ marginRight: '4px', verticalAlign: 'middle' }}><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                          Stop
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
