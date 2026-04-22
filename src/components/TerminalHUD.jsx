'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useStore } from '../systems/store';
import { config } from '../portfolioConfig';
import { audio } from '../systems/audio';

export default function TerminalHUD() {
  const isOpen        = useStore((s) => s.isTerminalOpen);
  const logs          = useStore((s) => s.terminalLogs);
  const addLog        = useStore((s) => s.addTerminalLog);
  const clearLogs     = useStore((s) => s.clearTerminalLogs);
  const toggleTerminal = useStore((s) => s.toggleTerminal);

  const [input, setInput] = useState('');
  const inputRef          = useRef(null);
  const logEndRef         = useRef(null);
  const isMountedRef      = useRef(true);

  // Cleanup on unmount — also clears any pending REBOOT timer
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearTimeout(isMountedRef._rebootTimer);
    };
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Auto-scroll to bottom — BUG FIX: missing in original
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);


  const lastCommandsRef = useRef([]);

  const handleCommand = useCallback((e) => {
    // AUDIO: Tactical click on Enter
    if (e.key === 'Enter') audio.playClick();
    
    if (e.key !== 'Enter' || !input.trim()) return;

    // RATE LIMIT: Max 5 commands in 1000ms
    const now = Date.now();
    lastCommandsRef.current = lastCommandsRef.current.filter(ts => now - ts < 1000);
    if (lastCommandsRef.current.length >= 5) {
      addLog('[ERROR] RATE_LIMIT_EXCEEDED: SLOW_DOWN_OPERATOR');
      return;
    }
    lastCommandsRef.current.push(now);

    // SECURITY: 200-char buffer limit (Auditor Requirement)
    // SECURITY: Strict character filter (Alphanumeric + basic punctuation only)
    const rawInput = input.trim().slice(0, 200);
    const sanitized = rawInput.replace(/[^a-zA-Z0-9_ \-\.\/]/g, '').toUpperCase();
    
    addLog(`> ${sanitized}`);

    const { terminalCommands } = config;

    if (sanitized === 'CLEAR') {
      clearLogs();
    } else if (sanitized === 'EXIT') {
      toggleTerminal();
    } else if (sanitized === 'REBOOT') {
      addLog('REBOOT_SIGNAL_SENT...');
      isMountedRef._rebootTimer = setTimeout(() => {
        if (isMountedRef.current) window.location.reload();
      }, 1200);
    } else if (terminalCommands[sanitized]) {
      addLog(terminalCommands[sanitized]);
    } else {
      addLog(`[ERROR] UNRECOGNIZED_COMMAND: "${sanitized}" — TYPE "HELP" FOR LIST`);
    }

    setInput('');
  }, [input, addLog, clearLogs, toggleTerminal]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="SOC Terminal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 8000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 5vw, 2.5rem)',
        background: 'rgba(5, 8, 16, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        animation: 'terminalOpen 0.25s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: 900,
        height: 'clamp(400px, 70vh, 700px)',
        display: 'flex',
        flexDirection: 'column',
        background: '#080d1a',
        border: '1px solid rgba(0,243,255,0.2)',
        boxShadow: '0 0 60px rgba(0,243,255,0.08)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="scanline" style={{ '--scan-height': '700px', opacity: 0.12 }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid rgba(0,243,255,0.1)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff4444', boxShadow: '0 0 6px #ff4444' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbb00', boxShadow: '0 0 6px #ffbb00' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.3em', color: 'var(--c-cyan)', marginLeft: '0.5rem' }}>
              SENTINEL_TERMINAL // KERNEL_v2.0
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em' }}>
              TLS_1.3 ENCRYPTED
            </span>
            <button
              onClick={toggleTerminal}
              aria-label="Close terminal"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0.25rem',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ff4444'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Log stream */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
          }}
          aria-live="polite"
          aria-label="Terminal output"
        >
          {logs.map((log) => (
            <div key={log.id} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
              lineHeight: 1.5,
              color: log.text.startsWith('[ERROR]') ? 'var(--c-red)'
                   : log.text.startsWith('>')      ? 'rgba(226,245,255,0.8)'
                   : 'var(--c-cyan)',
              animation: 'logFadeIn 0.15s ease',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.2)', marginRight: '0.75rem', fontWeight: 700 }}>
                [{log.ts}]
              </span>
              {log.text}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        {/* Input row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid rgba(0,243,255,0.1)',
          background: 'rgba(0,243,255,0.03)',
          flexShrink: 0,
        }}>
          <span style={{ color: 'var(--c-cyan)', fontFamily: 'var(--font-mono)', fontSize: '1rem', userSelect: 'none' }}>›</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              // BUG FIX: Sanitize input — max 100 chars, no HTML
              const safe = e.target.value.replace(/[<>'&]/g, '').slice(0, 100);
              setInput(safe);
            }}
            onKeyDown={handleCommand}
            placeholder="TYPE COMMAND..."
            aria-label="Terminal command input"
            autoComplete="off"
            spellCheck="false"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--c-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)',
              letterSpacing: '0.1em',
              caretColor: 'var(--c-cyan)',
            }}
          />
        </div>

        {/* Footer hints */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0.4rem 1.25rem',
          borderTop: '1px solid rgba(0,243,255,0.05)',
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--c-muted)', letterSpacing: '0.15em' }}>
            ESC OR ` TO CLOSE — TYPE "HELP" FOR COMMANDS
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'rgba(0,243,255,0.2)', letterSpacing: '0.1em' }}>
            SENTINEL_v2.0
          </span>
        </div>
      </div>

      <style>{`
        @keyframes terminalOpen {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes logFadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
