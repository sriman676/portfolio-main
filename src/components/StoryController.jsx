'use client';

import React, { useEffect } from 'react';
import { useStore } from '../systems/store';

export default function StoryController() {
  const isStoryMode = useStore((s) => s.isStoryMode);
  const toggleStoryMode = useStore((s) => s.toggleStoryMode);

  useEffect(() => {
    if (!isStoryMode) return;

    let mounted = true;
    
    // The tour sequence
    const sequence = [
      { id: 'hero', wait: 8000 },
      { id: 'skills', wait: 12000 },
      { id: 'projects', wait: 15000 },
      { id: 'timeline', wait: 10000 },
      { id: 'contact', wait: 8000 }
    ];

    const runTour = async () => {
      for (const step of sequence) {
        if (!mounted) break;
        
        if (window.__navPanelBySection) {
          window.__navPanelBySection(step.id);
        }
        
        // Wait for the duration of this section
        await new Promise(r => setTimeout(r, step.wait));
      }
      
      if (mounted) {
        toggleStoryMode(); // Turn off when done
        if (window.__navPanelBySection) window.__navPanelBySection('hero');
      }
    };

    runTour();

    return () => {
      mounted = false;
    };
  }, [isStoryMode, toggleStoryMode]);

  if (!isStoryMode) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '40px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      background: 'rgba(124, 58, 237, 0.15)',
      backdropFilter: 'blur(10px)',
      border: '1px solid var(--c-violet)',
      borderRadius: '20px',
      color: 'var(--c-violet)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem',
      fontWeight: 700,
      letterSpacing: '0.15em',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
      animation: 'pulse 2s infinite'
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--c-violet)', boxShadow: '0 0 10px var(--c-violet)' }} />
      STORY_MODE_ACTIVE
      <button 
        onClick={toggleStoryMode}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--c-muted)',
          marginLeft: '10px',
          cursor: 'pointer',
          padding: '0 5px'
        }}
      >
        [X]
      </button>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 10px rgba(124, 58, 237, 0.2); }
          50% { box-shadow: 0 0 30px rgba(124, 58, 237, 0.6); }
          100% { box-shadow: 0 0 10px rgba(124, 58, 237, 0.2); }
        }
      `}</style>
    </div>
  );
}
