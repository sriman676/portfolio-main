'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { config } from '../portfolioConfig';

// ── Shared token ──────────────────────────────────────────────
const C = {
  cyan:   'var(--c-cyan)',
  green:  'var(--c-green, #00ff88)',
  violet: 'var(--c-violet, #7c3aed)',
  muted:  'var(--c-muted)',
  text:   'var(--c-text)',
  border: 'var(--c-border)',
  card:   'var(--c-panel)',
};

// ── Tiny utility: appear-on-scroll ───────────────────────────
function Reveal({ children, delay = 0 }) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: on ? 1 : 0,
      transform: on ? 'none' : 'translateY(18px)',
      transition: `opacity .45s ease ${delay}ms, transform .45s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────
function Section({ id, children, style }) {
  return (
    <section id={id} style={{
      maxWidth: 860,
      margin: '0 auto',
      padding: '4rem clamp(1.25rem, 5vw, 3rem)',
      borderBottom: `1px solid ${C.border}`,
      ...style,
    }}>
      {children}
    </section>
  );
}

// ── Section label ─────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: '0.52rem',
      letterSpacing: '0.25em', color: C.cyan,
      marginBottom: '1.25rem', textTransform: 'uppercase',
    }}>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 1. HERO
// ═══════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <Section id="r-hero" style={{ paddingTop: '5rem', borderBottom: `1px solid ${C.border}` }}>
      <Reveal>
        {/* Available badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.25rem 0.75rem',
          border: `1px solid ${C.green}44`,
          background: `${C.green}0a`,
          marginBottom: '1.75rem',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', color: C.green, letterSpacing: '0.2em' }}>
            AVAILABLE FOR INTERNSHIP / FULL-TIME
          </span>
        </div>

        {/* Name */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 900, letterSpacing: '0.06em',
          color: C.text, lineHeight: 1.1, marginBottom: '0.6rem',
        }}>
          SRIMAN RUTVIK
        </h1>

        {/* Role */}
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.75rem, 2vw, 0.95rem)',
          color: C.cyan, letterSpacing: '0.15em', marginBottom: '1.5rem',
        }}>
          Cybersecurity Student — SOC Analyst
        </div>

        {/* Why — THE key sentence */}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 'clamp(0.8rem, 2vw, 1rem)',
          color: C.muted, lineHeight: 1.8, maxWidth: 520,
          borderLeft: `3px solid ${C.cyan}`,
          paddingLeft: '1.25rem', marginBottom: '2rem',
        }}>
          I secure systems before attackers do —<br />
          through real-time detection, automation, and forensics.
        </p>

        {/* Meta chips */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          {[
            { label: '📍 Mangalagiri, India · Open to Remote' },
            { label: '🎓 SRM University AP — B.Tech CSE (Cybersecurity)' },
          ].map(({ label }) => (
            <span key={label} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: C.muted, letterSpacing: '0.08em',
            }}>{label}</span>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a
            href={config.resumeUrl}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.85rem 2rem',
              background: C.cyan, color: '#0f172a', /* Dark color ensures contrast on both light/dark */
              fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
              fontWeight: 800, letterSpacing: '0.15em',
              textDecoration: 'none', border: 'none',
              borderRadius: '6px',
              boxShadow: '0 4px 14px 0 rgba(0,243,255,0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0,243,255,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0,243,255,0.25)'; }}
          >
            ↓ DOWNLOAD CV
          </a>

          <a
            href={config.linkedin}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'transparent', color: C.cyan,
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              border: `1px solid ${C.cyan}55`,
              transition: 'border-color .2s, color .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.cyan; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.cyan}55`; }}
          >
            LINKEDIN ↗
          </a>

          <a
            href={config.github}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'transparent', color: C.muted,
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              letterSpacing: '0.15em',
              textDecoration: 'none',
              border: `1px solid ${C.border}`,
              transition: 'all .2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = C.cyan; e.currentTarget.style.borderColor = C.cyan; e.currentTarget.style.boxShadow = `0 0 10px ${C.cyan}40`; }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
          >
            GITHUB ↗
          </a>
        </div>
      </Reveal>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 2. SKILLS — 6 core, grouped by area
// ═══════════════════════════════════════════════════════════════
const CORE_SKILLS = [
  { name: 'SIEM (Splunk / ELK)',   area: 'Blue Team' },
  { name: 'Threat Hunting',        area: 'Blue Team' },
  { name: 'Wireshark — Packet DPI',area: 'Forensics' },
  { name: 'Python Automation',     area: 'Automation' },
  { name: 'Kali Linux / Nmap',     area: 'Red Team'  },
  { name: 'Incident Response',     area: 'Blue Team' },
];

