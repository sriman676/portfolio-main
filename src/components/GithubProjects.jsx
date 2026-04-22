import React from 'react';
import { fetchGithubRepos } from '../lib/github';

/**
 * GithubProjects - Async Server Component
 * Fetches and renders a list of GitHub repository cards.
 */
export default async function GithubProjects() {
  const repos = await fetchGithubRepos();

  if (!repos || repos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 opacity-60">
        <p className="font-mono text-sm uppercase tracking-widest text-cyan-400">
          [!] CACHE_MISFETCH: OFFLINE_MODE_ACTIVE
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <a 
          key={repo.id}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden rounded-sm border border-cyan-500/10 bg-cyan-950/10 p-5 transition-all hover:border-cyan-400/40 hover:bg-cyan-900/20"
        >
          {/* Glassmorphic Glow */}
          <div className="absolute -inset-10 opacity-0 transition-opacity duration-500 group-hover:opacity-20"
               style={{ 
                 background: 'radial-gradient(circle, rgba(0,243,255,0.15) 0%, transparent 70%)',
                 pointerEvents: 'none'
               }} 
          />

          <div className="relative z-10">
            <h3 className="mb-2 font-mono text-xs font-bold uppercase tracking-widest text-cyan-100 group-hover:text-cyan-300">
              {repo.name}
            </h3>
            
            <p className="mb-6 h-12 overflow-hidden text-ellipsis font-mono text-[10px] leading-relaxed text-cyan-400/70 group-hover:text-cyan-400/90">
              {repo.description}
            </p>

            <div className="flex items-center justify-between border-t border-cyan-500/10 pt-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-mono text-[9px] text-cyan-500/60">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                  {repo.language}
                </span>
                <span className="flex items-center gap-1 font-mono text-[9px] text-yellow-500/60">
                  ⭐ {repo.stars}
                </span>
              </div>
              
              <div className="text-[10px] font-bold text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                VIEW_SOURCE ↗
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
