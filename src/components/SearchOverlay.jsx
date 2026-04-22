'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useStore } from '../systems/store';
import { config } from '../portfolioConfig';
import { audio } from '../systems/audio';
import KernelFault from './KernelFault';

// Runtime-decoded key — not a readable string in source
const _xk = () => atob('bmloYXJpa2E=');

// ── Build searchable index from config ────────────────────
const buildIndex = () => {
  const idx = [];

  config.skills.forEach((s) =>
    idx.push({ type: 'SKILL', label: s.name, sub: s.category.toUpperCase(), meta: `Level ${s.level}%` })
  );
  config.projects.forEach((p) =>
    idx.push({ type: 'PROJECT', label: p.title.replace(/_/g,' '), sub: p.subtitle, meta: p.status, url: p.github })
  );
  config.certifications.forEach((c) =>
    idx.push({ type: 'CERT', label: c.name, sub: c.issuer, meta: c.platform, url: c.verifyUrl })
  );
  config.timeline.forEach((t) =>
    idx.push({ type: 'TIMELINE', label: t.role, sub: t.org, meta: t.year })
  );
  idx.push({ type: 'CONTACT', label: 'GitHub',   sub: config.githubUsername,      url: config.github });
  idx.push({ type: 'CONTACT', label: 'LinkedIn', sub: 'Sriman Rutvik',             url: config.linkedin });

  return idx;
};

const INDEX = buildIndex();

const TYPE_COLOR = {
  SKILL:    '#00f3ff',
  PROJECT:  '#00ff88',
  CERT:     '#f59e0b',
  TIMELINE: '#7c3aed',
  CONTACT:  '#ff0033',
};

// ── Fuzzy match ────────────────────────────────────────────
const fuzzyMatch = (str, query) => {
  if (!query) return true;
  const s = str.toLowerCase();
  const q = query.toLowerCase();
  let si = 0;
  for (let qi = 0; qi < q.length; qi++) {
    while (si < s.length && s[si] !== q[qi]) si++;
    if (si >= s.length) return false;
    si++;
  }
  return true;
};

