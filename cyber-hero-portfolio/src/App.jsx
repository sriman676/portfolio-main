import React, { useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { useStore } from './systems/store';
import { ErrorBoundary, SceneBoundary } from './components/ErrorBoundaries';

// ── Eager imports (needed immediately) ──────────────────
import BootSequence   from './components/BootSequence';
import NavBar         from './components/NavBar';
import HUD            from './components/HUD';
import ScrollProgress from './components/ScrollProgress';
import TerminalHUD    from './components/TerminalHUD';
import SearchOverlay  from './components/SearchOverlay';
import SystemHUD      from './components/SystemHUD';
import VoiceNarrator, { NarrationPrompt } from './components/VoiceNarrator';
import CaptionOverlay from './components/CaptionOverlay';
import PortfolioSections from './components/PortfolioSections';

// ── Lazy-loaded heavy 3D scene ──────────────────────────
const CyberScene = lazy(() => import('./3d/CyberScene'));

// ── 3D Fallback ─────────────────────────────────────────
const SceneFallback = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    background: '#050810',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '0.65rem',
    letterSpacing: '0.3em',
    color: 'rgba(0,243,255,0.4)',
    zIndex: 0,
  }}>
    LOADING_3D_CORE...
  </div>
);

// ── Main App ─────────────────────────────────────────────
export default function App() {
  const isStarted      = useStore((s) => s.isStarted);
  const bootComplete   = useStore((s) => s.bootComplete);
  const toggleTerminal = useStore((s) => s.toggleTerminal);
  const toggleSearch   = useStore((s) => s.toggleSearch);
  const isSearchOpen   = useStore((s) => s.isSearchOpen);

  const isSearchOpenRef = useRef(false);
  useEffect(() => { isSearchOpenRef.current = isSearchOpen; }, [isSearchOpen]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Don't allow hotkeys before Start
      if (!isStarted) return;
      
      if (e.key === '`' && !isSearchOpenRef.current) {
        e.preventDefault();
        toggleTerminal();
        return;
      }
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !isSearchOpenRef.current)) {
        e.preventDefault();
        toggleSearch();
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleTerminal, toggleSearch, isStarted]);

  return (
    <ErrorBoundary>

      {/* 2. Tactical Intro (If started but not booted) */}
      {isStarted && !bootComplete && <BootSequence />}

      {/* 3. Operational Dashboard (Only after full handshake) */}
      {bootComplete && (
        <>
          {/* ── 3D Background ── */}
          <SceneBoundary>
            <Suspense fallback={<SceneFallback />}>
              <CyberScene />
            </Suspense>
          </SceneBoundary>

          {/* ── Fixed UI Layer ── */}
          <ScrollProgress />
          <NavBar />
          <HUD />
          <TerminalHUD />
          <SearchOverlay />
          <VoiceNarrator />
          <SystemHUD />
          <NarrationPrompt />
          <CaptionOverlay />

          {/* ── Scrollable Content ── */}
          <main
            id="main-content"
            style={{
              position: 'relative',
              zIndex: 10,
              minHeight: '100vh',
            }}
          >
            <PortfolioSections />
          </main>
        </>
      )}
    </ErrorBoundary>
  );
}
