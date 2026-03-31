import React, { useState, useEffect, memo } from 'react';
import { useStore } from '../systems/store';

/**
 * SystemHUD: A fixed footer bar that provides real-time "System Integrity" feedback.
 * Part of the "Top 0.01%" UI/UX package.
 */
const SystemHUD = memo(() => {
  const currentSection = useStore((s) => s.currentSection);
  const [latency, setLatency] = useState(24);
  const [stability, setStability] = useState(100);

  // Simulate slight fluctuations for "Real-time" feel
  useEffect(() => {
    const int = setInterval(() => {
      setLatency(Math.floor(Math.random() * 15) + 15);
      // Dip stability occasionally and recover immediately
      if (Math.random() > 0.95) {
        setStability(98.4);
        setTimeout(() => setStability(100), 400);
      }
    }, 3000);
    return () => clearInterval(int);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 28,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(0, 243, 255, 0.15)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      pointerEvents: 'none', // Don't block clicks to page content
    }}>
      {/* Left HUD side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="status-dot online pulse" style={{ width: 6, height: 6 }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.15em',
            color: 'var(--c-cyan)',
          }}>
            SYSTEM_INTEGRITY: {stability}%
          </span>
        </div>
        
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.1em',
          color: 'rgba(0, 243, 255, 0.4)',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}>
          LATENCY: <span style={{ color: 'var(--c-amber)' }}>{latency}MS</span>
        </span>
      </div>

      {/* Center HUD side (Current Node) */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        letterSpacing: '0.25em',
        color: 'var(--c-cyan)',
        opacity: 0.8,
      }}>
        ACTIVE_NODE: [{currentSection?.toUpperCase() || 'IDLE'}]
      </div>

      {/* Right HUD side */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.52rem',
        letterSpacing: '0.1em',
        color: 'rgba(255, 255, 255, 0.3)',
      }}>
        SENTINEL_PROTOCOL v2.0 // BY_VSR
      </div>
    </div>
  );
});

export default SystemHUD;
