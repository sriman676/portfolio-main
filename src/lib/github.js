import { config } from '../portfolioConfig';

/**
 * lib/github.js — Server-side GitHub data fetching
 * Fetches live repos + normalises to a consistent shape the UI expects.
 * Field map:  { id, name, description, url (clickable), stars, language, updatedAt }
 */

const FALLBACK = config.projects.map(p => ({
  id: p.id,
  name: p.title,
  description: p.subtitle || p.problem || 'Cybersecurity Operations & Tactical Infrastructure',
  url: p.github || `https://github.com/${config.githubUsername}`,
  stars: 0,
  language: p.stack ? p.stack[0] : 'Python',
  updatedAt: new Date().toISOString(),
}));

// Intelligent auto-description when GitHub repo has none
function autoDesc(name, lang) {
  const n = name.toLowerCase().replace(/[-_]/g, ' ');
  if (n.includes('soc'))                       return 'Security Operations Center tooling and SIEM automation.';
  if (n.includes('portfolio'))                 return 'Quantum-themed immersive 3D cybersecurity portfolio.';
  if (n.includes('caption') || n.includes('image')) return 'AI-powered image captioning and visual recognition.';
  if (n.includes('humanizer'))                 return 'Converts AI-generated text to natural human writing.';
  if (n.includes('trust'))                     return 'Zero-trust network security architecture.';
  if (n.includes('farm'))                      return 'Farm-to-home e-commerce platform.';
  if (n.includes('sim'))                       return 'Network attack simulation and defence testing.';
  if (lang === 'Python')                       return 'Python-based automation and security scripting tool.';
  if (lang === 'JavaScript' || lang === 'TypeScript') return 'Full-stack web application with security-first design.';
  if (lang === 'C++' || lang === 'C')          return 'Systems-level security and network analysis tool.';
  return 'Open-source security tool — see repository for details.';
}

export async function fetchGithubRepos(username = config.githubUsername) {
  const apiUrl = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=20&type=public`;

  try {
    const res = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'SrimanRutvik-Portfolio/2.0',
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      // Next.js ISR: revalidate every 60 minutes
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[github] API returned ${res.status} — using fallback`);
      return FALLBACK;
    }

    const raw = await res.json();
    if (!Array.isArray(raw)) return FALLBACK;

    const repos = raw
      .filter(r => !r.fork && !r.private)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 12)
      .map(r => ({
        id: r.id,
        name: r.name,
        // Use curatedproject description if available, otherwise auto-generate
        description:
          r.description ||
          config.projects.find(
            p =>
              p.title.toLowerCase() === r.name.toLowerCase() ||
              p.id.toLowerCase() === r.name.toLowerCase()
          )?.subtitle ||
          autoDesc(r.name, r.language),
        url: r.html_url,          // ← actual GitHub repo link for click-through
        stars: r.stargazers_count,
        language: r.language || 'Code',
        updatedAt: r.updated_at,
        topics: (r.topics || []).slice(0, 4),
      }));

    return repos.length > 0 ? repos : FALLBACK;
  } catch (err) {
    console.error('[github] fetch error:', err?.message);
    return FALLBACK;
  }
}