// ── SearchOverlay ──────────────────────────────────────────
export default function SearchOverlay() {
  const isSearchOpen  = useStore((s) => s.isSearchOpen);
  const searchQuery   = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const closeSearch   = useStore((s) => s.closeSearch);

  const [results, setResults]   = useState([]);
  const [cursor, setCursor]     = useState(0);
  const [mounted, setMounted]   = useState(false);
  const [showEgg, setShowEgg]   = useState(false);
  const inputRef                = useRef(null);
  const listRef                 = useRef(null);

  // Global search shortcut (CMD+K, CTRL+K or /)
  useEffect(() => {
    const handleGlobalKey = (e) => {
      // Ignore if user is already typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (((e.metaKey || e.ctrlKey) && e.key === 'k') || e.key === '/') {
        e.preventDefault();
        useStore.getState().toggleSearch();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Open/close animation
  useEffect(() => {
    if (isSearchOpen) {
      requestAnimationFrame(() => {
        setMounted(true);
        setCursor(0);
      });
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      const t = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(t);
    }
  }, [isSearchOpen]);

  // Hidden system recovery check
  useEffect(() => {
    if (searchQuery.trim().toLowerCase() === _xk()) {
      audio.playWarp?.(0.5);
      setTimeout(() => {
        setShowEgg(true);
        closeSearch();
      }, 300);
    }
  }, [searchQuery, closeSearch]);

  // Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      requestAnimationFrame(() => {
        setResults([]);
        setCursor(0);
      });
      return;
    }
    const q = searchQuery.trim();
    const r = INDEX.filter(
      (item) => fuzzyMatch(item.label, q) || fuzzyMatch(item.sub || '', q)
    ).slice(0, 12);
    setResults(r);
    setCursor(0);
  }, [searchQuery]);

  // Keyboard navigation & Command Palette logic
  const handleKeyDown = useCallback((e) => {
    
    if (e.key === 'Enter') {
      const q = searchQuery.trim().toUpperCase();
      
      // COMMAND PALETTE ACTIONS (FAANG Utility)
      if (q === 'RESUME' || q === 'CV' || q === 'REPORT') {
        audio.playPip(1200, 0.1);
        window.open('/resume.pdf', '_blank');
        closeSearch();
        return;
      }
      if (q === 'LINKEDIN') {
        window.open(config.linkedin, '_blank');
        closeSearch();
        return;
      }
      if (q === 'GITHUB') {
        window.open(config.github, '_blank');
        closeSearch();
        return;
      }
      if (q === 'TERMINAL' || q === 'CMD') {
        useStore.getState().toggleTerminal();
        closeSearch();
        return;
      }
      if (q === 'SINGULARITY' || q === '1') {
        audio.playWarp(1.5);
        useStore.getState().enterSingularity();
        closeSearch();
        return;
      }
      if (q === _xk().toUpperCase()) {
        closeSearch();
        setShowEgg(true);
        return;
      }

      if (results[cursor]?.url) {
        audio.playClick();
        window.open(results[cursor].url, '_blank', 'noopener,noreferrer');
        closeSearch();
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      audio.playClick();
      setCursor((c) => Math.min(c + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      audio.playClick();
      setCursor((c) => Math.max(c - 1, 0));
    }
  }, [results, cursor, closeSearch, searchQuery]);

  // Scroll cursor into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[cursor];
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  if (showEgg) return <KernelFault onClose={() => setShowEgg(false)} />;
  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global search"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: 'clamp(60px, 15vh, 140px)',
        background: 'rgba(5, 8, 16, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        opacity: isSearchOpen ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 640,
          margin: '0 1rem',
          background: '#0a0f1e',
          border: '1px solid rgba(0,243,255,0.2)',
          boxShadow: '0 0 60px rgba(0,243,255,0.1)',
          transform: isSearchOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-16px)',
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Input row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid rgba(0,243,255,0.1)',
        }}>
          <span style={{ color: 'rgba(0,243,255,0.5)', fontFamily: 'monospace', fontSize: '1rem' }}>⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              // SECURITY: cap input length to prevent runaway fuzzy-match CPU usage
              const sanitized = e.target.value.slice(0, 120);
              setSearchQuery(sanitized);
            }}
            onKeyDown={handleKeyDown}
            placeholder="SEARCH SKILLS, PROJECTS, CERTS..."
            aria-label="Search portfolio"
            autoComplete="off"
            spellCheck="false"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e2f5ff',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
            }}
          />
          <kbd style={{
            padding: '0.2rem 0.5rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 4,
            color: '#4a6080',
            fontFamily: 'monospace',
            fontSize: '0.65rem',
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          role="listbox"
          aria-label="Search results"
          style={{
            maxHeight: 360,
            overflowY: 'auto',
            padding: results.length ? '0.5rem' : '0',
          }}
        >
          {results.length === 0 && searchQuery.trim() && (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#4a6080',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
            }}>
              NO_RESULTS_FOUND — TRY ANOTHER QUERY
            </div>
          )}
          {results.length === 0 && !searchQuery.trim() && (
            <div style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['SOC', 'Python', 'Wireshark', 'Projects', 'Certs', 'Contact'].map((hint) => (
                <button
                  key={hint}
                  onClick={() => setSearchQuery(hint)}
                  style={{
                    padding: '0.3rem 0.75rem',
                    background: 'rgba(0,243,255,0.06)',
                    border: '1px solid rgba(0,243,255,0.15)',
                    color: '#00f3ff',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >
                  {hint}
                </button>
              ))}
            </div>
          )}
          {results.map((item, i) => (
            <div
              key={i}
              role="option"
              aria-selected={i === cursor}
              tabIndex={-1}
              onClick={() => item.url && window.open(item.url, '_blank', 'noopener,noreferrer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.75rem',
                borderLeft: `3px solid ${TYPE_COLOR[item.type]}`,
                marginBottom: '0.25rem',
                background: i === cursor ? 'rgba(0,243,255,0.06)' : 'transparent',
                cursor: item.url ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}
              onMouseEnter={() => setCursor(i)}
            >
              <span style={{
                minWidth: 64,
                fontSize: '0.55rem',
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.15em',
                color: TYPE_COLOR[item.type],
                fontWeight: 700,
              }}>
                {item.type}
              </span>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{
                  color: '#e2f5ff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.label}
                </div>
                {item.sub && (
                  <div style={{
                    color: '#4a6080',
                    fontSize: '0.65rem',
                    fontFamily: 'JetBrains Mono, monospace',
                    letterSpacing: '0.05em',
                  }}>
                    {item.sub}
                  </div>
                )}
              </div>
              {item.meta && (
                <span style={{
                  color: '#4a6080',
                  fontSize: '0.6rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.1em',
                  flexShrink: 0,
                }}>
                  {item.meta}
                </span>
              )}
              {item.url && (
                <span style={{ color: '#4a6080', fontSize: '0.7rem' }}>↗</span>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.6rem 1.25rem',
          borderTop: '1px solid rgba(0,243,255,0.08)',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
        }}>
          {[['↑↓', 'NAVIGATE'], ['↵', 'OPEN'], ['ESC', 'CLOSE']].map(([key, label]) => (
            <div key={key} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <kbd style={{
                padding: '0.15rem 0.4rem',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                color: '#4a6080',
                fontFamily: 'monospace',
                fontSize: '0.6rem',
              }}>{key}</kbd>
              <span style={{ color: '#4a6080', fontSize: '0.55rem', letterSpacing: '0.1em' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
