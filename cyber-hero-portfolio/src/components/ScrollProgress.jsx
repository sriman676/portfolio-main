import React, { useEffect, useState, useRef } from 'react';

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9998,
        background: 'rgba(0,243,255,0.08)',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${pct}%`,
          background: 'linear-gradient(90deg, #00f3ff, #7c3aed)',
          boxShadow: '0 0 8px rgba(0,243,255,0.6)',
          transition: 'width 0.1s linear',
          willChange: 'width',
        }}
      />
    </div>
  );
}
