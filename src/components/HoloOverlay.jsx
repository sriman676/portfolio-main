'use client';
import React, { useEffect, useRef, memo, useState, useCallback } from 'react';
import { useStore } from '../systems/store';
import QuantumMatrixFace from './QuantumMatrixFace';

// ═══════════════════════════════════════════════════════════
// 3D WARP STARFIELD (Canvas-based)
// ═══════════════════════════════════════════════════════════
const StarField3D = memo(() => {
  const canvasRef = useRef(null);
  const scrollVelocity = useStore((s) => s.scrollVelocity);
  const isSingularity = useStore((s) => s.isSingularity);
  
  const starsRef = useRef([]);
  const requestRef = useRef();
  
  const initStars = (width, height) => {
    return Array.from({ length: 450 }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      pz: 0,
      color: ['#ffffff', '#00f3ff', '#ff0033', '#ffd700'][Math.floor(Math.random() * 4)],
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      starsRef.current = initStars(canvas.width, canvas.height);
    };
    
    resize();
    window.addEventListener('resize', resize);
    
    const draw = () => {
      ctx.fillStyle = isSingularity ? 'rgba(0, 0, 0, 0.2)' : 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      
      // Calculate speed based on scrolling
      const baseSpeed = isSingularity ? 15 : 1.5;
      const speed = baseSpeed + Math.abs(scrollVelocity) * 0.8;
      
      starsRef.current.forEach((s) => {
        s.pz = s.z;
        s.z -= speed;
        
        if (s.z <= 1) {
          s.z = canvas.width;
          s.pz = s.z;
        }
        
        const x = (s.x / s.z) * cx + cx;
        const y = (s.y / s.z) * cy + cy;
        
        const px = (s.x / s.pz) * cx + cx;
        const py = (s.y / s.pz) * cy + cy;
        
        if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) return;
        
        // Motion Blur line
        ctx.beginPath();
        ctx.lineWidth = Math.min(2, 2 * (1 - s.z / canvas.width));
        ctx.strokeStyle = isSingularity ? (Math.random() > 0.5 ? '#00f3ff' : '#ff00ff') : s.color;
        ctx.moveTo(x, y);
        ctx.lineTo(px, py);
        ctx.stroke();
      });
      
      requestRef.current = requestAnimationFrame(draw);
    };
    
    draw();
    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [scrollVelocity, isSingularity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
});
StarField3D.displayName = 'StarField3D';

// ═══════════════════════════════════════════════════════════
// SINGULARITY OVERLAY (Glitch + Data Streams)
// ═══════════════════════════════════════════════════════════
const SingularityEffects = memo(() => {
  const isSingularity = useStore((s) => s.isSingularity);
  const resetSingularity = useStore((s) => s.resetSingularity);
  
  if (!isSingularity) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'black', color: '#00f3ff',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      overflow: 'hidden',
    }}>
      {/* 3D Chat Interface rendering the Cyber Matrix Face */}
      <QuantumMatrixFace onClose={resetSingularity} />
      
      {/* Floating data streams background */}
      <div className="data-streams" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: -1 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="stream" style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: -100,
            width: 1,
            height: 100,
            background: 'linear-gradient(to bottom, transparent, #00f3ff)',
            animation: `streamDown ${2 + Math.random() * 4}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes streamDown { to { transform: translateY(110vh); } }
      `}</style>
    </div>
  );
});
SingularityEffects.displayName = 'SingularityEffects';

export default function HoloOverlay() {
  const recruiterMode = useStore((s) => s.recruiterMode);
  if (recruiterMode) return null;

  return (
    <>
      <StarField3D />
      <SingularityEffects />
      
      {/* Keep scanlines for that CRT feel */}
      <div className="scanline" style={{ zIndex: 5, opacity: 0.15, pointerEvents: 'none' }} />
    </>
  );
}
