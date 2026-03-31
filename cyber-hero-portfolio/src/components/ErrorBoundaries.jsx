import React, { Component } from 'react';

// ── ErrorBoundary ─────────────────────────────────────────
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Unknown error' };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('[ErrorBoundary]', error, info);
    }
    // SECURITY: Redact internal error details in production.
    // Raw error messages can leak file paths, variable names, and stack traces.
    if (!import.meta.env.DEV) {
      this.setState({ errorMsg: 'An unexpected error occurred. Please reload.' });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            position: 'fixed',
            inset: 0,
            background: '#050810',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            fontFamily: 'JetBrains Mono, monospace',
            gap: '1.5rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#ff0033', fontSize: '0.6rem', letterSpacing: '0.4em' }}>
            SYSTEM_FAULT // CRITICAL_ERROR
          </div>
          <div style={{ color: '#e2f5ff', fontSize: '1.2rem', fontFamily: 'Orbitron, monospace', fontWeight: 900, letterSpacing: '0.1em' }}>
            SENTINEL_CORE CRASHED
          </div>
          <div style={{
            padding: '1rem 1.5rem',
            border: '1px solid rgba(255,0,51,0.3)',
            background: 'rgba(255,0,51,0.06)',
            color: '#ff0033',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
            maxWidth: 480,
            wordBreak: 'break-word',
          }}>
            {this.state.errorMsg}
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.65rem 1.5rem',
              border: '1px solid #00f3ff',
              background: 'transparent',
              color: '#00f3ff',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              cursor: 'pointer',
            }}
          >
            REBOOT_SYSTEM
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 3D-specific boundary (used just for the Canvas)
export class SceneBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#050810',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            color: '#4a6080',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.2em',
          }}>
            3D_SUBSYSTEM_OFFLINE // CONTINUING IN TEXT MODE
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
