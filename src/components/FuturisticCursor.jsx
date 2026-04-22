'use client';
import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '../systems/store.js';

/**
 * FuturisticCursor: Absolution Automated Protocol v3.0
 * - Core: 3D Volumetric Glass Orb with Specular Highlight
 * - Orbitals: Counter-rotating Gyroscopic Interlock
 * - Tail: Velocity-mapped inertial stretch physics
 */
export default function FuturisticCursor() {
  const pathname = usePathname();
  const recruiterMode = useStore((s) => s.recruiterMode);
  
  const mainRef = useRef(null);
  const ring1Ref = useRef(null);
  const ring2Ref = useRef(null);
  const tailRefs = useRef([]);
  
  const mouseRef = useRef({ x: -100, y: -100 });
  const posRef = useRef({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = React.useState(false);
  const trailPositions = useRef(Array(22).fill({ x: -100, y: -100 }));
  const stateRef = useRef({ isHoveringUI: false, isHoveringSkill: false, isHovering3D: false });

  useEffect(() => {
    // Universal 'cursor: none' enforced in index.css

    // Suppression logic moved to index.css [data-mode="normal"]

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      const target = e.target;
      // UI elements → cursor shrinks
      const isUI = target.closest('.card-project') || target.closest('.mission-card') || target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('.btn-cyber') || target.closest('[role="button"]');
      // 3D canvas → cursor glows
      const is3D = target.closest('canvas') !== null;
      const isSkill = target.closest('.skill-item') || target.closest('.skill-tag');
      
      stateRef.current = { isHoveringUI: !!isUI, isHoveringSkill: !!isSkill, isHovering3D: !!is3D };
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const update = () => {
      if (document.hidden) {
        requestAnimationFrame(update);
        return;
      }
      const { isHoveringUI, isHoveringSkill, isHovering3D } = stateRef.current;
      
      // Interpolate position with high-momentum damping
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.24;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.24;

      // Calculate Kinetic Data
      const dx = mouseRef.current.x - posRef.current.x;
      const dy = mouseRef.current.y - posRef.current.y;
      const speed = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      // Update Main Body - USE translate(-50%,-50%) with NO Z offset so the dot
      // sits exactly on the actual mouse coordinate
      if (mainRef.current) {
        const isHoverBtn = isHoveringUI;
        const themeColor = isHovering3D ? '#7c3aed' : isHoverBtn ? '#f5c518' : '#00f3ff';
        const scale = isHoveringSkill ? 0.7 : isHoverBtn ? 1.4 : isHovering3D ? 1.2 : 1;

        // No Z depth — keeps the hot-spot exactly on the pointer
        mainRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%) scale(${scale})`;

        // Spinning orbital ring tinted to theme color
        const time = Date.now() * 0.001;
        if (ring1Ref.current) {
          ring1Ref.current.style.borderColor = themeColor;
          ring1Ref.current.style.transform = `rotate(${time * 120}deg)`;
          ring1Ref.current.style.opacity = isHoverBtn ? '0.6' : '0.25';
          ring1Ref.current.style.boxShadow = `0 0 8px ${themeColor}66`;
        }

        // Core dot
        const core = mainRef.current.querySelector('.cursor-core');
        if (core) {
          const dotSize = isHovering3D ? '10px' : isHoverBtn ? '6px' : '8px';
          const dotColor = isHovering3D ? '#7c3aed' : '#ffffff';
          const dotGlow = isHovering3D
            ? '0 0 12px #7c3aed, 0 0 24px #7c3aed88'
            : `0 0 8px #ffffff, 0 0 16px #00f3ff88`;
          core.style.width = dotSize;
          core.style.height = dotSize;
          core.style.background = dotColor;
          core.style.boxShadow = dotGlow;
          core.style.transform = `scale(${isClicking ? 0.6 : 1})`;
        }
      }

      // Update Physics Tail (Stretchy Capsule Logic) - Shooting Star Enchantment
      if (!recruiterMode) {
        trailPositions.current = [posRef.current, ...trailPositions.current.slice(0, 21)];
        tailRefs.current.forEach((el, i) => {
          if (el) {
            const p = trailPositions.current[i];
            const color = isHovering3D ? '#7c3aed' : isHoveringUI ? 'var(--c-gold-wayne)' : 'var(--c-cyan)';
            
            // Shooting Star Physics: velocity-mapped scaling
            const stretch = 1 + (speed * 0.035 * (1 - i/22));
            el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scaleX(${stretch}) scaleY(${1 - speed * 0.003})`;
            
            // Luminous Color Decay: White/Cyan highlight fading to ethereal blue
            if (i < 3) {
              el.style.backgroundColor = 'white';
              el.style.boxShadow = `0 0 15px white`;
            } else {
              el.style.backgroundColor = color;
              el.style.boxShadow = `0 0 ${10 - (i*0.4)}px ${color}`;
            }
            el.style.opacity = (1 - i / 22) * 0.45;
          }
        });
      } else {
        // Hide tail in professional mode to save CPU
        tailRefs.current.forEach(el => { if (el) el.style.opacity = 0; });
      }

      requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup',   onMouseUp);

    const animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup',   onMouseUp);
      cancelAnimationFrame(animId);
    };
  }, [recruiterMode]);

  // Mission Integrity: No unmount on mode switch except specific routes.
  if (pathname === '/recruiter') return null;

  return (
    <div 
      className="absolution-automated-cursor" 
      style={{ 
        pointerEvents: 'none', 
        position: 'fixed', 
        inset: 0, 
        zIndex: 9999,
      }}
    >
      {/* Shooting Star Kinetic Tail (22 segments) — no Z so tail origin = dot */}
      {[...Array(18)].map((_, i) => (
        <div
          key={i}
          ref={(el) => (tailRefs.current[i] = el)}
          style={{
            position: 'absolute',
            width: Math.max(1, 7 - i * 0.35),
            height: Math.max(1, 7 - i * 0.35),
            borderRadius: '100px', 
            willChange: 'transform',
            pointerEvents: 'none',
            filter: `blur(${i * 0.35}px)`,
            zIndex: 5,
          }}
        />
      ))}
      
      {/* Main cursor container — positioned at exact mouse coords (no Z depth) */}
      <div
        ref={mainRef}
        style={{
          position: 'absolute',
          width: 28,
          height: 28,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          willChange: 'transform',
          zIndex: 10,
        }}
      >
        {/* Thin orbital ring — cyber-cyan accent */}
        <div 
          ref={ring1Ref}
          style={{
            position: 'absolute',
            inset: 0,
            border: '1px dashed #00f3ff',
            borderRadius: '50%',
            opacity: 0.25,
            transition: 'border-color 0.2s, opacity 0.2s',
          }}
        />

        {/* White dot core */}
        <div 
          className="cursor-core"
          style={{
            width: '8px',
            height: '8px',
            background: '#ffffff',
            borderRadius: '50%',
            zIndex: 15,
            position: 'relative',
            boxShadow: '0 0 8px #ffffff, 0 0 16px #00f3ff88',
            willChange: 'transform, width, height, background, box-shadow',
            transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </div>
    </div>
  );
}
