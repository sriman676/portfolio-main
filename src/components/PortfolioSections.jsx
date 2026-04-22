'use client';

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
    text.replace(/[a-zA-Z0-9]/g, '-')
  );
  const [ref, visible] = useReveal(0.3);
  const done = useRef(false);

  useEffect(() => {
    if (!done.current) {
      setDisplay(text.split('').map((char) => char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]).join(''));
    }
  }, [text]);

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
function SectionTitle({ label, title, accent, number }) {
  const [ref, visible] = useReveal(0.15);
  return (
    <div ref={ref} style={{ marginBottom: '3rem' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        letterSpacing: '0.4em',
        color: accent || 'var(--c-cyan)',
        marginBottom: '0.75rem',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        {number && <span style={{ opacity: 0.4 }}>{number}</span>}
        {label}
      </div>
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
        fontWeight: 900,
        letterSpacing: '0.12em',
        color: 'var(--c-text)',
        textTransform: 'uppercase',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease',
        textShadow: '0 0 40px rgba(0,243,255,0.08)',
      }}>
        {title}
      </h2>
      {/* Animated underline draw */}
      <div
        className={visible ? 'section-underline visible' : 'section-underline'}
        style={{ background: accent || 'var(--c-cyan)', boxShadow: `0 0 10px ${accent || 'var(--c-cyan)'}` }}
      />
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
      <div className="floating" style={{
        background: 'rgba(2,3,10,0.65)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: '1px solid rgba(0,243,255,0.14)',
        borderLeft: '6px solid var(--c-cyan)',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        maxWidth: 680,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 60px rgba(0,243,255,0.06), 0 0 120px rgba(255,0,51,0.04)',
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

        <h1 className="hero-supernova" style={{
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
  defense:      'var(--c-cyan)',
  intelligence: 'var(--c-violet)',
  operations:   'var(--c-stark-red)',
  foundations:  'var(--c-green)',
};
const CAT_HEX = {
  defense:      '#00f3ff',
  intelligence: '#a855f7',
  operations:   '#ff0033',
  foundations:  '#00ff88',
};
const CATEGORIES = ['defense', 'intelligence', 'operations', 'foundations'];
const CAT_LABELS = { 
  defense: 'CYBER_DEFENSE', 
  intelligence: 'AI_INTEL', 
  operations: 'TACTICAL_OPS', 
  foundations: 'CORE_INFRA' 
};

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


// ── SKILLS ────────────────────────────────────────────────
const SkillsSection = memo(() => {
  const [activeTab, setActiveTab] = useState('defense');

  const filteredSkills = config.skills.filter(s => activeTab === 'all' || s.category === activeTab);

  return (
    <Section id="skills">
      <div className="section-wrapper" style={{ padding: 'var(--section-gap) clamp(1.5rem,5vw,4rem)' }}>
        <SectionTitle label="// OPERATOR_ARSENAL" title="SKILLS" accent="var(--c-cyan)" />


        {/* Arsenal tab row */}
        <div style={{
          display: 'flex',
          gap: '0.4rem',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          paddingBottom: '1rem',
          position: 'relative',
          zIndex: 200,
          pointerEvents: 'auto',
          isolation: 'isolate',
        }}>
          {['all', ...CATEGORIES].map(cat => {
            const catColor = CAT_HEX[cat] || '#00f3ff';
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`arsenal-tab ${isActive ? 'active' : ''}`}
                style={{
                  color: isActive ? catColor : undefined,
                  position: 'relative',
                  zIndex: 200,
                  pointerEvents: 'auto',
                }}
              >
                <span>{cat === 'all' ? 'FULL_ARSENAL' : CAT_LABELS[cat]}</span>
              </button>
            );
          })}
        </div>


        {/* Skills cards grid */}
        <div className="scrollable-area" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          minHeight: '200px', // Responsive height
          maxHeight: '45vh',
          paddingRight: '0.5rem',
        }}>
          {filteredSkills.map((skill, i) => (
            <SkillCard key={skill.name} skill={skill} index={i} categoryChanged={activeTab} />
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
      className={`skill-card-holo reveal ${visible ? 'visible' : ''}`}
      style={{
        transitionDelay: `${(index % 8) * 50}ms`,
        padding: '1.1rem 1.25rem',
        background: `linear-gradient(135deg, rgba(2,3,10,0.9) 0%, ${hex}08 100%)`,
        border: `1px solid ${hex}20`,
        position: 'relative',
        cursor: 'default',
        animation: visible ? `popIn 0.4s ${index * 40}ms both` : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 40px ${hex}30, 0 0 0 1px ${hex}40`;
        e.currentTarget.style.borderColor = `${hex}50`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = `${hex}20`;
      }}
    >
      {/* Category dot + label */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.5rem',
        letterSpacing: '0.25em',
        color,
        marginBottom: '0.6rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}>
        <div style={{
          width: 6, height: 6,
          background: hex,
          boxShadow: `0 0 8px ${hex}, 0 0 16px ${hex}66`,
          flexShrink: 0,
          borderRadius: '50%',
          animation: 'neonBreathe 2.5s ease-in-out infinite',
        }} />
        {skill.category.toUpperCase().replace('_', ' ')}
      </div>

      {/* Skill name */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.82rem',
        fontWeight: 700,
        color: 'var(--c-text)',
        marginBottom: '1rem',
        letterSpacing: '0.04em',
        lineHeight: 1.3,
      }}>
        {skill.name}
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: visible ? `${skill.level}%` : '0%',
          background: `linear-gradient(90deg, ${hex}aa, ${hex})`,
          boxShadow: `0 0 10px ${hex}88`,
          transition: `width 1.4s cubic-bezier(0.16,1,0.3,1) ${(index % 8) * 60 + 200}ms`,
          borderRadius: 2,
        }} />
      </div>
      <div style={{
        marginTop: '0.45rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.5rem',
        color: 'rgba(255,255,255,0.25)',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>PROFICIENCY</span>
        <span style={{ color }}>{skill.level}%</span>
      </div>
    </div>
  );
});


// ── GITHUB LIVE REPO CARD ─────────────────────────────────
// Auto-generate a description for repos with null description
const autoDesc = (name, lang) => {
  const n = name.toLowerCase().replace(/[-_]/g, ' ');
  if (n.includes('soc'))        return 'Security Operations Center tooling and SIEM automation.';
  if (n.includes('portfolio'))  return 'Quantum-themed immersive 3D cybersecurity portfolio.';
  if (n.includes('caption') || n.includes('image')) return 'AI-powered image captioning and visual recognition.';
  if (n.includes('humanizer'))  return 'Converts AI-generated text to natural human writing.';
  if (n.includes('trust'))      return 'Zero-trust network security architecture.';
  if (n.includes('farmer') || n.includes('farm')) return 'Farm-to-home e-commerce platform.';
  if (n.includes('simulation') || n.includes('sim')) return 'Network attack simulation and defence testing.';
  if (n.includes('project'))    return 'Security research and development project.';
  if (lang === 'Python')        return 'Python-based automation and security scripting tool.';
  if (lang === 'JavaScript')    return 'Full-stack web application with security-first design.';
  if (lang === 'C++' || lang === 'C') return 'Systems-level security and network analysis tool.';
  return 'Open-source security tool — see repo for details.';
};

const LANG_COLOR = {
  Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6',
  Shell: '#89e051', HTML: '#e34c26', CSS: '#563d7c',
};

const GithubCard = memo(({ repo, index }) => {
  const [ref, visible] = useReveal(0.05);
  const langColor = LANG_COLOR[repo.language] || 'var(--c-cyan)';
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = '';
      cardRef.current.style.boxShadow = 'none';
    }
  };
  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRef.current.style.boxShadow = '0 0 30px rgba(0,255,187,0.18), 0 16px 40px rgba(0,0,0,0.5)';
    }
  };

  return (
    <a
      ref={(el) => { ref.current = el; cardRef.current = el; }}
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${repo.name} repository on GitHub`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textDecoration: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? '' : 'translateY(24px)',
        transition: `opacity .5s ease ${index * 70}ms, transform .5s ease ${index * 70}ms, box-shadow .25s ease`,
        padding: '1.4rem',
        background: 'rgba(5,10,20,0.88)',
        border: '1px solid rgba(0,255,187,0.12)',
        borderLeft: '3px solid var(--c-green)',
        minHeight: '170px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
    >
      {/* Shimmer sweep */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        background: 'linear-gradient(120deg, transparent 30%, rgba(0,255,187,0.05) 50%, transparent 70%)',
        backgroundSize: '200% 100%', backgroundPosition: '100% 0',
        transition: 'background-position 0.5s ease',
      }} />

      {/* "Open in GitHub" corner badge */}
      <div style={{
        position: 'absolute', top: '0.6rem', right: '0.6rem',
        fontFamily: 'var(--font-mono)', fontSize: '0.45rem',
        color: 'rgba(0,255,187,0.45)', letterSpacing: '0.15em',
        pointerEvents: 'none', zIndex: 3,
      }}>↗ GITHUB</div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: '0.88rem',
          fontWeight: 700, color: 'var(--c-text)',
          marginBottom: '0.5rem', letterSpacing: '0.04em',
        }}>
          {repo.name.toUpperCase().replace(/-/g, '_')}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.62rem',
          color: 'var(--c-muted)', lineHeight: 1.65, marginBottom: '1rem',
        }}>
          {repo.description || autoDesc(repo.name, repo.language)}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', position: 'relative', zIndex: 2 }}>
        {repo.language && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: langColor, display: 'inline-block', boxShadow: `0 0 6px ${langColor}` }} />
            <span style={{ color: langColor }}>{repo.language}</span>
          </span>
        )}
        <span style={{ color: 'rgba(255,255,255,0.3)' }}>★ {repo.stars ?? 0}</span>
      </div>
    </a>
  );
});


