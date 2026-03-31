import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ── Verify root element exists ────────────────────────────
const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('FATAL: #root element not found in DOM');

// ── Mount ─────────────────────────────────────────────────
// NOTE: StrictMode disabled — React 19 StrictMode double-mounts
// cause duplicate WebGL contexts with R3F v9 in development.
ReactDOM.createRoot(rootEl).render(
  <App />
);
