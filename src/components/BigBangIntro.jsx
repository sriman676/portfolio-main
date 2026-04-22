'use client';

import { useEffect, useRef, useState } from 'react';

// Only show once per browser session
const SESSION_KEY = 'bbIntroSeen';

export default function BigBangIntro() {
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState('visible'); // 'visible' | 'fading' | 'done'

  useEffect(() => {
    // Skip if already seen this session
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SESSION_KEY)) {
      setPhase('done');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let raf;
    let startTime = null;
    const DURATION = 2600; // total ms before fade starts

    // ── Resize ─────────────────────────────────────────────────
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const cx = () => canvas.width / 2;
    const cy = () => canvas.height / 2;

    // ── Particle pool ──────────────────────────────────────────
    const PARTICLE_COUNT = 220;
    const COLORS = [
      '#ffffff', '#00f3ff', '#00f3ff', '#7c3aed',
      '#c4b5fd', '#38bdf8', '#ffffff', '#ffffff',
      '#ff2244', '#ffd700',
    ];

    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.4;
      const speed = 1.5 + Math.random() * 5.5;
      const size = 1 + Math.random() * 2.5;
      return {
        angle,
        speed,
        size,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0.6 + Math.random() * 0.4,   // 0-1 relative lifetime
        trail: [],
        x: 0, y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        decay: 0.012 + Math.random() * 0.01,
        alpha: 1,
      };
    });

    // ── Shockwave rings ────────────────────────────────────────
    const rings = [
      { delay: 0.18, r: 0, maxR: Math.max(window.innerWidth, window.innerHeight) * 0.8, alpha: 1, color: 'rgba(0,243,255,' },
      { delay: 0.28, r: 0, maxR: Math.max(window.innerWidth, window.innerHeight) * 0.6, alpha: 1, color: 'rgba(124,58,237,' },
    ];

    // ── Draw frame ─────────────────────────────────────────────
    const draw = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / DURATION, 1); // 0→1

      // BLACK background fade-to-void
      const bgAlpha = t < 0.15 ? 1 : Math.max(0, 1 - (t - 0.15) / 0.3);
      ctx.fillStyle = `rgba(2,3,10,${bgAlpha > 0.08 ? bgAlpha : 0.08})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const W = canvas.width, H = canvas.height;

      // ── Singularity glow (before bang, t<0.15) ──
      if (t < 0.22) {
        const pulse = 1 + Math.sin(elapsed * 0.025) * 0.3;
        const glowR = 4 * pulse;
        const grd = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), glowR * 12);
        grd.addColorStop(0, `rgba(255,255,255,${Math.min(t / 0.12, 1)})`);
        grd.addColorStop(0.4, `rgba(0,243,255,${Math.min(t / 0.18, 1) * 0.6})`);
        grd.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(cx(), cy(), glowR * 12, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(cx(), cy(), glowR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // ── Explosion particles (t > 0.12) ──
      if (t > 0.12) {
        const particleT = (t - 0.12) / 0.88; // 0→1 over rest of animation
        particles.forEach(p => {
          const age = particleT / p.life;
          if (age > 1) return;

          const dist = p.speed * particleT * Math.min(W, H) * 0.55;
          const px = cx() + Math.cos(p.angle) * dist;
          const py = cy() + Math.sin(p.angle) * dist;
          const a = Math.max(0, 1 - age * age);

          // Trail
          ctx.beginPath();
          ctx.moveTo(cx() + Math.cos(p.angle) * dist * 0.85,
                     cy() + Math.sin(p.angle) * dist * 0.85);
          ctx.lineTo(px, py);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = a * 0.5;
          ctx.lineWidth = p.size * 0.6;
          ctx.stroke();

          // Head dot
          ctx.beginPath();
          ctx.arc(px, py, p.size * (1 - age * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = a;
          ctx.fill();
          ctx.globalAlpha = 1;
        });
      }

      // ── Shockwave rings ──
      rings.forEach(ring => {
        if (t < ring.delay) return;
        const rt = (t - ring.delay) / (1 - ring.delay);
        ring.r = rt * ring.maxR;
        const ra = Math.max(0, 1 - rt * 1.4);
        ctx.beginPath();
        ctx.arc(cx(), cy(), ring.r, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color + ra + ')';
        ctx.lineWidth = 2 - rt * 1.5;
        ctx.stroke();
      });

      // ── Central flash (at bang moment t≈0.15) ──
      if (t > 0.12 && t < 0.25) {
        const flashA = Math.max(0, 1 - (t - 0.12) / 0.13);
        ctx.fillStyle = `rgba(255,255,255,${flashA * 0.9})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (t < 1) {
        raf = requestAnimationFrame(draw);
      } else {
        // Start fade-out phase
        setPhase('fading');
        sessionStorage.setItem(SESSION_KEY, '1');
      }
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // After fading transition completes, remove from DOM
  useEffect(() => {
    if (phase === 'fading') {
      const t = setTimeout(() => setPhase('done'), 800);
      return () => clearTimeout(t);
    }
  }, [phase]);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        pointerEvents: phase === 'fading' ? 'none' : 'all',
        opacity: phase === 'fading' ? 0 : 1,
        transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1)',
        background: '#02040b',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%' }}
        aria-hidden="true"
      />
      {/* OPERATOR ONLINE text */}
      <div
        style={{
          position: 'absolute',
          bottom: '12%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 'clamp(0.6rem, 1.5vw, 0.85rem)',
          letterSpacing: '0.5em',
          color: 'rgba(0,243,255,0.7)',
          textTransform: 'uppercase',
          animation: 'bbPulse 0.8s ease-in-out infinite',
          whiteSpace: 'nowrap',
        }}
      >
        ■ INITIALIZING OPERATOR SYSTEM
      </div>

      <style>{`
        @keyframes bbPulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
