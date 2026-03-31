import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { config } from '../portfolioConfig';
import { useStore } from '../systems/store';

// ── Scroll reveal hook ─────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Animated counter ──────────────────────────────────────
const Counter = memo(({ target, suffix = '', duration = 1800 }) => {
  const [val, setVal] = useState(0);
  const [ref, visible] = useReveal(0.5);
  const started = useRef(false);
  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
});

// ── Cipher decode text ────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
const CipherText = memo(({ text, delay = 0 }) => {
  const [display, setDisplay] = useState(() =>
    text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  );
  const [ref, visible] = useReveal(0.3);
  const done = useRef(false);

  useEffect(() => {
    if (!visible || done.current) return;
    done.current = true;
    let mounted = true; 
    let intervalId;
    let step = 0;
    const total = text.length * 3;
    const timer = setTimeout(() => {
      if (!mounted) return;
      intervalId = setInterval(() => {
        if (!mounted) { clearInterval(intervalId); return; }
        step++;
        setDisplay(
          text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (step > i * 3) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('')
        );
        if (step >= total) clearInterval(intervalId);
      }, 40);
    }, delay);
    return () => { mounted = false; clearTimeout(timer); clearInterval(intervalId); };
  }, [visible, text, delay]);

  return <span ref={ref}>{display}</span>;
});

