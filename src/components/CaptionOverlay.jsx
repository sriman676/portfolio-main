import React, { useEffect, useState, useRef, memo } from 'react';
import { useStore } from '../systems/store';
import { config } from '../portfolioConfig';

const SCRIPTS = config.narration;
const SECTION_IDS = Object.keys(SCRIPTS);

// ── Caption Overlay ───────────────────────────────────────
// Fixed subtitle bar at bottom of screen showing current section's
// narration text. Works independently of voice narration.
const CaptionOverlay = memo(() => {
  const currentSection = useStore((s) => s.currentSection);
  const bootComplete = useStore((s) => s.bootComplete);
  const [displayText, setDisplayText] = useState('');
  const [visible, setVisible] = useState(false);
  const typeTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const prevSectionRef = useRef('');

  // Track current section via IntersectionObserver
  useEffect(() => {
    if (!bootComplete) return;

    const setSection = useStore.getState().setCurrentSection;
    const observers = [];

    // Small delay to let DOM mount
    const initTimer = setTimeout(() => {
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(`section-${id}`);
        if (!el) return;

        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setSection(id);
            }
          },
          { threshold: 0.3 }
        );
        obs.observe(el);
        observers.push(obs);
      });
    }, 500);

    return () => {
      clearTimeout(initTimer);
      observers.forEach((o) => o.disconnect());
    };
  }, [bootComplete]);

  // Typewriter effect when section changes
  useEffect(() => {
    if (!currentSection || !SCRIPTS[currentSection]) return;
    if (currentSection === prevSectionRef.current) return;
    prevSectionRef.current = currentSection;

    const fullText = SCRIPTS[currentSection];
    clearTimeout(typeTimerRef.current);
    clearTimeout(hideTimerRef.current);

    setDisplayText('');
    setVisible(true);

    let i = 0;
    const type = () => {
      if (i <= fullText.length) {
        setDisplayText(fullText.slice(0, i));
        i++;
        typeTimerRef.current = setTimeout(type, 18);
      } else {
        // Auto-hide after 8 seconds
        hideTimerRef.current = setTimeout(() => setVisible(false), 8000);
      }
    };
    typeTimerRef.current = setTimeout(type, 300);

    return () => {
      clearTimeout(typeTimerRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, [currentSection]);

  if (!bootComplete || !displayText) return null;

  return (
    <div
      className="caption-overlay no-print"
      aria-live="polite"
      aria-label="Section description"
      style={{
        position: 'fixed',
        bottom: 'clamp(1rem, 4vw, 2.5rem)',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 600,
        maxWidth: 700,
        width: 'calc(100% - 2rem)',
        padding: '0.75rem 1.25rem',
        background: 'rgba(5, 8, 16, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,243,255,0.12)',
        borderLeft: '3px solid var(--c-cyan)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          letterSpacing: '0.3em',
          color: 'var(--c-cyan)',
          flexShrink: 0,
          marginTop: '0.15rem',
        }}>
          [{currentSection.toUpperCase()}]
        </span>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.7rem, 1.5vw, 0.85rem)',
          color: 'rgba(226, 245, 255, 0.85)',
          lineHeight: 1.6,
          letterSpacing: '0.02em',
          margin: 0,
        }}>
          {displayText}
          <span className="animate-cursor" style={{
            display: 'inline-block',
            width: 6,
            height: 12,
            background: 'var(--c-cyan)',
            marginLeft: 2,
            verticalAlign: 'middle',
          }} />
        </p>
      </div>
    </div>
  );
});

export default CaptionOverlay;
