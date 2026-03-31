import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { useStore } from '../systems/store';

const NAV_LINKS = [
  { id: 'hero',     label: 'HOME' },
  { id: 'about',    label: 'ABOUT' },
  { id: 'skills',   label: 'SKILLS' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'certs',    label: 'CERTS' },
  { id: 'timeline', label: 'TIMELINE' },
  { id: 'contact',  label: 'CONTACT' },
];

const scrollTo = (id) => {
  document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' });
};

export default function NavBar() {
  const toggleSearch = useStore((s) => s.toggleSearch);
  const toggleTerminal = useStore((s) => s.toggleTerminal);
  const [active, setActive]     = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tickingRef = useRef(false);

  // Track scroll for background + active section
  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
          const el = document.getElementById(`section-${NAV_LINKS[i].id}`);
          if (el) {
            const top = el.getBoundingClientRect().top;
            if (top < window.innerHeight * 0.5) {
              setActive(NAV_LINKS[i].id);
              break;
            }
          }
        }
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && menuOpen) setMenuOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [menuOpen]);

  const handleNavClick = useCallback((id) => {
    scrollTo(id);
    setMenuOpen(false);
  }, []);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(1rem, 4vw, 3rem)',
          height: 56,
          background: scrolled ? 'rgba(5, 8, 16, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,243,255,0.08)' : 'none',
          transition: 'background 0.3s ease, border-color 0.3s ease',
          pointerEvents: 'auto',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => handleNavClick('hero')}
          aria-label="Go to top"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Orbitron, monospace',
            fontSize: '0.7rem',
            fontWeight: 900,
            letterSpacing: '0.3em',
            color: '#00f3ff',
            textTransform: 'uppercase',
            padding: 0,
          }}
        >
          VSR<span style={{ color: 'rgba(0,243,255,0.4)' }}>://SOC</span>
        </button>

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
          {NAV_LINKS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              aria-current={active === id ? 'page' : undefined}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                color: active === id ? '#00f3ff' : 'rgba(226,245,255,0.4)',
                textTransform: 'uppercase',
                padding: '0.4rem 0.6rem',
                borderBottom: active === id ? '1px solid #00f3ff' : '1px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => { if (active !== id) e.currentTarget.style.color = '#e2f5ff'; }}
              onMouseLeave={(e) => { if (active !== id) e.currentTarget.style.color = 'rgba(226,245,255,0.4)'; }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={toggleSearch}
            aria-label="Open search (Ctrl+K)"
            className="nav-action-btn"
            style={{
              background: 'rgba(0,243,255,0.06)',
              border: '1px solid rgba(0,243,255,0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              color: 'rgba(0,243,255,0.6)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            <span>⌕</span>
            <span className="hide-mobile">CTRL+K</span>
          </button>

          <button
            onClick={toggleTerminal}
            aria-label="Open terminal (backtick)"
            className="nav-action-btn"
            style={{
              background: 'rgba(0,243,255,0.06)',
              border: '1px solid rgba(0,243,255,0.15)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.35rem 0.65rem',
              color: 'rgba(0,243,255,0.6)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.1em',
              transition: 'color 0.2s, border-color 0.2s',
            }}
          >
            <span style={{ fontFamily: 'monospace' }}>&gt;_</span>
            <span className="hide-mobile">TERMINAL</span>
          </button>

          {/* Mobile hamburger */}
          <button
            className="hide-desktop hamburger-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'none',
              border: '1px solid rgba(0,243,255,0.15)',
              cursor: 'pointer',
              padding: '0.35rem 0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
            }}
          >
            <span style={{
              display: 'block', width: 16, height: 2, background: '#00f3ff',
              transition: 'transform 0.25s, opacity 0.25s',
              transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
            }} />
            <span style={{
              display: 'block', width: 16, height: 2, background: '#00f3ff',
              transition: 'opacity 0.25s',
              opacity: menuOpen ? 0 : 1,
            }} />
            <span style={{
              display: 'block', width: 16, height: 2, background: '#00f3ff',
              transition: 'transform 0.25s, opacity 0.25s',
              transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="hide-desktop animate-drawer"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 499,
            background: 'rgba(5,8,16,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            paddingTop: 72,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setMenuOpen(false); }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            padding: '1rem 2rem',
          }}>
            {NAV_LINKS.map(({ id, label }, i) => (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
                className="animate-menu-item"
                style={{
                  background: active === id ? 'rgba(0,243,255,0.06)' : 'none',
                  border: 'none',
                  borderLeft: active === id ? '3px solid #00f3ff' : '3px solid transparent',
                  cursor: 'pointer',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  color: active === id ? '#00f3ff' : 'rgba(226,245,255,0.5)',
                  textTransform: 'uppercase',
                  padding: '1rem 1.25rem',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <span style={{ color: 'rgba(0,243,255,0.3)', marginRight: '0.75rem', fontSize: '0.6rem' }}>
                  0{i + 1}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