// ── Section wrapper ────────────────────────────────────────
function Section({ id, children, style = {} }) {
  const [ref, visible] = useReveal(0.08);
  return (
    <section
      id={`section-${id}`}
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''}`}
      style={{ scrollMarginTop: 56, ...style }}
    >
      {children}
    </section>
  );
}

// ── Section title ─────────────────────────────────────────
function SectionTitle({ label, title, accent }) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <div className="cyber-label" style={{ marginBottom: '0.75rem', color: accent || 'var(--c-cyan)' }}>
        {label}
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
        fontWeight: 900,
        letterSpacing: '0.15em',
        color: 'var(--c-text)',
        textTransform: 'uppercase',
      }}>
        {title}
      </h2>
      <div style={{ width: 64, height: 2, background: accent || 'var(--c-cyan)', marginTop: '1rem', boxShadow: `0 0 10px ${accent || 'var(--c-cyan)'}` }} />
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────
const HeroSection = memo(() => {
  const toggleTerminal = useStore((s) => s.toggleTerminal);
  const scrollToProjects = () =>
    document.getElementById('section-projects')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="section-hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(1.5rem, 5vw, 4rem)',
        paddingBottom: 'clamp(3rem, 8vw, 7rem)',
        scrollMarginTop: 56,
      }}
    >
      <div style={{
        background: 'rgba(5,8,16,0.55)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,243,255,0.12)',
        borderLeft: '6px solid var(--c-cyan)',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        maxWidth: 680,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="scanline" style={{ '--scan-height': '300px' }} />

        {/* Available badge */}
        {config.availableForWork && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '0.3rem 0.75rem',
            border: '1px solid rgba(0,255,136,0.3)',
            background: 'rgba(0,255,136,0.06)',
          }}>
            <div className="status-dot online pulse" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--c-green)' }}>
              AVAILABLE_FOR_OPPORTUNITIES
            </span>
          </div>
        )}

        <div className="cyber-label" style={{ marginBottom: '1rem' }}>
          NODE_OVERVIEW: [VODDIRAJU_SRIMAN_RUTVIK]
        </div>

        <h1 className="hero-glow-me" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
          fontWeight: 900,
          letterSpacing: '0.12em',
          lineHeight: 1.05,
          marginBottom: '1.25rem',
          color: 'var(--c-text)',
        }}>
          <CipherText text="SRIMAN" delay={200} />
          <br />
          <span style={{ color: 'var(--c-z-gold)', display: 'block' }}>
            <CipherText text="RUTVIK" delay={400} />
          </span>
        </h1>

        {/* Power Level Indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '2rem',
          padding: '0.3rem 0.75rem',
          border: '1px solid var(--c-z-gold)',
          background: 'rgba(255, 215, 0, 0.08)',
          boxShadow: 'var(--glow-hero)',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', fontWeight: 900, color: 'var(--c-z-gold)', letterSpacing: '0.1em' }}>
            POWER_LEVEL: OVER 9000
          </span>
        </div>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.65rem, 1.5vw, 0.85rem)',
          color: 'var(--c-muted)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
          lineHeight: 1.6,
        }}>
          SOC Analyst // Cybersecurity Analyst
        </p>

        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(0.6rem, 1.2vw, 0.75rem)',
          color: 'rgba(0,243,255,0.7)',
          letterSpacing: '0.12em',
          marginBottom: '2.5rem',
        }}>
          {config.tagline}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-cyber" onClick={scrollToProjects}>
            VIEW_PROJECTS
          </button>
          <a
            href={config.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            DOWNLOAD_CV
          </a>
          <button className="btn-ghost" onClick={toggleTerminal}>
            OPEN_TERMINAL
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        right: '3rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        opacity: 0.4,
        animation: 'bounce 2s ease-in-out infinite',
      }}>
        <div className="cyber-label" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }}>SCROLL</div>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--c-cyan), transparent)' }} />
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
});

// ── ABOUT ─────────────────────────────────────────────────
const AboutSection = memo(() => {
  const [ref, visible] = useReveal(0.15);
  return (
    <Section id="about">
      <div className="section-wrapper" style={{ padding: 'var(--section-gap) clamp(1.5rem,5vw,4rem)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <SectionTitle label="// MISSION_PROFILE" title="ABOUT THE OPERATOR" />
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--c-text)', marginBottom: '1.5rem', fontWeight: 500 }}>
              Security Analyst in training at <span style={{ color: 'var(--c-cyan)' }}>SRM University AP</span>. 
              Focused on operational network resilience, SIEM log triage, and incident response automation. 
              Committed to proactive defense and threat mitigation.
            </p>
            <p style={{ color: 'var(--c-muted)', lineHeight: 1.8, fontSize: '0.9rem' }}>
              I bridge the gap between academic theory and operational reality, building tools that automate the tedious and 
              surface the critical. My mission is to ensure that every network node remains uncompromised and every threat is 
              neutralized before it moves lateral.
            </p>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {['SOC', 'SIEM', 'Threat Detection', 'Python', 'Wireshark', 'MITRE ATT&CK'].map((tag) => (
                <span key={tag} style={{
                  padding: '0.3rem 0.75rem',
                  border: '1px solid rgba(0,243,255,0.2)',
                  background: 'rgba(0,243,255,0.05)',
                  color: 'var(--c-cyan)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div ref={ref} className={`stagger-children reveal ${visible ? 'visible' : ''}`} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem',
          }}>
            {[
              { label: 'THREATS_BLOCKED', value: 4021, suffix: '+', color: 'var(--c-cyan)' },
              { label: 'NODES_SECURED',   value: 153,  suffix: '',  color: 'var(--c-green)' },
              { label: 'UPTIME_%',        value: 99,   suffix: '.9%', color: 'var(--c-amber)' },
              { label: 'CERTS_EARNED',    value: 5,    suffix: '',  color: 'var(--c-violet)' },
            ].map((stat) => (
              <div key={stat.label} className="bracket" style={{
                padding: '1.5rem',
                background: 'var(--c-panel)',
                border: '1px solid var(--c-border)',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: stat.color,
                  marginBottom: '0.5rem',
                }}>
                  <Counter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="cyber-label" style={{ color: 'var(--c-muted)', fontSize: '0.55rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
});

// ── SKILLS (Unified: Radar + Terminal Scan + Arsenal Cards) ──
const CAT_COLOR = {
  defense:   'var(--c-cyan)',
  offense:   'var(--c-red)',
  forensics: 'var(--c-amber)',
  recon:     'var(--c-green)',
  dev:       'var(--c-violet)',
};
const CAT_HEX = {
  defense:   '#00f3ff',
  offense:   '#ff0033',
  forensics: '#f59e0b',
  recon:     '#00ff88',
  dev:       '#7c3aed',
};
const CATEGORIES = ['defense', 'offense', 'forensics', 'recon', 'dev'];
const CAT_LABELS = { defense: 'DEFENSE', offense: 'OFFENSE', forensics: 'FORENSICS', reconnaissance: 'RECON', dev: 'DEV' };

// Compute average level per category
function getCategoryAverages() {
  const map = {};
  CATEGORIES.forEach((cat) => {
    const skills = config.skills.filter((s) => s.category === cat);
    map[cat] = skills.length ? skills.reduce((sum, s) => sum + s.level, 0) / skills.length : 0;
  });
  return map;
}

// ── SVG Radar Chart ───────────────────────────────────────
const RadarChart = memo(({ animate }) => {
  const avgs = getCategoryAverages();
  const cx = 140, cy = 140, R = 110;
  const n = CATEGORIES.length;

  // Compute polygon points for a given scale (0-1)
  const getPoints = (scale) =>
    CATEGORIES.map((_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      return `${cx + R * scale * Math.cos(angle)},${cy + R * scale * Math.sin(angle)}`;
    }).join(' ');

  // Data polygon
  const dataPoints = CATEGORIES.map((cat, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = avgs[cat] / 100;
    return `${cx + R * val * Math.cos(angle)},${cy + R * val * Math.sin(angle)}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 280 280" style={{ width: '100%', maxWidth: 300, margin: '0 auto', display: 'block' }}>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={getPoints(scale)}
          fill="none"
          stroke="rgba(0,243,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* Axis lines */}
      {CATEGORIES.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={cx + R * Math.cos(angle)}
            y2={cy + R * Math.sin(angle)}
            stroke="rgba(0,243,255,0.06)"
            strokeWidth="1"
          />
        );
      })}
      {/* Data fill */}
      <polygon
        points={dataPoints}
        fill="rgba(0,243,255,0.08)"
        stroke="#00f3ff"
        strokeWidth="2"
        style={{
          opacity: animate ? 1 : 0,
          transition: 'opacity 0.8s ease 0.3s',
          filter: 'drop-shadow(0 0 6px rgba(0,243,255,0.4))',
        }}
      />
      {/* Data dots + labels */}
      {CATEGORIES.map((cat, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const val = avgs[cat] / 100;
        const dx = cx + R * val * Math.cos(angle);
        const dy = cy + R * val * Math.sin(angle);
        const lx = cx + (R + 18) * Math.cos(angle);
        const ly = cy + (R + 18) * Math.sin(angle);
        return (
          <g key={cat}>
            <circle
              cx={dx} cy={dy} r={4}
              fill={CAT_HEX[cat]}
              style={{
                opacity: animate ? 1 : 0,
                transition: `opacity 0.5s ease ${0.5 + i * 0.1}s`,
                filter: `drop-shadow(0 0 4px ${CAT_HEX[cat]})`,
              }}
            />
            <text
              x={lx} y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '7px',
                letterSpacing: '0.15em',
                fill: CAT_HEX[cat],
                fontWeight: 700,
                opacity: animate ? 1 : 0,
                transition: `opacity 0.5s ease ${0.6 + i * 0.1}s`,
              }}
            >
              {(cat === 'recon' ? 'RECON' : cat).toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
});

// ── Terminal Scan Animation ───────────────────────────────
const TerminalScan = memo(({ visible }) => {
  const [lines, setLines] = useState([]);
  const started = useRef(false);

  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const scanLines = [
      '> SCANNING_OPERATOR_ARSENAL...',
      '> DEFENSE_MODULES: [LOADED]',
      '> OFFENSE_VECTORS: [LOADED]',
      '> FORENSICS_TOOLS: [LOADED]',
      '> RECON_SUITE: [LOADED]',
      '> DEV_STACK: [LOADED]',
      '> ARSENAL_SCAN_COMPLETE. DISPLAYING_INVENTORY:',
    ];
    let i = 0, mounted = true;
    const add = () => {
      if (!mounted || i >= scanLines.length) return;
      setLines((prev) => [...prev, scanLines[i]]);
      i++;
      setTimeout(add, 80);
    };
    add();
    return () => { mounted = false; };
  }, [visible]);

  if (!lines.length) return null;

  return (
    <div style={{
      marginBottom: '2rem',
      padding: '1rem 1.25rem',
      background: 'rgba(5,8,16,0.6)',
      border: '1px solid rgba(0,243,255,0.08)',
      borderLeft: '3px solid var(--c-cyan)',
      overflow: 'hidden',
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          letterSpacing: '0.05em',
          color: line?.includes('[LOADED]') ? 'var(--c-green)'
               : line?.includes('COMPLETE') ? 'var(--c-cyan)'
               : 'var(--c-muted)',
          lineHeight: 1.8,
          animation: 'logFadeIn 0.15s ease',
        }}>
          {line}
        </div>
      ))}
      <style>{`
        @keyframes logFadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
});

// ── SKILLS ────────────────────────────────────────────────
const SkillsSection = memo(() => {
  const [filter, setFilter] = useState('all');
  const [radarRef, radarVisible] = useReveal(0.2);
  const [scanRef, scanVisible] = useReveal(0.15);
  const filtered = filter === 'all'
    ? config.skills
    : config.skills.filter((s) => s.category === filter);

  return (
    <Section id="skills">
      <div className="section-wrapper" style={{ padding: 'var(--section-gap) clamp(1.5rem,5vw,4rem)' }}>
        <SectionTitle label="// HERO_SPECIALIZATIONS" title="SUPERPOWER INVENTORY" accent="var(--c-stark-red)" />

        {/* Top: Radar + Stats */}
        <div ref={radarRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
          alignItems: 'center',
        }}>
          {/* Radar chart */}
          <div style={{
            background: 'var(--c-panel)',
            border: '1px solid var(--c-border)',
            padding: '1.5rem',
            position: 'relative',
          }}>
            <div className="cyber-label" style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '0.5rem' }}>
              THREAT_COVERAGE_MAP
            </div>
            <RadarChart animate={radarVisible} />
          </div>

          {/* Category breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="cyber-label" style={{ marginBottom: '0.5rem', fontSize: '0.5rem' }}>
              CATEGORY_BREAKDOWN
            </div>
            {CATEGORIES.map((cat) => {
              const skills = config.skills.filter((s) => s.category === cat);
              const avg = skills.length ? Math.round(skills.reduce((s, sk) => s + sk.level, 0) / skills.length) : 0;
              const color = CAT_COLOR[cat];
              const label = (cat === 'recon' ? 'RECON' : cat).toUpperCase();
              return (
                <div key={cat} 
                  className="hero-glow-skills"
                  style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--c-panel)',
                  border: `1px solid ${CAT_HEX[cat]}33`,
                  borderLeft: `3px solid ${CAT_HEX[cat]}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                  onClick={() => setFilter(filter === cat ? 'all' : cat)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${CAT_HEX[cat]}08`;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--c-panel)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color, fontWeight: 700 }}>
                      {label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--c-muted)', marginTop: '0.2rem' }}>
                      {skills.length} TOOL{skills.length !== 1 ? 'S' : ''}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color,
                  }}>
                    {avg}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Terminal Scan */}
        <div ref={scanRef}>
          <TerminalScan visible={scanVisible} />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {config.skillCategories.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              style={{
                padding: '0.35rem 0.85rem',
                border: '1px solid',
                borderColor: filter === id ? 'var(--c-violet)' : 'rgba(255,255,255,0.08)',
                background: filter === id ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: filter === id ? 'var(--c-violet)' : 'var(--c-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Arsenal cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1rem',
        }}>
          {filtered.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
});

const SkillCard = memo(({ skill, index }) => {
  const [ref, visible] = useReveal(0.1);
  const color = CAT_COLOR[skill.category] || 'var(--c-cyan)';
  const hex = CAT_HEX[skill.category] || '#00f3ff';

  return (
    <div
      ref={ref}
      className={`bracket reveal cyber-pulse ${visible ? 'visible' : ''}`}
      style={{
        transitionDelay: `${index * 50}ms`,
        padding: '1.25rem',
        background: 'var(--c-panel)',
        border: `1px solid ${hex}22`,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal)',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = `0 0 30px ${hex}40`;
        e.currentTarget.style.borderColor = `${hex}60`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = `${hex}22`;
      }}
    >
      {/* Category tag */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.5rem',
        letterSpacing: '0.25em',
        color,
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}>
        <div style={{ width: 6, height: 6, background: hex, boxShadow: `0 0 6px ${hex}`, flexShrink: 0 }} />
        {skill.category.toUpperCase()}
      </div>

      {/* Skill name */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.85rem',
        fontWeight: 700,
        color: 'var(--c-text)',
        marginBottom: '1rem',
        letterSpacing: '0.05em',
      }}>
        {skill.name}
      </div>

      {/* Progress bar (thicker + glow) */}
      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: visible ? `${skill.level}%` : '0%',
          background: `linear-gradient(90deg, ${hex}, ${hex}cc)`,
          boxShadow: `0 0 12px ${hex}, 0 0 2px ${hex}`,
          transition: `width 1.2s cubic-bezier(0.16,1,0.3,1) ${index * 60}ms`,
          borderRadius: 2,
        }} />
      </div>

      {/* Level */}
      <div style={{
        marginTop: '0.5rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.55rem',
        color: 'var(--c-muted)',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>PROFICIENCY</span>
        <span style={{ color }}>{skill.level}%</span>
      </div>
    </div>
  );
});

// ── PROJECTS ──────────────────────────────────────────────
const THREAT_COLOR = { CRITICAL: '#ff0033', HIGH: '#f59e0b', LOW: '#00ff88' };
const STATUS_COLOR = { ACTIVE: '#00ff88', COMPLETE: '#4a6080' };

const ProjectsSection = memo(() => {
  return (
    <Section id="projects">
      <div className="section-wrapper" style={{ padding: 'var(--section-gap) clamp(1.5rem,5vw,4rem)' }}>
        <SectionTitle label="// GLOBAL_MISSION_FILES" title="GLOBAL MISSIONS" accent="var(--c-wayne-blue)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {config.projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
});

const ProjectCard = memo(({ project: p, index }) => {
  const [ref, visible] = useReveal(0.1);
  const tColor = THREAT_COLOR[p.threatLevel] || 'var(--c-muted)';
  const sColor = STATUS_COLOR[p.status] || 'var(--c-muted)';
  const isFeatured = p.featured;

  // Simple tilt effect handler
  const handleMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = (y / rect.height - 0.5) * 8;
    const ry = (x / rect.width - 0.5) * -8;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  };

  return (
    <div
      ref={ref}
      className={`card-project hero-glow-projects bracket tilt-on-hover reveal ${visible ? 'visible' : ''}`}
      style={{ 
        transitionDelay: `${index * 80}ms`,
        boxShadow: isFeatured ? `var(--glow-wayne)` : 'none',
        border: isFeatured ? `1px solid var(--c-wayne-blue)` : '1px solid var(--c-border)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '0.2rem 0.6rem',
          background: tColor,
          color: 'var(--c-void)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5rem',
          fontWeight: 900,
          letterSpacing: '0.1em',
          zIndex: 10,
        }}>
          FEATURED_CASE
        </div>
      )}

      {/* Terminal Stream Backdrop (Interactive) */}
      <div className="terminal-stream" style={{ opacity: isFeatured ? 0.05 : 0 }}>
        {`[ANALYZING_THREAT_${p.id.toUpperCase()}] ...\n`.repeat(5)}
        {`KEYWORDS: ${p.keywords?.join(', ')}\n`.repeat(3)}
      </div>

      {/* Header row */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="status-dot" style={{ background: sColor }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: sColor }}>
              {p.status}
            </span>
          </div>
          <span className="glitch-text" style={{
            padding: '0.2rem 0.5rem',
            border: `1px solid ${tColor}44`,
            background: `${tColor}11`,
            color: tColor,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            cursor: 'help',
          }}>
            THREAT:{p.threatLevel}
          </span>
        </div>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--c-text)', marginBottom: '0.5rem' }}>
          {p.title}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--c-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>
          {p.subtitle}
        </div>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>
          {p.description}
        </p>

        {/* IMPACT SECTION (Recruiter Highlight) */}
        {p.impact && (
          <div style={{
            padding: '0.75rem',
            background: 'rgba(0,255,136,0.03)',
            borderLeft: '2px solid var(--c-green)',
            marginBottom: '1rem',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--c-green)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>// KEY_OUTCOME</div>
            <div style={{ color: 'var(--c-text)', fontSize: '0.75rem', lineHeight: 1.5, fontStyle: 'italic' }}>
              "{p.impact}"
            </div>
          </div>
        )}

        {/* MITRE ATT&CK MAPPING (Recruiter Proof) */}
        {p.mitre && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: 'var(--c-cyan)', letterSpacing: '0.15em', marginBottom: '0.5rem', opacity: 0.6 }}>// MITRE_ATT&CK_TACTICS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {p.mitre.map(m => (
                <div key={m} style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  color: 'var(--c-text)',
                  background: 'rgba(0,243,255,0.04)',
                  padding: '0.4rem 0.6rem',
                  border: '1px solid rgba(0,243,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
                  <span style={{ color: 'var(--c-cyan)', fontWeight: 900 }}>[✓]</span> {m}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Keywords (Recruiter Highlight) */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {p.keywords?.map((k) => (
            <span key={k} style={{
              padding: '0.15rem 0.4rem',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.05em',
            }}>#{k.toUpperCase()}</span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {p.github && (
            <a
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ fontSize: '0.6rem', padding: '0.4rem 0.8rem' }}
              aria-label={`View ${p.title} on GitHub`}
            >
              ↗ GITHUB
            </a>
          )}
          {p.live && (
            <a
              href={p.live}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cyber"
              style={{ fontSize: '0.6rem', padding: '0.4rem 0.8rem' }}
              aria-label={`View ${p.title} live demo`}
            >
              LIVE_DEMO
            </a>
          )}
        </div>
      </div>
    </div>
  );
});

// ── CERTIFICATIONS ────────────────────────────────────────
const CertsSection = memo(() => {
  return (
    <Section id="certs">
      <div className="section-wrapper" style={{ padding: 'var(--section-gap) clamp(1.5rem,5vw,4rem)' }}>
        <SectionTitle label="// CREDENTIALS_VERIFIED" title="CERTIFICATIONS" accent="var(--c-amber)" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '1rem' }}>
          {config.certifications.map((cert, i) => (
            <CertCard key={cert.name} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
});

const CertCard = memo(({ cert, index }) => {
  const [ref, visible] = useReveal(0.1);
  return (
    <div
      ref={ref}
      className={`bracket reveal ${visible ? 'visible' : ''}`}
      style={{
        transitionDelay: `${index * 70}ms`,
        padding: '1.5rem',
        background: 'var(--c-panel)',
        border: `1px solid ${cert.color}22`,
        transition: 'transform var(--dur-normal) var(--ease-out), box-shadow var(--dur-normal)',
        cursor: 'pointer',
      }}
      onClick={() => window.open(cert.verifyUrl, '_blank', 'noopener,noreferrer')}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 0 20px ${cert.color}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && window.open(cert.verifyUrl, '_blank', 'noopener,noreferrer')}
      aria-label={`${cert.name} by ${cert.issuer} — click to verify`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.15em', color: cert.color }}>
          {cert.issuer.toUpperCase()}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: 'var(--c-muted)', letterSpacing: '0.1em' }}>
          VERIFIED ✓
        </span>
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-text)', lineHeight: 1.4, marginBottom: '0.75rem' }}>
        {cert.name}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--c-muted)', letterSpacing: '0.1em' }}>
        VIA {cert.platform.toUpperCase()}
      </div>
      <div style={{ height: 1, background: `linear-gradient(to right, ${cert.color}40, transparent)`, marginTop: '1rem' }} />
    </div>
  );
});

// ── TIMELINE ──────────────────────────────────────────────
const TYPE_COLOR_MAP = {
  education:     'var(--c-cyan)',
  certification: 'var(--c-amber)',
  experience:    'var(--c-green)',
};

const TimelineSection = memo(() => {
  return (
    <Section id="timeline">
      <div className="section-wrapper" style={{ padding: 'var(--section-gap) clamp(1.5rem,5vw,4rem)' }}>
        <SectionTitle label="// OPERATOR_HISTORY" title="TIMELINE" accent="var(--c-cyan)" />
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 8,
            bottom: 8,
            width: 2,
            background: 'linear-gradient(to bottom, var(--c-cyan), var(--c-violet), transparent)',
            opacity: 0.4,
          }} />
          {/* Fixed stable keys for timeline */}
          {config.timeline.map((item, i) => (
            <TimelineEntry
              key={`${item.org}-${item.year}`}
              item={item}
              color={TYPE_COLOR_MAP[item.type] || 'var(--c-muted)'}
              index={i}
            />
          ))}
        </div>
      </div>
    </Section>
  );
});

const TimelineEntry = memo(({ item, color, index }) => {
  const [ref, visible] = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={`${index % 2 === 0 ? 'reveal-left' : 'reveal-right'} ${visible ? 'visible' : ''}`}
      style={{
        transitionDelay: `${index * 100}ms`,
        position: 'relative',
        marginBottom: '2.5rem',
        paddingLeft: '2rem',
      }}
    >
      {/* Node dot */}
      <div style={{
        position: 'absolute',
        left: -2.5 - 8,
        top: 6,
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 10px ${color}`,
        border: '2px solid var(--c-void)',
      }} />

      <div style={{ padding: '1.25rem 1.5rem', background: 'var(--c-panel)', border: `1px solid ${color}22` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color }}>
            {item.year}
          </span>
          <span style={{
            padding: '0.15rem 0.5rem',
            background: `${color}11`,
            border: `1px solid ${color}33`,
            color,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
          }}>
            {item.type.toUpperCase()}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--c-text)', marginBottom: '0.35rem' }}>
          {item.role}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.12em', color: 'var(--c-muted)', marginBottom: '0.75rem' }}>
          {item.org}
        </div>
        <p style={{ color: 'var(--c-muted)', fontSize: '0.8rem', lineHeight: 1.6 }}>{item.detail}</p>
      </div>
    </div>
  );
});