function SkillsSection() {
  return (
    <Section id="r-skills">
      <SectionLabel>Core Skills</SectionLabel>
      <Reveal>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: C.text, marginBottom: '2rem', letterSpacing: '0.08em' }}>
          TECHNICAL SKILLS
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {CORE_SKILLS.map((s, i) => (
            <Reveal key={s.name} delay={i * 60}>
              <div style={{
                padding: '0.9rem 1.1rem',
                background: C.card,
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${C.cyan}`,
                display: 'flex', flexDirection: 'column', gap: '0.3rem',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: C.text }}>{s.name}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem', color: C.muted, letterSpacing: '0.15em' }}>{s.area.toUpperCase()}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 3. PROJECTS — 3 cards, title + 1 sentence + link
// ═══════════════════════════════════════════════════════════════
function ProjectsSection() {
  // Use only first 3 featured projects
  const featured = config.projects.filter(p => p.featured).slice(0, 3);
  const [githubRepos, setGithubRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

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
        el.scrollLeft += 0.5;
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

  useEffect(() => {
    let mounted = true;
    fetch('https://api.github.com/users/sriman676/repos?sort=pushed&per_page=6')
      .then(res => {
        if (!res.ok) throw new Error('API Rate Limit or Error');
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        if (!Array.isArray(data)) {
          console.warn('GitHub API rate limited or returned non-array:', data);
          setLoading(false);
          return;
        }
        const repos = data.filter(r => !r.fork && r.name !== 'sriman676').slice(0, 4).reverse();
        setGithubRepos(repos);
        setLoading(false);
      })
      .catch(err => {
        console.warn('GitHub API fetch failed:', err);
        if (mounted) setLoading(false);
      });
    return () => mounted = false;
  }, []);

  return (
    <Section id="r-projects">
      <SectionLabel>Projects</SectionLabel>
      <Reveal>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: C.text, marginBottom: '2rem', letterSpacing: '0.08em' }}>
          RECENT PROJECTS
        </h2>
      </Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {featured.map((p, i) => (
          <Reveal key={p.id} delay={i * 80}>
            <div style={{
              padding: '1.25rem 1.5rem',
              background: C.card,
              border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${C.violet}`,
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, color: C.text, marginBottom: '0.4rem' }}>
                   {p.title}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: C.muted, lineHeight: 1.6, maxWidth: 520 }}>
                  {p.result}
                </div>
                {/* Stack tags */}
                {p.keywords && (
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                    {p.keywords.slice(0, 3).map(k => (
                      <span key={k} style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.45rem',
                        padding: '0.2rem 0.5rem',
                        border: `1px solid ${C.violet}44`,
                        color: C.muted, letterSpacing: '0.1em',
                      }}>{k}</span>
                    ))}
                  </div>
                )}
              </div>
              {p.github && (
                <a
                  href={p.github}
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                    color: C.violet, letterSpacing: '0.15em',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    padding: '0.4rem 0.75rem',
                    border: `1px solid ${C.violet}44`,
                    transition: 'border-color .2s, color .2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.violet; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.violet}44`; e.currentTarget.style.color = C.violet; }}
                >
                  VIEW ↗
                </a>
              )}
            </div>
          </Reveal>
        ))}

        {/* GitHub Live Feed */}
        {(!loading && githubRepos.length > 0) && (
          <Reveal delay={200}>
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: C.cyan, marginBottom: '1rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                // RECENT OPEN SOURCE
              </h3>
              <div 
                ref={scrollRef}
                className="hide-scrollbar"
                style={{ 
                  display: 'flex', 
                  flexWrap: 'nowrap', 
                  overflowX: 'auto', 
                  gap: '1rem', 
                  paddingBottom: '1rem',
                  scrollBehavior: 'auto',
                  scrollSnapType: 'none',
                }}
              >
                {githubRepos.map((repo, i) => (
                  <Reveal key={repo.id} delay={i * 50}>
                    <div style={{
                      padding: '1rem',
                      background: C.card,
                      border: `1px solid ${C.border}`,
                      borderLeft: `2px solid ${C.green}`,
                      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                      height: '100%',
                      minWidth: '260px',
                      flex: '0 0 auto',
                      scrollSnapAlign: 'start'
                    }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800, color: C.text, marginBottom: '0.4rem' }}>
                          {repo.name}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: C.muted, lineHeight: 1.5, marginBottom: '1rem' }}>
                          {repo.description || 'No description provided.'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <div style={{ display: 'flex', gap: '0.75rem', fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: C.muted }}>
                           {repo.language && <span style={{ color: C.cyan }}>{repo.language}</span>}
                           <span>★ {repo.stargazers_count}</span>
                         </div>
                         <a
                           href={repo.html_url}
                           target="_blank" rel="noopener noreferrer"
                           style={{
                             fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                             color: C.green, letterSpacing: '0.15em',
                             textDecoration: 'none', whiteSpace: 'nowrap',
                             padding: '0.2rem 0.5rem',
                             border: `1px solid ${C.green}44`,
                             transition: 'background .2s, color .2s',
                           }}
                           onMouseEnter={e => { e.currentTarget.style.background = `${C.green}22`; }}
                           onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                         >
                           ↗
                         </a>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// NEW: TIMELINE (Experience & Education)
// ═══════════════════════════════════════════════════════════════
function TimelineSection() {
  const sorted = config.timeline || [];

  return (
    <Section id="r-timeline">
      <SectionLabel>Background</SectionLabel>
      <Reveal>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: C.text, marginBottom: '2rem', letterSpacing: '0.08em' }}>
          EXPERIENCE & EDUCATION
        </h2>
      </Reveal>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
        {/* Vertical line passing through */}
        <div style={{ position: 'absolute', left: '11px', top: 0, bottom: 0, width: '2px', background: C.border }} />

        {sorted.map((item, i) => (
          <Reveal key={i} delay={i * 80}>
            <div style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
              {/* Timeline Dot */}
              <div style={{
                width: 24, height: 24, borderRadius: '50%', background: C.card,
                border: `2px solid ${item.type === 'education' ? C.cyan : C.violet}`,
                zIndex: 1, flexShrink: 0, marginTop: '0.1rem'
              }} />
              {/* Content */}
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: C.cyan, letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  {item.year}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: '0.15rem' }}>
                  {item.role}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: C.muted, marginBottom: '0.6rem' }}>
                  {item.org}
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: C.muted, lineHeight: 1.6, maxWidth: 600 }}>
                  {item.detail}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 4. CERTS — compact 2-col grid
