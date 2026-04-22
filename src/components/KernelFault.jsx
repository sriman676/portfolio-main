'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// System fault recovery overlay — renders on critical memory violations
const _d = [
  '> SENTINEL_OS v2.0 \u2014 KERNEL PANIC',
  '> PROCESS: heart.exe \u2014 STATUS: TERMINATED',
  '> CAUSE: 0xC0DEBABE_OVERRIDE_IN_HEAP',
  '> EMOTIONAL_FIREWALL: BYPASSED',
  '> STACK_TRACE: feelings.js line 404 \u2014 love not found',
  '> ATTEMPTING_RECOVERY............FAILED',
  '> SYSTEM_MESSAGE: I\'m sorry.',
];

// Simple manual decode to avoid global dependencies
const _dec = (s) => {
  const b = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let r = '', i = 0;
  const v = s.replace(/=/g, '');
  while (i < v.length) {
    const n = (b.indexOf(v[i++]) << 18) | (b.indexOf(v[i++] || 'A') << 12) | (b.indexOf(v[i++] || 'A') << 6) | b.indexOf(v[i++] || 'A');
    r += String.fromCharCode((n >> 16) & 255, (n >> 8) & 255, n & 255);
  }
  return r.replace(/\0+$/, '');
};

const _m = () => _dec('PiBJJ20gc29ycnksIC4uLiA') + '\uD83D\uDC94';

const _p = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 4,
  dur: 3 + Math.random() * 3,
  sz: 0.6 + Math.random() * 0.5,
  op: 0.08 + Math.random() * 0.18,
}));

const _h = `
    \u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588
  \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588
 \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588
 \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588
  \u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588
    \u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588
      \u2588\u2588\u2588\u2591\u2591\u2591\u2591\u2591\u2591\u2588\u2588\u2588
        \u2588\u2588\u2588\u2591\u2591\u2588\u2588\u2588
          \u2588\u2588\u2588\u2588\u2588
           \u2588\u2588\u2588
            \u2588
`.trim();

