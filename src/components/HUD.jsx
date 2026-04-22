'use client';

import React, { useEffect } from 'react';
import { useStore } from '../systems/store';
import { audio } from '../systems/audio';
import MusicPlayer from '../systems/MusicPlayer';

// ── HUD ────────────────────────────────────────────────────
const HUD = React.memo(() => {
  // Store Subscriptions
  const threatsBlocked    = useStore((s) => s.threatsBlocked);
  const nodesSecured      = useStore((s) => s.nodesSecured);
  const activeIntrusions  = useStore((s) => s.activeIntrusions);
  const sysLogMessage     = useStore((s) => s.sysLogMessage);
  const isMuted           = useStore((s) => s.isMuted);
  const toggleMute        = useStore((s) => s.toggleMute);
  const perfTier          = useStore((s) => s.perfTier);
  const isAutoScanning    = useStore((s) => s.isAutoScanning);
  
  const isStoryMode       = useStore((s) => s.isStoryMode);
  const toggleStoryMode   = useStore((s) => s.toggleStoryMode);
  
  const isAlert = activeIntrusions > 0;

  // Live clock
  const [time, setTime] = React.useState(() =>
    new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' })
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="hud-fixed no-print"
      role="complementary"
      aria-label="System status HUD"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 400,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(0.75rem, 2vw, 2rem)',
        paddingTop: '4rem',
      }}
    >
      {/* ── TOP ROW ─────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Logo / Identity panel removed per user request */}

        {/* Right controls */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', pointerEvents: 'auto', marginLeft: 'auto' }}>
          {isAlert && (
            <div style={{
              padding: '0.3rem 0.65rem',
              background: 'rgba(255,0,51,0.12)',
              border: '1px solid rgba(255,0,51,0.5)',
              color: 'var(--c-red)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              animation: 'blink 0.7s ease-in-out infinite',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <div className="status-dot critical" />
              INTRUSION_DETECTED × {activeIntrusions}
            </div>
          )}

          <button
            onClick={() => { toggleMute(); audio.playClick && audio.playClick(); }}
            className="tilt-on-hover"
            style={{
              background: 'rgba(5,8,16,0.7)',
              border: '1px solid rgba(0,243,255,0.12)',
              backdropFilter: 'blur(12px)',
              color: isMuted ? 'var(--c-muted)' : 'var(--c-cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
            }}
          >
            {isMuted ? '[ AUDIO_OFF ]' : '[ AUDIO_ON ]'}
          </button>

          <button
            onClick={() => { toggleStoryMode(); audio.playClick && audio.playClick(); }}
            className="tilt-on-hover"
            style={{
              background: 'rgba(5,8,16,0.7)',
              border: `1px solid ${isStoryMode ? 'var(--c-violet)' : 'rgba(0,243,255,0.12)'}`,
              backdropFilter: 'blur(12px)',
              color: isStoryMode ? 'var(--c-violet)' : 'var(--c-cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
              animation: isStoryMode ? 'pulse 2s infinite' : 'none'
            }}
          >
            {isStoryMode ? '[ STORY: ON ]' : '[ STORY: OFF ]'}
          </button>

          {/* ── Ambient Music Controls ── */}
          <MusicPlayer />

          {/* Singularity Integrity Monitor */}
          <div style={{
            background: isAutoScanning ? 'rgba(255,191,0,0.08)' : 'rgba(5,8,16,0.7)',
            backdropFilter: 'blur(12px)',
            border: `1px solid ${isAutoScanning ? 'var(--c-gold-wayne)' : 'rgba(0,243,255,0.12)'}`,
            padding: '0.6rem 0.8rem',
            textAlign: 'right',
            minWidth: 160,
          }}>
            <div className="cyber-label" style={{ fontSize: '0.45rem', marginBottom: '0.35rem', color: isAutoScanning ? 'var(--c-gold-wayne)' : 'var(--c-cyan)' }}>
              {isAutoScanning ? 'HANDSHAKE_PROTOCOL: ACTIVE' : 'LOD_SIGNAL_INTEGRITY'}
            </div>
            <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'flex-end', marginBottom: '0.25rem' }}>
              {[1, 2, 3].map(i => {
                const isActive = (perfTier === 'high') || (perfTier === 'mid' && i <= 2) || (perfTier === 'low' && i === 1);
                return (
                  <div key={i} style={{
                    width: 12,
                    height: 4,
                    transition: 'background 0.3s ease',
                    background: isActive 
                      ? (isAutoScanning ? 'var(--c-gold-wayne)' : 'var(--c-cyan)')
                      : 'rgba(255,255,255,0.05)'
                  }} />
                );
              })}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--c-muted)' }}>
              SYSTEM_LATENCY: 0.12ms // {perfTier.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW ─────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: 'rgba(0,243,255,0.15)', letterSpacing: '0.3em', textTransform: 'uppercase', writingMode: 'vertical-rl', transform: 'rotate(180deg)', paddingBottom: '0.5rem' }}>
          SENTINEL_OS v2.0
        </div>

        {/* Telemetry panel removed per user request */}
      </div>
    </div>
  );
});

export default HUD;