// ═══════════════════════════════════════════════════════════════
function CertsSection() {
  return (
    <Section id="r-certs">
      <SectionLabel>Credentials</SectionLabel>
      <Reveal>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: C.text, marginBottom: '2rem', letterSpacing: '0.08em' }}>
          VERIFIED CERTS
        </h2>
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
        {config.certifications.map((c, i) => (
          <Reveal key={c.name} delay={i * 60}>
            <a
              href={c.verifyUrl}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'block',
                padding: '1rem 1.25rem',
                background: C.card,
                border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${c.color || C.cyan}`,
                textDecoration: 'none', transition: 'border-color .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.color || C.cyan; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.borderLeftColor = c.color || C.cyan; }}
            >
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: '0.3rem', lineHeight: 1.3 }}>
                {c.name}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem', color: C.muted, letterSpacing: '0.15em' }}>
                {c.issuer} · {c.platform} · VERIFY ↗
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// 5. CONTACT — single clear CTA
// ═══════════════════════════════════════════════════════════════
function ContactSection() {
  const email = `${config.emailUser}@${config.emailDomain}`;
  return (
    <Section id="r-contact" style={{ border: 'none', paddingBottom: '6rem' }}>
      <SectionLabel>Contact</SectionLabel>
      <Reveal>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, color: C.text, marginBottom: '0.75rem', letterSpacing: '0.08em' }}>
          LET'S TALK
        </h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: C.muted, marginBottom: '2rem', lineHeight: 1.7 }}>
          Open to internship and full-time roles in cybersecurity.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <a
            href={`mailto:${email}`}
            style={{
              padding: '0.75rem 1.5rem',
              background: C.cyan, color: '#050810',
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem',
              fontWeight: 700, letterSpacing: '0.15em',
              textDecoration: 'none',
              transition: 'opacity .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            EMAIL ME
          </a>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: C.muted }}>
            {email}
          </span>
        </div>
      </Reveal>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT EXPORT
// ═══════════════════════════════════════════════════════════════
export default function RecruiterView() {
  return (
    <div style={{ background: 'var(--c-void)', minHeight: '100vh', color: C.text, transition: 'background 0.3s, color 0.3s' }}>
      <HeroSection />
      <SkillsSection />
      <TimelineSection />
      <ProjectsSection />
      <CertsSection />
      <ContactSection />
    </div>
  );
}
