import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../systems/store';
import { audio } from '../systems/audio';

// Boot sequence logic with real environment detection
const BOOT_LINES = [
  `> SENTINEL_OS v2.0 — INITIALIZING...`,
  `> KERNEL: ${navigator.userAgent.split(' ')[0]}`,
  `> HARDWARE_ACCEL: DETECTED`,
  `> ESTABLISHING_ENCRYPTED_TUNNEL...OK`,
  `> SIEM_ENGINE_v4.2_ONLINE.........OK`,
  `> MITRE_ATTACK_DATABASE_SYNC......OK`,
  `> BIOMETRICS_VERIFIED.............OK`,
  `> WELCOME, OPERATOR.`,
];

export default function BootSequence() {
  const setBootComplete = useStore((s) => s.setBootComplete);
  const [lines, setLines]       = useState([]);
  const [done, setDone]         = useState(false);
  const [fadeOut, setFadeOut]   = useState(false);
  const iRef                    = useRef(0);
  const timerRef                = useRef(null);

  useEffect(() => {
    const addLine = () => {
      if (iRef.current >= BOOT_LINES.length) {
        // All lines shown — begin fade out
        audio.playPip(880, 0.2); // Finalize beep
        setTimeout(() => setFadeOut(true), 600);
        setTimeout(() => {
          setDone(true);
          setBootComplete();
        }, 1000);
        return;
      }
      
      const nextLine = BOOT_LINES[iRef.current];
      iRef.current += 1;
      setLines((prev) => [...prev, nextLine]);
      
      // Play tactical audio pip for each line
      audio.playPip(iRef.current < 4 ? 440 : 660, 0.03);

      timerRef.current = setTimeout(addLine, iRef.current < 4 ? 120 : 350);
    };

    timerRef.current = setTimeout(addLine, 200);
    return () => clearTimeout(timerRef.current);
  }, [setBootComplete]);

  if (done) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#050810',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'JetBrains Mono, Fira Code, monospace',
        transition: 'opacity 0.35s ease',
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
      aria-live="polite"
      aria-label="System boot sequence"
    >
      <div style={{ width: '100%', maxWidth: 640, padding: '2rem' }}>
        {/* Header */}
        <div style={{
          color: '#00f3ff',
          fontSize: '0.65rem',
          letterSpacing: '0.4em',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(0,243,255,0.15)',
          paddingBottom: '1rem',
        }}>
          SENTINEL_OS // SOC_COMMAND_CENTER // v2.0
        </div>

        {/* Boot lines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {lines.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.includes('OK') ? '#00ff88'
                     : line.includes('WELCOME') ? '#00f3ff'
                     : '#4a6080',
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                animation: 'bootFadeIn 0.2s ease forwards',
              }}
            >
              {line}
              {i === lines.length - 1 && (
                <span style={{
                  display: 'inline-block',
                  width: 8,
                  height: 14,
                  background: '#00f3ff',
                  marginLeft: 4,
                  verticalAlign: 'middle',
                  animation: 'cursorBlink 0.7s step-end infinite',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{
          marginTop: '2rem',
          height: 2,
          background: 'rgba(0,243,255,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: '#00f3ff',
            width: `${(lines.length / BOOT_LINES.length) * 100}%`,
            transition: 'width 0.2s ease',
            boxShadow: '0 0 8px rgba(0,243,255,0.8)',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes bootFadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