// ── PROJECTS ──────────────────────────────────────────────
const THREAT_COLOR = { CRITICAL: '#ff0033', HIGH: '#f59e0b', LOW: '#00ff88' };
const STATUS_COLOR = { ACTIVE: '#00ff88', COMPLETE: '#4a6080' };

const ProjectsSection = memo(({ repos = [] }) => {
  const scrollRef = useRef(null);
  const githubRepos = repos;
  const loading = !repos || repos.length === 0;

  // Auto-scroll logic for GitHub Repos
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || githubRepos.length === 0) return;
    
    let animationFrameId;
    let isHovered = false;

    const handleMouseEnter = () => isHovered = true;
    const handleMouseLeave = () => isHovered = false;
    
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);
    el.addEventListener('touchstart', handleMouseEnter, { passive: true });
    el.addEventListener('touchend', handleMouseLeave);

    const scrollStep = () => {
      if (el && !isHovered) {
        el.scrollLeft += 2; // Speed: 2px per frame
        // If we hit the end, loop back quietly
        if (el.scrollLeft >= (el.scrollWidth - el.clientWidth)) {
          el.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (el) {
         el.removeEventListener('mouseenter', handleMouseEnter);
         el.removeEventListener('mouseleave', handleMouseLeave);
         el.removeEventListener('touchstart', handleMouseEnter);
         el.removeEventListener('touchend', handleMouseLeave);
      }
    };
  }, [githubRepos]);

  // This section now uses prop-driven data from the server


  return (
    <Section id="projects">
      <div className="section-wrapper" style={{ padding: 'var(--section-gap) clamp(1.5rem,5vw,4rem)' }}>
        <SectionTitle label="// LIVE_TELEMETRY" title="PROJECTS" accent="var(--c-green)" />

        {loading && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--c-muted)', letterSpacing: '0.15em' }}>
            › FETCHING_GITHUB_REPOS...
          </div>
        )}

        {/* Dynamic GitHub Repos — horizontal auto-scroll */}
        {!loading && (
          <div
            ref={scrollRef}
            className="hide-scrollbar"
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              gap: '1.5rem',
              paddingBottom: '1.5rem',
              scrollBehavior: 'auto',
            }}
          >
            {githubRepos.map((repo, i) => (
              <div key={repo.id} style={{ minWidth: '280px', flex: '0 0 auto' }}>
                <GithubCard repo={repo} index={i} />
              </div>
            ))}
          </div>
        )}
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
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px) scale(1.04)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
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
        <div className="scrollable-area" style={{ position: 'relative', paddingLeft: '2rem', maxHeight: '45vh', paddingRight: '1rem' }}>
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

