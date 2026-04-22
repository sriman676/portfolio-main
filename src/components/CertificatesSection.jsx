'use client';

import React, { useState } from 'react';
import { config } from '../portfolioConfig';

function useReveal(threshold = 0.1) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const CERT_COLORS = {
  Google: '#4285f4',
  IBM: '#1f70c1',
  LetsDefend: '#00f3ff',
};

function CertCard({ cert, index }) {
  const [ref, visible] = useReveal(0.1);
  const [hovered, setHovered] = useState(false);
  const color = cert.color || CERT_COLORS[cert.issuer] || '#00f3ff';

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered
          ? `rgba(5,8,16,0.9)`
          : 'rgba(5,8,16,0.6)',
        border: `1px solid ${hovered ? color : 'rgba(255,255,255,0.08)'}`,
        borderLeft: `4px solid ${color}`,
        padding: '1.25rem 1.5rem',
        cursor: 'default',
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0)'
          : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms, border-color 0.25s, background 0.25s, box-shadow 0.25s`,
        boxShadow: hovered ? `0 0 24px ${color}22, inset 0 0 10px ${color}08` : 'none',
      }}
    >
      {/* Glow accent line */}
      {hovered && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, transparent, ${color}88, transparent)`,
        }} />
      )}

      {/* Issuer badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
        marginBottom: '0.75rem',
        padding: '0.2rem 0.6rem',
        border: `1px solid ${color}44`,
        background: `${color}0a`,
      }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
          letterSpacing: '0.2em', color,
        }}>
          {cert.issuer?.toUpperCase()} // {cert.platform?.toUpperCase()}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(0.85rem, 2vw, 1rem)',
        fontWeight: 700,
        color: 'var(--c-text)',
        letterSpacing: '0.04em',
        marginBottom: '0.5rem',
        lineHeight: 1.3,
      }}>
        {cert.name}
      </div>

      {/* Status indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-green)', boxShadow: '0 0 6px var(--c-green)' }} />
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
          color: 'var(--c-green)', letterSpacing: '0.15em',
        }}>
          VERIFIED // ACTIVE
        </span>
      </div>

      {/* Verify link */}
      {cert.verifyUrl && (
        <a
          href={cert.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            color: hovered ? color : 'var(--c-muted)',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            transition: 'color 0.2s',
            borderBottom: `1px solid ${hovered ? color + '66' : 'transparent'}`,
          }}
        >
          VERIFY_CREDENTIALS ↗
        </a>
      )}

      {/* Scan line animation on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: `linear-gradient(90deg, transparent, ${color}44, transparent)`,
          animation: 'certScan 1.2s linear infinite',
          pointerEvents: 'none',
        }}>
          <style>{`
            @keyframes certScan {
              0%   { top: 0%; opacity: 0; }
              10%  { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default function CertificatesSection({ titleLabel = '// OPERATOR_CREDENTIALS' }) {
  return (
    <section id="section-certificates" style={{ scrollMarginTop: 56 }}>
      <div style={{ padding: 'var(--section-gap, 5rem) clamp(1.5rem,5vw,4rem)' }}>
        {/* Section header */}
        <div style={{ marginBottom: '3rem' }}>
          <div className="cyber-label" style={{ marginBottom: '0.75rem', color: 'var(--c-cyan)' }}>
            {titleLabel}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
            fontWeight: 900, letterSpacing: '0.15em',
            color: 'var(--c-text)', textTransform: 'uppercase',
          }}>
            CERTIFICATIONS
          </h2>
          <div style={{ width: 64, height: 2, background: 'var(--c-cyan)', marginTop: '1rem', boxShadow: '0 0 10px var(--c-cyan)' }} />
          <p style={{
            marginTop: '1rem', fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem', color: 'var(--c-muted)', letterSpacing: '0.1em',
            maxWidth: 480,
          }}>
            Industry-validated credentials from Google, IBM and LetsDefend.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {config.certifications.map((cert, i) => (
            <CertCard key={cert.name} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
