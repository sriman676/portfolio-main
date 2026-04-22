'use client';

import React, { Suspense, useEffect } from 'react';
import loadDynamic from 'next/dynamic';
import { useStore } from '../systems/store';
import { usePerformanceMonitor } from '../systems/performance';

// Dynamically import heavy WebGL modules with SSR disabled
const CyberScene  = loadDynamic(() => import('../3d/CyberScene'),         { ssr: false });
const HUD         = loadDynamic(() => import('./HUD'),         { ssr: false });
const TerminalHUD = loadDynamic(() => import('./TerminalHUD'), { ssr: false });

// Static React components
import PortfolioSections from './PortfolioSections';
import SearchOverlay     from './SearchOverlay';
import PerformanceHUD    from './PerformanceHUD';
import StoryController   from './StoryController';
import HoloOverlay       from './HoloOverlay';

export default function ImmersiveClient({ githubRepos = [] }) {
  const bootComplete     = useStore((s) => s.bootComplete);
  const setBootComplete  = useStore((s) => s.setBootComplete);
  const isTerminalOpen   = useStore((s) => s.isTerminalOpen);
  const setRecruiterMode = useStore((s) => s.setRecruiterMode);

  // Memoize the 3D scene so it NEVER re-renders based on data changes
  const MemoizedScene = React.useMemo(() => <CyberScene />, []);
  const MemoizedHUD   = React.useMemo(() => <HUD />, []);
  const MemoizedPerf  = React.useMemo(() => <PerformanceHUD />, []);

  usePerformanceMonitor();

  useEffect(() => {
    if (!bootComplete) setBootComplete();
    setRecruiterMode(false); // Ensure immersive mode
    // Body overflow locked — panel system handles navigation
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [bootComplete, setBootComplete, setRecruiterMode]);

  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative', background: '#000' }}>
      <Suspense fallback={
        <div style={{ color: 'var(--c-cyan)', padding: 20, fontFamily: 'monospace' }}>
          INITIALIZING ORBITAL METRICS...
        </div>
      }>
        <HoloOverlay />
        {MemoizedScene}
        <PortfolioSections githubRepos={githubRepos} />
        {MemoizedHUD}
        {MemoizedPerf}
        <StoryController />
        {isTerminalOpen && <TerminalHUD />}
        <SearchOverlay />
      </Suspense>
    </main>
  );
}
