'use client';

import React, { useEffect, useState } from 'react';

export default function ImmersiveLoading() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#050810',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#00f3ff',
      fontFamily: 'var(--font-mono, "Courier New", monospace)',
      overflow: 'hidden'
    }}>
      {/* Background Grid pulse */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 243, 255, 0.05) 0%, transparent 70%)',
        opacity: 0.5,
        pointerEvents: 'none'
      }} />

      {/* Rotating Hex Frame */}
      <div className="spin-slow" style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        border: '1px solid rgba(0, 243, 255, 0.2)',
        borderRadius: '2px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '2rem',
        boxShadow: '0 0 30px rgba(0, 243, 255, 0.1)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          border: '2px solid #ff0033',
          opacity: 0.8,
          animation: 'pulse 2s infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '4px',
          height: '4px',
          background: '#00f3ff',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '0 0 10px #00f3ff'
        }} />
      </div>

      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <div style={{ 
          fontSize: '0.65rem', 
          letterSpacing: '0.4em', 
          marginBottom: '0.5rem', 
          opacity: 0.7,
          textTransform: 'uppercase'
        }}>
          Inlet_Authorization_Required
        </div>
        
        <div style={{ 
          fontSize: '1.2rem', 
          fontWeight: 900, 
          letterSpacing: '0.2em', 
          marginBottom: '1.5rem',
          textShadow: '0 0 15px rgba(0, 243, 255, 0.5)'
        }}>
          SYNCHRONIZING_ARSENAL{dots}
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.4rem',
          fontSize: '0.55rem', 
          fontFamily: 'var(--font-mono)', 
          color: 'rgba(0, 243, 255, 0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          <div>[ OK ] INITIALIZING_QUANTUM_CORE...</div>
          <div>[ OK ] HARDENING_WEBGL_PIPELINE...</div>
          <div style={{ color: '#ffb300' }}>[ .. ] FETCHING_GITHUB_MANIFEST...</div>
          <div style={{ opacity: 0.2 }}>[ -- ] STABILIZING_TACTICAL_HUD...</div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(0.9); opacity: 0.4; }
        }
        .spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
