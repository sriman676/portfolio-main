import React, { useEffect, useRef, useCallback, useState, memo } from 'react';
import { useStore } from '../systems/store';
import { config } from '../portfolioConfig';

const SCRIPTS = config.narration;

// ── Narration Toast (Subtle UX) ──────────────────────────
// Non-blocking notification in bottom-right corner
export const NarrationPrompt = memo(() => {
  const bootComplete = useStore((s) => s.bootComplete);
  const narrationPromptShown = useStore((s) => s.narrationPromptShown);
  const setNarrationPromptShown = useStore((s) => s.setNarrationPromptShown);
  const enableNarration = useStore((s) => s.enableNarration);
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (bootComplete && !narrationPromptShown) {
      const t = setTimeout(() => setVisible(true), 1500); 
      return () => clearTimeout(t);
    }
  }, [bootComplete, narrationPromptShown]);

  const dismiss = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => {
      setVisible(false);
      setNarrationPromptShown();
    }, 400);
  }, [setNarrationPromptShown]);

  const accept = useCallback(() => {
    enableNarration();
    dismiss();
  }, [enableNarration, dismiss]);

  // Global Y/N shortcuts
  useEffect(() => {
    if (!visible || narrationPromptShown || fadeOut) return;
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'y') { e.preventDefault(); accept(); }
      if (key === 'n' || key === 'escape') { e.preventDefault(); dismiss(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, narrationPromptShown, fadeOut, accept, dismiss]);

  if (!visible || narrationPromptShown) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '1rem',
        background: 'rgba(5, 8, 16, 0.95)',
        backdropFilter: 'blur(10px)',
        borderLeft: '4px solid var(--c-cyan)',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
        opacity: fadeOut ? 0 : 1,
        transform: `translateX(${fadeOut ? '20px' : '0'})`,
        transition: 'all 0.4s cubic-bezier(0.2, 0, 0, 1)',
        width: '320px',
        maxWidth: 'calc(100vw - 4rem)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          color: 'var(--c-cyan)',
          fontWeight: 'bold',
        }}>
          🔊 VOICE_INTERFACE_DETECTED
        </span>
        <button 
          onClick={dismiss}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          ×
        </button>
      </div>

      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.8rem',
        color: 'var(--c-text)',
        margin: 0,
        lineHeight: 1.4,
        opacity: 0.8,
      }}>
        Enable the Sentinel Strategic Narration engine?
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
        <button
          onClick={accept}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid var(--c-cyan)',
            background: 'rgba(0,243,255,0.1)',
            color: 'var(--c-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          ENABLE [Y]
        </button>
        <button
          onClick={dismiss}
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'var(--c-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            cursor: 'pointer',
          }}
        >
          SKIP [N]
        </button>
      </div>
    </div>
  );
});

// ── Voice Narrator (invisible, no DOM output) ─────────────
const VoiceNarrator = memo(() => {
  const isMuted = useStore((s) => s.isMuted);
  const narrationEnabled = useStore((s) => s.narrationEnabled);
  const currentSection = useStore((s) => s.currentSection);
  const utteranceRef = useRef(null);
  const lastSection = useRef(null);
  const delayTimer = useRef(null);
  const keepAliveRef = useRef(null);

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text) => {
    if (!supported || isMuted || !narrationEnabled) return;

    window.speechSynthesis.cancel();
    clearTimeout(delayTimer.current);

    delayTimer.current = setTimeout(() => {
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 0.95; // High energy but clear
      utt.pitch = 1.1; // Youthful/Energetic Goku vibe
      utt.volume = 0.85;

      const voices = window.speechSynthesis.getVoices();
      // Google-quality voices tend to sound better for high-energy simulation
      const eliteVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.toLowerCase().includes('google') || v.name.toLowerCase().includes('natural'))
      ) || voices.find((v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('male'))
        || voices.find((v) => v.lang.startsWith('en'));
      
      if (eliteVoice) utt.voice = eliteVoice;

      utteranceRef.current = utt;
      window.speechSynthesis.speak(utt);

      // Chrome keep-alive ping
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(keepAliveRef.current);
          return;
        }
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }, 10000);
    }, 1500);
  }, [supported, isMuted, narrationEnabled]);

  // Stop speech when muted or narration disabled
  useEffect(() => {
    if ((isMuted || !narrationEnabled) && supported) {
      window.speechSynthesis.cancel();
      clearTimeout(delayTimer.current);
      clearInterval(keepAliveRef.current);
    }
  }, [isMuted, narrationEnabled, supported]);

  // Speak on section change
  useEffect(() => {
    if (!supported || !narrationEnabled) return;
    if (currentSection && SCRIPTS[currentSection] && currentSection !== lastSection.current) {
      lastSection.current = currentSection;
      speak(SCRIPTS[currentSection]);
    }
  }, [currentSection, speak, supported, narrationEnabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimeout(delayTimer.current);
      clearInterval(keepAliveRef.current);
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported]);

  return null;
});

export default VoiceNarrator;
