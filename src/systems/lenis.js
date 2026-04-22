import Lenis from 'lenis';

let lenisInstance = null;

/**
 * Initialize the Sovereign Scroll Protocol.
 */
export const initLenis = () => {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
  });

  const raf = (time) => {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  return lenisInstance;
};

/**
 * Get the current Lenis instance imperatively.
 */
export const getLenis = () => {
  if (!lenisInstance) return initLenis();
  return lenisInstance;
};