// ═══════════════════════════════════════════════════════════
// BIOLOGY IMMERSION PANEL
// ═══════════════════════════════════════════════════════════
const BiologyPanel = memo(({ goNext, goPrev }) => {
  const NUM_RUNGS = 22;
  const rungs = Array.from({ length: NUM_RUNGS }, (_, i) => i);

  return (
    <div className="panel-slide bio-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Background nebula blobs */}
      {[
        { top: '10%', left: '5%', w: 300, color: 'rgba(0,255,136,0.04)', dur: 8 },
        { top: '60%', right: '8%', w: 250, color: 'rgba(0,243,255,0.05)', dur: 11 },
        { top: '40%', left: '40%', w: 200, color: 'rgba(124,58,237,0.04)', dur: 9 },
      ].map((b, i) => (
        <div key={i} aria-hidden="true" style={{
          position: 'absolute', top: b.top, left: b.left, right: b.right,
          width: b.w, height: b.w, borderRadius: '50%',
          background: b.color, filter: 'blur(60px)', pointerEvents: 'none',
          animation: `cellPulse ${b.dur}s ease-in-out ${i * 1.5}s infinite`,
        }} />
      ))}

      {/* Title */}
      <div style={{ textAlign: 'center', zIndex: 2 }}>
        <div className="cyber-label" style={{ color: 'var(--c-green)', marginBottom: '0.75rem' }}>// BIO_CYBER_NEXUS</div>
        <h2 className="glow-supernova-cyan" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '0.15em' }}>
          QUANTUM INTEL NEXUS
        </h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--c-muted)', letterSpacing: '0.12em', marginTop: '0.5rem', maxWidth: 500, lineHeight: 1.7 }}>
          Cybersecurity mirrors biology. Viruses mutate. Networks evolve. The operator studies both — to predict, adapt, and neutralize threats before they proliferate.
        </p>
      </div>

      {/* DNA + Neural Network visual */}
      <div style={{ display: 'flex', gap: 'clamp(2rem, 8vw, 6rem)', alignItems: 'center', zIndex: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Large DNA Helix */}
        <div style={{ position: 'relative', width: 60, height: 260, perspective: '400px' }}>
          <div style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', animation: 'helixRotateA 6s linear infinite' }}>
            {rungs.map(i => {
              const t = i / (NUM_RUNGS - 1);
              const angle = t * Math.PI * 6;
              const ax = Math.sin(angle) * 22 + 28;
              const bx = Math.sin(angle + Math.PI) * 22 + 28;
              const y = t * 248;
              return (
                <React.Fragment key={i}>
                  <div style={{
                    position: 'absolute', left: ax - 5, top: y - 5,
                    width: 10, height: 10, borderRadius: '50%',
                    background: i % 2 === 0 ? '#00f3ff' : '#00ffbb',
                    boxShadow: `0 0 10px ${i % 2 === 0 ? '#00f3ff' : '#00ffbb'}, 0 0 20px ${i % 2 === 0 ? '#00f3ff66' : '#00ffbb66'}`,
                  }} />
                  <div style={{
                    position: 'absolute', left: bx - 5, top: y - 5,
                    width: 10, height: 10, borderRadius: '50%',
                    background: i % 2 === 0 ? '#ff0033' : '#ff6644',
                    boxShadow: `0 0 10px ${i % 2 === 0 ? '#ff0033' : '#ff6644'}, 0 0 20px ${i % 2 === 0 ? '#ff003366' : '#ff664466'}`,
                  }} />
                  <div style={{
                    position: 'absolute',
                    left: Math.min(ax, bx) + 5,
                    top: y,
                    width: Math.max(Math.abs(ax - bx) - 10, 0),
                    height: 1,
                    background: 'linear-gradient(90deg, rgba(0,243,255,0.5), rgba(255,0,51,0.5))',
                  }} />
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Info cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 340 }}>
          {[
            { icon: '⬡', label: 'NEURAL_PATTERN', text: 'Threat actors leave behavioral fingerprints. Pattern recognition is the key to attribution.', color: '#00f3ff' },
            { icon: '⬙', label: 'MUTATION_DETECT', text: 'Like viral mutations, malware evolves. Signature-based detection alone is insufficient.', color: '#ff0033' },
            { icon: '⬘', label: 'IMMUNE_RESPONSE', text: 'Automated containment protocols mirror biological immune response — fast, targeted, decisive.', color: '#00ffbb' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '0.85rem 1.1rem',
              background: 'rgba(0,0,0,0.4)',
              border: `1px solid ${item.color}22`,
              borderLeft: `3px solid ${item.color}`,
              display: 'flex', gap: '0.8rem', alignItems: 'flex-start',
              animation: `spaceFloat ${6 + i * 1.5}s ease-in-out ${i * 0.8}s infinite`,
            }}>
              <span style={{ fontSize: '1.2rem', color: item.color, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: item.color, letterSpacing: '0.2em', marginBottom: '0.25rem' }}>{item.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--c-muted)', lineHeight: 1.6 }}>{item.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel nav hint */}
      <div style={{ display: 'flex', gap: '1rem', zIndex: 2 }}>
        <button className="btn-ghost" style={{ fontSize: '0.6rem', letterSpacing: '0.15em' }} onClick={goPrev}>← BACK</button>
        <button className="btn-cyber" style={{ fontSize: '0.6rem', letterSpacing: '0.15em' }} onClick={goNext}>PROCEED →</button>
      </div>
    </div>
  );
});
BiologyPanel.displayName = 'BiologyPanel';

// ═══════════════════════════════════════════════════════════
// PANEL DOT NAVIGATION + ARROWS
// ═══════════════════════════════════════════════════════════
const PANEL_LABELS = [
  'HERO', 'PROFILE', 'BIO_NEXUS', 'ARSENAL', 'MISSIONS', 'CLEARANCE', 'TIMELINE', 'COMMS'
];

function PanelNav({ active, total, onNav, isMoving }) {
  return (
    <div style={{ opacity: isMoving ? 0 : 1, transition: 'opacity 0.4s ease', pointerEvents: isMoving ? 'none' : 'auto' }}>
      {/* Current panel label */}
      <div className="panel-label">{PANEL_LABELS[active] || ''} [{active + 1}/{total}]</div>

      {/* Left/right arrows */}
      {active > 0 && (
        <button className="panel-arrow left" onClick={() => onNav(active - 1)} aria-label="Previous panel">‹</button>
      )}
      {active < total - 1 && (
        <button className="panel-arrow right" onClick={() => onNav(active + 1)} aria-label="Next panel">›</button>
      )}

      {/* Dot indicators */}
      <div className="panel-dots" role="tablist" aria-label="Panel navigation">
        {Array.from({ length: total }, (_, i) => (
          <button
            key={i}
            className={`panel-dot${active === i ? ' active' : ''}`}
            onClick={() => onNav(i)}
            aria-label={`Go to ${PANEL_LABELS[i] || `panel ${i + 1}`}`}
            role="tab"
            aria-selected={active === i}
          />
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ROOT EXPORT — 3D TUNNEL SYSTEM
// ═══════════════════════════════════════════════════════════
export default function PortfolioSections({ githubRepos = [] }) {
  const zOffset = useStore((s) => s.zOffset);
  const setZOffset = useStore((s) => s.setZOffset);
  const scrollVelocity = useStore((s) => s.scrollVelocity);
  const setScrollVelocity = useStore((s) => s.setScrollVelocity);
  const isSingularity = useStore((s) => s.isSingularity);
  
  const TOTAL = 8;
  const lastScrollTime = useRef(Date.now());
  const velocityTimeout = useRef(null);

  const goTo = useCallback((i) => {
    setZOffset(i * 10);
  }, [setZOffset]);

  // Expose global bridge for HUD nav links
  useEffect(() => {
    window.__navPanel = goTo;
    const sectionMap = {
      'hero': 0, 'about': 1, 'biology': 2, 'skills': 3,
      'projects': 4, 'certs': 5, 'timeline': 6, 'contact': 7,
    };
    window.__navPanelBySection = (id) => {
      const idx = sectionMap[id];
      if (idx !== undefined) goTo(idx);
    };
    return () => { delete window.__navPanel; delete window.__navPanelBySection; };
  }, [goTo]);

  // Scroll handler for 3D depth
  useEffect(() => {
    if (isSingularity) return;

    const handleWheel = (e) => {
      // Allow native scroll for designated areas unless at boundaries
      const scrollable = e.target.closest('.scrollable-area');
      if (scrollable) {
        const isAtTop = scrollable.scrollTop === 0;
        const isAtBottom = scrollable.scrollHeight - scrollable.scrollTop <= scrollable.clientHeight + 1;
        
        // Let it scroll natively if moving within the element's bounds
        if (!isAtTop && e.deltaY < 0) return;
        if (!isAtBottom && e.deltaY > 0) return;
      }

      e.preventDefault();
      const delta = e.deltaY * 0.08; // Increased sensitivity
      const now = Date.now();
      const dt = now - lastScrollTime.current;
      lastScrollTime.current = now;
      
      const velocity = e.deltaY / (dt || 1);
      setScrollVelocity(velocity);
      
      setZOffset(prev => Math.max(0, Math.min((TOTAL - 1) * 10, prev + delta)));

      clearTimeout(velocityTimeout.current);
      velocityTimeout.current = setTimeout(() => setScrollVelocity(0), 150);
    };

    const handleKey = (e) => {
      if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
        setZOffset(prev => Math.max(0, prev - 2));
      } else if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
        setZOffset(prev => Math.min((TOTAL - 1) * 10, prev + 2));
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKey);
      clearTimeout(velocityTimeout.current);
    };
  }, [setZOffset, setScrollVelocity, isSingularity]);

  const activeIndex = Math.round(zOffset / 10);
  const isMoving = Math.abs(scrollVelocity) > 0.05 || (Math.abs(activeIndex * 10 - zOffset) > 0.5);

  const renderSection = (index, Component, props = {}) => {
    const sectionZ = index * 10;
    const distance = sectionZ - zOffset;
    
    // Calculate 3D transforms
    // scale(1) at distance=0, scale(0) at distance=10, scale(5) at distance=-10 (passing viewer)
    const scale = Math.max(0, 1 - distance / 10);
    const opacity = distance > 0 ? (1 - distance / 5) : (1 + distance / 5);
    const z = distance * -200; // Multiplier for depth feel

    if (opacity <= 0) return null;

    return (
      <div 
        key={index}
        className={`tunnel-section ${activeIndex === index ? 'active' : ''}`}
        style={{
          transform: `translateZ(${z}px) scale(${1})`,
          opacity: Math.max(0, opacity),
          zIndex: activeIndex === index ? 50 : (TOTAL - index),
          pointerEvents: activeIndex === index ? 'auto' : 'none',
        }}
      >
        <div className="tunnel-card" style={{
           transform: `scale(${activeIndex === index ? 1 : 0.95})`,
           transition: 'transform 0.5s ease',
           transformStyle: 'preserve-3d',
        }}>
          <Component {...props} />
        </div>
      </div>
    );
  };

  return (
    <div id="main-content" className="tunnel-container" tabIndex={-1}>
      {/* Panel navigation UI (Dots/Arrows) */}
      <PanelNav active={activeIndex} total={TOTAL} onNav={goTo} isMoving={isMoving} />

      {/* Hero */}
      {renderSection(0, HeroSection, { goNext: () => goTo(1) })}
      {/* About */}
      {renderSection(1, AboutSection)}
      {/* Biology */}
      {renderSection(2, BiologyPanel, { goNext: () => goTo(3), goPrev: () => goTo(1) })}
      {/* Skills */}
      {renderSection(3, SkillsSection)}
      {/* Projects */}
      {renderSection(4, () => (
        <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '1rem', scrollbarWidth: 'thin' }}>
          <ProjectsSection repos={githubRepos} />
        </div>
      ))}
      {/* Certs */}
      {renderSection(5, CertsSection)}
      {/* Timeline */}
      {renderSection(6, TimelineSection)}
      {/* Contact */}
      {renderSection(7, ContactSection)}
    </div>
  );
}
