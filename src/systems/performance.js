import { useEffect, useRef } from 'react';
import { useStore } from './store.js';

/**
 * Singularity Performance Monitor
 * Tracks delta-times to calculate real-time FPS and dynamically adjust perfTier.
 * If average FPS drops below 45 over a 60-frame window, it triggers a 'low' tier downscale.
 */
export function usePerformanceMonitor() {
  const setPerfTier = useStore((s) => s.setPerfTier);
  const frameTimes = useRef([]);
  const lastTime = useRef(0);
  
  useEffect(() => {
    let animId;
    
    const monitor = () => {
      const now = performance.now();
      const delta = now - lastTime.current;
      lastTime.current = now;
      
      // Track last 60 frames
      frameTimes.current.push(delta);
      if (frameTimes.current.length > 60) {
        frameTimes.current.shift();
      }
      
      // Every 60 frames, evaluate performance
      if (frameTimes.current.length === 60) {
        const avgDelta = frameTimes.current.reduce((a, b) => a + b) / 60;
        const fps = 1000 / avgDelta;
        
        if (fps < 45) {
          setPerfTier('low');
        } else if (fps > 55) {
          setPerfTier('high');
        }
      }
      
      animId = requestAnimationFrame(monitor);
    };
    
    animId = requestAnimationFrame(monitor);
    return () => cancelAnimationFrame(animId);
  }, [setPerfTier]);
}