// ── CONTACT ───────────────────────────────────────────────
const ContactSection = memo(() => {
  const [copied, setCopied] = useState(false);
  const email = `${config.emailUser}@${config.emailDomain}`;

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [email]);

  const LINKS = [
    { label: 'GITHUB',    href: config.github,   sub: `@${config.githubUsername}`, color: 'var(--c-text)' },
    { label: 'LINKEDIN',  href: config.linkedin,  sub: 'Sriman Rutvik',              color: '#0077b5' },
    { label: 'LETSDEFEND',href: config.letsdefend,sub: 'SOC Platform',               color: 'var(--c-cyan)' },
  ];

  return (
    <Section id="contact">
      <div className="section-wrapper" style={{ padding: 'var(--section-gap) clamp(1.5rem,5vw,4rem)', paddingBottom: '8rem' }}>
        <SectionTitle label="// SECURE_CHANNEL" title="INITIATE CONTACT" accent="var(--c-red)" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '2rem' }}>
          {/* Email */}
          <div style={{ padding: '2rem', background: 'var(--c-panel)', border: '1px solid var(--c-border)', position: 'relative' }}>
            <div className="scanline" style={{ '--scan-height': '200px' }} />
            <div className="cyber-label" style={{ marginBottom: '1rem' }}>ENCRYPTED_CHANNEL</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(0.65rem, 1.5vw, 0.8rem)',
              color: 'var(--c-cyan)',
              marginBottom: '1.5rem',
              wordBreak: 'break-all',
              userSelect: 'none',  /* Obfuscate partial bot scraping */
            }}>
              {/* Obfuscated via CSS direction trick */}
              <span dir="ltr">{config.emailUser}</span>
              <span style={{ color: 'var(--c-muted)' }}>@</span>
              <span>{config.emailDomain}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                className="btn-cyber"
                style={{ fontSize: '0.6rem', padding: '0.5rem 1rem' }}
                onClick={copyEmail}
                aria-label="Copy email address"
              >
                {copied ? '✓ COPIED' : 'COPY_EMAIL'}
              </button>
              <a
                href={`mailto:${email}`}
                className="btn-ghost"
                style={{ fontSize: '0.6rem', padding: '0.5rem 1rem' }}
                aria-label="Send email"
              >
                SEND_MSG
              </a>
            </div>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {LINKS.map(({ label, href, sub, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${label} profile`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem 1.25rem',
                  background: 'var(--c-panel)',
                  border: '1px solid var(--c-border)',
                  textDecoration: 'none',
                  borderLeft: `4px solid ${color}`,
                  transition: 'transform var(--dur-fast), box-shadow var(--dur-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(4px)';
                  e.currentTarget.style.boxShadow = `0 0 20px ${color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.2em', color, marginBottom: '0.25rem' }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--c-muted)' }}>
                    {sub}
                  </div>
                </div>
                <span style={{ color: 'var(--c-muted)', fontSize: '1.2rem' }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '4rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(0,243,255,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--c-muted)' }}>
            © {new Date().getFullYear()} VODDIRAJU SRIMAN RUTVIK // ALL_RIGHTS_RESERVED
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', letterSpacing: '0.1em', color: 'rgba(0,243,255,0.25)' }}>
            SENTINEL_OS v2.0 // SECURED
          </span>
        </div>
      </div>
    </Section>
  );
});

// ── Root export ────────────────────────────────────────────
export default function PortfolioSections() {
  return (
    <div id="main-content" tabIndex={-1}>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <CertsSection />
      <TimelineSection />
      <ContactSection />
    </div>
  );
}
