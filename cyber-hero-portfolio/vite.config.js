import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── Base path for GitHub Pages deployment ──────────────
  base: '/Portfolio/',

  // ── Build optimizations ───────────────────────────────
  build: {
    // FIXED: Vite 8 dropped esbuild as default - use oxc (new default) or rolldown
    // 'oxc' is the new Vite 8 minifier - no separate install needed
    minify: true,
    sourcemap: false,
    chunkSizeWarningLimit: 2000,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@react-three')) return 'r3f-vendor';
            if (id.includes('three'))        return 'three-vendor';
            if (id.includes('react-dom'))    return 'react-dom-vendor';
            if (id.includes('react'))        return 'react-vendor';
            if (id.includes('zustand'))      return 'state-vendor';
          }
        },
      },
    },
  },

  // ── Dev server ────────────────────────────────────────
  server: {
    port: 5173,
    hmr: { overlay: false },
  },

  // ── Optimize deps ─────────────────────────────────────
  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei',
      '@react-three/postprocessing',
      'zustand',
    ],
  },
});
