'use client';
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import RecruiterView from '../../components/RecruiterView';

export default function RecruiterPage() {
  const [paperMode, setPaperMode] = useState(false);

  useEffect(() => {
    if (paperMode) {
      document.body.classList.add('paper-mode');
    } else {
      document.body.classList.remove('paper-mode');
    }
  }, [paperMode]);

  return (
    <main style={{ background: 'var(--c-void)', minHeight: '100vh', transition: 'background 0.3s' }}>

      {/* Minimal sticky top bar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.65rem 2rem',
        background: 'var(--nav-bg, rgba(5,8,16,0.92))',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--c-border)',
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/immersive" style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
            letterSpacing: '0.2em',
          }}>
            ← IMMERSIVE VIEW
          </Link>
          <button onClick={() => setPaperMode(!paperMode)} style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
            color: 'var(--c-cyan)', background: 'transparent',
            border: 'none', cursor: 'none',
            letterSpacing: '0.2em', textTransform: 'uppercase'
          }}>
            {paperMode ? 'DARK MODE ☾' : 'PAPER MODE ☀'}
          </button>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
          color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em',
        }}>
          RECRUITER VIEW
        </span>
      </nav>

      {/* The clean recruiter content */}
      <RecruiterView />
    </main>
  );
}