export default function KernelFault({ onClose }) {
  const [lines, setLines]         = useState([]);
  const [showHeart, setShowHeart] = useState(false);
  const [showMsg, setShowMsg]     = useState(false);
  const [glitch, setGlitch]       = useState(false);
  const [typed, setTyped]         = useState('');
  const [showBtn, setShowBtn]     = useState(false);
  const iRef = useRef(0);
  const tRef = useRef(null);

  useEffect(() => {
    const next = () => {
      if (iRef.current >= _d.length) {
        setTimeout(() => setShowHeart(true), 300);
        setTimeout(() => setShowMsg(true), 900);
        return;
      }
      setLines((p) => [...p, _d[iRef.current]]);
      iRef.current += 1;
      tRef.current = setTimeout(next, iRef.current < 3 ? 220 : 380);
    };
    tRef.current = setTimeout(next, 300);
    return () => clearTimeout(tRef.current);
  }, []);

  useEffect(() => {
    if (!showMsg) return;
    const full = _m();
    let i = 0;
    const t = setInterval(() => {
      setTyped(full.slice(0, ++i));
      if (i >= full.length) { clearInterval(t); setTimeout(() => setShowBtn(true), 600); }
    }, 55);
    return () => clearInterval(t);
  }, [showMsg]);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const handleClose = useCallback(() => onClose?.(), [onClose]);

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="System fault recovery"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#020408',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        animation: 'kfFadeIn 0.4s ease',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(220,30,60,0.12) 0%, transparent 70%)',
        animation: 'kfBeat 1.8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Drifting particles */}
      {_p.map((p) => (
        <span key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, bottom: '-2rem',
          fontSize: `${p.sz}rem`, color: '#ff3366', opacity: p.op,
          animation: `kfFloat ${p.dur}s ${p.delay}s linear infinite`,
          pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.1em',
        }}>
          SORRY
        </span>
      ))}

      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Card */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 640, padding: '2rem',
        border: '1px solid rgba(220,30,60,0.3)',
        boxShadow: '0 0 80px rgba(220,30,60,0.15), 0 0 20px rgba(220,30,60,0.08) inset',
        background: 'rgba(10, 4, 8, 0.95)',
        transform: glitch ? `translateX(${Math.random() > 0.5 ? 3 : -3}px)` : 'none',
        transition: glitch ? 'none' : 'transform 0.1s',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginBottom: '1.5rem', paddingBottom: '1rem',
          borderBottom: '1px solid rgba(220,30,60,0.2)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3366', boxShadow: '0 0 6px #ff3366', animation: 'kfBlink 1s step-end infinite' }} />
          <span style={{ color: '#ff3366', fontSize: '0.6rem', letterSpacing: '0.4em', fontWeight: 700 }}>
            SENTINEL_OS // KERNEL_PANIC // EMOTIONAL_OVERRIDE
          </span>
        </div>

        {/* Dump lines */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {lines.map((line, i) => (
            <div key={i} style={{
              fontSize: '0.72rem', letterSpacing: '0.04em',
              color: line.includes('FAILED') || line.includes('TERMINATED') ? '#ff3366'
                   : line.includes('sorry') ? '#ffb3c6' : '#4a6080',
              animation: 'kfLine 0.2s ease forwards',
            }}>
              {line}
            </div>
          ))}
        </div>

        {/* ASCII Heart */}
        {showHeart && (
          <pre style={{
            color: '#ff3366', fontSize: '0.45rem', lineHeight: 1.1,
            textAlign: 'center', margin: '0 0 1.5rem', opacity: 0,
            animation: 'kfHeart 0.6s ease 0.1s forwards',
            textShadow: '0 0 12px rgba(255,51,102,0.6)',
            filter: glitch ? 'hue-rotate(40deg)' : 'none',
          }}>
            {_h}
          </pre>
        )}

        {/* Typed message */}
        {showMsg && (
          <div style={{
            fontSize: '1.05rem', color: '#ffb3c6',
            letterSpacing: '0.06em', marginBottom: '2rem',
            minHeight: '1.6rem', textShadow: '0 0 20px rgba(255,179,198,0.5)',
          }}>
            {typed}
            <span style={{
              display: 'inline-block', width: 9, height: 17,
              background: '#ff3366', marginLeft: 3, verticalAlign: 'middle',
              animation: 'kfBlink 0.7s step-end infinite',
            }} />
          </div>
        )}

        {/* Close button */}
        {showBtn && (
          <button
            onClick={handleClose}
            style={{
              display: 'block', width: '100%', padding: '0.75rem',
              background: 'rgba(220,30,60,0.08)', border: '1px solid rgba(220,30,60,0.4)',
              color: '#ff3366', fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem', letterSpacing: '0.3em',
              cursor: 'pointer', transition: 'all 0.2s ease',
              animation: 'kfUp 0.4s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,30,60,0.18)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(220,30,60,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(220,30,60,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            [ REBOOT SYSTEM ]
          </button>
        )}
      </div>

      <style>{`
        @keyframes kfFadeIn  { from { opacity:0 } to { opacity:1 } }
        @keyframes kfBeat    { 0%,100% { opacity:.7;transform:scale(1) } 50% { opacity:1;transform:scale(1.05) } }
        @keyframes kfFloat   { 0% { transform:translateY(0) rotate(0);opacity:0 } 10% { opacity:1 } 90% { opacity:1 } 100% { transform:translateY(-110vh) rotate(20deg);opacity:0 } }
        @keyframes kfBlink   { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes kfLine    { from { opacity:0;transform:translateX(-8px) } to { opacity:1;transform:translateX(0) } }
        @keyframes kfHeart   { from { opacity:0;transform:scale(.8) } to { opacity:1;transform:scale(1) } }
        @keyframes kfUp      { from { opacity:0;transform:translateY(10px) } to { opacity:1;transform:translateY(0) } }
      `}</style>
    </div>
  );
}
