'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const DUMP_LINES = [
  '> SENTINEL_OS v2.0 — KERNEL PANIC',
  '> PROCESS: heart.exe — STATUS: TERMINATED',
  '> CAUSE: N1H4R1K4_DETECTED_IN_MEMORY',
  '> EMOTIONAL_FIREWALL: BYPASSED',
  '> STACK_TRACE: feelings.js line 404 — love not found',
  '> ATTEMPTING_RECOVERY............FAILED',
  '> SYSTEM_MESSAGE: I\'m sorry.',
];

const SORRY_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 4,
  duration: 3 + Math.random() * 3,
  size: 0.6 + Math.random() * 0.5,
  opacity: 0.08 + Math.random() * 0.18,
}));

const ASCII_HEART = `
    ██████   ██████
  ██░░░░░░███░░░░░░██
 ██░░░░░░░░░░░░░░░░░██
 ██░░░░░░░░░░░░░░░░░██
  ██░░░░░░░░░░░░░░░██
    ███░░░░░░░░░░███
      ███░░░░░░███
        ███░░███
          █████
           ███
            █
`.trim();

export default function NiharikaEasterEgg({ onClose }) {
  const [dumpLines, setDumpLines]     = useState([]);
  const [showHeart, setShowHeart]     = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [glitch, setGlitch]           = useState(false);
  const [typedMsg, setTypedMsg]       = useState('');
  const [showBtn, setShowBtn]         = useState(false);
  const iRef = useRef(0);
  const tRef = useRef(null);

  // Typewriter for dump lines
  useEffect(() => {
    const addLine = () => {
      if (iRef.current >= DUMP_LINES.length) {
        setTimeout(() => setShowHeart(true), 300);
        setTimeout(() => setShowMessage(true), 900);
        return;
      }
      setDumpLines((p) => [...p, DUMP_LINES[iRef.current]]);
      iRef.current += 1;
      tRef.current = setTimeout(addLine, iRef.current < 3 ? 220 : 380);
    };
    tRef.current = setTimeout(addLine, 300);
    return () => clearTimeout(tRef.current);
  }, []);

  // Typewriter for the big sorry message
  const SORRY_MSG = '> I\'m sorry, Niharika. 💔';
  useEffect(() => {
    if (!showMessage) return;
    let i = 0;
    const t = setInterval(() => {
      setTypedMsg(SORRY_MSG.slice(0, ++i));
      if (i >= SORRY_MSG.length) {
        clearInterval(t);
        setTimeout(() => setShowBtn(true), 600);
      }
    }, 55);
    return () => clearInterval(t);
  }, [showMessage]);

  // Periodic glitch effect
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 120);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // ESC to close
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Easter egg — Niharika"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#020408',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        animation: 'eggFadeIn 0.4s ease',
      }}
    >
      {/* Red ambient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(220,30,60,0.12) 0%, transparent 70%)',
        animation: 'heartbeat 1.8s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Floating "sorry" particles */}
      {SORRY_PARTICLES.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-2rem',
            fontSize: `${p.size}rem`,
            color: '#ff3366',
            opacity: p.opacity,
            animation: `float ${p.duration}s ${p.delay}s linear infinite`,
            pointerEvents: 'none',
            userSelect: 'none',
            letterSpacing: '0.1em',
          }}
        >
          SORRY
        </span>
      ))}

      {/* Scanline overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
        pointerEvents: 'none',
      }} />

      {/* Main card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 640,
          padding: '2rem',
          border: '1px solid rgba(220,30,60,0.3)',
          boxShadow: '0 0 80px rgba(220,30,60,0.15), 0 0 20px rgba(220,30,60,0.08) inset',
          background: 'rgba(10, 4, 8, 0.95)',
          transform: glitch ? `translateX(${Math.random() > 0.5 ? 3 : -3}px)` : 'none',
          transition: glitch ? 'none' : 'transform 0.1s',
        }}
      >
        {/* Header bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(220,30,60,0.2)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3366', boxShadow: '0 0 6px #ff3366', animation: 'blink 1s step-end infinite' }} />
          <span style={{ color: '#ff3366', fontSize: '0.6rem', letterSpacing: '0.4em', fontWeight: 700 }}>
            SENTINEL_OS // KERNEL_PANIC // EMOTIONAL_OVERRIDE
          </span>
        </div>

        {/* Dump lines */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {dumpLines.map((line, i) => (
            <div
              key={i}
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.04em',
                color: line.includes('FAILED') || line.includes('TERMINATED') ? '#ff3366'
                     : line.includes('sorry') ? '#ffb3c6'
                     : '#4a6080',
                animation: 'lineIn 0.2s ease forwards',
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* ASCII Broken Heart */}
        {showHeart && (
          <pre style={{
            color: '#ff3366',
            fontSize: '0.45rem',
            lineHeight: 1.1,
            textAlign: 'center',
            margin: '0 0 1.5rem',
            opacity: 0,
            animation: 'heartAppear 0.6s ease 0.1s forwards',
            textShadow: '0 0 12px rgba(255,51,102,0.6)',
            filter: glitch ? 'hue-rotate(40deg)' : 'none',
          }}>
            {ASCII_HEART}
          </pre>
        )}

        {/* The big sorry message */}
        {showMessage && (
          <div style={{
            fontSize: '1.05rem',
            color: '#ffb3c6',
            letterSpacing: '0.06em',
            marginBottom: '2rem',
            minHeight: '1.6rem',
            textShadow: '0 0 20px rgba(255,179,198,0.5)',
            animation: 'none',
          }}>
            {typedMsg}
            <span style={{
              display: 'inline-block',
              width: 9,
              height: 17,
              background: '#ff3366',
              marginLeft: 3,
              verticalAlign: 'middle',
              animation: 'blink 0.7s step-end infinite',
            }} />
          </div>
        )}

        {/* Reboot button */}
        {showBtn && (
          <button
            onClick={handleClose}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem',
              background: 'rgba(220,30,60,0.08)',
              border: '1px solid rgba(220,30,60,0.4)',
              color: '#ff3366',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.3em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              animation: 'fadeInUp 0.4s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220,30,60,0.18)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(220,30,60,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(220,30,60,0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            [ REBOOT SYSTEM ]
          </button>
        )}
      </div>

      <style>{`
        @keyframes eggFadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes heartbeat {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes float {
          0%   { transform: translateY(0)   rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(20deg); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; } 50% { opacity: 0; }
        }
        @keyframes lineIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes heartAppear {
          from { opacity: 0; transform: scale(0.8); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
