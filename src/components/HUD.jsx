import React, { useEffect, useCallback, useRef } from 'react';
import { useStore } from '../systems/store';

// ── HUD ────────────────────────────────────────────────────
// PERF: React.memo prevents re-render unless relevant state changes
const HUD = React.memo(() => {
  const threatsBlocked    = useStore((s) => s.threatsBlocked);
  const nodesSecured      = useStore((s) => s.nodesSecured);
  const activeIntrusions  = useStore((s) => s.activeIntrusions);
  const sysLogMessage     = useStore((s) => s.sysLogMessage);
  const isMuted           = useStore((s) => s.isMuted);
  const toggleMute        = useStore((s) => s.toggleMute);
  // FIXED: toggleSearch was imported but never used — removed unused subscription
  const isAlert           = activeIntrusions > 0;

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
        paddingTop: '4rem', // below NavBar
      }}
    >
      {/* ── TOP ROW ─────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Identity panel */}
        <div style={{
          background: 'rgba(5,8,16,0.7)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(0,243,255,0.12)',
          borderLeft: '4px solid var(--c-cyan)',
          padding: '0.85rem 1.1rem',
          maxWidth: 280,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div className="scanline" style={{ '--scan-height': '160px', opacity: 0.1 }} />
          <div className="cyber-label" style={{ marginBottom: '0.35rem', fontSize: '0.5rem' }}>OPERATOR_ID</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(0.75rem, 2vw, 1.05rem)',
            fontWeight: 900,
            color: 'var(--c-text)',
            letterSpacing: '0.1em',
            marginBottom: '0.2rem',
          }}>
            SRIMAN RUTVIK
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            color: 'rgba(0,243,255,0.7)',
            letterSpacing: '0.12em',
            marginBottom: '0.5rem',
          }}>
            SOC_ANALYST // CYBER_SPECIALIST
          </div>

          {/* Uptime */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="status-dot online pulse" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--c-muted)', letterSpacing: '0.1em' }}>
              IST {time} // ONLINE
            </span>
          </div>
        </div>

        {/* Right controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.5rem',
          pointerEvents: 'auto',
        }}>
          {/* Alert badge */}
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

          {/* Mute button */}
          <button
            onClick={() => {
              toggleMute();
              audio.playClick();
            }}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="tilt-on-hover"
            style={{
              background: 'rgba(5,8,16,0.7)',
              border: '1px solid rgba(0,243,255,0.12)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              color: isMuted ? 'var(--c-muted)' : 'var(--c-cyan)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.2em',
              padding: '0.4rem 0.75rem',
              cursor: 'pointer',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {isMuted ? '[ AUDIO_OFF ]' : '[ AUDIO_ON ]'}
          </button>

          {/* GENERATE_PDF_REPORT (Recruiter Priority #1) */}
          <a
            href="/resume.pdf"
            download
            onClick={() => audio.playPip(1200, 0.1)}
            onMouseEnter={() => audio.playClick()}
            style={{
              marginTop: '0.25rem',
              background: 'rgba(0,255,136,0.06)',
              border: '1px solid rgba(0,255,136,0.3)',
              color: 'var(--c-green)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.55rem',
              letterSpacing: '0.15em',
              padding: '0.5rem 0.85rem',
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '0.7rem' }}>↓</span>
            [ GENERATE_SECURITY_REPORT ]
          </a>
        </div>
      </div>

      {/* ── BOTTOM ROW ─────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        {/* Telemetry panel */}
        <div 
          role="status" 
          aria-live="polite"
          aria-label="Operator Identity Panel"
          style={{
            background: 'rgba(5,8,16,0.7)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,243,255,0.1)',
            borderTop: `2px solid ${isAlert ? 'var(--c-red)' : 'rgba(0,243,255,0.3)'}`,
            padding: '0.85rem 1.1rem',
            width: 'clamp(240px, 35vw, 380px)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-top-color 0.5s',
          }}>
          <div className="scanline" style={{ '--scan-height': '200px', opacity: 0.1 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div className="cyber-label" style={{ fontSize: '0.5rem' }}>SOC_REALTIME_TELEMETRY</div>
            <div style={{
              padding: '0.15rem 0.4rem',
              background: isAlert ? 'rgba(255,0,51,0.1)' : 'rgba(0,255,136,0.06)',
              border: `1px solid ${isAlert ? 'rgba(255,0,51,0.4)' : 'rgba(0,255,136,0.3)'}`,
              color: isAlert ? 'var(--c-red)' : 'var(--c-green)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.15em',
              transition: 'all 0.3s',
            }}>
              {isAlert ? 'INTRUSION_DETECTED' : 'SECURE'}
            </div>
          </div>

          {[
            { label: 'PACKETS_FILTERED', value: threatsBlocked.toLocaleString(), color: 'var(--c-cyan)' },
            { label: 'NODES_MAINTAINED', value: `${nodesSecured}/200`,            color: 'rgba(0,100,255,0.9)' },
          ].map((row) => (
            <div key={row.label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.4rem 0.6rem',
              background: 'rgba(255,255,255,0.03)',
              borderLeft: `2px solid ${row.color}55`,
              marginBottom: '0.35rem',
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'var(--c-muted)' }}>
                {row.label}
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.9rem',
                fontWeight: 900,
                color: row.color,
              }} aria-live="polite">
                {row.value}
              </span>
            </div>
          ))}

          {/* Log message */}
          <div style={{
            marginTop: '0.6rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            gap: '0.5rem',
            overflow: 'hidden',
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>
              [SYS]
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              color: 'rgba(0,243,255,0.6)',
              letterSpacing: '0.05em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }} aria-live="polite">
              {sysLogMessage}
            </span>
          </div>
        </div>

        {/* Corner decoration */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.45rem',
          color: 'rgba(0,243,255,0.15)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          paddingBottom: '0.5rem',
        }}>
          SENTINEL_OS v2.0
        </div>
      </div>
    </div>
  );
});

export default HUD;
